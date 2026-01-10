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

                <ScrollReveal variant="up" delay={0.8} width="100%">
                    <div className="mt-16 md:mt-24 flex flex-col md:flex-row items-center justify-center gap-6 border-t border-white/5 pt-8 w-full max-w-4xl mx-auto opacity-80 hover:opacity-100 transition-opacity duration-500">
                         {/* Avatar Stack */}
                         <div className="flex -space-x-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-zinc-800 flex items-center justify-center overflow-hidden">
                                     <img 
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 20}`} 
                                        alt="Member" 
                                        className="w-full h-full"
                                     />
                                </div>
                            ))}
                            <div className="w-10 h-10 rounded-full border-2 border-background bg-zinc-800 flex items-center justify-center text-xs font-bold text-white">
                                +500
                            </div>
                         </div>

                         <div className="h-8 w-[1px] bg-white/10 hidden md:block" />

                         <div className="text-center md:text-left">
                             <div className="flex items-center justify-center md:justify-start gap-1 mb-1">
                                 {[1,2,3,4,5].map(star => (
                                     <svg key={star} className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 20 20">
                                         <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                     </svg>
                                 ))}
                             </div>
                             <p className="text-gray-400 text-sm font-medium">
                                 Rated <span className="text-white font-bold">Top Community</span> by students
                             </p>
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
