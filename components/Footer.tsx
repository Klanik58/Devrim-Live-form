
import React from 'react';
import { useAppContext } from '../hooks/useAppContext';

const Footer = () => {
    const { t } = useAppContext();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-800 mt-12 border-t border-gray-700">
            <div className="container mx-auto py-6 px-4">
                <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                    <p className="text-gray-400 text-sm">{t('copyright', { year: currentYear })}</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">{t('contact')}</a>
                        <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">{t('terms_of_use')}</a>
                        <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">{t('privacy_policy')}</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;