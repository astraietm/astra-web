'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ArrowUpRight } from 'lucide-react';

interface EventItem {
  id: string;
  iconType: 'purple-clover' | 'cyan-loop' | 'blue-star' | 'orange-cross' | 'pink-butterfly' | 'gold-gear' | 'emerald-chevron';
  date: string;
  time: string;
  title: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  venueTitle: string;
  venueSub: string;
  attendeesCount: string;
  categoryTag: string;
  categoryColor: string;
  hostName: string;
  hostAvatar: string;
  topics: string;
  posterBadge: string;
  posterHeading: string;
  posterSub: string;
  posterBg: string;
  descriptionHeading: string;
  paragraphs: string[];
}

const EVENTS_DATA: EventItem[] = [
  {
    id: 'ctf-wargame',
    iconType: 'purple-clover',
    date: 'October 6',
    time: '11:00 AM',
    title: '24H National Live CTF WarGames Kickoff',
    startDate: 'Oct 06',
    startTime: '11:00 AM',
    endDate: 'Oct 07',
    endTime: '11:00 AM',
    venueTitle: 'KMCT Arena',
    venueSub: 'Calicut Campus',
    attendeesCount: '128 makers & hackers are attending',
    categoryTag: 'Flagship',
    categoryColor: 'bg-[#D1FAE5] text-[#065F46]',
    hostName: 'Mohammed Hashim',
    hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    topics: 'Ethical Hacking, Reverse Engineering, Cryptography',
    posterBadge: 'BUILDER -IN-RESIDENCE // WARGAME EDITION',
    posterHeading: 'DEMO DAY',
    posterSub: 'OCT 6-7, 11AM - 11AM',
    posterBg: '#FFE816',
    descriptionHeading: 'Flagship 24H National Live CTF WarGame',
    paragraphs: [
      'For weeks now, a room full of makers and ethical hackers at KMCT Cyber Security has been heads-down building defense infrastructure from scratch. Ideas turned into exploits, circuits into prototypes, and prototypes into sovereign defensive systems that actually work.',
      "Now they're ready to show you. Step into the arena, see what they've built, ask questions, and cheer them on. These folks have poured weeks of evenings into this, and having you in the room means more than you'd think.",
      'Come celebrate and defend with us.',
    ],
  },
  {
    id: 'keynote',
    iconType: 'cyan-loop',
    date: 'October 6',
    time: '9:00 AM',
    title: 'Opening Ceremony & Sovereign Defense Keynote',
    startDate: 'Oct 06',
    startTime: '9:00 AM',
    endDate: 'Oct 06',
    endTime: '10:30 AM',
    venueTitle: 'Main Auditorium',
    venueSub: 'KMCT IETM Calicut',
    attendeesCount: '250+ delegates attending',
    categoryTag: 'Keynote',
    categoryColor: 'bg-[#FEF3C7] text-[#92400E]',
    hostName: 'Dr. Sarah Lin & Dept Head',
    hostAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    topics: 'Sovereign Tech, National Security Policy, Zero-Trust',
    posterBadge: 'NATIONAL SYMPOSIUM // INAUGURAL',
    posterHeading: 'KEYNOTE',
    posterSub: 'OCT 6, 9:00 AM - 10:30 AM',
    posterBg: '#FFE816',
    descriptionHeading: 'Opening Ceremony: Sovereign Defense Architecture',
    paragraphs: [
      'Join pioneering researchers, government cyber analysts, and defense leaders as we inaugurate ASTRA 2026. This keynote establishes India’s emerging posture toward self-reliant hardware and sovereign cryptographic systems.',
      'We examine modern supply-chain attacks, critical infrastructure resilience, and how student-led research is directly fortifying national resilience.',
      'Open to all registered attendees, students, and industry professionals.',
    ],
  },
  {
    id: 'zero-day',
    iconType: 'blue-star',
    date: 'October 6',
    time: '2:00 PM',
    title: 'Zero-Day Exploit Development Symposium',
    startDate: 'Oct 06',
    startTime: '2:00 PM',
    endDate: 'Oct 06',
    endTime: '4:00 PM',
    venueTitle: 'Lab Complex B',
    venueSub: 'Offensive Security Lab',
    attendeesCount: '84 security researchers attending',
    categoryTag: 'Research',
    categoryColor: 'bg-[#E0E7FF] text-[#3730A3]',
    hostName: 'Arjun Nambiar',
    hostAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    topics: 'Kernel Exploitation, ROP Chains, Modern Mitigations',
    posterBadge: 'OFFENSIVE RESEARCH // DEEP DIVE',
    posterHeading: 'EXPLOIT LAB',
    posterSub: 'OCT 6, 2:00 PM - 4:00 PM',
    posterBg: '#FFE816',
    descriptionHeading: 'Zero-Day Vulnerability Research & Triage',
    paragraphs: [
      'A deep dive into advanced exploitation techniques on modern Linux and Windows environments. Covering return-oriented programming (ROP), sandbox escapes, and bypassing hardware-enforced pointer authentication.',
      'Participants will walk through real-world CVE disclosures and examine how defensive teams patch weaponized memory vulnerabilities before mass exploitation.',
      'Prerequisites: Working familiarity with C and x86_64 assembly.',
    ],
  },
  {
    id: 'hardware-iot',
    iconType: 'orange-cross',
    date: 'October 6',
    time: '4:30 PM',
    title: 'Hardware Hacking & IoT Village Live Defense',
    startDate: 'Oct 06',
    startTime: '4:30 PM',
    endDate: 'Oct 06',
    endTime: '6:30 PM',
    venueTitle: 'Hardware Village',
    venueSub: 'TinkerSpace Wing',
    attendeesCount: '96 makers attending',
    categoryTag: 'Village',
    categoryColor: 'bg-[#FFEDD5] text-[#9A3412]',
    hostName: 'Kavya Suresh',
    hostAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    topics: 'UART, JTAG, Firmware Dumping, SDR Radio Defense',
    posterBadge: 'PHYSICAL SECURITY // IOT VILLAGE',
    posterHeading: 'HARDWARE',
    posterSub: 'OCT 6, 4:30 PM - 6:30 PM',
    posterBg: '#FFE816',
    descriptionHeading: 'Hardware Village: Physical & Firmware Exploits',
    paragraphs: [
      'Get hands-on with logic analyzers, multimeters, and SDR transceivers. We open up commercial smart devices, extract firmware via SPI flash, and uncover undocumented debugging interfaces.',
      'Explore how attackers intercept unencrypted RF communications and learn the countermeasures hardware engineers implement to build tamper-proof systems.',
      'All testing rigs, microcontrollers, and target boards provided on site.',
    ],
  },
  {
    id: 'ghidra-re',
    iconType: 'pink-butterfly',
    date: 'October 6',
    time: '7:30 PM',
    title: 'Memory Corruption with Ghidra Reverse Engineering',
    startDate: 'Oct 06',
    startTime: '7:30 PM',
    endDate: 'Oct 06',
    endTime: '9:30 PM',
    venueTitle: 'Virtual Studio 1',
    venueSub: 'KMCT Cyber Lab',
    attendeesCount: '112 engineers attending',
    categoryTag: 'Workshop',
    categoryColor: 'bg-[#FCE7F3] text-[#9D174D]',
    hostName: 'Sreehari Nandan',
    hostAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
    topics: 'Static Analysis, Decompilation, Ghidra Scripts',
    posterBadge: 'REVERSE ENGINEERING // HANDS-ON',
    posterHeading: 'GHIDRA LAB',
    posterSub: 'OCT 6, 7:30 PM - 9:30 PM',
    posterBg: '#FFE816',
    descriptionHeading: 'Mastering Ghidra for Reverse Engineering',
    paragraphs: [
      'Learn how malware analysts disassemble compiled binaries and reconstruct high-level logic without source code. This workshop guides you through Ghidra’s headless analyzer and script automation.',
      'You will analyze proprietary network protocols and reverse engineer custom binary formats step-by-step.',
      'Bring your laptop with Ghidra and Java 17 pre-installed.',
    ],
  },
  {
    id: 'ai-defense',
    iconType: 'gold-gear',
    date: 'October 7',
    time: '9:30 AM',
    title: 'AI in Cyber Defense: From Threat Detection to Adversarial AI',
    startDate: 'Oct 07',
    startTime: '9:30 AM',
    endDate: 'Oct 07',
    endTime: '11:00 AM',
    venueTitle: 'Auditorium 2',
    venueSub: 'Center for AI Studies',
    attendeesCount: '170 delegates attending',
    categoryTag: 'Symposium',
    categoryColor: 'bg-[#FEF3C7] text-[#92400E]',
    hostName: 'Dr. Anand Varma',
    hostAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    topics: 'Adversarial Attacks, LLM Red Teaming, Automated SOC',
    posterBadge: 'AI RESEARCH // ADVERSARIAL',
    posterHeading: 'AI DEFENSE',
    posterSub: 'OCT 7, 9:30 AM - 11:00 AM',
    posterBg: '#FFE816',
    descriptionHeading: 'Adversarial Machine Learning & Automated Defense',
    paragraphs: [
      'As machine learning models take charge of intrusion detection and automated triage, attackers are crafting prompt injections, model poisoning, and evasion artifacts to blind neural networks.',
      'We explore both sides of the coin: utilizing autonomous agents to hunt stealthy adversaries, and red-teaming internal enterprise LLM deployments.',
      'Case studies include real-world bypasses of leading cloud security scanners.',
    ],
  },
  {
    id: 'ctf-finals',
    iconType: 'emerald-chevron',
    date: 'October 7',
    time: '3:30 PM',
    title: 'CTF Finals & ₹100K Bounty Awards Ceremony',
    startDate: 'Oct 07',
    startTime: '3:30 PM',
    endDate: 'Oct 07',
    endTime: '5:30 PM',
    venueTitle: 'Main Amphitheatre',
    venueSub: 'KMCT Campus',
    attendeesCount: '400+ attendees registered',
    categoryTag: 'Ceremony',
    categoryColor: 'bg-[#CCFBF1] text-[#115E59]',
    hostName: 'ASTRA Organizing Committee',
    hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    topics: 'Grand Finale, CTF Writeups, ₹100,000 Cash Prize',
    posterBadge: 'GRAND FINALE // ₹100K POOL',
    posterHeading: 'AWARDS',
    posterSub: 'OCT 7, 3:30 PM - 5:30 PM',
    posterBg: '#FFE816',
    descriptionHeading: 'National CTF Finals & Closing Ceremony',
    paragraphs: [
      'The culmination of 24 sleepless hours of intense collegiate hacking. The scoreboard freezes, winning teams present lightning write-ups of their critical solves, and trophies are awarded.',
      'Featuring ₹100,000+ in bounties, recruitment opportunities with top cybersecurity firms, and closing reflections by national industry leaders.',
      'Celebrate with the champion teams and the entire Kerala cyber defense community.',
    ],
  },
];

