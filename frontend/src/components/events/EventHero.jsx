import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const EventHero = () => {
    const containerRef = useRef(null);
    const { scrollY } = useScroll();
    
    // Parallax effect for text
    const y = useTransform(scrollY, [0, 500], [0, 200]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <section ref={containerRef} className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#0A0F1C]">
            
            {/* Background Layers */}
            <div className="absolute inset-0 z-0">
                {/* 1. Base Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#05080f] via-[#0A0F1C] to-[#0A0F1C]" />

                {/* 2. Abstract Geometric Grid (CSS/SVG) */}
                <div className="absolute inset-0 opacity-20" 
                     style={{
                         backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), 
                                         linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
                         backgroundSize: '100px 100px',
                         maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
                     }} 
                />

                {/* 3. Ambient Light Fields (Animated) */}
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1], 
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]" 
                />
                <motion.div 
                    animate={{ 
                        scale: [1, 1.1, 1], 
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px]" 
                />
            </div>

            {/* Content */}
            <motion.div 
                style={{ y, opacity }}
                className="relative z-10 text-center px-4"
            >
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="text-5xl md:text-8xl font-thin tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/50 mb-6 font-inter"
                >
                    ASTRA Events
                </motion.h1>

                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="text-lg md:text-xl text-gray-400 font-light tracking-wide max-w-lg mx-auto"
                >
                    Security is not learned. It is experienced.
                </motion.p>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1.5 }}
                className="absolute bottom-12 z-10 flex flex-col items-center gap-2"
            >
                <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-gray-500 to-transparent" />
                <span className="text-[10px] uppercase tracking-widest text-gray-500">Scroll to explore</span>
            </motion.div>

            {/* Vignette Overlay */}
            <div className="absolute inset-0 z-20 pointer-events-none bg-radial-gradient-vignette" />
        </section>
    );
};

export default EventHero;
