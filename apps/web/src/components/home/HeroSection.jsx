import { motion } from "framer-motion";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import RippleGrid from "../common/RippleGrid";

export function HeroSection() {
  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-background">
      
      {/* Ripple Grid Background */}
      <div className="absolute inset-0 z-0">
        <RippleGrid
          enableRainbow={false}
          gridColor="#333"
          rippleIntensity={0.05}
          gridSize={10}
          gridThickness={15}
          mouseInteraction={true}
          mouseInteractionRadius={1.2}
          opacity={0.3}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto w-full mt-12 sm:mt-0">
        
        {/* Main Title - "MAGNATHON" style */}
        <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            className="font-space font-black text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-400 drop-shadow-2xl uppercase mb-[-8px] sm:mb-[-15px] relative z-20 will-change-transform"
        >
            ASTRA
        </motion.h1>

        {/* Large Gradient Number - "2026" style */}
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
            className="font-space font-black text-[3rem] xs:text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[10rem] leading-[0.85] sm:leading-[0.8] tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-cyan-400 to-blue-600 relative z-10 whitespace-nowrap will-change-transform"
        >
            ZERO DAY
        </motion.div>

        {/* Tagline */}
        <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-sans text-[10px] sm:text-sm md:text-base font-bold text-white tracking-[0.2em] uppercase mt-10 mb-10 text-center max-w-[280px] sm:max-w-none"
        >
            A 2-DAY <span className="text-cyan-400">CYBERSECURITY</span> CONVERGENCE.
        </motion.p>

        {/* Date & Venue Pill */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6 px-6 py-4 sm:py-3 bg-[#030303]/60 border border-white/10 rounded-[2rem] sm:rounded-full mb-12 backdrop-blur-md w-full sm:w-auto"
        >
             <div className="flex items-center gap-2.5 text-gray-300">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span className="text-[11px] sm:text-sm font-black tracking-widest font-mono">FEB 11 / 12</span>
             </div>
             <div className="hidden sm:block w-px h-4 bg-white/10"></div>
             <div className="flex items-center gap-2.5 text-gray-300">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span className="text-[11px] sm:text-sm font-black tracking-widest font-mono uppercase">KMCT IETM</span>
             </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="w-full sm:w-auto px-4 sm:px-0"
        >
            <Link 
                to="/events" 
                className="group relative inline-flex items-center justify-center w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-black text-sm tracking-[0.2em] rounded-full overflow-hidden transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_40px_rgba(34,211,238,0.6)] will-change-transform uppercase"
            >
                <span className="relative z-10">INITIATE REGISTRATION</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
            </Link>
        </motion.div>
        
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-background via-background/80 to-transparent z-20 pointer-events-none"></div>
    </section>
  );
}

