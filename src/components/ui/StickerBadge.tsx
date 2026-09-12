import React from 'react';

interface StickerBadgeProps {
  children: React.ReactNode;
  color?: 'yellow' | 'pink' | 'lime' | 'lilac' | 'mint';
  rotation?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const colorMap = {
  yellow: 'bg-th-yellow',
  pink: 'bg-th-pink',
  lime: 'bg-th-lime',
  lilac: 'bg-th-lilac',
  mint: 'bg-th-mint',
};

const sizeMap = {
  sm: 'text-[10px] px-1.5 py-0.5',
  md: 'text-xs px-2 py-0.5',
  lg: 'text-sm px-3 py-1',
};

export const StickerBadge: React.FC<StickerBadgeProps> = ({
  children,
  color = 'yellow',
  rotation = -2,
  size = 'md',
  className = '',
}) => {
  return (
    <span
      className={`inline-block font-pixel font-bold uppercase tracking-wider border-2 border-black text-black shadow-brutal-sm transition-[transform,box-shadow] duration-200 ease-[var(--ease-spring,cubic-bezier(0.34,1.56,0.64,1))] select-none cursor-default hover:rotate-0 hover:scale-105 hover:-translate-y-0.5 hover:shadow-brutal active:scale-95 ${colorMap[color]} ${sizeMap[size]} ${className}`}
      style={{ transform: `rotate(${rotation}deg)` }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'rotate(0deg) translateY(-2px) scale(1.05)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = `rotate(${rotation}deg)`;
      }}
      onMouseDown={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'rotate(0deg) translateY(1px) scale(0.96)';
      }}
      onMouseUp={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'rotate(0deg) translateY(-2px) scale(1.05)';
      }}
    >
      {children}
    </span>
  );
};
