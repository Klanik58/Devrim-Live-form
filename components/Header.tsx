import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { GiftIcon } from './icons/GiftIcon';
import { CoinIcon } from './icons/CoinIcon';

const NavLink: React.FC<{ href: string; children: React.ReactNode, onClick?: (e: React.MouseEvent) => void }> = ({ href, children, onClick }) => (
    <a 
      href={href} 
      onClick={onClick}
      className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
    >
        {children}
    </a>
);

const LanguageSwitcher = () => {
    const { lang, setLang } = useAppContext();
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const toggleLang = (newLang: 'tr' | 'en') => {
        setLang(newLang);
        setIsOpen(false);
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);
    
    return (
        <div className="relative" ref={wrapperRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors">
                <span className="text-sm font-medium">{lang.toUpperCase()}</span>
                <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-24 bg-gray-700 rounded-md shadow-lg py-1 z-50">
                    <a href="#" onClick={(e) => { e.preventDefault(); toggleLang('tr'); }} className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600">Türkçe</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); toggleLang('en'); }} className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600">English</a>
                </div>
            )}
        </div>
    )
}

const UserMenu = () => {
    const { user, logout, navigate, t } = useAppContext();
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

     useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    if (!user) return null;

    return (
        <div className="relative" ref={wrapperRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-3 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-md transition-colors">
                 <img src={`https://i.pravatar.cc/40?u=${user.email}`} alt="avatar" className="w-6 h-6 rounded-full" />
                <span className="text-white text-sm font-medium">{user.username}</span>
                <div className="flex items-center space-x-3 border-l border-gray-600 pl-3">
                    <span className="bg-indigo-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{t('level_short')} {user.level}</span>
                    <div className="flex items-center space-x-1">
                        <CoinIcon className="text-yellow-400" />
                        <span className="text-yellow-400 text-xs font-bold">{user.coins.toLocaleString()}</span>
                    </div>
                </div>
                <svg className={`w-4 h-4 text-gray-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            {isOpen && (
                 <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg py-1 z-50">
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate('profile'); setIsOpen(false); }} className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600">{t('profile')}</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); logout(); setIsOpen(false); }} className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600">{t('logout')}</a>
                </div>
            )}
        </div>
    )
}

const DailyRewardButton = () => {
    const { t, isDailyRewardAvailable, claimDailyReward } = useAppContext();
    const [claimed, setClaimed] = useState(false);

    const handleClick = () => {
        if (isDailyRewardAvailable) {
            claimDailyReward();
            setClaimed(true);
            setTimeout(() => setClaimed(false), 3000); // Reset after 3s
        }
    };

    const available = isDailyRewardAvailable && !claimed;

    return (
        <div className="relative group">
            <button 
                onClick={handleClick}
                disabled={!available}
                className={`relative p-2 rounded-full transition-colors ${
                    available ? 'bg-gray-700 hover:bg-gray-600 text-yellow-300 animate-pulse' : 'bg-gray-800 text-gray-500'
                }`}
            >
                <GiftIcon />
                {available && <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-gray-800"></span>}
            </button>
            <div className="absolute top-full right-0 mt-2 w-max bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {claimed ? t('come_back_tomorrow') : available ? t('claim_reward') : t('daily_reward')}
            </div>
        </div>
    );
};


const Header = () => {
    const { user, t, navigate } = useAppContext();

    return (
        <header className="bg-gray-800 shadow-lg border-b border-gray-700">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <a href="#" onClick={(e) => {e.preventDefault(); navigate('home')}} className="text-2xl font-bold text-white tracking-wider">
                          <span className="text-indigo-400">Devrim</span>
                        </a>
                        <nav className="hidden md:flex items-baseline ml-10 space-x-4">
                            <NavLink href="#" onClick={(e) => {e.preventDefault(); navigate('home')}}>{t('forum')}</NavLink>
                            <NavLink href="#" onClick={(e) => {e.preventDefault(); navigate('leaderboard')}}>{t('leaderboard')}</NavLink>
                            <NavLink href="#">{t('members')}</NavLink>
                        </nav>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative hidden sm:block">
                            <input
                                type="text"
                                placeholder={t('search')}
                                className="bg-gray-700 text-white placeholder-gray-400 border border-gray-600 rounded-md py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            />
                             <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>

                        {user ? (
                            <>
                                <DailyRewardButton />
                                <UserMenu />
                            </>
                        ) : (
                            <>
                                <a href="#" onClick={(e) => {e.preventDefault(); navigate('login')}} className="bg-gray-700 text-gray-300 hover:bg-gray-600 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                    {t('login')}
                                </a>
                                <a href="#" onClick={(e) => {e.preventDefault(); navigate('register')}} className="bg-indigo-600 text-white hover:bg-indigo-500 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                    {t('register')}
                                </a>
                            </>
                        )}
                         <LanguageSwitcher />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;