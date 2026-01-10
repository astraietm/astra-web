import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Lock, Unlock, ShieldAlert } from 'lucide-react';


const codeSnippets = [
    "INITIALIZING_PROTOCOL...",
    "BYPASSING_FIREWALL...",
    "ESTABLISHING_UPLINK...",
    "TOKEN_GENERATED: 0x44F2A",
    "REROUTING_PROXY...",
    "SECURE_CONNECTION: OK",
    "LOADING_MODULES...",
    "INTEGRITY_CHECK: PASSED",
    "GRANTING_ACCESS...",
    "WELCOME_TO_ASTRA"
];

const InitialBootLoader = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [logs, setLogs] = useState([]);
    const [isAccessGranted, setIsAccessGranted] = useState(false);
    const scrollRef = useRef(null);

    // 1. Progress Simulation
    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) return 100;
                // Random jumps for realistic network lag feel
                const jump = Math.random() > 0.8 ? 8 : 1;
                return Math.min(prev + jump, 100);
            });
        }, 40);
        return () => clearInterval(timer);
    }, []);

    // 2. Log Generation based on progress
    useEffect(() => {
        if (progress >= 100) {
            setIsAccessGranted(true);
            setTimeout(onComplete, 500); // Reduced delay since animation is gone
        } else {
            // Add random logs occasionally
            if (Math.random() > 0.6) {
                const snippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
                const timestamp = new Date().toISOString().split('T')[1].slice(0, 8);
                setLogs(prev => [...prev.slice(-8), `[${timestamp}] ${snippet}`]); // Keep last 8 logs
            }
        }
    }, [progress, onComplete]);

    // Auto-scroll logs
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    // Block Progress Bar Builder
    const totalBlocks = 20;
    const activeBlocks = Math.floor((progress / 100) * totalBlocks);

    return (
        <motion.div
            className="fixed inset-0 z-[9999] bg-black font-mono text-cyan-400 overflow-hidden flex items-center justify-center"
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
        >
            {/* Subtle Background */}
            <div className="absolute inset-0 bg-cyan-900/5 pointer-events-none z-10"></div>

            {/* Minimal Content */}
            <div className="relative z-30 w-full max-w-lg p-6 flex flex-col items-start gap-4">

                {/* Minimal Code Window */}
                <div className="w-full h-40 font-mono text-sm md:text-base text-cyan-300/90 overflow-hidden flex flex-col justify-end">
                    {logs.map((log, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="whitespace-nowrap"
                        >
                            {">"} {log}
                        </motion.div>
                    ))}
                    {!isAccessGranted && (
                        <motion.div
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ repeat: Infinity, duration: 0.8 }}
                            className="w-2 h-4 bg-cyan-500 inline-block align-middle ml-1"
                        />
                    )}
                </div>

                {/* Minimal Progress Line */}
                <div className="w-full h-[1px] bg-cyan-900/30 overflow-hidden relative">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-cyan-500 shadow-[0_0_10px_#06b6d4]"
                    />
                </div>

                <div className="flex justify-between w-full text-[10px] tracking-widest text-cyan-600 uppercase">
                    <span>System_Override</span>
                    <span>{Math.floor(progress)}%</span>
                </div>

            </div>
        </motion.div>
    );
};

export default InitialBootLoader;
