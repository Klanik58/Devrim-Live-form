import React from 'react';
import ForumCategory from '../components/ForumCategory';
import Sidebar from '../components/Sidebar';
import { useAppContext } from '../hooks/useAppContext';

const HomePage = () => {
    const { t, getForumCategoryData } = useAppContext();
    const categories = getForumCategoryData();
    
    return (
        <main className="container mx-auto px-4 py-8">
            <div className="lg:flex lg:space-x-8">
                <div className="lg:w-3/4">
                    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
                        <div className="bg-gray-700/50 p-4 border-b border-gray-700">
                            <h2 className="text-xl font-bold text-white">{t('forum_categories')}</h2>
                        </div>
                        <div className="space-y-2 p-2">
                            {categories.map(category => (
                                <ForumCategory key={category.id} category={category} />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="lg:w-1/4 mt-8 lg:mt-0">
                    <Sidebar />
                </div>
            </div>
        </main>
    )
}

export default HomePage;
