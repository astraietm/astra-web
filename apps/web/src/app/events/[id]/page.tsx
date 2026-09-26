"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast-context";
import api from "@/lib/api";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Award,
  CreditCard,
  CheckCircle2,
  ShieldAlert,
  ArrowLeft,
  ArrowRight,
  Maximize2,
  Phone,
  User,
  Sparkles,
  Ticket,
  Share2,
  Loader2,
  X,
  Trophy,
  Check,
} from "lucide-react";

interface EventDetailData {
  id: number;
  title: string;
  description: string;
  event_date: string;
  venue: string;
  image: string;
  category: string;
  time: string;
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

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params?.id as string;

  const { user, requireLogin, token } = useAuth();
  const { showToast } = useToast();

  const [event, setEvent] = useState<EventDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "rules" | "prizes">("overview");
  const [showFullPoster, setShowFullPoster] = useState(false);
  const [isUserRegistered, setIsUserRegistered] = useState(false);

  // Fetch Event Details
  useEffect(() => {
    if (!eventId) return;

    const fetchEventDetail = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/events/${eventId}/`);
        setEvent(res.data);
      } catch (err: any) {
        console.error("Failed to fetch event detail:", err);
        setError("Failed to load event details. The event may not exist.");
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetail();
  }, [eventId]);

  // Check if current user is registered
  useEffect(() => {
    if (token && eventId) {
      const checkRegistration = async () => {
        try {
          const res = await api.get("/api/my-registrations/");
          if (Array.isArray(res.data)) {
            const hasRegistered = res.data.some(
              (r: any) => String(r.event_details?.id || r.event) === String(eventId)
            );
            setIsUserRegistered(hasRegistered);
          }
        } catch {
          // silently handle
        }
      };
      checkRegistration();
    } else {
      setIsUserRegistered(false);
    }
  }, [token, eventId]);

  // Share Event
  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      showToast("Event link copied to clipboard!", "success");
    }
  };

  // Register Click
  const handleRegisterClick = () => {
    if (!event) return;

    if (!user) {
      requireLogin({
        label: `Register for ${event.title}`,
        run: () => {
          router.push(`/register/${event.id}`);
        },
      });
      return;
    }

    router.push(`/register/${event.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 max-w-5xl mx-auto flex items-center justify-center bg-neutral-50/60 font-sans">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-neutral-900" />
          <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">
            Loading Event Details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 max-w-3xl mx-auto text-center bg-neutral-50/60 font-sans">
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 sm:p-12 shadow-sm space-y-4">
          <h2 className="text-2xl font-bold text-neutral-950">Event Not Found</h2>
          <p className="text-sm text-neutral-500">{error || "Event details are unavailable."}</p>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 bg-neutral-900 text-white px-6 py-2.5 rounded-full text-xs font-medium hover:bg-black transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Events</span>
          </Link>
        </div>
      </div>
    );
  }

  // Formatting date & time
  const eventDateObj = new Date(event.event_date);
  const dayNum = eventDateObj.getDate();
  const month = eventDateObj.toLocaleString("en-US", { month: "short" });
  const formattedDate = `${month} ${String(dayNum).padStart(2, "0")}, 2026`;
  const formattedTime = eventDateObj.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const dayLabel = dayNum === 6 ? "Day 1" : dayNum === 7 ? "Day 2" : "Day";

  // Capacity & Status
  const remainingSlots = event.registration_limit - (event.registration_count || 0);
  let registrationStatus = "OPEN";
  if (!event.is_registration_open) registrationStatus = "CLOSED";
  else if (remainingSlots <= 0) registrationStatus = "FULL";
  else if (remainingSlots <= 10) registrationStatus = "FEW SLOTS";

  // Structured Rules
  const getEventRules = () => {
    if (event.content_blocks && event.content_blocks.length > 0) {
      return event.content_blocks;
    }

    return [
      {
        title: "Eligibility & Verification",
        items: [
          "Open to all actively enrolled undergraduate and postgraduate college students.",
          "Every participant must carry their official institutional ID card along with their digital ticket pass.",
          "Spot entries are strictly subject to seat availability on the day of the event.",
        ],
      },
      {
        title: event.is_team_event ? `Team Format & Composition` : `Individual Participation`,
        items: event.is_team_event
          ? [
              `Teams must consist of ${event.team_size_min} to ${event.team_size_max} registered members.`,
              "Inter-departmental and inter-collegiate teams are warmly permitted.",
              "All team members must complete individual registration and cite the exact team name.",
            ]
          : [
              "This is a solo competition. Collaborating or sharing solutions with other participants is strictly forbidden.",
              "Participants must complete all challenge milestones independently.",
            ],
      },
      {
        title: "Venue & Reporting Rules",
        items: [
          `Participants must report to ${event.venue || "the designated arena"} at least 20 minutes prior to scheduled start time (${formattedTime}).`,
          "Late arrivals may forfeit initial game rounds or lead to automatic disqualification without refund.",
          "Participants are required to bring their own laptops, chargers, and any required accessories/tools.",
        ],
      },
      {
        title: "Fair Play & Code of Conduct",
        items: [
          "Zero-tolerance policy for tampering with event infrastructure, network sniffing, or unauthorized system access.",
          "Any attempt at plagiarism, reverse-engineering scoring bots, or disruptive conduct will lead to immediate expulsion.",
          "The decision of the technical panel, judges, and event coordinators will be final and binding.",
        ],
      },
    ];
  };

  const rulesList = getEventRules();

  return (
    <div className="w-full relative bg-neutral-50/60 min-h-screen pt-24 sm:pt-28 pb-24 font-sans text-neutral-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation / Back Bar */}
        <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-neutral-200 bg-white text-xs font-medium text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 transition-all shadow-sm select-none"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Events</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400 font-medium">
              Event #{event.id}
            </span>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 bg-white text-xs font-medium text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-sm cursor-pointer"
              title="Share event link"
            >
              <Share2 className="w-3.5 h-3.5 text-neutral-500" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* ─── MAIN EVENT CARD (FULL PAGE LAYOUT) ─── */}
        <div className="bg-white rounded-3xl border border-neutral-200/80 shadow-sm overflow-hidden">
          {/* Top Bar Label */}
          <div className="flex items-center justify-between px-6 sm:px-8 py-4 border-b border-neutral-100 bg-neutral-50/50">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-neutral-900 text-white shadow-sm">
                ASTRA 2026
              </span>
              <span className="text-xs font-semibold text-neutral-700">
                {event.category}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  registrationStatus === "OPEN"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : registrationStatus === "FEW SLOTS"
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-neutral-100 text-neutral-500 border-neutral-200"
                }`}
              >
                {registrationStatus === "OPEN"
                  ? "● Open"
                  : registrationStatus === "FEW SLOTS"
                  ? "Few Slots Left"
                  : "Closed"}
              </span>

              {isUserRegistered && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-600 text-white shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Registered
                </span>
              )}
            </div>
          </div>

          {/* Event Showcase: Poster + Info Grid */}
          <div className="p-6 sm:p-8 md:p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* Event Poster Showcase (5 Columns) */}
              <div className="md:col-span-5 relative group">
                <div className="relative rounded-2xl border border-neutral-200/80 bg-neutral-950 shadow-sm overflow-hidden aspect-[3/4] max-h-[500px] mx-auto w-full flex items-center justify-center">
                  {event.image ? (
                    <>
                      <img
                        src={event.image}
                        alt={`${event.title} Poster`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <button
                        onClick={() => setShowFullPoster(true)}
                        type="button"
                        className="absolute bottom-3 right-3 backdrop-blur-md bg-neutral-950/80 hover:bg-neutral-950 text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all shadow-md cursor-pointer border border-white/10"
                      >
                        <Maximize2 className="w-3.5 h-3.5 text-amber-300" />
                        <span>View Poster</span>
                      </button>
                    </>
                  ) : (
                    <div className="p-8 text-center text-white space-y-3">
                      <Sparkles className="w-10 h-10 text-amber-300 mx-auto" />
                      <p className="font-bold text-xl text-white">
                        {event.title}
                      </p>
                      <p className="text-xs text-neutral-400">
                        ASTRA 2026 Official Session
                      </p>
                    </div>
                  )}

                  {/* Badges on Poster */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-start pointer-events-none">
                    <span className="backdrop-blur-md bg-neutral-950/80 text-white border border-white/10 px-2.5 py-0.5 rounded-full text-[11px] font-medium shadow-sm">
                      {event.category}
                    </span>
                    <span className="backdrop-blur-md bg-white/90 text-neutral-950 border border-neutral-200/60 px-2.5 py-0.5 rounded-full text-[11px] font-semibold shadow-sm">
                      {dayLabel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Event Info & Metadata (7 Columns) */}
              <div className="md:col-span-7 space-y-5">
                {/* Title & Prize Badge */}
                <div className="space-y-2">
                  {event.prize && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 text-amber-900 border border-amber-400/30 text-xs font-semibold">
                      <Trophy className="w-3.5 h-3.5 text-amber-600" />
                      <span>Prize Pool: {event.prize}</span>
                    </div>
                  )}

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-950 tracking-tight leading-tight">
                    {event.title}
                  </h1>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="bg-neutral-50/70 rounded-2xl border border-neutral-200/70 p-3.5">
                    <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium mb-1">
                      <Calendar className="w-3.5 h-3.5 text-neutral-600" /> Date &amp; Time
                    </div>
                    <p className="text-xs font-semibold text-neutral-900">
                      {formattedDate}
                    </p>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      {formattedTime}
                    </p>
                  </div>

                  <div className="bg-neutral-50/70 rounded-2xl border border-neutral-200/70 p-3.5">
                    <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium mb-1">
                      <MapPin className="w-3.5 h-3.5 text-neutral-600" /> Venue / Arena
                    </div>
                    <p className="text-xs font-semibold text-neutral-900 truncate">
                      {event.venue || "Campus Venue"}
                    </p>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      KMCT Calicut
                    </p>
                  </div>

                  <div className="bg-neutral-50/70 rounded-2xl border border-neutral-200/70 p-3.5 col-span-2 sm:col-span-1">
                    <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium mb-1">
                      <Users className="w-3.5 h-3.5 text-neutral-600" /> Format
                    </div>
                    <p className="text-xs font-semibold text-neutral-900">
                      {event.is_team_event
                        ? `Team (${event.team_size_min}-${event.team_size_max})`
                        : "Solo Participant"}
                    </p>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      In-Person Arena
                    </p>
                  </div>
                </div>

                {/* Registration Fee & Slot Pill */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-50/70 border border-neutral-200/70">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-neutral-700 shadow-sm">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-neutral-400 block">
                        Registration Fee
                      </span>
                      <span className="text-base font-bold text-neutral-950">
                        {event.requires_payment
                          ? `₹${event.payment_amount} / ${event.is_team_event ? "Team" : "Person"}`
                          : "Free Registration"}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-semibold text-neutral-400 block">
                      Capacity
                    </span>
                    <span className="text-xs font-semibold text-neutral-900">
                      {event.registration_count ?? 0} / {event.registration_limit ?? 100} Registered
                    </span>
                  </div>
                </div>

                {/* Brief description intro */}
                {event.description && (
                  <p className="text-sm text-neutral-600 leading-relaxed bg-neutral-50/40 rounded-2xl p-4 border border-neutral-200/50">
                    {event.description}
                  </p>
                )}
              </div>
            </div>

            {/* Navigation Tabs (Overview / Rules & Regulations / Prizes) */}
            <div className="border-b border-neutral-200 pb-3 flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  activeTab === "overview"
                    ? "bg-neutral-900 text-white font-semibold shadow-sm"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900"
                }`}
              >
                Event Details
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("rules")}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  activeTab === "rules"
                    ? "bg-neutral-900 text-white font-semibold shadow-sm"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900"
                }`}
              >
                Rules &amp; Guidelines
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("prizes")}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  activeTab === "prizes"
                    ? "bg-neutral-900 text-white font-semibold shadow-sm"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900"
                }`}
              >
                Prizes &amp; Perks
              </button>
            </div>

            {/* Tab Contents */}
            <div className="bg-neutral-50/40 rounded-2xl border border-neutral-200/70 p-6 sm:p-8">
              {/* TAB 1: OVERVIEW */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-neutral-950 mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" /> Event Synopsis
                    </h3>
                    <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-line">
                      {event.description ||
                        "Prepare for one of the premiere events at ASTRA 2026. Put your analytical prowess, speed, and cybersecurity problem-solving capabilities to the ultimate test before an elite audience of academics, industry experts, and peers."}
                    </p>
                  </div>

                  {/* Event Schedule Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-200/60">
                    <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-sm">
                      <h4 className="text-xs font-semibold text-neutral-900 mb-1">
                        Reporting Venue
                      </h4>
                      <p className="text-xs text-neutral-600">
                        {event.venue || "KMCT College of Engineering, Calicut"}
                      </p>
                      <p className="text-[11px] text-neutral-400 mt-1">
                        Please verify your ticket QR pass at the entrance desk.
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-neutral-200/80 shadow-sm">
                      <h4 className="text-xs font-semibold text-neutral-900 mb-1">
                        Schedule
                      </h4>
                      <p className="text-xs text-neutral-600">
                        {formattedDate} • Starting sharp at {event.time || "10:00 AM"}
                      </p>
                      <p className="text-[11px] text-neutral-400 mt-1">
                        Please report at least 20 minutes prior to scheduled time.
                      </p>
                    </div>
                  </div>

                  {/* Coordinators List */}
                  {event.coordinators && event.coordinators.length > 0 && (
                    <div className="pt-4 border-t border-neutral-200/60">
                      <h4 className="text-xs font-semibold text-neutral-900 mb-3 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-neutral-500" /> Student Coordinators
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {event.coordinators.map((c: any, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 bg-white rounded-xl border border-neutral-200/80 text-xs shadow-sm"
                          >
                            <span className="font-semibold text-neutral-900">{c.name}</span>
                            {c.phone && (
                              <a
                                href={`tel:${c.phone}`}
                                className="text-neutral-600 hover:text-neutral-950 flex items-center gap-1 font-medium"
                              >
                                <Phone className="w-3 h-3 text-neutral-400" /> {c.phone}
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: RULES & REGULATIONS */}
              {activeTab === "rules" && (
                <div className="space-y-6">
                  <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-4 flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold text-amber-950">
                        Official ASTRA 2026 Code of Engagement
                      </h4>
                      <p className="text-xs text-amber-800/90 mt-0.5">
                        All contenders must adhere to the rules below. Violations will result in
                        immediate point forfeiture or disqualification by the event jury.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {rulesList.map((block: any, idx: number) => (
                      <div
                        key={idx}
                        className="bg-white rounded-xl border border-neutral-200/80 p-5 shadow-sm space-y-2.5"
                      >
                        <h4 className="text-xs font-bold text-neutral-950 pb-2 border-b border-neutral-100 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{block.title || `Rule Section ${idx + 1}`}</span>
                        </h4>

                        {block.items && Array.isArray(block.items) ? (
                          <ul className="space-y-2">
                            {block.items.map((item: string, i: number) => (
                              <li
                                key={i}
                                className="text-xs text-neutral-600 leading-relaxed flex items-start gap-2"
                              >
                                <span className="text-neutral-400 font-bold select-none">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs text-neutral-600 leading-relaxed">
                            {block.content || block}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: PRIZES & PERKS */}
              {activeTab === "prizes" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 text-center shadow-sm space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 mx-auto flex items-center justify-center text-xl shadow-inner">
                        🏆
                      </div>
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                        Prize Pool
                      </h4>
                      <p className="text-xl font-bold text-neutral-950">
                        {event.prize || "Exciting Rewards"}
                      </p>
                      <p className="text-[11px] text-neutral-500">
                        Awarded to top performers
                      </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 text-center shadow-sm space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 mx-auto flex items-center justify-center text-xl shadow-inner">
                        📜
                      </div>
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                        Certificate
                      </h4>
                      <p className="text-xl font-bold text-neutral-950">
                        Official Credential
                      </p>
                      <p className="text-[11px] text-neutral-500">
                        Issued by KMCT &amp; ASTRA
                      </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 text-center shadow-sm space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 mx-auto flex items-center justify-center text-xl shadow-inner">
                        ⚡
                      </div>
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                        KTU Credits
                      </h4>
                      <p className="text-xl font-bold text-neutral-950">
                        Activity Points
                      </p>
                      <p className="text-[11px] text-neutral-500">
                        Eligible for engineering students
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-400 text-center pt-2">
                    Cash awards and digital certificates will be distributed at the Grand Finale ceremony.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Bottom Action / Registration Bar */}
          <div className="border-t border-neutral-200/80 bg-neutral-50/80 px-6 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-start">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase font-semibold block">
                  Registration Status
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      event.is_registration_open && registrationStatus !== "FULL"
                        ? "bg-emerald-500 animate-pulse"
                        : "bg-neutral-400"
                    }`}
                  />
                  <span className="text-xs font-semibold text-neutral-900">
                    {event.is_registration_open ? "Slots Active" : "Registration Closed"}
                  </span>
                </div>
              </div>

              <div className="border-l border-neutral-200 pl-6">
                <span className="text-[10px] text-neutral-400 uppercase font-semibold block">
                  Entry Fee
                </span>
                <span className="text-sm font-bold text-neutral-950">
                  {event.requires_payment ? `₹${event.payment_amount}` : "FREE"}
                </span>
              </div>
            </div>

            {/* Registration Action */}
            <div className="w-full sm:w-auto flex items-center justify-end gap-3">
              {isUserRegistered ? (
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto px-8 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm tracking-wide transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <Ticket className="w-4 h-4" />
                  <span>View My Pass</span>
                </Link>
              ) : event.is_registration_open && registrationStatus !== "FULL" ? (
                <button
                  type="button"
                  onClick={handleRegisterClick}
                  className="w-full sm:w-auto px-8 py-3 rounded-full bg-neutral-900 hover:bg-black text-white font-semibold text-xs sm:text-sm tracking-wide transition-all shadow-sm active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{user ? "Proceed to Register" : "Sign In to Register"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full sm:w-auto px-8 py-3 rounded-full bg-neutral-100 text-neutral-400 text-xs font-medium cursor-not-allowed"
                >
                  Registration Closed
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Full-Screen Poster Lightbox */}
        {showFullPoster && event.image && (
          <div
            onClick={() => setShowFullPoster(false)}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          >
            <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
              <button
                type="button"
                onClick={() => setShowFullPoster(false)}
                className="absolute top-3 right-3 bg-neutral-900/80 text-white p-2 rounded-full hover:bg-black transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={event.image}
                alt={event.title}
                className="max-h-[85vh] w-auto object-contain rounded-2xl shadow-2xl"
              />
              <p className="text-xs text-neutral-300 mt-2 text-center">
                {event.title} • ASTRA 2026 Poster
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
