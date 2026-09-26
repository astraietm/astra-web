"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast-context";
import api from "@/lib/api";
import { ArrowLeft, Loader2, Users, CreditCard, CheckCircle2, X, Sparkles, Building, Phone, Calendar, MapPin } from "lucide-react";
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
  }, [eventId, router, showToast]);

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
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
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
          name: "ASTRA 2026",
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
                showToast("Payment verified! Registration successful.", "success");
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
            ondismiss: async () => {
              try {
                await api.post("/api/payment/cancel/", {
                  registration_id: orderData.registration_id,
                  order_id: orderData.order_id,
                });
              } catch {
                // ignore
              }
              showToast("Payment cancelled. Registration removed.", "warning");
              setSubmitting(false);
            },
          },
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.on("payment.failed", async (response: any) => {
          try {
            await api.post("/api/payment/cancel/", {
              registration_id: orderData.registration_id,
              order_id: orderData.order_id,
            });
          } catch {
            // ignore
          }
          showToast(response.error?.description || "Payment failed. Registration cancelled.", "error");
          setSubmitting(false);
        });
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
      showToast("Registration successful!", "success");
    } catch (err: any) {
      showToast(err.response?.data?.error || "Registration failed.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 bg-neutral-50/60">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-neutral-900" />
          <p className="text-xs font-medium text-neutral-500">Loading Event Details...</p>
        </div>
      </div>
    );
  }

  if (success && registration) {
    return (
      <div className="min-h-screen pt-24 sm:pt-28 pb-24 px-4 bg-neutral-50/60 font-sans">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-950 tracking-tight">
              Registration Confirmed!
            </h1>
            <p className="text-sm text-neutral-500 max-w-md mx-auto">
              Your digital entry ticket pass for <strong>{event?.title}</strong> is ready. You can save or print it below.
            </p>
          </div>

          <TicketPass
            registration={{ ...registration, event_details: registration.event_details || event }}
            showPrintButton={true}
          />

          <div className="flex flex-wrap gap-3 justify-center pt-4 print:hidden">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-neutral-900 text-white hover:bg-black text-xs sm:text-sm font-medium transition-all shadow-sm"
            >
              <span>View My Passes</span>
            </Link>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50 text-xs sm:text-sm font-medium transition-all shadow-sm"
            >
              <span>Explore More Events</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-24 px-4 bg-neutral-50/60 font-sans">
      <div className="max-w-2xl mx-auto space-y-6">
        <Link
          href={`/events/${eventId}`}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-neutral-200 bg-white text-xs font-medium text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 transition-all shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Event Details</span>
        </Link>

        <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-neutral-950 text-white p-6 sm:p-7">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/10 text-neutral-300 text-[11px] font-semibold tracking-wide mb-2 border border-white/10">
              {event?.category || "EVENT REGISTRATION"}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
              {event?.title}
            </h1>
            {event?.requires_payment && (
              <div className="flex items-center gap-2 mt-2.5 text-amber-300 font-semibold text-sm">
                <CreditCard className="w-4 h-4" />
                <span>Registration Fee: ₹{event.payment_amount}</span>
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="p-6 sm:p-7 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="10-digit mobile number"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                  College / Institution <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  required
                  placeholder="College or university name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-900 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all cursor-pointer"
                >
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">Semester / Year</label>
                <select
                  value={yearOfStudy}
                  onChange={(e) => setYearOfStudy(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-900 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all cursor-pointer"
                >
                  <option value="">Select Semester</option>
                  {semesters.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {event?.is_team_event && (
              <div className="space-y-4 pt-2 border-t border-neutral-100">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1.5 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-neutral-600" />
                    <span>Team Name <span className="text-red-500">*</span></span>
                  </label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    required
                    placeholder="Enter team alias"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                    Team Members ({event.team_size_min}-{event.team_size_max} members, comma separated)
                  </label>
                  <textarea
                    value={teamMembers}
                    onChange={(e) => setTeamMembers(e.target.value)}
                    rows={3}
                    placeholder="Member 1, Member 2, Member 3"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all resize-none"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-neutral-900 text-white font-medium text-sm tracking-wide hover:bg-black transition-all shadow-sm hover:shadow disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : event?.requires_payment ? (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>Pay ₹{event.payment_amount} &amp; Register</span>
                </>
              ) : (
                <span>Review &amp; Confirm Registration →</span>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Registration Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-2xl border border-neutral-200 p-6 sm:p-7 shadow-2xl text-neutral-900">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
              <h2 className="text-base font-bold text-neutral-950">
                Confirm Registration
              </h2>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-500 mb-4">
              Please review your details before finalizing your event pass.
            </p>

            {/* Details Summary Card */}
            <div className="bg-neutral-50 rounded-xl border border-neutral-200/70 p-4 space-y-3 text-xs mb-6">
              <div className="border-b border-neutral-200/60 pb-2.5">
                <span className="text-[10px] uppercase font-semibold text-neutral-400 block">Event</span>
                <span className="font-bold text-sm text-neutral-950 block">{event?.title}</span>
                <span className="text-[11px] text-neutral-500 mt-0.5 block">
                  {event?.event_date ? new Date(event.event_date).toLocaleDateString("en-IN") : "TBA"} • {event?.venue}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div>
                  <span className="text-[10px] uppercase text-neutral-400 font-medium block">Registrant</span>
                  <span className="font-semibold text-neutral-900">{user?.name || user?.full_name || "Attendee"}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-neutral-400 font-medium block">Phone</span>
                  <span className="font-semibold text-neutral-900">{phone}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-neutral-400 font-medium block">College</span>
                  <span className="font-semibold text-neutral-900 truncate block">{college}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-neutral-400 font-medium block">Department</span>
                  <span className="font-semibold text-neutral-900">{department || "—"} ({yearOfStudy || "—"})</span>
                </div>
              </div>

              {event?.is_team_event && teamName && (
                <div className="pt-2.5 border-t border-neutral-200/60">
                  <span className="text-[10px] uppercase text-neutral-400 font-medium block">Team</span>
                  <span className="font-semibold text-neutral-900">Team {teamName}</span>
                  {teamMembers && <span className="text-[11px] text-neutral-500 block mt-0.5">Members: {teamMembers}</span>}
                </div>
              )}

              <div className="pt-2.5 border-t border-neutral-200/60 flex justify-between items-center text-xs">
                <span className="font-medium text-neutral-600">Total Fee:</span>
                <span className="font-bold text-neutral-950 text-sm">
                  {event?.requires_payment ? `₹${event.payment_amount}` : "FREE"}
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2.5 rounded-full border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 text-xs font-medium transition-colors cursor-pointer"
              >
                Back to Edit
              </button>
              <button
                type="button"
                onClick={executeRegistration}
                className="flex-1 px-4 py-2.5 rounded-full bg-neutral-900 text-white hover:bg-black text-xs font-semibold tracking-wide transition-all shadow-sm cursor-pointer"
              >
                {event?.requires_payment ? `Pay ₹${event.payment_amount} →` : "Confirm & Get Pass →"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
