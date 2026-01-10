import React, { useRef } from 'react';
import { ArrowRight, ShieldCheck, Globe, Activity, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import ScrollIndicator from './ScrollIndicator';

import TextReveal from '../common/TextReveal';
import ScrollReveal from '../common/ScrollReveal';
import GlitchText from '../common/GlitchText';

const Hero = () => {
    const containerRef = useRef(null);

    return (
        <section
            ref={containerRef}
            className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-32 pb-20 md:py-0"
        >
            {/* Ultra-Dynamic Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-background to-background pointer-events-none"></div>

            <div className="absolute inset-0 pointer-events-none">
                {/* Moving Grid - MOVED TO GLOBAL HOME */}

                {/* Rotating Nebula Orbs */}
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] md:w-[1000px] md:h-[1000px] bg-primary/10 rounded-full blur-[120px] animate-[spin_60s_linear_infinite] opacity-40"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] md:w-[800px] md:h-[800px] bg-blue-600/10 rounded-full blur-[120px] animate-[spin_40s_linear_infinite_reverse] opacity-30"></div>

                {/* Floating Particles */}
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-ping opacity-20"></div>
                <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-blue-500 rounded-full animate-pulse opacity-20"></div>
                <div className="absolute bottom-10 left-1/2 w-1 h-1 bg-white rounded-full animate-bounce opacity-40"></div>
            </div>      {/* Main Content */}
            <div
                className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center"
            >

                {/* Badge */}


                {/* Heading */}
                <h1 className="text-4xl sm:text-7xl md:text-8xl font-display font-medium text-white mb-6 leading-[0.9] tracking-tighter flex flex-col items-center">
                    <TextReveal text="ASTRA" delay={0.3} />
                    <motion.span
                        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="text-sm sm:text-base md:text-2xl font-sans font-light tracking-wide text-gray-300 mt-4 max-w-3xl"
                    >
                        Official Cybersecurity Association of the Cybersecurity Department, <span className="text-primary">KMCT Institute of Emerging Technology and Management.</span>
                    </motion.span>
                </h1>

                {/* Description / Tagline */}
                <ScrollReveal variant="blur" delay={0.4} width="100%">
                    <p className="text-lg md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400 font-light mb-8 md:mb-12 italic">
                        "Securing the Future, One Byte at a Time"
                    </p>
                </ScrollReveal>

                {/* Buttons */}
                <ScrollReveal variant="up" delay={0.5}>
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <Link
                            to="/events"
                            className="group px-6 py-3 md:px-8 md:py-4 bg-primary text-black text-sm md:text-base font-bold rounded-full transition-all duration-300 hover:scale-105 hover:bg-cyan-300 flex items-center justify-center gap-2"
                        >
                            Explore Events
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>

                        <Link
                            to="/about"
                            className="group px-6 py-3 md:px-8 md:py-4 bg-white/5 text-white text-sm md:text-base border border-white/10 rounded-full transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:border-white/20 flex items-center justify-center gap-2"
                        >
                            <ShieldCheck className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                            About ASTRA
                        </Link>
                    </div>
                </ScrollReveal>

                {/* Bottom Stats Grid */}
                <ScrollReveal variant="up" delay={0.8} width="100%">
                    <div className="mt-16 md:mt-24 flex items-center justify-center border-t border-white/5 pt-8 w-full max-w-4xl mx-auto opacity-60 hover:opacity-100 transition-opacity duration-500">
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

            {/* Bottom Fade Gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none z-10"></div>
        </section>
    );
};

export default Hero;

