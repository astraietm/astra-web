import React from 'react';

const HackingDecorations = () => {
    return (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Spinning Radar Top Right */}
            <div className="absolute top-20 right-20 w-64 h-64 border border-primary/20 rounded-full flex items-center justify-center opacity-30 animate-[spin_12s_linear_infinite] hidden lg:flex">
                 <div className="w-[95%] h-[95%] border border-dashed border-primary/20 rounded-full"></div>
                 <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent absolute top-1/2 left-0"></div>
                 <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-primary/50 to-transparent absolute top-0 left-1/2"></div>
            </div>

            {/* Floating Binary Bits */}
             <div className="absolute top-1/3 left-10 font-mono text-xs text-primary/40 flex flex-col gap-1 hidden lg:flex">
                <span className="animate-pulse">010101</span>
                <span className="opacity-50">110010</span>
                <span className="opacity-30">001100</span>
             </div>

             {/* Bottom Scrolling Data Line */}
             <div className="absolute bottom-0 left-0 w-full h-16 bg-black/60 border-t border-white/5 flex items-center overflow-hidden whitespace-nowrap z-10 backdrop-blur-md">
                <div className="animate-scroll-left flex w-max">
                     {[...Array(4)].map((_, i) => (
                         <div key={i} className="flex gap-24 px-12 text-base md:text-xl font-display font-medium tracking-[0.4em] text-white/50 uppercase">
                             <span>/// EVOLVE</span>
                             <span>/// CONNECT</span>
                             <span>/// CREATE</span>
                             <span>/// IMAGINE</span>
                             <span>/// INNOVATE</span>
                             <span>/// DISRUPT</span>
                             <span>/// TRANSCEND</span>
                         </div>
                     ))}
                </div>
             </div>
             
             {/* Random Crosshairs */}
             <div className="absolute top-[15%] left-[20%] w-3 h-3 border-l border-t border-primary/50"></div>
             <div className="absolute top-[15%] left-[20%] w-3 h-3 border-r border-b border-primary/50"></div>
             
             <div className="absolute bottom-[30%] right-[15%] w-3 h-3 border-l border-t border-blue-500/50"></div>
             <div className="absolute bottom-[30%] right-[15%] w-3 h-3 border-r border-b border-blue-500/50"></div>
             
             <style jsx>{`
                @keyframes scroll-left {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-scroll-left {
                    animation: scroll-left 20s linear infinite;
                }
             `}</style>
        </div>
    );
};

export default HackingDecorations;
