import React from 'react';

export const CoinIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" />
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 4a1 1 0 102 0v1.083A6.974 6.974 0 0115.417 9H17a1 1 0 110 2h-1.583A6.974 6.974 0 0111 14.917V16a1 1 0 11-2 0v-1.083A6.974 6.974 0 014.583 11H3a1 1 0 110-2h1.583A6.974 6.974 0 019 5.083V4z" clipRule="evenodd" />
    </svg>
);