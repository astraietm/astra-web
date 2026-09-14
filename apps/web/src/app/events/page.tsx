"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MarqueeTicker } from "@/components/ui/MarqueeTicker";
import { StickerBadge } from "@/components/ui/StickerBadge";
import { BlackBanner } from "@/components/ui/BlackBanner";
import { DotMatrixDisplay } from "@/components/ui/DotMatrixDisplay";
import { PixelFrame } from "@/components/ui/PixelFrame";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast-context";
import api from "@/lib/api";
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
  Users,
  Loader2,
  CreditCard,
} from "lucide-react";

// Backend Event type matching Django serializer
interface BackendEvent {
  id: number;
  title: string;
  description: string;
  event_date: string;
  venue: string;
  image: string;
  category: string;
  time: string;
  duration: string;
  registration_start: string;
  registration_end: string;
  registration_limit: number;
  is_registration_open: boolean;
  is_team_event: boolean;
  team_size_min: number;
  team_size_max: number;
  requires_payment: boolean;
  payment_amount: string;
  content_blocks: any[];
  coordinators: any[];
  prize: string;
  registration_count: number;
}

// Display event type for the UI
interface DisplayEvent {
  id: number | string;
  day: string;
  date: string;
  time: string;
  title: string;
  category: string;
  venue: string;
  type: "IN-PERSON" | "HYBRID" | "VIRTUAL";
  badgeColor: "pink" | "yellow" | "lime" | "mint" | "lilac";
  description: string;
  highlights: string[];
  registrationStatus: string;
  isTeamEvent: boolean;
  teamSizeMin: number;
  teamSizeMax: number;
  requiresPayment: boolean;
  paymentAmount: string;
  isRegistrationOpen: boolean;
  registrationLimit: number;
  registrationCount: number;
  backendId?: number;
  prize: string;
}

const categoryColors: Record<string, "pink" | "yellow" | "lime" | "mint" | "lilac"> = {
  "FLAGSHIP CTF": "pink",
  KEYNOTE: "yellow",
  WORKSHOP: "lime",
  "RESEARCH EXPO": "mint",
  "GRAND FINALE": "lilac",
  CTF: "pink",
  HACKATHON: "pink",
  SEMINAR: "yellow",
  WORKSHOP_: "lime",
};

const categoryIcons: Record<string, React.ReactNode> = {
  KEYNOTE: <Shield className="w-4 h-4" />,
  WORKSHOP: <Terminal className="w-4 h-4" />,
  "FLAGSHIP CTF": <Code className="w-4 h-4" />,
  CTF: <Code className="w-4 h-4" />,
  "RESEARCH EXPO": <Award className="w-4 h-4" />,
  "GRAND FINALE": <Award className="w-4 h-4" />,
};

function mapBackendEvent(ev: BackendEvent): DisplayEvent {
  const eventDate = new Date(ev.event_date);
  const day = eventDate.getDate();
  const month = eventDate.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const dayLabel = day === 6 ? "DAY 1" : day === 7 ? "DAY 2" : `DAY`;

  const remaining = ev.registration_limit - ev.registration_count;
  let status = "OPEN";
  if (!ev.is_registration_open) status = "CLOSED";
  else if (remaining <= 0) status = "FULL";
  else if (remaining <= 10) status = "FEW SLOTS";

  const cat = (ev.category || "").toUpperCase();

  return {
    id: ev.id,
    backendId: ev.id,
    day: dayLabel,
    date: `${month} ${String(day).padStart(2, "0")}`,
    time: ev.time || eventDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    title: ev.title,
    category: cat,
    venue: ev.venue,
    type: "IN-PERSON",
    badgeColor: categoryColors[cat] || "yellow",
    description: ev.description,
    highlights: ev.content_blocks?.map((b: any) => b.title || b.content).filter(Boolean) || [],
    registrationStatus: status,
    isTeamEvent: ev.is_team_event,
    teamSizeMin: ev.team_size_min,
    teamSizeMax: ev.team_size_max,
    requiresPayment: ev.requires_payment,
    paymentAmount: ev.payment_amount,
    isRegistrationOpen: ev.is_registration_open,
    registrationLimit: ev.registration_limit,
    registrationCount: ev.registration_count,
    prize: ev.prize || "",
  };
}

