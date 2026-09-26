'use client';

import React from 'react';
import { VelocityMarquee } from '@/components/motion/VelocityMarquee';
import { BrutalistButton } from '@/components/ui/BrutalistButton';
import { MagneticWrapper } from '@/components/motion/MagneticWrapper';

export const HeroSection: React.FC = () => {
  return (
    <section
      id="vision"
      className="relative min-h-screen flex flex-col justify-between bg-graph-paper overflow-hidden pt-24 sm:pt-28 pb-12 sm:pb-16"
    >
      {/* ─── 1. TOP TICKER RIBBON (BELOW FLOATING HEADER) ─── */}
      <div className="w-full relative z-20 mb-6 sm:mb-8">
        <VelocityMarquee
          items={[
            'ASTRA 2026',
            'OCTOBER 6 & 7',
            'KMCT CALICUT, KERALA',
            'NATIONAL CYBER SECURITY',
            '24H CTF WARGAMES',
            '₹100,000+ BOUNTIES',
            'ZERO-DAY DEFENSE',
            'ETHICAL HACKATHON',
          ]}
          bgColor="#F79CFF"
          textColor="#000000"
          baseVelocity={0.35}
          separator="✦"
          className="border-y-2 border-black py-2 shadow-[0px_3px_0px_#000]"
        />
      </div>

      {/* ─── 2. MAIN HERO STAGE ─── */}
      <div className="flex-grow flex flex-col items-center justify-center px-4 sm:px-8 md:px-12 relative z-10 max-w-7xl mx-auto w-full">

        {/* Subtitle with Authentic TinkerHub Editorial Styling */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-3 sm:mb-6 select-none mt-4 sm:mt-0">
          <p className="font-editorial italic text-base sm:text-xl md:text-2xl text-gray-600 tracking-wide text-center">
            the arena between
          </p>
        </div>

        {/* Massive Pixel Art Headline */}
        <h1 className="font-pixel text-[clamp(2.5rem,10vw,10rem)] font-bold text-center leading-[0.92] sm:leading-[0.88] tracking-tight text-black uppercase select-none relative max-w-full break-words">
          <span>EXPLOIT</span>
          <span className="relative inline-block mx-1.5 sm:mx-4">
            <span
              className="text-[#C3FF16] font-editorial italic font-normal inline-block hover:scale-110 hover:rotate-6 transition-transform duration-200 cursor-default"
              style={{
                WebkitTextStroke: '2px #000',
                textShadow: '4px 4px 0 #000',
              }}
            >
              &amp;
            </span>
          </span>
          <br className="sm:hidden" />
          <span>DEFEND</span>
        </h1>

        {/* Body Description - General Sans 400 matching reference */}
        <p className="mt-4 sm:mt-8 font-sans text-base sm:text-lg md:text-xl text-gray-800 text-center max-w-2xl leading-relaxed px-2">
          ASTRA is a National Cyber Security Symposium — working towards
          building elite cyber defense practitioners in Kerala.
        </p>

        {/* Action CTAs with Magnetic Effect */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 relative z-20 w-full sm:w-auto max-w-xs sm:max-w-none">
          <MagneticWrapper strength={0.25} className="w-full sm:w-auto">
            <BrutalistButton
              href="/events"
              size="lg"
              variant="primary"
              withArrow
              className="w-full sm:w-auto text-center justify-center"
            >
              Claim Event Pass
            </BrutalistButton>
          </MagneticWrapper>
          <MagneticWrapper strength={0.25} className="w-full sm:w-auto">
            <BrutalistButton
              href="/events"
              size="lg"
              variant="secondary"
              className="w-full sm:w-auto text-center justify-center"
            >
              Explore Events Schedule
            </BrutalistButton>
          </MagneticWrapper>
        </div>

        {/* Sub-credit */}
        <p className="mt-6 font-sans text-xs sm:text-sm text-gray-400 text-center max-w-xl">
          Presented by the Department of Cyber Security, KMCT Institute of Emerging Technology and Management — Oct 6 &amp; 7, 2026
        </p>
      </div>
    </section>
  );
};
