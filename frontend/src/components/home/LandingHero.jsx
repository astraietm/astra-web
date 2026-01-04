import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, ArrowRight, Terminal } from 'lucide-react';
import Hero3D from './Hero3D'; 

const LandingHero = () => {
  const containerRef = useRef(null);
  
  // Parallax Text Effect on Scroll
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={containerRef} className="relative h-screen w-full bg-black overflow-hidden flex items-center justify-center">
      
      {/* 1. 3D Background Layer */}
      <div className="absolute inset-0 z-0">
         <Hero3D />
      </div>

      {/* 2. UI Overlay Layer */}
      <motion.div 
        style={{ y, opacity }} 
        className="relative z-10 container mx-auto px-4 flex flex-col items-center justify-center text-center h-full pointer-events-none" // pointer-events-none to let clicks pass through to canvas if needed, but here we want buttons interactive
      >
        {/* Pointer Events Auto Wrapper for Interactive Elements */}
        <div className="pointer-events-auto max-w-4xl mx-auto space-y-8">
            
            {/* Badge */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
            >
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-mono text-green-400 tracking-widest uppercase">System Online V.3.0</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="text-5xl md:text-8xl font-display font-medium text-white tracking-tighter leading-[1.1]"
            >
                Next-Gen <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 blur-sm absolute opacity-50 select-none" aria-hidden="true">Cyber Intelligence</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 relative">Cyber Intelligence</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed"
            >
                Experience the fusion of elite ethical hacking and future-tech education. 
                <span className="text-white"> ASTRA</span> is the frontier of digital defense.
            </motion.p>

            {/* CTA Buttons - Glassmorphic */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
            >
                <button className="group relative px-8 py-4 bg-green-500 text-black font-bold text-sm tracking-widest uppercase rounded overflow-hidden transition-all hover:bg-green-400 hover:scale-105 active:scale-95">
                    <span className="relative z-10 flex items-center gap-2">
                        Initialize Protocol <ArrowRight className="w-4 h-4" />
                    </span>
                </button>
                
                <button className="group px-8 py-4 bg-white/5 border border-white/10 text-white font-mono text-sm tracking-widest uppercase rounded hover:bg-white/10 hover:border-white/30 transition-all">
                    <span className="flex items-center gap-2 text-gray-300 group-hover:text-white">
                        <Terminal className="w-4 h-4" />
                        System_Docs
                    </span>
                </button>
            </motion.div>

        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
      >
          <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">Scroll to Explore</span>
          <ChevronDown className="w-5 h-5 text-gray-500 animate-bounce" />
      </motion.div>

      {/* Vignette Overlay for cinematic look */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_120%)] pointer-events-none z-10"></div>
    </div>
  );
};

export default LandingHero;
