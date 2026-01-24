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







      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-5xl mx-auto w-full mt-16 sm:mt-0">
        
        {/* Main Title - "MAGNATHON" style */}
        <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-space font-bold text-6xl sm:text-7xl md:text-8xl lg:text-[7rem] tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-400 drop-shadow-2xl uppercase mb-[-10px] sm:mb-[-15px] relative z-20"
        >
            ASTRA
        </motion.h1>

        {/* Large Gradient Number - "2026" style */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-space font-bold text-[3.5rem] xs:text-[4rem] sm:text-[6rem] md:text-[7rem] lg:text-[9.5rem] leading-[0.8] tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-cyan-400 to-blue-600 relative z-10 whitespace-nowrap"
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
            className="font-sans text-xs sm:text-sm md:text-base font-bold text-white tracking-[0.1em] uppercase mt-8 mb-10 text-center"
        >
            A 2-DAY <span className="text-cyan-400">CYBERSECURITY</span> EVENT.
        </motion.p>

        {/* Date & Venue Pill */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="inline-flex items-center gap-3 sm:gap-6 px-6 py-3 bg-[#030303]/80 border border-white/10 rounded-full mb-12 backdrop-blur-md"
        >
             <div className="flex items-center gap-2 text-gray-300">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span className="text-xs sm:text-sm font-semibold tracking-wider font-mono">FEB 12, 13</span>
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
                className="group relative inline-flex items-center justify-center px-10 py-4 bg-cyan-400 text-black font-extrabold text-base tracking-wider rounded-full overflow-hidden transition-transform duration-300 hover:scale-105 shadow-[0_0_40px_rgba(34,211,238,0.6)]"
            >
                <span className="relative z-10">REGISTER NOW</span>
            </Link>
        </motion.div>
        
        
      </div>
      

      
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-black via-black/80 to-transparent z-20 pointer-events-none"></div>
    </section>
  );
}
