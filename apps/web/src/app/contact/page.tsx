"use client";

import React, { useState } from "react";
import { PixelFrame } from "@/components/ui/PixelFrame";
import { StickerBadge } from "@/components/ui/StickerBadge";
import { useToast } from "@/lib/toast-context";
import api from "@/lib/api";
import { Send, Loader2, Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showToast("Please fill in all fields.", "error");
      return;
    }
    setSending(true);
    try {
      await api.post("/api/ops/contact-us/", { name, email, message });
      showToast("Message sent successfully! We'll get back to you soon.", "success");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      showToast("Failed to send message. Please try again.", "error");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 bg-graph-paper">
      <div className="max-w-4xl mx-auto">
        <StickerBadge color="lime" rotation={-2}>CONTACT</StickerBadge>
        <h1 className="font-pixel text-3xl sm:text-5xl font-extrabold uppercase text-black mt-3 mb-8">
          GET IN TOUCH
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <PixelFrame dotGrid cornerAccent className="p-8">
            <h2 className="font-pixel text-lg font-bold uppercase mb-4">SEND US A MESSAGE</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-mono text-xs font-bold uppercase text-gray-700 mb-1 block">Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                  className="w-full px-3 py-2.5 border-2 border-black font-sans text-sm shadow-[2px_2px_0px_#000] focus:outline-none focus:ring-2 focus:ring-th-yellow" />
              </div>
              <div>
                <label className="font-mono text-xs font-bold uppercase text-gray-700 mb-1 block">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full px-3 py-2.5 border-2 border-black font-sans text-sm shadow-[2px_2px_0px_#000] focus:outline-none focus:ring-2 focus:ring-th-yellow" />
              </div>
              <div>
                <label className="font-mono text-xs font-bold uppercase text-gray-700 mb-1 block">Message</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={5}
                  className="w-full px-3 py-2.5 border-2 border-black font-sans text-sm shadow-[2px_2px_0px_#000] focus:outline-none focus:ring-2 focus:ring-th-yellow resize-none" />
              </div>
              <button type="submit" disabled={sending}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-black text-white font-display font-bold text-sm uppercase tracking-wider border-2 border-black hover:bg-th-yellow hover:text-black transition-colors shadow-[3px_3px_0px_#000] disabled:opacity-50">
                {sending ? <><Loader2 className="w-4 h-4 animate-spin" /> SENDING...</> : <><Send className="w-4 h-4" /> SEND MESSAGE</>}
              </button>
            </form>
          </PixelFrame>

          <div className="space-y-6">
            <PixelFrame dotGrid cornerAccent className="p-8">
              <h2 className="font-pixel text-lg font-bold uppercase mb-4">CONTACT INFO</h2>
              <div className="space-y-4 text-sm font-sans text-gray-700">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-mono text-xs font-bold uppercase text-gray-500 mb-1">Email</p>
                    <p>cybersecurity@kmct.edu.in</p>
                    <p>contact@astraietm.in</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-mono text-xs font-bold uppercase text-gray-500 mb-1">Phone</p>
                    <p>+91 94470 00000</p>
                    <p>0495 2288500</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-mono text-xs font-bold uppercase text-gray-500 mb-1">Address</p>
                    <p>KMCT Institute of Emerging Technology and Management</p>
                    <p>Manassery PO, Mukkam, Calicut, Kerala — 673602</p>
                  </div>
                </div>
              </div>
            </PixelFrame>
          </div>
        </div>
      </div>
    </div>
  );
}
