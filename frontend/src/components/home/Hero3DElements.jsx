import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Wifi, Database, Lock, Activity } from 'lucide-react';

const Hero3DElements = () => {
    return (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full pointer-events-none hidden lg:block overflow-hidden">
            {/* Main 3D Scene Container */}
            <div 
                className="absolute right-[8%] top-1/2 -translate-y-1/2 scale-90"
                style={{ 
                    perspective: '1200px',
                    transformStyle: 'preserve-3d'
                }}
            >
                {/* Base Platform */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    style={{ 
                        transform: 'rotateX(60deg) rotateZ(-45deg)',
                        transformStyle: 'preserve-3d'
                    }}
                >
                    {/* Platform Base */}
                    <div className="relative">
                        {/* Bottom Platform */}
                        <div className="w-80 h-80 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-cyan-500/20 shadow-2xl relative overflow-hidden">
                            {/* Grid pattern */}
                            <div className="absolute inset-0 opacity-10">
                                <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
                                    {[...Array(64)].map((_, i) => (
                                        <div key={i} className="border border-cyan-400/30" />
                                    ))}
                                </div>
                            </div>
                            
                            {/* Glowing edge */}
                            <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 via-transparent to-transparent" />
                        </div>

                        {/* Main Server Rack - Back */}
                        <motion.div
                            className="absolute left-[15%] bottom-0 w-48 h-56 bg-gradient-to-br from-slate-800 to-slate-950 rounded-t-xl border-x border-t border-cyan-500/30 shadow-2xl"
                            style={{ transform: 'translateZ(20px)' }}
                            animate={{ y: [0, -3, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            {/* Server panels */}
                            <div className="p-4 space-y-3">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="h-8 bg-slate-900/80 rounded border border-slate-700/50 flex items-center px-3 gap-2">
                                        <motion.div 
                                            className="w-2 h-2 rounded-full"
                                            style={{ backgroundColor: i % 3 === 0 ? '#22c55e' : i % 3 === 1 ? '#06b6d4' : '#64748b' }}
                                            animate={{ opacity: i % 3 === 2 ? 0.3 : [0.5, 1, 0.5] }}
                                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                                        />
                                        <div className="flex-1 h-1 bg-cyan-500/10 rounded" />
                                        <div className="w-12 h-1 bg-cyan-500/20 rounded" />
                                    </div>
                                ))}
                            </div>

                            {/* Ventilation */}
                            <div className="absolute bottom-4 inset-x-4 h-8 bg-slate-950/50 rounded border border-slate-700/30">
                                <div className="grid grid-cols-12 gap-1 p-1 h-full">
                                    {[...Array(12)].map((_, i) => (
                                        <div key={i} className="bg-slate-800/50 rounded-sm" />
                                    ))}
                                </div>
                            </div>

                            {/* Side glow */}
                            <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-cyan-500/40 via-cyan-500/20 to-transparent" />
                        </motion.div>

                        {/* Network Switch - Front Left */}
                        <motion.div
                            className="absolute left-[10%] bottom-0 w-40 h-20 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg border border-cyan-500/40 shadow-xl"
                            style={{ transform: 'translateZ(40px)' }}
                            animate={{ y: [0, -2, 0] }}
                            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        >
                            {/* Port indicators */}
                            <div className="p-3">
                                <div className="grid grid-cols-8 gap-1.5">
                                    {[...Array(16)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="w-2 h-3 bg-slate-800 rounded-sm border border-slate-600"
                                            animate={{ 
                                                borderColor: i % 4 === 0 ? ['rgb(100, 116, 139)', 'rgb(34, 197, 94)', 'rgb(100, 116, 139)'] : 'rgb(100, 116, 139)'
                                            }}
                                            transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
                                        />
                                    ))}
                                </div>
                            </div>
                            
                            {/* Status LEDs */}
                            <div className="absolute top-2 right-3 flex gap-1.5">
                                <motion.div 
                                    className="w-1.5 h-1.5 bg-green-400 rounded-full shadow-lg shadow-green-400/50"
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                />
                                <motion.div 
                                    className="w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                                />
                            </div>
                        </motion.div>

                        {/* Firewall/Security Device - Front Right */}
                        <motion.div
                            className="absolute right-[15%] bottom-0 w-36 h-24 bg-gradient-to-br from-slate-800 to-slate-950 rounded-lg border border-purple-500/40 shadow-xl overflow-hidden"
                            style={{ transform: 'translateZ(35px)' }}
                            animate={{ y: [0, -2.5, 0] }}
                            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        >
                            {/* Shield icon */}
                            <div className="absolute top-3 left-3">
                                <Shield className="w-6 h-6 text-purple-400/60" strokeWidth={1.5} />
                            </div>

                            {/* Activity graph */}
                            <div className="absolute bottom-3 inset-x-3 h-10 flex items-end gap-1">
                                {[...Array(12)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="flex-1 bg-gradient-to-t from-purple-500/40 to-purple-500/20 rounded-t"
                                        animate={{ 
                                            height: ['20%', `${30 + Math.random() * 50}%`, '20%']
                                        }}
                                        transition={{ 
                                            duration: 2 + Math.random(), 
                                            repeat: Infinity,
                                            delay: i * 0.1
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Scan line */}
                            <motion.div
                                className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent"
                                animate={{ top: ['0%', '100%'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            />
                        </motion.div>

                        {/* Floating Shield - Top Center */}
                        <motion.div
                            className="absolute left-1/2 -translate-x-1/2 -top-32 w-40 h-40"
                            style={{ transform: 'translateZ(80px)' }}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ 
                                opacity: 1, 
                                scale: 1,
                                y: [0, -15, 0],
                                rotateZ: [0, 5, -5, 0]
                            }}
                            transition={{ 
                                opacity: { duration: 0.8, delay: 0.5 },
                                scale: { duration: 0.8, delay: 0.5 },
                                y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                                rotateZ: { duration: 8, repeat: Infinity, ease: "easeInOut" }
                            }}
                        >
                            <div className="relative w-full h-full">
                                {/* Shield background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-blue-600/30 backdrop-blur-md rounded-3xl border border-cyan-400/50 shadow-2xl" />
                                
                                {/* Shield icon */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Shield className="w-20 h-20 text-cyan-300" strokeWidth={1.5} />
                                </div>

                                {/* Rotating ring */}
                                <motion.div
                                    className="absolute inset-0 rounded-3xl border-2 border-cyan-400/30"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    style={{ borderStyle: 'dashed' }}
                                />

                                {/* Pulsing glow */}
                                <motion.div
                                    className="absolute inset-0 bg-cyan-400/20 rounded-3xl blur-2xl"
                                    animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.9, 1.1, 0.9] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                />
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Floating Icons Around */}
            {/* Database Icon */}
            <motion.div
                className="absolute right-[35%] top-[25%]"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
            >
                <motion.div
                    className="relative w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-600/20 backdrop-blur-sm rounded-2xl border border-green-400/40 flex items-center justify-center shadow-xl"
                    animate={{ y: [0, -12, 0], rotateZ: [0, -8, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                >
                    <Database className="w-10 h-10 text-green-400" strokeWidth={1.5} />
                    <motion.div
                        className="absolute inset-0 bg-green-400/20 rounded-2xl blur-xl"
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                    />
                </motion.div>
            </motion.div>

            {/* Lock Icon */}
            <motion.div
                className="absolute right-[15%] top-[70%]"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
            >
                <motion.div
                    className="relative w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-600/20 backdrop-blur-sm rounded-xl border border-purple-400/40 flex items-center justify-center shadow-xl"
                    animate={{ y: [0, -10, 0], rotateZ: [0, 10, 0] }}
                    transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                    <Lock className="w-8 h-8 text-purple-400" strokeWidth={1.5} />
                    <motion.div
                        className="absolute inset-0 bg-purple-400/20 rounded-xl blur-lg"
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </motion.div>
            </motion.div>

            {/* WiFi/Network Icon */}
            <motion.div
                className="absolute right-[40%] top-[60%]"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.4 }}
            >
                <motion.div
                    className="relative w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-sm rounded-lg border border-cyan-400/40 flex items-center justify-center shadow-lg"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                >
                    <Wifi className="w-7 h-7 text-cyan-400" strokeWidth={1.5} />
                    <motion.div
                        className="absolute inset-0 bg-cyan-400/20 rounded-lg blur-lg"
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2.2, repeat: Infinity }}
                    />
                </motion.div>
            </motion.div>

            {/* Connecting Lines */}
            <svg className="absolute inset-0 w-full h-full opacity-15">
                <defs>
                    <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgb(6, 182, 212)" stopOpacity="0" />
                        <stop offset="50%" stopColor="rgb(6, 182, 212)" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="rgb(6, 182, 212)" stopOpacity="0" />
                    </linearGradient>
                </defs>
                
                {[[60, 50, 65, 30], [60, 50, 75, 70], [60, 50, 60, 65]].map((coords, i) => (
                    <motion.line
                        key={i}
                        x1={`${coords[0]}%`} y1={`${coords[1]}%`}
                        x2={`${coords[2]}%`} y2={`${coords[3]}%`}
                        stroke="url(#line-grad)"
                        strokeWidth="1.5"
                        strokeDasharray="6 6"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: [0, 1, 0] }}
                        transition={{ 
                            duration: 3, 
                            delay: i * 0.5 + 1.5, 
                            repeat: Infinity,
                            repeatDelay: 2
                        }}
                    />
                ))}
            </svg>

            {/* Ambient Particles */}
            {[...Array(12)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                    style={{
                        right: `${15 + Math.random() * 45}%`,
                        top: `${15 + Math.random() * 70}%`,
                    }}
                    animate={{
                        opacity: [0, 0.8, 0],
                        scale: [0, 1.5, 0],
                    }}
                    transition={{
                        duration: 2.5 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 4,
                    }}
                />
            ))}
        </div>
    );
};

export default Hero3DElements;
