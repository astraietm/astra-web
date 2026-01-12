import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, ArrowUpRight } from 'lucide-react';

const EventModule = ({ event, index }) => {
    const navigate = useNavigate();
    const isCompleted = new Date(event.date) < new Date();
    
    // Status Logic for Badge
    const getStatus = () => {
        if (isCompleted) return { label: 'Past', color: 'bg-gray-500/10 text-gray-400 border-gray-500/20' };
        if (!event.is_registration_open) return { label: 'Closed', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' };
        return { label: 'Open', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
    };
    
    const status = getStatus();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.05, duration: 0.5, ease: "easeOut" }}
            onClick={() => navigate(`/events/${event.id}`)}
            className="group relative cursor-pointer w-full"
        >
            {/* --- GLASS CARD --- */}
            <div className="relative h-full bg-[#0A0C10]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:border-white/10 hover:bg-[#0F1218] hover:shadow-2xl hover:shadow-black/50 hover:-translate-y-1">
                
                {/* Card Header: Category & Status */}
                <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                        {event.category || 'Event'}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${status.color} uppercase tracking-wider`}>
                        {status.label}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight leading-snug group-hover:text-blue-400 transition-colors duration-300">
                    {event.title}
                </h3>

                {/* Subtitle / Description */}
                <p className="text-sm text-gray-400 leading-relaxed mb-6 line-clamp-2">
                    {event.description || event.short_description || "Join us for this exclusive event."}
                </p>

                {/* Footer Info */}
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                    
                    {/* Left: Meta Data */}
                    <div className="flex items-center gap-4 text-xs font-medium text-gray-400">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" />
                            <span className="truncate max-w-[100px]">{event.venue || 'TBA'}</span>
                        </div>
                    </div>

                    {/* Right: Icon */}
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                        <ArrowUpRight className="w-4 h-4" />
                    </div>

                </div>
            </div>
        </motion.div>
    );
};

export default EventModule;
