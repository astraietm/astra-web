'use client';

import React from 'react';
import { PixelDots } from '@/components/visual/PixelDots';

const fundingPartners = [
  { name: 'KMCT Group', abbrev: 'KMCT' },
  { name: 'Kerala Cyberdome', abbrev: 'CYBERDOME' },
];

const institutionalPartners = [
  { name: 'KMCT Institute of Emerging Technology', abbrev: 'KMCT-IET' },
  { name: 'Kerala Police', abbrev: 'KP' },
  { name: 'IEEE Kerala Section', abbrev: 'IEEE' },
];

export const PartnersSection: React.FC = () => {
  return (
    <section id="partners" className="relative py-16 sm:py-20 bg-graph-paper border-t border-gray-200 overflow-hidden">
      {/* Small pixel dots on canvas */}
      <PixelDots count={22} minSize={2.5} maxSize={5} colors={['#97F8B7', '#4A9EFF', '#F79CFF', '#FFE816', '#C3FF16', '#0A0A0A']} opacity={0.65} />

      <div className="max-w-5xl mx-auto px-6 sm:px-12 relative z-10">
        {/* Partner Groups */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16">
          {/* Funding Partners */}
          <div>
            <div className="flex items-center gap-4 sm:gap-6 mb-6">
              {fundingPartners.map((partner) => (
                <div
                  key={partner.abbrev}
                  className="flex items-center justify-center h-14 sm:h-16 px-6 border border-gray-200 bg-white"
                >
                  <span className="font-display font-bold text-sm sm:text-base text-black tracking-wider uppercase">
                    {partner.abbrev}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-3">
              <p className="font-editorial italic text-sm text-gray-400">
                Funding partners
              </p>
            </div>
          </div>

          {/* Institutional Partners */}
          <div>
            <div className="flex items-center gap-4 sm:gap-6 mb-6 flex-wrap">
              {institutionalPartners.map((partner) => (
                <div
                  key={partner.abbrev}
                  className="flex items-center justify-center h-14 sm:h-16 px-6 border border-gray-200 bg-white"
                >
                  <span className="font-display font-bold text-sm sm:text-base text-black tracking-wider uppercase">
                    {partner.abbrev}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-3">
              <p className="font-editorial italic text-sm text-gray-400">
                Institutional partners
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
