
// Fix: Corrected import path to point to the index file inside the types directory.
import type { AppState, ForumCategoryData, LastPostInfo } from './types/index';
import { formatDate } from './utils/formatters';
import { MegaphoneIcon } from './components/icons/MegaphoneIcon';
import { SwordIcon } from './components/icons/SwordIcon';
import { GamepadIcon } from './components/icons/GamepadIcon';
import { CodeIcon } from './components/icons/CodeIcon';
import { ShoppingCartIcon } from './components/icons/ShoppingCartIcon';
import React from 'react';

const FORUM_CATEGORIES_RAW: Omit<ForumCategoryData, 'title' | 'description' | 'icon'>[] = [
    { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }
];

// FIX: Replace JSX syntax with React.createElement to avoid errors in a .ts file.
// The TypeScript compiler interprets JSX tags as type assertions in .ts files.
const getIconForId = (id: number) => {
    switch (id) {
        case 1: return React.createElement(MegaphoneIcon);
        case 2: return React.createElement(SwordIcon);
        case 3: return React.createElement(GamepadIcon);
        case 4: return React.createElement(CodeIcon);
        case 5: return React.createElement(ShoppingCartIcon);
        default: return null;
    }
}

const getCategoryTranslationKeys = (id: number) => {
    switch (id) {
        case 1: return { title: 'cat_announcements_title', description: 'cat_announcements_desc' };
        case 2: return { title: 'cat_metin2_title', description: 'cat_metin2_desc' };
        case 3: return { title: 'cat_knight_title', description: 'cat_knight_desc' };
        case 4: return { title: 'cat_dev_title', description: 'cat_dev_desc' };
        case 5: return { title: 'cat_ecommerce_title', description: 'cat_ecommerce_desc' };
        default: return { title: '', description: '' };
    }
}


export const getForumCategoryData = (state: AppState, t: (key: string) => string, lang: 'tr' | 'en') => {
    const { posts, comments, users } = state;

    return FORUM_CATEGORIES_RAW.map(catRaw => {
        const postsInCategory = posts.filter(p => p.categoryId === catRaw.id);
        const postIdsInCategory = new Set(postsInCategory.map(p => p.id));
        const commentsInPosts = comments.filter(c => postIdsInCategory.has(c.postId));
        
        const messagesCount = postsInCategory.length + commentsInPosts.length;

        const sortedPosts = [...postsInCategory].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        const lastPost = sortedPosts[0];

        let lastPostInfo: LastPostInfo | null = null;
        if (lastPost) {
            const user = users.find(u => u.id === lastPost.userId);
            lastPostInfo = {
                postId: lastPost.id,
                title: lastPost.title,
                user: user?.username || 'Unknown',
                time: formatDate(lastPost.createdAt, lang),
                threadUrl: `#/topic/${lastPost.id}`
            };
        }
        
        const translationKeys = getCategoryTranslationKeys(catRaw.id);

        return {
            ...catRaw,
            icon: getIconForId(catRaw.id),
            title: t(translationKeys.title),
            description: t(translationKeys.description),
            threads: postsInCategory.length,
            messages: messagesCount,
            lastPost: lastPostInfo
        };
    });
};

export const getLatestPosts = (state: AppState, count: number, lang: 'tr' | 'en') => {
    const sortedPosts = [...state.posts].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return sortedPosts.slice(0, count).map(post => {
        const user = state.users.find(u => u.id === post.userId);
        return {
            ...post,
            user: user || { id: -1, username: 'Unknown', email: '', isAI: false, level: 0, xp: 0, createdAt: '' },
            timeAgo: formatDate(post.createdAt, lang)
        };
    });
};

export const getStats = (state: AppState) => {
    const newestUser = [...state.users]
        .filter(u => !u.isAI)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

    return {
        totalThreads: state.posts.length,
        totalMessages: state.posts.length + state.comments.length,
        totalMembers: state.users.length,
        newestMember: newestUser || null
    };
};