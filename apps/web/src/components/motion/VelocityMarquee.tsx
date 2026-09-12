'use client';

import React, { useRef, useState } from 'react';
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

  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 2], {
    clamp: false,
  });

  const x = useTransform(baseX, (v) => `${v % 50}%`);

  const directionFactor = useRef<number>(1);
  useAnimationFrame((t, delta) => {
    if (prefersReduced || isHovered) return;
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000) * 5;

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * Math.min(velocityFactor.get(), 2);
    baseX.set(baseX.get() - moveBy);
  });

  const content = items.join(`  ${separator}  `) + `  ${separator}  `;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`w-full overflow-hidden whitespace-nowrap select-none border-y-2 border-black cursor-default ${className}`}
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <motion.div
        className="inline-flex py-2 will-change-transform"
        style={{ x: prefersReduced ? 0 : x }}
      >
        <span className="inline-block font-mono font-bold text-xs sm:text-sm md:text-base uppercase tracking-widest px-6">
          {content}
        </span>
        <span className="inline-block font-mono font-bold text-xs sm:text-sm md:text-base uppercase tracking-widest px-6">
          {content}
        </span>
        <span className="inline-block font-mono font-bold text-xs sm:text-sm md:text-base uppercase tracking-widest px-6">
          {content}
        </span>
        <span className="inline-block font-mono font-bold text-xs sm:text-sm md:text-base uppercase tracking-widest px-6">
          {content}
        </span>
      </motion.div>
    </div>
  );
};

