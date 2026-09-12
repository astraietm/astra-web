"use client";

import React from 'react';

interface EyebrowProps {
  children: React.ReactNode;
  accent?: 'green' | 'yellow' | 'blue' | 'magenta' | 'default';
  className?: string;
  withCursor?: boolean;
}

export const Eyebrow: React.FC<EyebrowProps> = ({
  children,
  accent = 'default',
  className = '',
  withCursor = true,
}) => {
  const accentColors = {
    green: 'text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    yellow: 'text-amber-600 dark:text-[#DFE104] border-amber-500/30',
    blue: 'text-blue-600 dark:text-blue-400 border-blue-500/30',
    magenta: 'text-pink-600 dark:text-pink-400 border-pink-500/30',
    default: 'text-zinc-600 dark:text-zinc-400 border-zinc-500/30',
  };

  return (
    <div
      className={`inline-flex items-center gap-2 font-mono text-xs font-semibold tracking-wider uppercase px-2.5 py-1 bg-surface-elevated/80 border ${accentColors[accent]} shadow-sm ${className}`}
    >
      <span className="inline-block w-1.5 h-1.5 bg-current animate-pulse" />
      <span>{children}</span>
      {withCursor && <span className="text-zinc-400 select-none">_</span>}
    </div>
  );
};
