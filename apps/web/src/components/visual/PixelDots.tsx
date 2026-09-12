"use client";

import React from 'react';

interface PixelDotsProps {
  count?: number;
  colors?: string[];
  className?: string;
}

export const PixelDots: React.FC<PixelDotsProps> = ({
  count = 8,
  colors = ['#F79CFF', '#E8CCFF', '#C3FF16', '#4A9EFF'],
  className = '',
}) => {
  // Generate deterministic positions using a simple seed pattern
  const dots = Array.from({ length: count }, (_, i) => ({
    left: `${(i * 37 + 13) % 95}%`,
    top: `${(i * 53 + 7) % 90}%`,
    size: 4 + ((i * 3) % 4),
    color: colors[i % colors.length],
    delay: `${(i * 0.3).toFixed(1)}s`,
  }));

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
      {dots.map((dot, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: dot.left,
            top: dot.top,
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            backgroundColor: dot.color,
            animationDelay: dot.delay,
          }}
        />
      ))}
    </div>
  );
};
