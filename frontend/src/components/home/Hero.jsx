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
            className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-32 pb-20 md:py-0"
        >
            {/* Main Content */}
            <div
                className="relative z-30 text-center px-4 max-w-5xl mx-auto flex flex-col items-center"
            >
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
                    <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
                        <Link
                            to="/events"
                            className="group px-8 py-4 bg-primary text-black text-base font-bold rounded-full transition-all duration-300 hover:bg-cyan-300 hover:scale-[1.02] flex items-center justify-center gap-2"
                        >
                            Register Now
                            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>

                        <Link
                            to="/about"
                            className="group px-8 py-4 bg-white/5 text-white text-base font-medium border border-white/10 rounded-full transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] flex items-center justify-center gap-2 backdrop-blur-sm"
                        >
                            <ShieldCheck className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
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
