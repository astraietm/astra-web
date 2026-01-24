import { motion } from "framer-motion";
import { ArrowRight, Terminal, Shield, Users, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import LightRays from "../common/LightRays";
import Hero3DElements from "./Hero3DElements";

export function HeroSection() {
  return (
    <section className="relative min-h-[100dvh] overflow-hidden bg-background flex flex-col justify-center">
      {/* Light Rays Background */}
      <div className="absolute inset-0 z-0 opacity-40">
          <LightRays
            raysOrigin="top-center"
            raysColor="#ffffff"
            raysSpeed={1}
            lightSpread={0.5}
            rayLength={3}
            followMouse={true}
            mouseInfluence={0.1}
            noiseAmount={0}
            distortion={0}
            className="custom-rays"
            pulsating={false}
            fadeDistance={1}
            saturation={1}
        />
      </div>

      {/* 3D Visual Element (Server Rack / Cybersecurity Scene) */}
      <Hero3DElements />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-center px-4 sm:px-6 pt-20 sm:pt-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="flex flex-col items-start text-left max-w-2xl">
                
                {/* Announcement Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-xs sm:text-sm font-medium text-cyan-300 backdrop-blur-md hover:bg-white/10 hover:border-cyan-500/30 transition-all cursor-pointer group"
                >
                    <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
                    <span>Zero Day 2025: Registrations Open</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </motion.div>

                {/* Main Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="text-5xl sm:text-7xl md:text-8xl font-medium tracking-tighter text-white leading-[0.9] mb-6"
                >
                    ASTRA
                </motion.h1>

                {/* Subheading */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="text-lg sm:text-xl md:text-2xl text-gray-400 font-light mb-8 leading-relaxed max-w-lg"
                >
                    The Official Cybersecurity Association of <span className="text-white font-medium">KMCT IETM</span>. 
                    Securing the future by empowering the next generation of ethical hackers and security researchers.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                >
                    <Link
                        to="/events"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black text-sm font-bold rounded-full hover:bg-cyan-50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Explore Events
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                    
                    <Link
                        to="/about"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 text-white border border-white/10 text-sm font-medium rounded-full hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-sm hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <Terminal className="w-4 h-4 text-gray-400" />
                        About Us
                    </Link>
                </motion.div>

                {/* Stats / Social Proof */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="mt-12 sm:mt-16 pt-8 border-t border-white/10 w-full flex gap-8 sm:gap-12"
                >
                    <div>
                        <div className="text-2xl sm:text-3xl font-bold text-white mb-1">500+</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5" /> Members
                        </div>
                    </div>
                     <div>
                        <div className="text-2xl sm:text-3xl font-bold text-white mb-1">12+</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                            <Shield className="w-3.5 h-3.5" /> Events
                        </div>
                    </div>
                     <div>
                        <div className="text-2xl sm:text-3xl font-bold text-white mb-1">2025</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" /> Established
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Right Column (Placeholder for Mobile/Alignment) */}
            <div className="hidden lg:block">
                {/* 3D Elements are absolutely positioned, but this div keeps the grid structure intact */}
            </div>

        </div>
      </div>
    </section>
  );
}
