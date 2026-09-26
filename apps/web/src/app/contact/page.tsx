"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PixelFrame } from "@/components/ui/PixelFrame";
import { StickerBadge } from "@/components/ui/StickerBadge";
import { useToast } from "@/lib/toast-context";
import api from "@/lib/api";
import {
  Send,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Copy,
  Check,
  ExternalLink,
  MessageSquare,
  HelpCircle,
  Clock,
  ShieldCheck,
  Terminal,
  ArrowUpRight,
  ChevronDown,
  Sparkles,
  Radio,
  User,
  AtSign,
  Compass,
} from "lucide-react";

const INQUIRY_TOPICS = [
  { id: "general", label: "General Query", badgeColor: "yellow" as const },
  { id: "ctf", label: "CTF WarGames", badgeColor: "lime" as const },
  { id: "sponsorship", label: "Sponsorship & Collab", badgeColor: "pink" as const },
  { id: "events", label: "Workshops & Talks", badgeColor: "lilac" as const },
  { id: "passes", label: "Passes & Tickets", badgeColor: "mint" as const },
  { id: "volunteer", label: "Volunteering", badgeColor: "yellow" as const },
];

const FAQS = [
  {
    q: "Who can attend ASTRA 2026?",
    a: "ASTRA is open to students, researchers, developers, and cybersecurity enthusiasts from all colleges and universities nationwide. Both beginner and pro tracks are available.",
  },
  {
    q: "How do I register for the 24H CTF WarGames?",
    a: "You can register through the Events section on the website. Teams can consist of up to 4 members. Early bird access gives priority lab allocation.",
  },
  {
    q: "Is accommodation provided for outstation participants?",
    a: "Yes! Subsidized hostel accommodation and transit assistance are available at the KMCT Campus in Calicut for verified participants. Details are shared post-registration.",
  },
  {
    q: "How quickly does the organizing committee respond?",
    a: "Our dispatch terminal operates round the clock. Typical response latency is under 24 hours during regular ops and under 2 hours during peak event countdowns.",
  },
];

