"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MarqueeTicker } from "@/components/ui/MarqueeTicker";
import { StickerBadge } from "@/components/ui/StickerBadge";
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
          <div className="flex items-center gap-2 mb-3">
            <StickerBadge color="pink" rotation={-2}>SCHEDULE</StickerBadge>
            <span className="font-mono text-xs bg-black text-white px-2 py-0.5 font-bold">
              {events.length} EVENTS
            </span>
          </div>
          <h1 className="font-pixel text-3xl sm:text-5xl font-extrabold uppercase text-black">
            EVENT SCHEDULE &amp; REGISTRATION
          </h1>
          <p className="font-editorial italic text-xl sm:text-2xl text-gray-700 mt-1">
            Two days of hacking, research, and sovereign cyber defense.
          </p>
        </div>

        {/* Day Filter Tabs */}
        <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_#000] mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs font-bold text-gray-500 uppercase flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> DAY:
            </span>
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`relative px-3.5 py-1.5 text-xs font-display font-bold border-2 border-black uppercase transition-colors cursor-pointer select-none ${
                  activeDay === day
                    ? "bg-th-pink text-black shadow-[2px_2px_0px_#000]"
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
            <span className="ml-3 font-mono text-sm text-gray-500">Loading events...</span>
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
                          <span className="font-mono text-xs bg-black text-white px-2 py-0.5 font-bold">
                            {event.day}
                          </span>
                          {event.prize && (
                            <span className="font-mono text-xs bg-th-yellow text-black px-2 py-0.5 font-bold border border-black">
                              🏆 {event.prize}
                            </span>
                          )}
                        </div>
                        <h3 className="font-pixel text-xl sm:text-2xl font-bold uppercase text-black mb-2">
                          {event.title}
                        </h3>
                        <p className="font-sans text-sm text-gray-700 leading-relaxed mb-3">
                          {event.description}
                        </p>
                        <div className="flex flex-wrap gap-3 text-xs font-mono text-gray-600">
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
                          className={`font-pixel text-[10px] px-2 py-0.5 uppercase border border-black shadow-[1px_1px_0px_#000] ${
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

                        <span className="font-mono text-[10px] text-gray-500">
                          {event.registrationCount}/{event.registrationLimit} registered
                        </span>

                        {event.requiresPayment && (
                          <span className="font-mono text-xs font-bold text-black flex items-center gap-1">
                            <CreditCard className="w-3 h-3" /> ₹{event.paymentAmount}
                          </span>
                        )}

                        {event.isRegistrationOpen && event.registrationStatus !== "FULL" && event.backendId && (
                          <button
                            onClick={() => handleRegister(event)}
                            disabled={registering === event.backendId}
                            className="mt-1 px-4 py-2 bg-black text-white font-display font-bold text-xs uppercase tracking-wider border-2 border-black hover:bg-th-yellow hover:text-black transition-all shadow-[2px_2px_0px_#000] disabled:opacity-50 flex items-center gap-1.5"
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
                            <li key={i} className="flex items-center gap-2 text-xs font-sans text-gray-700">
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
            <p className="font-pixel text-xl text-gray-400">No events found for this filter.</p>
          </div>
        )}
      </section>
    </div>
  );
}


