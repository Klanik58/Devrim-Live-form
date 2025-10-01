
import React from 'react';
// Fix: Corrected import path to point to the index file inside the types directory.
import type { ForumCategoryData, LastPostInfo } from '../types/index';
import { useAppContext } from '../hooks/useAppContext';

interface ForumCategoryProps {
    category: ForumCategoryData & { threads: number; messages: number; lastPost: LastPostInfo | null; };
}

const ForumCategory: React.FC<ForumCategoryProps> = ({ category }) => {
    const { t, navigate } = useAppContext();
    return (
        <div className="group bg-gray-800/50 hover:bg-gray-700/50 transition-colors duration-200 rounded-lg p-4 flex items-center space-x-4">
            <div className="flex-shrink-0 transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:-rotate-6">
                {category.icon}
            </div>
            <div className="flex-grow">
                <a href="#" onClick={(e) => {e.preventDefault(); navigate('forum', { id: category.id });}} className="font-bold text-lg text-white hover:text-indigo-400 transition-colors">{category.title}</a>
                <p className="text-sm text-gray-400">{category.description}</p>
            </div>
            <div className="hidden md:flex text-center w-32 flex-shrink-0 space-x-6">
                <div>
                    <div className="font-semibold text-white">{category.threads.toLocaleString('tr-TR')}</div>
                    <div className="text-xs text-gray-500">{t('threads')}</div>
                </div>
                <div>
                    <div className="font-semibold text-white">{category.messages.toLocaleString('tr-TR')}</div>
                    <div className="text-xs text-gray-500">{t('messages')}</div>
                </div>
            </div>
            <div className="hidden lg:block text-right w-64 flex-shrink-0">
                {category.lastPost ? (
                    <>
                        <a href="#" onClick={(e) => { e.preventDefault(); navigate('topic', { id: category.lastPost!.postId })}} className="text-sm text-white hover:text-indigo-400 transition-colors truncate block">{category.lastPost.title}</a>
                        <div className="text-xs text-gray-500">
                            <span>{category.lastPost.user}</span>, <span>{category.lastPost.time}</span>
                        </div>
                    </>
                ) : (
                    <div className="text-sm text-gray-500">{t('no_posts_yet')}</div>
                )}
            </div>
        </div>
    );
};

export default ForumCategory;