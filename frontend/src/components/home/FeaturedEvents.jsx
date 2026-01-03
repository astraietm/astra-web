import React from 'react';
import FadeInUp from '../common/FadeInUp';

import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const events = [
    {
        id: 1,
        title: "Intro to Cybersecurity",
        tags: "Workshop • 90 min",
        description: "Threat basics, safe practices, and your first security toolkit."
    },
    {
        id: 2,
        title: "Capture The Flag Night",
        tags: "CTF • Team-based",
        description: "Web, crypto, forensics—learn by breaking things responsibly."
    },
    {
        id: 3,
        title: "Blue Team Lab",
        tags: "Hands-on • Detection",
        description: "Log analysis, SIEM concepts, and incident response drills."
    },
    {
        id: 4,
        title: "Red Team Basics",
        tags: "Workshop • Offensive",
        description: "Recon, exploitation mindset, and ethical boundaries."
    },
    {
        id: 5,
        title: "Cloud Security Sprint",
        tags: "Talk • Lab • Cloud",
        description: "Misconfigs, IAM, and securing modern deployments."
    },
    {
        id: 6,
        title: "Career Panel",
        tags: "Talk • Industry",
        description: "Internships, portfolios, and navigating security roles."
    }
];

const FeaturedEvents = () => {
  return (
    <section className="py-20 md:py-32 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-6">
            <div className="max-w-xl">
                <FadeInUp>
                    <h2 className="text-4xl md:text-5xl font-display font-medium text-white mb-6">
                        Events
                    </h2>
                </FadeInUp>
                <FadeInUp delay={0.1}>
                    <p className="text-gray-400 font-light text-lg">
                        Scroll-revealed cards with hover polish—built to feel modern without any external animation libraries.
                    </p>
                </FadeInUp>
            </div>
            
            <div>
                <Link to="/contact" className="px-6 py-3 rounded-xl border border-white/10 bg-white/5 text-white font-medium hover:bg-white/10 transition-colors">
                    Partner / Sponsor
                </Link>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => (
                <FadeInUp key={event.id} delay={index * 0.1}>
                    <div
                        className="group bg-white/5 border border-white/10 p-6 md:p-8 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 relative overflow-hidden h-full"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                             {/* Subtle decoration */}
                             <div className="w-24 h-24 bg-primary rounded-full blur-3xl"></div>
                        </div>

                        <div className="w-12 h-12 bg-gradient-to-br from-white/10 to-transparent rounded-lg mb-6 border border-white/5 shadow-inner"></div>

                        <div className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">{event.tags}</div>
                        
                        <h3 className="text-xl font-display font-medium text-white mb-3 group-hover:text-primary transition-colors">
                            {event.title}
                        </h3>
                        
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            {event.description}
                        </p>
                        
                        <Link 
                            to={`/events/${event.id}`} 
                            className="inline-flex items-center gap-2 text-primary font-medium text-sm group-hover:gap-3 transition-all"
                        >
                            Learn more <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </FadeInUp>
            ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;
