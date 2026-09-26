"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import {
  ArrowLeft,
  Loader2,
  Users,
  Calendar,
  MapPin,
  Clock,
  Phone,
  Mail,
  Building,
  GraduationCap,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  XCircle,
  Copy,
  ExternalLink,
  Check,
  QrCode,
  Sparkles,
} from "lucide-react";
import { TicketPass } from "@/components/events/TicketPass";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; border: string }> = {
    REGISTERED: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
    ATTENDED: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
    CANCELLED: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" },
  };
  const current = map[status] ?? {
    bg: "bg-neutral-800",
    text: "text-neutral-300",
    border: "border-neutral-700",
  };
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${current.bg} ${current.text} ${current.border}`}
    >
      {status}
    </span>
  );
}

export default function RegistrationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const regId = params?.id as string;
  const { showToast } = useToast();

  const [registration, setRegistration] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  useEffect(() => {
    const fetchRegistration = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/admin-registrations/");
        const list = Array.isArray(res.data) ? res.data : res.data?.results || [];
        const match = list.find((r: any) => String(r.id) === String(regId));
        if (match) {
          setRegistration(match);
        } else {
          showToast("Registration record not found.", "error");
          router.push("/admin/registrations");
        }
      } catch {
        showToast("Failed to load registration details.", "error");
        router.push("/admin/registrations");
      } finally {
        setLoading(false);
      }
    };

    if (regId) fetchRegistration();
  }, [regId, router, showToast]);

  const handleCopyToken = () => {
    if (registration?.verification_token) {
      navigator.clipboard.writeText(registration.verification_token);
      setCopiedToken(true);
      showToast("Verification token copied!", "success");
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  const handleMarkAttended = async () => {
    if (!registration?.verification_token) return;
    setVerifying(true);
    try {
      await api.post(`/api/operations/verify/${registration.verification_token}/`);
      setRegistration((prev: any) => ({ ...prev, status: "ATTENDED" }));
      showToast("Attendee check-in verified successfully!", "success");
    } catch {
      showToast("Check-in verification failed.", "error");
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
        <p className="text-xs text-neutral-400 font-medium uppercase tracking-widest">
          Loading Pass Intelligence...
        </p>
      </div>
    );
  }

  if (!registration) return null;

  const eventTitle = registration.event_details?.title || `Event #${registration.event}`;
  const eventDateObj = registration.event_details?.event_date
    ? new Date(registration.event_details.event_date)
    : null;
  const formattedEventDate = eventDateObj
    ? eventDateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "October 06, 2026";
  const formattedEventTime = registration.event_details?.time || "10:00 AM";

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans pb-16">
      {/* ── Top Navigation Bar ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/admin/registrations"
              className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Registrations</span>
            </Link>
            <span className="text-xs text-neutral-600">/</span>
            <span className="text-xs text-neutral-300 font-medium">
              Pass #{registration.id}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {registration.user_name || registration.user_email || `Attendee #${registration.id}`}
            </h1>
            <StatusBadge status={registration.status} />
          </div>
          <p className="text-xs sm:text-sm text-neutral-400">
            Registered for <strong>{eventTitle}</strong>
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <Link
            href="/admin/registrations"
            className="px-4 py-2.5 rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-800 hover:text-white text-xs sm:text-sm font-medium transition-colors"
          >
            Back to List
          </Link>
          {registration.status !== "ATTENDED" && (
            <button
              onClick={handleMarkAttended}
              disabled={verifying}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-neutral-950 hover:bg-neutral-100 font-semibold text-xs sm:text-sm tracking-wide transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {verifying ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              )}
              <span>Verify Check-In</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Two-Column Main Content Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── LEFT COLUMN: High-Definition Ticket Pass (5 cols) ── */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
              <QrCode className="w-3.5 h-3.5 text-amber-400" />
              <span>Official Digital Entry Pass</span>
            </span>
          </div>

          <div className="flex justify-center">
            <TicketPass registration={registration} showPrintButton={true} />
          </div>
        </div>

        {/* ── RIGHT COLUMN: Attendee, Event, and Verification Intelligence (7 cols) ── */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Attendee Contact & Academic Info */}
          <div className="bg-neutral-900/90 rounded-3xl border border-neutral-800/80 p-6 sm:p-7 space-y-5 shadow-sm">
            <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-800/80">
              <Users className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Attendee Profile &amp; Contact
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800/70 space-y-1">
                <span className="text-[10px] uppercase font-semibold text-neutral-500 block">
                  Full Name
                </span>
                <span className="text-sm font-bold text-white block">
                  {registration.user_name || "—"}
                </span>
              </div>

              <div className="bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800/70 space-y-1">
                <span className="text-[10px] uppercase font-semibold text-neutral-500 block">
                  Email Address
                </span>
                <span className="text-sm font-semibold text-white block truncate">
                  {registration.user_email || "—"}
                </span>
              </div>

              <div className="bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800/70 space-y-1">
                <span className="text-[10px] uppercase font-semibold text-neutral-500 block">
                  Contact Phone
                </span>
                <span className="text-sm font-semibold text-white block">
                  {registration.phone_number || registration.user_phone || "—"}
                </span>
              </div>

              <div className="bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800/70 space-y-1">
                <span className="text-[10px] uppercase font-semibold text-neutral-500 block">
                  College / Institution
                </span>
                <span className="text-sm font-semibold text-white block truncate">
                  {registration.college || registration.user_college || "—"}
                </span>
              </div>

              <div className="bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800/70 space-y-1">
                <span className="text-[10px] uppercase font-semibold text-neutral-500 block">
                  Department / Branch
                </span>
                <span className="text-sm font-semibold text-white block">
                  {registration.department || registration.user_dept || "—"}
                </span>
              </div>

              <div className="bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800/70 space-y-1">
                <span className="text-[10px] uppercase font-semibold text-neutral-500 block">
                  Semester / Year of Study
                </span>
                <span className="text-sm font-semibold text-white block">
                  {registration.semester || registration.user_sem || "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Symposium Event Intelligence */}
          <div className="bg-neutral-900/90 rounded-3xl border border-neutral-800/80 p-6 sm:p-7 space-y-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Event &amp; Payment Details
                </h2>
              </div>

              {registration.event_details?.id && (
                <Link
                  href={`/events/${registration.event_details.id}`}
                  target="_blank"
                  className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-white transition-colors"
                >
                  <span>Public Page</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800/70 space-y-1 sm:col-span-2">
                <span className="text-[10px] uppercase font-semibold text-neutral-500 block">
                  Event Title
                </span>
                <span className="text-base font-bold text-white block">
                  {eventTitle}
                </span>
                <span className="text-[11px] text-neutral-400 block mt-0.5">
                  {registration.event_details?.category || "COMPETITION"} • ASTRA 2026 Official Session
                </span>
              </div>

              <div className="bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800/70 space-y-1">
                <span className="text-[10px] uppercase font-semibold text-neutral-500 block">
                  Date &amp; Time
                </span>
                <span className="text-sm font-semibold text-white block">
                  {formattedEventDate} • {formattedEventTime}
                </span>
              </div>

              <div className="bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800/70 space-y-1">
                <span className="text-[10px] uppercase font-semibold text-neutral-500 block">
                  Arena / Venue
                </span>
                <span className="text-sm font-semibold text-white block">
                  {registration.event_details?.venue || "KMCT Calicut Campus"}
                </span>
              </div>

              <div className="bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800/70 space-y-1">
                <span className="text-[10px] uppercase font-semibold text-neutral-500 block">
                  Payment Status
                </span>
                <span className="text-sm font-bold text-white block">
                  {registration.payment_verified ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Paid &amp; Verified
                    </span>
                  ) : registration.event_details?.requires_payment ? (
                    <span className="text-amber-400 flex items-center gap-1">
                      <CreditCard className="w-4 h-4" /> Pending Payment
                    </span>
                  ) : (
                    <span className="text-neutral-300">Free Registration</span>
                  )}
                </span>
              </div>

              <div className="bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800/70 space-y-1">
                <span className="text-[10px] uppercase font-semibold text-neutral-500 block">
                  Fee Amount
                </span>
                <span className="text-sm font-bold text-white block">
                  {registration.event_details?.requires_payment
                    ? `₹${registration.event_details.payment_amount}`
                    : "₹0.00 (Free)"}
                </span>
              </div>
            </div>

            {/* Team Info (if present) */}
            {registration.team_name && (
              <div className="pt-3 border-t border-neutral-800/80 space-y-2">
                <span className="text-[10px] uppercase font-semibold text-neutral-500 block">
                  Team Composition
                </span>
                <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-1">
                  <span className="text-sm font-bold text-purple-300 block">
                    Team {registration.team_name}
                  </span>
                  {registration.team_members && (
                    <p className="text-xs text-neutral-400">
                      Members: {registration.team_members}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Card 3: Token Verification Control */}
          <div className="bg-neutral-900/90 rounded-3xl border border-neutral-800/80 p-6 sm:p-7 space-y-4 shadow-sm">
            <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-800/80">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Cryptographic Token &amp; Check-In
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-semibold text-neutral-500 block">
                  Unique Verification Token
                </span>
                <span className="font-mono text-sm font-bold text-white tracking-wider">
                  {registration.verification_token || `ASTRA-REG-${registration.id}`}
                </span>
              </div>

              <button
                onClick={handleCopyToken}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                {copiedToken ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedToken ? "Copied" : "Copy Token"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
