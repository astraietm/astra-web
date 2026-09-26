'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

/* ── 1. Orange Concentric Rings Badge ── */
const OrangeConcentricBadge = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="flex-shrink-0"
    aria-hidden="true"
  >
    <circle cx="14" cy="14" r="13" stroke="#F59E0B" strokeWidth="1.8" />
    <circle cx="14" cy="14" r="9.5" stroke="#F59E0B" strokeWidth="1.8" />
    <circle cx="14" cy="14" r="6" stroke="#F59E0B" strokeWidth="1.8" />
    <circle cx="14" cy="14" r="2.8" fill="#F59E0B" />
  </svg>
);

/* ── 2. Pink 4-Petal Flower Badge ── */
const PinkFlowerBadge = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="flex-shrink-0"
    aria-hidden="true"
  >
    <rect x="10.5" y="2" width="7" height="11" rx="3.5" fill="#F472B6" />
    <rect x="10.5" y="15" width="7" height="11" rx="3.5" fill="#F472B6" />
    <rect x="2" y="10.5" width="11" height="7" rx="3.5" fill="#F472B6" />
    <rect x="15" y="10.5" width="11" height="7" rx="3.5" fill="#F472B6" />
    <circle cx="14" cy="14" r="4.2" fill="#F472B6" />
  </svg>
);

/* ── 3. Lime Green Starburst / Asterisk Badge ── */
const LimeStarburstBadge = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="flex-shrink-0"
    aria-hidden="true"
  >
    <rect x="11.5" y="2" width="5" height="24" rx="2.5" fill="#84CC16" />
    <rect x="2" y="11.5" width="24" height="5" rx="2.5" fill="#84CC16" />
    <rect x="11.5" y="2" width="5" height="24" rx="2.5" fill="#84CC16" transform="rotate(45 14 14)" />
    <rect x="11.5" y="2" width="5" height="24" rx="2.5" fill="#84CC16" transform="rotate(-45 14 14)" />
    <circle cx="14" cy="14" r="3.5" fill="#84CC16" />
  </svg>
);

/* ── 4. Cyan Geometric 4-Tile Grid Badge ── */
const CyanTileGridBadge = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="flex-shrink-0"
    aria-hidden="true"
  >
    <rect x="3" y="3" width="9.5" height="9.5" rx="2.5" fill="#06B6D4" />
    <rect x="15.5" y="3" width="9.5" height="9.5" rx="2.5" fill="#06B6D4" />
    <rect x="3" y="15.5" width="9.5" height="9.5" rx="2.5" fill="#06B6D4" />
    <rect x="15.5" y="15.5" width="9.5" height="9.5" rx="2.5" fill="#06B6D4" />
    <circle cx="14" cy="14" r="2.2" fill="#FFFFFF" />
  </svg>
);

/* ── 5. Purple Rosette / Sun Wheel Badge ── */
const PurpleRosetteBadge = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="flex-shrink-0"
    aria-hidden="true"
  >
    <circle cx="14" cy="14" r="12" stroke="#8B5CF6" strokeWidth="2.5" strokeDasharray="3.2 2.8" />
    <circle cx="14" cy="14" r="7" stroke="#8B5CF6" strokeWidth="1.8" />
    <circle cx="14" cy="14" r="3" fill="#8B5CF6" />
  </svg>
);

/* ── 6. Amber Concentric Hexagon Badge ── */
const AmberHexagonBadge = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="flex-shrink-0"
    aria-hidden="true"
  >
    <polygon
      points="14,1.5 25.5,8.1 25.5,21.9 14,28.5 2.5,21.9 2.5,8.1"
      stroke="#D97706"
      strokeWidth="1.8"
      fill="none"
      transform="scale(0.85) translate(2.5, 2.5)"
    />
    <polygon
      points="14,1.5 25.5,8.1 25.5,21.9 14,28.5 2.5,21.9 2.5,8.1"
      stroke="#D97706"
      strokeWidth="1.8"
      fill="none"
      transform="scale(0.55) translate(11.5, 11.5)"
    />
    <circle cx="14" cy="14" r="2.6" fill="#D97706" />
  </svg>
);

/* ── 7. Emerald Trefoil / 3-Ring Triquetra Badge ── */
const EmeraldTrefoilBadge = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="flex-shrink-0"
    aria-hidden="true"
  >
    <circle cx="14" cy="9" r="6.8" stroke="#10B981" strokeWidth="1.8" fill="none" />
    <circle cx="9" cy="17.5" r="6.8" stroke="#10B981" strokeWidth="1.8" fill="none" />
    <circle cx="19" cy="17.5" r="6.8" stroke="#10B981" strokeWidth="1.8" fill="none" />
    <circle cx="14" cy="14.6" r="2.2" fill="#10B981" />
  </svg>
);

/* ── Distinct Badge Components List ── */
const BADGE_COMPONENTS = [
  OrangeConcentricBadge,
  PinkFlowerBadge,
  LimeStarburstBadge,
  CyanTileGridBadge,
  PurpleRosetteBadge,
  AmberHexagonBadge,
  EmeraldTrefoilBadge,
];

