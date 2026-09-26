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
  AlertCircle,
  ShieldAlert,
  ArrowRight,
  Maximize2,
  Phone,
  User,
  Sparkles,
  Ticket,
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

    const rules = [
      {
        title: "Eligibility & Verification",
        items: [
          "Open to all actively enrolled undergraduate and postgraduate college students.",
          "Every participant must carry their official institutional ID card along with their digital ticket pass.",
          "Spot entries are strictly subject to seat availability on the day of the event.",
        ],
      },
      {
        title: event.isTeamEvent ? `Team Format & Composition` : `Individual Participation`,
        items: event.isTeamEvent
          ? [
              `Teams must consist of ${event.teamSizeMin} to ${event.teamSizeMax} registered members.`,
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

    return rules;
  };

  const rulesList = getEventRules();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-40"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
          className="relative w-full max-w-5xl bg-[#FAF9F6] border-2 sm:border-3 border-black shadow-[8px_8px_0px_#000] z-50 overflow-hidden flex flex-col max-h-[92vh] my-auto"
        >
          {/* Top Bar Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b-2 border-black bg-white flex-shrink-0">
            <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
              <span className="font-pixel text-[10px] sm:text-xs bg-black text-white px-2 py-0.5 font-bold uppercase tracking-wider">
                ASTRA 2026 // EVENT INTEL
              </span>
              <span className="hidden sm:inline font-mono text-xs text-gray-500 uppercase truncate">
                ID #{event.backendId || event.id}
              </span>
            </div>

            <button
              onClick={onClose}
              type="button"
              className="flex items-center justify-center w-8 h-8 border-2 border-black bg-white hover:bg-th-yellow transition-colors cursor-pointer select-none text-black"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Scrollable Body */}
          <div className="overflow-y-auto flex-1 p-4 sm:p-6 md:p-8 space-y-6">
            {/* Top Grid: Poster Showcase + Quick Intelligence */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Event Poster Card (5 Cols) */}
              <div className="md:col-span-5 relative group">
                <div className="relative border-2 border-black bg-black shadow-[4px_4px_0px_#000] overflow-hidden aspect-[3/4] max-h-[460px] mx-auto w-full flex items-center justify-center">
                  {event.image ? (
                    <>
                      <img
                        src={event.image}
                        alt={`${event.title} Poster`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {/* Zoom poster button */}
                      <button
                        onClick={() => setShowFullPoster(true)}
                        type="button"
                        className="absolute bottom-3 right-3 bg-black/85 hover:bg-black text-white px-2.5 py-1.5 border border-white/60 text-[10px] font-mono uppercase flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                      >
                        <Maximize2 className="w-3 h-3 text-[#FFE816]" /> View Full Poster
                      </button>
                    </>
                  ) : (
                    <div className="p-6 text-center text-white space-y-3">
                      <Sparkles className="w-10 h-10 text-[#FFE816] mx-auto" />
                      <p className="font-anton text-2xl uppercase tracking-wider text-white">
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
                    {event.day && (
                      <span className="font-mono text-[10px] font-bold bg-white text-black border border-black px-2 py-0.5 uppercase shadow-[2px_2px_0px_#000]">
                        {event.day}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Event Info & Metadata (7 Cols) */}
              <div className="md:col-span-7 space-y-4">
                {/* Title */}
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span
                      className={`font-pixel text-[10px] px-2 py-0.5 uppercase border border-black font-bold ${
                        event.registrationStatus === "OPEN"
                          ? "bg-emerald-200 text-emerald-950"
                          : event.registrationStatus === "FEW SLOTS"
                          ? "bg-yellow-200 text-yellow-950"
                          : "bg-red-200 text-red-950"
                      }`}
                    >
                      {event.registrationStatus}
                    </span>

                    {event.isUserRegistered && (
                      <span className="font-pixel text-[10px] bg-[#C3FF16] text-black border border-black px-2 py-0.5 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-black" /> REGISTERED
                      </span>
                    )}

                    {event.prize && (
                      <span className="font-mono text-xs font-bold bg-th-yellow text-black px-2.5 py-0.5 border border-black">
                        🏆 PRIZE: {event.prize}
                      </span>
                    )}
                  </div>

                  <h1 className="font-anton text-3xl sm:text-5xl uppercase text-black tracking-tight leading-none">
                    {event.title}
                  </h1>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                  <div className="bg-white border-2 border-black p-2.5 shadow-[2px_2px_0px_#000]">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-gray-500 uppercase mb-0.5">
                      <Calendar className="w-3 h-3 text-black" /> Date & Time
                    </div>
                    <p className="font-mono text-xs font-bold text-black uppercase">
                      {event.date}
                    </p>
                    <p className="font-mono text-[11px] text-gray-700">
                      {event.time}
                    </p>
                  </div>

                  <div className="bg-white border-2 border-black p-2.5 shadow-[2px_2px_0px_#000]">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-gray-500 uppercase mb-0.5">
                      <MapPin className="w-3 h-3 text-black" /> Arena / Venue
                    </div>
                    <p className="font-mono text-xs font-bold text-black uppercase truncate">
                      {event.venue || "Campus Venue"}
                    </p>
                    <p className="font-mono text-[11px] text-gray-700">
                      KMCT Calicut
                    </p>
                  </div>

                  <div className="bg-white border-2 border-black p-2.5 shadow-[2px_2px_0px_#000] col-span-2 sm:col-span-1">
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-gray-500 uppercase mb-0.5">
                      <Users className="w-3 h-3 text-black" /> Format
                    </div>
                    <p className="font-mono text-xs font-bold text-black uppercase">
                      {event.isTeamEvent
                        ? `Team (${event.teamSizeMin}-${event.teamSizeMax})`
                        : "Solo Participant"}
                    </p>
                    <p className="font-mono text-[11px] text-gray-700">
                      {event.duration ? `${event.duration} Duration` : "Timed Event"}
                    </p>
                  </div>
                </div>

                {/* Registration Fee & Slot Pill */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white border-2 border-black">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-black" />
                    <div>
                      <span className="font-mono text-[10px] text-gray-500 uppercase block">
                        Registration Fee
                      </span>
                      <span className="font-anton text-xl text-black">
                        {event.requiresPayment
                          ? `₹${event.paymentAmount} / ${event.isTeamEvent ? "Team" : "Person"}`
                          : "FREE REGISTRATION"}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-[10px] text-gray-500 uppercase block">
                      Capacity
                    </span>
                    <span className="font-mono text-xs font-bold text-black">
                      {event.registrationCount ?? 0} / {event.registrationLimit ?? 100} Registered
                    </span>
                  </div>
                </div>

                {/* Brief description intro */}
                {event.description && (
                  <p className="font-sans text-sm text-gray-800 leading-relaxed bg-[#F0F0FA] p-3 border-2 border-black/15">
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
                className={`px-4 py-2 font-display text-xs sm:text-sm font-bold uppercase transition-colors border-t-2 border-x-2 border-black -mb-[2px] cursor-pointer ${
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
                className={`px-4 py-2 font-display text-xs sm:text-sm font-bold uppercase transition-colors border-t-2 border-x-2 border-black -mb-[2px] cursor-pointer ${
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
                className={`px-4 py-2 font-display text-xs sm:text-sm font-bold uppercase transition-colors border-t-2 border-x-2 border-black -mb-[2px] cursor-pointer ${
                  activeTab === "prizes"
                    ? "bg-[#F79CFF] text-black"
                    : "bg-[#E6E6F2] text-gray-600 hover:bg-white/60"
                }`}
              >
                Prizes &amp; Perks
              </button>
            </div>

            {/* Tab Contents */}
            <div className="bg-white border-2 border-black p-5 sm:p-6 shadow-[3px_3px_0px_#000]">
              {/* TAB 1: OVERVIEW */}
              {activeTab === "overview" && (
                <div className="space-y-5">
                  <div>
                    <h3 className="font-pixel text-sm font-bold uppercase text-black mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-black" /> Event Synopsis
                    </h3>
                    <p className="font-sans text-sm text-gray-800 leading-relaxed whitespace-pre-line">
                      {event.description ||
                        "Prepare for one of the premiere events at ASTRA 2026. Put your analytical prowess, speed, and cybersecurity problem-solving capabilities to the ultimate test before an elite audience of academics, industry experts, and peers."}
                    </p>
                  </div>

                  {/* Event Schedule Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-black/10">
                    <div className="bg-[#FAF9F6] p-3 border border-black">
                      <h4 className="font-mono text-xs font-bold text-black uppercase mb-1">
                        Reporting Venue
                      </h4>
                      <p className="font-sans text-xs text-gray-700">
                        {event.venue || "KMCT College of Engineering, Calicut"}
                      </p>
                      <p className="font-mono text-[10px] text-gray-500 mt-1">
                        * Please verify your ticket QR pass at the entrance desk.
                      </p>
                    </div>

                    <div className="bg-[#FAF9F6] p-3 border border-black">
                      <h4 className="font-mono text-xs font-bold text-black uppercase mb-1">
                        Schedule &amp; Duration
                      </h4>
                      <p className="font-sans text-xs text-gray-700">
                        {event.date} // Starting sharp at {event.time}
                      </p>
                      <p className="font-mono text-[10px] text-gray-500 mt-1">
                        Estimated Session Duration: {event.duration || "2 to 3 Hours"}
                      </p>
                    </div>
                  </div>

                  {/* Coordinators List if any */}
                  {event.coordinators && event.coordinators.length > 0 && (
                    <div className="pt-3 border-t border-black/10">
                      <h4 className="font-pixel text-xs font-bold uppercase text-black mb-2 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-black" /> Student Coordinators
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {event.coordinators.map((c: any, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 bg-[#FAF9F6] border border-black text-xs font-mono"
                          >
                            <span className="font-bold text-black">{c.name}</span>
                            {c.phone && (
                              <a
                                href={`tel:${c.phone}`}
                                className="text-gray-700 hover:text-black flex items-center gap-1 underline"
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
                  <div className="bg-[#FFFEE5] border-2 border-black p-3.5 flex items-start gap-3">
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {rulesList.map((block: any, idx: number) => (
                      <div
                        key={idx}
                        className="border-2 border-black p-4 bg-[#FAF9F6] shadow-[2px_2px_0px_#000]"
                      >
                        <h4 className="font-pixel text-xs font-bold text-black uppercase mb-2.5 pb-1 border-b border-black/15 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          {block.title || `Rule Section ${idx + 1}`}
                        </h4>

                        {block.items && Array.isArray(block.items) ? (
                          <ul className="space-y-2">
                            {block.items.map((item: string, i: number) => (
                              <li
                                key={i}
                                className="text-xs font-sans text-gray-800 leading-normal flex items-start gap-2"
                              >
                                <span className="font-mono text-black font-bold select-none">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs font-sans text-gray-800 leading-relaxed">
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
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="border-2 border-black bg-th-yellow/20 p-4 text-center">
                      <div className="w-10 h-10 bg-th-yellow border-2 border-black mx-auto flex items-center justify-center font-anton text-lg mb-2 shadow-[2px_2px_0px_#000]">
                        🏆
                      </div>
                      <h4 className="font-pixel text-xs font-bold uppercase text-black">
                        Prize Pool
                      </h4>
                      <p className="font-anton text-xl text-black mt-1">
                        {event.prize || "Exciting Cash Rewards"}
                      </p>
                      <p className="font-mono text-[10px] text-gray-600 mt-1">
                        Awarded to top winners
                      </p>
                    </div>

                    <div className="border-2 border-black bg-[#C3FF16]/20 p-4 text-center">
                      <div className="w-10 h-10 bg-[#C3FF16] border-2 border-black mx-auto flex items-center justify-center font-anton text-lg mb-2 shadow-[2px_2px_0px_#000]">
                        📜
                      </div>
                      <h4 className="font-pixel text-xs font-bold uppercase text-black">
                        Certificate
                      </h4>
                      <p className="font-anton text-xl text-black mt-1">
                        Official Credential
                      </p>
                      <p className="font-mono text-[10px] text-gray-600 mt-1">
                        Issued by KMCT &amp; ASTRA
                      </p>
                    </div>

                    <div className="border-2 border-black bg-th-pink/20 p-4 text-center">
                      <div className="w-10 h-10 bg-th-pink border-2 border-black mx-auto flex items-center justify-center font-anton text-lg mb-2 shadow-[2px_2px_0px_#000]">
                        ⚡
                      </div>
                      <h4 className="font-pixel text-xs font-bold uppercase text-black">
                        KTU Credits
                      </h4>
                      <p className="font-anton text-xl text-black mt-1">
                        Activity Points
                      </p>
                      <p className="font-mono text-[10px] text-gray-600 mt-1">
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
          <div className="border-t-2 border-black bg-white px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 flex-shrink-0">
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
              <div>
                <span className="font-mono text-[10px] text-gray-500 uppercase block">
                  Registration Status
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      event.isRegistrationOpen && event.registrationStatus !== "FULL"
                        ? "bg-emerald-500 animate-pulse"
                        : "bg-red-500"
                    }`}
                  />
                  <span className="font-mono text-xs font-bold text-black uppercase">
                    {event.isRegistrationOpen ? "SLOTS ACTIVE" : "REGISTRATION CLOSED"}
                  </span>
                </div>
              </div>

              <div className="border-l border-black/20 pl-4">
                <span className="font-mono text-[10px] text-gray-500 uppercase block">
                  Entry Fee
                </span>
                <span className="font-mono text-sm font-bold text-black">
                  {event.requiresPayment ? `₹${event.paymentAmount}` : "FREE"}
                </span>
              </div>
            </div>

            {/* Registration Button */}
            <div className="w-full sm:w-auto flex items-center justify-end gap-3">
              {event.isUserRegistered ? (
                <a
                  href="/dashboard"
                  className="w-full sm:w-auto px-6 py-3 bg-[#C3FF16] text-black font-display font-bold text-xs sm:text-sm uppercase tracking-wider border-2 border-black hover:bg-th-yellow transition-colors shadow-[3px_3px_0px_#000] flex items-center justify-center gap-2"
                >
                  <Ticket className="w-4 h-4" /> VIEW MY PASS
                </a>
              ) : event.isRegistrationOpen && event.registrationStatus !== "FULL" ? (
                <button
                  type="button"
                  onClick={() => onRegister(event)}
                  className="w-full sm:w-auto px-7 py-3 bg-[#FFE816] text-black font-display font-bold text-xs sm:text-sm uppercase tracking-wider border-2 border-black hover:bg-black hover:text-white transition-colors shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] cursor-pointer flex items-center justify-center gap-2"
                >
                  {isLoggedIn ? (
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
                  className="w-full sm:w-auto px-6 py-3 bg-gray-200 text-gray-500 font-display font-bold text-xs uppercase tracking-wider border-2 border-gray-400 cursor-not-allowed"
                >
                  REGISTRATION CLOSED
                </button>
              )}
            </div>
          </div>
        </motion.div>

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
    </AnimatePresence>
  );
};
