'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

interface MagneticWrapperProps {
  children: React.ReactNode;
  strength?: number; // e.g. 0.2 to 0.4
  className?: string;
}

export const MagneticWrapper: React.FC<MagneticWrapperProps> = ({
  children,
  strength = 0.3,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || prefersReduced) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const deltaX = (clientX - centerX) * strength;
    const deltaY = (clientY - centerY) * strength;
    mouseX.set(deltaX);
    mouseY.set(deltaY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      className={`inline-block will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
};
