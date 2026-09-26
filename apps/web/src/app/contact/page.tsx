"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  ArrowRight,
  ChevronDown,
  Sparkles,
  Radio,
  User,
  AtSign,
  Compass,
  CheckCircle2,
} from "lucide-react";

const INQUIRY_TOPICS = [
  { id: "general", label: "General Query" },
  { id: "ctf", label: "CTF WarGames" },
  { id: "sponsorship", label: "Sponsorship & Collab" },
  { id: "events", label: "Workshops & Talks" },
  { id: "passes", label: "Passes & Tickets" },
  { id: "volunteer", label: "Volunteering" },
];

const FAQS = [
  {
    q: "Who can attend ASTRA 2026?",
    a: "ASTRA is open to students, researchers, developers, and cybersecurity enthusiasts from all colleges and universities nationwide. Both beginner and pro tracks are available.",
  },
  {
    q: "How do I register for the 24H CTF WarGames?",
    a: "You can register directly from the Events section on the website. Teams can consist of up to 4 members. Early bird access gives priority lab allocation.",
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
      showToast("Message sent successfully! Our team will get back to you shortly.", "success");
      setName("");
      setEmail("");
      setMessage("");
      setTopic("general");
    } catch {
      showToast("Failed to send message. Please try direct email or phone.", "error");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="w-full relative bg-neutral-50/60 min-h-screen pt-24 sm:pt-28 pb-24 font-sans text-neutral-900">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-neutral-900 text-white text-xs font-medium shadow-sm mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>ASTRA 2026 Help Desk &amp; Direct Support</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-950">
                Get in Touch
              </h1>
              <p className="text-sm sm:text-base text-neutral-500 mt-2 max-w-2xl leading-relaxed">
                Have questions regarding CTF WarGames, sponsorships, passes, or workshop schedules? Reach out to our organizing committee and we'll assist you right away.
              </p>
            </div>
          </div>
        </div>

        {/* ─── STATUS & HIGHLIGHTS BAR ─── */}
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-4 sm:p-5 shadow-sm mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Support Desk Active
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 text-xs font-medium">
                <Clock className="w-3.5 h-3.5 text-neutral-500" />
                Avg. Response: &lt; 24h
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 text-xs font-medium">
                <Compass className="w-3.5 h-3.5 text-neutral-500" />
                KMCT Campus, Calicut
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Direct Ops Uplink</span>
            </div>
          </div>
        </div>

        {/* ─── MAIN CONTENT GRID ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Contact Form (7 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-7 bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="border-b border-neutral-100 pb-5 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 tracking-tight">
                Send us a Message
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                Fill in your contact info and details below. Our team reviews all inquiries daily.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Category / Topic Selector */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2.5">
                  Select Topic
                </label>
                <div className="flex flex-wrap gap-2">
                  {INQUIRY_TOPICS.map((item) => {
                    const isSelected = topic === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setTopic(item.id)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? "bg-neutral-900 text-white shadow-sm font-semibold"
                            : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900"
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Name and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Turing"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all bg-neutral-50/40 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@domain.com"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all bg-neutral-50/40 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Message Details */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                    Message Details <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] text-neutral-400">
                    {message.length} / 1000
                  </span>
                </div>
                <div className="relative">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={1000}
                    rows={5}
                    placeholder="Provide details about your query, proposal, or team details..."
                    required
                    className="w-full p-3.5 rounded-xl border border-neutral-200 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all bg-neutral-50/40 focus:bg-white resize-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Submit CTA Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full sm:w-auto px-7 py-3 rounded-full bg-neutral-900 hover:bg-black text-white text-xs sm:text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {sending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Right Column: Direct Info & FAQs (5 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Direct Channels Card */}
            <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-7 shadow-sm">
              <h3 className="text-base sm:text-lg font-bold text-neutral-950 tracking-tight mb-4 flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-600" />
                <span>Direct Contact Channels</span>
              </h3>

              <div className="space-y-4">
                {/* Email Item */}
                <div className="p-4 rounded-2xl bg-neutral-50/80 border border-neutral-200/70 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-neutral-800">
                      <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <span>Email Support</span>
                    </div>
                    <a
                      href="mailto:contact@astraietm.in"
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                    >
                      <span>Mail Us</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="space-y-1.5 text-xs text-neutral-600 pl-7">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-neutral-900">contact@astraietm.in</span>
                      <button
                        type="button"
                        onClick={() => handleCopy("contact@astraietm.in", "mail-astra")}
                        className="p-1 text-neutral-400 hover:text-neutral-900 transition-colors"
                        title="Copy email"
                      >
                        {copiedKey === "mail-astra" ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    <div className="flex items-center justify-between border-t border-neutral-200/60 pt-1.5">
                      <span className="text-neutral-500">cybersecurity@kmct.edu.in</span>
                      <button
                        type="button"
                        onClick={() => handleCopy("cybersecurity@kmct.edu.in", "mail-kmct")}
                        className="p-1 text-neutral-400 hover:text-neutral-900 transition-colors"
                        title="Copy email"
                      >
                        {copiedKey === "mail-kmct" ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Phone Item */}
                <div className="p-4 rounded-2xl bg-neutral-50/80 border border-neutral-200/70 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-neutral-800">
                      <div className="p-1.5 rounded-lg bg-pink-100 text-pink-800">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <span>Helpline &amp; Campus Desk</span>
                    </div>
                    <a
                      href="tel:+919447000000"
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                    >
                      <span>Call</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="space-y-1.5 text-xs text-neutral-600 pl-7">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-neutral-900">+91 94470 00000</span>
                      <button
                        type="button"
                        onClick={() => handleCopy("+919447000000", "phone-mob")}
                        className="p-1 text-neutral-400 hover:text-neutral-900 transition-colors"
                        title="Copy phone"
                      >
                        {copiedKey === "phone-mob" ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    <div className="flex items-center justify-between border-t border-neutral-200/60 pt-1.5">
                      <span className="text-neutral-500">0495 2288500 (Campus Reception)</span>
                      <button
                        type="button"
                        onClick={() => handleCopy("04952288500", "phone-desk")}
                        className="p-1 text-neutral-400 hover:text-neutral-900 transition-colors"
                        title="Copy landline"
                      >
                        {copiedKey === "phone-desk" ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Campus Address Item */}
                <div className="p-4 rounded-2xl bg-neutral-50/80 border border-neutral-200/70 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-neutral-800">
                      <div className="p-1.5 rounded-lg bg-blue-100 text-blue-800">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <span>Event Venue &amp; Campus</span>
                    </div>
                  </div>

                  <div className="text-xs text-neutral-600 space-y-1.5 pl-7">
                    <p className="font-semibold text-neutral-900">
                      KMCT Institute of Emerging Technology and Management
                    </p>
                    <p className="text-neutral-500 leading-relaxed text-[11px]">
                      Manassery PO, Mukkam, Kozhikode (Calicut), Kerala — 673602
                    </p>
                    <div className="pt-2 flex items-center justify-between">
                      <a
                        href="https://maps.google.com/?q=KMCT+Institute+of+Emerging+Technology+and+Management+Mukkam"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900 text-white text-xs font-medium hover:bg-black transition-colors"
                      >
                        <span>Open Maps</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <span className="text-[11px] text-neutral-400">
                        GPS: 11.2952° N, 75.9868° E
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Assist FAQ Accordion */}
            <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-7 shadow-sm">
              <h3 className="text-base sm:text-lg font-bold text-neutral-950 tracking-tight mb-4 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-neutral-700" />
                <span>Frequently Asked Questions</span>
              </h3>

              <div className="space-y-2.5">
                {FAQS.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div
                      key={idx}
                      className="border border-neutral-200/80 rounded-2xl bg-neutral-50/60 overflow-hidden transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full text-left p-3.5 flex items-center justify-between gap-3 text-xs font-semibold text-neutral-900 hover:bg-neutral-100/70 transition-colors"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-neutral-400 flex-shrink-0 transition-transform duration-200 ${
                            isOpen ? "rotate-180 text-neutral-900" : ""
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
                            <div className="p-3.5 pt-0 text-xs text-neutral-600 leading-relaxed border-t border-neutral-100 bg-white">
                              {faq.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}


