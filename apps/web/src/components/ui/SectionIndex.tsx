"use client";

import React from 'react';

interface SectionIndexProps {
  number: string;
  label?: string;
  accent?: 'green' | 'yellow' | 'blue' | 'magenta';
  className?: string;
}

export const SectionIndex: React.FC<SectionIndexProps> = ({
  number,
  label,
  accent = 'yellow',
  className = '',
}) => {
  const accentBorder = {
    green: 'border-l-emerald-500 text-emerald-600 dark:text-emerald-400',
    yellow: 'border-l-[#DFE104] text-amber-600 dark:text-[#DFE104]',
    blue: 'border-l-blue-500 text-blue-600 dark:text-blue-400',
    magenta: 'border-l-pink-500 text-pink-600 dark:text-pink-400',
  };

  return (
    <div className={`inline-flex items-center gap-3 border-l-4 pl-3 py-0.5 ${accentBorder[accent]} ${className}`}>
      <span className="font-mono text-2xl sm:text-3xl font-bold tracking-tighter text-foreground">
        {number}
      </span>
      {label && (
        <span className="font-mono text-xs sm:text-sm font-semibold tracking-widest uppercase text-muted-foreground">
          // {label}
        </span>
      )}
    </div>
  );
};
