"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  CheckCircle2,
  Sparkles,
  Ticket,
  Trophy,
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

interface DisplayEvent {
  id: number | string;
  backendId?: number;
  title: string;
  category: string;
  venue: string;
  time: string;
  duration?: string;
  event_date?: string;
  date: string;
  day?: string;
  image?: string;
  description?: string;
  prize?: string;
  isTeamEvent: boolean;
  teamSizeMin: number;
  teamSizeMax: number;
  requiresPayment: boolean;
  paymentAmount: string;
  isRegistrationOpen: boolean;
  registrationStatus: string;
  registrationLimit?: number;
  registrationCount?: number;
  content_blocks?: any[];
  coordinators?: any[];
  type: "IN-PERSON" | "HYBRID" | "VIRTUAL";
  badgeColor: string;
  highlights: string[];
}

function mapBackendEvent(ev: BackendEvent): DisplayEvent {
  const eventDate = new Date(ev.event_date);
  const dayNum = eventDate.getDate();
  const month = eventDate.toLocaleString("en-US", { month: "short" });
  const dayLabel = dayNum === 6 ? "Day 1" : dayNum === 7 ? "Day 2" : `Day`;

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
    time: eventDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
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
  const router = useRouter();
  const [events, setEvents] = useState<DisplayEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState<string>("ALL");
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
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
  const handleRegister = (event: DisplayEvent) => {
    const eventId = event.backendId || event.id;

    if (!user) {
      requireLogin({
        label: `Register for ${event.title}`,
        run: () => {
          router.push(`/register/${eventId}`);
        },
      });
      return;
    }

    router.push(`/register/${eventId}`);
  };

  // Derive unique categories and days
  const categories = useMemo(() => {
    const set = new Set(events.map((e) => e.category));
    return ["ALL", ...Array.from(set)];
  }, [events]);

  const days = ["ALL", "Day 1", "Day 2"];

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
    <div className="w-full relative bg-neutral-50/60 min-h-screen pt-24 sm:pt-28 pb-24 font-sans text-neutral-900">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 text-white text-xs font-medium shadow-sm mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>ASTRA 2026 Schedule &amp; Events</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-950">
            Events &amp; Workshops
          </h1>

          <p className="text-sm sm:text-base text-neutral-500 mt-2 max-w-2xl leading-relaxed">
            Explore keynote sessions, CTF wargames, expert workshops, and technical competitions. Select any event to review complete guidelines, rules, and registration options.
          </p>
        </div>

        {/* ─── FILTER & SEARCH CONTROL BAR ─── */}
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-4 sm:p-5 shadow-sm mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by event title, arena, or topic..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-900"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Day Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1 flex-shrink-0 mr-1">
                <Calendar className="w-3.5 h-3.5 text-neutral-500" /> Day:
              </span>
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                    activeDay === day
                      ? "bg-neutral-900 text-white shadow-sm font-semibold"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap pt-3 border-t border-neutral-100">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3 text-neutral-500" /> Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  activeCategory === cat
                    ? "bg-neutral-900 text-white shadow-sm font-semibold"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ─── LOADING STATE ─── */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-28 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-neutral-900" />
            <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">
              Loading event directory...
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

                return (
                  <motion.div
                    key={event.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col h-full bg-white rounded-3xl border border-neutral-200/80 shadow-sm hover:shadow-xl hover:border-neutral-300 hover:-translate-y-1 transition-all duration-300 group overflow-hidden cursor-pointer"
                    onClick={() => router.push(`/events/${event.backendId || event.id}`)}
                  >
                    {/* 1. Event Poster Container */}
                    <div className="relative aspect-[16/10] sm:aspect-[4/3] bg-neutral-950 overflow-hidden flex items-center justify-center">
                      {event.image ? (
                        <img
                          src={event.image}
                          alt={`${event.title} Poster`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="p-6 text-center text-white space-y-2">
                          <Sparkles className="w-8 h-8 text-amber-300 mx-auto" />
                          <p className="font-bold text-lg text-white">
                            {event.title}
                          </p>
                          <p className="text-xs text-neutral-400">
                            ASTRA 2026 • Official Session
                          </p>
                        </div>
                      )}

                      {/* Top Badges (Category + Day) */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-start pointer-events-none">
                        <span className="backdrop-blur-md bg-neutral-950/80 text-white border border-white/10 px-2.5 py-0.5 rounded-full text-[11px] font-medium shadow-sm">
                          {event.category}
                        </span>
                        {event.day && (
                          <span className="backdrop-blur-md bg-white/90 text-neutral-950 border border-neutral-200/60 px-2.5 py-0.5 rounded-full text-[11px] font-semibold shadow-sm">
                            {event.day}
                          </span>
                        )}
                      </div>

                      {/* Top Right Badges (Prize or Fee / Registered) */}
                      <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end pointer-events-none">
                        {isRegistered ? (
                          <span className="backdrop-blur-md bg-emerald-500/90 text-white px-2.5 py-0.5 rounded-full text-[11px] font-semibold shadow-sm flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Pass Ready
                          </span>
                        ) : event.prize ? (
                          <span className="backdrop-blur-md bg-amber-400/95 text-neutral-950 font-bold px-2.5 py-0.5 rounded-full text-[11px] shadow-sm flex items-center gap-1">
                            <Trophy className="w-3.5 h-3.5" /> {event.prize}
                          </span>
                        ) : (
                          <span className="backdrop-blur-md bg-white/90 text-neutral-950 border border-neutral-200/60 px-2.5 py-0.5 rounded-full text-[11px] font-semibold shadow-sm">
                            {event.requiresPayment ? `₹${event.paymentAmount}` : "FREE"}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 2. Card Content & Details */}
                    <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2.5">
                        {/* Title */}
                        <h3 className="text-lg sm:text-xl font-bold text-neutral-950 tracking-tight leading-snug group-hover:text-blue-600 transition-colors line-clamp-1">
                          {event.title}
                        </h3>

                        {/* Metadata Row */}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-neutral-400" /> {event.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-neutral-400" /> {event.time}
                          </span>
                          <span className="flex items-center gap-1 truncate max-w-[180px]">
                            <MapPin className="w-3.5 h-3.5 text-neutral-400" /> {event.venue}
                          </span>
                        </div>

                        {/* Description Snippet */}
                        {event.description && (
                          <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                            {event.description}
                          </p>
                        )}
                      </div>

                      {/* 3. Card Bottom Bar: Format, Slots, and Buttons */}
                      <div className="pt-3 border-t border-neutral-100 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1 text-neutral-500">
                            <Users className="w-3.5 h-3.5 text-neutral-400" />
                            {event.isTeamEvent
                              ? `Team (${event.teamSizeMin}-${event.teamSizeMax})`
                              : "Solo"}
                          </span>

                          <span
                            className={`px-2 py-0.5 text-[11px] font-medium rounded-full border ${
                              event.registrationStatus === "OPEN"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : event.registrationStatus === "FEW SLOTS"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : "bg-neutral-100 text-neutral-500 border-neutral-200"
                            }`}
                          >
                            {event.registrationStatus === "OPEN"
                              ? "● Open"
                              : event.registrationStatus === "FEW SLOTS"
                              ? "Few Slots Left"
                              : "Closed"}
                          </span>
                        </div>

                        {/* Action CTA Buttons */}
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <Link
                            href={`/events/${event.backendId || event.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="px-3 py-2 rounded-full border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-800 text-xs font-medium text-center transition-colors flex items-center justify-center"
                          >
                            Rules &amp; Intel
                          </Link>

                          {isRegistered ? (
                            <Link
                              href="/dashboard"
                              onClick={(e) => e.stopPropagation()}
                              className="px-3 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1 shadow-sm"
                            >
                              <Ticket className="w-3.5 h-3.5" />
                              <span>View Pass</span>
                            </Link>
                          ) : event.isRegistrationOpen && event.registrationStatus !== "FULL" ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRegister(event);
                              }}
                              className="px-3 py-2 rounded-full bg-neutral-900 hover:bg-black text-white text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                            >
                              <span>Register</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled
                              className="px-3 py-2 rounded-full bg-neutral-100 text-neutral-400 text-xs font-medium text-center cursor-not-allowed"
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
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-12 text-center shadow-sm my-8 space-y-3">
            <h2 className="text-xl font-bold text-neutral-950">
              No Events Found Matching Filters
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mx-auto">
              Try adjusting your search query or selecting a different category or day.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveDay("ALL");
                setActiveCategory("ALL");
              }}
              className="mt-2 px-5 py-2 rounded-full bg-neutral-900 text-white text-xs font-medium hover:bg-black transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
