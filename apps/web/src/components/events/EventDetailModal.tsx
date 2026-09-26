"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  Award,
  CreditCard,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Maximize2,
  Phone,
  User,
  Sparkles,
  Ticket,
  Trophy,
} from "lucide-react";

export interface EventModalData {
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
  isUserRegistered?: boolean;
}

interface EventDetailModalProps {
  event: EventModalData | null;
  isOpen: boolean;
  onClose: () => void;
  onRegister: (event: EventModalData) => void;
  isLoggedIn: boolean;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  isOpen,
  onClose,
  onRegister,
  isLoggedIn,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "rules" | "prizes">("overview");
  const [showFullPoster, setShowFullPoster] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showFullPoster) {
          setShowFullPoster(false);
        } else {
          onClose();
        }
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, showFullPoster, onClose]);

  if (!isOpen || !event) return null;

  // Generate sensible structured rules if not explicitly set in content_blocks
  const getEventRules = () => {
    if (event.content_blocks && event.content_blocks.length > 0) {
      return event.content_blocks;
    }

    return [
      {
        title: "Eligibility & Identification",
        items: [
          "Open to all actively enrolled college students (UG/PG).",
          "Participants must carry their official institutional ID card along with their digital ticket pass.",
          "Spot entries are strictly subject to seat availability on the day of the event.",
        ],
      },
      {
        title: event.isTeamEvent ? `Team Composition` : `Individual Participation`,
        items: event.isTeamEvent
          ? [
              `Teams must consist of ${event.teamSizeMin} to ${event.teamSizeMax} registered members.`,
              "Inter-departmental and inter-collegiate teams are warmly permitted.",
              "All team members must complete individual registration citing the exact team name.",
            ]
          : [
              "This is a solo competition. Collaborating or sharing solutions with others is forbidden.",
              "Participants must complete all challenge milestones independently.",
            ],
      },
      {
        title: "Venue & Reporting Rules",
        items: [
          `Participants must report to ${event.venue || "the designated arena"} at least 20 minutes prior to scheduled start time (${event.time}).`,
          "Late arrivals may forfeit initial game rounds or lead to automatic disqualification without refund.",
          "Participants are required to bring their own laptops, chargers, and any required accessories/tools.",
        ],
      },
      {
        title: "Fair Play & Code of Conduct",
        items: [
          "Zero-tolerance policy for tampering with event infrastructure, network sniffing, or unauthorized system access.",
          "Any attempt at plagiarism or disruptive conduct will lead to immediate expulsion.",
          "The decision of the technical panel, judges, and event coordinators will be final and binding.",
        ],
      },
    ];
  };

  const rulesList = getEventRules();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto font-sans">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-md z-40"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
          className="relative w-full max-w-4xl bg-white rounded-3xl border border-neutral-200/80 shadow-2xl z-50 overflow-hidden flex flex-col max-h-[90vh] my-auto"
        >
          {/* Top Bar Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-neutral-50/60 flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-neutral-900 text-white shadow-sm">
                ASTRA 2026
              </span>
              <span className="text-xs font-semibold text-neutral-700">
                {event.category}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
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

              <button
                onClick={onClose}
                type="button"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-neutral-200 hover:bg-neutral-100 transition-colors cursor-pointer text-neutral-500 hover:text-neutral-950 shadow-sm"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Modal Scrollable Body */}
          <div className="overflow-y-auto flex-1 p-6 sm:p-8 space-y-6">
            {/* Top Grid: Poster Showcase + Quick Intelligence */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Event Poster Card (5 Cols) */}
              <div className="md:col-span-5 relative group">
                <div className="relative rounded-2xl border border-neutral-200/80 bg-neutral-950 shadow-sm overflow-hidden aspect-[3/4] max-h-[420px] mx-auto w-full flex items-center justify-center">
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
                        className="absolute bottom-3 right-3 backdrop-blur-md bg-neutral-950/80 hover:bg-neutral-950 text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all shadow-md cursor-pointer border border-white/10"
                      >
                        <Maximize2 className="w-3.5 h-3.5 text-amber-300" />
                        <span>View Poster</span>
                      </button>
                    </>
                  ) : (
                    <div className="p-6 text-center text-white space-y-3">
                      <Sparkles className="w-10 h-10 text-amber-300 mx-auto" />
                      <p className="font-bold text-xl text-white">
                        {event.title}
                      </p>
                      <p className="text-xs text-neutral-400">
                        ASTRA 2026 Official Event
                      </p>
                    </div>
                  )}

                  {/* Badges on Poster */}
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
                </div>
              </div>

              {/* Event Info & Metadata (7 Cols) */}
              <div className="md:col-span-7 space-y-4">
                {/* Title & Prize Badge */}
                <div className="space-y-1.5">
                  {event.prize && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/15 text-amber-900 border border-amber-400/30 text-xs font-semibold">
                      <Trophy className="w-3.5 h-3.5 text-amber-600" />
                      <span>Prize Pool: {event.prize}</span>
                    </div>
                  )}

                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-neutral-950 tracking-tight leading-tight">
                    {event.title}
                  </h2>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <div className="bg-neutral-50/70 rounded-2xl border border-neutral-200/70 p-3">
                    <div className="flex items-center gap-1 text-[11px] text-neutral-400 font-medium mb-0.5">
                      <Calendar className="w-3.5 h-3.5 text-neutral-600" /> Date &amp; Time
                    </div>
                    <p className="text-xs font-semibold text-neutral-900">
                      {event.date}
                    </p>
                    <p className="text-[10px] text-neutral-500">
                      {event.time}
                    </p>
                  </div>

                  <div className="bg-neutral-50/70 rounded-2xl border border-neutral-200/70 p-3">
                    <div className="flex items-center gap-1 text-[11px] text-neutral-400 font-medium mb-0.5">
                      <MapPin className="w-3.5 h-3.5 text-neutral-600" /> Venue
                    </div>
                    <p className="text-xs font-semibold text-neutral-900 truncate">
                      {event.venue || "Campus Venue"}
                    </p>
                    <p className="text-[10px] text-neutral-500">
                      KMCT Calicut
                    </p>
                  </div>

                  <div className="bg-neutral-50/70 rounded-2xl border border-neutral-200/70 p-3 col-span-2 sm:col-span-1">
                    <div className="flex items-center gap-1 text-[11px] text-neutral-400 font-medium mb-0.5">
                      <Users className="w-3.5 h-3.5 text-neutral-600" /> Format
                    </div>
                    <p className="text-xs font-semibold text-neutral-900">
                      {event.isTeamEvent
                        ? `Team (${event.teamSizeMin}-${event.teamSizeMax})`
                        : "Solo"}
                    </p>
                    <p className="text-[10px] text-neutral-500">
                      In-Person Arena
                    </p>
                  </div>
                </div>

                {/* Registration Fee Box */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50/70 border border-neutral-200/70">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-neutral-700 shadow-sm">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-neutral-400 block">
                        Registration Fee
                      </span>
                      <span className="text-sm font-bold text-neutral-950">
                        {event.requiresPayment
                          ? `₹${event.paymentAmount} / ${event.isTeamEvent ? "Team" : "Person"}`
                          : "Free Registration"}
                      </span>
                    </div>
                  </div>

                  {event.registrationLimit && (
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-semibold text-neutral-400 block">
                        Capacity
                      </span>
                      <span className="text-xs font-semibold text-neutral-900">
                        {event.registrationCount ?? 0} / {event.registrationLimit} Slots
                      </span>
                    </div>
                  )}
                </div>

                {/* Brief description */}
                {event.description && (
                  <p className="text-xs text-neutral-600 leading-relaxed bg-neutral-50/40 rounded-xl p-3 border border-neutral-200/50">
                    {event.description}
                  </p>
                )}
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-neutral-200 pb-2.5 flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("overview")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
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
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
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
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  activeTab === "prizes"
                    ? "bg-neutral-900 text-white font-semibold shadow-sm"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900"
                }`}
              >
                Prizes &amp; Perks
              </button>
            </div>

            {/* Tab Contents */}
            <div className="bg-neutral-50/40 rounded-2xl border border-neutral-200/70 p-5 sm:p-6">
              {/* TAB 1: OVERVIEW */}
              {activeTab === "overview" && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-neutral-950 mb-1.5 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Event Synopsis
                    </h4>
                    <p className="text-xs text-neutral-600 leading-relaxed whitespace-pre-line">
                      {event.description ||
                        "Prepare for one of the premiere events at ASTRA 2026. Put your analytical prowess, speed, and problem-solving capabilities to the test."}
                    </p>
                  </div>

                  {/* Coordinators */}
                  {event.coordinators && event.coordinators.length > 0 && (
                    <div className="pt-3 border-t border-neutral-200/60">
                      <h4 className="text-xs font-semibold text-neutral-900 mb-2 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-neutral-500" /> Student Coordinators
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {event.coordinators.map((c: any, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-neutral-200/80 text-xs shadow-sm"
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

              {/* TAB 2: RULES */}
              {activeTab === "rules" && (
                <div className="space-y-4">
                  <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 flex items-start gap-2.5">
                    <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-semibold text-amber-950">
                        Official ASTRA 2026 Rules &amp; Regulations
                      </h5>
                      <p className="text-[11px] text-amber-800/90 mt-0.5">
                        All contenders must adhere to the rules below. Violations will result in
                        disqualification by the event jury.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {rulesList.map((block: any, idx: number) => (
                      <div
                        key={idx}
                        className="bg-white rounded-xl border border-neutral-200/80 p-4 shadow-sm space-y-2"
                      >
                        <h5 className="text-xs font-bold text-neutral-950 pb-1.5 border-b border-neutral-100 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{block.title || `Rule Section ${idx + 1}`}</span>
                        </h5>

                        {block.items && Array.isArray(block.items) ? (
                          <ul className="space-y-1.5">
                            {block.items.map((item: string, i: number) => (
                              <li
                                key={i}
                                className="text-xs text-neutral-600 leading-relaxed flex items-start gap-1.5"
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

              {/* TAB 3: PRIZES */}
              {activeTab === "prizes" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white rounded-xl border border-neutral-200/80 p-4 text-center shadow-sm space-y-1">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 mx-auto flex items-center justify-center text-lg">
                      🏆
                    </div>
                    <h5 className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">
                      Prize Pool
                    </h5>
                    <p className="text-base font-bold text-neutral-950">
                      {event.prize || "Exciting Rewards"}
                    </p>
                    <p className="text-[10px] text-neutral-500">
                      Awarded to top performers
                    </p>
                  </div>

                  <div className="bg-white rounded-xl border border-neutral-200/80 p-4 text-center shadow-sm space-y-1">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 mx-auto flex items-center justify-center text-lg">
                      📜
                    </div>
                    <h5 className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">
                      Certificate
                    </h5>
                    <p className="text-base font-bold text-neutral-950">
                      Official Credential
                    </p>
                    <p className="text-[10px] text-neutral-500">
                      Issued by KMCT &amp; ASTRA
                    </p>
                  </div>

                  <div className="bg-white rounded-xl border border-neutral-200/80 p-4 text-center shadow-sm space-y-1">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 mx-auto flex items-center justify-center text-lg">
                      ⚡
                    </div>
                    <h5 className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">
                      KTU Credits
                    </h5>
                    <p className="text-base font-bold text-neutral-950">
                      Activity Points
                    </p>
                    <p className="text-[10px] text-neutral-500">
                      For engineering students
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Bottom Action Bar */}
          <div className="border-t border-neutral-200/80 bg-neutral-50/80 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase font-semibold block">
                  Registration
                </span>
                <span className="text-xs font-semibold text-neutral-900">
                  {event.isRegistrationOpen ? "Slots Active" : "Registration Closed"}
                </span>
              </div>

              <div className="border-l border-neutral-200 pl-4">
                <span className="text-[10px] text-neutral-400 uppercase font-semibold block">
                  Entry Fee
                </span>
                <span className="text-xs font-bold text-neutral-950">
                  {event.requiresPayment ? `₹${event.paymentAmount}` : "FREE"}
                </span>
              </div>
            </div>

            {/* Registration Action Button */}
            <div className="w-full sm:w-auto flex items-center justify-end gap-3">
              {event.isRegistrationOpen && event.registrationStatus !== "FULL" ? (
                <button
                  type="button"
                  onClick={() => onRegister(event)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-neutral-900 hover:bg-black text-white font-semibold text-xs transition-all shadow-sm active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{isLoggedIn ? "Register Now" : "Sign In to Register"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-neutral-100 text-neutral-400 text-xs font-medium cursor-not-allowed"
                >
                  Registration Closed
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Full-Screen Poster Lightbox */}
        {showFullPoster && event.image && (
          <div
            onClick={() => setShowFullPoster(false)}
            className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
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
    </AnimatePresence>
  );
};
