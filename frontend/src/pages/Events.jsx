import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, CalendarX } from 'lucide-react';
import EventCard from '../components/events/EventCard';
// import eventsData from '../data/events'; // REMOVED

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/events/`);
        // Map backend fields to frontend props
        const mappedEvents = response.data.map(event => ({
          ...event,
          date: new Date(event.event_date).toLocaleDateString(undefined, {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
          }),
          // Ensure image has a fallback if empty
          image: event.image || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070'
        }));
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
    <div className="min-h-screen pt-24 pb-12 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Upcoming <span className="text-primary">Events</span>
          </h1>
          <p className="text-gray-400 max-w-2xl text-lg">
            Join our workshops, hackathons, and seminars to level up your cybersecurity skills.
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : events.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <CalendarX className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-xl font-mono">No upcoming events found.</p>
            <p className="text-sm mt-2">Check back later or check our signals.</p>
          </div>
        ) : (
          /* Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