const EventGlyph: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case 'purple-clover':
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
          <circle cx="7.5" cy="7.5" r="4.5" fill="#C084FC" />
          <circle cx="16.5" cy="7.5" r="4.5" fill="#C084FC" />
          <circle cx="7.5" cy="16.5" r="4.5" fill="#C084FC" />
          <circle cx="16.5" cy="16.5" r="4.5" fill="#C084FC" />
        </svg>
      );
    case 'cyan-loop':
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
          <path d="M6 7C4 10 4 14 6 17" stroke="#06B6D4" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M10 5C8 9 8 15 10 19" stroke="#06B6D4" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M18 7C20 10 20 14 18 17" stroke="#06B6D4" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M14 5C16 9 16 15 14 19" stroke="#06B6D4" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
    case 'blue-star':
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
          <path
            d="M12 2L14.2 8.5L21 9.2L16 13.8L17.5 20.5L12 17L6.5 20.5L8 13.8L3 9.2L9.8 8.5L12 2Z"
            fill="#3B82F6"
          />
        </svg>
      );
    case 'orange-cross':
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
          <rect x="3" y="3" width="7" height="7" rx="1.5" fill="#F97316" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" fill="#F97316" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" fill="#F97316" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" fill="#F97316" />
        </svg>
      );
    case 'pink-butterfly':
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
          <path d="M4 5L11 12L4 19V5Z" fill="#F43F5E" />
          <path d="M20 5L13 12L20 19V5Z" fill="#F43F5E" />
        </svg>
      );
    case 'gold-gear':
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
          <circle cx="12" cy="12" r="8" stroke="#EAB308" strokeWidth="2" strokeDasharray="3 3" />
          <circle cx="12" cy="12" r="4" fill="#EAB308" />
        </svg>
      );
    case 'emerald-chevron':
    default:
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
          <path d="M5 7L12 13L19 7" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 12L12 18L19 12" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
};

