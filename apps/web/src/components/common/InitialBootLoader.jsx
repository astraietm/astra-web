import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const InitialBootLoader = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [logs, setLogs] = useState([]);

    const terminalLogs = [
        "$ sudo astra --init",
        "> Loading security modules...",
        "> Initializing firewall rules...",
        "> Mounting encrypted filesystem...",
        "> Starting threat detection engine...",
        "> Establishing secure connection...",
        "> All systems operational",
        "$ ACCESS GRANTED"
    ];

    // Progress simulation
    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                return Math.min(prev + 12.5, 100);
            });
        }, 80);

        return () => clearInterval(timer);
    }, []);

    // Terminal log progression
    useEffect(() => {
        let currentIndex = 0;
        const logTimer = setInterval(() => {
            if (currentIndex < terminalLogs.length) {
                setLogs(prev => [...prev, terminalLogs[currentIndex]]);
                currentIndex++;
            } else {
                clearInterval(logTimer);
            }
        }, 100);

        return () => clearInterval(logTimer);
    }, []);

    // Complete animation
    useEffect(() => {
        if (progress >= 100) {
            setTimeout(onComplete, 300);
        }
    }, [progress, onComplete]);

    return (
        <div
            className="fixed inset-0 z-[99999] bg-black flex items-center justify-center font-mono w-screen h-[100dvh]"
        >
            {/* CRT Scanline Effect */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,0,0.02)_50%)] bg-[length:100%_4px]" />
                <motion.div
                    className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent h-2"
                    animate={{ y: ['0%', '100%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
            </div>

            {/* Vignette */}
            {/* Vignette - Simplified */}
            <div className="absolute inset-0 bg-black/40 pointer-events-none" />

            {/* Main Terminal */}
            <div className="relative z-10 w-full max-w-3xl px-4 sm:px-6 md:px-8">
                {/* Terminal Header */}
                <div className="border-2 border-green-500/30 bg-black/80 backdrop-blur-sm">
                    {/* Title Bar */}
                    <div className="bg-green-500/10 border-b border-green-500/30 px-2 sm:px-4 py-1.5 sm:py-2 flex items-center gap-2">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/50" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                            <div className="w-3 h-3 rounded-full bg-green-500/50" />
                        </div>
                        <span className="text-green-500 text-xs sm:text-sm ml-2">root@astra:~#</span>
                    </div>

                    {/* Terminal Content */}
                    <div className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
                        {/* ASTRA Logo - Responsive Switch */}
                        <motion.div
                            animate={{ opacity: 1 }}
                            className="text-green-500 mb-4 text-center"
                        >
                            {/* Desktop/Tablet ASCII Art (Hidden on Mobile) */}
                            <pre className="font-mono text-[10px] sm:text-xs md:text-sm leading-tight hidden sm:block">
{`
 █████╗ ███████╗████████╗██████╗  █████╗ 
██╔══██╗██╔════╝╚══██╔══╝██╔══██╗██╔══██╗
███████║███████╗   ██║   ██████╔╝███████║
██╔══██║╚════██║   ██║   ██╔══██╗██╔══██║
██║  ██║███████║   ██║   ██║  ██║██║  ██║
╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝
`}
                            </pre>

                            {/* Mobile Text Logo (Visible only on Mobile) */}
                            <h1 className="font-mono text-3xl sm:text-4xl font-bold tracking-widest sm:hidden my-4 text-green-500">
                                ASTRA
                            </h1>

                            <p className="text-green-500/60 text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] uppercase mt-2">
                                [ CYBERSECURITY OPERATIONS ]
                            </p>
                        </motion.div>

                        {/* Terminal Logs */}
                        <div className="space-y-1 h-32 sm:h-28 md:h-32 overflow-y-auto">
                             {logs.map((log, index) => (
                                <div
                                    key={index}
                                    className={`text-sm ${
                                        log.startsWith('$') ? 'text-green-400' : 
                                        log.includes('GRANTED') ? 'text-green-400 font-bold' :
                                        'text-green-500/70'
                                    }`}
                                >
                                    {log}
                                </div>
                            ))}
                        </div>

                        {/* Progress Bar - Responsive */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs text-green-500/70">
                                <span>[</span>
                                {/* Mobile Progress (Simple Bar) */}
                                <div className="flex-1 h-2 bg-green-900/30 sm:hidden relative overflow-hidden">
                                     <motion.div 
                                        className="absolute top-0 left-0 bottom-0 bg-green-500"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 0.1 }}
                                     />
                                </div>
                                {/* Desktop Progress (Blocks) */}
                                <div className="flex-1 hidden sm:flex">
                                    {Array.from({ length: 40 }).map((_, i) => (
                                        <span key={i} className={i < (progress / 2.5) ? 'text-green-500' : 'text-green-500/20'}>
                                            {i < (progress / 2.5) ? '█' : '░'}
                                        </span>
                                    ))}
                                </div>
                                <span>]</span>
                                <span className="text-green-400 font-bold tabular-nums w-12 text-right">
                                    {Math.floor(progress)}%
                                </span>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-2">
                                <motion.div
                                    className="w-2 h-2 bg-green-500 rounded-full"
                                    animate={{
                                        opacity: [1, 0.3, 1],
                                        boxShadow: ['0 0 0px #22c55e', '0 0 8px #22c55e', '0 0 0px #22c55e']
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                                <span className="text-green-500/70">SECURE</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <motion.div
                                    className="w-2 h-2 bg-green-500 rounded-full"
                                    animate={{
                                        opacity: [0.3, 1, 0.3],
                                        boxShadow: ['0 0 0px #22c55e', '0 0 8px #22c55e', '0 0 0px #22c55e']
                                    }}
                                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                />
                                <span className="text-green-500/70">ENCRYPTED</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <motion.div
                                    className="w-2 h-2 bg-green-500 rounded-full"
                                    animate={{
                                        opacity: [0.3, 1, 0.3],
                                        boxShadow: ['0 0 0px #22c55e', '0 0 8px #22c55e', '0 0 0px #22c55e']
                                    }}
                                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                                />
                                <span className="text-green-500/70">PROTECTED</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Corner Brackets */}
            <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-green-500/30" />
            <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-green-500/30" />
            <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-green-500/30" />
            <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-green-500/30" />
        </div>
    );
};

export default InitialBootLoader;
