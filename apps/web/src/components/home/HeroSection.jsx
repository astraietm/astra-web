import { motion } from "framer-motion";
import { ArrowRight, Terminal, Shield, Users, Calendar, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import LightRays from "../common/LightRays";
import Hero3DElements from "./Hero3DElements";

export function HeroSection() {
  return (
    <section className="relative min-h-[100dvh] overflow-hidden bg-background flex flex-col justify-center">
      {/* Light Rays Background */}
      <div className="absolute inset-0 z-0 opacity-30 select-none pointer-events-none">
          <LightRays
            raysOrigin="top-center"
            raysColor="#ffffff"
            raysSpeed={0.8}
            lightSpread={0.4}
            rayLength={3}
            followMouse={true}
            mouseInfluence={0.05}
            noiseAmount={0}
            distortion={0}
            className="custom-rays"
            pulsating={true}
            fadeDistance={1}
            saturation={1}
        />
      </div>

      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0"></div>

      {/* 3D Visual Element (Server Rack / Cybersecurity Scene) */}
      <Hero3DElements />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-center px-4 sm:px-6 pt-20 sm:pt-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="flex flex-col items-start text-left max-w-2xl relative">
                
                {/* Announcement Badge - Premium Glassmorphism */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link to="/events" className="group relative inline-flex items-center gap-2 mb-8 rounded-full bg-white/[0.03] border border-white/10 px-4 py-1.5 text-xs sm:text-sm font-medium text-gray-300 hover:text-white hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 backdrop-blur-md overflow-hidden">
                        <span className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md"></span>
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                        </span>
                        <span className="relative">Zero Day 2025: Registrations Open</span>
                        <ChevronRight className="relative w-3.5 h-3.5 text-gray-500 group-hover:text-white transition-colors group-hover:translate-x-0.5" />
                    </Link>
                </motion.div>

                {/* Main Heading - Modern SaaS Style */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="text-5xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-medium tracking-tighter text-white leading-[0.9] mb-8"
                >
                    <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/60">
                        ASTRA
                    </span>
                </motion.h1>

                {/* Subheading - Refined Typography */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="text-lg sm:text-xl md:text-2xl text-gray-400 font-light mb-10 leading-relaxed max-w-lg tracking-tight"
                >
                    The Official Cybersecurity Association of <span className="text-gray-200 font-normal">KMCT IETM</span>. 
                    <br className="hidden sm:block" />
                    Securing the future by empowering the next generation of ethical hackers and security researchers.
                </motion.p>

                {/* CTA Buttons - High Polish */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                >
                    <Link
                        to="/events"
                        className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black text-sm font-bold rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        <span className="relative flex items-center gap-2">
                             Explore Events <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </span>
                    </Link>
                    
                    <Link
                        to="/about"
                        className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/[0.03] text-white border border-white/10 text-sm font-medium rounded-full hover:bg-white/[0.08] hover:border-white/20 transition-all backdrop-blur-sm hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <Terminal className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                        <span>About Us</span>
                    </Link>
                </motion.div>

                {/* Stats / Social Proof - Minimal Strip */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="mt-16 pt-8 border-t border-white/5 w-full max-w-md flex justify-between items-center sm:gap-12"
                >
                    <div className="flex flex-col">
                        <div className="text-2xl sm:text-3xl font-semibold text-white mb-1 tabular-nums tracking-tight">500+</div>
                        <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest font-medium flex items-center gap-1.5">
                            Members
                        </div>
                    </div>
                     <div className="w-px h-8 bg-white/10"></div>
                     <div className="flex flex-col">
                        <div className="text-2xl sm:text-3xl font-semibold text-white mb-1 tabular-nums tracking-tight">12+</div>
                        <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest font-medium flex items-center gap-1.5">
                            Events
                        </div>
                    </div>
                    <div className="w-px h-8 bg-white/10"></div>
                     <div className="flex flex-col">
                        <div className="text-2xl sm:text-3xl font-semibold text-white mb-1 tabular-nums tracking-tight">2025</div>
                        <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest font-medium flex items-center gap-1.5">
                            Est. Year
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Right Column (Placeholder for Mobile/Alignment) */}
            <div className="hidden lg:block relative h-full min-h-[500px]">
                {/* 3D Visuals Interaction Zone */}
                <div className="absolute inset-0 z-10" /> 
            </div>

        </div>
      </div>
    </section>
  );
}
