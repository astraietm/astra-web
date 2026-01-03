import React, { useRef } from 'react';
import { ArrowRight, ShieldCheck, Globe, Activity, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import ScrollIndicator from './ScrollIndicator';
import CursorParallaxBackground from '../common/CursorParallaxBackground';
import TextReveal from '../common/TextReveal';
import ScrollReveal from '../common/ScrollReveal';
import GlitchText from '../common/GlitchText';

const Hero = () => {
  const containerRef = useRef(null);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-[#02040a] py-20 md:py-0"
    >
      {/* Parallax Background */}
      <div className="absolute inset-0 w-full h-full" onMouseMove={(e) => {
         // Pass event to background if needed, but background handles it itself if it covers everything.
         // Actually, CursorParallaxBackground needs to capture mouse events. 
         // Since it is absolute inset-0, it will catch them if z-index is right?
         // Or we just let it handle its own events.
      }}>
        <CursorParallaxBackground />
      </div>



      {/* Main Content */}
      <div 
        className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center"
      >
        
        {/* Badge */}
        <ScrollReveal variant="up" delay={0.2}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="text-xs font-mono font-medium text-gray-300 tracking-wider uppercase">Official Cyber Association</span>
            </div>
        </ScrollReveal>

        {/* Heading */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-display font-medium text-white mb-6 leading-[0.9] tracking-tighter flex flex-col items-center">
            <TextReveal text="ASTRA" delay={0.3} />
            <motion.span 
                 initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                 animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                 transition={{ duration: 1, delay: 0.8 }}
                 className="text-lg md:text-2xl font-sans font-light tracking-wide text-gray-300 mt-4 max-w-3xl"
            >
                Official Cybersecurity Association of the Cybersecurity Department, <span className="text-primary">KMCT IETM</span>
            </motion.span>
        </h1>

        {/* Description / Tagline */}
        <ScrollReveal variant="blur" delay={0.4} width="100%">
            <p className="text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400 font-light mb-12 italic">
                "Securing the Future, One Byte at a Time"
            </p>
        </ScrollReveal>

        {/* Buttons */}
        <ScrollReveal variant="up" delay={0.5}>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link
                    to="/events"
                    className="group px-8 py-4 bg-primary text-black font-bold rounded-full transition-all duration-300 hover:scale-105 hover:bg-cyan-300 flex items-center justify-center gap-2"
                >
                    Explore Events 
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                    to="/about"
                    className="group px-8 py-4 bg-white/5 text-white border border-white/10 rounded-full transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:border-white/20 flex items-center justify-center gap-2"
                >
                    <ShieldCheck className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                    About ASTRA
                </Link>
            </div>
        </ScrollReveal>

        {/* Bottom Stats Grid */}
        <ScrollReveal variant="up" delay={0.8} width="100%">
            <div className="mt-24 flex items-center justify-center border-t border-white/5 pt-8 w-full max-w-4xl mx-auto opacity-60 hover:opacity-100 transition-opacity duration-500">
                 <div className="flex items-center justify-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div className="text-left">
                        <div className="text-sm font-bold text-white">Established 2023</div>
                    </div>
                </div>
            </div>
        </ScrollReveal>

      </div>

      <ScrollIndicator />
    </section>
  );
};

export default Hero;
