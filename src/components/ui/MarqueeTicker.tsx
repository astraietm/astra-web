'use client';

import React from 'react';

interface MarqueeTickerProps {
  items: string[];
  bgColor?: string;
  textColor?: string;
  separator?: string;
  speed?: number;
  className?: string;
}

export const MarqueeTicker: React.FC<MarqueeTickerProps> = ({
  items,
  bgColor = '#F79CFF',
  textColor = '#000000',
  separator = '✦',
  speed = 25,
  className = '',
}) => {
  const content = items.join(` ${separator} `) + ` ${separator} `;

  return (
    <div
      className={`w-full overflow-hidden whitespace-nowrap marquee-hover-pause ${className}`}
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <div
        className="inline-flex animate-marquee will-change-transform"
        style={{ animationDuration: `${speed}s` }}
      >
        {/* Duplicate the content for seamless infinite loop */}
        <span className="inline-block font-display font-bold text-sm sm:text-base md:text-lg uppercase tracking-wider py-2.5 px-4">
          {content}
        </span>
        <span className="inline-block font-display font-bold text-sm sm:text-base md:text-lg uppercase tracking-wider py-2.5 px-4">
          {content}
        </span>
        <span className="inline-block font-display font-bold text-sm sm:text-base md:text-lg uppercase tracking-wider py-2.5 px-4">
          {content}
        </span>
        <span className="inline-block font-display font-bold text-sm sm:text-base md:text-lg uppercase tracking-wider py-2.5 px-4">
          {content}
        </span>
      </div>
    </div>
  );
};
