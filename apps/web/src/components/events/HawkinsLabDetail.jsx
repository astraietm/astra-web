import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Gamepad2, Keyboard, Brain, Search, Lock, AlertTriangle, Users, GitBranch } from 'lucide-react';
import { motion } from 'framer-motion';

const HawkinsLabDetail = ({ onRegister, isRegistered }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden font-sans selection:bg-red-500/30">
      
      {/* Background Ambience (Stranger Things Theme) */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-red-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 w-full h-[30vh] bg-gradient-to-t from-red-900/5 to-transparent" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        
        <button
          onClick={() => navigate('/events')}
          className="group flex items-center gap-2 text-sm text-gray-500 hover:text-red-400 transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to All Events</span>
        </button>

        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-20">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-red-900/20 border border-red-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs font-mono text-red-400 uppercase tracking-widest">HAWKINS LAB PROTOCOL</span>
                </div>
            </motion.div>

            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-5xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-red-900 mb-6 font-display"
                style={{ textShadow: '0 0 30px rgba(220, 38, 38, 0.3)' }}
            >
                HAWKINS LAB
            </motion.h1>

            <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl md:text-2xl text-red-400 font-bold tracking-widest mb-8 font-mono uppercase"
            >
                "Enter the Upside Down and Stop Vecna!"
            </motion.p>

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="max-w-3xl mx-auto space-y-6"
            >
                <p className="text-gray-300 text-lg leading-relaxed uppercase font-medium tracking-wide">
                    A Stranger Things-themed cyber mystery event where teams solve clues, analyze patterns, and complete computer-based tasks to progress through an immersive storyline.
                </p>
                <p className="text-gray-400 text-sm leading-relaxed max-w-2xl mx-auto">
                    This event is task-based and story-driven, inspired by cybersecurity concepts such as <span className="text-red-400">Data Accuracy</span>, <span className="text-red-400">Signal Analysis</span>, <span className="text-red-400">Social Engineering</span>, and <span className="text-red-400">Authentication</span>, presented in a safe, fun, and interactive simulation.
                </p>
                
                <div className="inline-block px-6 py-2 bg-gradient-to-r from-red-900/40 to-transparent border-l-4 border-red-500 mt-4">
                    <p className="text-white font-bold italic">
                        ✨ No advanced technical knowledge required — all students can participate!
                    </p>
                </div>
            </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column - Details */}
            <div className="lg:col-span-8 space-y-12">
                
                {/* Format & Highlights */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-[#0A0A0A] border border-red-900/20 p-6 rounded-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-red-900/5 group-hover:bg-red-900/10 transition-colors pointer-events-none" />
                        <div className="flex items-center gap-3 mb-4 relative z-10">
                            <Users className="w-5 h-5 text-red-500" />
                            <h3 className="text-xl font-bold text-white uppercase">Event Format</h3>
                        </div>
                        <ul className="space-y-3 text-gray-400 relative z-10 font-mono text-sm">
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">►</span>
                                <span>TEAM-BASED EVENT (2–4 MEMBERS PER TEAM)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">►</span>
                                <span>5 LEVELS - 5 PCS (TO BE COMPLETED IN ORDER)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">►</span>
                                <span>EACH LEVEL UNLOCKS THE NEXT</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">►</span>
                                <span>DIFFICULTY INCREASES GRADUALLY</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">►</span>
                                <span>FASTEST TEAM TO COMPLETE ALL LEVELS WINS</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-[#0A0A0A] border border-red-900/20 p-6 rounded-2xl relative overflow-hidden">
                        <div className="flex items-center gap-3 mb-4">
                            <GitBranch className="w-5 h-5 text-red-500" />
                            <h3 className="text-xl font-bold text-white uppercase">Levels Breakdown</h3>
                        </div>
                        {/* Using a timeline connector visual */}
                        <div className="relative pl-4 space-y-4">
                            <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-red-900/30"></div>
                            {[
                                { title: "GAMING", icon: Gamepad2 },
                                { title: "SPEED TYPING", icon: Keyboard },
                                { title: "ANALYSIS & DECODING", icon: Brain },
                                { title: "DIGITAL STALKING (TRACING)", icon: Search },
                                { title: "BRUTE FORCE APPROACH", icon: Lock }
                            ].map((lvl, i) => (
                                <div key={i} className="relative flex items-center gap-3 group">
                                    <div className="z-10 w-2 h-2 rounded-full bg-red-900 group-hover:bg-red-500 transition-colors ring-4 ring-[#0A0A0A]" />
                                    <span className="text-red-500/50 font-mono text-xs">0{i+1}</span>
                                    <span className="text-gray-300 font-bold text-sm tracking-wide group-hover:text-white transition-colors uppercase">{lvl.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Rules */}
                <div className="bg-gradient-to-r from-red-950/30 to-transparent border-l-4 border-red-600 p-8 rounded-r-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                        <h3 className="text-xl font-black text-white uppercase tracking-widest">Rules</h3>
                    </div>
                    <ul className="grid sm:grid-cols-1 gap-3 text-gray-300 font-mono text-sm">
                        <li className="flex items-center gap-3 p-2 hover:bg-red-500/5 rounded transition-colors">
                            <span className="w-2 h-2 bg-red-500 transform rotate-45" />
                            TEAMS MUST FOLLOW THE ASSIGNED PC ORDER
                        </li>
                        <li className="flex items-center gap-3 p-2 hover:bg-red-500/5 rounded transition-colors">
                            <span className="w-2 h-2 bg-red-500 transform rotate-45" />
                            SKIPPING LEVELS OR SHARING CLUES IS STRICTLY PROHIBITED
                        </li>
                        <li className="flex items-center gap-3 p-2 hover:bg-red-500/5 rounded transition-colors">
                            <span className="w-2 h-2 bg-red-500 transform rotate-45" />
                            ONLY THE PROVIDED SYSTEMS MAY BE USED
                        </li>
                        <li className="flex items-center gap-3 p-2 hover:bg-red-500/5 rounded transition-colors">
                            <span className="w-2 h-2 bg-red-500 transform rotate-45" />
                            NO TEAM CHANGES ONCE THE EVENT STARTS
                        </li>
                    </ul>
                </div>

            </div>

            {/* Right Column - CTA */}
            <div className="lg:col-span-4 space-y-6">
                <div className="sticky top-8">
                    <div className="bg-[#0A0A0A] border border-white/10 p-8 rounded-2xl shadow-2xl shadow-red-900/20">
                        <div className="mb-8 text-center">
                            <p className="text-gray-400 uppercase tracking-widest text-xs mb-2">Registration Status</p>
                            <div className="inline-block px-4 py-1.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-sm font-bold">
                                OPEN FOR ALL STUDENTS
                            </div>
                        </div>

                        <ul className="space-y-4 mb-8 border-t border-b border-white/5 py-6">
                            <li className="flex justify-between text-sm">
                                <span className="text-gray-500">Theme</span>
                                <span className="text-white font-medium">Stranger Things</span>
                            </li>
                            <li className="flex justify-between text-sm">
                                <span className="text-gray-500">Difficulty</span>
                                <span className="text-white font-medium">Beginner Friendly</span>
                            </li>
                            <li className="flex justify-between text-sm">
                                <span className="text-gray-500">Prerequisites</span>
                                <span className="text-white font-medium">None</span>
                            </li>
                        </ul>

                        <button 
                            onClick={onRegister}
                            disabled={isRegistered}
                            className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-800 disabled:text-gray-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)]"
                        >
                            {isRegistered ? 'Already Registered' : 'Register Team Now'}
                        </button>
                        <p className="text-center text-xs text-gray-500 mt-4">
                            Save Hawkins. Save the World.
                        </p>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default HawkinsLabDetail;
