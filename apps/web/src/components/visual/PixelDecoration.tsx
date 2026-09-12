import React from 'react';

type GlyphType = 'star' | 'cross' | 'spark' | 'corner-tl' | 'corner-br' | 'badge' | 'cube';

interface PixelDecorationProps {
  glyph: GlyphType;
  color?: string;
  size?: number;
  className?: string;
}

export const PixelDecoration: React.FC<PixelDecorationProps> = ({
  glyph,
  color = 'currentColor',
  size = 24,
  className = '',
}) => {
  switch (glyph) {
    case 'star':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`pixelated ${className}`}
          style={{ shapeRendering: 'crispEdges' }}
        >
          <rect x="7" y="0" width="2" height="16" fill={color} />
          <rect x="0" y="7" width="16" height="2" fill={color} />
          <rect x="5" y="5" width="6" height="6" fill={color} />
          <rect x="3" y="3" width="2" height="2" fill={color} />
          <rect x="11" y="3" width="2" height="2" fill={color} />
          <rect x="3" y="11" width="2" height="2" fill={color} />
          <rect x="11" y="11" width="2" height="2" fill={color} />
        </svg>
      );

    case 'cross':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={{ shapeRendering: 'crispEdges' }}
        >
          <rect x="5" y="0" width="2" height="12" fill={color} />
          <rect x="0" y="5" width="12" height="2" fill={color} />
        </svg>
      );

    case 'spark':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={{ shapeRendering: 'crispEdges' }}
        >
          <rect x="6" y="2" width="2" height="10" fill={color} />
          <rect x="2" y="6" width="10" height="2" fill={color} />
          <rect x="4" y="4" width="6" height="6" fill={color} />
        </svg>
      );

    case 'corner-tl':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={{ shapeRendering: 'crispEdges' }}
        >
          <rect x="0" y="0" width="16" height="3" fill={color} />
          <rect x="0" y="0" width="3" height="16" fill={color} />
        </svg>
      );

    case 'corner-br':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={{ shapeRendering: 'crispEdges' }}
        >
          <rect x="0" y="13" width="16" height="3" fill={color} />
          <rect x="13" y="0" width="3" height="16" fill={color} />
        </svg>
      );

    case 'cube':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          style={{ shapeRendering: 'crispEdges' }}
        >
          <rect x="2" y="2" width="16" height="16" stroke={color} strokeWidth="2" fill="none" />
          <rect x="6" y="6" width="8" height="8" fill={color} />
        </svg>
      );

    case 'badge':
    default:
      return (
        <div
          className={`inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border border-current ${className}`}
        >
          <span className="w-1.5 h-1.5 bg-current" />
          <span>PIXEL_SYS</span>
        </div>
      );
  }
};
