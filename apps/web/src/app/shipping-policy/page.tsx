import React from "react";
import { PixelFrame } from "@/components/ui/PixelFrame";
import { StickerBadge } from "@/components/ui/StickerBadge";

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen pt-28 pb-16 px-4 bg-graph-paper">
      <div className="max-w-3xl mx-auto">
        <StickerBadge color="lilac" rotation={-2}>LEGAL</StickerBadge>
        <h1 className="font-pixel text-3xl font-extrabold uppercase text-black mt-3 mb-8">SHIPPING &amp; DELIVERY POLICY</h1>
        <PixelFrame dotGrid cornerAccent className="p-8">
          <div className="prose prose-sm max-w-none font-sans text-gray-700 space-y-4">
            <p>ASTRA 2026 is primarily an in-person event. This policy covers the delivery of digital assets and physical event materials.</p>
            <h3 className="font-pixel text-sm font-bold uppercase mt-6">Digital Deliverables</h3>
            <p>Event tickets, QR codes, and certificates of participation are delivered digitally via email and through your ASTRA dashboard immediately upon registration or event completion.</p>
            <h3 className="font-pixel text-sm font-bold uppercase mt-6">Physical Materials</h3>
            <p>Delegate kits, badges, and certificates are distributed at the venue during the event. We do not ship physical materials post-event unless explicitly communicated.</p>
            <h3 className="font-pixel text-sm font-bold uppercase mt-6">Contact</h3>
            <p>For queries regarding delivery, contact cybersecurity@kmct.edu.in.</p>
            <div className="mt-6 pt-4 border-t border-gray-200 font-mono text-xs text-gray-400">Last updated: September 2026</div>
          </div>
        </PixelFrame>
      </div>
    </div>
  );
}
