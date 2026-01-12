import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Terminal, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
          image: event.image || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070'
        }));
        
        // Sort by date (newest first)
        mappedEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
        setEvents(mappedEvents);

      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="bg-[#0A0F1C] min-h-screen text-gray-200 font-sans selection:bg-primary/30 relative overflow-hidden">
      
      {/* Global Effects - Minimal */}
      {/* Subtle Grid */}
      <div className="fixed inset-0 z-0 opacity-[0.02]" 
           style={{
               backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px), 
                               linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)`,
               backgroundSize: '80px 80px',
           }} 
      />

      {/* Radial Gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none z-0" />
      
      {/* Hero */}
      <EventHero />

      {/* Events Feed */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 min-h-[50vh]">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            All Events
          </h2>
          <p className="text-gray-400">
            Showing {events.length} event{events.length !== 1 ? 's' : ''}
          </p>
        </div>

        {loading ? (
             <div className="flex flex-col gap-8">
                {[1, 2, 3].map((i) => (
                  <SkeletonLoader key={i} variant="card" />
                ))}
             </div>
        ) : (
            <div className="flex flex-col gap-8">
                <AnimatePresence mode='wait'>
                    {events.length > 0 ? (
                        events.map((event, index) => (
                            <EventModule key={event.id} event={event} index={index} />
                        ))
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="py-20 text-center border border-white/10 rounded-2xl bg-white/[0.02]"
                        >
                            <p className="text-gray-500 text-lg mb-2">No events available</p>
                            <p className="text-gray-600 text-sm">Check back soon for upcoming events</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        )}
      </div>

    </div>
  );
};

export default Events;
