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
    let baseSequence = [...effectiveItems];
    while (baseSequence.length < 8) {
        baseSequence = [...baseSequence, ...effectiveItems];
    }

    const rowItems = [...baseSequence, ...baseSequence];

    // Define shapes based on variant
    const shapeClass = variant === 'default' 
        ? "rounded-tl-[2rem] md:rounded-tl-[3rem] rounded-br-[2rem] md:rounded-br-[3rem] rounded-tr-none rounded-bl-none"
        : "rounded-tr-[2rem] md:rounded-tr-[3rem] rounded-bl-[2rem] md:rounded-bl-[3rem] rounded-tl-none rounded-br-none";

    return (
        <div className="relative flex overflow-hidden w-full select-none transform-gpu">
            <style>{`
                @keyframes marquee-left {
                    0% { transform: translate3d(0, 0, 0); }
                    100% { transform: translate3d(-50%, 0, 0); }
                }
                @keyframes marquee-right {
                    0% { transform: translate3d(-50%, 0, 0); }
                    100% { transform: translate3d(0, 0, 0); }
                }
            `}</style>
            
            <div 
                className="flex gap-4 md:gap-6 w-max py-4 will-change-transform"
                style={{
                    animation: `marquee-${direction} ${speed}s linear infinite`,
                    backfaceVisibility: 'hidden',
                    perspective: 1000
                }}
            >
                {rowItems.map((item, idx) => (
                    <div 
                        key={`${idx}-${item.id || idx}`} 
                        className={cn(
                            "relative min-w-[240px] h-[160px] md:min-w-[400px] md:h-[260px] overflow-hidden bg-white/5 flex-shrink-0 transition-all duration-700 group cursor-pointer border border-white/[0.03] hover:border-cyan-500/30",
                            shapeClass
                        )}
                    >
                        <img 
                            src={item.src} 
                            alt="Gallery Intel" 
                            className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 ease-out transform group-hover:scale-110 will-change-transform"
                            loading="lazy"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length].src;
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
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

    const half = Math.ceil(images.length / 2);
    const row1 = images.length > 1 ? images.slice(0, half) : images;
    const row2 = images.length > 1 ? images.slice(half) : images;

    return (
        <section className="py-24 md:py-32 bg-background overflow-hidden relative border-t border-white/[0.03]">
            {/* Ambient Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/[0.02] rounded-full blur-[120px] pointer-events-none" />
            
             {/* Header */}
             <div className="container mx-auto px-6 mb-20 relative z-10 flex flex-col items-center">
                <div className="flex flex-col items-center gap-4 text-center">
                    <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.5em] mb-2">VISUAL_ARCHIVE</span>
                    <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter uppercase mb-4">
                        SYSTEM <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/20">LOGS</span>
                    </h2>
                    <div className="h-px w-24 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                </div>
             </div>

            {/* Marquee Rows */}
            <div className="flex flex-col gap-6 md:gap-12 w-[140%] -ml-[20%] -rotate-2 md:-rotate-3 scale-[1.05] md:scale-110 origin-center py-10 transform-gpu">
                <MarqueeRow items={row1} direction="left" speed={60} variant="default" />
                <MarqueeRow items={row2} direction="right" speed={50} variant="reverse" />
            </div>
            
            {/* Grid Overlay for Texture */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        </section>
    );
};


export default GalleryMarquee;
