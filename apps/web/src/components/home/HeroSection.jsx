import { motion } from "framer-motion";
import { ArrowRight, Terminal, Shield, Users, Calendar, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import LightRays from "../common/LightRays";
import Hero3DElements from "./Hero3DElements";

export function HeroSection() {
  return (
    <section className="relative min-h-[100dvh] overflow-hidden bg-background flex flex-col justify-center">
      {/* Light Rays Background - Subtle & Premium */}
      <div className="absolute inset-0 z-0 opacity-25 select-none pointer-events-none">
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

      {/* 3D Visual Element (Server Rack / Cybersecurity Scene) */}
      <Hero3DElements />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-center px-6 sm:px-8 pt-20 sm:pt-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Content */}
            <div className="flex flex-col items-start text-left max-w-2xl relative">
                
                {/* Announcement Badge - Clean & Minimal */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link to="/events" className="group relative inline-flex items-center gap-3 mb-10 rounded-full bg-white/[0.05] border border-white/[0.08] pr-4 pl-3 py-1.5 transition-all duration-300 hover:bg-white/[0.1] hover:border-white/20 hover:scale-[1.01]">
                        <span className="flex items-center justify-center h-5 w-5 rounded-full bg-cyan-500/10 border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-colors">
                           <span className="relative flex h-1.5 w-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-500"></span>
                           </span>
                        </span>
                        <span className="text-sm font-medium text-gray-200 tracking-wide">Zero Day 2025: Registrations Open</span>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-white transition-colors" />
                    </Link>
                </motion.div>

                {/* Main Heading - Premium Typography (Outfit) */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] font-semibold tracking-[-0.03em] text-white leading-[0.95] mb-8"
                >
                    <span>ASTRA</span>
                </motion.h1>

                {/* Subheading - Refined Inter Font */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="font-sans text-lg sm:text-xl md:text-2xl text-gray-400 font-light mb-12 leading-relaxed max-w-xl tracking-wide"
                >
                    The Official Cybersecurity Association of <span className="text-white font-medium">KMCT IETM</span>. 
                    <br className="hidden sm:block" />
                    Securing the future by empowering the next generation of ethical hackers.
                </motion.p>

                {/* CTA Buttons - Sleek & Modern */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto"
                >
                    <Link
                        to="/events"
                        className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white text-black font-sans text-sm font-medium tracking-wide rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_-10px_rgba(255,255,255,0.5)] hover:shadow-[0_0_25px_-5px_rgba(255,255,255,0.6)]"
                    >
                         <span>Explore Events</span>
                         <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                    
                    <Link
                        to="/about"
                        className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-transparent text-white border border-white/20 font-sans text-sm font-medium tracking-wide rounded-full hover:bg-white/5 hover:border-white/40 transition-all active:scale-[0.98]"
                    >
                        <span>About Us</span>
                    </Link>
                </motion.div>

                {/* Stats / Social Proof - Refined Layout */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="mt-20 pt-8 border-t border-white/10 w-full max-w-lg flex flex-wrap gap-y-6 gap-x-12 sm:gap-x-16"
                >
                    <div className="flex flex-col gap-1">
                        <div className="font-display text-3xl font-bold text-white tabular-nums tracking-tight">500+</div>
                        <div className="text-[11px] uppercase tracking-[0.2em] font-medium text-gray-500">Members</div>
                    </div>
                     <div className="flex flex-col gap-1">
                        <div className="font-display text-3xl font-bold text-white tabular-nums tracking-tight">12+</div>
                        <div className="text-[11px] uppercase tracking-[0.2em] font-medium text-gray-500">Events</div>
                    </div>
                     <div className="flex flex-col gap-1">
                        <div className="font-display text-3xl font-bold text-white tabular-nums tracking-tight">2025</div>
                        <div className="text-[11px] uppercase tracking-[0.2em] font-medium text-gray-500">Est. Year</div>
                    </div>
                </motion.div>
            </div>

            {/* Right Column */}
            <div className="hidden lg:block relative h-full min-h-[600px] pointer-events-none">
                {/* 3D Visuals Interaction Zone */}
            </div>

        </div>
      </div>
    </section>
  );
}
