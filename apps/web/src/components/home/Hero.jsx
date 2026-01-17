import React, { useRef } from 'react';
import { ArrowRight, ShieldCheck, Globe, Activity, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrollIndicator from './ScrollIndicator';

import TextReveal from '../common/TextReveal';
import ScrollReveal from '../common/ScrollReveal';

import { BorderBeam } from '../common/BorderBeam';

const Hero = () => {
    const containerRef = useRef(null);

    return (
        <section
            ref={containerRef}
            className="relative min-h-[100dvh] flex items-center justify-center pt-16 pb-8 sm:pt-20 sm:pb-12 md:py-0 overflow-hidden"
        >
            {/* --- Finex Gaming Style Visuals --- */}
            
            {/* 1. Dotted Mesh Background */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.15] pointer-events-none z-0 mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)"></div>

            {/* 2. Bottom Nebula Glow */}
            <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyan-500/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none z-10" />
            
            {/* 3. Top subtle gradient */}
             <div className="absolute top-0 left-0 right-0 h-[200px] bg-gradient-to-b from-primary/5 to-transparent z-10 pointer-events-none" />

            {/* --------------------------------------- */}
            {/* Main Content */}
            <div
                className="relative z-30 text-center px-3 sm:px-4 md:px-6 max-w-[95%] sm:max-w-xl md:max-w-3xl lg:max-w-5xl mx-auto flex flex-col items-center w-full"
            >
                {/* Heading */}
                <h1 className="text-6xl xs:text-7xl sm:text-8xl md:text-9xl font-display font-black text-white mb-6 leading-[0.9] tracking-tighter flex flex-col items-center w-full uppercase">
                    <TextReveal text="ASTRA" delay={0.3} />
                    <motion.span
                        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="text-sm xs:text-base sm:text-lg md:text-xl font-sans font-medium tracking-wide text-gray-400 mt-6 max-w-full leading-relaxed px-4"
                    >
                        Official Cybersecurity Association of the Cybersecurity Department,{' '}
                        <span className="text-white inline sm:block mt-1">
                            KMCT Institute of Emerging Technology and Management.
                        </span>
                    </motion.span>
                </h1>

                {/* Description / Tagline */}
                <ScrollReveal variant="blur" delay={0.4} width="100%">
                    <p className="text-lg md:text-2xl text-gray-400 font-medium mb-10 italic px-2 max-w-full">
                        "Securing the Future, One Byte at a Time"
                    </p>
                </ScrollReveal>

                {/* Buttons */}
                <ScrollReveal variant="up" delay={0.5} width="100%">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto max-w-full px-1 sm:px-0">
                        <Link
                            to="/events"
                            className="group px-8 py-4 bg-white text-black text-base sm:text-lg font-bold leading-none border border-transparent rounded-full transition-all duration-300 hover:scale-[1.05] hover:shadow-lg flex items-center justify-center gap-2 w-full sm:w-auto whitespace-nowrap"
                        >
                            Register Now
                            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 flex-shrink-0" />
                        </Link>

                        <Link
                            to="/about"
                            className="group px-8 py-4 bg-black/40 text-white text-base sm:text-lg font-bold leading-none border border-white/10 rounded-full transition-all duration-300 hover:bg-black/60 hover:border-cyan-500/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 backdrop-blur-md w-full sm:w-auto whitespace-nowrap"
                        >
                            <ShieldCheck className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors duration-300 flex-shrink-0" />
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
