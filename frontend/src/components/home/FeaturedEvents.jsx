import React from 'react';
import eventsData from '../../data/events.json';
import { ArrowUpRight, Calendar, MapPin, ChevronRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const FeaturedEvents = () => {
  const featuredEvents = eventsData.slice(0, 4);

  return (
    <section className="py-32 bg-background relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-2 mb-4"
                >
                    <Zap className="w-5 h-5 text-primary" />
                    <span className="text-primary font-mono text-sm tracking-widest uppercase">Ongoing Operations</span>
                </motion.div>
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-6xl font-display font-bold text-white mb-2"
                >
                    Mission <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Log</span>
                </motion.h2>
            </div>
            <Link 
                to="/events" 
                className="group flex items-center gap-2 text-white font-bold border-b border-white/30 pb-1 hover:border-primary transition-all"
            >
                View All Operations <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-primary" />
            </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 auto-rows-[300px]">
            {featuredEvents.map((event, index) => {
                const isLarge = index === 0 || index === 3;
                return (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className={`group relative rounded-3xl overflow-hidden border border-white/10 bg-surface/50 backdrop-blur-sm hover:border-primary/50 transition-colors ${
                            isLarge ? 'md:col-span-6 lg:col-span-8' : 'md:col-span-3 lg:col-span-4'
                        }`}
                    >
                         {/* Image Background */}
                        <div className="absolute inset-0 z-0">
                            <img 
                                src={event.image} 
                                alt={event.title} 
                                className="w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                        </div>

                        {/* Content */}
                        <div className="absolute inset-0 z-10 p-8 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-white border border-white/10 group-hover:bg-primary group-hover:text-black transition-colors">
                                    {event.category}
                                </span>
                                <Link to={`/events/${event.id}`} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-colors backdrop-blur-md">
                                    <ArrowUpRight className="w-5 h-5" />
                                </Link>
                            </div>
                            
                            <div>
                                <div className="flex items-center gap-4 text-sm text-gray-300 mb-3 font-mono">
                                    <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> {event.date}</span>
                                    <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> {event.venue}</span>
                                </div>
                                <h3 className={`font-display font-bold text-white mb-2 leading-tight group-hover:text-primary transition-colors ${isLarge ? 'text-4xl' : 'text-2xl'}`}>
                                    {event.title}
                                </h3>
                                <p className="text-gray-400 line-clamp-2">{event.description}</p>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;
