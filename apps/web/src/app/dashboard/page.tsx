"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PixelFrame } from "@/components/ui/PixelFrame";
import { StickerBadge } from "@/components/ui/StickerBadge";
import { useAuth } from "@/lib/auth-context";
import api from "@/lib/api";
import { Calendar, MapPin, Loader2, QrCode, Ticket, ArrowRight } from "lucide-react";

interface Registration {
  id: number;
  event_details: {
    id: number;
    title: string;
    event_date: string;
    venue: string;
    category: string;
  };
  status: string;
  timestamp: string;
  qr_code: string;
  team_name: string;
  team_members: string;
  payment_details?: {
    status: string;
    amount: string;
  };
}

import { TicketPass } from "@/components/events/TicketPass";

export default function DashboardPage() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
      return;
    }

    if (token) {
      const fetchRegistrations = async () => {
        try {
          const res = await api.get("/api/my-registrations/");
          setRegistrations(res.data);
        } catch {
          // Handle error silently
        } finally {
          setLoading(false);
        }
      };
      fetchRegistrations();
    }
  }, [user, token, authLoading]);

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 bg-graph-paper">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <StickerBadge color="pink" rotation={-2}>YOUR PROFILE</StickerBadge>
          <h1 className="font-pixel text-3xl sm:text-4xl font-extrabold uppercase text-black mt-3">
            MY EVENT PASSES
          </h1>
          <p className="font-editorial italic text-xl text-gray-700 mt-1">
            Welcome back, {user?.name || user?.email}
          </p>
        </div>

        {/* User Info Card */}
        <PixelFrame dotGrid cornerAccent className="p-6 mb-8">
          <div className="flex items-center gap-4">
            {user?.avatar && (
              <img src={user.avatar} alt="" className="w-14 h-14 rounded-full border-2 border-black shadow-[2px_2px_0px_#000]" />
            )}
            <div>
              <p className="font-display font-bold text-lg text-black">{user?.name || user?.full_name}</p>
              <p className="font-mono text-xs text-gray-600">{user?.email}</p>
              {user?.college && <p className="font-mono text-xs text-gray-500">{user.college}</p>}
            </div>
          </div>
        </PixelFrame>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        )}

        {/* Registrations */}
        {!loading && registrations.length === 0 && (
          <PixelFrame dotGrid cornerAccent className="p-8 text-center">
            <Ticket className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="font-pixel text-xl font-bold uppercase text-gray-400 mb-2">NO REGISTRATIONS YET</h2>
            <p className="font-sans text-sm text-gray-500 mb-4">
              You haven&apos;t registered for any events. Browse upcoming events and register!
            </p>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-display font-bold text-xs uppercase border-2 border-black hover:bg-th-yellow hover:text-black transition-colors shadow-[3px_3px_0px_#000]"
            >
              <ArrowRight className="w-4 h-4" /> Browse Events
            </Link>
          </PixelFrame>
        )}

        <div className="space-y-8">
          {registrations.map((reg) => (
            <motion.div
              key={reg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TicketPass registration={reg} showPrintButton={true} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
