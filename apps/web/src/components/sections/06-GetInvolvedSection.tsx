'use client';

import React from 'react';
import { PaperCard } from '@/components/ui/PaperCard';
import { VelocityMarquee } from '@/components/motion/VelocityMarquee';

const actions = [
  {
    number: '01',
    title: 'REGISTER',
    description: 'Join the 24H National CTF WarGames at KMCT Calicut.',
  },
  {
    number: '02',
    title: 'VOLUNTEER',
    description: 'Help organize ASTRA 2026 and be part of the core team.',
  },
  {
    number: '03',
    title: 'SPONSOR',
    description: 'Partner with the Department of Cyber Security at KMCT.',
  },
];

export const GetInvolvedSection: React.FC = () => {
  return (
    <section id="get-involved" className="relative bg-gingham overflow-hidden">
      {/* ── Transition Seam: Black Journey above meeting Gingham below with Unclipped Pink Ribbon ── */}
      <div
        className="relative w-full overflow-hidden py-3 sm:py-4"
        style={{ background: '#000000' }}
      >
        {/* Bottom 50% is gingham underlay, hidden directly behind the ribbon across entire width */}
        <div className="absolute inset-x-0 bottom-0 h-[50%] bg-gingham pointer-events-none" />

        {/* Pink marquee ribbon (full-height, unclipped, tilted between the two slides) */}
        <div className="relative z-10 w-full -rotate-1 scale-105">
          <VelocityMarquee
            items={['ASTRA 2026', 'A DECADE OF IMPACT', 'KMCT CALICUT', 'SOVEREIGN CYBER DEFENSE']}
            bgColor="#F79CFF"
            textColor="#000000"
            baseVelocity={0.35}
            separator="✦"
            className="border-y-2 border-black py-2.5 shadow-[0_4px_10px_rgba(0,0,0,0.12)]"
          />
        </div>
      </div>

      {/* Main Gingham Content */}
      <div className="pt-8 sm:pt-12 pb-20 sm:pb-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-12 flex flex-col items-center relative z-20">
        {/* Receipt Container with Serrated Top Edge */}
        <div className="w-full max-w-lg relative rotate-[1.5deg] hover:rotate-0 transition-transform duration-200">
          {/* Serrated Zigzag Paper Top Edge */}
          <div className="w-full h-3.5 overflow-hidden -mb-[1px]">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 14" fill="none">
              <path
                d="M0,14 L10,0 L20,14 L30,0 L40,14 L50,0 L60,14 L70,0 L80,14 L90,0 L100,14 L110,0 L120,14 L130,0 L140,14 L150,0 L160,14 L170,0 L180,14 L190,0 L200,14 L210,0 L220,14 L230,0 L240,14 L250,0 L260,14 L270,0 L280,14 L290,0 L300,14 L310,0 L320,14 L330,0 L340,14 L350,0 L360,14 L370,0 L380,14 L390,0 L400,14 Z"
                fill="#FAFAFA"
              />
            </svg>
          </div>

          {/* Main White Receipt Body */}
          <div className="paper-texture p-6 sm:p-9 border-x-2 border-b-2 border-black relative">
            {/* Top Micro-label */}
            <p className="font-body text-[11px] sm:text-xs tracking-widest text-gray-500 text-center mb-5 uppercase font-medium">
              BE VIGILANT.
            </p>

            {/* Main Heading in Pixel Font matching Image 4 */}
            <div className="flex items-start justify-between mb-6 pb-2 border-b border-black">
              <h2 className="font-pixel text-4xl sm:text-5xl font-black text-black leading-[0.88] tracking-tight uppercase">
                GET<br />INVOLVED
              </h2>
              <a
                href="#register"
                className="text-black hover:text-gray-600 transition-colors flex-shrink-0 mt-1"
                aria-label="View all involvement options"
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </a>
            </div>

            {/* Action Items */}
            <div className="space-y-0">
              {actions.map((action) => (
                <div key={action.number}>
                  <a
                    href="#register"
                    className="group -mx-2 px-2 py-4 sm:py-5 flex items-start justify-between gap-4 transition-colors duration-160 hover:bg-black/5 cursor-pointer block select-none"
                    aria-label={`Learn more about ${action.title}`}
                  >
                    <div className="flex items-start gap-4">
                      <span className="font-serif italic text-base sm:text-lg text-gray-400 group-hover:text-black transition-colors duration-160 flex-shrink-0 mt-0.5 font-normal">
                        {action.number}
                      </span>
                      <div>
                        <h3 className="font-display text-xl sm:text-2xl uppercase text-black mb-1 leading-none group-hover:text-black flex items-center gap-2">
                          {action.title}
                        </h3>
                        <p className="font-body text-xs sm:text-sm text-gray-600 leading-relaxed">
                          {action.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-black transition-transform duration-160 ease-[var(--ease-out)] group-hover:translate-x-1 group-hover:-translate-y-1 flex-shrink-0 mt-1">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17L17 7M17 7H7M17 7V17" />
                      </svg>
                    </div>
                  </a>
                  {/* Dotted separator between items */}
                  <div className="border-t border-dashed border-gray-400" />
                </div>
              ))}
            </div>

            {/* Bottom Receipt Label */}
            <p className="font-body text-xs uppercase tracking-widest text-gray-500 text-center mt-6 font-medium">
              MAKE A CHANGE.
            </p>

            {/* Tactile Potted Plant / Terminal Sticker on Bottom Right (Image 4 Signature) */}
            <div className="absolute -bottom-6 right-0 sm:-right-6 z-30 transform rotate-6 hover:rotate-0 transition-transform duration-200 pointer-events-auto">
              <div className="bg-white border-2 border-black p-2 flex flex-col items-center">
                <span className="text-2xl">🪴</span>
                <span className="font-pixel text-[8px] uppercase tracking-tighter text-black font-bold">
                  COMMUNITY
                </span>
                <span className="font-body text-[7px] text-gray-600 uppercase font-semibold">
                  IS MY STRENGTH
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  );
};
