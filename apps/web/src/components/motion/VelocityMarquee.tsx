'use client';

import React, { useState } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
} from 'framer-motion';

interface VelocityMarqueeProps {
  items: string[];
  baseVelocity?: number;
  bgColor?: string;
  textColor?: string;
  separator?: string;
  className?: string;
}

export const VelocityMarquee: React.FC<VelocityMarqueeProps> = ({
  items,
  baseVelocity = 0.35,
  bgColor = '#F79CFF',
  textColor = '#000000',
  separator = '✦',
  className = '',
}) => {
  const prefersReduced = useReducedMotion();
  const baseX = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 300,
  });

  // Calculate wrapped x strictly between -50% and 0% for a seamless infinite loop
  const x = useTransform(baseX, (v) => {
    const m = ((v % 50) - 50) % 50;
    return `${m === -50 ? 0 : m}%`;
  });

  useAnimationFrame((t, delta) => {
    if (prefersReduced || isHovered) return;

    // Smoothly boost speed on scroll in natural reading direction
    const velocity = Math.abs(smoothVelocity.get());
    const boost = Math.min(velocity / 400, 3);
    const moveBy = baseVelocity * (delta / 16) * 0.09 * (1 + boost);

    baseX.set(baseX.get() - moveBy);
  });

  // Substantial content repeated so neither track ever runs dry
  const singleUnit = items.join(`  ${separator}  `) + `  ${separator}  `;
  const repeatedContent = Array(4).fill(singleUnit).join('');

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`w-full overflow-hidden whitespace-nowrap select-none border-y-2 border-black cursor-default ${className}`}
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <motion.div
        className="inline-flex py-2 will-change-transform"
        style={{ x: prefersReduced ? '0%' : x }}
      >
        {/* Track 1: covers 0% to 50% */}
        <span className="inline-block font-editorial text-lg sm:text-2xl md:text-3xl uppercase tracking-wider px-4">
          {repeatedContent}
        </span>
        {/* Track 2: identical clone covering 50% to 100% for 0ms seam */}
        <span className="inline-block font-editorial text-lg sm:text-2xl md:text-3xl uppercase tracking-wider px-4">
          {repeatedContent}
        </span>
      </motion.div>
    </div>
  );
};

