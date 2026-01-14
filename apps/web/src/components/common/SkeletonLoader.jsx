import React from 'react';
import { motion } from 'framer-motion';

const SkeletonLoader = ({ variant = 'card' }) => {
  if (variant === 'card') {
    return (
      <div className="relative w-full overflow-hidden bg-gradient-to-br from-[#0F141F] to-[#0A0F1C] border border-white/10 p-6 md:p-8">
        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary/30" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary/30" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary/30" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary/30" />

        <div className="animate-pulse space-y-4">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="h-6 w-20 bg-white/10 rounded" />
            <div className="h-6 w-16 bg-white/10 rounded" />
          </div>

          {/* Title */}
          <div className="h-10 w-3/4 bg-white/10 rounded" />

          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-white/10 rounded" />
            <div className="h-4 w-5/6 bg-white/10 rounded" />
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-white/5 border border-white/10 rounded" />
            ))}
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="h-3 w-full bg-white/5 rounded-full" />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <div className="h-12 w-48 bg-primary/20 rounded" />
            <div className="h-12 w-32 bg-white/5 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <div className="relative h-screen w-full flex items-center justify-center bg-[#05080f]">
        <div className="animate-pulse text-center space-y-6">
          <div className="h-20 w-96 bg-white/10 rounded mx-auto" />
          <div className="h-6 w-64 bg-white/10 rounded mx-auto" />
          <div className="h-4 w-48 bg-white/10 rounded mx-auto" />
        </div>
      </div>
    );
  }

  return null;
};

export default SkeletonLoader;
