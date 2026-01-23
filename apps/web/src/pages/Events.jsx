import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import eventsData from '../data/events';

import EventHero from '../components/events/EventHero';
import EventModule from '../components/events/EventModule';
import SkeletonLoader from '../components/common/SkeletonLoader';

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
          // Custom cover for Hawkins Lab (ID 1)
          image: event.id === 1 ? '/hawkins-cover.png' : (event.image || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800')
        }));
        
        mappedEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Merge with local events (Shadow Login, Cipher Decode) to ensure they appear
        const apiIds = new Set(mappedEvents.map(e => e.id));
        const localEvents = eventsData.filter(e => !apiIds.has(e.id));
        const allEvents = [...mappedEvents, ...localEvents];
        
        // Re-sort all events
        allEvents.sort((a, b) => new Date(b.date) - new Date(a.date));

        setEvents(allEvents);

      } catch (error) {
        console.error("Failed to fetch events:", error);
        // Fallback Mock Events so the page is never empty
        // Fallback Mock Events so the page is never empty
        setEvents(eventsData);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="bg-black min-h-screen text-foreground font-sans selection:bg-cyan-500/30">
      



      {/* Hero */}
      <EventHero />

      {/* Events Feed */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-[50vh]">
        
        {/* Simple Section Header */}
        <div className="flex items-baseline justify-between mb-12">
            <h2 className="text-2xl font-semibold text-white tracking-tight">
                Upcoming Sessions
            </h2>
            <p className="text-sm text-gray-500 font-medium">
                {loading ? (
                    <span className="animate-pulse">Syncing...</span>
                ) : (
                    <span>{events.length} Events</span>
                )}
            </p>
        </div>

        <div className="min-h-[400px]">
            <AnimatePresence mode='wait'>
            {loading ? (
                <motion.div 
                    key="loader"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center p-20"
                >
                    <div className="w-12 h-12 border-2 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
                    <p className="text-sm text-primary/50 font-mono tracking-widest uppercase animate-pulse">
                        Retrieving Data
                    </p>
                </motion.div>
            ) : (
                <motion.div 
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {events.length > 0 ? (
                        events.map((event, index) => (
                            <EventModule key={event.id} event={event} index={index} />
                        ))
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="col-span-full py-20 text-center border border-white/10 rounded-2xl bg-white/[0.02]"
                        >
                            <p className="text-gray-500 text-lg mb-2">No events available</p>
                            <p className="text-gray-600 text-sm">Check back soon for upcoming events</p>
                        </motion.div>
                    )}
                </motion.div>
            )}
            </AnimatePresence>
        </div>
      </div>

    </div>
  );
};

export default Events;
