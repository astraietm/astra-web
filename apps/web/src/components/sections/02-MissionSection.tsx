'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export const MissionSection: React.FC = () => {
  const prefersReduced = useReducedMotion();

  return (
    <section id="mission" className="relative py-20 sm:py-28 md:py-36 bg-graph-paper overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 md:px-12 flex flex-col items-center justify-center">
        {/* Authentic Wrinkled Paper Sheet with subtle tilt */}
        <motion.div
          initial={prefersReduced ? { opacity: 1, rotate: -3 } : { opacity: 0, y: 30, rotate: -4.5 }}
          whileInView={{ opacity: 1, y: 0, rotate: -3 }}
          viewport={{ once: true, margin: '-50px' }}
          whileHover={prefersReduced ? undefined : { rotate: -2, y: -4 }}
          transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          className="relative w-full max-w-3xl px-6 sm:px-14 md:px-20 py-14 sm:py-20 text-center select-none shadow-[0_20px_50px_rgba(0,0,0,0.08),0_10px_20px_rgba(0,0,0,0.04)] will-change-transform rounded-sm"
          style={{
            backgroundImage: "url('/paper-texture.png')",
            backgroundColor: '#FAF9F6',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Top Illustration: Arched "THE MISSION" + Hand-drawn Target */}
          <div className="relative flex flex-col items-center justify-center mb-6 sm:mb-8">
            {/* Arched "THE MISSION" typography on SVG path */}
            <svg
              viewBox="0 0 300 80"
              className="w-48 sm:w-60 h-auto overflow-visible select-none pointer-events-none"
              aria-label="THE MISSION"
            >
              <path
                id="mission-text-arc"
                d="M 20,80 A 130,80 0 0,1 280,80"
                fill="none"
              />
              <text
                className="font-editorial uppercase text-lg sm:text-2xl tracking-[0.28em] font-normal"
                fill="#111111"
              >
                <textPath href="#mission-text-arc" startOffset="50%" textAnchor="middle">
                  THE MISSION
                </textPath>
              </text>
            </svg>

            {/* Authentic Hand-drawn Target Illustration */}
            <img
              src="/mission-target.png"
              alt="The Mission Target Illustration"
              className="w-40 sm:w-52 h-auto -mt-6 sm:-mt-8 select-none pointer-events-none object-contain"
              loading="lazy"
            />
          </div>

          {/* Mission Statement — Instrument Serif 400 upright */}
          <h2 className="font-editorial text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] font-normal text-neutral-900 leading-[1.12] sm:leading-[1.16] tracking-tight max-w-2xl mx-auto">
            By 2026, cultivate an elite cyber defense force in Kerala to protect digital infrastructure and equip 1,000 young defenders with the skills to innovate and secure the future.
          </h2>

          {/* Sub-description — General Sans */}
          <p className="font-sans text-xs sm:text-sm md:text-base text-neutral-600 max-w-lg mx-auto leading-relaxed mt-4 sm:mt-6">
            We achieve this through hands-on adversary simulation,
            real-world wargames, and community-based defense learning at KMCT.
          </p>

          {/* Bottom Navigation Cue with Radiating Ticks */}
          <div className="mt-8 sm:mt-12 flex flex-col items-center justify-center">
            {/* Top 3 radiating ticks */}
            <svg width="24" height="14" viewBox="0 0 24 14" fill="none" className="text-neutral-500 mb-1.5" aria-hidden="true">
              <line x1="12" y1="1" x2="12" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="4" y1="3" x2="9" y2="9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="20" y1="3" x2="15" y2="9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>

            {/* Horizontal Rules + Text */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 w-full">
              <div className="w-8 sm:w-16 h-px bg-neutral-400" />
              <a
                href="#events"
                className="font-sans text-xs sm:text-sm text-neutral-700 hover:text-black transition-colors select-none tracking-normal cursor-pointer"
              >
                explore symposium schedule
              </a>
              <div className="w-8 sm:w-16 h-px bg-neutral-400" />
            </div>

            {/* Bottom 3 radiating ticks pointing downwards */}
            <svg width="24" height="14" viewBox="0 0 24 14" fill="none" className="text-neutral-500 mt-1.5" aria-hidden="true">
              <line x1="12" y1="13" x2="12" y2="6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="4" y1="11" x2="9" y2="5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <line x1="20" y1="11" x2="15" y2="5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
