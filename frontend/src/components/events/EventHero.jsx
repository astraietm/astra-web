import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Terminal, Lock } from 'lucide-react';

const EventHero = () => {
    const containerRef = useRef(null);
    const { scrollY } = useScroll();
    const [displayText, setDisplayText] = useState('');
    const fullText = '> ASTRA_EVENTS.INIT()';
    
    const y = useTransform(scrollY, [0, 500], [0, 200]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    // Terminal typing effect
    useEffect(() => {
        let index = 0;
        const timer = setInterval(() => {
            if (index <= fullText.length) {
                setDisplayText(fullText.slice(0, index));
                index++;
            } else {
                clearInterval(timer);
            }
        }, 80);
        return () => clearInterval(timer);
    }, []);

    return (
        <section ref={containerRef} className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#05080f]">
            
            {/* Scanline Overlay */}
            <div className="absolute inset-0 z-50 pointer-events-none opacity-[0.03] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.1)_2px,rgba(255,255,255,0.1)_4px)]" />
            
            {/* Matrix Rain Background */}
            <div className="absolute inset-0 z-0 opacity-10">
                <div className="matrix-rain" />
            </div>

            {/* Hex Grid Pattern */}
            <div className="absolute inset-0 z-0 opacity-5" 
                 style={{
                     backgroundImage: `radial-gradient(circle, rgba(99, 102, 241, 0.3) 1px, transparent 1px)`,
                     backgroundSize: '50px 50px',
                 }} 
            />

            {/* Animated Grid */}
            <div className="absolute inset-0 z-0 opacity-20" 
                 style={{
                     backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px), 
                                     linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)`,
                     backgroundSize: '100px 100px',
                     maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)',
                     animation: 'gridMove 20s linear infinite'
                 }} 
            />

            {/* Ambient Glows */}
            <motion.div 
                animate={{ 
                    scale: [1, 1.2, 1], 
                    opacity: [0.2, 0.4, 0.2],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" 
            />
            <motion.div 
                animate={{ 
                    scale: [1, 1.1, 1], 
                    opacity: [0.15, 0.3, 0.15],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px]" 
            />

            {/* Content */}
            <motion.div 
                style={{ y, opacity }}
                className="relative z-10 text-center px-4"
            >
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="text-5xl md:text-8xl font-bold tracking-tighter mb-6 font-display relative"
                >
                    <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/50">
                        ASTRA EVENTS
                    </span>
                    
                    {/* Hex ID */}
                    <div className="absolute -top-6 right-0 text-xs font-mono text-primary/40">
                        [0x4F2A]
                    </div>
                </motion.h1>

                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="text-lg md:text-xl text-gray-400 font-light tracking-wide max-w-lg mx-auto mb-8"
                >
                    <span className="text-green-400 font-mono">&gt;</span> Security is not learned. It is{' '}
                    <span className="text-cyan-400 font-semibold">experienced</span>.
                </motion.p>

                {/* Access Badge */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="flex items-center justify-center gap-2 text-xs font-mono"
                >
                    <Lock className="w-3 h-3 text-green-400" />
                    <span className="text-green-400">CLEARANCE: PUBLIC</span>
                    <span className="text-gray-600">|</span>
                    <span className="text-gray-500">STATUS: ONLINE</span>
                </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1.5 }}
                className="absolute bottom-12 z-10 flex flex-col items-center gap-2"
            >
                <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-primary to-transparent animate-pulse" />
                <span className="text-[10px] uppercase tracking-widest text-primary/70 font-mono">
                    [SCROLL_TO_DECRYPT]
                </span>
            </motion.div>

            <style jsx>{`
                @keyframes gridMove {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(100px); }
                }
                
                .matrix-rain {
                    background: linear-gradient(transparent, rgba(0, 255, 65, 0.05));
                    animation: rain 20s linear infinite;
                }
                
                @keyframes rain {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100%); }
                }
            `}</style>
        </section>
    );
};

export default EventHero;
