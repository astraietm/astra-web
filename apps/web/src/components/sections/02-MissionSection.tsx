'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export const MissionSection: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], [40, 0]);
  const rawRotate = useTransform(scrollYProgress, [0, 1], [-4, -2.5]);
  const cardY = useSpring(rawY, { stiffness: 80, damping: 20 });
  const cardRotate = useSpring(rawRotate, { stiffness: 80, damping: 20 });

  return (
    <section
      ref={ref}
      id="mission"
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #A8D4FF 0%, #CDEAFF 30%, #EAF4FF 60%, #F5F5F0 80%, #EEEEE8 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '6rem',
        paddingBottom: '6rem',
      }}
    >
      {/* Subtle cloud atmosphere */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(255,255,255,0.5) 0%, transparent 70%)',
            width: '50%',
            height: '30%',
            top: '5%',
            left: '-5%',
            filter: 'blur(30px)',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            background: 'radial-gradient(ellipse, rgba(255,255,255,0.4) 0%, transparent 70%)',
            width: '40%',
            height: '25%',
            top: '10%',
            right: '5%',
            filter: 'blur(25px)',
          }}
        />
      </div>

      {/* The large tilted paper card */}
      <motion.div
        style={{
          y: cardY,
          rotate: cardRotate,
        }}
        className="relative will-change-transform"
      >
        <div
          className="w-[90vw] max-w-[340px] sm:max-w-none sm:w-[520px] md:w-[680px] lg:w-[780px] p-6 sm:p-14 md:p-16"
          style={{
            background: '#F2EEE6',
            backgroundImage: `
              url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")
            `,
          }}
        >
          {/* "THE MISSION" curved label with target icon */}
          <div className="flex justify-center mb-8" aria-hidden="true">
            <svg
              width="140"
              height="130"
              viewBox="0 0 140 130"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-gray-900"
            >
              {/* Curved text path */}
              <defs>
                <path id="arc" d="M 20 80 A 50 50 0 0 1 120 80" />
              </defs>
              <text fill="currentColor" fontFamily="Georgia, serif" fontSize="12" letterSpacing="4">
                <textPath href="#arc" textAnchor="middle" startOffset="50%">
                  THE MISSION
                </textPath>
              </text>
              {/* Target / bullseye */}
              <circle cx="70" cy="88" r="30" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <circle cx="70" cy="88" r="20" stroke="currentColor" strokeWidth="1.2" fill="none" />
              <circle cx="70" cy="88" r="10" stroke="currentColor" strokeWidth="1.2" fill="none" />
              <circle cx="70" cy="88" r="3" fill="currentColor" />
              {/* Arrow piercing */}
              <line x1="20" y1="55" x2="67" y2="86" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <polyline points="20,55 28,52 24,60" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              {/* Decorative line beneath */}
              <path d="M 30 118 Q 70 125 110 118" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4" />
            </svg>
          </div>

          {/* Mission statement — large serif italic (matches TinkerHub exactly) */}
          <p
            className="text-2xl sm:text-3xl md:text-[2.1rem] leading-snug text-gray-900 text-center mb-8"
            style={{
              fontFamily: '"Instrument Serif", Georgia, serif',
              fontStyle: 'italic',
              fontWeight: 400,
            }}
          >
            By 2026, cultivate an elite cyber defense force in Kerala to protect digital infrastructure and equip 1,000 young defenders with the skills to innovate and secure the future.
          </p>

          {/* Sub-description */}
          <p
            className="text-sm sm:text-base text-gray-600 leading-relaxed text-center max-w-md mx-auto mb-10"
            style={{ fontFamily: '"General Sans", system-ui, sans-serif' }}
          >
            We achieve this through hands-on adversary simulation, real-world wargames, and community-based defense learning at KMCT.
          </p>

          {/* CTA link — matches TinkerHub's "check our vision here" with arrow */}
          <div className="flex flex-col items-center gap-1">
            <a
              href="#stories"
              className="group flex flex-col items-center gap-1 text-gray-700 hover:text-black transition-colors"
              aria-label="View arena stories"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-px bg-gray-400" />
                <span
                  className="text-sm text-gray-600 group-hover:text-black transition-colors"
                  style={{
                    fontFamily: '"Instrument Serif", Georgia, serif',
                    fontStyle: 'italic',
                  }}
                >
                  check arena stories here
                </span>
                <div className="w-10 h-px bg-gray-400" />
              </div>
              {/* Animated down-arrow + up-arrow like TinkerHub */}
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="mt-1 animate-bounce opacity-60">
                <path d="M9 3 L5 10 L9 8 L13 10 Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <line x1="9" y1="10" x2="9" y2="15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="opacity-60">
                <path d="M9 15 L5 8 L9 10 L13 8 Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <line x1="9" y1="8" x2="9" y2="3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
