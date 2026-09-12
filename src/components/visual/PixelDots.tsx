'use client';

import React, { useMemo } from 'react';

interface PixelDotsProps {
  count?: number;
  colors?: string[];
  className?: string;
  minSize?: number;
  maxSize?: number;
  animated?: boolean;
  opacity?: number;
}

export const PixelDots: React.FC<PixelDotsProps> = ({
  count = 28,
  colors = ['#F79CFF', '#FFE816', '#C3FF16', '#4A9EFF', '#97F8B7', '#0A0A0A', '#E8CCFF'],
  className = '',
  minSize = 2.5,
  maxSize = 5.5,
  animated = true,
  opacity = 0.85,
}) => {
  const dots = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      // Golden ratio and prime seed distribution for balanced coverage
      const phi = 0.618033988749895;
      const xPercent = ((i * phi * 100 + (i * 19.7)) % 94) + 3;
      const yPercent = (((i + 1) * 37.3 + (i * phi * 53)) % 92) + 4;

      const sizeDelta = maxSize - minSize;
      const size = minSize + ((i * 11) % (sizeDelta + 1));
      const dotType = i % 7 === 0 ? 'cross' : i % 5 === 0 ? 'pair' : 'single';

      return {
        left: `${xPercent.toFixed(1)}%`,
        top: `${yPercent.toFixed(1)}%`,
        size,
        color: colors[i % colors.length],
        delay: `${((i * 0.25) % 3.5).toFixed(2)}s`,
        duration: `${(2.2 + ((i * 0.5) % 2.8)).toFixed(1)}s`,
        dotType,
      };
    });
  }, [count, colors, minSize, maxSize]);

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`}
      aria-hidden="true"
      style={{ opacity }}
    >
      {dots.map((dot, i) => {
        if (dot.dotType === 'cross') {
          // Retro 3x3 pixel cross glyph
          return (
            <div
              key={i}
              className={`absolute ${animated ? 'animate-pulse' : ''}`}
              style={{
                left: dot.left,
                top: dot.top,
                animationDelay: dot.delay,
                animationDuration: dot.duration,
              }}
            >
              <svg
                width={dot.size + 4}
                height={dot.size + 4}
                viewBox="0 0 7 7"
                fill="none"
                style={{ shapeRendering: 'crispEdges' }}
              >
                <rect x="3" y="0" width="1" height="7" fill={dot.color} />
                <rect x="0" y="3" width="7" height="1" fill={dot.color} />
                <rect x="2" y="2" width="3" height="3" fill={dot.color} />
              </svg>
            </div>
          );
        }

        if (dot.dotType === 'pair') {
          // Diagonal 2-pixel pair cluster
          return (
            <div
              key={i}
              className={`absolute flex flex-col gap-[2px] ${animated ? 'animate-pulse' : ''}`}
              style={{
                left: dot.left,
                top: dot.top,
                animationDelay: dot.delay,
                animationDuration: dot.duration,
              }}
            >
              <div
                style={{
                  width: `${dot.size}px`,
                  height: `${dot.size}px`,
                  backgroundColor: dot.color,
                  boxShadow: '1px 1px 0px rgba(0,0,0,0.12)',
                }}
              />
              <div
                style={{
                  width: `${Math.max(2, dot.size - 1)}px`,
                  height: `${Math.max(2, dot.size - 1)}px`,
                  backgroundColor: dot.color,
                  marginLeft: `${dot.size}px`,
                  opacity: 0.8,
                }}
              />
            </div>
          );
        }

        // Standard crisp single pixel square
        return (
          <div
            key={i}
            className={`absolute ${animated ? 'animate-pulse' : ''}`}
            style={{
              left: dot.left,
              top: dot.top,
              width: `${dot.size}px`,
              height: `${dot.size}px`,
              backgroundColor: dot.color,
              boxShadow: dot.color === '#0A0A0A' ? 'none' : '1px 1px 0px rgba(0,0,0,0.12)',
              animationDelay: dot.delay,
              animationDuration: dot.duration,
            }}
          />
        );
      })}
    </div>
  );
};
