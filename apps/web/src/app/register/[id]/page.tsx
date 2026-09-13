"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PixelFrame } from "@/components/ui/PixelFrame";
import { StickerBadge } from "@/components/ui/StickerBadge";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast-context";
import api, { API_URL } from "@/lib/api";
import { ArrowLeft, Loader2, Users, CreditCard, CheckCircle2, X } from "lucide-react";
import Link from "next/link";

import { TicketPass } from "@/components/events/TicketPass";

export default function RegisterPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params?.id as string;
  const { user, token, requireLogin } = useAuth();
  const { showToast } = useToast();

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [registration, setRegistration] = useState<any>(null);

  // Form fields
  const [teamName, setTeamName] = useState("");
  const [teamMembers, setTeamMembers] = useState("");
  const [phone, setPhone] = useState(user?.phone_number || "");
  const [college, setCollege] = useState(user?.college || "");
  const [department, setDepartment] = useState(user?.department || "");
  const [yearOfStudy, setYearOfStudy] = useState(user?.semester || "");

  const [departments, setDepartments] = useState<string[]>([
    "CSE", "CY", "EC", "EEE", "ME", "CE", "AD", "MCA", "BSH", "Other"
  ]);
  const [semesters, setSemesters] = useState<string[]>([
    "S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "PG", "Faculty", "Other"
  ]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await api.get("/api/ops/public-config/");
        if (res.data.departments && Array.isArray(res.data.departments)) {
          setDepartments(res.data.departments);
        }
        if (res.data.semesters && Array.isArray(res.data.semesters)) {
          setSemesters(res.data.semesters);
        }
      } catch {
        // preserve defaults
      }
    };
    fetchOptions();
  }, []);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/api/events/${eventId}/`);
        setEvent(res.data);
      } catch {
        showToast("Event not found.", "error");
        router.push("/events");
      } finally {
        setLoading(false);
      }
    };
    if (eventId) fetchEvent();
  }, [eventId]);

  useEffect(() => {
    if (user) {
      setPhone(user.phone_number || "");
      setCollege(user.college || "");
      setDepartment(user.department || "");
      setYearOfStudy(user.semester || "");
    }
  }, [user]);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) { resolve(true); return; }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !token) {
      requireLogin({
        label: "Register for event",
        run: () => setShowConfirmModal(true),
      });
      return;
    }

    setShowConfirmModal(true);
  };

  const executeRegistration = async () => {
    setShowConfirmModal(false);

    if (!user || !token) {
      requireLogin({
        label: "Register for event",
        run: () => executeRegistration(),
      });
      return;
    }

    if (!event) return;

    // For paid events, go through Razorpay flow
    if (event.requires_payment) {
      setSubmitting(true);
      try {
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          showToast("Failed to load payment SDK.", "error");
          setSubmitting(false);
          return;
        }

        const orderRes = await api.post("/api/payment/create-order/", {
          event_id: event.id,
          team_name: teamName,
          team_members: teamMembers,
          phone_number: phone,
          college,
          department,
          year_of_study: yearOfStudy,
        });

        const orderData = orderRes.data;

        const options = {
          key: orderData.key_id,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "ASTRA IETM",
          description: `Registration for ${event.title}`,
          order_id: orderData.order_id,
          handler: async (response: any) => {
            try {
              const verifyRes = await api.post("/api/payment/verify/", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });
              if (verifyRes.data.success) {
                setRegistration(verifyRes.data.registration);
                setSuccess(true);
                showToast("Payment verified! Forwarding to your registered tickets...", "success");
                setTimeout(() => {
                  router.push("/dashboard");
                }, 1200);
              }
            } catch {
              showToast("Payment verification failed.", "error");
            }
            setSubmitting(false);
          },
          prefill: {
            name: user.name || user.full_name || "",
            email: user.email || "",
            contact: (phone || "").replace(/\D/g, "").slice(-10),
          },
          theme: { color: "#000000" },
          modal: {
            ondismiss: () => {
              showToast("Payment cancelled.", "warning");
              setSubmitting(false);
            },
          },
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
      } catch (err: any) {
        showToast(err.response?.data?.error || "Payment setup failed.", "error");
        setSubmitting(false);
      }
      return;
    }

    // Free event registration
    setSubmitting(true);
    try {
      const res = await api.post("/api/register/", {
        event: event.id,
        team_name: teamName,
        team_members: teamMembers,
        phone_number: phone,
        college,
        department,
        year_of_study: yearOfStudy,
      });
      setRegistration(res.data);
      setSuccess(true);
      showToast("Registration confirmed! Forwarding to your registered tickets...", "success");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1200);
    } catch (err: any) {
      showToast(err.response?.data?.error || "Registration failed.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (success && registration) {
    return (
      <div className="min-h-screen pt-28 pb-16 px-4 bg-graph-paper">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center">
            <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto mb-2" />
            <h1 className="font-pixel text-2xl font-bold uppercase text-black mb-1">REGISTRATION CONFIRMED!</h1>
            <p className="font-sans text-sm text-gray-700">
              Your official ticket pass for <strong>{event?.title}</strong> has been generated below. Redirecting to your dashboard...
            </p>
          </div>

          <TicketPass registration={{ ...registration, event_details: registration.event_details || event }} showPrintButton={true} />

          <div className="flex gap-4 justify-center pt-2 print:hidden">
            <Link
              href="/dashboard"
              className="px-6 py-2.5 bg-black text-white font-display font-bold text-xs uppercase border-2 border-black hover:bg-th-yellow hover:text-black transition-colors shadow-[3px_3px_0px_#000]"
            >
              Go to My Registrations →
            </Link>
            <Link
              href="/events"
              className="px-6 py-2.5 bg-white text-black font-display font-bold text-xs uppercase border-2 border-black hover:bg-gray-100 transition-colors shadow-[3px_3px_0px_#000]"
            >
              Browse Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 bg-graph-paper">
      <div className="max-w-2xl mx-auto">
        <Link href="/events" className="inline-flex items-center gap-2 font-mono text-xs text-gray-500 hover:text-black mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Events
        </Link>

        <PixelFrame dotGrid cornerAccent className="overflow-hidden">
          {/* Header */}
          <div className="bg-black text-white p-6">
            <StickerBadge color="pink" rotation={-2}>{event?.category || "EVENT"}</StickerBadge>
            <h1 className="font-pixel text-xl sm:text-2xl font-bold uppercase mt-3">{event?.title}</h1>
            {event?.requires_payment && (
              <div className="flex items-center gap-2 mt-3">
                <CreditCard className="w-4 h-4 text-th-yellow" />
                <span className="font-mono text-sm text-th-yellow font-bold">₹{event.payment_amount}</span>
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-xs font-bold uppercase text-gray-700 mb-1 block">Phone *</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required
                  className="w-full px-3 py-2.5 border-2 border-black font-sans text-sm shadow-[2px_2px_0px_#000] focus:outline-none focus:ring-2 focus:ring-th-yellow" />
              </div>
              <div>
                <label className="font-mono text-xs font-bold uppercase text-gray-700 mb-1 block">College *</label>
                <input type="text" value={college} onChange={(e) => setCollege(e.target.value)} required
                  className="w-full px-3 py-2.5 border-2 border-black font-sans text-sm shadow-[2px_2px_0px_#000] focus:outline-none focus:ring-2 focus:ring-th-yellow" />
              </div>
              <div>
                <label className="font-mono text-xs font-bold uppercase text-gray-700 mb-1 block">Department</label>
                <select value={department} onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2.5 border-2 border-black font-sans text-sm shadow-[2px_2px_0px_#000] focus:outline-none focus:ring-2 focus:ring-th-yellow bg-white">
                  <option value="">Select Dept</option>
                  {departments.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-mono text-xs font-bold uppercase text-gray-700 mb-1 block">Semester / Year</label>
                <select value={yearOfStudy} onChange={(e) => setYearOfStudy(e.target.value)}
                  className="w-full px-3 py-2.5 border-2 border-black font-sans text-sm shadow-[2px_2px_0px_#000] focus:outline-none focus:ring-2 focus:ring-th-yellow bg-white">
                  <option value="">Select Sem</option>
                  {semesters.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {event?.is_team_event && (
              <>
                <div>
                  <label className="font-mono text-xs font-bold uppercase text-gray-700 mb-1 flex items-center gap-1 block">
                    <Users className="w-3.5 h-3.5" /> Team Name *
                  </label>
                  <input type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)} required
                    className="w-full px-3 py-2.5 border-2 border-black font-sans text-sm shadow-[2px_2px_0px_#000] focus:outline-none focus:ring-2 focus:ring-th-yellow" />
                </div>
                <div>
                  <label className="font-mono text-xs font-bold uppercase text-gray-700 mb-1 block">
                    Team Members ({event.team_size_min}-{event.team_size_max} members, comma separated)
                  </label>
                  <textarea value={teamMembers} onChange={(e) => setTeamMembers(e.target.value)} rows={3}
                    placeholder="Name 1, Name 2, Name 3"
                    className="w-full px-3 py-2.5 border-2 border-black font-sans text-sm shadow-[2px_2px_0px_#000] focus:outline-none focus:ring-2 focus:ring-th-yellow resize-none" />
                </div>
              </>
            )}

            <button type="submit" disabled={submitting}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-black text-white font-display font-bold text-sm uppercase tracking-wider border-2 border-black hover:bg-th-yellow hover:text-black transition-colors shadow-[3px_3px_0px_#000] disabled:opacity-50">
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> PROCESSING...</>
              ) : event?.requires_payment ? (
                <><CreditCard className="w-4 h-4" /> PAY ₹{event.payment_amount} &amp; REGISTER</>
              ) : (
                "REVIEW & CONFIRM REGISTRATION →"
              )}
            </button>
          </form>
        </PixelFrame>
      </div>

      {/* Registration Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white border-4 border-black p-6 shadow-[8px_8px_0px_#000] text-black">
            <div className="bg-black text-white px-4 py-3 -mx-6 -mt-6 mb-4 flex items-center justify-between">
              <h2 className="font-pixel text-sm font-bold uppercase tracking-wider text-th-yellow">
                CONFIRM TICKET REGISTRATION
              </h2>
              <button onClick={() => setShowConfirmModal(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="font-sans text-xs text-gray-600 mb-4">
              Please review your details before finalizing registration.
            </p>

            {/* Details Summary Card */}
            <div className="bg-gray-50 border-2 border-black p-4 space-y-3 font-mono text-xs mb-6">
              <div className="border-b border-black/20 pb-2">
                <span className="text-[9px] uppercase text-gray-500 block">Event</span>
                <span className="font-bold text-sm text-black block">{event?.title}</span>
                <span className="text-[10px] text-gray-600">
                  {event?.event_date ? new Date(event.event_date).toLocaleDateString("en-IN") : "TBA"} • {event?.venue}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-[9px] uppercase text-gray-500 block">Registrant Name</span>
                  <span className="font-bold text-black">{user?.name || user?.full_name || "Attendee"}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase text-gray-500 block">Phone</span>
                  <span className="font-bold text-black">{phone}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase text-gray-500 block">College</span>
                  <span className="font-bold text-black truncate block">{college}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase text-gray-500 block">Dept &amp; Semester</span>
                  <span className="font-bold text-black">{department || "—"} ({yearOfStudy || "—"})</span>
                </div>
              </div>

              {event?.is_team_event && teamName && (
                <div className="pt-2 border-t border-black/20 text-[11px]">
                  <span className="text-[9px] uppercase text-gray-500 block">Team</span>
                  <span className="font-bold text-black">Team {teamName}</span>
                  {teamMembers && <span className="text-[10px] text-gray-600 block">Members: {teamMembers}</span>}
                </div>
              )}

              <div className="pt-2 border-t border-black/20 flex justify-between items-center text-xs">
                <span className="font-bold uppercase text-gray-700">Registration Fee:</span>
                <span className="font-bold text-black text-sm">
                  {event?.requires_payment ? `₹${event.payment_amount}` : "FREE"}
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-3 bg-white text-black font-display font-bold text-xs uppercase border-2 border-black hover:bg-gray-100 transition-colors shadow-[3px_3px_0px_#000]"
              >
                ← Edit Details
              </button>
              <button
                type="button"
                onClick={executeRegistration}
                className="flex-1 px-4 py-3 bg-black text-white font-display font-bold text-xs uppercase border-2 border-black hover:bg-th-yellow hover:text-black transition-colors shadow-[3px_3px_0px_#000]"
              >
                {event?.requires_payment ? `PROCEED TO PAY ₹${event.payment_amount} →` : "YES, CONFIRM →"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
