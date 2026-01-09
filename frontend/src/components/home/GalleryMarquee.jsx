import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Add these to your global CSS or styles block, or we can inline style for the keyframes if needed in a pinch, 
// but Tailwind config is better. For now, we simulate with style injection or standard CSS class if the user has a marquee utility.
// Since we don't know if 'animate-marquee' exists, we'll define a style tag.

const MarqueeRow = ({ items, direction = 'left', speed = 40 }) => {
    // Duplicate items enough times to fill screen + overflow buffer for smooth loop
    // If items are few, duplicate more. If many, duplicate once.
    const rowItems = [...items, ...items, ...items, ...items].slice(0, 30); // Cap at 30 items per row to prevent overload

    return (
        <div className="relative flex overflow-hidden w-full group select-none" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
            <div 
                className={`flex gap-6 min-w-full py-4 will-change-transform`}
                style={{
                    animation: `marquee-${direction} ${speed}s linear infinite`,
                    backfaceVisibility: 'hidden',
                    transformStyle: 'preserve-3d'
                }}
            >
                {rowItems.map((item, idx) => (
                    <div 
                        key={`${item.id}-${idx}`} 
                        className="relative min-w-[280px] h-[180px] rounded-xl overflow-hidden bg-white/5 border border-white/5 flex-shrink-0 transition-opacity hover:opacity-100 opacity-80"
                    >
                         {/* Low Quality Placeholder or Optimized Image */}
                        <img 
                            src={item.src} 
                            alt={item.title} 
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover transform-gpu"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <span className="absolute bottom-3 left-3 text-white/90 text-[10px] font-mono uppercase tracking-widest font-semibold">{item.title}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const GalleryMarquee = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchImages = async () => {
            try {
                // Fetch only needed fields if possible, or just slice later
                const response = await axios.get(`${API_URL}/gallery/`);
                 const mappedItems = response.data
                    .slice(0, 20) // CRITICAL: Limit to latest 20 images only to prevent lag
                    .map(item => ({
                        id: item.id,
                        src: item.image_url, // Ideally use thumbnails if available
                        title: item.title,
                    }));
                setImages(mappedItems);
            } catch (error) {
                console.error("Failed to load gallery images", error);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, [API_URL]);

    if (loading || images.length === 0) return null;

    const half = Math.ceil(images.length / 2);
    const row1 = images.slice(0, half);
    const row2 = images.slice(half);

    return (
        <section className="py-24 bg-background overflow-hidden relative">
             <style>{`
                @keyframes marquee-left {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes marquee-right {
                    0% { transform: translateX(-50%); }
                    100% { transform: translateX(0); }
                }
             `}</style>

             <div className="container mx-auto px-4 mb-10 text-center relative z-10">
                <h2 className="text-4xl md:text-5xl font-display font-medium text-white mb-4">
                    Captured Moments
                </h2>
                <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto font-light">
                    Highlights from our journey.
                </p>
             </div>

            <div className="space-y-6">
                <MarqueeRow items={row1} direction="left" speed={60} />
                <MarqueeRow items={row2} direction="right" speed={70} />
            </div>
        </section>
    );
};

export default GalleryMarquee;
