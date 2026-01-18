import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Gamepad2, Keyboard, Brain, Search, Lock, AlertTriangle, Users, Zap, Target, Award, Shield, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HawkinsLabDetail = ({ onRegister, isRegistered }) => {
  const navigate = useNavigate();
  const [flicker, setFlicker] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const [systemStatus, setSystemStatus] = useState('SCANNING VULNERABILITIES');
  const [dots, setDots] = useState('');

  // Flickering lights effect (scarcity = fear)
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.92) { // Increased rarity
        setFlicker(true);
        setTimeout(() => setFlicker(false), 100);
      }
    }, 6000); // Less frequent
    return () => clearInterval(interval);
  }, []);

  // Micro-glitch on title (every 6-10s)
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 150);
    }, Math.random() * 4000 + 6000); // 6-10s
    return () => clearInterval(glitchInterval);
  }, []);

  // System status typing animation
  useEffect(() => {
    const statuses = [
      'SCANNING VULNERABILITIES',
      'THREAT LEVEL: LOW',
      'SYSTEM STABLE',
      'UPSIDE DOWN PROTOCOL ACTIVE'
    ];
    let currentIndex = 0;
    
    const statusInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % statuses.length;
      setSystemStatus(statuses[currentIndex]);
    }, 4000);

    return () => clearInterval(statusInterval);
  }, []);

  // Animated dots for system status
  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(dotInterval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans selection:bg-red-500/30">
      
      {/* Layer 1: Base Radial Gradient (Breathing) */}
      <motion.div 
        className="fixed inset-0 pointer-events-none"
        animate={{
          background: [
            'radial-gradient(circle at 50% 50%, #120202 0%, #050505 100%)',
            'radial-gradient(circle at 45% 55%, #120202 0%, #050505 100%)',
            'radial-gradient(circle at 55% 45%, #120202 0%, #050505 100%)',
            'radial-gradient(circle at 50% 50%, #120202 0%, #050505 100%)'
          ]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      {/* Layer 2: Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay animate-noise"
           style={{ 
             backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
             backgroundSize: '200px 200px'
           }}
      />

      {/* Layer 3: Purple Fog (Secret Sauce - Cosmic Unease) */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        animate={{
          y: [-100, 100, -100]
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-purple-600/8 rounded-full blur-[120px]" />
      </motion.div>

      {/* CRT Scanlines Effect */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent animate-scan" 
             style={{ 
               backgroundSize: '100% 4px',
               backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)'
             }} 
        />
      </div>

      {/* Flickering Overlay */}
      <AnimatePresence>
        {flicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-red-500 pointer-events-none z-40"
          />
        )}
      </AnimatePresence>

      {/* Pulsing Red Glow */}
      <motion.div 
        animate={{ 
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="fixed top-[-20%] left-1/2 -translate-x-1/2 w-[100vw] h-[60vh] bg-red-600/20 rounded-full blur-[150px] pointer-events-none" 
      />

      {/* System Status (Bottom Left) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="fixed bottom-6 left-6 z-50 font-mono text-xs text-green-500/70 tracking-wider"
      >
        <div className="flex items-center gap-2 bg-black/80 backdrop-blur-sm px-3 py-2 rounded border border-green-500/20">
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-green-500 rounded-full"
          />
          <span>{systemStatus}{dots}</span>
        </div>
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/events')}
          className="group flex items-center gap-2 text-sm text-gray-500 hover:text-red-400 transition-all mb-8 sm:mb-12 hover:gap-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-mono uppercase tracking-wider">Back to Events</span>
        </motion.button>

        {/* Hero Section */}
        <div className="text-center max-w-5xl mx-auto mb-16 sm:mb-24">
            {/* Protocol Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="mb-6 sm:mb-8"
            >
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-red-950/20 border border-red-500/20 backdrop-blur-md">
                    <motion.span 
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-1.5 h-1.5 rounded-full bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.4)]" 
                    />
                    <span className="text-xs sm:text-sm font-medium text-red-300 uppercase tracking-[0.15em]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                      Hawkins Lab Protocol
                    </span>
                </div>
            </motion.div>

            {/* Main Title with Micro-Glitch */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="mb-6 sm:mb-8 relative"
            >
                <motion.h1 
                    animate={glitch ? { x: [-1, 1, -1, 0], y: [-1, 1, 0] } : {}}
                    transition={{ duration: 0.15 }}
                    className="text-6xl sm:text-7xl md:text-9xl font-bold relative inline-block"
                    style={{ 
                      letterSpacing: '-0.02em',
                      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                      fontWeight: 700
                    }}
                >
                    <span className="relative z-10 bg-gradient-to-b from-white via-red-50 to-red-200 bg-clip-text text-transparent"
                          style={{ 
                            textShadow: '0 0 60px rgba(239, 68, 68, 0.15), 0 0 120px rgba(239, 68, 68, 0.1)',
                            filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.5))'
                          }}>
                        HAWKINS LAB
                    </span>
                </motion.h1>
            </motion.div>

            {/* Tagline with Radio Signal Fluctuation */}
            <motion.p 
                animate={{ opacity: [1, 0.95, 1] }}
                transition={{ duration: 8, repeat: Infinity }}
                className="text-lg sm:text-xl md:text-2xl font-medium mb-8 sm:mb-12"
                style={{ 
                  color: '#fca5a5',
                  letterSpacing: '0.05em',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  textShadow: '0 2px 20px rgba(252, 165, 165, 0.2)'
                }}
            >
                Enter the Upside Down and Stop Vecna
            </motion.p>

            {/* Description */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="max-w-4xl mx-auto space-y-6 sm:space-y-8"
            >
                <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed font-medium px-4">
                    A <span className="text-red-400 font-bold">Stranger Things-themed</span> cyber mystery event where teams solve clues, analyze patterns, and complete computer-based tasks to progress through an immersive storyline.
                </p>
                
                {/* Dangerous Feature Chips */}
                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto px-4">
                    {[
                        { icon: Shield, text: "Data Accuracy" },
                        { icon: Zap, text: "Signal Analysis" },
                        { icon: Target, text: "Social Engineering" },
                        { icon: Lock, text: "Authentication" }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 + i * 0.1 }}
                            whileHover={{ 
                              scale: 1.03,
                              boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)'
                            }}
                            className="flex items-center gap-3 p-3 border border-[#ff1e1e] rounded-lg backdrop-blur-xl hover:bg-red-500/10 transition-all cursor-pointer"
                            style={{ backgroundColor: 'rgba(255, 0, 0, 0.05)' }}
                        >
                            <item.icon className="w-4 h-4 text-red-500" />
                            <span className="text-sm font-mono text-gray-300">{item.text}</span>
                        </motion.div>
                    ))}
                </div>
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 }}
                    className="inline-block px-6 py-3 bg-gradient-to-r from-red-900/50 via-red-800/30 to-transparent border-l-4 border-red-500 rounded-r-lg backdrop-blur-sm mx-4"
                >
                    <p className="text-white font-bold text-sm sm:text-base flex items-center gap-2">
                        <Award className="w-5 h-5 text-yellow-400" />
                        No advanced technical knowledge required — all students can participate!
                    </p>
                </motion.div>
            </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12">
            
            {/* Left Column - Details */}
            <div className="lg:col-span-8 space-y-8 sm:space-y-12">
                
                {/* Mission Structure (renamed from Event Format) */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="bg-gradient-to-br from-red-950/30 via-black to-black border border-red-900/30 p-6 sm:p-8 rounded-2xl relative overflow-hidden group backdrop-blur-sm"
                >
                    {/* Pulsing Left Border */}
                    <motion.div
                      animate={{ opacity: [0.4, 0.8, 0.4] }}
                      transition={{ duration: 6, repeat: Infinity }}
                      className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"
                    />
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-red-900/30">
                            <div className="p-2 bg-red-500/10 rounded-lg">
                                <Users className="w-6 h-6 text-red-500" />
                            </div>
                            <h3 className="text-2xl font-black text-white uppercase tracking-wider">Mission Structure</h3>
                        </div>
                        
                        <ul className="space-y-4 font-mono text-sm">
                            {[
                                "TEAM-BASED EVENT (2–4 MEMBERS PER TEAM)",
                                "5 LEVELS - 5 PCS (TO BE COMPLETED IN ORDER)",
                                "EACH LEVEL UNLOCKS THE NEXT",
                                "DIFFICULTY INCREASES GRADUALLY",
                                "FASTEST TEAM TO COMPLETE ALL LEVELS WINS"
                            ].map((text, i) => (
                                <motion.li
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.12 }}
                                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-red-950/20 transition-colors"
                                >
                                    <span className="text-red-500 mt-0.5 text-lg">⚠</span>
                                    <span className="text-gray-300">{text}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </div>
                </motion.div>

                {/* Clearance Levels with Lock States */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-gradient-to-br from-black via-red-950/20 to-black border border-red-900/30 p-6 sm:p-8 rounded-2xl backdrop-blur-sm"
                >
                    <div className="flex items-center gap-3 mb-8 pb-4 border-b border-red-900/30">
                        <div className="p-2 bg-red-500/10 rounded-lg">
                            <Zap className="w-6 h-6 text-red-500" />
                        </div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-wider">Clearance Levels</h3>
                    </div>
                    
                    <div className="space-y-4">
                        {[
                            { title: "GAMING", icon: Gamepad2, desc: "Test your reflexes and coordination", status: 'active' },
                            { title: "SPEED TYPING", icon: Keyboard, desc: "Data entry under pressure", status: 'locked' },
                            { title: "ANALYSIS & DECODING", icon: Brain, desc: "Pattern recognition challenge", status: 'locked' },
                            { title: "DIGITAL STALKING (TRACING)", icon: Search, desc: "OSINT investigation", status: 'locked' },
                            { title: "BRUTE FORCE APPROACH", icon: Lock, desc: "Authentication bypass", status: 'locked' }
                        ].map((lvl, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{
                                  boxShadow: '0 0 30px rgba(255, 30, 30, 0.3)'
                                }}
                                className="group relative"
                                style={{ opacity: lvl.status === 'locked' ? 0.6 : 1 }}
                            >
                                <div className={`flex items-center gap-4 p-4 bg-gradient-to-r from-red-950/20 to-transparent border rounded-xl transition-all duration-300 ${
                                  lvl.status === 'active' 
                                    ? 'border-red-500/40 bg-red-950/30' 
                                    : 'border-red-900/20'
                                }`}>
                                    {/* Level number */}
                                    <div className="text-5xl font-black text-red-900/40 group-hover:text-red-500/60 transition-colors tabular-nums">
                                        0{i + 1}
                                    </div>
                                    
                                    {/* Icon */}
                                    <div className="p-3 bg-red-500/10 rounded-lg group-hover:bg-red-500/20 transition-colors relative">
                                        <lvl.icon className="w-6 h-6 text-red-400 group-hover:text-red-300 transition-colors" />
                                        {lvl.status === 'locked' && (
                                          <Lock className="w-3 h-3 text-red-500 absolute -top-1 -right-1" />
                                        )}
                                    </div>
                                    
                                    {/* Text */}
                                    <div className="flex-1">
                                        <h4 className="text-lg font-black text-white mb-1 group-hover:text-red-400 transition-colors tracking-wide">
                                            {lvl.title}
                                        </h4>
                                        <p className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors">
                                            {lvl.desc}
                                        </p>
                                    </div>
                                    
                                    {/* Status indicator */}
                                    {lvl.status === 'active' && (
                                      <motion.div
                                        animate={{ opacity: [0.4, 1, 0.4] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="w-2 h-2 bg-red-500 rounded-full"
                                      />
                                    )}
                                </div>
                                
                                {/* Noise overlay for locked levels */}
                                {lvl.status === 'locked' && (
                                  <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay rounded-xl"
                                       style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'2\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")' }}
                                  />
                                )}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Containment Protocols (Enhanced) */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="bg-gradient-to-r from-red-950/40 via-red-900/20 to-transparent border-l-4 border-red-600 p-6 sm:p-8 rounded-r-2xl backdrop-blur-sm relative"
                >
                    {/* Flicker effect on border (once on load) */}
                    <motion.div
                      initial={{ opacity: 1 }}
                      animate={{ opacity: [1, 0.3, 1, 0.5, 1] }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="absolute left-0 top-0 bottom-0 w-1 bg-red-600"
                    />
                    
                    <div className="flex items-center gap-3 mb-6">
                        <motion.div
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <AlertTriangle className="w-7 h-7 text-red-500" />
                        </motion.div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-[0.15em]">Containment Protocols</h3>
                    </div>
                    
                    <ul className="grid gap-4 font-mono text-sm">
                        {[
                            "TEAMS MUST FOLLOW THE ASSIGNED PC ORDER",
                            "SKIPPING LEVELS OR SHARING CLUES IS STRICTLY PROHIBITED",
                            "ONLY THE PROVIDED SYSTEMS MAY BE USED",
                            "NO TEAM CHANGES ONCE THE EVENT STARTS"
                        ].map((rule, i) => (
                            <motion.li
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-500/10 transition-colors border border-red-900/20 hover:border-red-500/30"
                            >
                                <span className="w-2 h-2 bg-red-500 transform rotate-45 shrink-0" />
                                <span className="text-gray-300">{rule}</span>
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>

            </div>

            {/* Right Column - Cinematic CTA */}
            <div className="lg:col-span-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="sticky top-8"
                >
                    <div className="bg-gradient-to-br from-red-950/40 via-black to-black border border-red-900/40 p-6 sm:p-8 rounded-2xl shadow-2xl shadow-red-900/30 backdrop-blur-sm">
                        {/* Status Badge with Breathing Glow */}
                        <div className="mb-8 text-center">
                            <p className="text-gray-500 uppercase tracking-[0.2em] text-xs mb-3 font-mono">Registration Status</p>
                            <motion.div 
                                animate={{ 
                                    boxShadow: [
                                      '0 0 20px rgba(34, 197, 94, 0.3)', 
                                      '0 0 30px rgba(34, 197, 94, 0.5)', 
                                      '0 0 20px rgba(34, 197, 94, 0.3)'
                                    ]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="inline-block px-5 py-2 bg-green-500/20 text-green-400 border border-green-500/40 rounded-full text-sm font-black uppercase tracking-wider"
                            >
                                ● OPEN FOR ALL STUDENTS
                            </motion.div>
                        </div>

                        {/* Event Info */}
                        <ul className="space-y-4 mb-8 pb-8 border-b border-red-900/30">
                            {[
                                { label: "Theme", value: "Stranger Things" },
                                { label: "Difficulty", value: "Beginner Friendly" },
                                { label: "Prerequisites", value: "None" }
                            ].map((item, i) => (
                                <li key={i} className="flex justify-between items-center text-sm p-3 rounded-lg bg-red-950/20 border border-red-900/20">
                                    <span className="text-gray-500 font-mono uppercase tracking-wider">{item.label}</span>
                                    <span className="text-white font-bold">{item.value}</span>
                                </li>
                            ))}
                        </ul>

                        {/* Cinematic CTA Button */}
                        <motion.button 
                            onClick={onRegister}
                            disabled={isRegistered}
                            whileHover={!isRegistered ? { 
                              scale: 1.02,
                              boxShadow: '0 0 50px rgba(220, 38, 38, 0.8)'
                            } : {}}
                            whileTap={!isRegistered ? { 
                              scale: 0.98 
                            } : {}}
                            animate={{
                              boxShadow: isRegistered 
                                ? 'none'
                                : [
                                    '0 0 30px rgba(220, 38, 38, 0.5)',
                                    '0 0 40px rgba(220, 38, 38, 0.7)',
                                    '0 0 30px rgba(220, 38, 38, 0.5)'
                                  ]
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:from-gray-800 disabled:to-gray-800 disabled:text-gray-500 text-white font-black text-lg rounded-xl transition-all disabled:shadow-none uppercase tracking-wider relative overflow-hidden"
                        >
                            {/* Screen pulse on click */}
                            <span className="relative z-10">
                              {isRegistered ? '✓ Already Registered' : 'Initiate Protocol'}
                            </span>
                        </motion.button>
                        
                        <p className="text-center text-xs text-gray-600 mt-4 font-mono uppercase tracking-widest">
                            Save Hawkins. Save the World.
                        </p>
                    </div>
                </motion.div>
            </div>

        </div>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .animate-scan {
          animation: scan 8s linear infinite;
        }
        @keyframes noise {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -5%); }
          20% { transform: translate(-10%, 5%); }
          30% { transform: translate(5%, -10%); }
          40% { transform: translate(-5%, 15%); }
          50% { transform: translate(-10%, 5%); }
          60% { transform: translate(15%, 0); }
          70% { transform: translate(0, 10%); }
          80% { transform: translate(-15%, 0); }
          90% { transform: translate(10%, 5%); }
        }
        .animate-noise {
          animation: noise 8s steps(10) infinite;
        }
      `}</style>
    </div>
  );
};

export default HawkinsLabDetail;