// Real 7 ASTRA 2026 events matching Events Page & Database
const REAL_EVENTS_FALLBACK = [
  {
    id: 11,
    date: 'October 6',
    time: '11:00 AM',
    title: '24H National Live CTF WarGames Kickoff',
    category: 'FLAGSHIP CTF',
  },
  {
    id: 12,
    date: 'October 6',
    time: '02:00 PM',
    title: 'Sovereign Cyber Defense & Critical Infra Keynote',
    category: 'KEYNOTE',
  },
  {
    id: 13,
    date: 'October 6',
    time: '04:30 PM',
    title: 'Zero-Day Exploit Development & Kernel Rootkits',
    category: 'WORKSHOP',
  },
  {
    id: 14,
    date: 'October 7',
    time: '09:30 AM',
    title: 'Hardware Hacking, BadUSB & IoT Village',
    category: 'RESEARCH EXPO',
  },
  {
    id: 15,
    date: 'October 7',
    time: '10:30 AM',
    title: 'Ghidra Binary Reverse Engineering Masterclass',
    category: 'WORKSHOP',
  },
  {
    id: 16,
    date: 'October 7',
    time: '01:00 PM',
    title: 'AI-Driven Autonomous Threat Hunting & SIEM',
    category: 'WORKSHOP',
  },
  {
    id: 17,
    date: 'October 7',
    time: '03:30 PM',
    title: 'CTF Grand Finale Award Ceremony & Zero-Day Showcase',
    category: 'GRAND FINALE',
  },
];

export const EventsSection: React.FC = () => {
  const [eventsList, setEventsList] = useState(REAL_EVENTS_FALLBACK);

  useEffect(() => {
    let isMounted = true;
    api
      .get('/api/events/')
      .then((res) => {
        if (isMounted && Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map((e: any) => {
            let dateStr = 'October 6';
            if (e.event_date) {
              const d = new Date(e.event_date);
              if (!isNaN(d.getTime())) {
                const month = d.toLocaleString('en-US', { month: 'long' });
                dateStr = `${month} ${d.getDate() < 10 ? '0' + d.getDate() : d.getDate()}`;
              }
            }
            return {
              id: e.id,
              date: dateStr,
              time: e.time || '10:00 AM',
              title: e.title,
              category: e.category,
            };
          });
          setEventsList(mapped);
        }
      })
      .catch(() => {
        // Keeps real events fallback
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="events" className="relative py-16 sm:py-24 bg-graph-paper">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 md:px-12">
        {/* ── Slanted Black Banner Heading ── */}
        <div className="mb-10 sm:mb-14">
          <div
            className="inline-block bg-black text-white px-6 sm:px-8 py-2.5 sm:py-3 font-anton text-2xl sm:text-3xl md:text-4xl uppercase tracking-wider select-none shadow-[2px_2px_0px_rgba(0,0,0,0.1)]"
            style={{ transform: 'rotate(-3.5deg)' }}
          >
            UPCOMING EVENTS
          </div>
        </div>

        {/* ── Event Rows with Unique Icon Badges ── */}
        <div className="bg-white border-y border-gray-200 divide-y divide-gray-200">
          {eventsList.map((event, index) => {
            const BadgeComponent = BADGE_COMPONENTS[index % BADGE_COMPONENTS.length];

            return (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-8 py-4 sm:py-5 px-4 sm:px-6 hover:bg-gray-50/70 transition-colors duration-150"
              >
                {/* Mobile Top Row / Desktop Left Side: Unique Icon + Date & Time + Mobile Arrow */}
                <div className="flex items-center justify-between sm:justify-start gap-3 sm:gap-5 flex-shrink-0 w-full sm:w-auto">
                  <div className="flex items-center gap-3 sm:gap-5">
                    {/* Distinct Geometric Badge */}
                    <BadgeComponent />

                    {/* Date & Time horizontally aligned as in reference */}
                    <div className="flex items-baseline gap-2">
                      <span className="font-sans font-bold text-xs sm:text-sm md:text-base text-black whitespace-nowrap">
                        {event.date}
                      </span>
                      <span className="font-mono text-[10px] sm:text-xs text-gray-400 uppercase font-normal whitespace-nowrap">
                        {event.time}
                      </span>
                    </div>
                  </div>

                  {/* Mobile Arrow */}
                  <div className="sm:hidden flex-shrink-0">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-black transition-transform duration-160 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    >
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </div>
                </div>

                {/* Middle Column: Event Title (Instrument Serif Italic) */}
                <div className="flex-grow min-w-0 sm:px-6 text-left">
                  <span className="font-editorial italic text-base sm:text-lg md:text-xl text-black block leading-snug group-hover:text-black">
                    {event.title}
                  </span>
                </div>

                {/* Desktop Clean Diagonal Arrow */}
                <div className="hidden sm:block flex-shrink-0 pl-2">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-black transition-transform duration-160 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  >
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>

        {/* ── View All Events Button ── */}
        <div className="mt-8 sm:mt-10 flex items-center justify-start">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-sans font-semibold text-xs uppercase tracking-wider hover:bg-zinc-800 active:scale-[0.98] transition-all duration-150 shadow-[2px_2px_0px_#000]"
          >
            <span>VIEW ALL EVENTS (OCT 6 &amp; 7)</span>
            <span>↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
