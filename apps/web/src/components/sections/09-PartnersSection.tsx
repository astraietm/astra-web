'use client';

import React from 'react';

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
    <section id="partners" className="relative py-16 sm:py-20 bg-graph-paper border-t border-gray-200">
      <div className="max-w-5xl mx-auto px-6 sm:px-12">
        {/* Partner Groups */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16">
          {/* Funding Partners */}
          <div>
            <div className="flex items-center gap-3 sm:gap-6 mb-6 flex-wrap">
              {fundingPartners.map((partner) => (
                <div
                  key={partner.abbrev}
                  className="flex items-center justify-center h-12 sm:h-16 px-4 sm:px-6 border border-gray-200 bg-white"
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
            <div className="flex items-center gap-3 sm:gap-6 mb-6 flex-wrap">
              {institutionalPartners.map((partner) => (
                <div
                  key={partner.abbrev}
                  className="flex items-center justify-center h-12 sm:h-16 px-4 sm:px-6 border border-gray-200 bg-white"
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
