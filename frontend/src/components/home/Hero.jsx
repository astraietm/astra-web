import React, { useRef } from 'react';
import { ArrowRight, ShieldCheck, Globe, Activity, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrollIndicator from './ScrollIndicator';

import TextReveal from '../common/TextReveal';
import ScrollReveal from '../common/ScrollReveal';

import { BorderBeam } from '../common/BorderBeam';

import useIsMobile from '../../hooks/useIsMobile';

const Hero = () => {
    const containerRef = useRef(null);
    const isMobile = useIsMobile();

    return (
        <section
            ref={containerRef}
            className="relative min-h-[100dvh] flex items-center justify-center pt-16 pb-8 sm:pt-20 sm:pb-12 md:py-0 overflow-hidden"
        >
            {/* --- Cyber Visuals (Mobile Enhanced) --- */}
            
            {/* 1. Central Ambient Glow - Static on mobile, Pulse on Desktop */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-primary/20 blur-[80px] sm:blur-[100px] rounded-full mix-blend-screen opacity-60 pointer-events-none z-10 animate-none md:animate-pulse duration-[4000ms]" />

            {/* 2. Holographic Floor Grid */}
            <div className="absolute bottom-0 left-0 right-0 h-[45vh] pointer-events-none z-10 overflow-hidden opacity-40 sm:opacity-30">
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent z-10" />
                <div 
                    className="absolute inset-[-50%] bg-[linear-gradient(90deg,rgba(99,102,241,0.3)_1px,transparent_1px),linear-gradient(0deg,rgba(99,102,241,0.3)_1px,transparent_1px)] bg-[size:40px_40px] origin-bottom"
                    style={{ transform: 'perspective(500px) rotateX(60deg) translateY(0)' }}
                />
            </div>
            
            {/* 3. Floating Dust Particles (CSS) - Hidden on Mobile */}
            <div className="absolute inset-0 pointer-events-none z-10 opacity-30 hidden md:block">
                 <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-ping duration-[3000ms]" />
                 <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-primary rounded-full animate-ping duration-[4000ms] delay-1000" />
                 <div className="absolute top-1/2 left-3/4 w-0.5 h-0.5 bg-cyan-400 rounded-full animate-pulse" />
            </div>

            {/* --------------------------------------- */}
            {/* Main Content */}
            <div
                className="relative z-30 text-center px-3 sm:px-4 md:px-6 max-w-[95%] sm:max-w-xl md:max-w-3xl lg:max-w-5xl mx-auto flex flex-col items-center w-full"
            >
                {/* Heading */}
                <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-medium text-white mb-3 sm:mb-4 md:mb-6 leading-tight tracking-tight flex flex-col items-center w-full">
                    <TextReveal text="ASTRA" delay={0.3} />
                    <motion.span
                        initial={isMobile ? { opacity: 0, y: 10 } : { opacity: 0, y: 20, filter: "blur(10px)" }}
                        animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-sans font-light tracking-normal text-gray-300 mt-3 sm:mt-4 md:mt-6 max-w-full leading-relaxed px-1 sm:px-2"
                    >
                        Official Cybersecurity Association of the Cybersecurity Department,{' '}
                        <span className="text-primary inline sm:block mt-0 sm:mt-1 md:mt-2">
                            KMCT Institute of Emerging Technology and Management.
                        </span>
                    </motion.span>
                </h1>

                {/* Description / Tagline */}
                <ScrollReveal variant="blur" delay={0.4} width="100%">
                    <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400 font-light mb-4 sm:mb-6 md:mb-8 lg:mb-12 italic px-2 max-w-full">
                        "Securing the Future, One Byte at a Time"
                    </p>
                </ScrollReveal>

                {/* Buttons */}
                <ScrollReveal variant="up" delay={0.5} width="100%">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 md:gap-4 lg:gap-6 w-full sm:w-auto max-w-full px-1 sm:px-0">
                        <Link
                            to="/events"
                            className="group px-5 xs:px-6 sm:px-7 md:px-8 py-2.5 xs:py-3 sm:py-3.5 md:py-4 bg-primary text-black text-xs xs:text-sm sm:text-base font-bold leading-none border border-transparent rounded-full transition-all duration-300 hover:bg-cyan-300 hover:scale-[1.02] flex items-center justify-center gap-2 w-full sm:w-auto whitespace-nowrap"
                        >
                            Register Now
                            <ArrowRight className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1 flex-shrink-0" />
                        </Link>

                        <Link
                            to="/about"
                            className="group px-5 xs:px-6 sm:px-7 md:px-8 py-2.5 xs:py-3 sm:py-3.5 md:py-4 bg-white/5 text-white text-xs xs:text-sm sm:text-base font-medium leading-none border border-white/10 rounded-full transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] flex items-center justify-center gap-2 backdrop-blur-sm w-full sm:w-auto whitespace-nowrap"
                        >
                            <ShieldCheck className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-white transition-colors duration-300 flex-shrink-0" />
                            <span>About ASTRA</span>
                        </Link>
                    </div>
                </ScrollReveal>

            </div>

            <ScrollIndicator />

            {/* Bottom Fade Gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none z-10"></div>
        </section>
    );
};

export default Hero;
