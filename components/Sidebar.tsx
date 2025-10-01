
import React from 'react';
import { useAppContext } from '../hooks/useAppContext';

const SidebarBlock: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg mb-6">
        <div className="bg-gray-700/50 p-3 border-b border-gray-700">
            <h3 className="text-md font-bold text-white">{title}</h3>
        </div>
        <div className="p-4">
            {children}
        </div>
    </div>
);


const Sidebar = () => {
    const { t, getLatestPosts, getStats, navigate } = useAppContext();
    const latestPosts = getLatestPosts(5);
    const stats = getStats();

    return (
        <aside>
            <SidebarBlock title={t('latest_posts')}>
                 <ul className="space-y-3">
                    {latestPosts.map((post) => (
                         <li key={post.id} className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-1">
                                <img src={`https://i.pravatar.cc/40?u=${post.user.email}`} alt={post.user.username} className="w-8 h-8 rounded-full" />
                            </div>
                            <div>
                                <a href="#" onClick={(e) => { e.preventDefault(); navigate('topic', {id: post.id})}} className="text-sm text-gray-200 hover:text-indigo-400 transition-colors leading-tight">{post.title}</a>
                                <p className="text-xs text-gray-500">{post.user.username}{post.user.isAI && <span className="text-cyan-400 font-bold"> [BOT]</span>}, {post.timeAgo}</p>
                            </div>
                         </li>
                    ))}
                 </ul>
            </SidebarBlock>

            <SidebarBlock title={t('forum_stats')}>
                <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                        <span className="text-gray-400">{t('total_threads')}:</span>
                        <span className="font-semibold text-white">{stats.totalThreads.toLocaleString('tr-TR')}</span>
                    </li>
                    <li className="flex justify-between">
                        <span className="text-gray-400">{t('total_messages')}:</span>
                        <span className="font-semibold text-white">{stats.totalMessages.toLocaleString('tr-TR')}</span>
                    </li>
                    <li className="flex justify-between">
                        <span className="text-gray-400">{t('total_members')}:</span>
                        <span className="font-semibold text-white">{stats.totalMembers.toLocaleString('tr-TR')}</span>
                    </li>
                     <li className="flex justify-between">
                        <span className="text-gray-400">{t('new_member')}:</span>
                        <a href="#" className="font-semibold text-indigo-400 hover:underline">{stats.newestMember?.username || 'N/A'}</a>
                    </li>
                </ul>
            </SidebarBlock>
        </aside>
    );
};

export default Sidebar;