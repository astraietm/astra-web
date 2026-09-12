'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { VelocityMarquee } from '@/components/motion/VelocityMarquee';
import { ParallaxLayer } from '@/components/motion/ParallaxLayer';
import { DraggableSticker } from '@/components/motion/DraggableSticker';
import { PixelDots } from '@/components/visual/PixelDots';
import { BrutalistButton } from '@/components/ui/BrutalistButton';
import { MagneticWrapper } from '@/components/motion/MagneticWrapper';
import { Shield, Terminal, Calendar, MapPin, Award, ArrowDown } from 'lucide-react';

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
          baseVelocity={1.2}
          className="border-y-2 border-black py-1.5 shadow-[0px_4px_0px_#000]"
        />
      </div>

      {/* ─── 2. MAIN HERO STAGE ─── */}
      <div className="flex-grow flex flex-col items-center justify-center px-4 sm:px-8 md:px-12 relative z-10 max-w-7xl mx-auto w-full">
        <PixelDots count={12} />

        {/* Floating Draggable Stickers Layer (TinkerHub Signature Playful Feature) */}
        <div className="absolute inset-0 pointer-events-none z-30">
          {/* Top Left Sticker */}
          <div className="absolute top-2 left-4 sm:left-12 pointer-events-auto">
            <DraggableSticker color="lime" initialRotation={-6} size="sm">
              24H WARGAMES ⚡
            </DraggableSticker>
          </div>

          {/* Top Right Sticker */}
          <div className="absolute top-4 right-4 sm:right-16 pointer-events-auto">
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

        {/* Subtitle Tag */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
          className="flex items-center gap-2 bg-black text-[#C3FF16] px-3.5 py-1.5 border-2 border-black shadow-[3px_3px_0px_#000] mb-5 sm:mb-6 select-none"
        >
          <Terminal className="w-3.5 h-3.5" />
          <span className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider">
            THE ARENA BETWEEN ATTACK &amp; DEFENSE
          </span>
        </motion.div>

        {/* Massive Pixel Art Headline */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.96, y: 18 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1], delay: 0.08 }}
          className="font-pixel text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-center leading-[0.92] tracking-tight text-black uppercase select-none relative"
        >
          <span>EXPLOIT</span>
          <span className="relative inline-block mx-2 sm:mx-4">
            <span
              className="text-[#C3FF16] inline-block hover:scale-110 hover:rotate-6 transition-transform duration-200 cursor-default"
              style={{ WebkitTextStroke: '2px #000' }}
            >
              &amp;
            </span>
          </span>
          <br className="sm:hidden" />
          <span>DEFEND</span>
        </motion.h1>

        {/* Editorial Subtitle Description */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1], delay: 0.18 }}
          className="mt-5 sm:mt-7 font-editorial italic text-lg sm:text-xl md:text-2xl text-gray-800 text-center max-w-2xl leading-relaxed"
        >
          ASTRA is Kerala&apos;s Flagship National Cyber Security Conclave — uniting elite researchers, ethical hackers, and defenders of the digital frontier.
        </motion.p>

        {/* Live Info Matrix Pills */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1], delay: 0.25 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-mono font-bold"
        >
          <div className="flex items-center gap-1.5 bg-white border-2 border-black px-3 py-1 shadow-[2px_2px_0px_#000]">
            <Calendar className="w-3.5 h-3.5 text-black" />
            <span>OCT 6 &amp; 7, 2026</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white border-2 border-black px-3 py-1 shadow-[2px_2px_0px_#000]">
            <MapPin className="w-3.5 h-3.5 text-black" />
            <span>KMCT IETM CALICUT</span>
          </div>
          <div className="flex items-center gap-1.5 bg-th-yellow border-2 border-black px-3 py-1 shadow-[2px_2px_0px_#000]">
            <Award className="w-3.5 h-3.5 text-black" />
            <span>₹100K+ PRIZES</span>
          </div>
        </motion.div>

        {/* Action CTAs with Magnetic Effect */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1], delay: 0.32 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4 relative z-20"
        >
          <MagneticWrapper strength={0.25}>
            <BrutalistButton
              href="/events#pass-registration"
              size="lg"
              variant="primary"
              withArrow
              className="id-hero-claim-btn"
            >
              Claim Conclave Pass
            </BrutalistButton>
          </MagneticWrapper>
          <MagneticWrapper strength={0.25}>
            <BrutalistButton
              href="/events"
              size="lg"
              variant="secondary"
              className="id-hero-explore-btn"
            >
              Explore 6 Events
            </BrutalistButton>
          </MagneticWrapper>
        </motion.div>

        {/* Institution Sub-credit */}
        <p className="mt-6 font-mono text-[11px] sm:text-xs text-gray-500 text-center max-w-xl">
          Organized by Department of Cyber Security, KMCT Institute of Emerging Technology and Management
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


