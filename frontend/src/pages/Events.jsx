import React from 'react';
import EventCard from '../components/events/EventCard';
import eventsData from '../data/events';

const Events = () => {
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

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {eventsData.map((event, index) => (
            <EventCard key={event.id} event={event} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;
