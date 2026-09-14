"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PixelFrame } from "@/components/ui/PixelFrame";
import { StickerBadge } from "@/components/ui/StickerBadge";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast-context";
import api, { API_URL } from "@/lib/api";
import { ArrowLeft, Loader2, Users, CreditCard, CheckCircle2 } from "lucide-react";
import Link from "next/link";

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
  const [registration, setRegistration] = useState<any>(null);

  // Form fields
  const [teamName, setTeamName] = useState("");
  const [teamMembers, setTeamMembers] = useState("");
  const [phone, setPhone] = useState(user?.phone_number || "");
  const [college, setCollege] = useState(user?.college || "");
  const [department, setDepartment] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !token) {
      requireLogin({
        label: "Register for event",
        run: () => handleSubmit(e),
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
      showToast("Registration successful!", "success");
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
      <div className="min-h-screen pt-28 pb-16 px-4">
        <div className="max-w-lg mx-auto">
          <PixelFrame dotGrid cornerAccent className="p-8 text-center">
            <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
            <h1 className="font-pixel text-2xl font-bold uppercase text-black mb-2">REGISTRATION CONFIRMED</h1>
            <p className="font-sans text-sm text-gray-700 mb-4">
              You are registered for <strong>{event?.title}</strong>.
            </p>
            {registration.qr_code && (
              <div className="my-4">
                <img src={registration.qr_code} alt="QR Ticket" className="w-48 h-48 mx-auto border-2 border-black" />
                <p className="font-mono text-[10px] text-gray-500 mt-2">Show this QR at the venue</p>
              </div>
            )}
            <div className="flex gap-3 justify-center mt-6">
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-black text-white font-display font-bold text-xs uppercase border-2 border-black hover:bg-th-yellow hover:text-black transition-colors"
              >
                My Registrations →
              </Link>
              <Link
                href="/events"
                className="px-4 py-2 bg-white text-black font-display font-bold text-xs uppercase border-2 border-black hover:bg-gray-100 transition-colors"
              >
                Back to Events
              </Link>
            </div>
          </PixelFrame>
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
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-xs font-bold uppercase text-gray-700 mb-1 block">Phone *</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required
                  className="w-full px-3 py-2.5 border-2 border-black font-sans text-sm focus:outline-none focus:ring-2 focus:ring-th-yellow" />
              </div>
              <div>
                <label className="font-mono text-xs font-bold uppercase text-gray-700 mb-1 block">College *</label>
                <input type="text" value={college} onChange={(e) => setCollege(e.target.value)} required
                  className="w-full px-3 py-2.5 border-2 border-black font-sans text-sm focus:outline-none focus:ring-2 focus:ring-th-yellow" />
              </div>
              <div>
                <label className="font-mono text-xs font-bold uppercase text-gray-700 mb-1 block">Department</label>
                <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2.5 border-2 border-black font-sans text-sm focus:outline-none focus:ring-2 focus:ring-th-yellow" />
              </div>
              <div>
                <label className="font-mono text-xs font-bold uppercase text-gray-700 mb-1 block">Year of Study</label>
                <select value={yearOfStudy} onChange={(e) => setYearOfStudy(e.target.value)}
                  className="w-full px-3 py-2.5 border-2 border-black font-sans text-sm focus:outline-none focus:ring-2 focus:ring-th-yellow bg-white">
                  <option value="">Select</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="PG">PG</option>
                  <option value="Faculty">Faculty</option>
                  <option value="Other">Other</option>
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
                    className="w-full px-3 py-2.5 border-2 border-black font-sans text-sm focus:outline-none focus:ring-2 focus:ring-th-yellow" />
                </div>
                <div>
                  <label className="font-mono text-xs font-bold uppercase text-gray-700 mb-1 block">
                    Team Members ({event.team_size_min}-{event.team_size_max} members, comma separated)
                  </label>
                  <textarea value={teamMembers} onChange={(e) => setTeamMembers(e.target.value)} rows={3}
                    placeholder="Name 1, Name 2, Name 3"
                    className="w-full px-3 py-2.5 border-2 border-black font-sans text-sm focus:outline-none focus:ring-2 focus:ring-th-yellow resize-none" />
                </div>
              </>
            )}

            <button type="submit" disabled={submitting}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-black text-white font-display font-bold text-sm uppercase tracking-wider border-2 border-black hover:bg-th-yellow hover:text-black transition-colors disabled:opacity-50">
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> PROCESSING...</>
              ) : event?.requires_payment ? (
                <><CreditCard className="w-4 h-4" /> PAY ₹{event.payment_amount} &amp; REGISTER</>
              ) : (
                "CONFIRM REGISTRATION →"
              )}
            </button>
          </form>
        </PixelFrame>
      </div>
    </div>
  );
}
