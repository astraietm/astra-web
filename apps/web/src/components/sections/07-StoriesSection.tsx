'use client';

import React from 'react';
import Link from 'next/link';
import { BlackBanner } from '@/components/ui/BlackBanner';
import { StickerBadge } from '@/components/ui/StickerBadge';
import { DotMatrixDisplay } from '@/components/ui/DotMatrixDisplay';
import { ImageStreamHero } from '@/components/ui/image-stream-hero';

const GALLERY_STREAM_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    alt: 'Cyber Defense Center & Threat Monitoring',
  },
  {
    src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    alt: 'KMCT Cyber Security Hackathon Squad',
  },
  {
    src: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    alt: 'Binary Exploitation & Memory Analysis',
  },
  {
    src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    alt: 'National Cyber Security Symposium Stage',
  },
  {
    src: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    alt: '24H National CTF Arena WarGames',
  },
  {
    src: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    alt: 'Cryptographic Security & Zero-Day Research',
  },
];

const MOMENTS = [
  {
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    tag: 'CTF ARENA // 2025',
    title: 'Flag Captured at 03:42 AM',
    speaker: 'KMCT Red Team Alpha',
    badge: 'pink' as const,
  },
  {
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    tag: 'KEYNOTE HALL',
    title: 'Zero-Day Vulnerability Keynote',
    speaker: 'National Defense Advisors',
    badge: 'yellow' as const,
  },
  {
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    tag: 'HANDS-ON LABS',
    title: 'Memory Corruption with Ghidra',
    speaker: 'Advanced Labs, Dept of Cyber Sec',
    badge: 'lime' as const,
  },
];

export const StoriesSection: React.FC = () => {
  return (
    <section id="stories" className="relative py-16 sm:py-24 bg-graph-paper">
      <div className="max-w-6xl mx-auto px-6 sm:px-12">
        {/* Header with Dot Matrix Status */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-14">
          <div>
            <BlackBanner size="md">
              STORIES FROM THE ARENA
            </BlackBanner>
            <p className="font-serif italic text-2xl sm:text-3xl text-black mt-3 font-normal">
              Moments of high-stakes exploitation, defense drills, and breakthroughs.
            </p>
          </div>
          <div className="flex-shrink-0">
            <DotMatrixDisplay
              text="LIVE ARCHIVE"
              subtext="KMCT.CYBER.2026"
              variant="green"
              status="ONLINE"
            />
          </div>
        </div>

        {/* ── Dynamic 3D Image Corridor Element ── */}
        <div className="relative mb-12 rounded-xl border-2 border-black overflow-hidden bg-white">
          <ImageStreamHero
            images={GALLERY_STREAM_IMAGES}
            cards={8}
            speed={22}
            axis={50}
            className="h-[340px] sm:h-[420px] w-full bg-[#FAFAFC]"
          >
            <div className="relative z-10 flex h-full flex-col justify-between p-6 pointer-events-none">
              <div className="flex items-center justify-between pointer-events-auto">
                <StickerBadge color="yellow" rotation={-2}>
                  WARGAME GALLERY STREAM
                </StickerBadge>
                <span className="font-pixel text-[10px] bg-black text-white px-2.5 py-1 uppercase">
                  24H ARENA LOG
                </span>
              </div>
              <div className="text-center pointer-events-auto bg-white/80 backdrop-blur-sm border border-black p-4 max-w-md mx-auto">
                <p className="font-pixel text-[10px] text-gray-600 uppercase tracking-wider">
                  [ IMMERSIVE DISPATCH ]
                </p>
                <p className="font-serif italic text-xl sm:text-2xl text-black font-normal">
                  Watch the corridor of hackers, solvers, and cyber architects.
                </p>
                <Link
                  href="/events"
                  className="inline-block mt-2 font-body text-xs font-bold text-black hover:underline"
                >
                  View Full Oct 6-7 Schedule →
                </Link>
              </div>
              <div className="flex justify-between items-center text-[11px] font-pixel text-black/80 pointer-events-auto uppercase">
                <span>✦ 500+ CAPTURED FLAGS</span>
                <span>✦ KMCT IETM CALICUT</span>
              </div>
            </div>
          </ImageStreamHero>
        </div>

        {/* Photo Grid — 3 Cards with Dot Matrix tags & pixel badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOMENTS.map((item, index) => (
            <div
              key={index}
              className="group relative border-2 border-black bg-white overflow-hidden transition-[transform] duration-200 ease-[var(--ease-out)] hover:translate-x-1 hover:-translate-y-1 cursor-pointer"
            >
              {/* Photo */}
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 border-b-2 border-black">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-380 ease-[var(--ease-out)] group-hover:scale-105"
                  loading="lazy"
                />
                {/* Floating Pixel Tag */}
                <div className="absolute top-3 left-3">
                  <StickerBadge color={item.badge} rotation={index % 2 === 0 ? -3 : 3}>
                    {item.tag}
                  </StickerBadge>
                </div>
              </div>

              {/* Card Footer Content */}
              <div className="p-4 bg-white">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-pixel text-[9px] text-gray-500 uppercase tracking-wider">
                    FIELD DISPATCH
                  </span>
                  <span className="font-pixel text-[9px] text-green-700 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse-led" />
                    VERIFIED
                  </span>
                </div>
                <h3 className="font-display font-normal text-xl sm:text-2xl text-black group-hover:text-th-pink transition-colors duration-160 uppercase leading-tight">
                  {item.title}
                </h3>
                <p className="font-serif italic text-base text-gray-600 mt-0.5 font-normal">
                  {item.speaker}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* View Full Gallery Link Button */}
        <div className="mt-10 text-center">
          <Link
            href="/gallery"
            className="inline-block px-7 py-3.5 bg-black text-white font-display text-base uppercase tracking-wider border-2 border-black hover:bg-th-yellow hover:text-black active:scale-[0.98] transition-[background-color,color,transform] duration-160 ease-[var(--ease-out)]"
          >
            VIEW FULL PHOTO GALLERY (8 CAPTURES) →
          </Link>
        </div>
      </div>
    </section>
  );
};
