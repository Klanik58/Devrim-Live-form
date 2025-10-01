import React from 'react';
import { useAppContext } from '../hooks/useAppContext';

const LeaderboardPage = () => {
    const { t, state } = useAppContext();

    const sortedUsers = [...state.users].sort((a, b) => b.xp - a.xp);

    const getRankColor = (rankKey: string) => {
        switch (rankKey) {
            case 'rank_legend': return 'text-red-400 border-red-400';
            case 'rank_master': return 'text-purple-400 border-purple-400';
            case 'rank_senior_member': return 'text-cyan-400 border-cyan-400';
            default: return 'text-gray-400 border-gray-400';
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
                <div className="bg-gray-700/50 p-4 border-b border-gray-700">
                    <h2 className="text-2xl font-bold text-white">{t('leaderboard_title')}</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-700/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{t('rank')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{t('user')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{t('rank')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{t('level')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{t('xp_points')}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-800 divide-y divide-gray-700">
                            {sortedUsers.map((user, index) => (
                                <tr key={user.id} className="hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`text-lg font-bold ${index < 3 ? 'text-indigo-400' : 'text-white'}`}>{index + 1}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <img className="h-10 w-10 rounded-full" src={`https://i.pravatar.cc/40?u=${user.email}`} alt="" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-white">{user.username} {user.isAI && <span className="text-cyan-400 font-bold text-xs">[BOT]</span>}</div>
                                                <div className="text-sm text-gray-400">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                     <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getRankColor(user.rank)}`}>
                                            {t(user.rank)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-800 text-green-200">
                                            {user.level}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-semibold">
                                        {user.xp.toLocaleString('tr-TR')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LeaderboardPage;