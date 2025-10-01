import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';

const LoginPage = () => {
    const { t, login, navigate } = useAppContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const success = login(email, password);
        if (!success) {
            setError(t('login_failed'));
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 flex justify-center">
            <div className="w-full max-w-md">
                <form onSubmit={handleSubmit} className="bg-gray-800 border border-gray-700 shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4">
                    <h2 className="text-2xl font-bold text-white text-center mb-6">{t('login_page_title')}</h2>
                    
                    {error && (
                        <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded relative mb-4" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                    
                    <div className="mb-4">
                        <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="email">
                            {t('email_address')}
                        </label>
                        <input
                            className="bg-gray-700 text-white placeholder-gray-500 border border-gray-600 rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            id="email"
                            type="email"
                            placeholder="email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <div className="flex justify-between items-center">
                            <label className="block text-gray-400 text-sm font-bold" htmlFor="password">
                                {t('password')}
                            </label>
                            <a href="#" onClick={(e) => { e.preventDefault(); navigate('forgot-password'); }} className="inline-block align-baseline font-bold text-sm text-indigo-400 hover:text-indigo-300">
                                {t('forgot_password')}
                            </a>
                        </div>
                        <input
                            className="bg-gray-700 text-white placeholder-gray-500 border border-gray-600 rounded w-full py-2 px-3 mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            id="password"
                            type="password"
                            placeholder="******************"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors w-full" type="submit">
                            {t('login')}
                        </button>
                    </div>
                     <p className="text-center text-gray-500 text-sm mt-6">
                        {t('dont_have_account')} <a href="#" onClick={(e) => { e.preventDefault(); navigate('register'); }} className="font-bold text-indigo-400 hover:text-indigo-300">{t('register')}</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;