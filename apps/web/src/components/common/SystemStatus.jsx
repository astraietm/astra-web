import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const logs = [
    "INITIALIZING_CORE...",
    "CHECKING_INTEGRITY...",
    "CONNECTING_TO_SECURE_NODE...",
    "ENCRYPTION_KEY: ROTATING...",
    "THREAT_LEVEL: LOW",
    "MONITORING_NETWORK_TRAFFIC...",
    "SYSTEM_OPTIMAL",
    "ASTRA_NET: ONLINE",
    "SCANNING_VULNERABILITIES...",
    "UPDATING_PROTOCOLS..."
];

const SystemStatus = ({ onClick }) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex(prev => (prev + 1) % logs.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div 
            onClick={onClick}
            className="fixed bottom-6 left-6 z-40 hidden lg:flex items-center gap-3 bg-[#0A0F1C]/90 backdrop-blur-md border border-white/10 px-4 py-2.5 rounded-full font-mono text-[10px] tracking-widest text-primary/80 cursor-pointer hover:bg-[#0A0F1C] hover:border-primary/30 transition-all select-none shadow-[0_0_20px_rgba(0,0,0,0.5)] group"
        >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <div className="w-48 overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.span
                        key={index}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="block truncate"
                    >
                        {"> "}{logs[index]}
                    </motion.span>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SystemStatus;
