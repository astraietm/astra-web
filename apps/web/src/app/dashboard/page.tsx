"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import api from "@/lib/api";
import { Loader2, Ticket, ArrowRight, User, Sparkles, Building, Phone } from "lucide-react";
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
  }, [user, token, authLoading, router]);

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 bg-neutral-50/50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-neutral-900" />
          <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">
            Loading Passes...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-24 px-4 bg-neutral-50/60 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 text-white text-xs font-medium shadow-sm mb-3">
            <Ticket className="w-3.5 h-3.5 text-amber-300" />
            <span>Participant Passes</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-950">
            My Event Passes
          </h1>
          <p className="text-sm sm:text-base text-neutral-500 mt-1.5">
            Welcome back, {user?.name || user?.email}. Access your verified event passes and entry QR codes.
          </p>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt=""
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-neutral-100 shadow-sm"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-lg">
                  {user?.name?.[0] || "U"}
                </div>
              )}
              <div>
                <p className="font-semibold text-base sm:text-lg text-neutral-950 leading-snug">
                  {user?.name || user?.full_name || "Attendee"}
                </p>
                <p className="text-xs text-neutral-500">{user?.email}</p>
                {user?.college && (
                  <p className="text-xs text-neutral-400 mt-0.5 flex items-center gap-1">
                    <Building className="w-3 h-3 text-neutral-400" />
                    {user.college}
                  </p>
                )}
              </div>
            </div>

            <Link
              href="/profile"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-neutral-200 bg-white text-xs font-medium text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-sm self-start sm:self-auto"
            >
              <User className="w-3.5 h-3.5 text-neutral-500" />
              <span>Edit Profile</span>
            </Link>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-neutral-900" />
          </div>
        )}

        {/* Empty State */}
        {!loading && registrations.length === 0 && (
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-12 text-center shadow-sm space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-neutral-100 text-neutral-500 flex items-center justify-center mx-auto shadow-inner">
              <Ticket className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-950">No Event Passes Yet</h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-sm mx-auto leading-relaxed">
                You haven&apos;t registered for any events yet. Explore upcoming competitions, workshops, and symposiums.
              </p>
            </div>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-neutral-900 text-white font-medium text-xs sm:text-sm tracking-wide hover:bg-black transition-all shadow-sm"
            >
              <span>Browse Events</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Registrations List */}
        <div className="space-y-6">
          {registrations.map((reg) => (
            <motion.div
              key={reg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <TicketPass registration={reg} showPrintButton={true} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
