"use client";

import React from 'react';

interface DotMatrixDisplayProps {
  text: string;
  subtext?: string;
  variant?: 'dark' | 'green' | 'pink' | 'yellow' | 'minimal';
  status?: string;
  className?: string;
}

const variantStyles = {
  dark: {
    container: 'bg-[#0F0F14] text-[#E0E0FF] border-black',
    glow: 'text-[#4A9EFF]',
    dot: 'bg-[#4A9EFF]',
  },
  green: {
    container: 'bg-[#0A1A0F] text-[#97F8B7] border-black',
    glow: 'text-[#10B981]',
    dot: 'bg-[#10B981]',
  },
  pink: {
    container: 'bg-[#1A0A18] text-[#F79CFF] border-black',
    glow: 'text-[#F79CFF]',
    dot: 'bg-[#F79CFF]',
  },
  yellow: {
    container: 'bg-[#1A1805] text-[#FFE816] border-black',
    glow: 'text-[#FFE816]',
    dot: 'bg-[#FFE816]',
  },
  minimal: {
    container: 'bg-white text-black border-black',
    glow: 'text-black',
    dot: 'bg-black',
  },
};

export const DotMatrixDisplay: React.FC<DotMatrixDisplayProps> = ({
  text,
  subtext,
  variant = 'dark',
  status,
  className = '',
}) => {
  const styles = variantStyles[variant];

  return (
    <div
      className={`inline-flex items-center gap-3 px-3 py-1.5 border-2 rounded-none font-mono text-xs shadow-[2px_2px_0px_#000] select-none ${styles.container} ${className}`}
    >
      {/* Blinking Matrix Status Dot */}
      <span className="relative flex h-2 w-2">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-none opacity-75 ${styles.dot}`}
        />
        <span
          className={`relative inline-flex rounded-none h-2 w-2 ${styles.dot}`}
        />
      </span>

      {/* Primary Matrix Text */}
      <span className="font-pixel tracking-wider font-bold uppercase">
        {text}
      </span>

      {/* Optional Subtext */}
      {subtext && (
        <span className="text-[10px] opacity-75 font-mono">
          [{subtext}]
        </span>
      )}

      {/* Status Pill */}
      {status && (
        <span className="text-[9px] font-bold px-1.5 py-0.2 bg-black/40 border border-white/20 uppercase tracking-widest">
          {status}
        </span>
      )}
    </div>
  );
};
