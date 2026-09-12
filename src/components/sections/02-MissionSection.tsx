'use client';

import React from 'react';
import { PaperCard } from '@/components/ui/PaperCard';
import { PixelDots } from '@/components/visual/PixelDots';

export const MissionSection: React.FC = () => {
  return (
    <section id="mission" className="relative py-20 sm:py-28 md:py-36 bg-graph-paper overflow-hidden">
      {/* Small pixel dots on the section canvas */}
      <PixelDots count={32} minSize={2.5} maxSize={5} colors={['#F79CFF', '#FFE816', '#C3FF16', '#4A9EFF', '#97F8B7', '#0A0A0A', '#E8CCFF']} opacity={0.75} />

      <div className="max-w-4xl mx-auto px-6 sm:px-12 flex flex-col items-center relative z-10">
        {/* Paper Card — TinkerHub "THE MISSION" style with pixel dots on white canvas */}
        <PaperCard size="lg" className="w-full max-w-2xl text-center" withPixelDots pixelDotsCount={16}>
          {/* Hand-drawn style shield/target illustration */}
          <div className="flex justify-center mb-6" aria-hidden="true">
            <svg
              width="120"
              height="140"
              viewBox="0 0 120 140"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-gray-800"
            >
              {/* Stylized target/shield illustration */}
              <circle cx="60" cy="70" r="40" stroke="currentColor" strokeWidth="2" fill="none" />
              <circle cx="60" cy="70" r="28" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <circle cx="60" cy="70" r="16" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <circle cx="60" cy="70" r="5" fill="currentColor" />
              {/* Arrow piercing the target */}
              <line x1="10" y1="45" x2="55" y2="68" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="10" y1="45" x2="18" y2="42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="10" y1="45" x2="14" y2="52" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              {/* "THE MISSION" text curved around top */}
              <text
                x="60"
                y="20"
                textAnchor="middle"
                className="font-editorial"
                style={{ fontSize: '14px', letterSpacing: '0.15em' }}
                fill="currentColor"
              >
                THE MISSION
              </text>
            </svg>
          </div>

          {/* Mission Statement — large serif italic */}
          <p className="font-editorial italic text-xl sm:text-2xl md:text-3xl text-gray-800 leading-snug mb-6">
            By 2026, cultivate an elite cyber defense force in Kerala to protect digital infrastructure and equip 1,000 young defenders with the skills to innovate and secure the future.
          </p>

          {/* Sub-description */}
          <p className="font-editorial text-sm sm:text-base text-gray-500 leading-relaxed mb-8">
            We achieve this through hands-on adversary simulation,
            real-world wargames, and community-based defense learning at KMCT.
          </p>

          {/* CTA Link */}
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-px bg-gray-400" />
            <a
              href="#stories"
              className="font-editorial italic text-sm text-gray-500 hover:text-black transition-colors inline-flex items-center gap-2"
            >
              check arena stories here
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="animate-bounce">
                <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <div className="w-8 h-px bg-gray-400" />
          </div>
        </PaperCard>
      </div>
    </section>
  );
};
