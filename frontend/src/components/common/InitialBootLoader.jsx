import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const InitialBootLoader = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);

    // Progress simulation - complete in 1 second
    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                return Math.min(prev + 10, 100);
            });
        }, 100);

        return () => clearInterval(timer);
    }, []);

    // Complete animation
    useEffect(() => {
        if (progress >= 100) {
            setTimeout(onComplete, 200);
        }
    }, [progress, onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-[9999] bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center overflow-hidden"
            exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.3 } }}
        >
            {/* Subtle Grid Background */}
            <div className="absolute inset-0 opacity-[0.02]">
                <div className="absolute inset-0" style={{
                    backgroundImage: `
                        linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px'
                }} />
            </div>

            {/* Ambient Gradient Orbs */}
            <motion.div
                className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"
                animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            />

            {/* Main Content */}
            <div className="relative z-10 text-center space-y-8">
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <h1 className="text-7xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-3"
                        style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                    >
                        ASTRA
                    </h1>
                    <p className="text-sm text-slate-400 tracking-[0.3em] uppercase">
                        Cybersecurity Association
                    </p>
                </motion.div>

                {/* Modern Progress Bar */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="w-80 mx-auto space-y-3"
                >
                    {/* Progress Container */}
                    <div className="relative h-1.5 bg-slate-800/50 rounded-full overflow-hidden backdrop-blur-sm">
                        {/* Progress Bar */}
                        <motion.div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-400 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.1 }}
                        >
                            {/* Shimmer Effect */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                animate={{ x: ['-100%', '200%'] }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                        </motion.div>

                        {/* Glow Effect */}
                        <motion.div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500/50 via-blue-500/50 to-cyan-400/50 blur-md"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.1 }}
                        />
                    </div>

                    {/* Progress Info */}
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 uppercase tracking-wider">
                            Loading
                        </span>
                        <motion.span
                            className="text-cyan-400 font-semibold tabular-nums"
                            key={progress}
                            initial={{ scale: 1.1 }}
                            animate={{ scale: 1 }}
                        >
                            {Math.floor(progress)}%
                        </motion.span>
                    </div>
                </motion.div>

                {/* Loading Indicator Dots */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-center gap-2"
                >
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400"
                            animate={{
                                opacity: [0.3, 1, 0.3],
                                scale: [0.8, 1.2, 0.8],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.2,
                            }}
                        />
                    ))}
                </motion.div>
            </div>

            {/* Floating Particles */}
            {[...Array(15)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-cyan-400/20 rounded-full"
                    style={{
                        left: `${10 + Math.random() * 80}%`,
                        top: `${10 + Math.random() * 80}%`,
                    }}
                    animate={{
                        y: [0, -20, 0],
                        opacity: [0, 0.5, 0],
                    }}
                    transition={{
                        duration: 2 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                    }}
                />
            ))}

            {/* Bottom Info */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-8 left-0 right-0 text-center"
            >
                <p className="text-xs text-slate-600">
                    Secure • Encrypted • Protected
                </p>
            </motion.div>
        </motion.div>
    );
};

export default InitialBootLoader;
