'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { VelocityMarquee } from '@/components/motion/VelocityMarquee';

const pillars = [
  {
    number: '01',
    name: 'Offensive\nSecurity',
    tagline: 'Learning Paradigm',
    description:
      'Build a culture of deep security research that connects, inspires, and engages students. Enabling hands-on adversarial simulation and interdisciplinary exploration will empower students to be makers.',
  },
  {
    number: '02',
    name: 'Blue-Team\nDefense',
    tagline: 'Defensive Resilience',
    description:
      'The power lies with the builders. Engineering real-time telemetry, memory introspection, and threat intelligence pipelines to detect and neutralize advanced persistent threats in live environments.',
  },
  {
    number: '03',
    name: 'Cyber\nResearch',
    tagline: 'Doing Good',
    description:
      'Advancing indigenous research at KMCT in post-quantum cryptography, AI-driven malware detection, and embedded IoT security. Witnessing how shared curiosity fosters true innovation. Publish. Present. Pioneer.',
  },
  {
    number: '04',
    name: 'Community\nBuilding',
    tagline: 'The Collective',
    description:
      "Witnessing how even small actions can positively impact someone's trajectory fosters lifelong empathy and collaboration. Collective volunteering in cyber defense is transformative.",
  },
];

export const PillarsSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay handled by browser policy
      });
    }
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (progress) => {
      // 4 pillars: divide scroll distance into 4 balanced segments
      const step = Math.min(
        pillars.length - 1,
        Math.max(0, Math.floor(progress * pillars.length))
      );
      setActive(step);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  const current = pillars[active];

  return (
    <section
      ref={containerRef}
      id="pillars"
      className="relative w-full h-[280vh]"
      style={{
        background:
          'linear-gradient(180deg, #1877F2 0%, #389BFF 35%, #58AEFF 65%, #3884D4 76%, #1E5594 85%, #0C2B54 92%, #030F22 97%, #000000 100%)',
      }}
    >
      {/* ── Sticky Pinned Viewport Stage ── */}
      <div
        className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between"
        style={{
          background:
            'linear-gradient(180deg, #1877F2 0%, #389BFF 35%, #58AEFF 65%, #3884D4 76%, #1E5594 85%, #0C2B54 92%, #030F22 97%, #000000 100%)',
        }}
      >
        {/* ── 1. Yellow Velocity Marquee at Top with INDEX Badge ── */}
        <div className="relative z-30 w-full">
          <VelocityMarquee
            items={[
              'DON’T FLY SOLO',
              'BE KIND',
              'SKILLS PAY THE BILLS',
              'CODING IS A SUPERPOWER',
              'DEFEND THE FUTURE',
              'SECURITY IS A SUPERPOWER',
            ]}
            bgColor="#FFE816"
            textColor="#000000"
            baseVelocity={0.35}
            separator="✦"
            className="border-y-2 border-black py-2.5"
          />
        </div>

        {/* ── 2. Moving Sky & Clouds Video (Continuous S-Curve Eased Fade) ── */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{
            WebkitMaskImage:
              'linear-gradient(to bottom, black 0%, black 72%, rgba(0,0,0,0.96) 78%, rgba(0,0,0,0.85) 84%, rgba(0,0,0,0.65) 90%, rgba(0,0,0,0.38) 95%, rgba(0,0,0,0.12) 98%, transparent 100%)',
            maskImage:
              'linear-gradient(to bottom, black 0%, black 72%, rgba(0,0,0,0.96) 78%, rgba(0,0,0,0.85) 84%, rgba(0,0,0,0.65) 90%, rgba(0,0,0,0.38) 95%, rgba(0,0,0,0.12) 98%, transparent 100%)',
          }}
          aria-hidden="true"
        >
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/images/sky-clouds.webp"
            className="w-full h-full object-cover opacity-95"
          >
            <source src="/images/sky-clouds-loop.webm" type="video/webm" />
            <source src="/images/sky-clouds-loop.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Atmospheric Sky Overlay: subtle blue enhancement at top */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(24, 119, 242, 0.2) 0%, rgba(51, 153, 255, 0.05) 30%, transparent 60%)',
          }}
          aria-hidden="true"
        />

        {/* ── 3. Classical Marble Columns (Exactly Framing the Scene like Reference) ── */}

        {/* A. Top-Left Classical Column (Visible on all screens) */}
        {/* Capital is at top-left, shaft tilts down-left outwards */}
        <div
          className="absolute -top-6 xs:-top-8 sm:-top-12 md:-top-16 -left-10 xs:-left-12 sm:-left-16 md:-left-20 w-44 xs:w-52 sm:w-64 md:w-80 lg:w-96 pointer-events-none z-10 select-none"
          style={{
            transform: 'rotate(28deg)',
            transformOrigin: '25% 0%',
            filter: 'drop-shadow(15px 20px 35px rgba(0, 15, 45, 0.38))',
          }}
          aria-hidden="true"
        >
          <img
            src="/images/classical-column.webp"
            alt=""
            className="w-full h-auto object-contain"
          />
        </div>

        {/* B. Top-Right Classical Column (Desktop: mirrors top-left framing) */}
        {/* Capital is at top-right, shaft tilts down-right outwards */}
        <div
          className="hidden md:block absolute -top-12 md:-top-16 -right-16 md:-right-20 w-64 md:w-80 lg:w-96 pointer-events-none z-10 select-none"
          style={{
            transform: 'rotate(-28deg)',
            transformOrigin: '75% 0%',
            filter: 'drop-shadow(-15px 20px 35px rgba(0, 15, 45, 0.38))',
          }}
          aria-hidden="true"
        >
          <img
            src="/images/classical-column.webp"
            alt=""
            className="w-full h-auto object-contain"
          />
        </div>

        {/* C. Bottom-Right Classical Column (Mobile: rising up from bottom-right as in mobile reference) */}
        {/* Capital is positioned in lower-right, tilted at -24deg */}
        <div
          className="md:hidden absolute top-[48%] xs:top-[50%] -right-12 xs:-right-10 w-56 xs:w-64 sm:w-72 pointer-events-none z-20 select-none"
          style={{
            transform: 'rotate(-24deg)',
            transformOrigin: 'top center',
            filter: 'drop-shadow(-15px -15px 35px rgba(0, 20, 60, 0.4))',
          }}
          aria-hidden="true"
        >
          <img
            src="/images/classical-column.webp"
            alt=""
            className="w-full h-auto object-contain"
          />
        </div>

        {/* ── 4. Main Pillars Content ── */}
        <div className="relative z-20 flex-1 flex flex-col justify-between max-w-6xl mx-auto w-full px-5 xs:px-8 sm:px-12 md:px-20 py-4 sm:py-8">
          {/* Section Title: "Our four pillars that guides us" */}
          <div className="text-center mt-1 sm:mt-3 mb-2 sm:mb-6">
            <h2
              className="inline-block text-center text-white leading-tight select-none"
              style={{
                fontFamily: '"Instrument Serif", Georgia, serif',
                fontStyle: 'italic',
                fontSize: 'clamp(1.6rem, 4vw, 2.75rem)',
                letterSpacing: '-0.02em',
                textShadow: '0 2px 12px rgba(0, 20, 60, 0.25)',
              }}
            >
              Our four pillars that guides us
            </h2>
          </div>

          {/* Center Stage: Left Ghost Number / Gothic Title, Center Crumpled Paper Card, Right Gothic Title */}
          <div className="flex-1 flex items-center justify-between gap-4 md:gap-8 my-auto w-full">
            {/* Left: Ghost Number with Smooth Cross-Spring */}
            <div className="hidden lg:flex items-center justify-start w-40 xl:w-52 flex-shrink-0 min-h-[140px] relative">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={current.number}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 0.45, y: 0 }}
                  exit={{ opacity: 0, y: -28 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="select-none leading-none block"
                  style={{
                    fontFamily: '"Instrument Serif", Georgia, serif',
                    fontStyle: 'italic',
                    fontWeight: 400,
                    fontSize: 'clamp(7rem, 11vw, 10rem)',
                    color: 'rgba(255,255,255,0.5)',
                    textShadow: '0 4px 20px rgba(0, 20, 60, 0.15)',
                  }}
                  aria-hidden="true"
                >
                  {current.number}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Center: Tactile Editorial Crumpled Paper Card */}
            <div className="flex-1 flex justify-center items-center px-1 sm:px-6 relative min-h-[220px] sm:min-h-[280px]">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={current.number}
                  initial={{
                    opacity: 0,
                    y: 30,
                    rotate: active % 2 === 0 ? -3 : 3,
                    scale: 0.97,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    rotate: active % 2 === 0 ? -1.5 : 1.5,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    y: -30,
                    rotate: active % 2 === 0 ? 2 : -2,
                    scale: 0.97,
                  }}
                  transition={{
                    duration: 0.38,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="w-full max-w-[480px] p-6 sm:p-10 border border-black/80 relative overflow-hidden will-change-transform"
                  style={{
                    backgroundColor: '#EBE6DE',
                    backgroundImage: 'url(/images/crumpled-paper.webp)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    boxShadow: '0 15px 35px -10px rgba(0, 20, 50, 0.25), 0 2px 8px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  {/* Subtle inner paper overlay */}
                  <div
                    className="absolute inset-0 bg-[#F4F0E8]/40 mix-blend-multiply pointer-events-none"
                    aria-hidden="true"
                  />

                  {/* Mobile Pillar Number & Gothic Title */}
                  <div className="lg:hidden relative z-10 mb-3 text-center">
                    <p
                      className="text-xs uppercase tracking-widest text-black/60 font-bold mb-1"
                      style={{ fontFamily: '"General Sans", sans-serif' }}
                    >
                      PILLAR {current.number}
                    </p>
                    <p
                      className="text-2xl text-black/90 tracking-wide"
                      style={{
                        fontFamily: 'var(--font-gothic), "UnifrakturCook", serif',
                      }}
                    >
                      {current.name.replace('\n', ' ')}
                    </p>
                  </div>

                  {/* Editorial Card Description */}
                  <p
                    className="relative z-10 text-center leading-relaxed text-gray-900 select-none"
                    style={{
                      fontFamily: '"Instrument Serif", Georgia, serif',
                      fontSize: 'clamp(1.18rem, 2.3vw, 1.45rem)',
                      lineHeight: 1.55,
                    }}
                  >
                    {current.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right: Editorial Title in Majestic Gothic Blackletter */}
            <div className="hidden lg:flex items-center justify-end w-48 xl:w-72 flex-shrink-0 min-h-[140px] relative">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={current.name}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="block text-right select-none"
                >
                  <span
                    className="block leading-tight text-white drop-shadow-md"
                    style={{
                      fontFamily: 'var(--font-gothic), "UnifrakturCook", serif',
                      fontWeight: 700,
                      fontSize: 'clamp(2.6rem, 4.2vw, 3.8rem)',
                      whiteSpace: 'pre-line',
                      textShadow: '0 4px 16px rgba(0, 20, 60, 0.35)',
                    }}
                  >
                    {current.name}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ── 5. Minimalist Elegant Pill Indicator ── */}
          <div className="relative z-30 flex items-center justify-center gap-2 pt-3 pb-4 select-none pointer-events-none">
            {pillars.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  active === idx ? 'w-8 bg-white shadow-sm' : 'w-2 bg-white/45'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

