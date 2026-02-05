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
                            <h4 className="text-cyan-400 font-black tracking-[0.3em] text-[10px] uppercase mb-6 flex items-center gap-3">
                                <div className="w-8 h-px bg-cyan-400/30" />
                                OPERATIONAL_OVERVIEW
                            </h4>
                            
                            <h2 className="text-4xl md:text-7xl font-black text-white leading-[1.1] mb-10 tracking-tighter uppercase will-change-transform">
                                48 HOURS OF <br />
                                UNFILTERED <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">INTEL</span>.
                            </h2>
                            
                            <div className="space-y-6 text-gray-400 text-base md:text-lg leading-relaxed max-w-xl font-medium">
                                <p>
                                    ZERO DAY is the definitive cybersecurity assembly by ASTRA – the KMCT IETM Security Guild. We bridge the gap between abstract theory and operational reality through high-fidelity simulations, hardware hacking, and tactical workshops.
                                </p>
                            </div>
                        </FadeInUp>
                    </div>

                    {/* Right Column: Visual Card */}
                    <motion.div style={{ y }} className="relative min-h-[400px] lg:h-[600px] flex items-center justify-center mt-12 lg:mt-0 will-change-transform">
                        
                        {/* Background Year Text */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10rem] md:text-[18rem] font-black text-white/[0.01] select-none pointer-events-none z-0 tracking-tighter">
                            2025
                        </div>

                        {/* Glass Card */}
                        <div className="relative z-10 w-full max-w-[340px] sm:max-w-md aspect-square bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 flex flex-col justify-between overflow-hidden group hover:border-cyan-500/30 transition-all duration-700 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)]">
                            
                            {/* Inner Glow */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none group-hover:bg-cyan-500/20 transition-colors" />

                            {/* Icon */}
                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-cyan-400 text-black flex items-center justify-center shadow-[0_20px_40px_-5px_rgba(34,211,238,0.3)] group-hover:scale-110 group-hover:rotate-[10deg] transition-all duration-700">
                                <Zap className="w-7 h-7 md:w-8 md:h-8 fill-black" />
                            </div>

                            {/* Content */}
                            <div>
                                <h3 className="text-2xl md:text-3xl font-black text-white mb-4 tracking-tight uppercase">NODE_DOMINANCE</h3>
                                <p className="text-sm md:text-base text-gray-400 font-medium leading-relaxed uppercase tracking-wider opacity-80 group-hover:opacity-100 transition-opacity">
                                    Engineered by ASTRA Command. 48 hours of tactical execution, security frameworks, and network dominance.
                                </p>
                            </div>

                            {/* Corner Tech Decor */}
                            <div className="absolute bottom-6 right-6 opacity-20 group-hover:opacity-40 transition-opacity">
                               <div className="flex gap-1.5">
                                    {[0,1,2].map(i => (
                                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-white" />
                                    ))}
                               </div>
                            </div>
                        </div>
                    </motion.div>


                </div>
            </div>
        </section>
    );
};

export default AboutSection;
