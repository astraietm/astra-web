'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface DraggableStickerProps {
  children: React.ReactNode;
  color?: 'yellow' | 'pink' | 'lime' | 'lilac' | 'mint' | 'black';
  initialRotation?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  draggable?: boolean;
  dragConstraints?: { top?: number; bottom?: number; left?: number; right?: number };
}

const colorMap = {
  yellow: 'bg-th-yellow text-black',
  pink: 'bg-th-pink text-black',
  lime: 'bg-th-lime text-black',
  lilac: 'bg-th-lilac text-black',
  mint: 'bg-th-mint text-black',
  black: 'bg-black text-white',
};

const sizeMap = {
  sm: 'text-[10px] sm:text-xs px-2.5 py-1',
  md: 'text-xs sm:text-sm px-3.5 py-1.5',
  lg: 'text-sm sm:text-base px-4 py-2',
};

export const DraggableSticker: React.FC<DraggableStickerProps> = ({
  children,
  color = 'yellow',
  initialRotation = -2,
  size = 'md',
  className = '',
  draggable = true,
  dragConstraints = { top: -160, bottom: 160, left: -220, right: 220 },
}) => {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return (
      <span
        className={`inline-block font-pixel font-bold uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] select-none ${colorMap[color]} ${sizeMap[size]} ${className}`}
        style={{ transform: `rotate(${initialRotation}deg)` }}
      >
        {children}
      </span>
    );
  }

  return (
    <motion.span
      drag={draggable}
      dragConstraints={dragConstraints}
      dragElastic={0.2}
      dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
      initial={{ rotate: initialRotation, scale: 1 }}
      whileHover={{
        scale: 1.08,
        rotate: 0,
        boxShadow: '5px 5px 0px #000',
        cursor: draggable ? 'grab' : 'pointer',
      }}
      whileTap={{
        scale: 0.96,
        cursor: draggable ? 'grabbing' : 'pointer',
        boxShadow: '2px 2px 0px #000',
      }}
      transition={{
        type: 'spring',
        stiffness: 350,
        damping: 22,
        mass: 0.6,
      }}
      className={`inline-block font-pixel font-bold uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] select-none will-change-transform cursor-grab active:cursor-grabbing ${colorMap[color]} ${sizeMap[size]} ${className}`}
    >
      {children}
    </motion.span>
  );
};

