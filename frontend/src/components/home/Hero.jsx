import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrollIndicator from './ScrollIndicator';

const Hero = () => {
  return (
    <section className="relative w-full min-h-[100dvh] flex items-center justify-center overflow-hidden bg-background py-16 lg:py-0">
      {/* Dynamic Background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
          {/* Radial Gradient */}
          <div className="absolute left-0 right-0 top-[-10%] m-auto h-[600px] w-[600px] rounded-full bg-primary/10 opacity-40 blur-[100px] animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-left flex flex-col items-start"
        >
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="inline-flex items-center gap-2 px-3 py-1 mb-6 md:mb-8 border border-white/10 rounded-full bg-white/5 backdrop-blur-md"
            >
                <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_#00FF9D]"></div>
                <span className="text-gray-300 text-[10px] md:text-xs font-mono tracking-widest uppercase">System Operational</span>
            </motion.div>
          
          <div className="relative mb-6 md:mb-8">
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-display font-medium leading-tight tracking-tight text-white mb-2">
               ASTRA
            </h1>
             <span className="block text-lg sm:text-2xl md:text-3xl font-light text-gray-400 tracking-widest uppercase">
              Association of Cyber Security
            </span>
          </div>

          <p className="text-sm md:text-lg text-gray-400 mb-8 md:mb-10 max-w-lg leading-relaxed font-light border-l-2 border-primary/30 pl-4 md:pl-6">
            Pioneering the future of digital defense. We are a collective of elite researchers and innovators securing the digital frontier.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
            <Link 
                to="/events" 
                className="px-8 py-4 bg-white text-black font-semibold text-sm tracking-wide rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 group btn-shine w-full sm:w-auto"
            >
                Explore Operations <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
                to="/contact"
                className="px-8 py-4 border border-white/10 text-white font-semibold text-sm tracking-wide rounded-full hover:bg-white/5 transition-colors flex items-center justify-center btn-shine w-full sm:w-auto"
            >
                Initialize Access
            </Link>
          </div>
        </motion.div>

        {/* Right Content - Live Threat Monitor */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative h-[350px] md:h-[500px] w-full max-w-lg mx-auto"
        >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-blue-500/5 rounded-2xl blur-xl"></div>
            
            {/* Terminal Window */}
            <div className="relative w-full h-full bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-2xl group hover:border-primary/30 transition-colors duration-500">
                
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    </div>
                    <div className="text-[10px] font-mono text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                        Live Monitor
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-6 font-mono text-xs relative overflow-hidden">
                    {/* Scanning Grid Background */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,157,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,157,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent animate-[scan_3s_ease-in-out_infinite] pointer-events-none"></div>

                    {/* Data Stream */}
                    <div className="space-y-2 relative z-10 h-full overflow-hidden flex flex-col justify-end">
                         <div className="text-gray-500">[SYSTEM] <span className="text-white">Initializing core protocols...</span></div>
                         <div className="text-gray-500">[NETWORK] <span className="text-white">Establishing handshake with external nodes...</span></div>
                         <div className="text-gray-500">[SECURITY] <span className="text-primary">Encrypted connection active.</span></div>
                         <div className="text-gray-500">[FIREWALL] <span className="text-white">Packet rejected from 192.168.0.x (Port 445)</span></div>
                         <div className="text-gray-500">[SCAN] <span className="text-blue-400">Heuristic analysis in progress...</span></div>
                         <div className="text-gray-500">[STATUS] <span className="text-green-400">No active threats detected.</span></div>
                         <div className="flex items-center gap-2 text-primary mt-4">
                             <span className="animate-pulse">_</span>
                         </div>
                    </div>
                </div>

                {/* Footer Status */}
                <div className="px-6 py-4 border-t border-white/5 bg-white/5 flex justify-between items-center text-[10px] uppercase font-bold tracking-wider text-gray-400">
                    <div>
                        CPU: <span className="text-white">12%</span>
                    </div>
                    <div>
                        MEM: <span className="text-white">4.2GB</span>
                    </div>
                     <div className="flex items-center gap-2">
                        NET: <span className="text-primary flex gap-0.5">
                            <span className="w-0.5 h-2 bg-primary"></span>
                            <span className="w-0.5 h-3 bg-primary"></span>
                            <span className="w-0.5 h-4 bg-primary"></span>
                            <span className="w-0.5 h-2 bg-primary"></span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Floating Decorative Elements */}
            <motion.div 
                className="absolute -right-12 top-20 bg-surface border border-white/10 p-4 rounded-xl backdrop-blur-md shadow-xl hidden lg:block"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
                <div className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Threat Level</div>
                <div className="text-2xl font-bold text-white flex items-center gap-2">
                    LOW <Shield className="w-5 h-5 text-green-400" />
                </div>
            </motion.div>
        </motion.div>
      </div>

      <ScrollIndicator />
    </section>
  );
};

export default Hero;
