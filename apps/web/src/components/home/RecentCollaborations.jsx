import React from 'react';
import { motion } from 'framer-motion';
import { collaborations } from '../../data/collaborations';

const TestimonialCard = ({ collaboration }) => (
  <div className="flex-shrink-0 w-[400px] p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm group hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300">
    <p className="text-gray-300 text-lg font-light leading-relaxed mb-8 italic">
      "{collaboration.comment}"
    </p>
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
        <img src={collaboration.avatar} alt={collaboration.name} className="w-full h-full object-cover" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-white tracking-wide">{collaboration.name}</h4>
        <p className="text-xs text-gray-500 font-medium">{collaboration.role}</p>
      </div>
    </div>
  </div>
);

const RecentCollaborations = () => {
    // Split collaborations for two rows
    const row1 = [...collaborations, ...collaborations];
    const row2 = [...collaborations.slice().reverse(), ...collaborations.slice().reverse()];

    return (
        <section className="py-24 bg-background overflow-hidden relative">
            <div className="container mx-auto px-6 mb-16 text-center lg:text-left">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium mb-4">
                    <span className="text-white">Recent</span>{" "}
                    <span className="text-neutral-600">Collaborations</span>
                </h2>
            </div>

            <div className="relative flex flex-col gap-6">
                {/* Gradient Mask for fading edges */}
                <div className="absolute inset-y-0 left-0 w-32 md:w-64 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-32 md:w-64 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

                {/* First Row: Moving Left */}
                <div className="flex overflow-hidden">
                    <motion.div 
                        initial={{ x: 0 }}
                        animate={{ x: "-50%" }}
                        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                        className="flex gap-6 whitespace-nowrap"
                    >
                        {row1.map((item, i) => (
                            <TestimonialCard key={i} collaboration={item} />
                        ))}
                    </motion.div>
                </div>

                {/* Second Row: Moving Right (Slower or different speed) */}
                <div className="flex overflow-hidden translate-x-[-10%]">
                    <motion.div 
                        initial={{ x: "-50%" }}
                        animate={{ x: 0 }}
                        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                        className="flex gap-6 whitespace-nowrap"
                    >
                        {row2.map((item, i) => (
                            <TestimonialCard key={i} collaboration={item} />
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default RecentCollaborations;
