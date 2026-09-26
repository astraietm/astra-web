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
} from "lucide-react";
import { MarqueeTicker } from "@/components/ui/MarqueeTicker";

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
      <div className="min-h-screen pt-32 pb-20 px-4 max-w-5xl mx-auto flex items-center justify-center bg-graph-paper">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-black" />
          <p className="font-mono text-sm uppercase tracking-widest text-neutral-600">
            Loading Event Intel...
          </p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 max-w-3xl mx-auto text-center bg-graph-paper">
        <div className="border-2 border-black bg-white p-8 shadow-[6px_6px_0px_#000]">
          <h2 className="font-anton text-3xl uppercase mb-4 text-black">EVENT NOT FOUND</h2>
          <p className="font-sans text-neutral-700 mb-6">{error || "Event details are unavailable."}</p>
          <Link
            href="/events"
            className="inline-flex items-center space-x-2 bg-black text-white px-6 py-3 font-mono text-sm uppercase hover:bg-[#FFE816] hover:text-black transition-colors border-2 border-black"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Events</span>
          </Link>
        </div>
      </div>
    );
  }

  // Formatting date
  const eventDateObj = new Date(event.event_date);
  const dayNum = eventDateObj.getDate();
  const month = eventDateObj.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const formattedDate = `${month} ${String(dayNum).padStart(2, "0")}`;
  const dayLabel = dayNum === 6 ? "DAY 1" : dayNum === 7 ? "DAY 2" : "DAY";

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
          `Participants must report to ${event.venue || "the designated arena"} at least 20 minutes prior to scheduled start time (${event.time || "10:00 AM"}).`,
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
    <div className="w-full relative bg-graph-paper min-h-screen pb-24">
      {/* ─── MARQUEE TICKER HEADER ─── */}
      <div className="pt-20 sm:pt-24">
        <MarqueeTicker
          items={[
            "ASTRA 2026 // CYBER SECURITY ASSOCIATION",
            "OCT 6 & 7 — KMCT CALICUT",
            `NOW VIEWING: ${event.title.toUpperCase()}`,
            "OFFICIAL EVENT DIRECTORY",
          ]}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Navigation / Back Bar */}
        <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8 pb-4 border-b-2 border-black/20">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 bg-white border-2 border-black px-3.5 py-1.5 font-mono text-xs font-bold uppercase hover:bg-[#FFE816] transition-colors shadow-[2px_2px_0px_#000] select-none"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Events</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-gray-500 uppercase">
              EVENT ID #{event.id}
            </span>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 bg-white border-2 border-black px-3 py-1.5 font-mono text-xs font-bold uppercase hover:bg-th-yellow transition-colors shadow-[2px_2px_0px_#000] cursor-pointer"
              title="Share event link"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>

        {/* ─── MAIN EVENT CARD (FULL PAGE LAYOUT) ─── */}
        <div className="bg-[#FAF9F6] border-2 sm:border-3 border-black shadow-[8px_8px_0px_#000] overflow-hidden">
          {/* Top Bar Label */}
          <div className="flex items-center justify-between px-5 sm:px-8 py-3.5 border-b-2 border-black bg-white">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="font-pixel text-[10px] sm:text-xs bg-black text-white px-2.5 py-1 font-bold uppercase tracking-wider">
                ASTRA 2026 // EVENT INTEL
              </span>
              <span className="font-mono text-xs font-bold text-gray-700 uppercase">
                {event.category}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`font-pixel text-[10px] px-2.5 py-0.5 uppercase border border-black font-bold ${
                  registrationStatus === "OPEN"
                    ? "bg-emerald-200 text-emerald-950"
                    : registrationStatus === "FEW SLOTS"
                    ? "bg-yellow-200 text-yellow-950"
                    : "bg-red-200 text-red-950"
                }`}
              >
                {registrationStatus}
              </span>

              {isUserRegistered && (
                <span className="font-pixel text-[10px] bg-[#C3FF16] text-black border border-black px-2.5 py-0.5 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-black" /> REGISTERED
                </span>
              )}
            </div>
          </div>

          {/* Event Showcase: Poster + Info Grid */}
          <div className="p-5 sm:p-8 md:p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* Event Poster Showcase (5 Columns) */}
              <div className="md:col-span-5 relative group">
                <div className="relative border-2 border-black bg-black shadow-[4px_4px_0px_#000] overflow-hidden aspect-[3/4] max-h-[500px] mx-auto w-full flex items-center justify-center">
                  {event.image ? (
                    <>
                      <img
                        src={event.image}
                        alt={`${event.title} Poster`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <button
                        onClick={() => setShowFullPoster(true)}
                        type="button"
                        className="absolute bottom-3 right-3 bg-black/85 hover:bg-black text-white px-2.5 py-1.5 border border-white/60 text-[10px] font-mono uppercase flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                      >
                        <Maximize2 className="w-3 h-3 text-[#FFE816]" /> View Full Poster
                      </button>
                    </>
                  ) : (
                    <div className="p-8 text-center text-white space-y-3">
                      <Sparkles className="w-12 h-12 text-[#FFE816] mx-auto" />
                      <p className="font-anton text-3xl uppercase tracking-wider text-white">
                        {event.title}
                      </p>
                      <p className="font-mono text-xs text-gray-400 uppercase">
                        ASTRA 2026 OFFICIAL EVENT
                      </p>
                    </div>
                  )}

                  {/* Badges on Poster */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start pointer-events-none">
                    <span className="font-mono text-[10px] font-bold bg-[#FFE816] text-black border border-black px-2 py-0.5 uppercase shadow-[2px_2px_0px_#000]">
                      {event.category}
                    </span>
                    <span className="font-mono text-[10px] font-bold bg-white text-black border border-black px-2 py-0.5 uppercase shadow-[2px_2px_0px_#000]">
                      {dayLabel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Event Info & Metadata (7 Columns) */}
              <div className="md:col-span-7 space-y-5">
                {/* Title */}
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {event.prize && (
                      <span className="font-mono text-xs font-bold bg-th-yellow text-black px-3 py-1 border border-black shadow-[2px_2px_0px_#000]">
                        🏆 PRIZE POOL: {event.prize}
                      </span>
                    )}
                  </div>

                  <h1 className="font-anton text-4xl sm:text-6xl uppercase text-black tracking-tight leading-none">
                    {event.title}
                  </h1>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                  <div className="bg-white border-2 border-black p-3 shadow-[2px_2px_0px_#000]">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-gray-500 uppercase mb-0.5">
                      <Calendar className="w-3.5 h-3.5 text-black" /> Date &amp; Time
                    </div>
                    <p className="font-mono text-xs font-bold text-black uppercase">
                      {formattedDate}
                    </p>
                    <p className="font-mono text-[11px] text-gray-700">
                      {event.time || "10:00 AM"}
                    </p>
                  </div>

                  <div className="bg-white border-2 border-black p-3 shadow-[2px_2px_0px_#000]">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-gray-500 uppercase mb-0.5">
                      <MapPin className="w-3.5 h-3.5 text-black" /> Arena / Venue
                    </div>
                    <p className="font-mono text-xs font-bold text-black uppercase truncate">
                      {event.venue || "Campus Venue"}
                    </p>
                    <p className="font-mono text-[11px] text-gray-700">
                      KMCT Calicut
                    </p>
                  </div>

                  <div className="bg-white border-2 border-black p-3 shadow-[2px_2px_0px_#000] col-span-2 sm:col-span-1">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-gray-500 uppercase mb-0.5">
                      <Users className="w-3.5 h-3.5 text-black" /> Format
                    </div>
                    <p className="font-mono text-xs font-bold text-black uppercase">
                      {event.is_team_event
                        ? `Team (${event.team_size_min}-${event.team_size_max})`
                        : "Solo Participant"}
                    </p>
                    <p className="font-mono text-[11px] text-gray-700">
                      In-Person Arena
                    </p>
                  </div>
                </div>

                {/* Registration Fee & Slot Pill */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white border-2 border-black shadow-[2px_2px_0px_#000]">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-black" />
                    <div>
                      <span className="font-mono text-[10px] text-gray-500 uppercase block">
                        Registration Fee
                      </span>
                      <span className="font-anton text-2xl text-black">
                        {event.requires_payment
                          ? `₹${event.payment_amount} / ${event.is_team_event ? "Team" : "Person"}`
                          : "FREE REGISTRATION"}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-[10px] text-gray-500 uppercase block">
                      Capacity
                    </span>
                    <span className="font-mono text-sm font-bold text-black">
                      {event.registration_count ?? 0} / {event.registration_limit ?? 100} Registered
                    </span>
                  </div>
                </div>

                {/* Brief description intro */}
                {event.description && (
                  <p className="font-sans text-sm sm:text-base text-gray-800 leading-relaxed bg-[#F0F0FA] p-4 border-2 border-black/15">
                    {event.description}
                  </p>
                )}
              </div>
            </div>

            {/* Navigation Tabs (Overview / Rules & Regulations / Prizes) */}
            <div className="border-b-2 border-black pt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("overview")}
                className={`px-5 py-2.5 font-display text-xs sm:text-sm font-bold uppercase transition-colors border-t-2 border-x-2 border-black -mb-[2px] cursor-pointer ${
                  activeTab === "overview"
                    ? "bg-white text-black"
                    : "bg-[#E6E6F2] text-gray-600 hover:bg-white/60"
                }`}
              >
                Event Details
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("rules")}
                className={`px-5 py-2.5 font-display text-xs sm:text-sm font-bold uppercase transition-colors border-t-2 border-x-2 border-black -mb-[2px] cursor-pointer ${
                  activeTab === "rules"
                    ? "bg-[#FFE816] text-black"
                    : "bg-[#E6E6F2] text-gray-600 hover:bg-white/60"
                }`}
              >
                Rules &amp; Guidelines ⚡
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("prizes")}
                className={`px-5 py-2.5 font-display text-xs sm:text-sm font-bold uppercase transition-colors border-t-2 border-x-2 border-black -mb-[2px] cursor-pointer ${
                  activeTab === "prizes"
                    ? "bg-[#F79CFF] text-black"
                    : "bg-[#E6E6F2] text-gray-600 hover:bg-white/60"
                }`}
              >
                Prizes &amp; Perks
              </button>
            </div>

            {/* Tab Contents */}
            <div className="bg-white border-2 border-black p-6 sm:p-8 shadow-[3px_3px_0px_#000]">
              {/* TAB 1: OVERVIEW */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-pixel text-sm font-bold uppercase text-black mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-black" /> Event Synopsis
                    </h3>
                    <p className="font-sans text-sm sm:text-base text-gray-800 leading-relaxed whitespace-pre-line">
                      {event.description ||
                        "Prepare for one of the premiere events at ASTRA 2026. Put your analytical prowess, speed, and cybersecurity problem-solving capabilities to the ultimate test before an elite audience of academics, industry experts, and peers."}
                    </p>
                  </div>

                  {/* Event Schedule Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-black/10">
                    <div className="bg-[#FAF9F6] p-4 border border-black">
                      <h4 className="font-mono text-xs font-bold text-black uppercase mb-1">
                        Reporting Venue
                      </h4>
                      <p className="font-sans text-sm text-gray-700">
                        {event.venue || "KMCT College of Engineering, Calicut"}
                      </p>
                      <p className="font-mono text-[11px] text-gray-500 mt-1">
                        * Please verify your ticket QR pass at the entrance desk.
                      </p>
                    </div>

                    <div className="bg-[#FAF9F6] p-4 border border-black">
                      <h4 className="font-mono text-xs font-bold text-black uppercase mb-1">
                        Schedule
                      </h4>
                      <p className="font-sans text-sm text-gray-700">
                        {formattedDate} // Starting sharp at {event.time || "10:00 AM"}
                      </p>
                      <p className="font-mono text-[11px] text-gray-500 mt-1">
                        * Please report at least 20 minutes before time.
                      </p>
                    </div>
                  </div>

                  {/* Coordinators List if any */}
                  {event.coordinators && event.coordinators.length > 0 && (
                    <div className="pt-4 border-t border-black/10">
                      <h4 className="font-pixel text-xs font-bold uppercase text-black mb-3 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-black" /> Student Coordinators
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {event.coordinators.map((c: any, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 bg-[#FAF9F6] border border-black text-xs font-mono"
                          >
                            <span className="font-bold text-black">{c.name}</span>
                            {c.phone && (
                              <a
                                href={`tel:${c.phone}`}
                                className="text-gray-700 hover:text-black flex items-center gap-1 underline font-bold"
                              >
                                <Phone className="w-3 h-3" /> {c.phone}
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
                  <div className="bg-[#FFFEE5] border-2 border-black p-4 flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-mono text-xs font-bold text-black uppercase">
                        Official ASTRA 2026 Code of Engagement
                      </h4>
                      <p className="font-sans text-xs text-gray-700 mt-0.5">
                        All contenders must adhere to the rules below. Violations will result in
                        immediate point forfeiture or disqualification by the event jury.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {rulesList.map((block: any, idx: number) => (
                      <div
                        key={idx}
                        className="border-2 border-black p-4 sm:p-5 bg-[#FAF9F6] shadow-[2px_2px_0px_#000]"
                      >
                        <h4 className="font-pixel text-xs font-bold text-black uppercase mb-3 pb-1 border-b border-black/15 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          {block.title || `Rule Section ${idx + 1}`}
                        </h4>

                        {block.items && Array.isArray(block.items) ? (
                          <ul className="space-y-2">
                            {block.items.map((item: string, i: number) => (
                              <li
                                key={i}
                                className="text-xs sm:text-sm font-sans text-gray-800 leading-normal flex items-start gap-2"
                              >
                                <span className="font-mono text-black font-bold select-none">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs sm:text-sm font-sans text-gray-800 leading-relaxed">
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
                    <div className="border-2 border-black bg-th-yellow/20 p-5 text-center">
                      <div className="w-12 h-12 bg-th-yellow border-2 border-black mx-auto flex items-center justify-center font-anton text-xl mb-3 shadow-[2px_2px_0px_#000]">
                        🏆
                      </div>
                      <h4 className="font-pixel text-xs font-bold uppercase text-black">
                        Prize Pool
                      </h4>
                      <p className="font-anton text-2xl text-black mt-1">
                        {event.prize || "Exciting Rewards"}
                      </p>
                      <p className="font-mono text-[11px] text-gray-600 mt-1">
                        Awarded to top performers
                      </p>
                    </div>

                    <div className="border-2 border-black bg-[#C3FF16]/20 p-5 text-center">
                      <div className="w-12 h-12 bg-[#C3FF16] border-2 border-black mx-auto flex items-center justify-center font-anton text-xl mb-3 shadow-[2px_2px_0px_#000]">
                        📜
                      </div>
                      <h4 className="font-pixel text-xs font-bold uppercase text-black">
                        Certificate
                      </h4>
                      <p className="font-anton text-2xl text-black mt-1">
                        Official Credential
                      </p>
                      <p className="font-mono text-[11px] text-gray-600 mt-1">
                        Issued by KMCT &amp; ASTRA
                      </p>
                    </div>

                    <div className="border-2 border-black bg-th-pink/20 p-5 text-center">
                      <div className="w-12 h-12 bg-th-pink border-2 border-black mx-auto flex items-center justify-center font-anton text-xl mb-3 shadow-[2px_2px_0px_#000]">
                        ⚡
                      </div>
                      <h4 className="font-pixel text-xs font-bold uppercase text-black">
                        KTU Credits
                      </h4>
                      <p className="font-anton text-2xl text-black mt-1">
                        Activity Points
                      </p>
                      <p className="font-mono text-[11px] text-gray-600 mt-1">
                        Eligible for engineering students
                      </p>
                    </div>
                  </div>

                  <p className="font-mono text-xs text-gray-600 text-center pt-2">
                    * Cash awards and digital certificates will be distributed at the Grand Finale ceremony.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Bottom Action / Registration Bar */}
          <div className="border-t-2 border-black bg-white px-5 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-start">
              <div>
                <span className="font-mono text-[10px] text-gray-500 uppercase block">
                  Registration Status
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      event.is_registration_open && registrationStatus !== "FULL"
                        ? "bg-emerald-500 animate-pulse"
                        : "bg-red-500"
                    }`}
                  />
                  <span className="font-mono text-xs font-bold text-black uppercase">
                    {event.is_registration_open ? "SLOTS ACTIVE" : "REGISTRATION CLOSED"}
                  </span>
                </div>
              </div>

              <div className="border-l border-black/20 pl-6">
                <span className="font-mono text-[10px] text-gray-500 uppercase block">
                  Entry Fee
                </span>
                <span className="font-mono text-base font-bold text-black">
                  {event.requires_payment ? `₹${event.payment_amount}` : "FREE"}
                </span>
              </div>
            </div>

            {/* Registration Action */}
            <div className="w-full sm:w-auto flex items-center justify-end gap-3">
              {isUserRegistered ? (
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#C3FF16] text-black font-display font-bold text-xs sm:text-sm uppercase tracking-wider border-2 border-black hover:bg-th-yellow transition-colors shadow-[3px_3px_0px_#000] flex items-center justify-center gap-2"
                >
                  <Ticket className="w-4 h-4" /> VIEW MY PASS
                </Link>
              ) : event.is_registration_open && registrationStatus !== "FULL" ? (
                <button
                  type="button"
                  onClick={handleRegisterClick}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#FFE816] text-black font-display font-bold text-xs sm:text-sm uppercase tracking-wider border-2 border-black hover:bg-black hover:text-white transition-colors shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] cursor-pointer flex items-center justify-center gap-2"
                >
                  {user ? (
                    <>
                      <span>PROCEED TO REGISTER</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>SIGN IN TO REGISTER</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full sm:w-auto px-8 py-3.5 bg-gray-200 text-gray-500 font-display font-bold text-xs uppercase tracking-wider border-2 border-gray-400 cursor-not-allowed"
                >
                  REGISTRATION CLOSED
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Full-Screen Poster Lightbox */}
        {showFullPoster && event.image && (
          <div
            onClick={() => setShowFullPoster(false)}
            className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
              <button
                type="button"
                onClick={() => setShowFullPoster(false)}
                className="absolute top-2 right-2 bg-white text-black p-2 border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-th-yellow cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={event.image}
                alt={event.title}
                className="max-h-[85vh] w-auto object-contain border-2 border-white/20 shadow-2xl"
              />
              <p className="font-mono text-xs text-white/80 mt-2 uppercase tracking-widest text-center">
                {event.title} // ASTRA 2026 POSTER
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
