import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const CinematicBackground = () => {
    const { scrollY } = useScroll();
    
    // Parallax transforms for different layers
    const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
    const y2 = useTransform(scrollY, [0, 1000], [0, 100]);
    const y3 = useTransform(scrollY, [0, 1000], [0, 50]);

    return (
        <div className="fixed inset-0 z-0 overflow-hidden bg-gradient-to-b from-[#0a0e1a] via-[#050812] to-[#000000]">
            
            {/* Layer 1: Deep Background Particles (Slowest) */}
            <motion.div style={{ y: y3 }} className="absolute inset-0">
                {[...Array(30)].map((_, i) => (
                    <motion.div
                        key={`deep-${i}`}
                        className="absolute w-0.5 h-0.5 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            background: i % 3 === 0 ? '#00f2ff' : i % 3 === 1 ? '#7b00ff' : '#4c6ef5',
                            boxShadow: `0 0 8px ${i % 3 === 0 ? '#00f2ff' : i % 3 === 1 ? '#7b00ff' : '#4c6ef5'}`,
                            opacity: 0.3,
                        }}
                        animate={{
                            y: [0, -20, 0],
                            x: [0, Math.random() * 10 - 5, 0],
                            opacity: [0.2, 0.4, 0.2],
                        }}
                        transition={{
                            duration: 5 + Math.random() * 3,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </motion.div>

            {/* Layer 2: Mid-depth Network Lines */}
            <motion.div style={{ y: y2 }} className="absolute inset-0">
                <svg className="absolute inset-0 w-full h-full opacity-15">
                    <defs>
                        <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#00f2ff" stopOpacity="0" />
                            <stop offset="50%" stopColor="#00f2ff" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#00f2ff" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#7b00ff" stopOpacity="0" />
                            <stop offset="50%" stopColor="#7b00ff" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#7b00ff" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    {[...Array(6)].map((_, i) => (
                        <motion.line
                            key={i}
                            x1="0"
                            y1={`${15 + i * 15}%`}
                            x2="100%"
                            y2={`${15 + i * 15}%`}
                            stroke={i % 2 === 0 ? "url(#lineGradient1)" : "url(#lineGradient2)"}
                            strokeWidth="0.5"
                            animate={{
                                opacity: [0.15, 0.4, 0.15],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                delay: i * 0.6,
                            }}
                        />
                    ))}
                </svg>
            </motion.div>

            {/* Layer 3: Foreground Floating Nodes (Fastest parallax) */}
            <motion.div style={{ y: y1 }} className="absolute inset-0">
                {[...Array(25)].map((_, i) => (
                    <motion.div
                        key={`front-${i}`}
                        className="absolute w-1 h-1 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            background: i % 2 === 0 ? '#00f2ff' : '#7b00ff',
                            boxShadow: i % 2 === 0 ? '0 0 12px #00f2ff' : '0 0 12px #7b00ff',
                        }}
                        animate={{
                            y: [0, -40, 0],
                            x: [0, Math.random() * 15 - 7.5, 0],
                            opacity: [0.4, 0.9, 0.4],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 3,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </motion.div>

            {/* Atmospheric Light Waves */}
            <motion.div
                className="absolute inset-0 pointer-events-none opacity-20"
                animate={{
                    background: [
                        'radial-gradient(circle at 30% 50%, rgba(0, 242, 255, 0.1) 0%, transparent 50%)',
                        'radial-gradient(circle at 70% 50%, rgba(123, 0, 255, 0.1) 0%, transparent 50%)',
                        'radial-gradient(circle at 30% 50%, rgba(0, 242, 255, 0.1) 0%, transparent 50%)',
                    ],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />

            {/* Security Scan Pulse (Horizontal) */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'linear-gradient(180deg, transparent 0%, rgba(76, 110, 245, 0.08) 50%, transparent 100%)',
                    height: '150px',
                }}
                animate={{
                    y: ['-150px', '100vh'],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: 'linear',
                }}
            />

            {/* Volumetric Lighting - Cinematic Depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-70 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />
            
            {/* Subtle top glow for institutional feel */}
            <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-blue-950/10 to-transparent pointer-events-none" />
        </div>
    );
};

export default CinematicBackground;
