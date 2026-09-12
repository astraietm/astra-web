import React from "react";
import { PixelFrame } from "@/components/ui/PixelFrame";
import { StickerBadge } from "@/components/ui/StickerBadge";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-28 pb-16 px-4 bg-graph-paper">
      <div className="max-w-3xl mx-auto">
        <StickerBadge color="mint" rotation={-2}>LEGAL</StickerBadge>
        <h1 className="font-pixel text-3xl font-extrabold uppercase text-black mt-3 mb-8">PRIVACY POLICY</h1>
        <PixelFrame dotGrid cornerAccent className="p-8">
          <div className="prose prose-sm max-w-none font-sans text-gray-700 space-y-4">
            <p>This Privacy Policy describes how ASTRA 2026 collects, uses, and protects your personal information.</p>
            <h3 className="font-pixel text-sm font-bold uppercase mt-6">Information We Collect</h3>
            <p>We collect your name, email, phone number, college, and academic details during registration. We may also collect payment information through our payment processor (Razorpay).</p>
            <h3 className="font-pixel text-sm font-bold uppercase mt-6">How We Use Your Information</h3>
            <p>Your information is used to process registrations, send event updates, generate participation certificates, and for internal record-keeping.</p>
            <h3 className="font-pixel text-sm font-bold uppercase mt-6">Data Protection</h3>
            <p>We implement appropriate security measures to protect your data. We use Google OAuth for authentication and do not store your Google password.</p>
            <h3 className="font-pixel text-sm font-bold uppercase mt-6">Third-Party Services</h3>
            <p>We use Google OAuth for authentication, Razorpay for payments, and Cloudinary for image storage. These services have their own privacy policies.</p>
            <h3 className="font-pixel text-sm font-bold uppercase mt-6">Contact</h3>
            <p>For privacy-related inquiries, contact us at cybersecurity@kmct.edu.in.</p>
            <div className="mt-6 pt-4 border-t border-gray-200 font-mono text-xs text-gray-400">Last updated: September 2026</div>
          </div>
        </PixelFrame>
      </div>
    </div>
  );
}
