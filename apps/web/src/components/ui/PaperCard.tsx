'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface PaperCardProps {
  children: React.ReactNode;
  rotation?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  animateIn?: boolean;
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
}) => {
  const prefersReduced = useReducedMotion();

  if (prefersReduced || !animateIn) {
    return (
      <div
        className={`paper-texture relative ${sizeMap[size]} ${className}`}
        style={rotation !== 0 ? { transform: `rotate(${rotation}deg)` } : undefined}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{
        y: -4,
        rotate: rotation !== 0 ? (rotation > 0 ? rotation - 0.5 : rotation + 0.5) : 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 24,
        mass: 0.8,
      }}
      className={`paper-texture relative will-change-transform ${sizeMap[size]} ${className}`}
    >
      {children}
    </motion.div>
  );
};
