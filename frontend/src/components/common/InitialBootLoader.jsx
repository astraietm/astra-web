import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import MatrixRain from './MatrixRain';

const bootCommands = [
  "> INITIALIZING_DAEMON...",
  "> LOADING_KERNEL_V6.0.4...",
  "> BYPASSING_FIREWALL [OK]",
  "> DECRYPTING_USER_DATA...",
  "> OPTIMIZING_NEURAL_NET...",
  "> SYSTEM_READY"
];

const InitialBootLoader = ({ onComplete }) => {
  const [lines, setLines] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // 1. Terminal Typing Effect
  useEffect(() => {
    if (activeIndex < bootCommands.length) {
      const timeout = setTimeout(() => {
        setLines(prev => [...prev, bootCommands[activeIndex]]);
        setActiveIndex(prev => prev + 1);
      }, 250); // Speed of each line appearing
      return () => clearTimeout(timeout);
    } else {
      // Finished typing
      setTimeout(onComplete, 600);
    }
  }, [activeIndex, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050505] text-[#E0E0E0] font-mono overflow-hidden"
    >
      {/* Matrix Rain Background Effect */}
      <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none">
          <MatrixRain />
      </div>

      {/* Background Ambience Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,#050505_90%)] pointer-events-none z-0" />
      
      {/* Container */}
      <div className="relative z-10 w-full max-w-2xl p-8">
        
        {/* Main Logo - Modern Font */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 flex flex-col items-center"
        >
            <h1 className="text-6xl md:text-8xl font-display font-medium tracking-tight text-white mb-2">
                ASTRA
            </h1>
            <div className="h-[1px] w-24 bg-primary/50 shadow-[0_0_10px_rgba(0,224,255,0.8)]" />
        </motion.div>

        {/* Terminal Window */}
        <div className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 min-h-[200px] flex flex-col shadow-2xl relative overflow-hidden">
            {/* Terminal Header */}
            <div className="flex items-center gap-2 mb-4 opacity-50 border-b border-white/10 pb-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-xs font-sans tracking-wide">root@astra-sys: ~</span>
            </div>

            {/* Typing Lines */}
            <div className="flex-1 flex flex-col justify-end space-y-2 font-mono text-sm md:text-base">
                {lines.map((line, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`${i === bootCommands.length - 1 ? "text-primary font-bold shadow-primary text-shadow" : "text-gray-400"}`}
                    >
                        {line}
                    </motion.div>
                ))}
                
                {/* Blinking Cursor */}
                {activeIndex < bootCommands.length && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className="w-2 h-4 bg-primary inline-block ml-1 align-middle"
                    />
                )}
            </div>

            {/* Scanline Overlay for Terminal Only */}
             <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-10" />
        </div>

        {/* Footer info */}
        <div className="mt-6 flex justify-between text-[10px] text-gray-500 font-sans tracking-widest uppercase">
            <span>Secure Connection</span>
            <span>Est. 2025</span>
        </div>

      </div>
    </motion.div>
  );
};

export default InitialBootLoader;
