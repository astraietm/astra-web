import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, Search, Filter, Cpu, Layers } from 'lucide-react';

const EventHero = () => {
    const containerRef = useRef(null);
    const { scrollY } = useScroll();
    
    // Smooth, subtle parallax
    const y = useTransform(scrollY, [0, 500], [0, 150]);
    const opacity = useTransform(scrollY, [0, 400], [1, 0]);
    const scale = useTransform(scrollY, [0, 400], [1, 1.05]);

    return (
        <section ref={containerRef} className="relative min-h-[75vh] w-full flex flex-col items-center justify-center overflow-hidden bg-black pb-20">
            
            {/* Cinematic Background Elements */}
            <div className="absolute inset-0 z-0 bg-black">
                {/* Base Gradient */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#0f172a,transparent_70%)]" />

                {/* Cyberpunk Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-50" />
                
                {/* Floating Tech Icons Decor - Kept as they add value here */}
                <motion.div 
                    animate={{ y: [0, -20, 0], opacity: [0.1, 0.4, 0.1] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 left-1/4"
                >
                    <Cpu className="w-12 h-12 text-blue-500/20" />
                </motion.div>
                <motion.div 
                    animate={{ y: [0, 20, 0], opacity: [0.1, 0.4, 0.1] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-1/4 right-1/3"
                >
                    <Layers className="w-10 h-10 text-blue-400/20" />
                </motion.div>
                
                {/* Aesthetic Noise */}
                <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.15] mix-blend-overlay" />
            </div>

            {/* --- HERO CONTENT --- */}
            <motion.div 
                style={{ y, opacity, scale }}
                className="relative z-10 text-center px-4 max-w-5xl mx-auto"
            >
                {/* Luxury Label */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="inline-flex items-center gap-2.5 px-4 py-2 mb-10 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                >
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                    <span className="text-[10px] font-medium tracking-widest text-blue-400">Innovation Hub 2026</span>
                </motion.div>

                {/* Precision Typography Title */}
                <motion.h1 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
                    className="text-5xl xs:text-6xl md:text-8xl lg:text-[9rem] font-bold text-white mb-8 tracking-tight leading-[0.9] font-outfit will-change-transform"
                >
                    <span className="inline-block bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40">
                        Zero
                    </span>
                    <span className="inline-block bg-clip-text text-transparent bg-gradient-to-b from-cyan-400 to-blue-600 ml-3 md:ml-6 font-bold opacity-90">
                        Day
                    </span>
                </motion.h1>

                {/* Minimalist Professional Subtitle */}
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
                    className="text-xs sm:text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium mb-14 px-6 tracking-wide opacity-80"
                >
                    Tactical deployment of engineering excellence. A curated collection of high-fidelity simulations for the next generation of security operators.
                </motion.p>

                {/* Luxury Search & Filter Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.4, ease: [0.19, 1, 0.22, 1] }}
                    className="relative max-w-xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-2 sm:p-1.5 bg-white/[0.02] border border-white/10 rounded-2xl md:rounded-3xl backdrop-blur-3xl shadow-2xl group focus-within:border-cyan-500/30 transition-all duration-700"
                >
                    <div className="flex-1 flex items-center pl-4 gap-3 py-2 sm:py-0">
                        <Search size={16} className="text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search event modules..."
                            className="bg-transparent border-none outline-none text-white text-[10px] sm:text-sm w-full placeholder:text-slate-600 font-medium tracking-wide"
                        />
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 sm:py-2.5 bg-white/[0.03] hover:bg-white/10 rounded-xl border border-white/5 text-[11px] font-semibold text-white tracking-wider transition-all active:scale-95">
                            <Filter size={14} className="text-cyan-400" />
                            <span>Filter</span>
                        </button>
                        
                        <button className="flex-1 sm:flex-none px-6 py-3 sm:py-2.5 bg-cyan-400 text-black rounded-xl text-[11px] font-bold tracking-wider shadow-[0_20px_40px_-10px_rgba(34,211,238,0.3)] hover:scale-[1.03] active:scale-95 transition-all">
                            Search Events
                        </button>
                    </div>
                </motion.div>


            </motion.div>

        </section>
    );
};

export default EventHero;
