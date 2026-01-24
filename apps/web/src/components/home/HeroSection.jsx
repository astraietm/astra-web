import { motion } from "framer-motion";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-[#050505]">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-20"
        style={{
            backgroundImage: `linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
        }}
      ></div>

      {/* Floating Particles (Simulated) */}
      <motion.div 
        animate={{ y: [0, -20, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-[15%] w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.8)] z-10"
      />
      <motion.div 
        animate={{ y: [0, 30, 0], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/3 right-[20%] w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_25px_rgba(59,130,246,0.8)] z-10"
      />

      {/* Faint Background Number/Text - "5.0" equivalent */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] sm:text-[30rem] font-bold text-white/[0.02] pointer-events-none select-none z-0 tracking-tighter font-display">
            A
       </div>


      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-5xl mx-auto w-full mt-16 sm:mt-0">
        
        {/* Main Title - "MAGNATHON" style */}
        <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-500 drop-shadow-2xl uppercase mb-[-10px] sm:mb-[-20px] relative z-20"
        >
            ASTRA
        </motion.h1>

        {/* Large Gradient Number - "2026" style */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display text-[5rem] sm:text-[8rem] md:text-[10rem] lg:text-[13rem] font-black leading-[0.85] tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-cyan-400 to-blue-600 relative z-10"
            style={{
                WebkitTextStroke: '0px',
            }}
        >
            ZERO DAY
        </motion.div>

        {/* Tagline */}
        <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-sans text-xs sm:text-sm md:text-base font-bold text-gray-400 tracking-[0.2em] sm:tracking-[0.3em] uppercase mt-6 sm:mt-8 mb-8 text-center"
        >
            A 2-DAY CYBERSECURITY EVENT.
        </motion.p>

        {/* Date & Venue Pill */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="inline-flex items-center gap-3 sm:gap-6 px-5 sm:px-8 py-3 bg-[#0A0A0A] border border-white/10 rounded-full mb-10 sm:mb-12 backdrop-blur-md"
        >
             <div className="flex items-center gap-2 text-gray-300">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span className="text-xs sm:text-sm font-semibold tracking-wider font-mono">OCT 24 | 25</span>
             </div>
             <div className="w-px h-4 bg-white/10"></div>
             <div className="flex items-center gap-2 text-gray-300">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span className="text-xs sm:text-sm font-semibold tracking-wider font-mono">KMCT IETM</span>
             </div>
        </motion.div>

        {/* CTA Button - "JOIN THE FUTURE" style */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
        >
            <Link 
                to="/events" 
                className="group relative inline-flex items-center justify-center px-8 sm:px-10 py-3 sm:py-4 bg-cyan-400 text-black font-bold text-sm sm:text-base tracking-widest rounded-full overflow-hidden transition-transform duration-300 hover:scale-105 hover:bg-cyan-300 shadow-[0_0_30px_rgba(34,211,238,0.4)]"
            >
                <span className="relative z-10">REGISTER NOW</span>
            </Link>
        </motion.div>
        
      </div>
    </section>
  );
}
