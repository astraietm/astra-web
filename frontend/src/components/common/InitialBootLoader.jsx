import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield } from 'lucide-react';

const InitialBootLoader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500); 
          return 100;
        }
        return prev + Math.floor(Math.random() * 8) + 3; 
      });
    }, 150);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-background flex items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
    >
        {/* Subtle Background Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
        
        <div className="relative flex flex-col items-center justify-center w-full max-w-xs z-10 p-8">
            
            {/* Minimal Logo */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="mb-8 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
            >
                <Shield className="w-10 h-10 text-primary" />
            </motion.div>

            {/* Typography */}
            <motion.h1 
                className="text-2xl font-display font-medium text-white mb-8 tracking-widest"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                ASTRA
            </motion.h1>

            {/* Minimal Progress Bar */}
            <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                    className="h-full bg-primary"
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "linear" }}
                />
            </div>
            
            {/* Loading Status */}
            <div className="mt-4 flex justify-between w-full text-[10px] text-gray-500 font-mono uppercase tracking-widest">
                <span>Loading Assets</span>
                <span>{Math.min(progress, 100)}%</span>
            </div>

        </div>
    </motion.div>
  );
};

export default InitialBootLoader;
