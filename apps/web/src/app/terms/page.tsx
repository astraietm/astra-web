import React from "react";
import { PixelFrame } from "@/components/ui/PixelFrame";
import { StickerBadge } from "@/components/ui/StickerBadge";

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-28 pb-16 px-4 bg-graph-paper">
      <div className="max-w-3xl mx-auto">
        <StickerBadge color="yellow" rotation={-2}>LEGAL</StickerBadge>
        <h1 className="font-pixel text-3xl font-extrabold uppercase text-black mt-3 mb-8">TERMS &amp; CONDITIONS</h1>
        <PixelFrame dotGrid cornerAccent className="p-8">
          <div className="prose prose-sm max-w-none font-sans text-gray-700 space-y-4">
            <p>Welcome to ASTRA 2026, organized by the Department of Cyber Security, KMCT Institute of Emerging Technology and Management. By accessing or registering for ASTRA 2026, you agree to comply with and be bound by the following terms.</p>
            <h3 className="font-pixel text-sm font-bold uppercase mt-6">1. Registration &amp; Eligibility</h3>
            <p>All participants must provide accurate personal information during registration. ASTRA reserves the right to verify identity and academic credentials at the venue.</p>
            <h3 className="font-pixel text-sm font-bold uppercase mt-6">2. Event Participation</h3>
            <p>Participants agree to follow all event rules, including CTF competition guidelines, lab safety protocols, and venue conduct policies. Any violations may result in disqualification.</p>
            <h3 className="font-pixel text-sm font-bold uppercase mt-6">3. Intellectual Property</h3>
            <p>Participants retain ownership of their own projects and research. By participating, you grant ASTRA permission to photograph and record activities for promotional use.</p>
            <h3 className="font-pixel text-sm font-bold uppercase mt-6">4. Code of Conduct</h3>
            <p>All participants must maintain ethical hacking standards. Any attempt to disrupt event infrastructure, access unauthorized systems, or engage in malicious activities will result in immediate removal.</p>
            <h3 className="font-pixel text-sm font-bold uppercase mt-6">5. Liability</h3>
            <p>ASTRA and KMCT are not liable for any personal injury, loss of property, or data breach occurring during the event. Participants attend at their own risk.</p>
            <h3 className="font-pixel text-sm font-bold uppercase mt-6">6. Modifications</h3>
            <p>ASTRA reserves the right to modify event schedules, rules, and these terms at any time. Changes will be communicated through official channels.</p>
            <div className="mt-6 pt-4 border-t border-gray-200 font-mono text-xs text-gray-400">
              Last updated: September 2026
            </div>
          </div>
        </PixelFrame>
      </div>
    </div>
  );
}
