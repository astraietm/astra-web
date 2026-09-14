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
  return (
    <div
      className={`relative bg-surface text-foreground border-2 border-foreground p-6 sm:p-8 ${
        hoverEffect ? 'transition-transform duration-200 hover:-translate-y-1' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
