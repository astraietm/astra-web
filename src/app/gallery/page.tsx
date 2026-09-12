"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ImageStreamHero } from "@/components/ui/image-stream-hero";
import { MarqueeTicker } from "@/components/ui/MarqueeTicker";
import { StickerBadge } from "@/components/ui/StickerBadge";
import { BlackBanner } from "@/components/ui/BlackBanner";
import { DotMatrixDisplay } from "@/components/ui/DotMatrixDisplay";
import { PixelFrame } from "@/components/ui/PixelFrame";
import {
  Camera,
  Filter,
  Eye,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  Shield,
  Code,
  Terminal,
  Award,
} from "lucide-react";

const GALLERY_STREAM_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
    alt: "Cyber Defense Center & SOC Floor",
  },
  {
    src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
    alt: "KMCT Cyber Security Hackathon Squad",
  },
  {
    src: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    alt: "Binary Exploitation & Memory Analysis",
  },
  {
    src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
    alt: "National Cyber Security Conclave Stage",
  },
  {
    src: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80",
    alt: "24H National CTF Arena WarGames",
  },
  {
    src: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    alt: "Cryptographic Security & Zero-Day Research",
  },
  {
    src: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80",
    alt: "Symposium Presentation Stage",
  },
  {
    src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
    alt: "KMCT Collegiate Cyber Defense Squad",
  },
];

