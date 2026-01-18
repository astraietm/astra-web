import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Gamepad2, Keyboard, Brain, Search, Lock, AlertTriangle, Users, Zap, Target, Award, Shield, CheckCircle } from 'lucide-react';

const HawkinsLabDetail = ({ onRegister, isRegistered }) => {
  const navigate = useNavigate();

  // Upside Down Spores - Static positions to avoid layout thrashing
  const spores = Array.from({ length: 20 }).map((_, i) => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 5}s`,
    opacity: Math.random() * 0.5 + 0.2
  }));

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden font-sans selection:bg-red-900/50">
      
      {/* 1. The Upside Down Atmosphere */}
      
      {/* Dynamic Fog (CSS Animation) */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute inset-0 bg-gradient-to-t from-red-900/10 via-transparent to-transparent opacity-60" />
         <div className="absolute w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      {/* Floating Spores */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {spores.map((spore, i) => (
          <div 
            key={i}
            className="absolute w-1 h-1 bg-gray-400 rounded-full animate-float-slow"
            style={{
              left: spore.left,
              top: spore.top,
              opacity: spore.opacity,
              animation: `float ${10 + Math.random() * 10}s infinite linear`,
              animationDelay: spore.animationDelay
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: translateY(-100px) translateX(20px); opacity: 0; }
        }
        .animate-float-slow {
          will-change: transform, opacity;
        }
      `}</style>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        
        {/* Back Button - Retro Terminal Style */}
        <button
          onClick={() => navigate('/events')}
          className="group flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 transition-colors mb-8 sm:mb-12 font-mono tracking-widest uppercase"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>// Back to Archives</span>
        </button>

        <div className="text-center max-w-5xl mx-auto mb-16 sm:mb-24">
            
            {/* Classified Badge */}
            <div className="mb-6 flex justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 border border-red-500/30 bg-red-950/20 text-red-500 text-xs font-mono tracking-widest uppercase">
                    <Lock className="w-3 h-3" />
                    <span>Top Secret // Clearance Lvl 5</span>
                </div>
            </div>

            {/* Main Title - Stranger Things Red Neon */}
            <div className="mb-8 relative">
                <h1 
                    className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black relative inline-block text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-red-900"
                    style={{ 
                      fontFamily: 'Inter, system-ui', // Keeping Inter for cleaner look, but styled heavily
                      letterSpacing: '-0.05em',
                      filter: 'drop-shadow(0 0 20px rgba(220, 38, 38, 0.5))'
                    }}
                >
                    HAWKINS LAB
                </h1>
                {/* Glitch Overlay Effect */}
                <h1 className="absolute top-0 left-0 w-full h-full text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-red-600 opacity-20 blur-sm animate-pulse"
                    style={{ 
                      fontFamily: 'Inter, system-ui',
                      letterSpacing: '-0.05em',
                    }}>
                    HAWKINS LAB
                </h1>
            </div>

            {/* Tagline */}
            <p 
                className="text-lg sm:text-xl md:text-2xl font-light mb-12 text-gray-300 max-w-2xl mx-auto"
                style={{ fontFamily: 'monospace' }}
            >
                <span className="text-red-500">⚠ WARNING:</span> INTERDIMENSIONAL BREACH DETECTED
            </p>

            {/* Description */}
            <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
                <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed font-medium px-4">
                    A <span className="text-red-400 font-bold">Stranger Things-themed</span> cyber mystery event where teams solve clues, analyze patterns, and complete computer-based tasks to progress through an immersive storyline.
                </p>
                
                {/* Classified Event Dossier */}
                <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto px-4 mb-16">
                    {[
                        { icon: Shield, text: "DATA INTEGRITY", sub: "Verified" },
                        { icon: Zap, text: "SIGNAL STRENGTH", sub: "Unstable" },
                        { icon: Target, text: "SOCIAL ENGINEERING", sub: "High Risk" },
                        { icon: Lock, text: "ACCESS CONTROL", sub: "Restricted" }
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="group relative flex items-center gap-4 p-4 border border-red-900/30 bg-black/40 hover:bg-red-950/10 transition-all duration-300 hover:border-red-500/50 hover:shadow-[0_0_15px_rgba(220,38,38,0.15)]"
                        >
                            {/* Corner accents */}
                            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-red-500/30 group-hover:border-red-500 transition-colors" />
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-red-500/30 group-hover:border-red-500 transition-colors" />
                            
                            <div className="p-3 bg-red-950/30 rounded-sm border border-red-900/20 group-hover:border-red-500/40 transition-colors">
                                <item.icon className="w-5 h-5 text-red-500/70 group-hover:text-red-400" />
                            </div>
                            
                            <div>
                                <div className="text-xs text-red-500/50 font-mono uppercase tracking-widest mb-0.5">{item.sub}</div>
                                <div className="text-sm font-bold text-gray-300 group-hover:text-white tracking-wider font-mono">{item.text}</div>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Participation Badge */}
                <div className="flex justify-center mb-16">
                    <div className="inline-flex items-center gap-3 px-6 py-3 border border-yellow-500/20 bg-yellow-950/10 rounded-sm backdrop-blur-sm">
                        <Award className="w-5 h-5 text-yellow-500" />
                        <span className="text-yellow-200/90 text-sm font-mono tracking-wide uppercase">
                            Clearance: Open to All Students
                        </span>
                    </div>
                </div>
            </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 relative">
            
            {/* Left Column - Details */}
            <div className="lg:col-span-8 space-y-8 sm:space-y-12">
                
                {/* Mission Structure - Redacted File Style */}
                <div className="relative border border-gray-800 bg-[#0a0a0a] p-1">
                    {/* Top Secret Stamp */}
                    <div className="absolute -top-3 -right-3 rotate-12 border-2 border-red-600 px-3 py-1 text-red-600 font-black text-xs tracking-widest uppercase opacity-70 z-10 pointer-events-none">
                        Confidential
                    </div>

                    <div className="border border-gray-800 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-100 p-6 sm:p-8 relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-8 pb-4 border-b border-gray-800">
                                <div className="p-2 bg-gray-900 border border-gray-800">
                                    <Users className="w-6 h-6 text-gray-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white uppercase tracking-widest font-mono">Mission Protocol</h3>
                                    <p className="text-xs text-red-500 font-mono mt-1">Authorized Personnel Only</p>
                                </div>
                            </div>
                            
                            <ul className="space-y-0 font-mono text-sm border-l border-gray-800 ml-3">
                                {[
                                    "TEAM CONFIGURATION: 2–4 AGENTS",
                                    "SEQUENCE: 5 ENCRYPTED LEVELS",
                                    "PROGRESSION: LINEAR UNLOCK",
                                    "THREAT ESCALATION: ADAPTIVE",
                                    "OBJECTIVE: SPEEDY NEUTRALIZATION"
                                ].map((text, i) => (
                                    <li key={i} className="relative pl-8 py-4 border-b border-gray-800/50 last:border-0 group hover:bg-gray-900/30 transition-colors">
                                        <span className="absolute left-[-5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-gray-900 border border-gray-600 rounded-full group-hover:bg-red-500 group-hover:border-red-500 transition-colors" />
                                        <span className="text-gray-400 group-hover:text-white transition-colors tracking-wide">{text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Clearance Levels */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-6">
                         <span className="w-1 h-6 bg-red-500" />
                         <h3 className="text-xl font-bold text-white uppercase tracking-widest font-mono">Clearance Levels</h3>
                    </div>
                    
                    {[
                        { title: "GAMING", icon: Gamepad2, desc: "Reflex Calibration", status: 'active', code: "LVL-01" },
                        { title: "SPEED TYPING", icon: Keyboard, desc: "Data Input Velocity", status: 'locked', code: "LVL-02" },
                        { title: "DECODING", icon: Brain, desc: "Pattern Recognition", status: 'locked', code: "LVL-03" },
                        { title: "OSINT", icon: Search, desc: "Digital Reconnaissance", status: 'locked', code: "LVL-04" },
                        { title: "BRUTE FORCE", icon: Lock, desc: "System Override", status: 'locked', code: "LVL-05" }
                    ].map((lvl, i) => (
                        <div
                            key={i}
                            className={`group relative border border-gray-800 bg-gray-950/50 p-4 transition-all duration-300 hover:border-red-500/30 hover:bg-red-950/5 ${lvl.status === 'locked' ? 'opacity-60 grayscale' : ''}`}
                        >
                            <div className="flex items-center gap-6">
                                {/* Level Code */}
                                <div className="hidden sm:block text-xs font-mono text-gray-600 group-hover:text-red-500/50 transition-colors rotate-180" style={{ writingMode: 'vertical-rl' }}>
                                    {lvl.code}
                                </div>

                                <div className="p-3 bg-gray-900 border border-gray-800 group-hover:border-red-500/30 transition-colors relative">
                                    <lvl.icon className="w-6 h-6 text-gray-400 group-hover:text-red-500 transition-colors" />
                                </div>
                                
                                <div className="flex-1">
                                    <h4 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors font-mono tracking-wide">
                                        {lvl.title}
                                    </h4>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                                        {lvl.desc}
                                    </p>
                                </div>
                                
                                
                                {lvl.status === 'locked' ? (
                                    <Lock className="w-4 h-4 text-gray-600" />
                                ) : (
                                    <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Column - CTA & Info */}
            <div className="lg:col-span-4 space-y-8">
                {/* Registration Card */}
                <div className="sticky top-24">
                     <div className="border border-gray-800 bg-gray-950/80 backdrop-blur-md p-6 relative overflow-hidden group">
                        {/* Scanline */}
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                        <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50 shadow-[0_0_10px_rgba(220,38,38,0.5)] animate-scan-slow pointer-events-none" />
                        
                        <div className="relative z-10">
                            <h3 className="text-sm font-mono text-gray-400 uppercase tracking-widest mb-2">Registration Status</h3>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-xl font-bold text-white tracking-wide">OPEN</span>
                            </div>
                            
                            <button className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-widest transition-all duration-300 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2 group/btn">
                                <span>Initiate Protocol</span>
                                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                            
                            <p className="text-xs text-center text-gray-500 font-mono mt-4">
                                SECURE CONNECTION REQUIRED
                            </p>
                        </div>
                     </div>
                </div>
            </div>
        </div>
      </div>

      {/* Custom CSS */}
      <style>{`
        @keyframes scan-slow {
          0% { transform: translateY(0); }
          100% { transform: translateY(100vh); }
        }
        .animate-scan-slow {
          animation: scan-slow 8s linear infinite;
        }
      `}</style>


    </div>
  );
};

export default HawkinsLabDetail;
