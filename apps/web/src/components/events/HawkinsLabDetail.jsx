import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Gamepad2, Keyboard, Brain, Search, Lock, AlertTriangle, Users, Zap, Target, Award, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HawkinsLabDetail = ({ onRegister, isRegistered }) => {
  const navigate = useNavigate();
  const [flicker, setFlicker] = useState(false);

  // Flickering lights effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.95) {
        setFlicker(true);
        setTimeout(() => setFlicker(false), 100);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans selection:bg-red-500/30">
      
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

      {/* Enhanced Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Pulsing red glow */}
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
          className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[100vw] h-[60vh] bg-red-600/20 rounded-full blur-[150px]" 
        />
        
        {/* Bottom glow */}
        <div className="absolute bottom-0 w-full h-[40vh] bg-gradient-to-t from-red-950/30 via-red-900/10 to-transparent" />
        
        {/* Noise texture */}
        <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
             style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")' }}
        />
        
        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/60" />
      </div>

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
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-red-950/40 border border-red-500/30 backdrop-blur-sm">
                    <motion.span 
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" 
                    />
                    <span className="text-xs sm:text-sm font-mono text-red-400 uppercase tracking-[0.2em] font-bold">
                      HAWKINS LAB PROTOCOL
                    </span>
                </div>
            </motion.div>

            {/* Main Title with Glitch Effect */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="mb-6 sm:mb-8 relative"
            >
                <h1 className="text-6xl sm:text-7xl md:text-9xl font-black tracking-tighter relative inline-block">
                    <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-b from-red-500 via-red-600 to-red-900"
                          style={{ 
                            textShadow: '0 0 40px rgba(220, 38, 38, 0.5), 0 0 80px rgba(220, 38, 38, 0.3)',
                            fontFamily: 'system-ui, -apple-system, sans-serif',
                            letterSpacing: '-0.05em'
                          }}>
                        HAWKINS LAB
                    </span>
                    {/* Glitch layers */}
                    <span className="absolute inset-0 text-red-500 opacity-70 blur-sm animate-pulse">HAWKINS LAB</span>
                </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-xl sm:text-2xl md:text-3xl text-red-400 font-black tracking-[0.15em] mb-8 sm:mb-12 font-mono uppercase"
                style={{ textShadow: '0 0 20px rgba(248, 113, 113, 0.4)' }}
            >
                "ENTER THE UPSIDE DOWN AND STOP VECNA!"
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
                            className="flex items-center gap-3 p-3 bg-red-950/20 border border-red-900/30 rounded-lg backdrop-blur-sm hover:bg-red-950/30 transition-colors"
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
                
                {/* Event Format Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="bg-gradient-to-br from-red-950/30 via-black to-black border border-red-900/30 p-6 sm:p-8 rounded-2xl relative overflow-hidden group backdrop-blur-sm"
                >
                    {/* Animated border glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-red-900/30">
                            <div className="p-2 bg-red-500/10 rounded-lg">
                                <Users className="w-6 h-6 text-red-500" />
                            </div>
                            <h3 className="text-2xl font-black text-white uppercase tracking-wider">Event Format</h3>
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
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-red-950/20 transition-colors"
                                >
                                    <span className="text-red-500 mt-0.5 text-lg">►</span>
                                    <span className="text-gray-300">{text}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </div>
                </motion.div>

                {/* Levels Breakdown */}
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
                            { title: "GAMING", icon: Gamepad2, desc: "Test your reflexes and coordination" },
                            { title: "SPEED TYPING", icon: Keyboard, desc: "Data entry under pressure" },
                            { title: "ANALYSIS & DECODING", icon: Brain, desc: "Pattern recognition challenge" },
                            { title: "DIGITAL STALKING (TRACING)", icon: Search, desc: "OSINT investigation" },
                            { title: "BRUTE FORCE APPROACH", icon: Lock, desc: "Authentication bypass" }
                        ].map((lvl, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group relative"
                            >
                                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-red-950/20 to-transparent border border-red-900/20 rounded-xl hover:border-red-500/40 hover:bg-red-950/30 transition-all duration-300">
                                    {/* Level number */}
                                    <div className="text-5xl font-black text-red-900/40 group-hover:text-red-500/60 transition-colors tabular-nums">
                                        0{i + 1}
                                    </div>
                                    
                                    {/* Icon */}
                                    <div className="p-3 bg-red-500/10 rounded-lg group-hover:bg-red-500/20 transition-colors">
                                        <lvl.icon className="w-6 h-6 text-red-400 group-hover:text-red-300 transition-colors" />
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
                                    
                                    {/* Arrow indicator */}
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-2 h-2 border-r-2 border-t-2 border-red-500 transform rotate-45" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Rules Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="bg-gradient-to-r from-red-950/40 via-red-900/20 to-transparent border-l-4 border-red-600 p-6 sm:p-8 rounded-r-2xl backdrop-blur-sm"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <AlertTriangle className="w-7 h-7 text-red-500 animate-pulse" />
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
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
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

            {/* Right Column - CTA */}
            <div className="lg:col-span-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="sticky top-8"
                >
                    <div className="bg-gradient-to-br from-red-950/40 via-black to-black border border-red-900/40 p-6 sm:p-8 rounded-2xl shadow-2xl shadow-red-900/30 backdrop-blur-sm">
                        {/* Status Badge */}
                        <div className="mb-8 text-center">
                            <p className="text-gray-500 uppercase tracking-[0.2em] text-xs mb-3 font-mono">Registration Status</p>
                            <motion.div 
                                animate={{ 
                                    boxShadow: ['0 0 20px rgba(34, 197, 94, 0.3)', '0 0 30px rgba(34, 197, 94, 0.5)', '0 0 20px rgba(34, 197, 94, 0.3)']
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

                        {/* CTA Button */}
                        <motion.button 
                            onClick={onRegister}
                            disabled={isRegistered}
                            whileHover={{ scale: isRegistered ? 1 : 1.02 }}
                            whileTap={{ scale: isRegistered ? 1 : 0.98 }}
                            className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:from-gray-800 disabled:to-gray-800 disabled:text-gray-500 text-white font-black text-lg rounded-xl transition-all shadow-[0_0_30px_rgba(220,38,38,0.5)] hover:shadow-[0_0_50px_rgba(220,38,38,0.7)] disabled:shadow-none uppercase tracking-wider"
                        >
                            {isRegistered ? '✓ Already Registered' : 'Register Team Now'}
                        </motion.button>
                        
                        <p className="text-center text-xs text-gray-600 mt-4 font-mono uppercase tracking-widest">
                            Save Hawkins. Save the World.
                        </p>
                    </div>
                </motion.div>
            </div>

        </div>
      </div>

      {/* Custom CSS for scan animation */}
      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .animate-scan {
          animation: scan 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default HawkinsLabDetail;
