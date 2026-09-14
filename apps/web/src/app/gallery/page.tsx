"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { StickerBadge } from "@/components/ui/StickerBadge";
import { BlackBanner } from "@/components/ui/BlackBanner";
import { PixelFrame } from "@/components/ui/PixelFrame";
import { ImageStreamHero } from "@/components/ui/image-stream-hero";
import api from "@/lib/api";
import { Filter, CheckCircle2, Loader2 } from "lucide-react";

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  image_url: string;
  public_id: string;
  created_at: string;
}

const CATEGORY_MAP: Record<string, { badge: "pink" | "yellow" | "lime" | "mint" | "lilac"; label: string }> = {
  ctf: { badge: "pink", label: "CTF WARGAMES" },
  workshops: { badge: "lime", label: "HANDS-ON LABS" },
  seminars: { badge: "yellow", label: "KEYNOTE" },
  hackathons: { badge: "pink", label: "HACKATHON" },
  other: { badge: "mint", label: "EXPO & HARDWARE" },
};

// Fallback images when API has no data
const FALLBACK_ITEMS = [
  { id: 1, title: "CTF Arena Setup", category: "ctf", image_url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600", public_id: "", created_at: "2025-01-01" },
  { id: 2, title: "Binary Workshop", category: "workshops", image_url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600", public_id: "", created_at: "2025-01-01" },
  { id: 3, title: "Keynote Session", category: "seminars", image_url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600", public_id: "", created_at: "2025-01-01" },
  { id: 4, title: "Hardware Expo", category: "other", image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600", public_id: "", created_at: "2025-01-01" },
];

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("ALL");

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await api.get("/api/gallery/");
        const data = res.data as GalleryItem[];
        setItems(data.length > 0 ? data : FALLBACK_ITEMS);
      } catch {
        setItems(FALLBACK_ITEMS);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const categories = ["ALL", ...Array.from(new Set(items.map((i) => {
    const mapped = CATEGORY_MAP[i.category];
    return mapped ? mapped.label : i.category.toUpperCase();
  })))];

  const filteredItems = activeCategory === "ALL"
    ? items
    : items.filter((i) => {
        const mapped = CATEGORY_MAP[i.category];
        const label = mapped ? mapped.label : i.category.toUpperCase();
        return label === activeCategory;
      });

  const streamImages = items.slice(0, 8).map((i) => ({ src: i.image_url, alt: i.title }));

  return (
    <div className="w-full relative bg-graph-paper min-h-screen">
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-28 pb-16">
        {/* Image Stream Hero */}
        {streamImages.length > 0 && (
          <div className="relative rounded-2xl border-2 border-black overflow-hidden bg-white mb-10">
            <div className="p-6 sm:p-8 border-b-2 border-black bg-[#FAFAFC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <BlackBanner size="md">WARGAME PHOTO ARCHIVE</BlackBanner>
                <p className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-black mt-3 font-normal leading-tight">
                  Visual dispatches from the 24-hour CTF battle, hands-on labs, and keynotes.
                </p>
              </div>
              <div className="flex-shrink-0">
                <span className="font-pixel text-[10px] sm:text-xs text-gray-700 bg-white border-2 border-black px-3 py-1.5 uppercase">
                  TOTAL CAPTURES: {items.length} VERIFIED
                </span>
              </div>
            </div>
            <div className="relative h-[280px] sm:h-[340px] md:h-[400px] w-full bg-[#F0F0FA]">
              <ImageStreamHero images={streamImages} cards={Math.min(8, streamImages.length)} speed={22} axis={50} className="h-full w-full" />
            </div>
          </div>
        )}

        {/* Category Filters */}
        <div className="bg-white border-2 border-black p-4 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-pixel text-[10px] text-gray-500 uppercase flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5" /> Category:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`relative px-3.5 py-1.5 text-xs font-body font-bold border-2 border-black uppercase transition-colors cursor-pointer select-none ${
                    activeCategory === cat
                      ? "bg-th-pink text-black"
                      : "bg-[#F0F0FA] text-black hover:bg-gray-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <span className="font-body text-xs text-gray-500 font-medium">
              Showing {filteredItems.length} verified capture{filteredItems.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        )}

        {/* Photo Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => {
              const catInfo = CATEGORY_MAP[item.category] || { badge: "mint" as const, label: item.category };
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                >
                  <PixelFrame dotGrid cornerAccent className="p-0 overflow-hidden group hover:translate-x-1 hover:-translate-y-1 transition-transform">
                    <div className="relative aspect-[4/3] overflow-hidden border-b-2 border-black bg-gray-100">
                      <img src={item.image_url} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                      <div className="absolute top-3 left-3">
                        <StickerBadge color={catInfo.badge} rotation={-2}>{catInfo.label}</StickerBadge>
                      </div>
                    </div>
                    <div className="p-5 bg-white space-y-2">
                      <h2 className="font-display text-2xl uppercase text-black group-hover:text-th-pink transition-colors leading-none">
                        {item.title}
                      </h2>
                      <div className="pt-2 border-t border-gray-200 flex items-center gap-1.5 text-[10px] font-pixel text-green-700 uppercase tracking-wider">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified Capture</span>
                      </div>
                    </div>
                  </PixelFrame>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Bottom CTA */}
        <div className="mt-14">
          <PixelFrame dotGrid cornerAccent className="p-8 sm:p-10 bg-[#FFFEF0] text-center">
            <StickerBadge color="pink" rotation={-2}>ASTRA 2026 // OCTOBER 6 &amp; 7</StickerBadge>
            <h2 className="font-pixel text-2xl sm:text-4xl font-extrabold uppercase text-black mt-3">
              EXPERIENCE THE ARENA IN PERSON
            </h2>
            <p className="font-editorial italic text-xl sm:text-2xl text-gray-800 mt-2 max-w-xl mx-auto">
              Join 500+ researchers, ethical hackers, and security engineers at KMCT Campus, Calicut.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
              <Link href="/events" className="px-6 py-3.5 bg-black text-white font-display font-bold text-xs uppercase tracking-wider border-2 border-black hover:bg-th-yellow hover:text-black transition-all">
                VIEW EVENTS SCHEDULE &amp; PASSES →
              </Link>
            </div>
          </PixelFrame>
        </div>
      </section>
    </div>
  );
}
