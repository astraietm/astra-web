"use client";

import React from 'react';

interface DisplayHeadingProps {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'div';
  size?: 'hero' | 'section' | 'card';
  className?: string;
}

export const DisplayHeading: React.FC<DisplayHeadingProps> = ({
  children,
  as: Component = 'h2',
  size = 'section',
  className = '',
}) => {
  const sizeStyles = {
    hero: 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05]',
    section: 'text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.15]',
    card: 'text-xl sm:text-2xl font-bold tracking-tight leading-snug',
  };

  return (
    <Component
      className={`font-display uppercase text-foreground ${sizeStyles[size]} ${className}`}
    >
      {children}
    </Component>
  );
};
