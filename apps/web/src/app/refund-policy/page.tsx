import React from "react";
import { PixelFrame } from "@/components/ui/PixelFrame";
import { StickerBadge } from "@/components/ui/StickerBadge";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen pt-28 pb-16 px-4 bg-graph-paper">
      <div className="max-w-3xl mx-auto">
        <StickerBadge color="pink" rotation={-2}>LEGAL</StickerBadge>
        <h1 className="font-pixel text-3xl font-extrabold uppercase text-black mt-3 mb-8">REFUND POLICY</h1>
        <PixelFrame dotGrid cornerAccent className="p-8">
          <div className="prose prose-sm max-w-none font-sans text-gray-700 space-y-4">
            <p>This refund policy applies to all paid events and registrations at ASTRA 2026.</p>
            <h3 className="font-pixel text-sm font-bold uppercase mt-6">Eligibility for Refund</h3>
            <p>Refund requests must be made at least 7 days before the event date. Refunds will be processed within 7-10 business days.</p>
            <h3 className="font-pixel text-sm font-bold uppercase mt-6">Non-Refundable Items</h3>
            <p>Processing fees charged by payment gateways are non-refundable. Free event registrations do not require refund processing.</p>
            <h3 className="font-pixel text-sm font-bold uppercase mt-6">Cancellation by Organizers</h3>
            <p>If ASTRA 2026 cancels an event, all registered participants will receive a full refund automatically.</p>
            <h3 className="font-pixel text-sm font-bold uppercase mt-6">How to Request</h3>
            <p>Send a refund request to contact@astraietm.in with your registration ID and reason for cancellation.</p>
            <div className="mt-6 pt-4 border-t border-gray-200 font-mono text-xs text-gray-400">Last updated: September 2026</div>
          </div>
        </PixelFrame>
      </div>
    </div>
  );
}
