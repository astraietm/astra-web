'use client';

import React from 'react';
import { PaperCard } from '@/components/ui/PaperCard';

const actions = [
  {
    number: '01',
    title: 'REGISTER',
    description: 'Join the 24H National CTF WarGames at KMCT Calicut.',
  },
  {
    number: '02',
    title: 'VOLUNTEER',
    description: 'Help organize ASTRA 2026 and be part of the core team.',
  },
  {
    number: '03',
    title: 'SPONSOR',
    description: 'Partner with the Department of Cyber Security at KMCT.',
  },
];

export const GetInvolvedSection: React.FC = () => {
  return (
    <section id="get-involved" className="relative py-20 sm:py-28 md:py-36 overflow-hidden bg-gingham">
      <div className="max-w-4xl mx-auto px-6 sm:px-12 flex flex-col items-center">
        {/* Tilted Paper Card */}
        <PaperCard rotation={2} size="lg" className="w-full max-w-xl" withPixelDots pixelDotsCount={18}>
          {/* Top label */}
          <p className="font-pixel text-[10px] sm:text-xs uppercase tracking-wider text-gray-500 text-center mb-4">
            SECURE THE FUTURE.
          </p>

          {/* Main Heading */}
          <div className="flex items-start justify-between mb-6">
            <h2 className="font-pixel text-3xl sm:text-4xl md:text-5xl font-bold uppercase text-black leading-none">
              GET<br />INVOLVED
            </h2>
            <a
              href="#"
              className="text-black hover:text-gray-600 transition-colors flex-shrink-0 mt-1"
              aria-label="View all involvement options"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </a>
          </div>

          {/* Action Items */}
          <div className="space-y-0">
            {actions.map((action) => (
              <div key={action.number}>
                {/* Dotted separator */}
                <div className="border-t border-dashed border-gray-400" />
                <a
                  href="#register"
                  className="group -mx-3 px-3 py-5 sm:py-6 flex items-start justify-between gap-4 rounded-md transition-[background-color,transform] duration-160 ease-[var(--ease-out)] hover:bg-black/5 active:scale-[0.99] cursor-pointer block select-none"
                  aria-label={`Learn more about ${action.title}`}
                >
                  <div className="flex items-start gap-4">
                    <span className="font-editorial italic text-sm sm:text-base text-gray-400 group-hover:text-black transition-colors duration-160 flex-shrink-0 mt-0.5">
                      {action.number}
                    </span>
                    <div>
                      <h3 className="font-pixel text-base sm:text-lg font-bold uppercase text-black mb-1 group-hover:text-black flex items-center gap-2">
                        {action.title}
                      </h3>
                      <p className="font-editorial text-xs sm:text-sm text-gray-600 leading-relaxed">
                        {action.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-black transition-transform duration-160 ease-[var(--ease-out)] group-hover:translate-x-1 group-hover:-translate-y-1 flex-shrink-0 mt-1">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 17L17 7M17 7H7M17 7V17" />
                    </svg>
                  </div>
                </a>
              </div>
            ))}
            {/* Final dotted separator */}
            <div className="border-t border-dashed border-gray-400" />
          </div>

          {/* Bottom label */}
          <p className="font-pixel text-xs uppercase tracking-wider text-gray-500 text-center mt-6">
            MAKE A CHANGE.
          </p>
        </PaperCard>
      </div>
    </section>
  );
};