interface GalleryItem {
  id: string;
  category: "CTF WARGAMES" | "HANDS-ON LABS" | "KEYNOTE" | "EXPO & HARDWARE";
  title: string;
  subtitle: string;
  image: string;
  date: string;
  timestamp: string;
  badge: "pink" | "yellow" | "lime" | "mint" | "lilac";
  location: string;
  highlight: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "gal-1",
    category: "CTF WARGAMES",
    title: "Flag First-Blood Breakthrough",
    subtitle: "KMCT Red Team Alpha cracking kernel heap exploit",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80",
    date: "OCT 06, 2026",
    timestamp: "03:42 AM IST",
    badge: "lime",
    location: "Cyber Arena Lab",
    highlight: "First-blood bonus flag award (+500 pts)",
  },
  {
    id: "gal-2",
    category: "KEYNOTE",
    title: "Zero-Day Threat Conclave",
    subtitle: "Distinguished CERT-In advisors addressing 500+ researchers",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
    date: "OCT 06, 2026",
    timestamp: "10:15 AM IST",
    badge: "yellow",
    location: "Main Auditorium, KMCT",
    highlight: "Inaugural keynote & State Threat Report launch",
  },
  {
    id: "gal-3",
    category: "HANDS-ON LABS",
    title: "Ghidra Binary Reverse Engineering",
    subtitle: "Masterclass delegates bypassing ASLR & ROP stack protections",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    date: "OCT 06, 2026",
    timestamp: "12:30 PM IST",
    badge: "pink",
    location: "Advanced Lab 1",
    highlight: "60 workstations live binary triage",
  },
  {
    id: "gal-4",
    category: "EXPO & HARDWARE",
    title: "Automotive CAN Bus & IoT Security Testbed",
    subtitle: "Live hardware vulnerability interception demonstration",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    date: "OCT 07, 2026",
    timestamp: "11:00 AM IST",
    badge: "lilac",
    location: "Innovation Gallery",
    highlight: "Real-time ECU packet injection demo",
  },
  {
    id: "gal-5",
    category: "CTF WARGAMES",
    title: "Midnight WarGames Intensive",
    subtitle: "Overnight attack-defense rounds between top collegiate squads",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
    date: "OCT 06-07, 2026",
    timestamp: "11:45 PM IST",
    badge: "mint",
    location: "Cyber Arena Lab",
    highlight: "Continuous 24-hour LAN wargames",
  },
  {
    id: "gal-6",
    category: "KEYNOTE",
    title: "Valedictory Trophy & Cash Award Ceremony",
    subtitle: "KMCT Leadership & industry sponsors awarding ₹1,00,000+ prizes",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80",
    date: "OCT 07, 2026",
    timestamp: "05:30 PM IST",
    badge: "yellow",
    location: "Main Auditorium",
    highlight: "ASTRA 2026 Championship Trophy",
  },
  {
    id: "gal-7",
    category: "HANDS-ON LABS",
    title: "Vulnerability Scanning & Defensive Triage",
    subtitle: "Blue team threat hunting & incident response simulations",
    image: "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?auto=format&fit=crop&w=800&q=80",
    date: "OCT 06, 2026",
    timestamp: "02:15 PM IST",
    badge: "pink",
    location: "Dept Cyber Security Lab",
    highlight: "Live packet telemetry monitoring",
  },
  {
    id: "gal-8",
    category: "EXPO & HARDWARE",
    title: "Collegiate Cyber Security Research Expo",
    subtitle: "Peer-reviewed student research posters & live firmware rigs",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
    date: "OCT 07, 2026",
    timestamp: "01:00 PM IST",
    badge: "lime",
    location: "Innovation Gallery",
    highlight: "IEEE & ACM chapter evaluations",
  },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");

  const filteredItems = GALLERY_ITEMS.filter((item) => {
    return activeCategory === "ALL" || item.category === activeCategory;
  });

  return (
    <div className="min-h-screen bg-graph-paper pb-24">
      {/* ─── 1. TOP ANNOUNCEMENT TICKER ─── */}
      <div className="pt-20 sm:pt-24 pb-2">
        <MarqueeTicker
          items={[
            "ASTRA 2026 OFFICIAL MEDIA ARCHIVE",
            "OCTOBER 6 & 7, 2026",
            "KMCT CALICUT, KERALA",
            "24H CTF ARENA DISPATCHES",
            "ZERO-DAY CONCLAVE",
            "RESEARCH EXPO",
          ]}
          bgColor="#FFE816"
          textColor="#000000"
          speed={22}
        />
      </div>

      {/* ─── 2. HEADER BAR & BREADCRUMB ─── */}
      <section className="relative px-4 sm:px-8 py-6 max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-black bg-white border-2 border-black px-3 py-1.5 shadow-[2px_2px_0px_#000] hover:bg-th-yellow transition-colors"
            >
              ← Back to Home
            </Link>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-black bg-white border-2 border-black px-3 py-1.5 shadow-[2px_2px_0px_#000] hover:bg-th-pink transition-colors"
            >
              View Events Schedule (Oct 6-7) ↗
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <DotMatrixDisplay
              text="MEDIA LOG"
              subtext="KMCT.GALLERY"
              variant="green"
              status="VERIFIED"
            />
          </div>
        </div>

        {/* ─── 3. DEDICATED VISUAL STREAM CORRIDOR (CLEAN & ISOLATED) ─── */}
        <div className="relative rounded-2xl border-2 border-black overflow-hidden shadow-[6px_6px_0px_#000] bg-white mb-10">
          <div className="p-6 sm:p-8 border-b-2 border-black bg-[#FAFAFC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <StickerBadge color="yellow" rotation={-2}>
                  WARGAME STREAM
                </StickerBadge>
                <span className="font-mono text-xs bg-black text-white px-2 py-0.5 font-bold">
                  LIVE DISPATCH
                </span>
              </div>
              <h1 className="font-pixel text-3xl sm:text-5xl font-extrabold uppercase text-black">
                ARENA MOMENTS & MEDIA
              </h1>
              <p className="font-editorial italic text-xl sm:text-2xl text-gray-700 mt-1">
                Visual dispatches from the 24-hour CTF battle, hands-on labs, and keynotes.
              </p>
            </div>
            <div className="flex-shrink-0">
              <span className="font-mono text-xs text-gray-600 bg-white border-2 border-black px-3 py-1.5 shadow-[2px_2px_0px_#000]">
                TOTAL CAPTURES: 8 VERIFIED
              </span>
            </div>
          </div>

          {/* Clean 3D Image Corridor */}
          <div className="relative h-[280px] sm:h-[340px] md:h-[400px] w-full bg-[#F0F0FA]">
            <ImageStreamHero
              images={GALLERY_STREAM_IMAGES}
              cards={8}
              speed={22}
              axis={50}
              className="h-full w-full"
            />
          </div>
        </div>

        {/* ─── 4. INTERACTIVE CATEGORY FILTERS ─── */}
        <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_#000] mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-gray-500 uppercase flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5" /> Category:
              </span>
              {["ALL", "CTF WARGAMES", "HANDS-ON LABS", "KEYNOTE", "EXPO & HARDWARE"].map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`relative px-3.5 py-1.5 text-xs font-display font-bold border-2 border-black uppercase transition-colors cursor-pointer select-none ${
                      activeCategory === cat
                        ? "bg-th-pink text-black shadow-[2px_2px_0px_#000]"
                        : "bg-[#F0F0FA] text-black hover:bg-gray-100"
                    }`}
                  >
                    {activeCategory === cat && (
                      <motion.span
                        layoutId="activeGalleryCategoryTab"
                        className="absolute inset-0 bg-th-pink -z-10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    {cat}
                  </button>
                ),
              )}
            </div>
            <span className="font-mono text-xs text-gray-500">
              Showing {filteredItems.length} of {GALLERY_ITEMS.length} Photos
            </span>
          </div>
        </div>

        {/* ─── 5. PHOTO GALLERY GRID ─── */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              >
                <PixelFrame
                  dotGrid
                  cornerAccent
                  className="p-0 overflow-hidden group hover:translate-x-1 hover:-translate-y-1 transition-transform"
                >
                  {/* Photo Frame */}
                  <div className="relative aspect-[4/3] overflow-hidden border-b-2 border-black bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    {/* Floating Tags */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <StickerBadge color={item.badge} rotation={-2}>
                        {item.category}
                      </StickerBadge>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="font-mono text-[10px] bg-black text-white px-2 py-0.5 font-bold">
                        {item.timestamp}
                      </span>
                    </div>
                  </div>

                  {/* Photo Metadata Footer */}
                  <div className="p-5 bg-white space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-gray-500">
                      <span>📍 {item.location}</span>
                      <span className="font-bold text-black">{item.date}</span>
                    </div>
                    <h2 className="font-display font-bold text-lg sm:text-xl text-black group-hover:text-th-pink transition-colors">
                      {item.title}
                    </h2>
                    <p className="font-sans text-xs sm:text-sm text-gray-700 leading-relaxed">
                      {item.subtitle}
                    </p>
                    <div className="pt-2 border-t border-gray-200 flex items-center gap-1.5 text-xs font-mono text-green-700 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{item.highlight}</span>
                    </div>
                  </div>
                </PixelFrame>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* ─── 6. BOTTOM CTA CARD ─── */}
        <div className="mt-14">
          <PixelFrame dotGrid cornerAccent className="p-8 sm:p-10 bg-[#FFFEF0] text-center">
            <StickerBadge color="pink" rotation={-2}>
              ASTRA 2026 // OCTOBER 6 & 7
            </StickerBadge>
            <h2 className="font-pixel text-2xl sm:text-4xl font-extrabold uppercase text-black mt-3">
              EXPERIENCE THE ARENA IN PERSON
            </h2>
            <p className="font-editorial italic text-xl sm:text-2xl text-gray-800 mt-2 max-w-xl mx-auto">
              Join 500+ researchers, ethical hackers, and security engineers at KMCT Campus, Calicut.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
              <Link
                href="/events"
                className="px-6 py-3.5 bg-black text-white font-display font-bold text-xs uppercase tracking-wider border-2 border-black hover:bg-th-yellow hover:text-black transition-all shadow-[3px_3px_0px_#000]"
              >
                VIEW EVENTS SCHEDULE & PASSES →
              </Link>
              <Link
                href="/"
                className="px-6 py-3.5 bg-white text-black font-display font-bold text-xs uppercase tracking-wider border-2 border-black hover:bg-gray-100 transition-all shadow-[3px_3px_0px_#000]"
              >
                BACK TO HOMEPAGE ↗
              </Link>
            </div>
          </PixelFrame>
        </div>
      </section>
    </div>
  );
}
