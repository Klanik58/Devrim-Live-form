import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { calculateLevelForXp } from '../utils/leveling';
import { RANKS, getRankIndex } from '../utils/ranks';
import { CoinIcon } from '../components/icons/CoinIcon';

const ProfilePage = () => {
    const { t, user, navigate, getUserById, purchaseRank, showNotification } = useAppContext();
    const fullUser = user ? getUserById(user.id) : null;

    React.useEffect(() => {
        if (!user) {
            navigate('login');
        }
    }, [user, navigate]);
    
    if (!user || !fullUser) {
        return null; // or a loading spinner
    }

    const { level, progress, nextLevelXp } = calculateLevelForXp(fullUser.xp);
    const currentUserRankIndex = getRankIndex(fullUser.rank);

    const handlePurchase = (rankKey: string) => {
        const result = purchaseRank(rankKey);
        if (result.success) {
            showNotification(t('rank_purchased'), 'success');
        } else {
            showNotification(result.message, 'error');
        }
    };

    const getRankColor = (rankKey: string) => {
        switch (rankKey) {
            case 'rank_legend': return 'text-red-400';
            case 'rank_master': return 'text-purple-400';
            case 'rank_senior_member': return 'text-cyan-400';
            default: return 'text-gray-400';
        }
    }

    return (
        <div className="container mx-auto px-4 py-12 flex justify-center">
            <div className="w-full max-w-3xl">
                 <div className="bg-gray-800 border border-gray-700 shadow-lg rounded-lg overflow-hidden">
                    <div className="p-6 border-b border-gray-700">
                        <h2 className="text-2xl font-bold text-white text-center">{t('profile_page_title')}</h2>
                    </div>
                    <div className="p-8">
                        <div className="flex flex-col sm:flex-row items-center sm:space-x-6 mb-8">
                            <img src={`https://i.pravatar.cc/150?u=${user.email}`} alt="Avatar" className="w-24 h-24 rounded-full border-4 border-gray-600 mb-4 sm:mb-0"/>
                            <div className="text-center sm:text-left">
                                <h3 className="text-3xl font-bold text-white">{user.username}</h3>
                                <p className={`text-xl font-semibold ${getRankColor(fullUser.rank)}`}>{t(fullUser.rank)}</p>
                                <p className="text-md text-gray-400">{user.email}</p>
                            </div>
                            <div className="mt-4 sm:mt-0 sm:ml-auto flex items-center bg-gray-700/50 px-4 py-2 rounded-lg">
                                <CoinIcon className="text-yellow-400 h-8 w-8 mr-2"/>
                                <div>
                                    <span className="text-2xl font-bold text-white">{fullUser.coins.toLocaleString()}</span>
                                    <p className="text-sm text-gray-400">{t('devrim_coin')}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gray-700/50 p-6 rounded-lg mb-8">
                            <h4 className="text-lg font-bold text-white mb-4">{t('level')} {level}</h4>
                            <div className="mb-2">
                                <div className="flex justify-between text-sm text-gray-400 mb-1">
                                    <span>{t('progress_to_next_level')}</span>
                                    <span>{fullUser.xp.toLocaleString()} / {nextLevelXp.toLocaleString()} XP</span>
                                </div>
                                <div className="w-full bg-gray-600 rounded-full h-4">
                                    <div className="bg-indigo-500 h-4 rounded-full" style={{ width: `${progress}%` }}></div>
                                </div>
                            </div>
                             <p className="text-sm text-gray-400">{t('total_xp')}: <span className="font-bold text-white">{fullUser.xp.toLocaleString()}</span></p>
                        </div>
                        
                        <div className="bg-gray-700/50 p-6 rounded-lg">
                            <h4 className="text-lg font-bold text-white mb-4">{t('rank_system')}</h4>
                            <div className="space-y-3">
                                {RANKS.map((rank, index) => {
                                    const isOwned = index <= currentUserRankIndex;
                                    const canAfford = fullUser.coins >= rank.cost;
                                    const highEnoughLevel = fullUser.level >= rank.level;
                                    const canPurchase = !isOwned && canAfford && highEnoughLevel && index === currentUserRankIndex + 1;

                                    return (
                                        <div key={rank.key} className={`p-4 rounded-lg flex items-center justify-between transition-all ${isOwned ? 'bg-gray-800/50 border-l-4 border-green-500' : 'bg-gray-600/50'}`}>
                                            <div>
                                                <p className={`font-bold text-lg ${getRankColor(rank.key)}`}>{t(rank.key)}</p>
                                                <p className="text-sm text-gray-400">{t('requirements')}: {t('level_short')} {rank.level} & {rank.cost.toLocaleString()} {t('devrim_coin')}</p>
                                            </div>
                                            <div>
                                                {isOwned ? (
                                                    <span className="text-sm font-bold text-green-400">{t('owned')}</span>
                                                ) : (
                                                    <button 
                                                        onClick={() => handlePurchase(rank.key)}
                                                        disabled={!canPurchase}
                                                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                                                    >
                                                        {t('purchase')}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </div>
                 </div>
            </div>
        </div>
    );
};

export default ProfilePage;