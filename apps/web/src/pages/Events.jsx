import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import eventsData from '../data/events';

import EventHero from '../components/events/EventHero';
import EventModule from '../components/events/EventModule';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/events/`);
        const mappedEvents = response.data.map(event => ({
          ...event,
          date: event.event_date,
          image: event.image || null
        }));
        
        mappedEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        const apiIds = new Set(mappedEvents.map(e => e.id));
        const localEvents = eventsData.filter(e => !apiIds.has(e.id));
        const allEvents = [...mappedEvents, ...localEvents];
        
        allEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
        setEvents(allEvents);

      } catch (error) {
        console.error("Failed to fetch events:", error);
        setEvents(eventsData);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="bg-[#020202] min-h-screen text-foreground font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* Cinematic Background Scene */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-900/5 rounded-full blur-[100px]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light" />
      </div>

      <main className="relative z-10">
        {/* Hero Section */}
        <EventHero />

        {/* Events Feed Section */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-32">
            
            {/* Sophisticated Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-[1px] bg-blue-500/50" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500/80">Classified Archives</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tighter">
                        Upcoming Sessions
                    </h2>
                </div>

                <div className="flex items-center gap-4 px-5 py-2.5 bg-white/[0.03] border border-white/10 rounded-2xl backdrop-blur-xl">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Nodes</span>
                    <div className="w-px h-3 bg-white/10" />
                    {loading ? (
                        <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                    ) : (
                        <span className="text-sm font-mono font-bold text-blue-400">
                            {events.length.toString().padStart(2, '0')}
                        </span>
                    )}
                </div>
            </div>

            <div className="min-h-[400px]">
                <AnimatePresence mode='wait'>
                {loading ? (
                    <motion.div 
                        key="loader"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-40"
                    >
                        <div className="relative">
                            <div className="w-16 h-16 border-2 border-blue-500/10 rounded-full" />
                            <div className="absolute inset-0 w-16 h-16 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        </div>
                        <p className="mt-8 text-[10px] text-blue-500/50 font-black tracking-[0.4em] uppercase animate-pulse">
                            Syncing Neural Modules
                        </p>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="content"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10"
                    >
                        {events.length > 0 ? (
                            events.map((event, index) => (
                                <EventModule key={event.id} event={event} index={index} />
                            ))
                        ) : (
                            <div className="col-span-full py-32 text-center rounded-[3rem] bg-white/[0.02] border border-white/5 border-dashed">
                                <p className="text-gray-500 text-xl font-bold mb-3 tracking-tight">No Events Synchronized</p>
                                <p className="text-gray-600 text-sm max-w-sm mx-auto">The classified event database is currently empty. Check your credentials and try again later.</p>
                            </div>
                        )}
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
        </div>
      </main>

    </div>
  );
};

export default Events;
