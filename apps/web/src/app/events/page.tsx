"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MarqueeTicker } from "@/components/ui/MarqueeTicker";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast-context";
import api from "@/lib/api";
import {
  Calendar,
  Clock,
  MapPin,
  Filter,
  Search,
  ArrowRight,
  Users,
  Loader2,
  CreditCard,
  CheckCircle2,
  Sparkles,
  Ticket,
} from "lucide-react";
import { EventDetailModal, EventModalData } from "@/components/events/EventDetailModal";

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

interface DisplayEvent extends EventModalData {
  type: "IN-PERSON" | "HYBRID" | "VIRTUAL";
  badgeColor: string;
  highlights: string[];
}

function mapBackendEvent(ev: BackendEvent): DisplayEvent {
  const eventDate = new Date(ev.event_date);
  const dayNum = eventDate.getDate();
  const month = eventDate.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const dayLabel = dayNum === 6 ? "DAY 1" : dayNum === 7 ? "DAY 2" : `DAY`;

  const remaining = ev.registration_limit - (ev.registration_count || 0);
  let status = "OPEN";
  if (!ev.is_registration_open) status = "CLOSED";
  else if (remaining <= 0) status = "FULL";
  else if (remaining <= 10) status = "FEW SLOTS";

  const cat = (ev.category || "OTHER").toUpperCase();

  return {
    id: ev.id,
    backendId: ev.id,
    day: dayLabel,
    date: `${month} ${String(dayNum).padStart(2, "0")}`,
    time: ev.time || eventDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    duration: ev.duration || "2 Hours",
    title: ev.title,
    category: cat,
    venue: ev.venue || "Campus Venue",
    type: "IN-PERSON",
    badgeColor: cat === "FLAGSHIP CTF" ? "pink" : cat === "COMPETITION" ? "yellow" : "lime",
    description: ev.description || "",
    highlights: ev.content_blocks?.map((b: any) => b.title || b.content).filter(Boolean) || [],
    registrationStatus: status,
    isTeamEvent: ev.is_team_event,
    teamSizeMin: ev.team_size_min || 1,
    teamSizeMax: ev.team_size_max || 1,
    requiresPayment: ev.requires_payment,
    paymentAmount: ev.payment_amount || "0.00",
    isRegistrationOpen: ev.is_registration_open,
    registrationLimit: ev.registration_limit || 100,
    registrationCount: ev.registration_count || 0,
    prize: ev.prize || "",
    image: ev.image || "",
    content_blocks: ev.content_blocks || [],
    coordinators: ev.coordinators || [],
  };
}

