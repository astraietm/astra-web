'use client';

import React from 'react';
import Link from 'next/link';
import { BlackBanner } from '@/components/ui/BlackBanner';

const events = [
  {
    icon: '🛡️',
    date: 'October 6',
    time: '9:00 AM',
    title: 'Opening Ceremony & Keynote',
  },
  {
    icon: '⚔️',
    date: 'October 6',
    time: '11:00 AM',
    title: '24H CTF WarGames Kickoff',
  },
  {
    icon: '🔬',
    date: 'October 6',
    time: '2:00 PM',
    title: 'Zero-Day Research Symposium',
  },
  {
    icon: '🏆',
    date: 'October 7',
    time: '3:00 PM',
    title: 'CTF Finals & Awards Ceremony',
  },
];

export const EventsSection: React.FC = () => {
  return (
    <section id="events" className="relative py-16 sm:py-20 bg-graph-paper">
      <div className="max-w-4xl mx-auto px-6 sm:px-12">
        {/* Black Banner Heading */}
        <div className="mb-10 sm:mb-14">
          <BlackBanner size="md">
            UPCOMING EVENTS
          </BlackBanner>
        </div>

        {/* Event List */}
        <div className="space-y-0">
          {events.map((event, index) => (
            <Link
              key={index}
              href="/events"
              className="group flex items-center gap-4 sm:gap-6 py-4 sm:py-5 border-t border-gray-200 hover:bg-white/80 transition-[background-color,transform] duration-160 ease-[var(--ease-out)] active:scale-[0.99] px-2 sm:px-4 rounded-md"
            >
              {/* Icon */}
              <span className="text-2xl flex-shrink-0 transition-transform duration-160 ease-[var(--ease-out)] group-hover:scale-110" aria-hidden="true">
                {event.icon}
              </span>

              {/* Date & Time */}
              <div className="flex-shrink-0 w-32 sm:w-40">
                <span className="font-display font-bold text-sm sm:text-base text-black">
                  {event.date}
                </span>
                <span className="font-mono text-[10px] sm:text-xs text-gray-500 ml-2">
                  {event.time}
                </span>
              </div>

              {/* Title */}
              <span className="font-editorial italic text-base sm:text-lg md:text-xl text-black flex-grow group-hover:text-black">
                {event.title}
              </span>

              {/* Arrow */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="flex-shrink-0 text-gray-400 group-hover:text-black transition-[transform,color] duration-160 ease-[var(--ease-out)] group-hover:translate-x-1 group-hover:-translate-y-1"
              >
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </Link>
          ))}
          {/* Bottom border */}
          <div className="border-t border-gray-200" />
        </div>

        {/* View All Button */}
        <div className="mt-8">
          <Link
            href="/events"
            className="inline-block px-5 py-2.5 bg-black text-white border-2 border-black font-display font-semibold text-xs uppercase tracking-wider hover:bg-th-pink hover:text-black active:scale-[0.98] transition-[background-color,color,transform,box-shadow] duration-160 ease-[var(--ease-out)] shadow-[2px_2px_0px_#000]"
          >
            VIEW ALL EVENTS (OCT 6 & 7) →
          </Link>
        </div>
      </div>
    </section>
  );
};
