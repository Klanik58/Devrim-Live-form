import React from 'react';

export const HeartIcon: React.FC<{ filled: boolean; className?: string }> = ({ filled, className }) => (
  <svg className={`w-5 h-5 inline-block ${className}`} fill={filled ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
  </svg>
);
