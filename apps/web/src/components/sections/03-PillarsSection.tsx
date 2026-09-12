'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { VelocityMarquee } from '@/components/motion/VelocityMarquee';
import { PaperCard } from '@/components/ui/PaperCard';
import { ParallaxLayer } from '@/components/motion/ParallaxLayer';

const pillars = [
  {
    number: '01',
    title: 'Offensive Security',
    description:
      'We teach offensive techniques not to destroy, but to deeply understand attacker tradecraft and expose critical architectural blindspots.',
  },
  {
    number: '02',
    title: 'Blue-Team Defense',
    description:
      'Engineering real-time telemetry, memory introspection, and threat intelligence pipelines to detect and neutralize advanced persistent threats.',
  },
  {
    number: '03',
    title: 'Cyber Research',
    description:
      'Advancing indigenous research at KMCT in post-quantum cryptography, AI-driven malware detection, and embedded IoT security.',
  },
  {
    number: '04',
    title: 'Community Building',
    description:
      'Witnessing how even small actions can positively impact someone\'s career, fosters empathy and collaboration. Volunteering can be transformative.',
  },
];

export const PillarsSection: React.FC = () => {
  return (
    <section id="pillars" className="relative overflow-hidden">
      {/* Velocity-Linked Yellow Marquee Ticker (Slow & Readable) */}
      <VelocityMarquee
        items={[
          'SECURITY IS A SUPERPOWER',
          "DON'T HACK SOLO",
          'DEFEND THE FUTURE',
          'SKILLS PAY THE BOUNTY',
          'BE ETHICAL',
        ]}
        bgColor="#FFE816"
        textColor="#000000"
        baseVelocity={0.35}
        separator="✦"
        className="border-y-2 border-black py-2 shadow-[0px_3px_0px_#000]"
      />

      {/* Blue Sky Background Section with Parallax Atmosphere */}
      <div
        className="relative py-16 sm:py-24 md:py-32 overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #4A9EFF 0%, #6BB3FF 40%, #8EC8FF 70%, #B0D9FF 100%)',
        }}
      >
        {/* Parallax Cloud-like patches */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <ParallaxLayer speed={-30} className="absolute inset-0">
            <div
              className="absolute w-[600px] h-[300px] rounded-full opacity-30"
              style={{
                background: 'radial-gradient(ellipse, white 0%, transparent 70%)',
                top: '15%',
                right: '-5%',
              }}
            />
          </ParallaxLayer>
          <ParallaxLayer speed={40} className="absolute inset-0">
            <div
              className="absolute w-[500px] h-[250px] rounded-full opacity-25"
              style={{
                background: 'radial-gradient(ellipse, white 0%, transparent 70%)',
                top: '45%',
                left: '-10%',
              }}
            />
          </ParallaxLayer>
        </div>

        {/* Marble Columns (hidden on mobile, visible on desktop) */}
        <div className="hidden md:block absolute left-4 sm:left-8 top-0 bottom-0 w-12 sm:w-20 pointer-events-none" aria-hidden="true">
          <div className="h-full w-full flex flex-col items-center">
            <div className="w-full h-16 sm:h-20 bg-gradient-to-b from-gray-200 to-gray-300 rounded-t-lg border border-gray-400" style={{ clipPath: 'polygon(10% 100%, 90% 100%, 100% 0%, 0% 0%)' }} />
            <div className="flex-grow w-3/4 bg-gradient-to-r from-gray-200 via-white to-gray-200 border-x border-gray-300" />
          </div>
        </div>
        <div className="hidden md:block absolute right-4 sm:right-8 top-0 bottom-0 w-12 sm:w-20 pointer-events-none" aria-hidden="true">
          <div className="h-full w-full flex flex-col items-center">
            <div className="w-full h-16 sm:h-20 bg-gradient-to-b from-gray-200 to-gray-300 rounded-t-lg border border-gray-400" style={{ clipPath: 'polygon(10% 100%, 90% 100%, 100% 0%, 0% 0%)' }} />
            <div className="flex-grow w-3/4 bg-gradient-to-r from-gray-200 via-white to-gray-200 border-x border-gray-300" />
          </div>
        </div>

        {/* Content */}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-12 md:px-20">
          {/* Section subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-editorial italic text-lg sm:text-xl md:text-2xl text-white/90 text-center mb-10 sm:mb-16"
          >
            Our four pillars that guide us
          </motion.p>

          {/* Pillar Items with Staggered In-View Spring Reveals */}
          <div className="space-y-8 sm:space-y-14">
            {pillars.map((pillar, idx) => (
              <motion.div
                key={pillar.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  type: 'spring',
                  stiffness: 240,
                  damping: 22,
                  delay: idx * 0.08,
                }}
                className="flex items-start gap-4 sm:gap-8 md:gap-12"
              >
                {/* Number */}
                <span className="font-editorial italic text-3xl sm:text-5xl md:text-6xl text-white/80 flex-shrink-0 mt-1 select-none">
                  {pillar.number}
                </span>

                {/* Content */}
                <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-6 flex-grow">
                  {/* Title */}
                  <h3 className="font-pixel text-lg sm:text-2xl md:text-3xl text-white font-bold flex-shrink-0">
                    {pillar.title}
                  </h3>

                  {/* Paper Card with description */}
                  <PaperCard
                    rotation={idx % 2 === 0 ? 1.5 : -1.5}
                    size="sm"
                    className="w-full sm:max-w-sm p-4 sm:p-5"
                  >
                    <p className="font-editorial text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed text-center">
                      {pillar.description}
                    </p>
                  </PaperCard>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
