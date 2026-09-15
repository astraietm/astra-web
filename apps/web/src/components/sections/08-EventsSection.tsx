'use client';

import React from 'react';
import Link from 'next/link';

const events = [
  {
    iconType: 'cyan-butterfly',
    date: 'October 6',
    time: '9:00 AM',
    title: 'Opening Ceremony & Sovereign Defense Keynote',
  },
  {
    iconType: 'orange-cross',
    date: 'October 6',
    time: '11:00 AM',
    title: '24H National Live CTF WarGames Kickoff',
  },
  {
    iconType: 'gold-sun',
    date: 'October 6',
    time: '2:00 PM',
    title: 'Zero-Day Exploit Development Symposium',
  },
  {
    iconType: 'cyan-loop',
    date: 'October 6',
    time: '4:30 PM',
    title: 'Hardware Hacking & IoT Village Live Defense',
  },
  {
    iconType: 'pink-clover',
    date: 'October 6',
    time: '7:30 PM',
    title: 'Memory Corruption with Ghidra Reverse Engineering',
  },
  {
    iconType: 'gold-gear',
    date: 'October 6',
    time: '11:00 PM',
    title: 'Midnight Threat Hunting & Memory Forensics Drill',
  },
  {
    iconType: 'purple-star',
    date: 'October 7',
    time: '9:30 AM',
    title: 'AI in Cyber Defense: From Threat Detection to Adversarial AI',
  },
  {
    iconType: 'cyan-loop',
    date: 'October 7',
    time: '11:30 AM',
    title: 'Bug Bounty Royale: Sovereign Target Assessment',
  },
  {
    iconType: 'green-chevron',
    date: 'October 7',
    time: '1:30 PM',
    title: 'Red vs Blue Team Infrastructure Wargame Simulation',
  },
  {
    iconType: 'green-square',
    date: 'October 7',
    time: '3:30 PM',
    title: 'CTF Finals & ₹100K Bounty Awards Ceremony',
  },
];

const EventGlyph: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case 'cyan-butterfly':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
          <path d="M3 4.5L11 12L3 19.5V4.5Z" fill="#00D8F6" />
          <path d="M21 4.5L13 12L21 19.5V4.5Z" fill="#00D8F6" />
        </svg>
      );
    case 'orange-cross':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
          <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" fill="#F97316" />
          <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" fill="#F97316" />
          <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" fill="#F97316" />
          <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" fill="#F97316" />
        </svg>
      );
    case 'gold-sun':
    case 'gold-gear':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
          <circle cx="12" cy="12" r="9" stroke="#EAB308" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="6" stroke="#EAB308" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="3" stroke="#EAB308" strokeWidth="1.5" />
        </svg>
      );
    case 'cyan-loop':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
          <path d="M7 5C4.5 9 4.5 15 7 19" stroke="#00D8F6" strokeWidth="2" strokeLinecap="round" />
          <path d="M10 3C7 8 7 16 10 21" stroke="#00D8F6" strokeWidth="2" strokeLinecap="round" />
          <path d="M17 5C19.5 9 19.5 15 17 19" stroke="#00D8F6" strokeWidth="2" strokeLinecap="round" />
          <path d="M14 3C17 8 17 16 14 21" stroke="#00D8F6" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'pink-clover':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
          <circle cx="8" cy="8" r="4" fill="#F472B6" />
          <circle cx="16" cy="8" r="4" fill="#F472B6" />
          <circle cx="8" cy="16" r="4" fill="#F472B6" />
          <circle cx="16" cy="16" r="4" fill="#F472B6" />
        </svg>
      );
    case 'purple-star':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
          <path d="M12 2C12 7.5 16.5 12 22 12C16.5 12 12 16.5 12 22C12 16.5 7.5 12 2 12C7.5 12 12 7.5 12 2Z" fill="#7C4DFF" />
        </svg>
      );
    case 'green-square':
    case 'green-chevron':
    default:
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
          <path d="M4 6L12 13L20 6" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 12L12 19L20 12" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
};

/* Floating Event Flyer Card matching TinkerHub hover style */
interface EventFlyerConfig {
  bg: string;
  pillBg: string;
  pillText: string;
  pillLabel: string;
  badge: string;
  illustration: React.ReactNode;
}