export default function EventsPage() {
  const [events, setEvents] = useState<DisplayEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState<string>("ALL");
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<DisplayEvent | null>(null);
  const [userRegisteredEventIds, setUserRegisteredEventIds] = useState<Set<number>>(new Set());

  const { user, requireLogin, token } = useAuth();
  const { showToast } = useToast();

  // 1. Fetch Events
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

  // 2. Fetch User's Existing Registrations
  useEffect(() => {
    if (token) {
      const fetchUserRegistrations = async () => {
        try {
          const res = await api.get("/api/my-registrations/");
          if (Array.isArray(res.data)) {
            const registeredIds = new Set<number>(
              res.data.map((r: any) => r.event_details?.id || r.event)
            );
            setUserRegisteredEventIds(registeredIds);
          }
        } catch {
          // silently handle
        }
      };
      fetchUserRegistrations();
    } else {
      setUserRegisteredEventIds(new Set());
    }
  }, [token]);

  // Handle Register Action
  const handleRegister = (event: EventModalData) => {
    const eventId = event.backendId || event.id;

    if (!user) {
      requireLogin({
        label: `Register for ${event.title}`,
        run: () => {
          window.location.href = `/register/${eventId}`;
        },
      });
      return;
    }

    window.location.href = `/register/${eventId}`;
  };

  // Derive unique categories and days
  const categories = useMemo(() => {
    const set = new Set(events.map((e) => e.category));
    return ["ALL", ...Array.from(set)];
  }, [events]);

  const days = ["ALL", "DAY 1", "DAY 2"];

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchesDay = activeDay === "ALL" || e.day === activeDay;
      const matchesCategory = activeCategory === "ALL" || e.category === activeCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDay && matchesCategory && matchesSearch;
    });
  }, [events, activeDay, activeCategory, searchQuery]);

  return (
    <div className="w-full relative bg-graph-paper min-h-screen pb-20">
      {/* ─── MARQUEE TICKER HEADER ─── */}
      <div className="pt-20 sm:pt-24">
        <MarqueeTicker
          items={[
            "ASTRA 2026 // CYBER SECURITY ASSOCIATION",
            "OCT 6 & 7 — KMCT CALICUT",
            "WARGAMES • HACKATHONS • CTF • PAPER PRESENTATION",
            "CLICK ANY EVENT TO VIEW RULES & REGISTER",
          ]}
        />
      </div>

      {/* ─── MAIN EVENT DIRECTORY ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Section */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-xs font-bold bg-[#FFE816] text-black border-2 border-black px-2.5 py-0.5 uppercase shadow-[2px_2px_0px_#000]">
              WARGAMES DIRECTORY
            </span>
            <span className="font-mono text-xs bg-black text-white px-2 py-0.5 font-bold uppercase">
              {events.length} TOTAL SESSIONS
            </span>
          </div>

          <h1 className="font-anton text-4xl sm:text-6xl uppercase text-black tracking-tight leading-none mb-3">
            EVENT POSTERS &amp; DETAILS
          </h1>

          <p className="font-editorial italic text-xl sm:text-2xl text-gray-700 max-w-3xl">
            Explore all symposium events, tournaments, and wargames. Select any event to review the full poster, comprehensive rules, guidelines, and registration options.
          </p>
        </div>

        {/* ─── FILTER & SEARCH CONTROL BAR ─── */}
        <div className="bg-white border-2 border-black p-4 sm:p-5 shadow-[4px_4px_0px_#000] mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events, topics, arena..."
                className="w-full pl-10 pr-4 py-2 border-2 border-black font-mono text-xs text-black placeholder:text-gray-400 focus:outline-none focus:bg-[#FFFEE5] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] text-gray-400 hover:text-black uppercase"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Day Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <span className="font-mono text-xs font-bold text-gray-500 uppercase flex items-center gap-1 flex-shrink-0 mr-1">
                <Calendar className="w-3.5 h-3.5 text-black" /> DAY:
              </span>
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={`px-3 py-1.5 text-xs font-display font-bold border-2 border-black uppercase transition-colors cursor-pointer select-none whitespace-nowrap ${
                    activeDay === day
                      ? "bg-black text-white shadow-[2px_2px_0px_#FFE816]"
                      : "bg-[#F0F0FA] text-black hover:bg-gray-100"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-black/10">
            <span className="font-mono text-[11px] font-bold text-gray-500 uppercase flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3 text-black" /> CATEGORY:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 text-[11px] font-mono font-bold uppercase transition-colors cursor-pointer select-none border border-black ${
                  activeCategory === cat
                    ? "bg-[#FFE816] text-black shadow-[2px_2px_0px_#000]"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ─── LOADING STATE ─── */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-28 space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-black" />
            <p className="font-mono text-sm uppercase tracking-wider text-gray-600">
              Loading symposium directory...
            </p>
          </div>
        )}

        {/* ─── EVENT POSTERS GRID ─── */}
        {!loading && (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch"
          >
            <AnimatePresence mode="popLayout">
              {filteredEvents.map((event) => {
                const isRegistered = userRegisteredEventIds.has(Number(event.backendId || event.id));
                const eventWithReg = { ...event, isUserRegistered: isRegistered };

                return (
                  <motion.div
                    key={event.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                    className="flex flex-col h-full bg-white border-2 border-black shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:-translate-y-1 transition-all duration-200 group overflow-hidden cursor-pointer"
                    onClick={() => setSelectedEvent(eventWithReg)}
                  >
                    {/* 1. Event Poster Container */}
                    <div className="relative aspect-[3/4] bg-black overflow-hidden border-b-2 border-black flex items-center justify-center">
                      {event.image ? (
                        <img
                          src={event.image}
                          alt={`${event.title} Poster`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="p-6 text-center text-white space-y-2">
                          <Sparkles className="w-8 h-8 text-[#FFE816] mx-auto" />
                          <p className="font-anton text-2xl uppercase tracking-wider text-white">
                            {event.title}
                          </p>
                          <p className="font-mono text-[10px] text-gray-400 uppercase">
                            ASTRA 2026 // POSTER COMING SOON
                          </p>
                        </div>
                      )}

                      {/* Top Badges (Category + Day) */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start pointer-events-none">
                        <span className="font-mono text-[10px] font-bold bg-[#FFE816] text-black border border-black px-2 py-0.5 uppercase shadow-[2px_2px_0px_#000]">
                          {event.category}
                        </span>
                        {event.day && (
                          <span className="font-mono text-[10px] font-bold bg-white text-black border border-black px-2 py-0.5 uppercase shadow-[2px_2px_0px_#000]">
                            {event.day}
                          </span>
                        )}
                      </div>

                      {/* Top Right Badges (Prize or Fee) */}
                      <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end pointer-events-none">
                        {event.prize ? (
                          <span className="font-mono text-[10px] font-bold bg-black text-[#FFE816] border border-black px-2 py-0.5 uppercase shadow-[2px_2px_0px_#FFE816]">
                            🏆 {event.prize}
                          </span>
                        ) : (
                          <span className="font-mono text-[10px] font-bold bg-white text-black border border-black px-2 py-0.5 uppercase shadow-[2px_2px_0px_#000]">
                            {event.requiresPayment ? `₹${event.paymentAmount}` : "FREE"}
                          </span>
                        )}

                        {isRegistered && (
                          <span className="font-pixel text-[9px] bg-[#C3FF16] text-black border border-black px-2 py-0.5 font-bold uppercase shadow-[2px_2px_0px_#000] flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> REGISTERED
                          </span>
                        )}
                      </div>

                      {/* Hover Overlay Cue */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4 pointer-events-none">
                        <span className="bg-[#FFE816] text-black font-display text-xs font-bold px-4 py-2 border-2 border-black shadow-[3px_3px_0px_#000] uppercase tracking-wider flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                          <span>VIEW RULES &amp; DETAILS</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>

                    {/* 2. Card Content & Details */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2.5">
                        {/* Title */}
                        <h3 className="font-anton text-2xl sm:text-3xl uppercase text-black tracking-tight leading-tight group-hover:text-blue-700 transition-colors">
                          {event.title}
                        </h3>

                        {/* Metadata Row */}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-[11px] text-gray-700">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-black" /> {event.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-black" /> {event.time}
                          </span>
                          <span className="flex items-center gap-1 truncate">
                            <MapPin className="w-3 h-3 text-black" /> {event.venue}
                          </span>
                        </div>

                        {/* Description Snippet */}
                        {event.description && (
                          <p className="font-sans text-xs text-gray-700 line-clamp-2 leading-relaxed">
                            {event.description}
                          </p>
                        )}
                      </div>

                      {/* 3. Card Bottom Bar: Format, Slots, and Buttons */}
                      <div className="pt-3 border-t border-black/10 space-y-3">
                        <div className="flex items-center justify-between font-mono text-[11px]">
                          <span className="flex items-center gap-1 text-gray-600">
                            <Users className="w-3.5 h-3.5 text-black" />
                            {event.isTeamEvent
                              ? `Team (${event.teamSizeMin}-${event.teamSizeMax})`
                              : "Solo Participant"}
                          </span>

                          <span
                            className={`px-1.5 py-0.5 text-[9px] font-pixel uppercase font-bold border border-black ${
                              event.registrationStatus === "OPEN"
                                ? "bg-emerald-100 text-emerald-900"
                                : event.registrationStatus === "FEW SLOTS"
                                ? "bg-yellow-100 text-yellow-900"
                                : "bg-red-100 text-red-900"
                            }`}
                          >
                            {event.registrationStatus}
                          </span>
                        </div>

                        {/* Action CTA Buttons */}
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEvent(eventWithReg);
                            }}
                            className="px-2.5 py-2 bg-[#F0F0FA] text-black font-display font-bold text-[11px] uppercase tracking-wider border-2 border-black hover:bg-black hover:text-white transition-colors text-center"
                          >
                            Rules &amp; Intel
                          </button>

                          {isRegistered ? (
                            <a
                              href="/dashboard"
                              onClick={(e) => e.stopPropagation()}
                              className="px-2.5 py-2 bg-[#C3FF16] text-black font-display font-bold text-[11px] uppercase tracking-wider border-2 border-black hover:bg-th-yellow transition-colors text-center flex items-center justify-center gap-1"
                            >
                              <Ticket className="w-3 h-3" /> Pass
                            </a>
                          ) : event.isRegistrationOpen && event.registrationStatus !== "FULL" ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRegister(event);
                              }}
                              className="px-2.5 py-2 bg-[#FFE816] text-black font-display font-bold text-[11px] uppercase tracking-wider border-2 border-black hover:bg-black hover:text-white transition-colors text-center flex items-center justify-center gap-1"
                            >
                              <span>Register</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled
                              className="px-2.5 py-2 bg-gray-200 text-gray-400 font-display font-bold text-[11px] uppercase border-2 border-gray-300 text-center cursor-not-allowed"
                            >
                              Closed
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ─── EMPTY STATE ─── */}
        {!loading && filteredEvents.length === 0 && (
          <div className="bg-white border-2 border-black p-12 text-center shadow-[4px_4px_0px_#000] my-8 space-y-3">
            <p className="font-anton text-2xl uppercase text-black">
              No Events Found Matching Filters
            </p>
            <p className="font-mono text-xs text-gray-600">
              Try adjusting your search query or selecting a different category/day.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveDay("ALL");
                setActiveCategory("ALL");
              }}
              className="mt-3 px-4 py-2 bg-black text-white font-mono text-xs uppercase font-bold hover:bg-[#FFE816] hover:text-black transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* ─── EVENT DETAILS & RULES MODAL ─── */}
      <EventDetailModal
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onRegister={handleRegister}
        isLoggedIn={!!user}
      />
    </div>
  );
}
