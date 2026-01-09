import React, { useState, useEffect } from 'react';
import FadeInUp from '../common/FadeInUp';
import EventCard from '../events/EventCard';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const FeaturedEvents = () => {
    const [featuredEvents, setFeaturedEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get(`${API_URL}/events/`);
                // Assume API returns valid event objects. 
                // We'll take the first 3. Ideally backend should have a /featured endpoint or sorting.
                setFeaturedEvents(response.data.slice(0, 3));
            } catch (error) {
                console.error("Failed to fetch events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [API_URL]);

    return (
        <section className="py-20 md:py-32 bg-background relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-6">
                    <div className="max-w-xl">
                        <FadeInUp>
                            <h2 className="text-3xl md:text-5xl font-display font-medium text-white mb-6">
                                Upcoming Events
                            </h2>
                        </FadeInUp>
                        <FadeInUp delay={0.1}>
                            <p className="text-gray-400 font-light text-base md:text-lg">
                                Stay ahead of the curve with our workshops, hackathons, and seminars.
                            </p>
                        </FadeInUp>
                    </div>

                    <div>
                        <Link to="/events" className="px-5 py-2 md:px-6 md:py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm md:text-base font-medium hover:bg-white/10 transition-colors flex items-center gap-2">
                            View All Events <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                         {[1, 2, 3].map((i) => (
                            <div key={i} className="h-[400px] bg-white/5 rounded-3xl animate-pulse border border-white/10"></div>
                         ))}
                    </div>
                ) : featuredEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredEvents.map((event, index) => (
                            <FadeInUp key={event.id} delay={index * 0.1} className="h-full">
                                <EventCard event={event} index={index} />
                            </FadeInUp>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                        <p className="text-gray-400">No upcoming events scheduled at the moment.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default FeaturedEvents;
