import React from 'react';
import Link from 'next/link';
import { BrutalistButton } from '@/components/ui/BrutalistButton';
import { PixelDots } from '@/components/visual/PixelDots';

export default function NotFound() {
  return (
    <div className="relative min-h-[70vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 py-20 bg-graph-paper overflow-hidden">
      <PixelDots count={24} minSize={2.5} maxSize={5} opacity={0.75} colors={['#FFE816', '#F79CFF', '#C3FF16', '#4A9EFF', '#97F8B7', '#0A0A0A']} />
      <div className="relative z-10 max-w-lg">
        <span className="font-pixel text-xs bg-[#FFE816] px-3 py-1 border-2 border-black font-bold uppercase shadow-[2px_2px_0px_#000]">
          404 // NOT_FOUND
        </span>
        <h1 className="font-pixel text-5xl sm:text-7xl font-bold uppercase text-black mt-6 tracking-tight">
          SIGNAL LOST
        </h1>
        <p className="font-editorial italic text-base sm:text-lg text-gray-600 mt-4 max-w-md mx-auto">
          The coordinate you are looking for has been moved, compromised, or does not exist in the arena.
        </p>
        <div className="mt-8 flex justify-center">
          <BrutalistButton href="/" size="md" variant="primary" withArrow>
            Return to Arena
          </BrutalistButton>
        </div>
      </div>
    </div>
  );
}
