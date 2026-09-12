'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';

interface ParallaxLayerProps {
  children: React.ReactNode;
  speed?: number; // e.g. -50 to 50
  rotateRange?: [number, number];
  scaleRange?: [number, number];
  className?: string;
  smooth?: boolean;
}

export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
  children,
  speed = 30,
  rotateRange,
  scaleRange,
  className = '',
  smooth = true,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], [-speed, speed]);
  const smoothY = useSpring(rawY, { stiffness: 100, damping: 20, mass: 0.5 });
  const y = smooth ? smoothY : rawY;

  const rawRotate = useTransform(
    scrollYProgress,
    [0, 1],
    rotateRange || [0, 0]
  );
  const rotate = smooth ? useSpring(rawRotate, { stiffness: 100, damping: 20 }) : rawRotate;

  const rawScale = useTransform(
    scrollYProgress,
    [0, 1],
    scaleRange || [1, 1]
  );
  const scale = smooth ? useSpring(rawScale, { stiffness: 100, damping: 20 }) : rawScale;

  if (prefersReduced) {
    return <div ref={ref} className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div
        style={{
          y,
          rotate: rotateRange ? rotate : undefined,
          scale: scaleRange ? scale : undefined,
        }}
        className="w-full h-full will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
};
