'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { VelocityMarquee } from '@/components/motion/VelocityMarquee';
import { DraggableSticker } from '@/components/motion/DraggableSticker';
import { PaperCard } from '@/components/ui/PaperCard';
import { NumberCounter } from '@/components/ui/NumberCounter';

export const ImpactSection: React.FC = () => {
  return (
    <section id="impact" className="relative overflow-hidden">
      {/* Pink Velocity Marquee Ticker (Slow & Legible) */}
      <VelocityMarquee
        items={['ASTRA', 'A DECADE OF CYBER DEFENSE', 'ASTRA 2026', 'KMCT CALICUT', '1000+ DELEGATES']}
        bgColor="#F79CFF"
        textColor="#000000"
        baseVelocity={0.35}
        separator="✦"
        className="border-y-2 border-black py-2 shadow-[0px_3px_0px_#000]"
      />

      {/* Sky-blue background matching TinkerHub stats section */}
      <div
        className="relative py-16 sm:py-24 md:py-32 overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #8EC8FF 0%, #B0D9FF 50%, #FFFFFF 100%)',
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-8 md:px-12 relative z-10">
          {/* Flowing Narrative Stats — TinkerHub signature */}
          <PaperCard size="lg" className="text-center shadow-[6px_6px_0px_#000] sm:shadow-[8px_8px_0px_#000] border-2 border-black p-5 sm:p-8 md:p-12">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              className="font-display font-bold text-lg sm:text-2xl md:text-3xl lg:text-4xl text-black leading-snug sm:leading-snug md:leading-normal tracking-tight uppercase"
            >
              WE ARE BUILDING A FORCE OF{' '}
              <span className="font-pixel text-2xl sm:text-4xl md:text-5xl lg:text-6xl inline-block align-middle mx-1 text-black font-extrabold">
                <NumberCounter target={1000} suffix="+" duration={1600} />
              </span>{' '}
              <DraggableSticker color="yellow" initialRotation={3} size="sm">
                DELEGATES
              </DraggableSticker>{' '}
              CYBER WARRIORS WITH OVER{' '}
              <span className="font-pixel text-2xl sm:text-4xl md:text-5xl lg:text-6xl inline-block align-middle mx-1 text-black font-extrabold">
                <NumberCounter target={20} suffix="+" duration={1200} />
              </span>{' '}
              <DraggableSticker color="lime" initialRotation={-2} size="sm">
                PARTNERS
              </DraggableSticker>
              {' '}. TOGETHER, WE&apos;VE HOSTED{' '}
              <span className="font-pixel text-2xl sm:text-4xl md:text-5xl lg:text-6xl inline-block align-middle mx-1 text-black font-extrabold">
                <NumberCounter target={10} suffix="+" duration={1000} />
              </span>{' '}
              <DraggableSticker color="pink" initialRotation={4} size="sm">
                EVENTS
              </DraggableSticker>{' '}
              AND HELPED CREATE{' '}
              <span className="font-pixel text-2xl sm:text-4xl md:text-5xl lg:text-6xl inline-block align-middle mx-1 text-black font-extrabold">
                <NumberCounter target={100} suffix="+" duration={1400} />
              </span>{' '}
              <DraggableSticker color="lilac" initialRotation={-3} size="sm">
                CAREER
              </DraggableSticker>{' '}
              OPPORTUNITIES.
            </motion.p>
          </PaperCard>
        </div>
      </div>
    </section>
  );
};
