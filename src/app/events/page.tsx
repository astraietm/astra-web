"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MarqueeTicker } from "@/components/ui/MarqueeTicker";
import { StickerBadge } from "@/components/ui/StickerBadge";
import { BlackBanner } from "@/components/ui/BlackBanner";
import { DotMatrixDisplay } from "@/components/ui/DotMatrixDisplay";
import { PixelFrame } from "@/components/ui/PixelFrame";
import {
  Calendar,
  Clock,
  MapPin,
  Shield,
  Terminal,
  Award,
  Filter,
  CheckCircle2,
  Code,
  Lock,
  ArrowRight,
} from "lucide-react";

interface DetailedEvent {
  id: string;
  day: "DAY 1" | "DAY 2";
  date: string;
  time: string;
  title: string;
  category: "FLAGSHIP CTF" | "KEYNOTE" | "WORKSHOP" | "RESEARCH EXPO" | "GRAND FINALE";
  icon: React.ReactNode;
  venue: string;
  type: "IN-PERSON" | "HYBRID";
  bounty?: string;
  badgeColor: "pink" | "yellow" | "lime" | "mint" | "lilac";
  description: string;
  highlights: string[];
  prerequisites?: string;
  registrationStatus: "OPEN" | "FEW SLOTS" | "CLOSING SOON";
}

const ALL_EVENTS: DetailedEvent[] = [
  {
    id: "ev-keynote",
    day: "DAY 1",
    date: "OCT 06",
    time: "09:30 AM — 11:00 AM IST",
    title: "Sovereign Digital Frontiers: Zero-Day Threat Landscapes",
    category: "KEYNOTE",
    icon: <Shield className="w-4 h-4" />,
    venue: "Main Auditorium, KMCT Campus",
    type: "IN-PERSON",
    badgeColor: "yellow",
    description:
      "Inaugural conclave with national cyber defense chiefs dissecting AI-augmented offensive vectors and sovereign cybersecurity resilience.",
    highlights: [
      "Keynote address by CERT-In & Defense advisors",
      "Official inauguration of ASTRA 2026 & Cyber Security Labs",
      "Release of collegiate threat intelligence paper",
    ],
    registrationStatus: "OPEN",
  },
  {
    id: "ev-workshop-ghidra",
    day: "DAY 1",
    date: "OCT 06",
    time: "11:30 AM — 02:00 PM IST",
    title: "Advanced Binary Exploitation & Memory Corruption with Ghidra",
    category: "WORKSHOP",
    icon: <Terminal className="w-4 h-4" />,
    venue: "Advanced Computing Lab 1, Dept of Cyber Security",
    type: "IN-PERSON",
    badgeColor: "pink",
    description:
      "Hands-on masterclass dissecting Linux x86_64 ELF binaries, bypassing modern mitigations (ASLR, NX, Stack Canaries), and weaponizing payload chains.",
    highlights: [
      "Mentored by senior reverse engineering analysts",
      "Live interactive vulnerability solving scoreboard",
      "Certificate of Mastery from Dept of Cyber Security",
    ],
    prerequisites: "Basic C / x86 Assembly knowledge & Laptop with Linux",
    registrationStatus: "FEW SLOTS",
  },
  {
    id: "ev-ctf-wargames",
    day: "DAY 1",
    date: "OCT 06 - OCT 07",
    time: "03:00 PM (OCT 06) — 03:00 PM (OCT 07)",
    title: "ASTRA 24-Hour National CTF: Jeopardy & Attack/Defense Arena",
    category: "FLAGSHIP CTF",
    icon: <Code className="w-4 h-4" />,
    venue: "Cyber Arena Lab + Online CTFd Portal",
    type: "HYBRID",
    bounty: "₹60,000 CASH POOL + CERTIFICATIONS",
    badgeColor: "lime",
    description:
      "The flagship 24-hour wargame battlefield. Continuous challenges across Web Exploitation, Reverse Engineering, Pwn, Cryptography, and Hardware Hacking.",
    highlights: [
      "Real-time scoreboard with first-blood bonus flags",
      "Live physical Attack-Defense finals for Top 8 teams",
      "Fast-track internship allocations for standout hackers",
    ],
    prerequisites: "Teams of 1-4 collegiate security researchers",
    registrationStatus: "OPEN",
  },
  {
    id: "ev-research-expo",
    day: "DAY 2",
    date: "OCT 07",
    time: "10:00 AM — 01:30 PM IST",
    title: "National Cyber Security Project Exhibition & Paper Presentation",
    category: "RESEARCH EXPO",
    icon: <Lock className="w-4 h-4" />,
    venue: "Innovation Gallery, KMCT Institute",
    type: "IN-PERSON",
    bounty: "₹25,000 BEST RESEARCH GRANT",
    badgeColor: "lilac",
    description:
      "Showcase of student & faculty prototypes in IoT security, automotive CAN bus defense, cryptographic protocols, and automated malware analysis.",
    highlights: [
      "Reviewed by IEEE / ACM Cyber Security chapter jury",
      "Best papers nominated for national indexed proceedings",
      "Live interactive hardware testbed demonstrations",
    ],
    registrationStatus: "OPEN",
  },
  {
    id: "ev-grand-finale",
    day: "DAY 2",
    date: "OCT 07",
    time: "04:00 PM — 06:30 PM IST",
    title: "Valedictory, Bounty Prize Distribution & Cyber Network Conclave",
    category: "GRAND FINALE",
    icon: <Award className="w-4 h-4" />,
    venue: "Main Auditorium, KMCT Campus",
    type: "IN-PERSON",
    bounty: "TROPHIES, MEDALS & CREDENTIALS",
    badgeColor: "mint",
    description:
      "The celebratory grand finale. Announcement of CTF champions, distribution of ₹1,00,000+ total prizes, industry mixer, and high tea.",
    highlights: [
      "Championship trophy presentation by KMCT leadership",
      "Networking high-tea with 20+ cybersecurity founders and CTOs",
      "Awarding of ASTRA 2026 fellowship badges",
    ],
    registrationStatus: "OPEN",
  },
];

