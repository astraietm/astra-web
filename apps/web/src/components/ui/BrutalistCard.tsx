"use client";

import React from 'react';

interface BrutalistCardProps {
  children: React.ReactNode;
  accent?: 'default' | 'green' | 'yellow' | 'blue' | 'magenta';
  className?: string;
  hoverEffect?: boolean;
}

export const BrutalistCard: React.FC<BrutalistCardProps> = ({
  children,
  accent = 'default',
  className = '',
  hoverEffect = true,
}) => {
  const accentShadows = {
    default: 'shadow-brutal hover:shadow-brutal-lg',
    green: 'shadow-brutal hover:shadow-brutal-green',
    yellow: 'shadow-brutal hover:shadow-brutal-accent',
    blue: 'shadow-brutal hover:shadow-brutal-blue',
    magenta: 'shadow-brutal hover:shadow-brutal-magenta',
  };

  return (
    <div
      className={`relative bg-surface text-foreground border-2 border-foreground p-6 sm:p-8 ${
        accentShadows[accent]
      } ${
        hoverEffect ? 'transition-all duration-200 hover:-translate-y-1' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
