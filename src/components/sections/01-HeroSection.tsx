'use client';

import React from 'react';
import { VelocityMarquee } from '@/components/motion/VelocityMarquee';
import { ParallaxLayer } from '@/components/motion/ParallaxLayer';
import { DraggableSticker } from '@/components/motion/DraggableSticker';
import { PixelDots } from '@/components/visual/PixelDots';
import { BrutalistButton } from '@/components/ui/BrutalistButton';
import { MagneticWrapper } from '@/components/motion/MagneticWrapper';
import { Shield, Terminal, Calendar, MapPin, Award } from 'lucide-react';

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
            'NATIONAL CYBER CONCLAVE',
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
        <PixelDots count={12} />

        {/* Floating Draggable Stickers Layer (TinkerHub Signature Playful Feature) */}
        <div className="absolute inset-0 pointer-events-none z-30">
          {/* Top Left Sticker */}
          <div className="absolute top-0 sm:top-2 left-2 sm:left-12 pointer-events-auto transform scale-90 sm:scale-100">
            <DraggableSticker color="lime" initialRotation={-6} size="sm">
              24H WARGAMES ⚡
            </DraggableSticker>
          </div>

          {/* Top Right Sticker */}
          <div className="absolute top-1 sm:top-4 right-2 sm:right-16 pointer-events-auto transform scale-90 sm:scale-100">
            <DraggableSticker color="yellow" initialRotation={4} size="sm">
              OCT 6 &amp; 7, 2026 ✦
            </DraggableSticker>
          </div>

          {/* Mid Left Sticker */}
          <div className="absolute top-1/2 left-2 sm:left-8 -translate-y-1/2 pointer-events-auto hidden md:block">
            <DraggableSticker color="pink" initialRotation={-4} size="sm">
              ₹100K+ BOUNTY POOL 🛡️
            </DraggableSticker>
          </div>

          {/* Mid Right Sticker */}
          <div className="absolute top-1/2 right-2 sm:right-10 -translate-y-1/2 pointer-events-auto hidden md:block">
            <DraggableSticker color="mint" initialRotation={5} size="sm">
              KMCT CALICUT 📍
            </DraggableSticker>
          </div>

          {/* Bottom Sticker */}
          <div className="absolute bottom-2 right-8 sm:right-24 pointer-events-auto hidden sm:block">
            <DraggableSticker color="lilac" initialRotation={-3} size="sm">
              [ DRAG ANY STICKER ] 📌
            </DraggableSticker>
          </div>
        </div>

        {/* Subtitle with Authentic TinkerHub Editorial Styling */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-3 sm:mb-6 select-none mt-4 sm:mt-0">
          <p className="font-editorial italic text-base sm:text-xl md:text-2xl text-gray-600 tracking-wide text-center">
            the arena between
          </p>
        </div>

        {/* Massive Pixel Art Headline */}
        <h1 className="font-pixel text-4xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-bold text-center leading-[0.92] sm:leading-[0.88] tracking-tight text-black uppercase select-none relative max-w-full break-words">
          <span>EXPLOIT</span>
          <span className="relative inline-block mx-1.5 sm:mx-4">
            <span
              className="text-[#C3FF16] inline-block hover:scale-110 hover:rotate-6 transition-transform duration-200 cursor-default"
              style={{ WebkitTextStroke: '2px #000' }}
            >
              &amp;
            </span>
          </span>
          <br className="sm:hidden" />
          <span>DEFEND</span>
        </h1>

        {/* Body Description */}
        <p className="mt-4 sm:mt-8 font-editorial text-sm sm:text-lg md:text-xl text-gray-700 text-center max-w-2xl leading-relaxed px-2">
          ASTRA is a National Cyber Security Conclave — working towards
          building elite cyber defense practitioners in Kerala.
        </p>

        {/* Action CTAs with Magnetic Effect */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 relative z-20 w-full sm:w-auto max-w-xs sm:max-w-none">
          <MagneticWrapper strength={0.25} className="w-full sm:w-auto">
            <BrutalistButton
              href="/events#pass-registration"
              size="lg"
              variant="primary"
              withArrow
              className="w-full sm:w-auto text-center justify-center"
            >
              Claim Conclave Pass
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

        {/* Floating Tilted Parallax Card (Left Side) */}
        <div className="hidden xl:block absolute left-2 top-1/3 -translate-x-6 z-10 pointer-events-none">
          <ParallaxLayer speed={-30} rotateRange={[-6, -10]}>
            <div className="paper-texture w-56 p-5 shadow-[6px_6px_0px_#000] border-2 border-black rotate-[-6deg] pointer-events-auto hover:shadow-[10px_10px_0px_#000] transition-shadow duration-200">
              <span className="font-pixel text-[10px] uppercase bg-th-yellow px-2 py-0.5 border border-black font-bold">
                CTF ARENA ⚔️
              </span>
              <p className="font-editorial italic text-base text-gray-900 mt-2 font-bold leading-snug">
                24H National Live WarGames
              </p>
              <p className="font-mono text-[10px] text-gray-600 mt-2 uppercase border-t border-black/10 pt-2">
                KMCT CAMPUS // OCT 6
              </p>
            </div>
          </ParallaxLayer>
        </div>

        {/* Floating Tilted Parallax Card (Right Side) */}
        <div className="hidden xl:block absolute right-2 top-1/4 translate-x-6 z-10 pointer-events-none">
          <ParallaxLayer speed={35} rotateRange={[6, 10]}>
            <div className="paper-texture w-52 p-5 shadow-[6px_6px_0px_#000] border-2 border-black rotate-[6deg] pointer-events-auto hover:shadow-[10px_10px_0px_#000] transition-shadow duration-200">
              <span className="font-pixel text-[10px] uppercase bg-th-lime px-2 py-0.5 border border-black font-bold">
                CYBER DEFENSE 🛡️
              </span>
              <p className="font-editorial italic text-base text-gray-900 mt-2 font-bold leading-snug">
                Defenders of the Future
              </p>
              <p className="font-mono text-[10px] text-gray-600 mt-2 uppercase border-t border-black/10 pt-2">
                DEPT OF CYBER SECURITY
              </p>
            </div>
          </ParallaxLayer>
        </div>
      </div>
    </section>
  );
};



