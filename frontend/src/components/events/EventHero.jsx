import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Shield } from 'lucide-react';

const EventHero = () => {
    const containerRef = useRef(null);
    const { scrollY } = useScroll();
    
    const y = useTransform(scrollY, [0, 500], [0, 150]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <section ref={containerRef} className="relative min-h-[70vh] w-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#0A0F1C] via-[#0D1117] to-[#0A0F1C]">
            
            {/* Subtle Grid Background */}
            <div className="absolute inset-0 z-0 opacity-[0.03]" 
                 style={{
                     backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px), 
                                     linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)`,
                     backgroundSize: '80px 80px',
                 }} 
            />

            {/* Gradient Orbs */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] opacity-50" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] opacity-40" />

            {/* Content */}
            <motion.div 
                style={{ y, opacity }}
                className="relative z-10 text-center px-4 max-w-4xl mx-auto"
            >
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm"
                >
                    <Shield className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">Security Events & Workshops</span>
                </motion.div>

                {/* Title */}
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight"
                >
                    Upcoming Events
                </motion.h1>

                {/* Description */}
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
                >
                    Join hands-on cybersecurity challenges, workshops, and competitions designed to sharpen your skills.
                </motion.p>
            </motion.div>

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A0F1C] to-transparent pointer-events-none z-10" />
        </section>
    );
};

export default EventHero;
