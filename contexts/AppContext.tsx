import React, { createContext, useState, useCallback, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
// Fix: Corrected import path to point to the index file inside the types directory.
import type { AppState, AuthenticatedUser, Lang, Page, User, Post, Comment, ForumCategoryData } from '../types/index';
import { translations } from '../locales';
import { calculateLevelForXp, XP_FOR_COMMENT, XP_FOR_POST, XP_FOR_LIKE, COINS_FOR_COMMENT, COINS_FOR_POST, COINS_FOR_LIKE } from '../utils/leveling';
import { formatDate as formatDateUtil } from '../utils/formatters';
import { loadState, saveState } from '../services/stateService';
import { triggerAiAction } from '../services/aiService';
import * as selectors from '../selectors';
// Fix: Imported the missing 'RANKS' constant to resolve a reference error.
import { getRankByKey, getRankIndex, getNextRank, RANKS } from '../utils/ranks';
import { differenceInHours } from 'date-fns';

type NotificationType = 'success' | 'error' | 'info';

export interface AppContextType {
    lang: Lang;
    setLang: (lang: Lang) => void;
    t: (key: string, params?: Record<string, string | number>) => string;
    user: AuthenticatedUser | null;
    login: (email: string, pass: string) => boolean;
    register: (username: string, email: string, pass:string) => boolean;
    logout: () => void;
    page: Page;
    navigate: (name: string, params?: Record<string, any>) => void;
    state: AppState;
    getForumCategoryData: () => (ForumCategoryData & { threads: number; messages: number; lastPost: any | null; })[];
    getLatestPosts: (count: number) => any[];
    getStats: () => { totalThreads: number; totalMessages: number; totalMembers: number; newestMember: User | null };
    getUserById: (id: number) => User | undefined;
    getPostById: (id: number) => Post | undefined;
    getCommentsByPostId: (id: number) => Comment[];
    addPost: (title: string, content: string, categoryId: number) => void;
    addComment: (content: string, postId: number) => void;
    toggleLike: (contentId: number, contentType: 'post' | 'comment') => void;
    formatDate: (dateString: string) => string;
    findUserByEmail: (email: string) => User | undefined;
    generateTopicWithAi: (categoryId: number) => Promise<{ title: string; content: string } | null>;
    isDailyRewardAvailable: boolean;
    claimDailyReward: () => void;
    purchaseRank: (rankKey: string) => { success: boolean; message: string };
    notification: { message: string; type: NotificationType; };
    showNotification: (message: string, type: NotificationType) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [lang, setLang] = useState<Lang>('tr');
    const [user, setUser] = useState<AuthenticatedUser | null>(null);
    const [page, setPage] = useState<Page>({ name: 'home' });
    const [state, setState] = useState<AppState>(loadState);
    const [notification, setNotification] = useState({ message: '', type: 'info' as NotificationType });
    
    const aiTimeoutRef = useRef<number | null>(null);
    const notificationTimeoutRef = useRef<number | null>(null);
    const isAiActing = useRef(false);
    
    const ai = useRef(new GoogleGenAI({ apiKey: process.env.API_KEY as string }));

    const showNotification = (message: string, type: NotificationType) => {
        if (notificationTimeoutRef.current) clearTimeout(notificationTimeoutRef.current);
        setNotification({ message, type });
        notificationTimeoutRef.current = window.setTimeout(() => {
            setNotification({ message: '', type: 'info' });
        }, 3000);
    };

    useEffect(() => {
        saveState(state);
    }, [state]);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('devrim_user');
            if (storedUser) {
                const loggedInUser: AuthenticatedUser = JSON.parse(storedUser);
                const fullUser = state.users.find(u => u.id === loggedInUser.id);
                if(fullUser){
                     setUser({
                        ...loggedInUser,
                        level: calculateLevelForXp(fullUser.xp).level,
                        coins: fullUser.coins,
                        rank: fullUser.rank
                    });
                } else {
                    localStorage.removeItem('devrim_user');
                }
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
        }
    }, []);

    const t = useCallback((key: string, params?: Record<string, string | number>) => {
        let translation = translations[lang][key] || key;
        if (params) {
            Object.entries(params).forEach(([paramKey, paramValue]) => {
                translation = translation.replace(`{${paramKey}}`, String(paramValue));
            });
        }
        return translation;
    }, [lang]);
    
    const formatDate = useCallback((dateString: string) => formatDateUtil(dateString, lang), [lang]);
    const navigate = (name: string, params?: Record<string, any>) => setPage({ name, params });

    const login = (email: string, pass: string): boolean => {
        const foundUser = state.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === pass);
        if (foundUser) {
            const authUser: AuthenticatedUser = {
                id: foundUser.id, username: foundUser.username, email: foundUser.email,
                level: calculateLevelForXp(foundUser.xp).level, isAI: foundUser.isAI,
                coins: foundUser.coins, rank: foundUser.rank
            };
            localStorage.setItem('devrim_user', JSON.stringify(authUser));
            setUser(authUser);
            navigate('home');
            return true;
        }
        return false;
    };

    const internalRegister = (username: string, email: string, pass: string | null, isAi: boolean = false): User => {
        const newUser: User = {
            id: Date.now(),
            username,
            email,
            xp: 0,
            level: 1,
            isAI: isAi,
            createdAt: new Date().toISOString(),
            password: pass || Math.random().toString(36).slice(-8),
            coins: 100, // Starting coins
            rank: RANKS[0].key,
            lastDailyReward: null
        };
        
        setState(prevState => ({ ...prevState, users: [...prevState.users, newUser]}));
        return newUser;
    };

    const register = (username: string, email: string, pass: string): boolean => {
        const userExists = state.users.some(u => u.email.toLowerCase() === email.toLowerCase() || u.username.toLowerCase() === username.toLowerCase());
        if (userExists) return false;

        const newUser = internalRegister(username, email, pass, false);
        
        const authUser: AuthenticatedUser = { id: newUser.id, username: newUser.username, email: newUser.email, level: 1, isAI: false, coins: newUser.coins, rank: newUser.rank };
        localStorage.setItem('devrim_user', JSON.stringify(authUser));
        setUser(authUser);
        navigate('home');
        return true;
    };

    const logout = () => {
        localStorage.removeItem('devrim_user');
        setUser(null);
        navigate('home');
    };
    
    const giveReward = (userId: number, xp: number, coins: number) => {
        let updatedUserForSession: AuthenticatedUser | undefined;
        setState(prevState => {
            const newUsers = prevState.users.map(u => {
                if (u.id === userId) {
                    const currentLevel = u.level;
                    const newXp = u.xp + xp;
                    const { level: newLevel } = calculateLevelForXp(newXp);
                    
                    let newCoins = u.coins + coins;
                    // Level up bonus
                    if (newLevel > currentLevel) {
                        newCoins += newLevel * 50; // Bonus coins for leveling up
                    }

                    const updatedUser = { ...u, xp: newXp < 0 ? 0 : newXp, level: newLevel, coins: newCoins };
                    
                    if (user && user.id === userId) {
                        updatedUserForSession = { ...user, level: updatedUser.level, coins: updatedUser.coins, rank: updatedUser.rank };
                    }
                    return updatedUser;
                }
                return u;
            });
            return { ...prevState, users: newUsers };
        });
        if (updatedUserForSession) {
            setUser(updatedUserForSession);
        }
    };

    const internalAddPost = (title: string, content: string, categoryId: number, userId: number, source?: string, sourceUrl?: string) => {
        const newPost: Post = {
            id: Date.now(), title, content, categoryId, userId,
            createdAt: new Date().toISOString(), likes: [], source, sourceUrl
        };
        setState(prevState => ({ ...prevState, posts: [newPost, ...prevState.posts] }));
        giveReward(userId, XP_FOR_POST, COINS_FOR_POST);
    };

    const internalAddComment = (content: string, postId: number, userId: number) => {
        const newComment: Comment = {
            id: Date.now(), content, postId, userId, createdAt: new Date().toISOString(), likes: []
        };
        setState(prevState => ({ ...prevState, comments: [...prevState.comments, newComment] }));
        giveReward(userId, XP_FOR_COMMENT, COINS_FOR_COMMENT);
    };

    const internalToggleLike = (contentId: number, contentType: 'post' | 'comment', likingUserId: number) => {
        setState(prevState => {
            const newState = { ...prevState };
            let authorId: number | undefined;
            const contentLikes = (item: Post | Comment) => {
                const hasLiked = item.likes.includes(likingUserId);
                return hasLiked ? item.likes.filter(id => id !== likingUserId) : [...item.likes, likingUserId];
            };

            if (contentType === 'post') {
                const post = prevState.posts.find(p => p.id === contentId);
                if (post) authorId = post.userId;
                newState.posts = prevState.posts.map(p => p.id === contentId ? { ...p, likes: contentLikes(p) } : p);
            } else {
                const comment = prevState.comments.find(c => c.id === contentId);
                if (comment) authorId = comment.userId;
                newState.comments = prevState.comments.map(c => c.id === contentId ? { ...c, likes: contentLikes(c) } : c);
            }
            
            if (authorId && authorId !== likingUserId) {
                const content = contentType === 'post' ? prevState.posts.find(p=>p.id===contentId) : prevState.comments.find(c=>c.id===contentId);
                if(content){
                    const hasLiked = content.likes.includes(likingUserId);
                    giveReward(authorId, hasLiked ? -XP_FOR_LIKE : XP_FOR_LIKE, hasLiked ? -COINS_FOR_LIKE : COINS_FOR_LIKE);
                }
            }
            return newState;
        });
    };
    
    const autonomousAiTrigger = useCallback(() => {
        if (isAiActing.current) return;
        isAiActing.current = true;
        
        triggerAiAction(
            ai.current, state, lang, selectors.getForumCategoryData(state, t, lang), t,
            internalAddPost, internalAddComment, internalToggleLike,
            (username, email) => internalRegister(username, email, null, true)
        ).finally(() => {
            isAiActing.current = false;
        });
    }, [state, lang, t]);

    useEffect(() => {
        const scheduleNextAiAction = () => {
             if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
            const randomInterval = Math.random() * 30000 + 15000; // 15-45 seconds
            aiTimeoutRef.current = window.setTimeout(() => {
                autonomousAiTrigger();
                scheduleNextAiAction();
            }, randomInterval);
        };
        scheduleNextAiAction();
        return () => { if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current) };
    }, [autonomousAiTrigger]);

    const generateTopicWithAi = async (categoryId: number): Promise<{ title: string; content: string } | null> => {
        const category = selectors.getForumCategoryData(state, t, lang).find(c => c.id === categoryId);
        if (!category) {
            console.error("AI Generation: Category not found");
            return null;
        }

        try {
            const prompt = `Generate a short, engaging forum topic title and a brief starting post about a theme related to '${category.title}'. The topic should be suitable for a gaming and tech community. You can ask a question, state an opinion, or share news. Return a JSON object with 'title' and 'content' keys. Example: {"title": "New Update!", "content": "What do you think?"}. The response must be in ${lang === 'tr' ? 'Turkish' : 'English'}.`;
            
            const response = await ai.current.models.generateContent({
                model: 'gemini-2.5-flash', 
                contents: prompt, 
                config: { responseMimeType: 'application/json' }
            });
            const data = JSON.parse(response.text.trim());
            
            if (data.title && data.content) {
                return { title: data.title, content: data.content };
            }
            return null;
        } catch (error) {
            console.error("AI topic generation failed:", error);
            return null;
        }
    };
    
    // --- Economy & Rank System ---
    const fullUser = user ? state.users.find(u => u.id === user.id) : null;
    const isDailyRewardAvailable = !fullUser?.lastDailyReward || differenceInHours(new Date(), new Date(fullUser.lastDailyReward)) >= 24;

    const claimDailyReward = () => {
        if (!user || !isDailyRewardAvailable) return;
        const reward = { xp: 20, coins: 50 };
        giveReward(user.id, reward.xp, reward.coins);
        setState(s => ({ ...s, users: s.users.map(u => u.id === user.id ? { ...u, lastDailyReward: new Date().toISOString() } : u) }));
        showNotification(t('reward_claimed', { coins: reward.coins, xp: reward.xp }), 'success');
    };
    
    const purchaseRank = (rankKey: string): { success: boolean, message: string } => {
        const currentUser = state.users.find(u => u.id === user?.id);
        if (!currentUser) return { success: false, message: "User not found" };

        const targetRank = getRankByKey(rankKey);
        if (!targetRank) return { success: false, message: "Rank not found" };

        const nextRank = getNextRank(currentUser.rank);
        if (targetRank.key !== nextRank?.key) {
            return { success: false, message: "Invalid rank sequence" };
        }

        if (currentUser.level < targetRank.level) {
            return { success: false, message: t('level_too_low') };
        }

        if (currentUser.coins < targetRank.cost) {
            return { success: false, message: t('not_enough_coins') };
        }

        // All checks passed, update user
        let updatedUserForSession: AuthenticatedUser | undefined;
        setState(s => ({
            ...s,
            users: s.users.map(u => {
                if (u.id === currentUser.id) {
                    const updatedUser = { ...u, rank: targetRank.key, coins: u.coins - targetRank.cost };
                     if (user) {
                        updatedUserForSession = { ...user, rank: updatedUser.rank, coins: updatedUser.coins };
                    }
                    return updatedUser;
                }
                return u;
            })
        }));
         if (updatedUserForSession) {
            setUser(updatedUserForSession);
        }
        return { success: true, message: t('rank_purchased') };
    };

    const value: AppContextType = {
        lang, setLang, t, user, login, register, logout, page, navigate, state,
        getForumCategoryData: useCallback(() => selectors.getForumCategoryData(state, t, lang), [state, t, lang]),
        getLatestPosts: useCallback((count: number) => selectors.getLatestPosts(state, count, lang), [state, lang]),
        getStats: useCallback(() => selectors.getStats(state), [state]),
        getUserById: (id: number) => state.users.find(u => u.id === id),
        getPostById: (id: number) => state.posts.find(p => p.id === id),
        getCommentsByPostId: (id: number) => state.comments.filter(c => c.postId === id).sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
        addPost: (title, content, categoryId) => { if(user) internalAddPost(title, content, categoryId, user.id); },
        addComment: (content, postId) => { if(user) internalAddComment(content, postId, user.id); },
        toggleLike: (contentId, contentType) => { if(user) internalToggleLike(contentId, contentType, user.id); },
        formatDate,
        findUserByEmail: (email: string) => state.users.find(u => u.email.toLowerCase() === email.toLowerCase()),
        generateTopicWithAi,
        isDailyRewardAvailable,
        claimDailyReward,
        purchaseRank,
        notification,
        showNotification,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};