export const EventsSection: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeEvent = EVENTS_DATA[selectedIndex] || EVENTS_DATA[0];

  return (
    <section id="events" className="relative py-14 sm:py-20 bg-graph-paper overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* ─── 1. FEATURED EVENT WHITE CARD (EXACT 2-COLUMN SPLIT FROM REFERENCE IMAGE) ─── */}
        <div className="relative mb-14 sm:mb-20">
          {/* Cute Pink Mascot Blob Peeking from Left Edge behind Card */}
          <div className="absolute -left-6 sm:-left-8 top-[44%] -translate-y-1/2 z-0 pointer-events-none select-none">
            <svg width="60" height="60" viewBox="0 0 64 64" fill="none" className="transform -rotate-6">
              <path
                d="M16 38C10 38 6 33 6 27C6 21 11 16 17 16C18 10 24 6 32 6C40 6 45 10 47 16C53 16 58 21 58 27C58 33 54 38 48 38C50 42 48 48 42 51C37 54 27 54 22 51C17 48 16 42 16 38Z"
                fill="#F79CFF"
              />
              <circle cx="25" cy="28" r="2.2" fill="#000000" />
              <circle cx="39" cy="28" r="2.2" fill="#000000" />
              <path
                d="M28 34C30 37 34 37 36 34"
                stroke="#000000"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* White Card Container */}
          <div className="relative z-10 bg-white border border-gray-200/90 shadow-sm p-6 sm:p-8 md:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeEvent.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-start"
              >
                {/* ── LEFT COLUMN ── */}
                <div className="flex flex-col justify-between">
                  {/* Poster Graphic Banner */}
                  <div
                    className="w-full aspect-[16/11] p-6 sm:p-8 flex flex-col justify-between rounded-none select-none relative overflow-hidden"
                    style={{ backgroundColor: activeEvent.posterBg }}
                  >
                    {/* Top Row: Left Label + Center Logo + Right Icon */}
                    <div className="flex items-center justify-between text-black text-[10px] sm:text-xs font-bold tracking-wider uppercase">
                      <span>TINKERSPACE // KOCHI</span>
                      <div className="flex items-center gap-1.5 font-bold">
                        <span className="w-2.5 h-2.5 bg-black rounded-full inline-block" />
                        <span>CIRCUIT LAB</span>
                      </div>
                      <span>ASTRA 2026</span>
                    </div>

                    {/* Center: Red/Orange Stencil Badge + Giant Bold DEMO DAY / Headline + Sub */}
                    <div className="text-center my-auto py-2">
                      <div className="inline-block bg-[#E11D48] text-white font-black text-[10px] sm:text-xs px-2.5 py-0.5 uppercase tracking-widest mb-2 font-mono">
                        {activeEvent.posterBadge}
                      </div>
                      <h2 className="font-black text-4xl sm:text-5xl md:text-6xl text-black uppercase tracking-tight leading-none">
                        {activeEvent.posterHeading}
                      </h2>
                      <p className="font-bold text-black text-xs sm:text-sm uppercase tracking-wider mt-2">
                        {activeEvent.posterSub}
                      </p>
                    </div>

                    {/* Bottom Edge Minimal Bar */}
                    <div className="w-full h-1 bg-black/10" />
                  </div>

                  {/* Title in Serif Italic */}
                  <h3 className="font-serif italic text-2xl sm:text-3xl text-gray-950 mt-5 leading-tight font-normal">
                    {activeEvent.title}
                  </h3>

                  {/* Attendees Row & Black Register Button */}
                  <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-1">
                    <div className="flex items-center">
                      <div className="flex -space-x-2 overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80"
                          alt="Attendee"
                          className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                        />
                        <img
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80"
                          alt="Attendee"
                          className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                        />
                        <img
                          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&auto=format&fit=crop&q=80"
                          alt="Attendee"
                          className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                        />
                        <img
                          src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&auto=format&fit=crop&q=80"
                          alt="Attendee"
                          className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                        />
                      </div>
                      <span className="font-sans text-xs text-gray-600 font-normal ml-3">
                        {activeEvent.attendeesCount}
                      </span>
                    </div>

                    <Link
                      href="/events"
                      className="px-5 py-2.5 bg-black text-white font-sans font-semibold text-xs uppercase tracking-wider rounded-none hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                      Register Now
                    </Link>
                  </div>

                  {/* Date, Time & Location Footer Grid */}
                  <div className="grid grid-cols-3 gap-2 mt-8 pt-6 border-t border-gray-100 text-left">
                    <div>
                      <p className="font-sans text-xs text-gray-900 font-semibold">{activeEvent.startDate}</p>
                      <p className="font-sans text-[11px] text-gray-500 mt-0.5">{activeEvent.startTime}</p>
                    </div>
                    <div className="border-l border-gray-100 pl-3">
                      <p className="font-sans text-xs text-gray-900 font-semibold">{activeEvent.endDate}</p>
                      <p className="font-sans text-[11px] text-gray-500 mt-0.5">{activeEvent.endTime}</p>
                    </div>
                    <div className="border-l border-gray-100 pl-3">
                      <p className="font-sans text-xs text-gray-900 font-semibold truncate">{activeEvent.venueTitle}</p>
                      <p className="font-sans text-[11px] text-gray-500 mt-0.5 truncate">{activeEvent.venueSub}</p>
                    </div>
                  </div>
                </div>

                {/* ── RIGHT COLUMN ── */}
                <div className="flex flex-col justify-start">
                  {/* Top Pill Badges */}
                  <div className="flex items-center gap-2 mb-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-none text-xs font-medium bg-gray-100/90 text-gray-700 border border-gray-200/80">
                      <Globe className="w-3.5 h-3.5 text-gray-500" />
                      Public
                    </span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-none text-xs font-medium ${activeEvent.categoryColor}`}>
                      {activeEvent.categoryTag}
                    </span>
                  </div>

                  {/* Metadata Rows */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center">
                      <span className="font-sans text-xs text-gray-400 w-32 flex-shrink-0">Hosts</span>
                      <div className="flex items-center gap-2 font-sans text-xs text-gray-800 font-medium">
                        <img
                          src={activeEvent.hostAvatar}
                          alt={activeEvent.hostName}
                          className="w-5 h-5 rounded-full object-cover border border-gray-200"
                        />
                        <span>{activeEvent.hostName}</span>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <span className="font-sans text-xs text-gray-400 w-32 flex-shrink-0 pt-0.5">Topics & themes</span>
                      <span className="font-sans text-xs text-gray-700 leading-relaxed">
                        {activeEvent.topics}
                      </span>
                    </div>
                  </div>

                  {/* Description Body */}
                  <div className="border-t border-gray-100 pt-6 space-y-4">
                    <h4 className="font-sans font-semibold text-xs sm:text-sm text-gray-900">
                      {activeEvent.descriptionHeading}
                    </h4>

                    {activeEvent.paragraphs.map((paragraph, pIdx) => (
                      <p
                        key={pIdx}
                        className="font-sans text-xs sm:text-[13px] text-gray-600 leading-relaxed font-normal"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ─── 2. "THESE MIGHT INTEREST YOU" EVENT LIST (MATCHING EXACT BOTTOM SECTION OF REFERENCE) ─── */}
        <div>
          <h3 className="font-sans font-bold text-sm sm:text-base text-gray-950 mb-3 tracking-tight">
            These might interest you
          </h3>

          <div className="bg-white border border-gray-200/90 divide-y divide-gray-100 shadow-xs">
            {EVENTS_DATA.map((item, index) => {
              const isSelected = selectedIndex === index;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedIndex(index);
                    const el = document.getElementById('events');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className={`group flex items-center justify-between py-3.5 sm:py-4 px-4 sm:px-6 hover:bg-gray-50/80 cursor-pointer transition-colors duration-150 ${
                    isSelected ? 'bg-amber-50/25' : ''
                  }`}
                >
                  {/* Left: Event Glyph */}
                  <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center flex-shrink-0 mr-4 sm:mr-6">
                    <EventGlyph type={item.iconType} />
                  </div>

                  {/* Date */}
                  <div className="w-28 sm:w-36 flex-shrink-0">
                    <span className="font-sans text-xs sm:text-sm text-gray-900 font-medium">
                      {item.date}
                    </span>
                  </div>

                  {/* Time */}
                  <div className="w-20 sm:w-24 flex-shrink-0 hidden xs:block">
                    <span className="font-sans text-[11px] sm:text-xs text-gray-400 font-normal">
                      {item.time}
                    </span>
                  </div>

                  {/* Title in Serif Italic */}
                  <div className="flex-grow min-w-0 pr-4">
                    <span
                      className={`font-serif italic text-base sm:text-lg md:text-xl truncate block font-normal transition-colors ${
                        isSelected ? 'text-black font-medium' : 'text-gray-900 group-hover:text-black'
                      }`}
                    >
                      {item.title}
                    </span>
                  </div>

                  {/* Right: Diagonal Arrow */}
                  <div className="flex-shrink-0 text-gray-400 group-hover:text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                    <ArrowUpRight className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* View Full Schedule Link */}
          <div className="pt-4 flex justify-between items-center text-xs">
            <Link
              href="/events"
              className="font-sans font-semibold text-gray-600 hover:text-black hover:underline transition-colors inline-flex items-center gap-1 uppercase tracking-wider"
            >
              Browse Full ASTRA 2026 Schedule →
            </Link>
            <span className="font-mono text-[11px] text-gray-400">
              KMCT Institute of Emerging Technology and Management, Calicut
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