const FLYER_CONFIGS: Record<number, EventFlyerConfig> = {
  0: {
    bg: '#1E3A8A',
    pillBg: '#FFE816',
    pillText: '#000000',
    pillLabel: 'KEYNOTE // OPENING',
    badge: 'ASTRA 2026 // CALICUT',
    illustration: (
      <svg width="68" height="68" viewBox="0 0 68 68" fill="none">
        <rect width="68" height="68" fill="#F8FAFC" rx="4" />
        <path d="M34 14 L50 20 V36 C50 48 34 54 34 54 C34 54 18 48 18 36 V20 Z" fill="#1E3A8A" opacity="0.12" />
        <path d="M34 14 L50 20 V36 C50 48 34 54 34 54 C34 54 18 48 18 36 V20 Z" stroke="#1E3A8A" strokeWidth="2.5" />
        <circle cx="34" cy="34" r="8" fill="#00D2EA" />
        <path d="M34 26 V42 M26 34 H42" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  1: {
    bg: '#18181B',
    pillBg: '#FF8C00',
    pillText: '#000000',
    pillLabel: '24H LIVE CTF WARGAME',
    badge: 'FLAGSHIP // ₹100K PRIZE',
    illustration: (
      <svg width="68" height="68" viewBox="0 0 68 68" fill="none">
        <rect width="68" height="68" fill="#27272A" rx="4" />
        <rect x="8" y="12" width="52" height="38" rx="3" fill="#09090B" stroke="#3F3F46" strokeWidth="1.5" />
        <path d="M16 22 L24 28 L16 34" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="28" y1="34" x2="38" y2="34" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="22" y="52" width="24" height="4" rx="1" fill="#52525B" />
      </svg>
    ),
  },
  2: {
    bg: '#78350F',
    pillBg: '#FBBF24',
    pillText: '#000000',
    pillLabel: 'ZERO-DAY SYMPOSIUM',
    badge: 'RESEARCH // DEFENSE',
    illustration: (
      <svg width="68" height="68" viewBox="0 0 68 68" fill="none">
        <rect width="68" height="68" fill="#FFFBEB" rx="4" />
        <circle cx="34" cy="34" r="22" stroke="#D97706" strokeWidth="2" strokeDasharray="4 3" />
        <circle cx="34" cy="34" r="14" fill="#D97706" opacity="0.15" />
        <circle cx="34" cy="34" r="6" fill="#B45309" />
        <line x1="34" y1="8" x2="34" y2="60" stroke="#B45309" strokeWidth="1.5" />
        <line x1="8" y1="34" x2="60" y2="34" stroke="#B45309" strokeWidth="1.5" />
      </svg>
    ),
  },
  3: {
    bg: '#064E3B',
    pillBg: '#34D399',
    pillText: '#000000',
    pillLabel: 'HARDWARE VILLAGE',
    badge: 'SDR & IOT DEFENSE',
    illustration: (
      <svg width="68" height="68" viewBox="0 0 68 68" fill="none">
        <rect width="68" height="68" fill="#ECFDF5" rx="4" />
        <rect x="18" y="18" width="32" height="32" rx="2" fill="#065F46" stroke="#047857" strokeWidth="2" />
        <circle cx="34" cy="34" r="7" fill="#34D399" />
        <line x1="12" y1="24" x2="18" y2="24" stroke="#047857" strokeWidth="2" strokeLinecap="round" />
        <line x1="12" y1="34" x2="18" y2="34" stroke="#047857" strokeWidth="2" strokeLinecap="round" />
        <line x1="12" y1="44" x2="18" y2="44" stroke="#047857" strokeWidth="2" strokeLinecap="round" />
        <line x1="50" y1="24" x2="56" y2="24" stroke="#047857" strokeWidth="2" strokeLinecap="round" />
        <line x1="50" y1="34" x2="56" y2="34" stroke="#047857" strokeWidth="2" strokeLinecap="round" />
        <line x1="50" y1="44" x2="56" y2="44" stroke="#047857" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  4: {
    bg: '#1D4ED8',
    pillBg: '#F43F5E',
    pillText: '#FFFFFF',
    pillLabel: 'MAKER WORKSHOP',
    badge: 'GHIDRA // REVERSE ENG',
    illustration: (
      <svg width="68" height="68" viewBox="0 0 68 68" fill="none">
        <rect width="68" height="68" fill="#EFF6FF" rx="4" />
        <rect x="14" y="16" width="40" height="28" rx="2" fill="#1E40AF" />
        <line x1="20" y1="24" x2="48" y2="24" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
        <line x1="20" y1="30" x2="40" y2="30" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
        <line x1="20" y1="36" x2="34" y2="36" stroke="#F43F5E" strokeWidth="2" strokeLinecap="round" />
        <path d="M42 42 L52 54 L56 50 L46 38 Z" fill="#F43F5E" />
      </svg>
    ),
  },
  5: {
    bg: '#311042',
    pillBg: '#C084FC',
    pillText: '#000000',
    pillLabel: 'MIDNIGHT FORENSICS',
    badge: 'NIGHT DRILL // LIVE',
    illustration: (
      <svg width="68" height="68" viewBox="0 0 68 68" fill="none">
        <rect width="68" height="68" fill="#FAF5FF" rx="4" />
        <circle cx="34" cy="34" r="20" fill="#3B0764" />
        <circle cx="34" cy="34" r="14" stroke="#C084FC" strokeWidth="1.5" strokeDasharray="3 3" />
        <line x1="34" y1="34" x2="44" y2="24" stroke="#F472B6" strokeWidth="2" strokeLinecap="round" />
        <circle cx="44" cy="24" r="3" fill="#F472B6" />
      </svg>
    ),
  },
  6: {
    bg: '#4C1D95',
    pillBg: '#E8CCFF',
    pillText: '#000000',
    pillLabel: 'AI WEDNESDAY // GPT-6',
    badge: 'ADVERSARIAL RESEARCH',
    illustration: (
      <svg width="68" height="68" viewBox="0 0 68 68" fill="none">
        <rect width="68" height="68" fill="#F3E8FF" rx="4" />
        <circle cx="24" cy="24" r="6" fill="#7C3AED" />
        <circle cx="44" cy="24" r="6" fill="#7C3AED" />
        <circle cx="34" cy="44" r="6" fill="#7C3AED" />
        <line x1="24" y1="24" x2="44" y2="24" stroke="#7C3AED" strokeWidth="2" />
        <line x1="24" y1="24" x2="34" y2="44" stroke="#7C3AED" strokeWidth="2" />
        <line x1="44" y1="24" x2="34" y2="44" stroke="#7C3AED" strokeWidth="2" />
        <circle cx="34" cy="31" r="3" fill="#E8CCFF" />
      </svg>
    ),
  },
  7: {
    bg: '#881337',
    pillBg: '#FDA4AF',
    pillText: '#000000',
    pillLabel: 'BUG BOUNTY ROYALE',
    badge: 'LIVE TARGET HUNT',
    illustration: (
      <svg width="68" height="68" viewBox="0 0 68 68" fill="none">
        <rect width="68" height="68" fill="#FFF1F2" rx="4" />
        <circle cx="34" cy="34" r="20" stroke="#BE123C" strokeWidth="2" />
        <circle cx="34" cy="34" r="12" stroke="#BE123C" strokeWidth="2" />
        <circle cx="34" cy="34" r="5" fill="#BE123C" />
        <line x1="10" y1="34" x2="58" y2="34" stroke="#BE123C" strokeWidth="1.5" />
        <line x1="34" y1="10" x2="34" y2="58" stroke="#BE123C" strokeWidth="1.5" />
      </svg>
    ),
  },
  8: {
    bg: '#0F172A',
    pillBg: '#4ADE80',
    pillText: '#000000',
    pillLabel: 'RED VS BLUE WARGAME',
    badge: 'INFRASTRUCTURE ATTACK',
    illustration: (
      <svg width="68" height="68" viewBox="0 0 68 68" fill="none">
        <rect width="68" height="68" fill="#F8FAFC" rx="4" />
        <path d="M22 18 L34 46 L26 48 L22 18 Z" fill="#EF4444" />
        <path d="M46 18 L34 46 L42 48 L46 18 Z" fill="#3B82F6" />
        <circle cx="34" cy="46" r="4" fill="#0F172A" />
      </svg>
    ),
  },
  9: {
    bg: '#713F12',
    pillBg: '#FACC15',
    pillText: '#000000',
    pillLabel: 'AWARDS CEREMONY',
    badge: '₹100,000 BOUNTY POOL',
    illustration: (
      <svg width="68" height="68" viewBox="0 0 68 68" fill="none">
        <rect width="68" height="68" fill="#FEFCE8" rx="4" />
        <path d="M24 16 H44 V28 C44 34 39.5 39 34 39 C28.5 39 24 34 24 28 Z" fill="#EAB308" stroke="#A16207" strokeWidth="1.5" />
        <path d="M24 20 H18 C16 20 16 26 20 28 L24 28" stroke="#A16207" strokeWidth="1.5" />
        <path d="M44 20 H50 C52 20 52 26 48 28 L44 28" stroke="#A16207" strokeWidth="1.5" />
        <rect x="30" y="39" width="8" height="10" fill="#CA8A04" />
        <rect x="22" y="49" width="24" height="5" rx="1" fill="#854D0E" />
      </svg>
    ),
  },
};

const EventFlyerCard: React.FC<{ index: number; title: string }> = ({ index, title }) => {
  const config = FLYER_CONFIGS[index] || FLYER_CONFIGS[0];

  return (
    <div
      className="w-[280px] h-[170px] sm:w-[310px] sm:h-[185px] p-3.5 flex flex-col justify-between rounded-sm border border-black/25 shadow-2xl"
      style={{ backgroundColor: config.bg }}
    >
      {/* Top Banner Row matching TinkerHub sticker styling */}
      <div className="flex items-center justify-between gap-2">
        <div className="bg-black/90 text-white font-anton text-[10px] sm:text-[11px] px-2 py-0.5 uppercase tracking-wider">
          {config.badge}
        </div>
        <div
          className="font-anton text-[9px] sm:text-[10px] px-2 py-0.5 uppercase tracking-wider rounded-none font-bold"
          style={{ backgroundColor: config.pillBg, color: config.pillText }}
        >
          {config.pillLabel}
        </div>
      </div>

      {/* Center Illustration + Graphic Frame */}
      <div className="flex items-center gap-3.5 my-auto px-1">
        <div className="flex-shrink-0 border border-black/20 shadow-md">
          {config.illustration}
        </div>
        <div className="min-w-0 flex-grow">
          <p className="font-anton text-white text-sm sm:text-base leading-tight uppercase tracking-tight line-clamp-2">
            {title}
          </p>
          <p className="font-body text-[10px] text-white/70 mt-1 uppercase tracking-wider">
            KMCT CAMPUS // 2026
          </p>
        </div>
      </div>

      {/* Bottom Action Footer matching Image */}
      <div className="flex items-center justify-between pt-1.5 border-t border-white/15">
        <span className="font-mono text-[9px] text-white/60 tracking-wider">
          ADMIT ONE // REGISTER
        </span>
        <span className="font-body font-bold text-[10px] text-white flex items-center gap-1 uppercase">
          EXPLORE →
        </span>
      </div>
    </div>
  );
};

export const EventsSection: React.FC = () => {
  return (
    <section id="events" className="relative py-16 sm:py-24 bg-graph-paper overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Black Tilted Banner Heading matching TinkerHub */}
        <div className="mb-7 sm:mb-9">
          <div className="inline-block bg-black text-white font-anton text-3xl sm:text-4xl md:text-[42px] px-7 py-2.5 sm:px-9 sm:py-3 rotate-[-2deg] uppercase tracking-normal leading-none shadow-md">
            UPCOMING EVENTS
          </div>
        </div>

        {/* Seamless Event Boxes with Low Opacity Border — matching reference */}
        <div className="-space-y-[1px]">
          {events.map((event, index) => (
            <Link
              key={index}
              href="/events"
              className="group relative flex items-center justify-between gap-3 sm:gap-4 py-3.5 sm:py-4.5 px-4 sm:px-9 bg-white border border-black/[0.08] hover:border-black/[0.24] hover:bg-[#FAFAFA] hover:z-10 transition-all duration-150"
            >
              <div className="flex items-center gap-3.5 sm:gap-6 flex-grow min-w-0">
                {/* Geometric Glyph Logo */}
                <div className="w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center flex-shrink-0 transition-transform duration-150 group-hover:scale-105">
                  <EventGlyph type={event.iconType} />
                </div>

                {/* Event Info: Stacked date and title on mobile, inline on sm+ */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-6 flex-grow min-w-0">
                  {/* Date & Time */}
                  <div className="flex-shrink-0 flex items-baseline gap-2 sm:w-44 md:w-52">
                    <span className="font-body text-[13.5px] sm:text-[15.5px] text-gray-950 font-semibold tracking-tight">
                      {event.date}
                    </span>
                    <span className="font-body text-[11px] sm:text-[12px] text-gray-400 font-normal uppercase tracking-wider leading-none">
                      {event.time}
                    </span>
                  </div>

                  {/* Event Title */}
                  <span className="font-serif italic text-[16px] sm:text-[19.5px] md:text-[21px] text-gray-950 truncate pr-2 sm:pr-4 font-normal tracking-tight">
                    {event.title}
                  </span>
                </div>
              </div>

              {/* Floating Hover Flyer Poster */}
              <div
                className="absolute right-14 top-1/2 -translate-y-1/2 z-40 pointer-events-none opacity-0 scale-95 translate-x-2 rotate-[2deg] group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 group-hover:rotate-[2.5deg] transition-all duration-200 ease-out hidden md:block"
                style={{ filter: 'drop-shadow(0 16px 26px rgba(0, 0, 0, 0.22))' }}
              >
                <EventFlyerCard index={index} title={event.title} />
              </div>

              {/* Diagonal Arrow */}
              <div className="flex-shrink-0 text-gray-900 transition-transform duration-150 group-hover:translate-x-1 group-hover:-translate-y-1">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* View All — reference: small plain text link bottom-left */}
        <div className="pt-5">
          <Link
            href="/events"
            className="inline-block px-4 py-1.5 bg-white text-gray-900 font-body font-semibold text-[12px] uppercase tracking-wider border border-black hover:bg-black hover:text-white transition-colors"
          >
            VIEW ALL
          </Link>
        </div>
      </div>
    </section>
  );
};