export default function ContactPage() {
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [topic, setTopic] = useState("general");
  const [sending, setSending] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(`Copied "${text}" to clipboard!`, "success");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      showToast("Please fill in all required fields.", "error");
      return;
    }

    const selectedTopicObj = INQUIRY_TOPICS.find((t) => t.id === topic);
    const topicLabel = selectedTopicObj ? selectedTopicObj.label : "General";
    const formattedMessage = `[Topic: ${topicLabel}]\n\n${message.trim()}`;

    setSending(true);
    try {
      await api.post("/api/ops/contact-us/", {
        name: name.trim(),
        email: email.trim(),
        message: formattedMessage,
      });
      showToast("Transmission dispatched successfully! Our team will get back to you.", "success");
      setName("");
      setEmail("");
      setMessage("");
      setTopic("general");
    } catch {
      showToast("Failed to transmit message. Please try direct email or phone.", "error");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-graph-paper relative overflow-hidden">
      {/* Decorative Neo-Brutalist Floating Badges for background flair */}
      <div className="absolute top-20 right-8 -rotate-6 pointer-events-none hidden xl:block select-none opacity-80">
        <span className="font-pixel text-[11px] px-3 py-1 bg-th-yellow text-black border-2 border-black shadow-[3px_3px_0px_#000] font-bold">
          KMCT // DEPT OF CYBER SECURITY
        </span>
      </div>
      <div className="absolute top-44 left-6 rotate-12 pointer-events-none hidden xl:block select-none opacity-70">
        <span className="font-pixel text-[10px] px-2.5 py-1 bg-th-pink text-black border-2 border-black shadow-[2px_2px_0px_#000] font-bold">
          ★ SECURE UPLINK ESTABLISHED
        </span>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header Block */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
            <StickerBadge color="lime" rotation={-2} size="md">
              CONTACT_TERMINAL // v2.6
            </StickerBadge>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-black text-white text-[11px] font-mono font-bold uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,0.3)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              SYSTEM ONLINE
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <h1 className="font-pixel text-3xl sm:text-5xl lg:text-6xl font-extrabold uppercase text-black tracking-tight leading-none">
                GET IN TOUCH
              </h1>
              <p className="font-editorial italic text-base sm:text-lg text-gray-700 max-w-2xl mt-2 leading-relaxed">
                Have questions regarding CTF WarGames, partnerships, or passes? Transmit your signal directly to the ASTRA operations terminal.
              </p>
            </div>

            {/* Telemetry / Live Status Pill Bar */}
            <div className="inline-flex flex-wrap items-center gap-2 sm:gap-3 bg-white border-2 border-black p-2 sm:p-2.5 shadow-[3px_3px_0px_#000] font-mono text-[11px]">
              <div className="flex items-center gap-1.5 text-gray-700 px-2 py-1 bg-gray-100 border border-black/20">
                <Clock className="w-3.5 h-3.5 text-black" />
                <span>AVG LATENCY: <strong>&lt; 24H</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-700 px-2 py-1 bg-gray-100 border border-black/20">
                <Compass className="w-3.5 h-3.5 text-black" />
                <span>NODE: <strong>KMCT-CALICUT</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-800 px-2 py-1 bg-emerald-100 border border-emerald-500 font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-BIT ENCRYPTED</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Grid: Left Form + Right Contact Intel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: The Interactive Form (7 Cols) */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <PixelFrame dotGrid cornerAccent className="p-6 sm:p-8 bg-white border-3 border-black shadow-[6px_6px_0px_#000]">
              {/* Terminal Title Bar */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b-2 border-black border-dashed">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 mr-2">
                    <span className="w-3 h-3 rounded-full bg-red-400 border border-black" />
                    <span className="w-3 h-3 rounded-full bg-yellow-400 border border-black" />
                    <span className="w-3 h-3 rounded-full bg-green-400 border border-black" />
                  </div>
                  <Terminal className="w-4 h-4 text-black" />
                  <span className="font-pixel text-sm sm:text-base font-bold uppercase tracking-wider text-black">
                    TRANSMIT MESSAGE
                  </span>
                </div>
                <span className="font-mono text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest hidden sm:inline">
                  DISPATCH // CORE
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Topic Selector Chips */}
                <div>
                  <label className="font-mono text-xs font-bold uppercase tracking-wider text-black flex items-center gap-1.5 mb-2.5">
                    <Sparkles className="w-3.5 h-3.5 text-th-gold" />
                    <span>Select Inquiry Classification</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {INQUIRY_TOPICS.map((item) => {
                      const isSelected = topic === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setTopic(item.id)}
                          className={`font-mono text-xs font-bold px-3 py-1.5 uppercase transition-all duration-160 border-2 border-black select-none ${
                            isSelected
                              ? "bg-black text-white shadow-[2px_2px_0px_#000] -translate-y-0.5"
                              : "bg-white text-gray-800 hover:bg-gray-100 hover:border-black shadow-[2px_2px_0px_rgba(0,0,0,0.15)]"
                          }`}
                        >
                          {isSelected && <span className="mr-1.5 text-th-yellow">▶</span>}
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-xs font-bold uppercase text-black mb-1.5 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-gray-600" />
                      <span>Full Name</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Turing"
                      required
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border-2 border-black font-sans text-sm text-black placeholder:text-gray-400 shadow-[3px_3px_0px_#000] transition-transform focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-[1px_1px_0px_#000] focus:outline-none focus:bg-white focus:ring-2 focus:ring-th-yellow"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-xs font-bold uppercase text-black mb-1.5 flex items-center gap-1.5">
                      <AtSign className="w-3.5 h-3.5 text-gray-600" />
                      <span>Email Address</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@domain.com"
                      required
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border-2 border-black font-sans text-sm text-black placeholder:text-gray-400 shadow-[3px_3px_0px_#000] transition-transform focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-[1px_1px_0px_#000] focus:outline-none focus:bg-white focus:ring-2 focus:ring-th-yellow"
                    />
                  </div>
                </div>

                {/* Message Box */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-mono text-xs font-bold uppercase text-black flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-gray-600" />
                      <span>Message Details</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <span className="font-mono text-[10px] text-gray-500">
                      {message.length} / 1000 CHARS
                    </span>
                  </div>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={1000}
                    required
                    rows={5}
                    placeholder="Provide context on your query, team info, or proposal details..."
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border-2 border-black font-sans text-sm text-black placeholder:text-gray-400 shadow-[3px_3px_0px_#000] transition-transform focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-[1px_1px_0px_#000] focus:outline-none focus:bg-white focus:ring-2 focus:ring-th-yellow resize-none leading-relaxed"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full group flex items-center justify-center gap-3 px-6 py-3.5 bg-black text-white font-mono font-bold text-sm uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_#000] hover:bg-th-yellow hover:text-black hover:shadow-[6px_6px_0px_#000] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] transition-all duration-160 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-th-yellow group-hover:text-black" />
                        <span>DISPATCHING ENCRYPTED SIGNAL...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 transition-transform duration-160 group-hover:translate-x-1 group-hover:-translate-y-1" />
                        <span>DISPATCH TRANSMISSION</span>
                        <ArrowUpRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </>
                    )}
                  </button>

                  <p className="font-mono text-[11px] text-gray-500 text-center mt-3">
                    🔒 Messages are logged directly to the KMCT Cyber Defense operations console.
                  </p>
                </div>
              </form>
            </PixelFrame>
          </motion.div>

          {/* RIGHT: Direct Channels, Campus GPS, and FAQs (5 Cols) */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Direct Channels Card */}
            <PixelFrame dotGrid cornerAccent className="p-6 bg-white border-3 border-black shadow-[6px_6px_0px_#000]">
              <div className="flex items-center justify-between pb-3 mb-5 border-b-2 border-black border-dashed">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-black animate-pulse" />
                  <h2 className="font-pixel text-base font-bold uppercase tracking-wider text-black">
                    DIRECT CHANNELS
                  </h2>
                </div>
                <span className="font-pixel text-[10px] px-2 py-0.5 bg-th-lime text-black border border-black font-bold">
                  OFFICIAL
                </span>
              </div>

              <div className="space-y-4 font-sans text-sm">
                {/* Email Section */}
                <div className="p-3.5 bg-[#FAF9F6] border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-white transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-th-yellow border border-black text-black">
                        <Mail className="w-4 h-4" />
                      </div>
                      <span className="font-mono text-xs font-bold uppercase tracking-wider text-black">
                        Electronic Mail
                      </span>
                    </div>
                    <a
                      href="mailto:contact@astraietm.in"
                      className="font-mono text-[11px] font-bold text-black hover:text-blue-600 underline flex items-center gap-0.5"
                    >
                      <span>Mail Us</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="space-y-1.5 pl-8 font-mono text-xs text-gray-800">
                    <div className="flex items-center justify-between group/item">
                      <span className="select-all font-medium">contact@astraietm.in</span>
                      <button
                        type="button"
                        onClick={() => handleCopy("contact@astraietm.in", "mail-astra")}
                        className="p-1 text-gray-500 hover:text-black hover:bg-gray-200 border border-transparent hover:border-black rounded transition-all"
                        title="Copy email"
                      >
                        {copiedKey === "mail-astra" ? (
                          <Check className="w-3.5 h-3.5 text-green-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    <div className="flex items-center justify-between group/item border-t border-gray-200 pt-1.5">
                      <span className="select-all font-medium text-gray-600">cybersecurity@kmct.edu.in</span>
                      <button
                        type="button"
                        onClick={() => handleCopy("cybersecurity@kmct.edu.in", "mail-kmct")}
                        className="p-1 text-gray-500 hover:text-black hover:bg-gray-200 border border-transparent hover:border-black rounded transition-all"
                        title="Copy email"
                      >
                        {copiedKey === "mail-kmct" ? (
                          <Check className="w-3.5 h-3.5 text-green-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Phone Section */}
                <div className="p-3.5 bg-[#FAF9F6] border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-white transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-th-pink border border-black text-black">
                        <Phone className="w-4 h-4" />
                      </div>
                      <span className="font-mono text-xs font-bold uppercase tracking-wider text-black">
                        Voice Terminal
                      </span>
                    </div>
                    <a
                      href="tel:+919447000000"
                      className="font-mono text-[11px] font-bold text-black hover:text-blue-600 underline flex items-center gap-0.5"
                    >
                      <span>Call Ops</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="space-y-1.5 pl-8 font-mono text-xs text-gray-800">
                    <div className="flex items-center justify-between">
                      <span className="select-all font-medium">+91 94470 00000</span>
                      <button
                        type="button"
                        onClick={() => handleCopy("+919447000000", "phone-mob")}
                        className="p-1 text-gray-500 hover:text-black hover:bg-gray-200 border border-transparent hover:border-black rounded transition-all"
                        title="Copy phone"
                      >
                        {copiedKey === "phone-mob" ? (
                          <Check className="w-3.5 h-3.5 text-green-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-200 pt-1.5">
                      <span className="select-all font-medium text-gray-600">0495 2288500 (Campus Desk)</span>
                      <button
                        type="button"
                        onClick={() => handleCopy("04952288500", "phone-desk")}
                        className="p-1 text-gray-500 hover:text-black hover:bg-gray-200 border border-transparent hover:border-black rounded transition-all"
                        title="Copy landline"
                      >
                        {copiedKey === "phone-desk" ? (
                          <Check className="w-3.5 h-3.5 text-green-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Campus Address & Google Map Route */}
                <div className="p-3.5 bg-[#FAF9F6] border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-white transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-th-sky border border-black text-black">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <span className="font-mono text-xs font-bold uppercase tracking-wider text-black">
                        Command Base
                      </span>
                    </div>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 bg-black text-white font-bold">
                      CALICUT
                    </span>
                  </div>

                  <div className="pl-8 text-xs text-gray-800 space-y-2">
                    <p className="font-semibold text-black leading-snug">
                      KMCT Institute of Emerging Technology and Management
                    </p>
                    <p className="font-mono text-gray-600 leading-relaxed text-[11px]">
                      Manassery PO, Mukkam, Kozhikode (Calicut), Kerala — 673602
                    </p>
                    <div className="pt-2 flex flex-wrap items-center gap-2">
                      <a
                        href="https://maps.google.com/?q=KMCT+Institute+of+Emerging+Technology+and+Management+Mukkam"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black text-white font-mono text-[11px] font-bold uppercase tracking-wider hover:bg-th-yellow hover:text-black border border-black transition-colors"
                      >
                        <span>Open Maps Navigator</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <span className="font-mono text-[10px] text-gray-500">
                        GPS: 11.2952° N, 75.9868° E
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </PixelFrame>

            {/* Quick Assist FAQ Accordion */}
            <PixelFrame dotGrid cornerAccent className="p-6 bg-white border-3 border-black shadow-[6px_6px_0px_#000]">
              <div className="flex items-center gap-2 pb-3 mb-4 border-b-2 border-black border-dashed">
                <HelpCircle className="w-4 h-4 text-black" />
                <h2 className="font-pixel text-base font-bold uppercase tracking-wider text-black">
                  FREQUENT PROTOCOLS (FAQ)
                </h2>
              </div>

              <div className="space-y-2.5">
                {FAQS.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div
                      key={idx}
                      className="border-2 border-black bg-[#FAF9F6] transition-all overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full text-left p-3 flex items-center justify-between gap-3 font-mono text-xs font-bold uppercase text-black hover:bg-black/5"
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-th-gold">0{idx + 1}.</span>
                          <span>{faq.q}</span>
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-black flex-shrink-0 transition-transform duration-200 ${
                            isOpen ? "rotate-180 text-black" : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="p-3 pt-0 border-t border-black/10 font-sans text-xs text-gray-700 leading-relaxed bg-white">
                              {faq.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </PixelFrame>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

