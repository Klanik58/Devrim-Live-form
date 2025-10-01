
import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';

const ForumPage: React.FC<{ categoryId: number }> = ({ categoryId }) => {
    const { t, state, user, navigate, addPost, getUserById, getForumCategoryData, formatDate, generateTopicWithAi } = useAppContext();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isAiGenerating, setIsAiGenerating] = useState(false);

    const category = getForumCategoryData().find(c => c.id === categoryId);
    const posts = state.posts.filter(p => p.categoryId === categoryId);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim() && content.trim()) {
            addPost(title, content, categoryId);
            setTitle('');
            setContent('');
        }
    }
    
    const handleAiGenerate = async () => {
        setIsAiGenerating(true);
        try {
            const result = await generateTopicWithAi(categoryId);
            if (result) {
                setTitle(result.title);
                setContent(result.content);
            }
        } catch (error) {
            console.error("Failed to generate topic with AI", error);
        } finally {
            setIsAiGenerating(false);
        }
    };


    if (!category) {
        return <div className="text-center py-10">{t('category_not_found')}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
                <div className="bg-gray-700/50 p-4 border-b border-gray-700 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-white">{category.title}</h2>
                        <p className="text-sm text-gray-400">{category.description}</p>
                    </div>
                </div>
                <div className="space-y-px">
                   {posts.length > 0 ? posts.map(post => {
                       const author = getUserById(post.userId);
                       const commentsCount = state.comments.filter(c => c.postId === post.id).length;
                       return (
                        <div key={post.id} className="group bg-gray-800/50 hover:bg-gray-700/50 transition-colors duration-200 p-4 flex items-center space-x-4">
                           <div className="flex-shrink-0">
                                <img src={`https://i.pravatar.cc/48?u=${author?.email}`} alt={author?.username} className="w-12 h-12 rounded-full" />
                           </div>
                           <div className="flex-grow">
                               <a href="#" onClick={(e) => { e.preventDefault(); navigate('topic', { id: post.id })}} className="font-bold text-lg text-white hover:text-indigo-400 transition-colors">{post.title}</a>
                               <p className="text-sm text-gray-400">
                                   {t('author')}: <span className="font-semibold">{author?.username}{author?.isAI && <span className="text-cyan-400 font-bold"> [BOT]</span>}</span>, {formatDate(post.createdAt)}
                                </p>
                           </div>
                           <div className="hidden md:block text-center w-24 flex-shrink-0">
                                <div className="font-semibold text-white">{commentsCount}</div>
                                <div className="text-xs text-gray-500">{t('replies')}</div>
                           </div>
                        </div>
                       )
                   }) : <p className="p-4 text-gray-400">{t('no_posts_yet')}</p>}
                </div>

                {user && (
                    <div className="p-4 bg-gray-700/50 border-t border-gray-700">
                        <form onSubmit={handleSubmit}>
                            <h3 className="text-xl font-bold text-white mb-4">{t('create_new_topic')}</h3>
                            <input
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder={t('topic_title')}
                                className="bg-gray-700 text-white placeholder-gray-500 border border-gray-600 rounded w-full py-2 px-3 mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                            <textarea
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                placeholder={t('your_message')}
                                className="bg-gray-700 text-white placeholder-gray-500 border border-gray-600 rounded w-full py-2 px-3 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                rows={4}
                                required
                            ></textarea>
                            <div className="flex items-center space-x-2">
                                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors">
                                    {t('submit_topic')}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAiGenerate}
                                    disabled={isAiGenerating}
                                    className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors disabled:opacity-50 disabled:cursor-wait"
                                >
                                    {isAiGenerating ? t('generating') : t('generate_with_ai')}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForumPage;