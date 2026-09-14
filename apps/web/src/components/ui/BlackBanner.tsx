"use client";

import React from 'react';

interface BlackBannerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  skew?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 'text-xl sm:text-2xl px-4 py-1.5 leading-none',
  md: 'text-2xl sm:text-3xl md:text-4xl px-6 py-2.5 leading-none',
  lg: 'text-3xl sm:text-4xl md:text-5xl px-8 py-3.5 leading-none',
};

export const BlackBanner: React.FC<BlackBannerProps> = ({
  children,
  size = 'md',
  skew = true,
  className = '',
}) => {
  return (
    <div
      className={`inline-block bg-black text-white font-anton uppercase tracking-normal ${sizeMap[size]} ${className}`}
      style={skew ? { transform: 'skewX(-2deg)' } : undefined}
    >
      <span style={skew ? { display: 'inline-block', transform: 'skewX(2deg)' } : undefined}>
        {children}
      </span>
    </div>
  );
};
