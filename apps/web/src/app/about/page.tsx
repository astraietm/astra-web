"use client";

import React from "react";
import { PixelFrame } from "@/components/ui/PixelFrame";
import { StickerBadge } from "@/components/ui/StickerBadge";

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-28 pb-16 px-4 bg-graph-paper">
      <div className="max-w-4xl mx-auto">
        <StickerBadge color="yellow" rotation={-2}>ABOUT US</StickerBadge>
        <h1 className="font-pixel text-3xl sm:text-5xl font-extrabold uppercase text-black mt-3 mb-8">
          ABOUT ASTRA 2026
        </h1>

        <PixelFrame dotGrid cornerAccent className="p-8 mb-8">
          <h2 className="font-pixel text-xl font-bold uppercase mb-4">THE EVENT</h2>
          <p className="font-sans text-sm text-gray-700 leading-relaxed mb-4">
            ASTRA 2026 is the flagship National Cyber Security Symposium organized by the Department of
            Cyber Security at KMCT Institute of Emerging Technology and Management, Calicut, Kerala. This
            two-day event brings together ethical hackers, cyber security researchers, students, and
            industry professionals for a comprehensive exploration of sovereign cybersecurity.
          </p>
          <p className="font-sans text-sm text-gray-700 leading-relaxed">
            The event features a 24-hour National CTF (Capture The Flag) WarGames competition, hands-on
            workshops on binary exploitation and reverse engineering, keynote sessions by national cyber
            defense leaders, and a research exhibition platform for emerging cybersecurity projects.
          </p>
        </PixelFrame>

        <PixelFrame dotGrid cornerAccent className="p-8 mb-8">
          <h2 className="font-pixel text-xl font-bold uppercase mb-4">OUR MISSION</h2>
          <p className="font-sans text-sm text-gray-700 leading-relaxed mb-4">
            To cultivate the next generation of ethical hackers and cybersecurity professionals through
            hands-on training, competitive wargames, and exposure to real-world threat landscapes.
          </p>
          <ul className="space-y-3 text-sm font-sans text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              Bridge the gap between academic cybersecurity education and industry demands
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              Foster a national community of ethical hackers and security researchers
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              Provide hands-on experience with enterprise security tools and methodologies
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              Promote responsible vulnerability disclosure and sovereign digital defense
            </li>
          </ul>
        </PixelFrame>

        <PixelFrame dotGrid cornerAccent className="p-8 mb-8">
          <h2 className="font-pixel text-xl font-bold uppercase mb-4 text-center">MEET OUR TEAM</h2>
          <div className="w-full rounded-xl overflow-hidden shadow-lg border-2 border-black/10 bg-neutral-100 flex items-center justify-center min-h-[300px]">
            {/* The image uploaded by the user will be displayed here */}
            <img 
              src="/team.png" 
              alt="Meet Our Team - Astra 2026" 
              className="w-full h-auto object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null; // Prevent infinite loop
                target.parentElement!.innerHTML = '<div class="text-center p-8 text-neutral-500 font-sans font-medium"><p>Please save your uploaded team image as <strong>team.png</strong> inside the <strong>public/</strong> folder.</p></div>';
              }}
            />
          </div>
        </PixelFrame>

        <PixelFrame dotGrid cornerAccent className="p-8">
          <h2 className="font-pixel text-xl font-bold uppercase mb-4">THE DEPARTMENT</h2>
          <p className="font-sans text-sm text-gray-700 leading-relaxed">
            The Department of Cyber Security at KMCT Institute of Emerging Technology and Management
            offers cutting-edge programs in cybersecurity, ethical hacking, digital forensics, and
            information security. With state-of-the-art labs and a faculty of experienced security
            professionals, the department is committed to producing industry-ready graduates who can
            tackle the evolving cyber threat landscape.
          </p>
          <div className="mt-4 pt-4 border-t border-gray-200 font-mono text-xs text-gray-500">
            KMCT Institute of Emerging Technology and Management, Manassery PO, Mukkam, Calicut, Kerala — 673602
          </div>
        </PixelFrame>
      </div>
    </div>
  );
}