export default function EventsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [activeDay, setActiveDay] = useState<string>("ALL");

  const filteredEvents = ALL_EVENTS.filter((ev) => {
    const matchesCategory =
      activeCategory === "ALL" || ev.category === activeCategory;
    const matchesDay =
      activeDay === "ALL" ||
      (activeDay === "DAY 1" && ev.day === "DAY 1") ||
      (activeDay === "DAY 2" && ev.day === "DAY 2");
    return matchesCategory && matchesDay;
  });

  return (
    <div className="min-h-screen bg-graph-paper pb-24">
      {/* ─── 1. TOP ANNOUNCEMENT TICKER ─── */}
      <div className="pt-20 sm:pt-24 pb-2">
        <MarqueeTicker
          items={[
            "ASTRA 2026 OFFICIAL EVENT SCHEDULE",
            "OCTOBER 6 & 7, 2026",
            "KMCT CALICUT, KERALA",
            "₹1,00,000+ BOUNTY POOL",
            "24H NATIONAL CTF",
            "BINARY EXPLOITATION LAB",
            "ZERO-DAY SYMPOSIUM",
          ]}
          bgColor="#F79CFF"
          textColor="#000000"
          speed={24}
        />
      </div>

      {/* ─── 2. CLEAN HERO BOX (NO COLLIDING 3D ANIMATION) ─── */}
      <section className="relative px-4 sm:px-8 py-6 max-w-7xl mx-auto">
        {/* Navigation & Status Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-black bg-white border-2 border-black px-3 py-1.5 shadow-[2px_2px_0px_#000] hover:bg-th-yellow transition-colors"
            >
              ← Back to Home
            </Link>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-black bg-white border-2 border-black px-3 py-1.5 shadow-[2px_2px_0px_#000] hover:bg-th-pink transition-colors"
            >
              View Photo Gallery ↗
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <DotMatrixDisplay
              text="EVENT MATRIX"
              subtext="OCT 6-7, 2026"
              variant="pink"
              status="LIVE"
            />
          </div>
        </div>

        {/* Clean Neo-Brutalist Hero Card */}
        <div className="relative rounded-2xl border-2 border-black overflow-hidden shadow-[6px_6px_0px_#000] bg-white p-6 sm:p-12 md:p-14">
          {/* Subtle Dot Grid Background */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
            aria-hidden="true"
          />

          {/* Top Row: Badges */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-8">
            <div className="flex flex-wrap gap-2">
              <StickerBadge color="yellow" rotation={-2}>
                OCT 6 & 7, 2026
              </StickerBadge>
              <StickerBadge color="lime" rotation={2}>
                KMCT IETM CALICUT
              </StickerBadge>
              <StickerBadge color="pink" rotation={-1}>
                DEPT OF CYBER SECURITY
              </StickerBadge>
            </div>
            <div>
              <span className="font-mono text-xs bg-black text-white px-3 py-1 font-bold">
                [ PORTAL: ASTRA.EV ]
              </span>
            </div>
          </div>

          {/* Center Main Content */}
          <div className="relative z-10 text-center max-w-4xl mx-auto py-4 sm:py-8">
            <p className="font-pixel text-xs sm:text-sm uppercase tracking-widest text-gray-600 mb-3">
              [ CALICUT, KERALA // OCTOBER 6 & 7, 2026 ]
            </p>
            <h1 className="font-pixel text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-black uppercase leading-none select-none">
              ASTRA <span className="text-stroke">EVENTS</span>
            </h1>
            <p className="font-editorial italic text-2xl sm:text-3xl md:text-4xl text-black mt-4 max-w-2xl mx-auto leading-tight">
              Two days of wargames, zero-day research, binary reverse engineering, and sovereign cyber defense.
            </p>

            {/* CTA Buttons Row */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              <a
                href="#schedule-list"
                className="px-6 py-3.5 bg-black text-white font-display font-bold text-xs uppercase tracking-wider border-2 border-black hover:bg-th-pink hover:text-black transition-all shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
              >
                EXPLORE SCHEDULE ↓
              </a>
              <a
                href="#pass-registration"
                className="px-6 py-3.5 bg-th-yellow text-black font-display font-bold text-xs uppercase tracking-wider border-2 border-black hover:bg-black hover:text-white transition-all shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
              >
                CLAIM EVENT PASS →
              </a>
              <Link
                href="/gallery"
                className="px-6 py-3.5 bg-white text-black font-display font-bold text-xs uppercase tracking-wider border-2 border-black hover:bg-gray-100 transition-all shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5"
              >
                OPEN GALLERY ↗
              </Link>
            </div>
          </div>

          {/* Bottom Info Strip */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-6 mt-6 border-t-2 border-black/10 text-xs font-mono text-black/80">
            <div className="flex flex-wrap items-center gap-4">
              <span>⚡ 5 MAJOR TRACKS</span>
              <span>🏆 ₹1,00,000+ BOUNTIES</span>
              <span>🎓 CERT-IN & IEEE RECOGNIZED</span>
            </div>
            <div className="text-right">
              <span>HOSTED @ KMCT CAMPUS, CALICUT</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. STATS STRIP WITH PIXEL FRAMES & DOT MATRIX ACCENTS ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <PixelFrame dotGrid cornerAccent className="text-center">
            <span className="font-mono text-[10px] text-gray-500 font-bold block uppercase">
              NON-STOP BATTLE
            </span>
            <p className="font-pixel text-3xl sm:text-4xl font-extrabold text-black mt-1">24H</p>
            <p className="font-editorial italic text-xs sm:text-sm text-gray-600">
              National CTF Arena
            </p>
          </PixelFrame>
          <PixelFrame dotGrid cornerAccent className="text-center">
            <span className="font-mono text-[10px] text-gray-500 font-bold block uppercase">
              TOTAL POOL
            </span>
            <p className="font-pixel text-3xl sm:text-4xl font-extrabold text-black mt-1">₹1.0L+</p>
            <p className="font-editorial italic text-xs sm:text-sm text-gray-600">
              Bounties & Prizes
            </p>
          </PixelFrame>
          <PixelFrame dotGrid cornerAccent className="text-center">
            <span className="font-mono text-[10px] text-gray-500 font-bold block uppercase">
              DELEGATES
            </span>
            <p className="font-pixel text-3xl sm:text-4xl font-extrabold text-black mt-1">500+</p>
            <p className="font-editorial italic text-xs sm:text-sm text-gray-600">
              Security Researchers
            </p>
          </PixelFrame>
          <PixelFrame dotGrid cornerAccent className="text-center">
            <span className="font-mono text-[10px] text-gray-500 font-bold block uppercase">
              CONCLAVE DATES
            </span>
            <p className="font-pixel text-3xl sm:text-4xl font-extrabold text-black mt-1">OCT 6-7</p>
            <p className="font-editorial italic text-xs sm:text-sm text-gray-600">
              Calicut, Kerala
            </p>
          </PixelFrame>
        </div>
      </section>

      {/* ─── 4. EVENT DIRECTORY & INTERACTIVE FILTER ─── */}
      <section id="schedule-list" className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <BlackBanner size="md">EVENT DIRECTORY & TRACKS</BlackBanner>
            <p className="font-editorial italic text-xl sm:text-2xl text-black mt-3">
              Filter by date or specialization to plan your participation.
            </p>
          </div>
          <div className="flex-shrink-0">
            <DotMatrixDisplay
              text="LIVE SLOTS"
              subtext="ALL SESSIONS"
              variant="green"
              status="OCT 06-07"
            />
          </div>
        </div>

        {/* Clean Filter Controls Bar */}
        <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_#000] mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Day Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-gray-500 uppercase flex items-center gap-1 mr-1">
                <Calendar className="w-3.5 h-3.5" /> Day:
              </span>
              {["ALL", "DAY 1", "DAY 2"].map((d) => (
                <button
                  key={d}
                  onClick={() => setActiveDay(d)}
                  className={`relative px-3.5 py-1.5 text-xs font-display font-bold border-2 border-black uppercase transition-colors cursor-pointer select-none ${
                    activeDay === d
                      ? "text-white bg-black shadow-[2px_2px_0px_#000]"
                      : "bg-[#F0F0FA] text-black hover:bg-gray-100"
                  }`}
                >
                  {activeDay === d && (
                    <motion.span
                      layoutId="activeDayTab"
                      className="absolute inset-0 bg-black -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {d === "ALL" ? "All Days" : d === "DAY 1" ? "Day 1 (Oct 6)" : "Day 2 (Oct 7)"}
                </button>
              ))}
            </div>

            {/* Track Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-gray-500 uppercase flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5" /> Track:
              </span>
              {["ALL", "FLAGSHIP CTF", "KEYNOTE", "WORKSHOP", "RESEARCH EXPO", "GRAND FINALE"].map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`relative px-3 py-1.5 text-xs font-display font-bold border-2 border-black uppercase transition-colors cursor-pointer select-none ${
                      activeCategory === cat
                        ? "bg-th-pink text-black shadow-[2px_2px_0px_#000]"
                        : "bg-[#F0F0FA] text-black hover:bg-gray-100"
                    }`}
                  >
                    {activeCategory === cat && (
                      <motion.span
                        layoutId="activeCategoryTab"
                        className="absolute inset-0 bg-th-pink -z-10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    {cat}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Streamlined Event Cards Grid with Motion */}
        <motion.div layout className="space-y-6">
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((event) => (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              >
                <PixelFrame
                  dotGrid
                  cornerAccent
                  className="hover:translate-x-1 transition-transform"
                >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                {/* Left Info Column */}
                <div className="flex-1">
                  {/* Badges Bar */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <StickerBadge color={event.badgeColor} rotation={0}>
                      {event.category}
                    </StickerBadge>
                    <span className="font-mono text-xs font-bold bg-black text-white px-2.5 py-0.5">
                      {event.day} ({event.date})
                    </span>
                    <span className="font-mono text-xs border-2 border-black px-2 py-0.5 bg-white font-bold">
                      {event.type}
                    </span>
                    {event.bounty && (
                      <span className="font-mono text-xs font-bold bg-th-yellow text-black border-2 border-black px-2.5 py-0.5">
                        🏆 {event.bounty}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h2 className="font-display font-extrabold text-xl sm:text-2xl md:text-3xl text-black mb-2">
                    {event.title}
                  </h2>

                  {/* Time & Venue */}
                  <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-mono text-gray-700 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-black" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-black" />
                      <span>{event.venue}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="font-sans text-sm sm:text-base text-gray-800 leading-relaxed mb-4">
                    {event.description}
                  </p>

                  {/* Key Highlights */}
                  <div className="bg-white border-2 border-black p-4 mb-2">
                    <p className="font-mono text-xs font-bold uppercase text-gray-600 mb-2">
                      SESSION DELIVERABLES:
                    </p>
                    <ul className="space-y-1.5">
                      {event.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs sm:text-sm font-sans text-gray-800">
                          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                    {event.prerequisites && (
                      <p className="font-mono text-[11px] text-red-600 mt-2 pt-2 border-t border-gray-200">
                        ⚡ PREREQUISITES: {event.prerequisites}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Action Column */}
                <div className="lg:w-60 flex flex-col justify-between items-stretch lg:border-l-2 lg:border-black lg:pl-6 gap-4">
                  <div>
                    <div className="p-3 text-center border-2 border-black bg-[#FAFAFC] mb-2">
                      <span className="font-mono text-[10px] text-gray-500 uppercase block font-bold">
                        REGISTRATION
                      </span>
                      <span
                        className={`font-pixel text-lg font-bold ${
                          event.registrationStatus === "FEW SLOTS"
                            ? "text-red-600"
                            : "text-green-700"
                        }`}
                      >
                        {event.registrationStatus}
                      </span>
                    </div>
                    <p className="font-mono text-[10px] text-gray-500 text-center">
                      Dept of Cyber Security
                    </p>
                  </div>

                  <div className="space-y-2">
                    <a
                      href="#pass-registration"
                      className="w-full text-center block px-4 py-3 bg-black text-white font-display font-bold text-xs uppercase tracking-wider border-2 border-black hover:bg-th-pink hover:text-black transition-all shadow-[2px_2px_0px_#000]"
                    >
                      CLAIM PASS →
                    </a>
                    <a
                      href={`mailto:cybersecurity@kmct.edu.in?subject=ASTRA 2026: ${encodeURIComponent(
                        event.title,
                      )}`}
                      className="w-full text-center block px-4 py-2 bg-white text-black font-mono text-xs border-2 border-black hover:bg-gray-100 transition-colors"
                    >
                      Inquire / Help
                    </a>
                  </div>
                </div>
              </div>
            </PixelFrame>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  </section>

      {/* ─── 5. TWO-DAY MASTER SCHEDULE TIMELINE ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="mb-8 text-center">
          <BlackBanner size="md">TWO-DAY MASTER SCHEDULE (OCT 6 - 7)</BlackBanner>
          <p className="font-editorial italic text-2xl text-black mt-3 max-w-2xl mx-auto">
            Plan your physical presence at the KMCT Institute campus in Calicut.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* DAY 1 COLUMN */}
          <PixelFrame dotGrid cornerAccent className="p-6 sm:p-8">
            <div className="flex items-center justify-between border-b-2 border-black pb-4 mb-6">
              <div>
                <StickerBadge color="yellow" rotation={-2}>DAY 01</StickerBadge>
                <h3 className="font-pixel text-2xl font-bold uppercase mt-2">TUESDAY, OCT 06</h3>
              </div>
              <DotMatrixDisplay text="OCT 06" subtext="DAY 1" variant="dark" />
            </div>

            <div className="space-y-4">
              <div className="border-l-2 border-black pl-4 py-1">
                <span className="font-mono text-xs font-bold text-gray-500">08:30 AM — 09:30 AM</span>
                <p className="font-display font-bold text-base text-black">Delegate Kit & CTF Badge Verification</p>
                <p className="font-mono text-xs text-gray-600">Central Registration Desk, KMCT Campus</p>
              </div>
              <div className="border-l-2 border-th-pink pl-4 py-1 bg-white/70 p-2">
                <span className="font-mono text-xs font-bold text-pink-700">09:30 AM — 11:00 AM</span>
                <p className="font-display font-bold text-base text-black">Inaugural Conclave & Threat Horizon Keynote</p>
                <p className="font-mono text-xs text-gray-600">Main Auditorium // CERT-In Keynote</p>
              </div>
              <div className="border-l-2 border-black pl-4 py-1">
                <span className="font-mono text-xs font-bold text-gray-500">11:30 AM — 02:00 PM</span>
                <p className="font-display font-bold text-base text-black">Reverse Engineering & Ghidra Workshop</p>
                <p className="font-mono text-xs text-gray-600">Advanced Lab 1 (Hands-on binary triage)</p>
              </div>
              <div className="border-l-2 border-th-lime pl-4 py-1 bg-th-lime/20 p-2">
                <span className="font-mono text-xs font-bold text-black">03:00 PM SHARP</span>
                <p className="font-display font-bold text-base text-black">ASTRA 24H National CTF Begins!</p>
                <p className="font-mono text-xs text-gray-700">Cyber Arena Lab + Online Portal (Live Flag Hunt)</p>
              </div>
              <div className="border-l-2 border-black pl-4 py-1">
                <span className="font-mono text-xs font-bold text-gray-500">08:00 PM — 11:00 PM</span>
                <p className="font-display font-bold text-base text-black">Midnight Hack & CTF Lightning Rounds</p>
                <p className="font-mono text-xs text-gray-600">Special speed-flags with spot bounty bonuses</p>
              </div>
            </div>
          </PixelFrame>

          {/* DAY 2 COLUMN */}
          <PixelFrame dotGrid cornerAccent className="p-6 sm:p-8">
            <div className="flex items-center justify-between border-b-2 border-black pb-4 mb-6">
              <div>
                <StickerBadge color="pink" rotation={2}>DAY 02</StickerBadge>
                <h3 className="font-pixel text-2xl font-bold uppercase mt-2">WEDNESDAY, OCT 07</h3>
              </div>
              <DotMatrixDisplay text="OCT 07" subtext="DAY 2" variant="dark" />
            </div>

            <div className="space-y-4">
              <div className="border-l-2 border-black pl-4 py-1">
                <span className="font-mono text-xs font-bold text-gray-500">09:00 AM — 10:00 AM</span>
                <p className="font-display font-bold text-base text-black">Morning Triage & CTF Leaderboard Freeze</p>
                <p className="font-mono text-xs text-gray-600">Final challenge releases for top 10 contenders</p>
              </div>
              <div className="border-l-2 border-th-lilac pl-4 py-1 bg-white/70 p-2">
                <span className="font-mono text-xs font-bold text-purple-700">10:00 AM — 01:30 PM</span>
                <p className="font-display font-bold text-base text-black">National Cyber Security Project Exhibition</p>
                <p className="font-mono text-xs text-gray-600">Innovation Gallery // Hardware & Software Demos</p>
              </div>
              <div className="border-l-2 border-black pl-4 py-1">
                <span className="font-mono text-xs font-bold text-red-600">03:00 PM SHARP</span>
                <p className="font-display font-bold text-base text-black">ASTRA 24H CTF WarGames Ends (Flag Closes)</p>
                <p className="font-mono text-xs text-gray-600">Jury verification of exploit proof-of-concepts</p>
              </div>
              <div className="border-l-2 border-th-mint pl-4 py-1 bg-th-mint/30 p-2">
                <span className="font-mono text-xs font-bold text-emerald-800">04:00 PM — 06:30 PM</span>
                <p className="font-display font-bold text-base text-black">Grand Valedictory & Prize Distribution</p>
                <p className="font-mono text-xs text-gray-700">Main Auditorium // Trophy Presentation & High-Tea</p>
              </div>
            </div>
          </PixelFrame>
        </div>
      </section>

      {/* ─── 6. PASS REGISTRATION TIERS ─── */}
      <section id="pass-registration" className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="mb-8 text-center">
          <BlackBanner size="md">SELECT YOUR EVENT ACCESS PASS</BlackBanner>
          <p className="font-editorial italic text-2xl text-black mt-3">
            Free entry for verified students and researchers. Limited on-site lab workstations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pass 1 */}
          <PixelFrame dotGrid cornerAccent className="flex flex-col justify-between">
            <div>
              <StickerBadge color="yellow" rotation={-2}>ALL ACCESS</StickerBadge>
              <h3 className="font-pixel text-xl font-bold uppercase mt-3">STUDENT DELEGATE PASS</h3>
              <p className="font-sans text-xs text-gray-700 mt-2">
                Full physical access to keynotes, research expo, keynote halls, and networking mixers.
              </p>
              <div className="my-4 pt-4 border-t border-black/10">
                <p className="font-pixel text-3xl font-bold text-black">FREE</p>
                <p className="font-mono text-[10px] text-gray-500">Requires valid college ID</p>
              </div>
              <ul className="space-y-2 text-xs font-sans text-gray-800 mb-6">
                <li className="flex items-center gap-2">✓ Keynote & Conclave access</li>
                <li className="flex items-center gap-2">✓ Certificate of Participation</li>
                <li className="flex items-center gap-2">✓ Delegate physical kit</li>
              </ul>
            </div>
            <a
              href="mailto:cybersecurity@kmct.edu.in?subject=Registration: Student Delegate Pass"
              className="w-full text-center block px-4 py-3 bg-black text-white font-display font-bold text-xs uppercase tracking-wider hover:bg-th-yellow hover:text-black border-2 border-black transition-colors"
            >
              REGISTER DELEGATE PASS →
            </a>
          </PixelFrame>

          {/* Pass 2: CTF WARGAMES PASS */}
          <PixelFrame dotGrid cornerAccent className="flex flex-col justify-between bg-[#FFFEF0] ring-2 ring-black">
            <div>
              <div className="flex items-center justify-between">
                <StickerBadge color="pink" rotation={2}>COMPETITIVE</StickerBadge>
                <span className="font-mono text-[10px] bg-red-600 text-white px-2 py-0.5 font-bold">
                  FLAGSHIP
                </span>
              </div>
              <h3 className="font-pixel text-xl font-bold uppercase mt-3">24H CTF SQUAD PASS</h3>
              <p className="font-sans text-xs text-gray-700 mt-2">
                Team registration (1-4 members) for the 24-hour national jeopardy & attack-defense tournament.
              </p>
              <div className="my-4 pt-4 border-t border-black/10">
                <p className="font-pixel text-3xl font-bold text-black">₹60K POOL</p>
                <p className="font-mono text-[10px] text-gray-500">Free squad registration</p>
              </div>
              <ul className="space-y-2 text-xs font-sans text-gray-800 mb-6">
                <li className="flex items-center gap-2">✓ 24H dedicated Arena seating & power</li>
                <li className="flex items-center gap-2">✓ High-speed LAN portal credentials</li>
                <li className="flex items-center gap-2">✓ Midnight pizza & refreshment supply</li>
                <li className="flex items-center gap-2">✓ Direct bounty eligibility</li>
              </ul>
            </div>
            <a
              href="mailto:cybersecurity@kmct.edu.in?subject=Registration: CTF Squad Team"
              className="w-full text-center block px-4 py-3 bg-th-pink text-black font-display font-bold text-xs uppercase tracking-wider border-2 border-black hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_#000]"
            >
              REGISTER CTF SQUAD →
            </a>
          </PixelFrame>

          {/* Pass 3 */}
          <PixelFrame dotGrid cornerAccent className="flex flex-col justify-between">
            <div>
              <StickerBadge color="lime" rotation={-2}>HANDS-ON</StickerBadge>
              <h3 className="font-pixel text-xl font-bold uppercase mt-3">WORKSHOP & LAB PASS</h3>
              <p className="font-sans text-xs text-gray-700 mt-2">
                Guaranteed workstation access for the Binary Reverse Engineering masterclass.
              </p>
              <div className="my-4 pt-4 border-t border-black/10">
                <p className="font-pixel text-3xl font-bold text-black">LIMITED</p>
                <p className="font-mono text-[10px] text-gray-500">60 Lab Workstations Only</p>
              </div>
              <ul className="space-y-2 text-xs font-sans text-gray-800 mb-6">
                <li className="flex items-center gap-2">✓ Pre-configured Ghidra / GDB lab rig</li>
                <li className="flex items-center gap-2">✓ Exploitation challenge targets</li>
                <li className="flex items-center gap-2">✓ Verified skill certification</li>
              </ul>
            </div>
            <a
              href="mailto:cybersecurity@kmct.edu.in?subject=Registration: Lab Workshop Pass"
              className="w-full text-center block px-4 py-3 bg-black text-white font-display font-bold text-xs uppercase tracking-wider hover:bg-th-lime hover:text-black border-2 border-black transition-colors"
            >
              RESERVE LAB WORKSTATION →
            </a>
          </PixelFrame>
        </div>
      </section>

      {/* ─── 7. VENUE & CONTACT ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
        <PixelFrame dotGrid cornerAccent className="p-8 sm:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <StickerBadge color="yellow" rotation={-2}>VENUE & LOGISTICS</StickerBadge>
              <h3 className="font-pixel text-2xl sm:text-3xl font-bold uppercase mt-3">
                KMCT INSTITUTE OF EMERGING TECHNOLOGY & MANAGEMENT
              </h3>
              <p className="font-editorial italic text-xl text-gray-800 mt-2">
                Department of Cyber Security, Manassery PO, Mukkam, Calicut, Kerala — 673602.
              </p>
              <div className="space-y-2 font-mono text-xs text-gray-600 mt-4">
                <p>📍 28 km from Calicut Railway Station (CLT)</p>
                <p>✈️ 35 km from Calicut International Airport (CCJ)</p>
                <p>📞 Coordinator Hotline: +91 94470 00000 / 0495 2288500</p>
                <p>✉️ Email: cybersecurity@kmct.edu.in</p>
              </div>
            </div>
            <div className="border-2 border-black p-6 bg-[#F0F0FA] flex flex-col justify-between shadow-[3px_3px_0px_#000]">
              <div>
                <p className="font-mono text-xs font-bold uppercase text-black mb-2">
                  NEED SPONSORSHIP OR HOSTEL ACCOMMODATION?
                </p>
                <p className="font-sans text-xs text-gray-700 mb-4">
                  Outstation collegiate teams can request hostel accommodation on campus during the 24-hour CTF period.
                </p>
              </div>
              <a
                href="mailto:cybersecurity@kmct.edu.in?subject=ASTRA 2026 Accommodation Request"
                className="inline-block text-center px-4 py-3 bg-black text-white font-display font-bold text-xs uppercase tracking-wider hover:bg-th-yellow hover:text-black border-2 border-black transition-colors"
              >
                REQUEST ACCOMMODATION / DETAILS →
              </a>
            </div>
          </div>
        </PixelFrame>
      </section>
    </div>
  );
}
