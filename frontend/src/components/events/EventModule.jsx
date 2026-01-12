import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Clock, Users, Calendar } from 'lucide-react';

const EventModule = ({ event, index }) => {
    // Determine status (implied logic for demo, can be refined with real dates)
    const isLive = false; // logic to check if current time is within event time
    const isCompleted = new Date(event.date) < new Date();
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="group relative w-full"
        >
            <div className="relative overflow-hidden rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-500 hover:bg-white/[0.04]">
                
                {/* Module Layout */}
                <div className="flex flex-col md:flex-row items-stretch">
                    
                    {/* Date Block (Left) */}
                    <div className="hidden md:flex flex-col justify-center items-center w-32 border-r border-white/5 bg-white/[0.01] p-6">
                        <span className="text-3xl font-light text-white font-inter">
                            {new Date(event.date).getDate().toString().padStart(2, '0')}
                        </span>
                        <span className="text-xs uppercase tracking-widest text-gray-500 mt-1">
                            {new Date(event.date).toLocaleString('default', { month: 'short' }).toUpperCase()}
                        </span>
                    </div>

                    {/* Main Content (Center) */}
                    <div className="flex-1 p-6 md:p-8 flex flex-col justify-center relative">
                         {/* Mobile Date */}
                         <div className="md:hidden flex items-center gap-2 text-gray-500 mb-4 text-xs tracking-widest uppercase">
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{event.time || "TBA"}</span>
                        </div>

                        {/* Status Tag */}
                        <div className="mb-3 flex items-center gap-3">
                            {isLive ? (
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium bg-red-500/10 text-red-500 border border-red-500/20 uppercase tracking-wider">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Live Now
                                </span>
                            ) : isCompleted ? (
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium bg-white/5 text-gray-500 border border-white/5 uppercase tracking-wider">
                                    Completed
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
                                    Upcoming
                                </span>
                            )}
                            
                            {/* Type Tag */}
                            <span className="text-[10px] text-gray-500 border border-white/5 px-2 py-0.5 rounded uppercase tracking-wider">
                                {event.type || "Workshop"}
                            </span>
                        </div>

                        <h3 className="text-2xl text-white font-light tracking-tight mb-2 group-hover:text-blue-400 transition-colors duration-300 font-inter">
                            {event.title}
                        </h3>
                        
                        <p className="text-gray-400 text-sm leading-relaxed max-w-2xl line-clamp-2">
                            {event.short_description || "An advanced session diving deep into modern cybersecurity practices and ethical hacking methodologies."}
                        </p>

                        {/* Metadata Footer */}
                        <div className="flex items-center gap-6 mt-6 text-xs text-gray-500 font-mono">
                            <div className="flex items-center gap-2">
                                <Clock className="w-3 h-3" />
                                <span>{event.duration || "2 Hours"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="w-3 h-3" />
                                <span>{event.team_size ? `Team of ${event.team_size}` : "Individual"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${event.mode === 'online' ? 'bg-green-500' : 'bg-orange-500'}`} />
                                <span className="uppercase">{event.mode || "Offline"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action (Right) */}
                    <div className="flex md:flex-col justify-center items-center p-6 md:border-l border-t md:border-t-0 border-white/5 bg-white/[0.01] gap-4">
                         <button className="w-full md:w-auto h-10 w-10 flex items-center justify-center rounded-full border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all group/btn">
                             <ArrowUpRight className="w-5 h-5 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform" />
                         </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default EventModule;
