import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getOptimizedImageUrl } from '../../utils/helpers';
import { cn } from "@/lib/utils";

const FALLBACK_IMAGES = [
    { src: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop" },
    { src: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop" },
    { src: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop" },
    { src: "https://images.unsplash.com/photo-1531297461136-82lw9z2l3b80?q=80&w=600&auto=format&fit=crop" }, 
    { src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop" },
    { src: "https://images.unsplash.com/photo-1550003018-48595398dc71?q=80&w=600&auto=format&fit=crop" },
    { src: "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?q=80&w=600&auto=format&fit=crop" },
];

const MarqueeRow = ({ items, direction = 'left', speed = 50, variant = 'default' }) => {
    const effectiveItems = items.length > 0 ? items : FALLBACK_IMAGES;
    
    // Create a base sequence that is guaranteed to cover a wide screen
    // We duplicate the effectiveItems until we have at least 10 items
    let baseSequence = [...effectiveItems];
    while (baseSequence.length < 10) {
        baseSequence = [...baseSequence, ...effectiveItems];
    }

    // Create the final rowItems by duplicating the base sequence exactly once
    // This allows us to animate from 0% to -50% (or vice versa) for a perfect loop
    const rowItems = [...baseSequence, ...baseSequence];

    // Define shapes based on variant
    const shapeClass = variant === 'default' 
        ? "rounded-tl-[3rem] rounded-br-[3rem] rounded-tr-none rounded-bl-none"
        : "rounded-tr-[3rem] rounded-bl-[3rem] rounded-tl-none rounded-br-none";

    return (
        <div className="relative flex overflow-hidden w-full select-none">
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
            
            <div 
                className="flex gap-4 md:gap-6 w-max py-4 will-change-transform"
                style={{
                    animation: `marquee-${direction} ${speed}s linear infinite`,
                    // For right direction, we naturally start at -50% due to keyframes, 
                    // but we ensure the container aligns correctly
                }}
            >
                {rowItems.map((item, idx) => (
                    <div 
                        key={`${idx}-${item.id || idx}`} 
                        className={cn(
                            "relative min-w-[280px] h-[180px] md:min-w-[400px] md:h-[260px] overflow-hidden bg-white/5 flex-shrink-0 transition-all duration-500 group cursor-pointer border-none",
                            shapeClass
                        )}
                    >
                        <img 
                            src={item.src} 
                            alt="Gallery" 
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out transform group-hover:scale-105"
                            loading="lazy"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length].src;
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

const GalleryMarquee = () => {
    const [images, setImages] = useState([]);
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchImages = async () => {
            try {
                if (!API_URL) throw new Error("No API URL");
                
                const response = await axios.get(`${API_URL}/gallery/`);
                 const mappedItems = response.data
                    .filter(item => item.image_url)
                    .map(item => ({
                        id: item.id,
                        src: getOptimizedImageUrl(item.image_url, 'grid'), 
                    }));
                
                setImages(mappedItems);
            } catch (error) {
                console.log("Using fallback gallery images", error);
                setImages([]); 
            }
        };

        fetchImages();
    }, [API_URL]);

    // Split items for variety if we have enough, otherwise reuse
    const half = Math.ceil(images.length / 2);
    const row1 = images.length > 1 ? images.slice(0, half) : images;
    const row2 = images.length > 1 ? images.slice(half) : images;

    return (
        <section className="py-24 bg-background overflow-hidden relative border-t border-border">
            
             {/* Header */}
             <div className="container mx-auto px-6 mb-16 relative z-10 flex items-center justify-center">
                <div className="flex items-center gap-4">
                     <h2 className="text-4xl md:text-6xl font-sans font-bold text-foreground tracking-tight uppercase">
                        Gallery
                    </h2>
                    <div className="h-2 w-16 md:w-24 bg-cyan-400 rounded-full mt-2" />
                </div>
             </div>

            {/* Marquee Rows */}
            <div className="flex flex-col gap-8 w-[120%] -ml-[10%] -rotate-3 scale-110 origin-center py-10">
                <MarqueeRow items={row1} direction="left" speed={40} variant="default" />
                <MarqueeRow items={row2} direction="right" speed={40} variant="reverse" />
            </div>
        </section>
    );
};

export default GalleryMarquee;
