import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const InitialBootLoader = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                // Random increments for a more "realistic" loading feel
                const diff = Math.random() * 15;
                return Math.min(prev + diff, 100);
            });
        }, 150);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (progress >= 100) {
            const timeout = setTimeout(onComplete, 800);
            return () => clearTimeout(timeout);
        }
    }, [progress, onComplete]);

    return (
        <div className="fixed inset-0 z-[99999] bg-[#020202] flex items-center justify-center overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
                
                {/* Micro-Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
            </div>

            <div className="relative flex flex-col items-center gap-12 md:gap-16 px-6 w-full max-w-sm">
                {/* Logo Animation */}
                <div className="relative group">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
                        className="relative z-10 will-change-transform"
                    >
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl md:rounded-3xl bg-white/[0.02] border border-white/10 flex items-center justify-center backdrop-blur-3xl shadow-[0_0_50px_rgba(255,255,255,0.05)] relative overflow-hidden group-hover:border-white/20 transition-colors">
                            <motion.div
                                animate={{ 
                                    rotate: [0, 10, -10, 0],
                                    scale: [1, 1.05, 0.95, 1]
                                }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="will-change-transform"
                            >
                                <svg width="40" height="40" md:width="48" md:height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="white" className="drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
                                </svg>
                            </motion.div>
                            
                            {/* Inner Shimmer */}
                            <motion.div 
                                className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full"
                                animate={{ x: ['100%', '-100%'] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            />
                        </div>
                    </motion.div>
                    
                    {/* Outer Glow */}
                    <div className="absolute inset-0 bg-blue-500/20 blur-[40px] md:blur-[60px] rounded-full scale-150 animate-pulse" />
                </div>

                {/* Loading Content */}
                <div className="w-full space-y-8 flex flex-col items-center">
                    <div className="text-center space-y-2">
                        <motion.h1 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="text-white text-2xl md:text-3xl font-black tracking-[0.4em] uppercase"
                        >
                            ASTRA
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] md:tracking-[0.6em] whitespace-nowrap"
                        >
                            SECURE_COMM_ESTABLISHED
                        </motion.p>
                    </div>

                    {/* Premium Progress Bar */}
                    <div className="w-full relative h-[2px] md:h-[3px]">
                        <div className="absolute inset-0 bg-white/[0.05] rounded-full overflow-hidden">
                            <motion.div 
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            />
                        </div>
                        
                        <motion.div 
                            className="absolute inset-y-0 left-0 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,1)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        />
                    </div>

                    {/* Numeric Status */}
                    <div className="flex justify-between w-full px-1">
                        <span className="text-[9px] md:text-[10px] font-mono text-slate-700 tracking-widest">{Math.floor(progress)}%_STABLE</span>
                        <div className="flex gap-2">
                            <motion.div 
                                className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-blue-500"
                                animate={{ opacity: [1, 0.3, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />
                            <motion.div 
                                className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-blue-500/40"
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />
                        </div>
                    </div>
                </div>
            </div>


            {/* Corner Markers */}
            <div className="absolute top-12 left-12 w-6 h-6 border-t border-l border-white/10" />
            <div className="absolute top-12 right-12 w-6 h-6 border-t border-r border-white/10" />
            <div className="absolute bottom-12 left-12 w-6 h-6 border-b border-l border-white/10" />
            <div className="absolute bottom-12 right-12 w-6 h-6 border-b border-r border-white/10" />
        </div>
    );
};

export default InitialBootLoader;
