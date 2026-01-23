import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Zap } from 'lucide-react';
import FadeInUp from '../common/FadeInUp';

const AboutSection = () => {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

    return (
        <section ref={targetRef} className="py-24 md:py-32 bg-background relative z-10 overflow-hidden">


            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    
                    {/* Left Column: Text Content */}
                    <div>
                        <FadeInUp>
                            <h4 className="text-cyan-400 font-bold tracking-widest text-sm uppercase mb-4">
                                About the Event
                            </h4>
                            
                            <h2 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-8 tracking-tighter">
                                2 DAYS OF <br />
                                PURE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">INNOVATION</span>.
                            </h2>
                            
                            <div className="space-y-6 text-gray-400 text-lg leading-relaxed max-w-xl">
                                <p>
                                    Zero Day is a flagship cybersecurity event by ASTRA – the Cybersecurity Association of KMCT IETM. It brings together students to explore real-world security concepts through hands-on learning, challenges, and interactive sessions. Designed for both beginners and enthusiasts, the event aims to build a strong cybersecurity mindset and practical skills.
                                </p>
                            </div>
                        </FadeInUp>
                    </div>

                    {/* Right Column: Visual Card */}
                    <motion.div style={{ y }} className="relative lg:h-[600px] flex items-center justify-center">
                        
                        {/* Background Year Text */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12rem] md:text-[18rem] font-bold text-white/[0.02] select-none pointer-events-none z-0">
                            2025
                        </div>

                        {/* Glass Card */}
                        <div className="relative z-10 w-full max-w-md aspect-square bg-gradient-to-br from-white/5 to-white/[0.01] backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 flex flex-col justify-between overflow-hidden group hover:border-cyan-500/30 transition-colors duration-500">
                            
                            {/* Inner Glow */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>

                            {/* Icon */}
                            <div className="w-16 h-16 rounded-2xl bg-cyan-500 text-black flex items-center justify-center shadow-[0_0_40px_-10px_rgba(6,182,212,0.5)] group-hover:scale-110 transition-transform duration-500">
                                <Zap className="w-8 h-8 fill-black" />
                            </div>

                            {/* Content */}
                            <div>
                                <h3 className="text-3xl font-bold text-white mb-3">FLAGSHIP EVENT</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    Organized by the Astra Team, bringing legacy and future tech together in a 48-hour marathon of code and creativity.
                                </p>
                            </div>

                            {/* Decorative Corner */}
                            <div className="absolute bottom-0 right-0 p-8 opacity-20">
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M40 40V0L0 40H40Z" fill="white"/>
                                </svg>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default AboutSection;