export default function EventsPage() {
  const [events, setEvents] = useState<DisplayEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState<string>("ALL");
  const [expandedEvent, setExpandedEvent] = useState<string | number | null>(null);
  const [registering, setRegistering] = useState<number | null>(null);

  const { user, requireLogin, token } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/api/events/");
        const mapped = (res.data as BackendEvent[]).map(mapBackendEvent);
        setEvents(mapped);
      } catch {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = activeDay === "ALL" ? events : events.filter((e) => e.day === activeDay);
  const days = ["ALL", ...Array.from(new Set(events.map((e) => e.day)))];

  const handleRegister = (event: DisplayEvent) => {
    if (!event.backendId) {
      showToast("This event is not yet available for online registration.", "info");
      return;
    }

    if (!user) {
      requireLogin({
        label: `Register for ${event.title}`,
        run: () => {
          window.location.href = `/register/${event.backendId}`;
        },
      });
      return;
    }

    window.location.href = `/register/${event.backendId}`;
  };

  return (
    <div className="w-full relative bg-graph-paper min-h-screen">
      {/* ─── MARQUEE TICKER HEADER ─── */}
      <div className="pt-20 sm:pt-24">
        <MarqueeTicker
          items={[
            "ASTRA 2026 // NATIONAL CYBER SECURITY SYMPOSIUM",
            "OCT 6 & 7 — KMCT CALICUT",
            "24H NATIONAL CTF WARGAMES",
            "REGISTER NOW",
          ]}
        />
      </div>

      {/* ─── MAIN EVENT SCHEDULE SECTION ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        {/* Section Header */}
        <div className="mb-8">
          <BlackBanner size="lg">UPCOMING SYMPOSIUM EVENTS</BlackBanner>
          <p className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-black mt-3 font-normal leading-tight">
            Two days of hacking, research, and sovereign cyber defense at KMCT Calicut.
          </p>
        </div>

        {/* Day Filter Tabs */}
        <div className="bg-white border-2 border-black p-4 mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-pixel text-[10px] text-gray-500 uppercase flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> DAY:
            </span>
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`relative px-3.5 py-1.5 text-xs font-body font-bold border-2 border-black uppercase transition-colors cursor-pointer select-none ${
                  activeDay === day
                    ? "bg-th-pink text-black"
                    : "bg-[#F0F0FA] text-black hover:bg-gray-100"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            <span className="ml-3 font-body text-sm text-gray-500 font-medium">Loading events...</span>
          </div>
        )}

        {/* Event Cards */}
        <motion.div layout className="space-y-6">
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((event) => (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              >
                <PixelFrame dotGrid cornerAccent className="p-0 overflow-hidden group">
                  {/* Event Card Header */}
                  <div className="p-5 sm:p-6 border-b-2 border-black bg-white">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <StickerBadge color={event.badgeColor} rotation={-2}>
                            {event.category}
                          </StickerBadge>
                          <span className="font-pixel text-[10px] bg-black text-white px-2 py-0.5 uppercase">
                            {event.day}
                          </span>
                          {event.prize && (
                            <span className="font-pixel text-[10px] bg-th-yellow text-black px-2 py-0.5 border border-black uppercase">
                              🏆 {event.prize}
                            </span>
                          )}
                        </div>
                        <h3 className="font-display text-2xl sm:text-3xl font-normal uppercase text-black mb-2 leading-none">
                          {event.title}
                        </h3>
                        <p className="font-body text-sm text-gray-700 leading-relaxed mb-3">
                          {event.description}
                        </p>
                        <div className="flex flex-wrap gap-3 text-xs font-body text-gray-600 font-medium">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" /> {event.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {event.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" /> {event.venue}
                          </span>
                          {event.isTeamEvent && (
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5" /> Team ({event.teamSizeMin}-{event.teamSizeMax})
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Registration Actions */}
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <span
                          className={`font-pixel text-[10px] px-2 py-0.5 uppercase border border-black ${
                            event.registrationStatus === "OPEN"
                              ? "bg-emerald-100 text-emerald-800"
                              : event.registrationStatus === "FEW SLOTS"
                              ? "bg-yellow-100 text-yellow-800"
                              : event.registrationStatus === "FULL" || event.registrationStatus === "CLOSED"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {event.registrationStatus}
                        </span>

                        <span className="font-body text-[11px] text-gray-500 font-medium">
                          {event.registrationCount}/{event.registrationLimit} registered
                        </span>

                        {event.requiresPayment && (
                          <span className="font-body text-xs font-bold text-black flex items-center gap-1">
                            <CreditCard className="w-3 h-3" /> ₹{event.paymentAmount}
                          </span>
                        )}

                        {event.isRegistrationOpen && event.registrationStatus !== "FULL" && event.backendId && (
                          <button
                            onClick={() => handleRegister(event)}
                            disabled={registering === event.backendId}
                            className="mt-1 px-4 py-2 bg-black text-white font-body font-bold text-xs uppercase tracking-wider border-2 border-black hover:bg-th-yellow hover:text-black transition-all disabled:opacity-50 flex items-center gap-1.5"
                          >
                            {registering === event.backendId ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" /> REGISTERING...
                              </>
                            ) : (
                              <>
                                <ArrowRight className="w-3.5 h-3.5" /> REGISTER NOW
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Highlights */}
                    {event.highlights.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {event.highlights.slice(0, 4).map((h, i) => (
                            <li key={i} className="flex items-center gap-2 text-xs font-body text-gray-700">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                              {h}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </PixelFrame>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {!loading && filteredEvents.length === 0 && (
          <div className="text-center py-16">
            <p className="font-body text-lg text-gray-500">No events found for this filter.</p>
          </div>
        )}
      </section>

      {/* ─── PASS REGISTRATION TIERS ─── */}
      <section id="pass-registration" className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="mb-8 text-center">
          <BlackBanner size="md">SELECT YOUR EVENT ACCESS PASS</BlackBanner>
          <p className="font-serif italic text-2xl sm:text-3xl text-black mt-3 font-normal">
            Free entry for verified students and researchers. Limited on-site lab workstations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pass 1: Student Delegate */}
          <PixelFrame dotGrid cornerAccent className="flex flex-col justify-between">
            <div>
              <StickerBadge color="yellow" rotation={-2}>ALL ACCESS</StickerBadge>
              <h3 className="font-display text-2xl sm:text-3xl uppercase mt-3 leading-none">STUDENT DELEGATE PASS</h3>
              <p className="font-body text-xs text-gray-700 mt-2 leading-relaxed">
                Full physical access to keynotes, research expo, keynote halls, and networking mixers.
              </p>
              <div className="my-4 pt-4 border-t border-black/10">
                <p className="font-display text-4xl text-black leading-none">FREE</p>
                <p className="font-body text-[11px] text-gray-500">Requires valid college ID</p>
              </div>
              <ul className="space-y-2 text-xs font-body text-gray-800 mb-6">
                <li className="flex items-center gap-2">✓ Keynote &amp; session access</li>
                <li className="flex items-center gap-2">✓ Certificate of Participation</li>
                <li className="flex items-center gap-2">✓ Delegate physical kit</li>
              </ul>
            </div>
            <Link
              href="/events"
              className="w-full text-center block px-4 py-3 bg-black text-white font-body font-bold text-xs uppercase tracking-wider hover:bg-th-yellow hover:text-black border-2 border-black transition-colors"
            >
              REGISTER DELEGATE PASS →
            </Link>
          </PixelFrame>

          {/* Pass 2: CTF Squad */}
          <PixelFrame dotGrid cornerAccent className="flex flex-col justify-between bg-[#FFFEF0] ring-2 ring-black">
            <div>
              <div className="flex items-center justify-between">
                <StickerBadge color="pink" rotation={2}>COMPETITIVE</StickerBadge>
                <span className="font-pixel text-[10px] bg-red-600 text-white px-2 py-0.5 uppercase">
                  FLAGSHIP
                </span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl uppercase mt-3 leading-none">24H CTF SQUAD PASS</h3>
              <p className="font-body text-xs text-gray-700 mt-2 leading-relaxed">
                Team registration (1-4 members) for the 24-hour national jeopardy &amp; attack-defense tournament.
              </p>
              <div className="my-4 pt-4 border-t border-black/10">
                <p className="font-display text-4xl text-black leading-none">₹60K POOL</p>
                <p className="font-body text-[11px] text-gray-500">Free squad registration</p>
              </div>
              <ul className="space-y-2 text-xs font-body text-gray-800 mb-6">
                <li className="flex items-center gap-2">✓ 24H dedicated Arena seating &amp; power</li>
                <li className="flex items-center gap-2">✓ High-speed LAN portal credentials</li>
                <li className="flex items-center gap-2">✓ Midnight pizza &amp; refreshment supply</li>
                <li className="flex items-center gap-2">✓ Direct bounty eligibility</li>
              </ul>
            </div>
            <Link
              href="/events"
              className="w-full text-center block px-4 py-3 bg-th-pink text-black font-body font-bold text-xs uppercase tracking-wider border-2 border-black hover:bg-black hover:text-white transition-all"
            >
              REGISTER CTF SQUAD →
            </Link>
          </PixelFrame>

          {/* Pass 3: Workshop */}
          <PixelFrame dotGrid cornerAccent className="flex flex-col justify-between">
            <div>
              <StickerBadge color="lime" rotation={-2}>HANDS-ON</StickerBadge>
              <h3 className="font-display text-2xl sm:text-3xl uppercase mt-3 leading-none">WORKSHOP &amp; LAB PASS</h3>
              <p className="font-body text-xs text-gray-700 mt-2 leading-relaxed">
                Guaranteed workstation access for the Binary Reverse Engineering masterclass.
              </p>
              <div className="my-4 pt-4 border-t border-black/10">
                <p className="font-display text-4xl text-black leading-none">LIMITED</p>
                <p className="font-body text-[11px] text-gray-500">60 Lab Workstations Only</p>
              </div>
              <ul className="space-y-2 text-xs font-body text-gray-800 mb-6">
                <li className="flex items-center gap-2">✓ Pre-configured Ghidra / GDB lab rig</li>
                <li className="flex items-center gap-2">✓ Exploitation challenge targets</li>
                <li className="flex items-center gap-2">✓ Verified skill certification</li>
              </ul>
            </div>
            <Link
              href="/events"
              className="w-full text-center block px-4 py-3 bg-black text-white font-body font-bold text-xs uppercase tracking-wider hover:bg-th-lime hover:text-black border-2 border-black transition-colors"
            >
              RESERVE LAB WORKSTATION →
            </Link>
          </PixelFrame>
        </div>
      </section>

      {/* ─── VENUE & CONTACT ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-6 pb-16">
        <PixelFrame dotGrid cornerAccent className="p-8 sm:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <StickerBadge color="yellow" rotation={-2}>VENUE &amp; LOGISTICS</StickerBadge>
              <h3 className="font-pixel text-2xl sm:text-3xl font-bold uppercase mt-3">
                KMCT INSTITUTE OF EMERGING TECHNOLOGY &amp; MANAGEMENT
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
            <div className="border-2 border-black p-6 bg-[#F0F0FA] flex flex-col justify-between">
              <div>
                <p className="font-mono text-xs font-bold uppercase text-black mb-2">
                  NEED SPONSORSHIP OR HOSTEL ACCOMMODATION?
                </p>
                <p className="font-sans text-xs text-gray-700 mb-4">
                  Outstation collegiate teams can request hostel accommodation on campus during the 24-hour CTF period.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-block text-center px-4 py-3 bg-black text-white font-display font-bold text-xs uppercase tracking-wider hover:bg-th-yellow hover:text-black border-2 border-black transition-colors"
              >
                REQUEST ACCOMMODATION / DETAILS →
              </Link>
            </div>
          </div>
        </PixelFrame>
      </section>
    </div>
  );
}


