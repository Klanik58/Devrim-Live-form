
import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';

const ForgotPasswordPage = () => {
    const { t, navigate, findUserByEmail } = useAppContext();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Simulate checking for user and sending email
        const userExists = findUserByEmail(email);

        if (userExists) {
            // In a real app, you would trigger an email here.
            console.log(`Password reset link would be sent to: ${email}`);
        }

        // For security, always show a generic message to prevent user enumeration
        setMessage(t('reset_link_sent'));
    };

    return (
        <div className="container mx-auto px-4 py-12 flex justify-center">
            <div className="w-full max-w-md">
                <form onSubmit={handleSubmit} className="bg-gray-800 border border-gray-700 shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4">
                    <h2 className="text-2xl font-bold text-white text-center mb-4">{t('forgot_password_title')}</h2>
                    <p className="text-center text-gray-400 text-sm mb-6">{t('forgot_password_instructions')}</p>

                    {message ? (
                        <div className="bg-green-900/50 border border-green-700 text-green-300 px-4 py-3 rounded relative mb-4" role="alert">
                            <span className="block sm:inline">{message}</span>
                        </div>
                    ) : (
                        <>
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
                            <div className="flex items-center justify-between">
                                <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors w-full" type="submit">
                                    {t('send_reset_link')}
                                </button>
                            </div>
                        </>
                    )}
                    <p className="text-center text-gray-500 text-sm mt-6">
                         <a href="#" onClick={(e) => { e.preventDefault(); navigate('login'); }} className="font-bold text-indigo-400 hover:text-indigo-300">{t('back_to_login')}</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;