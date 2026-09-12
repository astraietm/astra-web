'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { PixelDots } from '@/components/visual/PixelDots';

interface PaperCardProps {
  children: React.ReactNode;
  rotation?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  animateIn?: boolean;
  withPixelDots?: boolean;
  pixelDotsCount?: number;
}

const sizeMap = {
  sm: 'p-4 sm:p-6 md:p-8',
  md: 'p-5 sm:p-8 md:p-12',
  lg: 'p-5 sm:p-10 md:p-16',
};

export const PaperCard: React.FC<PaperCardProps> = ({
  children,
  rotation = 0,
  className = '',
  size = 'md',
  animateIn = true,
  withPixelDots = false,
  pixelDotsCount = 18,
}) => {
  const prefersReduced = useReducedMotion();

  const dotsElement = withPixelDots ? (
    <PixelDots
      count={pixelDotsCount}
      minSize={3}
      maxSize={5}
      opacity={0.65}
      colors={['#FFE816', '#C3FF16', '#F79CFF', '#4A9EFF', '#0A0A0A']}
    />
  ) : null;

  if (prefersReduced || !animateIn) {
    return (
      <div
        className={`paper-texture relative ${sizeMap[size]} ${className}`}
        style={rotation !== 0 ? { transform: `rotate(${rotation}deg)` } : undefined}
      >
        {dotsElement}
        <div className="relative z-10">{children}</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotate: rotation !== 0 ? rotation + (rotation > 0 ? 3 : -3) : 0 }}
      whileInView={{ opacity: 1, y: 0, rotate: rotation }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{
        y: -4,
        rotate: rotation !== 0 ? (rotation > 0 ? rotation - 0.5 : rotation + 0.5) : 0,
        boxShadow: '4px 8px 24px rgba(0, 0, 0, 0.12)',
      }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 24,
        mass: 0.8,
      }}
      className={`paper-texture relative will-change-transform ${sizeMap[size]} ${className}`}
    >
      {dotsElement}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

