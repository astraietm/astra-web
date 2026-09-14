"use client";

import React from 'react';

interface PixelFrameProps {
  children: React.ReactNode;
  className?: string;
  dotGrid?: boolean;
  cornerAccent?: boolean;
  accentColor?: 'pink' | 'yellow' | 'lime' | 'black';
}

export const PixelFrame: React.FC<PixelFrameProps> = ({
  children,
  className = '',
  dotGrid = false,
  cornerAccent = true,
  accentColor = 'black',
}) => {
  const accentBorder =
    accentColor === 'pink'
      ? 'border-th-pink'
      : accentColor === 'yellow'
      ? 'border-th-yellow'
      : accentColor === 'lime'
      ? 'border-th-lime'
      : 'border-black';

  return (
    <div
      className={`relative border-2 border-black bg-white p-5 sm:p-6 transition-transform hover:-translate-y-0.5 ${className}`}
    >
      {/* Optional Dot Matrix Background Texture */}
      {dotGrid && (
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle, #000 1px, transparent 1px)',
            backgroundSize: '12px 12px',
          }}
          aria-hidden="true"
        />
      )}

      {/* Pixel Crosshair Corner Brackets */}
      {cornerAccent && (
        <>
          <span
            aria-hidden="true"
            className="absolute -top-1.5 -left-1.5 font-pixel text-xs font-bold text-black select-none"
          >
            +
          </span>
          <span
            aria-hidden="true"
            className="absolute -top-1.5 -right-1.5 font-pixel text-xs font-bold text-black select-none"
          >
            +
          </span>
          <span
            aria-hidden="true"
            className="absolute -bottom-1.5 -left-1.5 font-pixel text-xs font-bold text-black select-none"
          >
            +
          </span>
          <span
            aria-hidden="true"
            className="absolute -bottom-1.5 -right-1.5 font-pixel text-xs font-bold text-black select-none"
          >
            +
          </span>
        </>
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
