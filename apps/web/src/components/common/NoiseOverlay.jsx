import React from 'react';

const NoiseOverlay = ({ opacity = 0.05 }) => {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[1] mix-blend-soft-light overflow-hidden"
      style={{ opacity }}
    >
      <div
        className="absolute inset-[-200%] pointer-events-none opacity-40 bg-repeat bg-[length:256px_256px] animate-grain"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Subtle Horizontal Scanline Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[size:100%_4px,3px_100%] pointer-events-none" />
    </div>
  );
};

export default NoiseOverlay;
