import React from 'react';
import { motion } from 'framer-motion';

const PageLoader = () => {
    return (
        <div className="w-full min-h-[60vh] flex flex-col items-center justify-center bg-transparent">
            <div className="relative">
                {/* Outer Ring */}
                <motion.div
                    className="w-16 h-16 border-2 border-primary/20 border-t-primary rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                
                {/* Inner Ring */}
                <motion.div
                    className="absolute inset-0 m-auto w-10 h-10 border-2 border-primary/10 border-b-primary rounded-full"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />

                {/* Center Glow */}
                <div className="absolute inset-0 m-auto w-2 h-2 bg-primary rounded-full blur-[2px] animate-pulse" />
            </div>
            
            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="mt-6 text-[10px] uppercase tracking-[0.3em] text-primary font-mono font-semibold"
            >
                Synchronizing Data...
            </motion.p>
        </div>
    );
};

export default PageLoader;
