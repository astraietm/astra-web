'use client';

import React from 'react';
import Link from 'next/link';
import { VelocityMarquee } from '@/components/motion/VelocityMarquee';
import { ParallaxLayer } from '@/components/motion/ParallaxLayer';
import { RectangleButtons } from '@designcodeio/threeui';
import '@designcodeio/threeui/style.css';

export const HeroSection: React.FC = () => {
  return (
    <section
      id="vision"
      className="relative min-h-screen flex flex-col justify-between bg-graph-paper overflow-hidden pt-0 pb-16"
    >
      {/* ─── 1. TOP TICKER RIBBON (TILTED FULL-WIDTH AT VERY TOP LIKE IMAGE 1) ─── */}
      <div className="w-full relative z-20 mb-8 sm:mb-10 pt-3 sm:pt-4 -rotate-1 transform scale-105">
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
          className="border-y-2 border-black py-2 sm:py-2.5"
        />
      </div>

      {/* ─── 2. FLOATING EDITORIAL CARDS (PEEKING FROM WINDOW EDGES LIKE IMAGE 1) ─── */}
      {/* Left Pinned Poster (Tucked into left screen edge) */}
      <div className="hidden lg:block absolute -left-12 sm:-left-16 xl:-left-20 top-[35%] z-10 pointer-events-auto">
        <ParallaxLayer speed={-15} rotateRange={[-12, -12]}>
          <div className="relative">
            {/* Silver Vertical Staple / Pushpin */}
            <div className="w-1.5 h-6 bg-gradient-to-r from-gray-400 via-white to-gray-600 rounded-xs mx-auto -mb-2 relative z-20 border border-gray-500" />
            <div className="paper-texture w-60 sm:w-68 p-6 border border-gray-300 rotate-[-12deg] hover:rotate-[-8deg] transition-transform duration-200">
              <p className="font-serif italic text-2xl sm:text-3xl text-gray-900 leading-tight">
                Astra of The Month
              </p>
              <p className="font-body text-[9px] text-gray-400 uppercase tracking-widest mt-1 font-semibold">
                COLLEGE OF CYBER DEFENSE // KMCT
              </p>
              {/* Purple Radiant Sunburst Badge at bottom */}
              <div className="mt-6 flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-full bg-[#E8CCFF] border border-black flex items-center justify-center text-2xl">
                  <span className="relative z-10">🛡️</span>
                  <div
                    className="absolute inset-0 rounded-full border-2 border-dashed border-purple-400 animate-spin"
                    style={{ animationDuration: '20s' }}
                  />
                </div>
                <div>
                  <p className="font-display text-sm text-black uppercase leading-none">WARGAMES 2026</p>
                  <p className="font-body text-[10px] text-gray-500 mt-1">₹100K Bounty Pool</p>
                </div>
              </div>
            </div>
          </div>
        </ParallaxLayer>
      </div>

      {/* Right Pinned Poster (Tucked into right screen edge) */}
      <div className="hidden lg:block absolute -right-12 sm:-right-16 xl:-right-20 top-[30%] z-10 pointer-events-auto">
        <ParallaxLayer speed={20} rotateRange={[10, 10]}>
          <div className="relative">
            {/* Silver Vertical Staple */}
            <div className="w-1.5 h-6 bg-gradient-to-r from-gray-400 via-white to-gray-600 rounded-xs mx-auto -mb-2 relative z-20 border border-gray-500" />
            <div className="paper-texture w-60 sm:w-68 p-6 border border-gray-300 rotate-[10deg] hover:rotate-[6deg] transition-transform duration-200">
              <p className="font-serif italic text-2xl sm:text-3xl text-gray-900 leading-tight">
                Defenders of The Month
              </p>
              <p className="font-body text-[9px] text-gray-400 uppercase tracking-widest mt-1 font-semibold">
                SREEHARI NANDAN // KMCT CALICUT
              </p>
              {/* Green Radiant Sunburst Circle with Avatar */}
              <div className="mt-6 flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-full bg-[#C3FF16] border border-black flex items-center justify-center text-2xl">
                  <span className="relative z-10">⚔️</span>
                  <div
                    className="absolute inset-0 rounded-full border-2 border-dashed border-lime-500 animate-spin"
                    style={{ animationDuration: '25s' }}
                  />
                </div>
                <div>
                  <p className="font-display text-sm text-black uppercase leading-none">ELITE SQUAD</p>
                  <p className="font-body text-[10px] text-gray-500 mt-1">KMCT Cyber Security</p>
                </div>
              </div>
            </div>
          </div>
        </ParallaxLayer>
      </div>

      {/* ─── 3. MINIMAL SCATTERED PIXEL CONFETTI (MATCHING IMAGE 1 EXACTLY) ─── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Purple dot top-right */}
        <div className="absolute top-[20%] right-[22%] w-2 h-2 bg-[#F79CFF]" />
        {/* Purple dot mid-left */}
        <div className="absolute top-[48%] left-[14%] w-2 h-2 bg-[#7C3AED]" />
        {/* Blue dot mid-right */}
        <div className="absolute top-[42%] right-[18%] w-2 h-2 bg-[#4A9EFF]" />
        {/* Pink dot center-bottom */}
        <div className="absolute bottom-[18%] left-[49%] w-2 h-2 bg-[#F79CFF]" />
        {/* Purple dot bottom-right */}
        <div className="absolute bottom-[15%] right-[24%] w-2 h-2 bg-[#7C3AED]" />
        {/* Lime dot bottom-left */}
        <div className="absolute bottom-[22%] left-[18%] w-2 h-2 bg-[#C3FF16]" />
      </div>

      {/* ─── 4. CLEAN EDITORIAL CENTER STAGE (IDENTICAL TO IMAGE 1) ─── */}
      <div className="flex-grow flex flex-col items-center justify-center px-4 sm:px-8 relative z-10 max-w-4xl mx-auto w-full text-center">
        {/* Small Sans Eyebrow Label matching Image 1 */}
        <p
          className="text-black uppercase select-none tracking-normal text-[22px] xs:text-[28px] sm:text-[34px] md:text-[40px] leading-tight mb-1 sm:mb-2"
          style={{
            fontFamily: '"Bebas Neue", sans-serif',
            fontStyle: 'normal',
            fontWeight: 400,
            color: 'rgb(0, 0, 0)',
          }}
        >
          the arena between
        </p>

        {/* Stacked Pixel Headline with Lime Italic Serif Ampersand */}
        <h1
          className="font-pixel text-5xl sm:text-7xl md:text-9xl lg:text-[10.5rem] font-bold text-center leading-[0.88] tracking-tight text-black uppercase select-none relative max-w-full"
          style={{
            fontFamily: '"SF Pixelate", monospace',
          }}
        >
          <div className="relative inline-flex items-center justify-center">
            <span>EXPLOIT</span>
            <span
              className="font-serif italic text-5xl sm:text-7xl md:text-9xl lg:text-[11.5rem] leading-none inline-block align-middle -ml-1 sm:-ml-2 md:-ml-4 text-[#C3FF16] transition-transform duration-200 hover:scale-105 cursor-default select-none"
              style={{
                WebkitTextStroke: '1.2px #000',
                fontFamily: "'Instrument Serif', Georgia, serif",
              }}
            >
              &amp;
            </span>
          </div>
          <div>DEFEND</div>
        </h1>

        {/* Clean Body Description in General Sans */}
        <p className="mt-5 sm:mt-7 font-body text-sm sm:text-base md:text-lg text-gray-700 text-center max-w-xl leading-relaxed px-2">
          ASTRA is a National Cyber Security Symposium — working towards building elite cyber defense practitioners in Kerala.
        </p>

        {/* Registration Sub-credit in General Sans matching Image 1 */}
        <p className="mt-4 sm:mt-5 font-body text-[10px] sm:text-[11px] text-gray-400 text-center max-w-lg leading-normal">
          Registered as a non-profit academic symposium under KMCT Institute of Emerging Technology and Management, Calicut
        </p>

        {/* Subtle, Clean Action Links with ThreeUI RectangleButtons Dark Glass */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 font-body text-xs sm:text-sm font-semibold uppercase tracking-wider">
          <Link href="/events#pass-registration" className="block focus:outline-none group">
            <div className="shader-frame relative w-[220px] sm:w-[260px] h-[56px] sm:h-[62px] flex items-center justify-center">
              <RectangleButtons
                mode="dark"
                hue={0}
                saturation={1.00}
                brightness={1.00}
              >
                Claim Event Pass ↗
              </RectangleButtons>
            </div>
          </Link>
          <span className="hidden sm:inline-block text-gray-300">|</span>
          <Link
            href="/events"
            className="text-gray-600 hover:text-black transition-colors flex items-center gap-1 py-2"
          >
            Explore Events Schedule →
          </Link>
        </div>
      </div>
    </section>
  );
};
