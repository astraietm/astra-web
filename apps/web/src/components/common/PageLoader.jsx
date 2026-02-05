import React from 'react';
import { motion } from 'framer-motion';

const PageLoader = () => {
    return (
        <div className="w-full min-h-[60vh] flex flex-col items-center justify-center bg-transparent relative overflow-hidden">
            <div className="relative group">
                {/* Orbital System */}
                <div className="relative w-24 h-24">
                    {/* Ring 1 - Fast Outer */}
                    <motion.div
                        className="absolute inset-0 rounded-full border border-blue-500/10 border-t-blue-500/80"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                    
                    {/* Ring 2 - Slow Counter */}
                    <motion.div
                        className="absolute inset-2 rounded-full border border-white/5 border-b-white/40"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Ring 3 - Pulse Middle */}
                    <motion.div
                        className="absolute inset-6 rounded-full border border-blue-400/20"
                        animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.1, 0.4, 0.1]
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Core Identity */}
                    <div className="absolute inset-0 m-auto w-1 h-1 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,1)]" />
                </div>
                
                {/* Aura Glow */}
                <div className="absolute inset-[-40px] bg-blue-600/5 blur-[40px] rounded-full pointer-events-none group-hover:bg-blue-600/10 transition-colors duration-1000" />
            </div>
            
            <div className="mt-10 flex flex-col items-center gap-3">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-3"
                >
                    <div className="h-px w-8 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
                    <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.5em]">System_Sync</span>
                    <div className="h-px w-8 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
                </motion.div>
                
                <motion.p 
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="text-[10px] uppercase tracking-[0.2em] text-blue-400/60 font-black font-mono"
                >
                    Recalibrating_Nodes...
                </motion.p>
            </div>
        </div>
    );
};

export default PageLoader;
