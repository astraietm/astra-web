import React from 'react';

interface PixelPatternProps {
  variant?: 'dots' | 'grid' | 'crosses';
  opacity?: number;
  className?: string;
}

export const PixelPattern: React.FC<PixelPatternProps> = ({
  variant = 'dots',
  opacity = 0.4,
  className = '',
}) => {
  const getPatternClass = () => {
    switch (variant) {
      case 'grid':
        return 'bg-grid-lines';
      case 'crosses':
        return 'bg-dot-grid';
      case 'dots':
      default:
        return 'bg-dot-grid-subtle';
    }
  };

  return (
    <div
      className={`absolute inset-0 pointer-events-none ${getPatternClass()} ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    />
  );
};
