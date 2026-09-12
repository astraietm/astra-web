'use client';

import React, { useRef } from 'react';
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
  baseVelocity = 1.5,
  bgColor = '#FFE816',
  textColor = '#000000',
  separator = '✦',
  className = '',
}) => {
  const prefersReduced = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });

  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], {
    clamp: false,
  });

  const x = useTransform(baseX, (v) => `${v % 50}%`);

  const directionFactor = useRef<number>(1);
  useAnimationFrame((t, delta) => {
    if (prefersReduced) return;
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000) * 10;

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() - moveBy);
  });

  const content = items.join(` ${separator} `) + ` ${separator} `;

  return (
    <div
      className={`w-full overflow-hidden whitespace-nowrap select-none border-y-2 border-black ${className}`}
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <motion.div
        className="inline-flex py-2.5 will-change-transform"
        style={{ x: prefersReduced ? 0 : x }}
      >
        <span className="inline-block font-display font-bold text-sm sm:text-base md:text-lg uppercase tracking-wider px-4">
          {content}
        </span>
        <span className="inline-block font-display font-bold text-sm sm:text-base md:text-lg uppercase tracking-wider px-4">
          {content}
        </span>
        <span className="inline-block font-display font-bold text-sm sm:text-base md:text-lg uppercase tracking-wider px-4">
          {content}
        </span>
        <span className="inline-block font-display font-bold text-sm sm:text-base md:text-lg uppercase tracking-wider px-4">
          {content}
        </span>
      </motion.div>
    </div>
  );
};
