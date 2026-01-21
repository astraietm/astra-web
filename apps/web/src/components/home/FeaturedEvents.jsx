import React, { useState, useEffect } from 'react';
import FadeInUp from '../common/FadeInUp';
import EventCard from '../events/EventCard';
import { ArrowRight } from 'lucide-react';
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
        <section className="py-32 bg-background relative overflow-hidden">
             {/* Ambient Background Glows */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                    <div className="max-w-2xl">
                        <FadeInUp>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-px w-8 bg-purple-500" />
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-400">
                                    Upcoming
                                </p>
                            </div>
                            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6">
                                ACTIVE <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">OPERATIONS</span>
                            </h2>
                            <p className="text-lg text-gray-400 leading-relaxed max-w-lg">
                                Stay ahead of the curve. Engage in our latest workshops, hackathons, and seminars designed for the future.
                            </p>
                        </FadeInUp>
                    </div>

                    <FadeInUp delay={0.2}>
                        <Link to="/events" className="group px-8 py-4 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-white font-medium hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-2">
                            View All Events <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </FadeInUp>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                         {[1, 2, 3].map((i) => (
                            <div key={i} className="h-[500px] bg-white/[0.02] rounded-3xl animate-pulse border border-white/5"></div>
                         ))}
                    </div>
                ) : featuredEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredEvents.map((event, index) => (
                            <FadeInUp key={event.id} delay={index * 0.1} className="h-full">
                                <EventCard event={event} index={index} />
                            </FadeInUp>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-white/[0.02] rounded-3xl border border-white/5 backdrop-blur-sm">
                        <p className="text-gray-400 text-lg">No upcoming events scheduled at the moment.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default FeaturedEvents;
