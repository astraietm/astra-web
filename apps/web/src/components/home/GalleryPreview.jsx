

import React from 'react';
import { Link } from 'react-router-dom';
import FadeInUp from '../common/FadeInUp';

const galleryItems = [
    { label: "Workshop Lab" },
    { label: "CTF Night" },
    { label: "Guest Talk" },
    { label: "Team Huddle" },
    { label: "Networking" },
    { label: "Build Session" }
];

const GalleryPreview = () => {
    return (
        <section className="py-20 md:py-32 bg-background relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="flex justify-between items-center mb-10 md:mb-16">
                     <div>

                        <FadeInUp>
                            <h2 className="text-4xl md:text-5xl font-display font-medium text-white mb-6">
                                Event Gallery
                            </h2>
                        </FadeInUp>
                        <FadeInUp delay={0.1}>
                            <p className="text-gray-400 text-lg font-light">
                                Highlights from our recent bootcamps, workshops, and hack nights.
                            </p>
                        </FadeInUp>
                     </div>
                     <Link to="/gallery" className="hidden md:block px-6 py-2 rounded-lg border border-white/10 text-white text-sm hover:bg-white/5 transition-colors">
                        Submit Photos
                     </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {galleryItems.map((item, index) => (
                        <FadeInUp key={index} delay={index * 0.05}>
                            <div
                                className="aspect-[4/3] bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden group hover:border-white/20 transition-all duration-500"
                            >
                                {/* Grid Lines Overlay */}
                                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-50"></div>
                                
                                {/* Bottom Label */}
                                <div className="absolute bottom-4 left-4">
                                    <span className="px-3 py-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-xs text-white font-medium">
                                        {item.label}
                                    </span>
                                </div>
                            </div>
                        </FadeInUp>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GalleryPreview;
