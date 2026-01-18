import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, ArrowUpRight, Clock, ShieldCheck } from 'lucide-react';

const EventModule = ({ event, index }) => {
    const navigate = useNavigate();
    const isCompleted = new Date(event.date) < new Date();
    const isHawkins = event.image?.includes('hawkins') || event.title?.includes('Hawkins');
    
    // Fix: Use a verified Deep Red Circuitry image to match the color scheme
    const displayImage = isHawkins 
        ? 'https://images.unsplash.com/photo-1555617766-c94804975da3?auto=format&fit=crop&q=80'
        : (event.image || 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80');

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => navigate(`/events/${event.id}`)}
            className="group relative w-full h-[480px] rounded-[2rem] overflow-hidden bg-[#050505] border border-white/10 cursor-pointer shadow-2xl shadow-black/50"
        >
            {/* Background Image with Cinematic Zoom */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-red-950/90 via-[#050505]/60 to-transparent z-10 opacity-90" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay z-20 pointer-events-none" />
                
                <img 
                    src={displayImage} 
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out will-change-transform group-hover:scale-110"
                />
            </div>

            {/* Top Floating Badge */}
            <div className="absolute top-6 right-6 z-20">
                <div className={`px-4 py-2 rounded-full backdrop-blur-xl border flex items-center gap-2 ${
                    isCompleted 
                    ? 'bg-zinc-900/50 border-zinc-800 text-zinc-400' 
                    : 'bg-white/10 border-white/20 text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-zinc-500' : 'bg-green-500 animate-pulse'}`} />
                    <span className="text-xs font-bold tracking-widest uppercase">
                        {isCompleted ? 'Archived' : 'Live Event'}
                    </span>
                </div>
            </div>

            {/* Content Container - Bottom Aligned */}
            <div className="absolute bottom-0 left-0 w-full p-8 z-20 flex flex-col justify-end h-full">
                
                {/* Decorative Line (animates width) */}
                <div className="w-12 h-1 bg-red-500 rounded-full mb-6 group-hover:w-20 transition-all duration-500" />

                {/* Metadata */}
                <div className="space-y-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex items-center gap-4 text-xs font-mono tracking-wider text-zinc-400">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-zinc-600" />
                        <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5" />
                            <span>20:00 EST</span>
                        </div>
                    </div>

                    <h3 className="text-4xl font-bold text-white leading-[0.9] tracking-tight group-hover:text-red-500 transition-colors duration-300">
                        {event.title}
                    </h3>
                    
                    <div className="overflow-hidden">
                        <p className="text-zinc-400 text-sm leading-relaxed max-w-[90%] opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                            {event.description || "Authorized personnel only. Access classified event data."}
                        </p>
                    </div>

                    {/* Action Row */}
                    <div className="pt-6 flex items-center justify-between border-t border-white/5 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                        <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-widest">
                            <ShieldCheck className="w-4 h-4 text-red-500" />
                            <span>Secure Entry</span>
                        </div>
                        <div className="p-3 rounded-full bg-white text-black group-hover:bg-red-500 group-hover:text-white transition-colors duration-300">
                            <ArrowUpRight className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default EventModule;
