import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowRight } from 'lucide-react';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden px-4">
            {/* Subtle Background Effects */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20"></div>
            
            {/* Glowing Orb */}
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"></div>

            <div className="container mx-auto max-w-6xl relative z-10">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    
                    {/* Left Side - Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6 text-center md:text-left"
                    >
                        {/* 404 Number */}
                        <div>
                            <h1 className="text-8xl md:text-9xl font-bold text-white mb-4 tracking-tight">
                                404
                            </h1>
                            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
                                Access forbidden
                            </h2>
                            <p className="text-gray-400 text-lg max-w-md">
                                You've tried to access a page you did not have prior authorization for.
                            </p>
                        </div>

                        {/* CTA Button */}
                        <div className="pt-4">
                            <button
                                onClick={() => navigate('/')}
                                className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 cursor-pointer"
                            >
                                <Home className="w-4 h-4" />
                                Go to Homepage
                            </button>
                        </div>
                    </motion.div>

                    {/* Right Side - Illustration */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex justify-center"
                    >
                        <div className="relative w-full max-w-md">
                            {/* Door Illustration */}
                            <svg viewBox="0 0 400 400" className="w-full h-auto">
                                {/* Door Frame */}
                                <rect x="120" y="80" width="160" height="280" rx="80" fill="#1a1a2e" stroke="#6366F1" strokeWidth="3"/>
                                
                                {/* Door */}
                                <rect x="130" y="90" width="140" height="260" rx="70" fill="#0f0f1e"/>
                                
                                {/* Door Shadow/Depth */}
                                <rect x="135" y="95" width="130" height="250" rx="65" fill="#1a1a2e" opacity="0.5"/>
                                
                                {/* Caution Tape */}
                                <g>
                                    <rect x="100" y="180" width="200" height="20" fill="#fbbf24" opacity="0.9"/>
                                    <text x="120" y="195" fill="#000" fontSize="10" fontWeight="bold" fontFamily="monospace">
                                        NO ENTRY   NO ENTRY   NO EN
                                    </text>
                                </g>
                                
                                {/* Eyes on door */}
                                <circle cx="180" cy="150" r="3" fill="#6366F1"/>
                                <circle cx="220" cy="150" r="3" fill="#6366F1"/>
                                
                                {/* Sad mouth */}
                                <path d="M 170 170 Q 200 160 230 170" stroke="#6366F1" strokeWidth="2" fill="none" strokeLinecap="round"/>
                                
                                {/* Grass at bottom */}
                                <g opacity="0.3">
                                    <line x1="100" y1="360" x2="105" y2="350" stroke="#6366F1" strokeWidth="2"/>
                                    <line x1="115" y1="360" x2="120" y2="348" stroke="#6366F1" strokeWidth="2"/>
                                    <line x1="130" y1="360" x2="135" y2="352" stroke="#6366F1" strokeWidth="2"/>
                                    <line x1="270" y1="360" x2="275" y2="350" stroke="#6366F1" strokeWidth="2"/>
                                    <line x1="285" y1="360" x2="290" y2="348" stroke="#6366F1" strokeWidth="2"/>
                                    <line x1="300" y1="360" x2="305" y2="352" stroke="#6366F1" strokeWidth="2"/>
                                </g>
                            </svg>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
};

export default NotFound;
