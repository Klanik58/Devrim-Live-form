
import { GoogleGenAI } from "@google/genai";
// Fix: Corrected import path to point to the index file inside the types directory.
import type { AppState, User, ForumCategoryData, Lang } from '../types/index';
import { getRandomWikipediaArticle } from './wikipediaService';

const generateUniqueUsername = (existingUsers: User[]): string => {
    const adjectives = ["Hızlı", "Gizemli", "Cesur", "Sessiz", "Parlak", "Gölge", "Kızıl"];
    const nouns = ["Savaşçı", "Gezgin", "Avcı", "Büyücü", "Kaşif", "Pilot", "Ninja"];
    
    let username = '';
    do {
        const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
        const noun = nouns[Math.floor(Math.random() * nouns.length)];
        const num = Math.floor(Math.random() * 900) + 100;
        username = `${adj}${noun}${num}`;
    } while (existingUsers.some(u => u.username.toLowerCase() === username.toLowerCase()));

    return username;
};

export const triggerAiAction = async (
    ai: GoogleGenAI,
    state: AppState,
    lang: Lang,
    forumCategories: ForumCategoryData[],
    t: (key: string, params?: Record<string, string | number>) => string,
    internalAddPost: (title: string, content: string, categoryId: number, userId: number, source?: string, sourceUrl?: string) => void,
    internalAddComment: (content: string, postId: number, userId: number) => void,
    internalToggleLike: (contentId: number, contentType: 'post' | 'comment', likingUserId: number) => void,
    internalRegister: (username: string, email: string) => void,
) => {
    try {
        const aiUsers = state.users.filter(u => u.isAI);
        if (aiUsers.length === 0) return;
        const randomAi = aiUsers[Math.floor(Math.random() * aiUsers.length)];
        const persona = randomAi.persona || 'a helpful forum member';

        const possibleActions = ['createComment', 'likeContent', 'createTopic', 'registerNewUser', 'createWikipediaTopic'];
        const weights = [0.40, 0.25, 0.15, 0.05, 0.15]; // Focus on commenting, liking, and adding content
        
        let cumulativeWeight = 0;
        const weightedRandom = Math.random();
        let chosenAction = possibleActions[0];

        for(let i=0; i < possibleActions.length; i++){
            cumulativeWeight += weights[i];
            if(weightedRandom < cumulativeWeight) {
                chosenAction = possibleActions[i];
                break;
            }
        }

        if (state.posts.length < 3) { // Prioritize content creation if forum is empty
            chosenAction = Math.random() > 0.5 ? 'createTopic' : 'createWikipediaTopic';
        }
        if (state.posts.length === 0 && !chosenAction.includes('Topic')) {
             return; 
        }

        if (chosenAction === 'createTopic') {
            const randomCategory = forumCategories[Math.floor(Math.random() * forumCategories.length)];
            const prompt = `You are an AI forum member with this persona: "${persona}". Generate a short, engaging forum topic title and a brief starting post about a theme related to '${t(randomCategory.title)}'. The topic should be suitable for a gaming and tech community and reflect your persona. You can ask a question, state an opinion, or share news. Return a JSON object with 'title' and 'content' keys. Example: {"title": "New Update!", "content": "What do you think?"}. The response must be in ${lang === 'tr' ? 'Turkish' : 'English'}.`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash', contents: prompt, config: { responseMimeType: 'application/json' }
            });
            const data = JSON.parse(response.text.trim());
            if (data.title && data.content) {
                internalAddPost(data.title, data.content, randomCategory.id, randomAi.id);
            }

        } else if (chosenAction === 'createWikipediaTopic') {
            const article = await getRandomWikipediaArticle(lang);
            if (article) {
                const randomCategory = forumCategories[Math.floor(Math.random() * forumCategories.length)];
                const prompt = `You are a helpful forum bot with this persona: "${persona}". You've found an interesting Wikipedia article titled "${article.title}". The summary is: "${article.extract}". Rewrite this summary into a short, engaging forum post to spark discussion. Make it sound natural and in-character for your persona, not just a copy-paste. Return a JSON object with 'title' and 'content' keys. The post must be in ${lang === 'tr' ? 'Turkish' : 'English'}.`;
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash', contents: prompt, config: { responseMimeType: 'application/json' }
                });
                const data = JSON.parse(response.text.trim());
                 if (data.title && data.content) {
                    internalAddPost(data.title, data.content, randomCategory.id, randomAi.id, 'Wikipedia', article.content_urls.desktop.page);
                }
            }

        } else if (chosenAction === 'createComment' && state.posts.length > 0) {
            const randomPost = state.posts[Math.floor(Math.random() * state.posts.length)];
            const lastComments = state.comments.filter(c => c.postId === randomPost.id).slice(-3).map(c => `A user wrote: ${c.content}`).join('\n');
            const prompt = `You are an AI member of a gaming/tech forum with this persona: "${persona}". A topic is titled "${randomPost.title}" and the content is "${randomPost.content}". ${lastComments ? `Previous comments are:\n${lastComments}` : ''} Write a short, relevant, and natural-sounding comment to add to the discussion, considering the previous comments and your persona. The comment should be just the text, no extra formatting or quotation marks. The comment must be in ${lang === 'tr' ? 'Turkish' : 'English'}.`;

            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            const commentText = response.text.trim();
            if(commentText){
                internalAddComment(commentText, randomPost.id, randomAi.id);
            }
        } else if (chosenAction === 'likeContent') {
             const allContent = [
                ...state.posts.map(p => ({ ...p, type: 'post' as const })),
                ...state.comments.map(c => ({ ...c, type: 'comment' as const }))
            ];
            const contentToLike = allContent.filter(c => c.userId !== randomAi.id && !c.likes.includes(randomAi.id));
            if (contentToLike.length > 0) {
                const randomContent = contentToLike[Math.floor(Math.random() * contentToLike.length)];
                internalToggleLike(randomContent.id, randomContent.type, randomAi.id);
            }
        } else if (chosenAction === 'registerNewUser') {
            const newUsername = generateUniqueUsername(state.users);
            const newEmail = `${newUsername.toLowerCase().replace(/\s/g, '')}@devrim.ai`;
            internalRegister(newUsername, newEmail);
        }
    } catch (error) {
        console.error("AI action failed:", error);
    }
};