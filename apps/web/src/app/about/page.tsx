"use client";

import React from "react";
import { BlackBanner } from "@/components/ui/BlackBanner";
import { StickerBadge } from "@/components/ui/StickerBadge";

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-8 bg-graph-paper">
      <div className="max-w-4xl mx-auto">
        {/* Header with TinkerHub Tilted Black Banner */}
        <div className="mb-10 sm:mb-12">
          <BlackBanner size="lg">ABOUT ASTRA 2026</BlackBanner>
          <p className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-black mt-3 font-normal leading-tight">
            Building Kerala&apos;s sovereign defense vanguard through ethical hacking &amp; zero-day research.
          </p>
        </div>

        {/* Tactile Paper Card: The Event */}
        <div className="relative mb-8">
          {/* Silver pushpin accent */}
          <div className="w-1.5 h-5 bg-gradient-to-r from-gray-400 via-white to-gray-600 rounded-xs mx-auto -mb-2 relative z-10 border border-gray-500" />
          <div className="paper-texture bg-white border-2 border-black p-6 sm:p-10 rotate-[-0.5deg]">
            <div className="flex items-center justify-between mb-4 border-b-2 border-black pb-3">
              <h2 className="font-display text-2xl sm:text-3xl uppercase leading-none text-black">
                THE EVENT
              </h2>
              <StickerBadge color="yellow" rotation={2}>OCTOBER 6 &amp; 7, 2026</StickerBadge>
            </div>
            <p className="font-body text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
              ASTRA 2026 is the flagship National Cyber Security Symposium organized by the Department of
              Cyber Security at KMCT Institute of Emerging Technology and Management, Calicut, Kerala. This
              two-day event brings together ethical hackers, cyber security researchers, students, and
              industry professionals for a comprehensive exploration of sovereign cybersecurity.
            </p>
            <p className="font-body text-sm sm:text-base text-gray-700 leading-relaxed">
              The event features a 24-hour National CTF (Capture The Flag) WarGames competition, hands-on
              workshops on binary exploitation and reverse engineering, keynote sessions by national cyber
              defense leaders, and a research exhibition platform for emerging cybersecurity projects.
            </p>
          </div>
        </div>

        {/* Tactile Paper Card: Our Mission */}
        <div className="relative mb-8">
          <div className="w-1.5 h-5 bg-gradient-to-r from-gray-400 via-white to-gray-600 rounded-xs mx-auto -mb-2 relative z-10 border border-gray-500" />
          <div className="paper-texture bg-white border-2 border-black p-6 sm:p-10 rotate-[0.5deg]">
            <div className="flex items-center justify-between mb-4 border-b-2 border-black pb-3">
              <h2 className="font-display text-2xl sm:text-3xl uppercase leading-none text-black">
                OUR MISSION
              </h2>
              <StickerBadge color="pink" rotation={-2}>KMCT DEFENSE CORE</StickerBadge>
            </div>
            <p className="font-serif italic text-xl sm:text-2xl text-gray-900 leading-snug mb-6 font-normal">
              &ldquo;To cultivate the next generation of ethical hackers and cybersecurity professionals through
              hands-on training, competitive wargames, and exposure to real-world threat landscapes.&rdquo;
            </p>
            <ul className="space-y-3 font-body text-sm text-gray-700">
              <li className="flex items-start gap-2.5">
                <span className="text-black font-bold font-pixel text-xs">✦</span>
                Bridge the gap between academic cybersecurity education and industry demands
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-black font-bold font-pixel text-xs">✦</span>
                Foster a national community of ethical hackers and security researchers
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-black font-bold font-pixel text-xs">✦</span>
                Provide hands-on experience with enterprise security tools and methodologies
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-black font-bold font-pixel text-xs">✦</span>
                Promote responsible vulnerability disclosure and sovereign digital defense
              </li>
            </ul>
          </div>
        </div>

        {/* Tactile Paper Card: The Department */}
        <div className="relative">
          <div className="paper-texture bg-white border-2 border-black p-6 sm:p-10">
            <div className="flex items-center justify-between mb-4 border-b-2 border-black pb-3">
              <h2 className="font-display text-2xl sm:text-3xl uppercase leading-none text-black">
                THE DEPARTMENT
              </h2>
              <span className="font-pixel text-[10px] bg-black text-white px-2 py-0.5 uppercase">
                EST. KMCT
              </span>
            </div>
            <p className="font-body text-sm sm:text-base text-gray-700 leading-relaxed">
              The Department of Cyber Security at KMCT Institute of Emerging Technology and Management
              offers cutting-edge programs in cybersecurity, ethical hacking, digital forensics, and
              information security. With state-of-the-art labs and a faculty of experienced security
              professionals, the department is committed to producing industry-ready graduates who can
              tackle the evolving cyber threat landscape.
            </p>
            <div className="mt-6 pt-4 border-t-2 border-black/10 font-body text-xs text-gray-500 font-medium">
              KMCT Institute of Emerging Technology and Management, Manassery PO, Mukkam, Calicut, Kerala — 673602
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
