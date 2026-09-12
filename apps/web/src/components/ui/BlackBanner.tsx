import React from 'react';

interface BlackBannerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  skew?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 'text-lg sm:text-xl px-4 py-2',
  md: 'text-xl sm:text-2xl md:text-3xl px-6 py-3',
  lg: 'text-2xl sm:text-3xl md:text-4xl px-8 py-4',
};

export const BlackBanner: React.FC<BlackBannerProps> = ({
  children,
  size = 'md',
  skew = true,
  className = '',
}) => {
  return (
    <div
      className={`inline-block bg-black text-white font-pixel font-bold uppercase tracking-wide ${sizeMap[size]} ${className}`}
      style={skew ? { transform: 'skewX(-2deg)' } : undefined}
    >
      <span style={skew ? { display: 'inline-block', transform: 'skewX(2deg)' } : undefined}>
        {children}
      </span>
    </div>
  );
};
