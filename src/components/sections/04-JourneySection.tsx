'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';
import { GradientSphere } from '@/components/visual/GradientSphere';

const steps = [
  {
    number: '01',
    title: 'Learn & Lead',
    description: 'Dive into hands-on exploit labs and mentor-guided CTF tracks.',
  },
  {
    number: '02',
    title: 'Hack & Defend',
    description: '24H live CTF WarGames across red and blue teams.',
  },
  {
    number: '03',
    title: 'Research & Publish',
    description: 'Zero-day research symposiums and paper presentations.',
  },
  {
    number: '04',
    title: 'Connect & Grow',
    description: 'Network with industry experts and security researchers.',
  },
];

export const JourneySection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const rawScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1.05, 0.9]);
  const rawRotate = useTransform(scrollYProgress, [0, 1], [-15, 25]);

  const scale = useSpring(rawScale, { stiffness: 120, damping: 24 });
  const rotate = useSpring(rawRotate, { stiffness: 120, damping: 24 });

  return (
    <section
      ref={containerRef}
      id="journey"
      className="relative min-h-screen bg-black overflow-hidden flex flex-col items-center justify-center py-20 sm:py-28"
    >
      {/* Top subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-editorial italic text-sm sm:text-base md:text-lg text-th-gold tracking-wider text-center mb-4 sm:mb-6 relative z-10 px-6"
      >
        HERE IS HOW WE BRING OUR VISION TO LIFE
      </motion.p>

      {/* Massive serif headline */}
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="font-editorial text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-th-cream text-center leading-[0.9] tracking-tight mb-16 sm:mb-24 relative z-10 px-6"
      >
        ACTION<br />PLAN
      </motion.h2>

      {/* Gradient Sphere + Steps with Parallax Spring Physics */}
      <div className="relative w-full flex justify-center">
        {/* The giant sphere with scroll parallax */}
        <motion.div
          style={{
            scale: prefersReduced ? 1 : scale,
            rotate: prefersReduced ? 0 : rotate,
          }}
          className="relative will-change-transform flex justify-center items-center"
        >
          <GradientSphere
            size="min(700px, 90vw)"
            className="relative"
          />
        </motion.div>

        {/* Steps overlaid on the sphere */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-8 sm:px-16 z-20 pointer-events-none">
          <div className="max-w-md w-full space-y-8 sm:space-y-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  type: 'spring',
                  stiffness: 250,
                  damping: 22,
                  delay: index * 0.1,
                }}
                className="text-center group transition-[transform,opacity] duration-160 ease-[var(--ease-out)] hover:-translate-y-1 cursor-default select-none pointer-events-auto"
              >
                <span className="font-editorial italic text-sm sm:text-base text-gray-800 block mb-1 group-hover:text-black font-bold transition-colors duration-160">
                  {step.number}
                </span>
                <h3 className="font-editorial italic text-2xl sm:text-3xl md:text-4xl text-black tracking-tight mb-2 group-hover:scale-105 transition-transform duration-160">
                  {step.title}
                </h3>
                <p className="font-editorial text-xs sm:text-sm text-gray-800 leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
