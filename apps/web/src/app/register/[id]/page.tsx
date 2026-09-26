"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast-context";
import api from "@/lib/api";
import {
  ArrowLeft,
  Loader2,
  Users,
  CreditCard,
  CheckCircle2,
  X,
  Sparkles,
  Building,
  Phone,
  Calendar,
  MapPin,
  Clock,
  ShieldCheck,
  Award,
  Ticket,
  ChevronRight,
  User,
  Info,
  AlertCircle,
} from "lucide-react";
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
      if (!phone && user.phone_number) setPhone(user.phone_number);
      if (!college && user.college) setCollege(user.college);
      if (!department && user.department) setDepartment(user.department);
      if (!yearOfStudy && user.semester) setYearOfStudy(user.semester);
    }
  }, [user]);

  // Compute live validation status
  const cleanPhone = phone.trim().replace(/\D/g, "");
  const isPhoneValid = cleanPhone.length === 10;
  const isCollegeValid = college.trim().length > 0;
  const isDepartmentValid = department.trim().length > 0;
  const isSemesterValid = yearOfStudy.trim().length > 0;
  const isTeamValid = !event?.is_team_event || (teamName.trim().length > 0 && teamMembers.trim().length > 0);

  const isFormComplete = isPhoneValid && isCollegeValid && isDepartmentValid && isSemesterValid && isTeamValid;

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

    if (!phone.trim()) {
      showToast("Please enter your contact phone number.", "error");
      return;
    }
    if (!isPhoneValid) {
      showToast("Please enter a valid 10-digit mobile number.", "error");
      return;
    }
    if (!college.trim()) {
      showToast("Please enter your college or institution name.", "error");
      return;
    }
    if (!department.trim()) {
      showToast("Please select your academic department.", "error");
      return;
    }
    if (!yearOfStudy.trim()) {
      showToast("Please select your semester or year of study.", "error");
      return;
    }
    if (event?.is_team_event) {
      if (!teamName.trim()) {
        showToast("Please enter your team name.", "error");
        return;
      }
      if (!teamMembers.trim()) {
        showToast("Please specify the members in your team.", "error");
        return;
      }
    }

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
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || orderData.key_id,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "ASTRA 2026",
          description: `Registration for ${event.title}`,
          order_id: orderData.order_id,
          handler: async (response: any) => {
            try {
              const verifyRes = await api.post("/api/payment/verify-order/", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              setRegistration(verifyRes.data.registration || verifyRes.data);
              setSuccess(true);
              showToast("Payment verified! Registration successful.", "success");
            } catch (err: any) {
              showToast(err.response?.data?.error || "Payment verification failed.", "error");
            } finally {
              setSubmitting(false);
            }
          },
          prefill: {
            name: user?.name || user?.full_name || "",
            email: user?.email || "",
            contact: phone,
          },
          theme: {
            color: "#0a0a0a",
          },
          modal: {
            ondismiss: () => {
              setSubmitting(false);
              showToast("Payment window closed.", "info");
            },
          },
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.on("payment.failed", async (response: any) => {
          try {
            await api.post("/api/payment/failed/", {
              razorpay_order_id: orderData.order_id,
              error_code: response.error?.code,
              error_description: response.error?.description,
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
      <div className="min-h-screen flex items-center justify-center pt-24 bg-neutral-50/60 font-sans">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-neutral-900" />
          <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">
            Loading Registration Details...
          </p>
        </div>
      </div>
    );
  }

  if (success && registration) {
    return (
      <div className="relative min-h-screen pt-24 sm:pt-28 pb-24 px-4 bg-neutral-50/60 font-sans overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-400/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-950 tracking-tight">
              Registration Confirmed!
            </h1>
            <p className="text-sm text-neutral-500 max-w-md mx-auto">
              Your official digital entry pass for <strong>{event?.title}</strong> has been generated and activated.
            </p>
          </div>

          <TicketPass
            registration={{ ...registration, event_details: registration.event_details || event }}
            showPrintButton={true}
          />

          <div className="flex flex-wrap gap-3 justify-center pt-4 print:hidden">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-neutral-900 text-white hover:bg-black text-xs sm:text-sm font-semibold transition-all shadow-sm active:scale-[0.99]"
            >
              <Ticket className="w-4 h-4" />
              <span>Go to My Passes</span>
            </Link>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50 text-xs sm:text-sm font-semibold transition-all shadow-sm"
            >
              <span>Explore More Events</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Date calculation
  const eventDateObj = event?.event_date ? new Date(event.event_date) : new Date();
  const formattedDate = eventDateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const dayNum = eventDateObj.getDate();
  const dayLabel = dayNum === 6 ? "Day 1 (Oct 06)" : dayNum === 7 ? "Day 2 (Oct 07)" : "Oct 2026";

  return (
    <div className="relative min-h-screen pt-24 sm:pt-28 pb-24 px-4 sm:px-6 lg:px-8 bg-neutral-50/50 font-sans overflow-hidden">
      {/* ─── Minimal Animated Ambient Lights ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-amber-400/8 rounded-full blur-[140px]"
        />
        <motion.div
          animate={{
            x: [0, -40, 0],
            y: [0, 30, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/3 -right-40 w-[650px] h-[650px] bg-blue-400/8 rounded-full blur-[150px]"
        />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `radial-gradient(circle, #000000 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
            maskImage: "radial-gradient(ellipse at center, rgba(0,0,0,0.8), transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, rgba(0,0,0,0.8), transparent 75%)",
          }}
        />
      </div>

      {/* ─── Main Content Container ─── */}
      <div className="relative max-w-6xl mx-auto space-y-8">
        {/* Top Breadcrumb Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <Link
            href={`/events/${eventId}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-200 bg-white/80 backdrop-blur-md text-xs font-medium text-neutral-700 hover:border-neutral-300 hover:bg-white transition-all shadow-sm select-none"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Event Overview</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-neutral-200/80 text-[11px] font-medium text-neutral-600 shadow-sm backdrop-blur-md">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>ASTRA 2026 Registration</span>
            </span>
          </div>
        </motion.div>

        {/* ─── Two-Column Full Page Layout ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ── LEFT COLUMN: Event Overview & Ticket Summary (5 cols) ── */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Event Summary Card */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-neutral-200/80 p-6 sm:p-7 shadow-sm space-y-6">
              {/* Event Badge & Day */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold bg-neutral-900 text-white shadow-sm">
                  {event?.category || "COMPETITION"}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold bg-neutral-100 text-neutral-700 border border-neutral-200">
                  {dayLabel}
                </span>
              </div>

              {/* Event Title */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-neutral-950 tracking-tight leading-tight">
                  {event?.title}
                </h1>
                <p className="text-xs text-neutral-500 mt-1">
                  Organized by Cyber Security Association • KMCT Calicut
                </p>
              </div>

              {/* Mini Poster Thumbnail (if exists) */}
              {event?.image && (
                <div className="relative rounded-2xl overflow-hidden aspect-[16/9] border border-neutral-200/70 shadow-inner bg-neutral-900">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <span className="text-[11px] font-medium opacity-90">
                      Official Session Pass
                    </span>
                  </div>
                </div>
              )}

              {/* Event Schedule Info Pills */}
              <div className="space-y-2.5 pt-2 border-t border-neutral-100">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-50/70 border border-neutral-200/60">
                  <div className="w-8 h-8 rounded-xl bg-white border border-neutral-200/80 flex items-center justify-center text-neutral-700 shadow-sm flex-shrink-0">
                    <Calendar className="w-4 h-4 text-neutral-700" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-neutral-400 block">
                      Date &amp; Time
                    </span>
                    <span className="text-xs font-semibold text-neutral-900">
                      {formattedDate} • {event?.time || "10:00 AM"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-50/70 border border-neutral-200/60">
                  <div className="w-8 h-8 rounded-xl bg-white border border-neutral-200/80 flex items-center justify-center text-neutral-700 shadow-sm flex-shrink-0">
                    <MapPin className="w-4 h-4 text-neutral-700" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-neutral-400 block">
                      Venue / Location
                    </span>
                    <span className="text-xs font-semibold text-neutral-900 truncate block">
                      {event?.venue || "KMCT College Arena, Calicut"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-50/70 border border-neutral-200/60">
                  <div className="w-8 h-8 rounded-xl bg-white border border-neutral-200/80 flex items-center justify-center text-neutral-700 shadow-sm flex-shrink-0">
                    <Users className="w-4 h-4 text-neutral-700" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-neutral-400 block">
                      Participation Mode
                    </span>
                    <span className="text-xs font-semibold text-neutral-900">
                      {event?.is_team_event
                        ? `Team Event (${event.team_size_min || 2} - ${event.team_size_max || 4} Members)`
                        : "Solo / Individual Contender"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Fee Breakdown Card */}
              <div className="p-4 rounded-2xl bg-neutral-900 text-white space-y-3 shadow-md">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-400">Base Registration</span>
                  <span className="font-semibold text-white">
                    {event?.requires_payment ? `₹${event.payment_amount}` : "₹0.00"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-400">Convenience &amp; Platform Fee</span>
                  <span className="font-medium text-emerald-400">Free</span>
                </div>
                <div className="pt-2 border-t border-neutral-800 flex justify-between items-center">
                  <span className="text-xs font-medium text-neutral-300">Total Payable</span>
                  <span className="text-lg font-bold text-amber-300">
                    {event?.requires_payment ? `₹${event.payment_amount}` : "FREE"}
                  </span>
                </div>
              </div>

              {/* Perks Checklist */}
              <div className="space-y-2 pt-2 border-t border-neutral-100">
                <span className="text-[11px] font-semibold text-neutral-900 block">
                  Registration Includes:
                </span>
                <div className="grid grid-cols-1 gap-1.5 text-xs text-neutral-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Official verified ASTRA 2026 Entry Pass</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Participation Certificate &amp; KTU Activity Points</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Access to campus event arena &amp; network labs</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT COLUMN: Registration Form (7 cols) ── */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="lg:col-span-7"
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-neutral-200/80 shadow-lg p-6 sm:p-8 md:p-10 space-y-6">
              {/* Form Title & User Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 tracking-tight">
                    Attendee Information
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Please provide your contact and institutional details for your pass.
                  </p>
                </div>

                {user && (
                  <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-neutral-50 border border-neutral-200/70 text-xs">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="Avatar"
                        className="w-5 h-5 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4 text-neutral-500" />
                    )}
                    <span className="font-semibold text-neutral-900 truncate max-w-[120px]">
                      {user.name || user.full_name || user.email}
                    </span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                )}
              </div>

              {/* Registration Form */}
              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        placeholder="10-digit mobile number"
                        className={`w-full px-4 py-3 rounded-2xl border text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:bg-white transition-all shadow-sm ${
                          phone && !isPhoneValid
                            ? "border-red-300 bg-red-50/20 focus:border-red-500 focus:ring-red-500/10"
                            : "border-neutral-200 bg-neutral-50/50 focus:border-neutral-900 focus:ring-neutral-900/10"
                        }`}
                      />
                    </div>
                    {phone && !isPhoneValid && (
                      <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Must be exactly 10 digits
                      </p>
                    )}
                  </div>

                  {/* College / Institution */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                      College / Institution <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                        required
                        placeholder="College or university name"
                        className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50/50 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 focus:bg-white transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Department Select */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      required
                      className={`w-full px-4 py-3 rounded-2xl border text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all shadow-sm cursor-pointer ${
                        department
                          ? "border-neutral-200 bg-neutral-50/50 text-neutral-900 focus:border-neutral-900 focus:ring-neutral-900/10"
                          : "border-neutral-200 bg-neutral-50/50 text-neutral-400 focus:border-neutral-900 focus:ring-neutral-900/10"
                      }`}
                    >
                      <option value="" disabled>Select Department *</option>
                      {departments.map((d) => (
                        <option key={d} value={d} className="text-neutral-900">
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Semester Select */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                      Semester / Year <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={yearOfStudy}
                      onChange={(e) => setYearOfStudy(e.target.value)}
                      required
                      className={`w-full px-4 py-3 rounded-2xl border text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all shadow-sm cursor-pointer ${
                        yearOfStudy
                          ? "border-neutral-200 bg-neutral-50/50 text-neutral-900 focus:border-neutral-900 focus:ring-neutral-900/10"
                          : "border-neutral-200 bg-neutral-50/50 text-neutral-400 focus:border-neutral-900 focus:ring-neutral-900/10"
                      }`}
                    >
                      <option value="" disabled>Select Semester *</option>
                      {semesters.map((s) => (
                        <option key={s} value={s} className="text-neutral-900">
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Team Info if Team Event */}
                {event?.is_team_event && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-4 pt-4 border-t border-neutral-100"
                  >
                    <div>
                      <label className="block text-xs font-semibold text-neutral-800 mb-1.5 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-neutral-600" />
                        <span>Team Alias / Name <span className="text-red-500">*</span></span>
                      </label>
                      <input
                        type="text"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        required
                        placeholder="e.g. CyberKnights"
                        className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50/50 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 focus:bg-white transition-all shadow-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                        Team Members ({event.team_size_min || 2}-{event.team_size_max || 4} members, comma separated) <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={teamMembers}
                        onChange={(e) => setTeamMembers(e.target.value)}
                        required
                        rows={3}
                        placeholder="Member 1 (Leader), Member 2, Member 3"
                        className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50/50 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 focus:bg-white transition-all resize-none shadow-sm"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Form Completion Hint / Validation Guide */}
                {!isFormComplete && (
                  <div className="flex items-center gap-2 p-3 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900">
                    <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>
                      Please complete all required fields (*) including Department &amp; Semester to proceed.
                    </span>
                  </div>
                )}

                {/* Info Note */}
                <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/70 text-xs text-neutral-600">
                  <Info className="w-4 h-4 text-neutral-500 flex-shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    Once submitted, your entry pass will be immediately available in your dashboard with an encrypted QR check-in code.
                  </p>
                </div>

                {/* Submit / Pay Button */}
                <button
                  type="submit"
                  disabled={!isFormComplete || submitting}
                  className={`w-full flex items-center justify-center gap-2 py-3.5 px-8 rounded-full font-semibold text-sm tracking-wide transition-all ${
                    isFormComplete && !submitting
                      ? "bg-neutral-900 text-white hover:bg-black active:scale-[0.99] shadow-md hover:shadow-xl cursor-pointer"
                      : "bg-neutral-200 text-neutral-400 cursor-not-allowed shadow-none"
                  }`}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Securing Registration...</span>
                    </>
                  ) : event?.requires_payment ? (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>
                        {isFormComplete
                          ? `Pay ₹${event.payment_amount} & Complete Registration`
                          : "Complete All Fields (*) to Pay"}
                      </span>
                    </>
                  ) : (
                    <>
                      <span>
                        {isFormComplete
                          ? "Confirm Registration & Get Pass"
                          : "Complete All Fields (*) to Register"}
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ─── Registration Confirmation Modal ─── */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-8 shadow-2xl text-neutral-900"
            >
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-5">
                <div>
                  <h3 className="text-lg font-bold text-neutral-950">
                    Review Details
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Verify your registration before confirmation
                  </p>
                </div>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Details Summary Card */}
              <div className="bg-neutral-50/80 rounded-2xl border border-neutral-200/70 p-5 space-y-3.5 text-xs mb-6">
                <div className="border-b border-neutral-200/60 pb-3">
                  <span className="text-[10px] uppercase font-semibold text-neutral-400 block">
                    Event Name
                  </span>
                  <span className="font-bold text-base text-neutral-950 block">
                    {event?.title}
                  </span>
                  <span className="text-xs text-neutral-500 mt-0.5 block">
                    {formattedDate} • {event?.venue || "KMCT Calicut"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase text-neutral-400 font-medium block">
                      Registrant
                    </span>
                    <span className="font-semibold text-neutral-900">
                      {user?.name || user?.full_name || "Attendee"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-neutral-400 font-medium block">
                      Phone
                    </span>
                    <span className="font-semibold text-neutral-900">{phone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-neutral-400 font-medium block">
                      College
                    </span>
                    <span className="font-semibold text-neutral-900 truncate block">
                      {college}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-neutral-400 font-medium block">
                      Department
                    </span>
                    <span className="font-semibold text-neutral-900">
                      {department || "—"} ({yearOfStudy || "—"})
                    </span>
                  </div>
                </div>

                {event?.is_team_event && teamName && (
                  <div className="pt-3 border-t border-neutral-200/60">
                    <span className="text-[10px] uppercase text-neutral-400 font-medium block">
                      Team
                    </span>
                    <span className="font-semibold text-neutral-900">
                      Team {teamName}
                    </span>
                    {teamMembers && (
                      <span className="text-[11px] text-neutral-500 block mt-0.5">
                        Members: {teamMembers}
                      </span>
                    )}
                  </div>
                )}

                <div className="pt-3 border-t border-neutral-200/60 flex justify-between items-center text-xs">
                  <span className="font-medium text-neutral-600">Total Amount:</span>
                  <span className="font-bold text-neutral-950 text-base">
                    {event?.requires_payment ? `₹${event.payment_amount}` : "FREE"}
                  </span>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-5 py-2.5 rounded-full border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Edit Details
                </button>
                <button
                  type="button"
                  onClick={executeRegistration}
                  className="flex-1 px-5 py-2.5 rounded-full bg-neutral-900 text-white hover:bg-black text-xs font-semibold tracking-wide transition-all shadow-sm cursor-pointer"
                >
                  {event?.requires_payment ? `Pay ₹${event.payment_amount}` : "Confirm Registration"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
