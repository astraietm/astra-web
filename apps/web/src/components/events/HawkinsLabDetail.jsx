import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Gamepad2, Keyboard, Brain, Search, Lock, AlertTriangle, Users, Zap, Target, Award, Shield, CheckCircle, Activity, ChevronRight, Terminal } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

const HawkinsLabDetail = ({ onRegister, isRegistered }) => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 1000], [0, 200]);
  const yGrid = useTransform(scrollY, [0, 1000], [0, 50]);

  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-red-500/30 font-sans overflow-x-hidden">
        {/* Premium Ambient Background - Optimized for Mobile FPS */}
        <div className="fixed inset-0 z-0 pointer-events-none">


            {/* Subtle Grid - Parallax */}
            <motion.div 
                style={{ y: yGrid }}
                className="absolute inset-0 bg-[linear-gradient(rgba(220,38,38,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,black_70%,transparent_100%)] relative z-10" 
            />
            
            {/* Cinematic Glows - All Red - Parallax */}
            <motion.div 
                style={{ y: yBg }}
                className="absolute inset-0 pointer-events-none"
            >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[radial-gradient(circle,rgba(69,10,10,0.5)_0%,transparent_70%)] mix-blend-screen opacity-70" />
                <div className="absolute top-[20%] left-[20%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(153,27,27,0.2)_0%,transparent_70%)] mix-blend-screen opacity-50" />
            </motion.div>
            
            {/* Fine Grain */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] mix-blend-overlay relative z-10" />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 pt-24 pb-12">
            {/* Minimalist Navigation */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center justify-between mb-24"
            >
                <button 
                  onClick={() => navigate('/events')}
                  className="group flex items-center gap-3 text-zinc-400 hover:text-white transition-colors duration-300"
                >
                    <div className="p-2.5 rounded-full bg-white/5 border border-white/5 group-hover:bg-white/10 group-hover:border-white/10 transition-all">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    </div>
                    <span className="text-sm font-medium tracking-wide">Back</span>
                </button>
                
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-xs font-mono text-zinc-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    SYSTEM ONLINE
                </div>
            </motion.div>

            {/* Premium Hero Section */}
            <div className="max-w-6xl mx-auto mb-32">
                <div className="flex flex-col items-start text-left">
                    {/* Badge */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-8"
                    >
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 backdrop-blur-md">
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                            <span className="text-xs font-semibold text-red-200 uppercase tracking-widest">
                              Protocol 011
                            </span>
                        </div>
                    </motion.div>

                    {/* Massive Title */}
                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className="mb-10 relative"
                    >
                        <h1 className="text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-bold leading-[0.9] tracking-tighter text-white">
                            HAWKINS <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-300 to-white/50">
                                LAB.
                            </span>
                        </h1>
                    </motion.div>

                    {/* Content & Stats Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 w-full items-end">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="lg:col-span-7"
                        >
                            <p className="text-xl sm:text-2xl font-light text-zinc-400 leading-relaxed max-w-3xl">
                                An immersive cyber-mystery event. Teams compete to solve cryptic clues, analyze signals, and breach the Upside Down. <span className="text-white font-normal">Beginner friendly.</span>
                            </p>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="lg:col-span-5 flex flex-wrap gap-8 lg:justify-end"
                        >
                            <div className="flex flex-col gap-1">
                                <span className="text-4xl font-bold tracking-tight text-white">2-4</span>
                                <span className="text-sm font-mono text-zinc-500 uppercase tracking-wider">Members/Team</span>
                            </div>
                            <div className="w-px h-12 bg-white/10 hidden sm:block" />
                            <div className="flex flex-col gap-1">
                                <span className="text-4xl font-bold tracking-tight text-white">5</span>
                                <span className="text-sm font-mono text-zinc-500 uppercase tracking-wider">Levels</span>
                            </div>
                            <div className="w-px h-12 bg-white/10 hidden sm:block" />
                            <div className="flex flex-col gap-1">
                                <span className="text-4xl font-bold tracking-tight text-white">0%</span>
                                <span className="text-sm font-mono text-zinc-500 uppercase tracking-wider">Coding Needed</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Split View Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-32">
                
                {/* Left: Mission Details */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="sticky top-8"
                    >
                        <h2 className="text-3xl font-bold mb-8 tracking-tight flex items-center gap-3">
                            <Terminal className="w-6 h-6 text-red-500" />
                            Mission Protocol
                        </h2>
                        
                        <div className="bg-[#0A0A0A]/90 border border-white/5 rounded-3xl p-8 backdrop-blur-md hover:border-white/10 transition-colors duration-500">
                             <ul className="space-y-8">
                                {[
                                    { title: "Team Assembly", desc: "Form a squad of 2-4 agents. Diverse skills recommended." },
                                    { title: "Sequential Clearance", desc: "5 security levels. Each key unlocks the next tier." },
                                    { title: "Pattern Recognition", desc: "Decode signals, analyze logs, and find the breach." },
                                    { title: "Race Against Time", desc: "The first team to seal the gate claims victory." }
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-5 group">
                                        <div className="flex flex-col items-center">
                                            <div className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-xs font-mono text-zinc-500 group-hover:border-red-500/50 group-hover:text-red-400 transition-colors">
                                                0{i + 1}
                                            </div>
                                            {i !== 3 && <div className="w-px flex-1 bg-white/5 my-2 group-hover:bg-red-500/20 transition-colors" />}
                                        </div>
                                        <div className="pb-2">
                                            <h4 className="text-lg font-semibold text-white mb-1 group-hover:text-red-400 transition-colors">
                                                {item.title}
                                            </h4>
                                            <p className="text-zinc-400 leading-relaxed text-sm">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                             </ul>
                        </div>
                    </motion.div>
                </div>

                <motion.div 
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={{
                        hidden: {},
                        show: {
                            transition: {
                                staggerChildren: 0.1
                            }
                        }
                    }}
                    className="space-y-4 pt-12 lg:pt-0"
                >
                    <motion.h2 
                        variants={{
                            hidden: { opacity: 0, x: -20 },
                            show: { opacity: 1, x: 0 }
                        }}
                        className="text-3xl font-bold mb-8 tracking-tight flex items-center gap-3"
                    >
                        <Activity className="w-6 h-6 text-red-500" />
                        Security Clearance
                    </motion.h2>

                    {[
                        { title: "Reflex Test", icon: Gamepad2, desc: "Neuromotor synchronization check" },
                        { title: "Data Entry", icon: Keyboard, desc: "High-speed information processing" },
                        { title: "Pattern Analysis", icon: Brain, desc: "Cognitive logic puzzle solving" },
                        { title: "Signal Tracing", icon: Search, desc: "Digital footprint investigation" },
                        { title: "System Override", icon: Lock, desc: "Mainframe brute force access" }
                    ].map((lvl, i) => {
                        const isActive = hoveredCard === i;
                        return (
                            <motion.div
                                key={i}
                                variants={{
                                    hidden: { opacity: 0, x: -30 },
                                    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 50, damping: 20 } }
                                }}
                                onMouseEnter={() => setHoveredCard(i)}
                                onMouseLeave={() => setHoveredCard(null)}
                                className={`relative group rounded-2xl border p-6 transition-all duration-500 cursor-pointer ${
                                    isActive 
                                        ? 'bg-red-950/30 border-red-500/40 shadow-[0_0_20px_rgba(220,38,38,0.15)] scale-[1.02]' 
                                        : 'bg-red-950/5 border-red-900/20 hover:border-red-500/40 hover:bg-red-950/10'
                                }`}
                            >
                                {/* Constant Red Glow on Hover */}
                                <div className={`absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent rounded-2xl transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                                
                                <div className="relative flex items-center gap-6">
                                    <div className={`text-4xl font-bold tracking-tighter w-16 tabular-nums transition-colors ${isActive ? 'text-red-500' : 'text-red-900/40'}`}>
                                        0{i + 1}
                                    </div>
                                    
                                    <div className={`p-3 rounded-xl transition-colors ${isActive ? 'bg-red-500/20 text-red-500' : 'bg-red-950/20 text-red-800'}`}>
                                        <lvl.icon className="w-6 h-6" />
                                    </div>
                                    
                                    <div className="flex-1">
                                        <h3 className={`text-lg font-semibold mb-1 transition-colors ${isActive ? 'text-white' : 'text-red-100/60'}`}>
                                            {lvl.title}
                                        </h3>
                                        <p className="text-sm text-red-200/40 transition-colors">
                                            {lvl.desc}
                                        </p>
                                    </div>

                                    <div className="text-red-900/60 transition-colors duration-300">
                                        {isActive ? (
                                            <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse" />
                                        ) : (
                                            <Lock className="w-4 h-4" />
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>

            {/* Registration CTA - Bottom Floating or Section */}
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative rounded-[2.5rem] overflow-hidden border border-red-900/20 bg-[#080202]/90 backdrop-blur-md"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-transparent to-red-900/20 opacity-50" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay" />
                
                <div className="relative p-8 sm:p-16 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="space-y-6 max-w-2xl text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-mono uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            Registrations Open
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-bold tracking-tighter text-white">
                            Ready to enter the Upside Down?
                        </h2>
                        <p className="text-xl text-zinc-400 font-light">
                            Secure your team's spot in the registry. The gate is opening soon.
                        </p>
                    </div>

                    <motion.button 
                        whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(220, 38, 38, 0.3)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onRegister}
                        disabled={isRegistered}
                        className="group relative px-10 py-5 bg-white text-black text-lg font-bold rounded-2xl overflow-hidden transition-shadow"
                    >
                        <span className="relative z-10 flex items-center gap-3">
                            {isRegistered ? 'Protocol Active' : 'Initiate Sequence'}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.button>
                </div>
            </motion.div>

             {/* Footer Space */}
             <div className="h-32" />
        </div>
    </div>
  );
};

export default HawkinsLabDetail;
