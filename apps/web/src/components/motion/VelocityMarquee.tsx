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
  wrap,
} from 'framer-motion';

interface VelocityMarqueeProps {
  items: string[];
  baseVelocity?: number;
  bgColor?: string;
  textColor?: string;
  separator?: string;
  fontClass?: string;
  className?: string;
}

const SPAN_COUNT = 6;
const SPAN_PERCENT = 100 / SPAN_COUNT;

export const VelocityMarquee: React.FC<VelocityMarqueeProps> = ({
  items,
  baseVelocity = 0.35,
  bgColor = '#F79CFF',
  textColor = '#000000',
  separator = '✦',
  fontClass = 'font-serif text-lg sm:text-2xl md:text-3xl tracking-wide',
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

  // Seamless mathematical wrap across exactly one span width
  const x = useTransform(baseX, (v) => `${wrap(-SPAN_PERCENT * 2, -SPAN_PERCENT, v)}%`);

  useAnimationFrame((t, delta) => {
    if (prefersReduced || isHovered) return;
    let moveBy = baseVelocity * (delta / 1000) * 5;
    const vf = velocityFactor.get();
    if (vf !== 0) {
      moveBy += moveBy * Math.min(Math.abs(vf), 2.5);
    }
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
        {Array.from({ length: SPAN_COUNT }).map((_, idx) => (
          <span key={idx} className={`inline-block uppercase px-6 select-none ${fontClass}`}>
            {content}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

