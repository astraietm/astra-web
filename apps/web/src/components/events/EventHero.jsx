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
            <div className="absolute inset-0 z-0">
                {/* Gradient Beams */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-600/10 rounded-full blur-[100px]" />
                
                {/* Technical Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] opacity-20 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
                
                {/* Floating Tech Icons Decor */}
                <motion.div 
                    animate={{ y: [0, -20, 0], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 left-1/4"
                >
                    <Cpu className="w-12 h-12 text-blue-500/20" />
                </motion.div>
                <motion.div 
                    animate={{ y: [0, 20, 0], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-1/4 right-1/3"
                >
                    <Layers className="w-10 h-10 text-blue-400/20" />
                </motion.div>
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
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-400/80">Innovation Hub / 2026</span>
                </motion.div>

                {/* Precision Typography Title */}
                <motion.h1 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
                    className="text-6xl md:text-8xl lg:text-[9rem] font-bold text-white mb-8 tracking-tighter leading-[0.85] font-outfit"
                >
                    <span className="inline-block bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40">
                        Zero
                    </span>
                    <span className="inline-block bg-clip-text text-transparent bg-gradient-to-b from-blue-400 to-blue-700 ml-4 md:ml-6 uppercase font-bold opacity-90">
                        Day
                    </span>
                </motion.h1>

                {/* Minimalist Professional Subtitle */}
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
                    className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed font-normal mb-14 px-4"
                >
                    Experience the nexus of engineering excellence. A curated collection of workshops, 
                    hackathons, and high-impact seminars for the next generation of global tech leaders.
                </motion.p>

                {/* Luxury Search & Filter Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.4, ease: [0.19, 1, 0.22, 1] }}
                    className="relative max-w-xl mx-auto flex items-center gap-3 p-1.5 bg-white/[0.03] border border-white/10 rounded-2xl backdrop-blur-2xl shadow-2xl group focus-within:border-blue-500/30 transition-all duration-500"
                >
                    <div className="flex-1 flex items-center pl-4 gap-3">
                        <Search className="w-4 h-4 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Explore classified sessions..."
                            className="bg-transparent border-none outline-none text-white text-sm w-full placeholder:text-gray-600 font-medium"
                        />
                    </div>
                    
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.05] hover:bg-white/10 rounded-xl border border-white/5 text-xs font-bold text-white transition-all">
                        <Filter className="w-3.5 h-3.5 text-blue-400" />
                        <span>Sort</span>
                    </button>
                    
                    <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all">
                        Search
                    </button>
                </motion.div>

            </motion.div>

        </section>
    );
};

export default EventHero;
