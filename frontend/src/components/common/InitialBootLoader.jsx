import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Lock, Unlock, ShieldAlert } from 'lucide-react';

const codeSnippets = [
  "struct group_info init_groups = { .usage = ATOMIC_INIT(2) };",
  "export void secure_boot(void) { key_check(0x44); }",
  "buffer_overflow_protection = ACTIVE;",
  "analyzing_packets... [OK]",
  "rerouting_proxy_chains... [204.22.1.0]",
  "injecting_payload: ghost_protocol.exe",
  "bypassing_firewall_layer_7...",
  "handshake_syn_ack_complete.",
  "decrypting_admin_credentials...",
  "root_access: PENDING..."
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
           const timestamp = new Date().toISOString().split('T')[1].slice(0,8);
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
      className="fixed inset-0 z-[9999] bg-black font-mono text-green-500 overflow-hidden flex items-center justify-center"
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)", transition: { duration: 0.5 } }}
    >
        {/* CRT Scanline Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%] pointer-events-none z-20"></div>
        <div className="absolute inset-0 bg-green-500/5 animate-pulse pointer-events-none z-10"></div>
        
        {/* Main Console Container */}
        <div className="relative z-30 w-full max-w-2xl p-4 md:p-8 flex flex-col gap-6">
            
            {/* Header Status */}
            <div className="flex justify-between items-end border-b border-green-500/30 pb-2 mb-4">
                <div className="flex flex-col">
                    <span className="text-xs text-green-700 uppercase tracking-widest">Target System</span>
                    <h1 className="text-2xl md:text-4xl font-bold tracking-tighter flex items-center gap-2">
                        <Terminal className="w-6 h-6 md:w-8 md:h-8" /> 
                        ASTRA_MAINFRAME
                    </h1>
                </div>
                <div className="text-right">
                    <div className="text-xs text-green-700 uppercase tracking-widest">Status</div>
                    <div className={`text-xl font-bold ${isAccessGranted ? "text-white animate-pulse" : "text-green-400"}`}>
                        {isAccessGranted ? "UNLOCKED" : "BREACHING..."}
                    </div>
                </div>
            </div>

            {/* Central Visual: Lock/Unlock Animation */}
            <div className="h-32 flex items-center justify-center relative">
                 <AnimatePresence mode="wait">
                    {!isAccessGranted ? (
                        <motion.div 
                            key="lock"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="relative"
                        >
                            <ShieldAlert className="w-16 h-16 md:w-24 md:h-24 text-red-500 animate-[pulse_0.5s_infinite]" />
                            <div className="absolute -inset-4 border-2 border-red-500/30 rounded-full animate-[spin_3s_linear_infinite] border-t-transparent"></div>
                            <div className="absolute -inset-8 border border-red-500/20 rounded-full animate-[spin_5s_linear_infinite_reverse] border-b-transparent"></div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="unlock"
                            initial={{ scale: 0, rotate: 180 }}
                            animate={{ scale: 1.5, rotate: 0 }}
                            className="relative"
                        >
                            <Unlock className="w-16 h-16 md:w-24 md:h-24 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
                        </motion.div>
                    )}
                 </AnimatePresence>
            </div>

            {/* Rolling Logs Window */}
            <div 
                ref={scrollRef}
                className="h-32 bg-black/50 border border-green-500/20 p-4 rounded text-xs md:text-sm font-mono text-green-400/80 overflow-y-hidden flex flex-col justify-end shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]"
            >
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
                        className="w-2 h-4 bg-green-500 inline-block align-middle ml-1" 
                    />
                )}
            </div>

            {/* Retro Block Progress Bar */}
            <div className="space-y-2">
                <div className="flex justify-between text-xs uppercase tracking-wider text-green-600">
                    <span>Brute_Force_Progress</span>
                    <span>{Math.floor(progress)}%</span>
                </div>
                <div className="flex gap-[2px] h-4 w-full">
                    {Array.from({ length: totalBlocks }).map((_, i) => (
                        <div 
                            key={i}
                            className={`flex-1 transition-colors duration-100 ${
                                i < activeBlocks 
                                    ? "bg-green-500 shadow-[0_0_5px_#22c55e]" 
                                    : "bg-green-900/20"
                            }`}
                        />
                    ))}
                </div>
            </div>

            {/* Big Final Message Removed */}
        </div>
    </motion.div>
  );
};

export default InitialBootLoader;
