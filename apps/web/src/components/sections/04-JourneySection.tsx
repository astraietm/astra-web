'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';

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

  // Gradient orb parallax
  const rawScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.80, 1.05, 0.85]);
  const rawRotate = useTransform(scrollYProgress, [0, 1], [-18, 22]);
  const scale = useSpring(rawScale, { stiffness: 100, damping: 22 });
  const rotate = useSpring(rawRotate, { stiffness: 100, damping: 22 });

  return (
    <section
      ref={containerRef}
      id="journey"
      className="relative min-h-screen bg-black -mt-px overflow-hidden flex flex-col items-center justify-center py-20 sm:py-28 md:py-36"
    >
      {/* Section label — gold italic like TinkerHub */}
      <p
        style={{
          color: '#D4A843',
          fontFamily: '"Instrument Serif", Georgia, serif',
          fontStyle: 'italic',
          letterSpacing: '0.15em',
        } as React.CSSProperties}
        className="text-sm sm:text-base tracking-[0.15em] text-center mb-5 relative z-10 px-6 uppercase"
      >
        HERE IS HOW WE BRING OUR VISION TO LIFE
      </p>

      {/* Massive gold Instrument Serif italic headline — exactly as TinkerHub */}
      <h2
        style={{
          fontFamily: '"Instrument Serif", Georgia, serif',
          fontStyle: 'italic',
          fontWeight: 400,
          color: '#D4A843',
          fontSize: 'clamp(4rem, 12vw, 10rem)',
        } as React.CSSProperties}
        className="text-center leading-[0.88] tracking-tight relative z-10 px-4 mb-14 sm:mb-20"
      >
        ACTION<br />PLAN
      </h2>

      {/* Giant gradient orb + step list */}
      <div className="relative w-full max-w-[680px] mx-auto px-4 flex justify-center items-center">
        {/* Gradient orb with scroll parallax */}
        <motion.div
          style={{
            scale: prefersReduced ? 1 : scale,
            rotate: prefersReduced ? 0 : rotate,
          }}
          className="relative will-change-transform flex justify-center items-center w-full"
        >
          <div
            className="w-[300px] h-[440px] sm:w-[480px] sm:h-[540px] md:w-[640px] md:h-[640px] rounded-full"
            style={{
              background:
                'radial-gradient(circle at 38% 38%, #D4A843 0%, #E8A070 22%, #F79CFF 52%, #D4A8FF 75%, #B8C8FF 100%)',
            }}
          />
        </motion.div>

        {/* Steps overlaid on the orb */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-14 z-20 pointer-events-none">
          <div className="max-w-sm w-full space-y-4 sm:space-y-7 md:space-y-10">
            {steps.map((step) => (
              <div
                key={step.number}
                className="text-center group transition-transform duration-200 hover:-translate-y-1 cursor-default select-none pointer-events-auto"
              >
                <span
                  className="block mb-0.5 text-gray-800 text-sm sm:text-base"
                  style={{
                    fontFamily: '"Instrument Serif", Georgia, serif',
                    fontStyle: 'italic',
                  }}
                >
                  {step.number}
                </span>
                <h3
                  className="text-2xl sm:text-3xl md:text-4xl text-black tracking-tight mb-1"
                  style={{
                    fontFamily: '"Instrument Serif", Georgia, serif',
                    fontStyle: 'italic',
                    fontWeight: 400,
                  }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-[11px] sm:text-xs md:text-sm text-gray-800 leading-snug sm:leading-relaxed max-w-[220px] sm:max-w-xs mx-auto"
                  style={{ fontFamily: '"General Sans", system-ui, sans-serif' }}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
