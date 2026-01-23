import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const EventHero = () => {
    const containerRef = useRef(null);
    const { scrollY } = useScroll();
    
    // Smooth, subtle parallax
    const y = useTransform(scrollY, [0, 500], [0, 100]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <section ref={containerRef} className="relative min-h-[60vh] w-full flex flex-col items-center justify-center overflow-hidden bg-black">
            
            {/* --- HERO CONTENT --- */}
            <motion.div 
                style={{ y, opacity }}
                className="relative z-10 text-center px-4 max-w-4xl mx-auto"
            >
                {/* Pill Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-sm"
                >
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-xs font-medium text-gray-300 tracking-wide">ASTRA EVENTS</span>
                </motion.div>

                {/* Massive Modern Title */}
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.2, 0.65, 0.3, 0.9] }}
                    className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight leading-[1.1]"
                >
                    <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/70">
                        Zero
                    </span>
                    <span className="bg-clip-text text-transparent bg-gradient-to-b from-blue-400 to-blue-600 ml-4">
                        day
                    </span>
                </motion.h1>

                {/* Refined Subtitle */}
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.2, 0.65, 0.3, 0.9] }}
                    className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-normal"
                >
                    Join a community of innovators. Participate in world-class workshops, hackathons, and seminars designed for the next generation of engineers.
                </motion.p>

            </motion.div>

        </section>
    );
};

export default EventHero;
