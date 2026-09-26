"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast-context";
import api from "@/lib/api";
import {
  User,
  Mail,
  Phone,
  Building,
  GraduationCap,
  Hash,
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  Loader2,
  Save,
  ShieldCheck,
  Ticket,
  Calendar,
  Sparkles,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateUser, token, loading: authLoading, pendingAction, setPendingAction } = useAuth();
  const { showToast } = useToast();

  // Form State
  const [fullName, setFullName] = useState(user?.name || user?.full_name || "");
  const [phone, setPhone] = useState(user?.phone_number || "");
  const [college, setCollege] = useState(user?.college || "");
  const [usn, setUsn] = useState(user?.usn || "");
  const [department, setDepartment] = useState(user?.department || "");
  const [semester, setSemester] = useState(user?.semester || "");

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Departments & Semesters options
  const [departments, setDepartments] = useState<string[]>([
    "CSE", "CY", "EC", "EEE", "ME", "CE", "AD", "MCA", "BSH", "Other"
  ]);
  const [semesters, setSemesters] = useState<string[]>([
    "S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "PG", "Faculty", "Other"
  ]);

  // Fetch departments & semesters from public config
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
        // Fallback defaults preserved
      }
    };
    fetchOptions();
  }, []);

  // Sync user state into fields
  useEffect(() => {
    if (user) {
      setFullName(user.name || user.full_name || "");
      setPhone(user.phone_number || "");
      setCollege(user.college || "");
      setUsn(user.usn || "");
      setDepartment(user.department || "");
      setSemester(user.semester || "");
    }
  }, [user]);

  // Redirect if not logged in after auth finishes
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [authLoading, user, router]);

  // Calculate completion percentage
  const completionScore = () => {
    let completed = 0;
    const total = 5;
    if (fullName.trim()) completed++;
    if (phone.trim()) completed++;
    if (college.trim()) completed++;
    if (department.trim()) completed++;
    if (semester.trim()) completed++;
    return Math.round((completed / total) * 100);
  };

  const percentage = completionScore();

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone.trim()) {
      showToast("Phone number is required.", "error");
      return;
    }
    if (!college.trim()) {
      showToast("College or institution name is required.", "error");
      return;
    }

    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await api.patch("/api/auth/me/", {
        full_name: fullName.trim(),
        phone_number: phone.trim(),
        college: college.trim(),
        usn: usn.trim(),
        department: department.trim(),
        semester: semester.trim(),
      });

      updateUser(res.data);
      setSavedSuccess(true);
      showToast("Profile details updated successfully!", "success");

      // If user arrived from an action like registering for an event, resume it
      if (pendingAction && token) {
        pendingAction.run(token);
        setPendingAction(null);
      }
    } catch (err: any) {
      console.error("Profile update failed", err);
      const msg = err.response?.data?.error || err.response?.data?.detail || "Failed to update profile. Please try again.";
      showToast(msg, "error");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-neutral-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-neutral-900" />
          <p className="font-sans text-xs uppercase tracking-widest text-neutral-500 font-medium">
            Loading Account Details...
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="w-full relative bg-neutral-50/60 min-h-screen pt-24 sm:pt-28 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation & Breadcrumb */}
        <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-neutral-200 bg-white text-xs font-medium text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 transition-all shadow-sm select-none"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>My Passes</span>
          </Link>

          <span className="text-xs font-medium text-neutral-400 tracking-wide uppercase">
            Account Settings
          </span>
        </div>

        {/* Page Title & Intro */}
        <div className="mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 text-white text-xs font-medium shadow-sm mb-3">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Participant Profile</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-950">
            Account &amp; Preferences
          </h1>

          <p className="text-sm sm:text-base text-neutral-500 mt-2 max-w-2xl leading-relaxed">
            Manage your personal details, contact number, and institutional affiliation for seamless event entry and certificate issuance.
          </p>
        </div>

        {/* ─── TWO-COLUMN MODERN LAYOUT ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* ── 1. LEFT COLUMN: IDENTITY CARD (4 COLS) ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:col-span-4 space-y-4"
          >
            {/* Identity Card */}
            <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm p-6 space-y-5">
              <div className="flex items-start gap-4">
                <div className="relative flex-shrink-0">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name || "User Avatar"}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-neutral-100 shadow-sm"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-neutral-900 ring-2 ring-neutral-100 flex items-center justify-center text-white">
                      <User className="w-6 h-6" />
                    </div>
                  )}
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="mb-1">
                    {user.is_staff ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        Staff Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-neutral-100 text-neutral-700">
                        Attendee
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg text-neutral-900 leading-snug truncate">
                    {user.name || user.full_name || "Participant"}
                  </h3>
                  <p className="text-xs text-neutral-500 truncate mt-0.5">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Verified Account Indicator */}
              <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-emerald-950 leading-tight">
                    Verified Google Account
                  </p>
                  <p className="text-[11px] text-emerald-700/80 leading-tight mt-0.5">
                    Primary email authenticated
                  </p>
                </div>
              </div>

              {/* Profile Completion Meter */}
              <div className="border-t border-neutral-100 pt-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-neutral-700">Profile Completion</span>
                  <span className="font-semibold text-neutral-900">{percentage}%</span>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="bg-neutral-900 h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
                <p className="text-[11px] text-neutral-500 leading-relaxed">
                  {percentage === 100
                    ? "All required profile details are complete."
                    : "Please ensure your phone number and college are saved to register for events."}
                </p>
              </div>

              {/* Quick Navigation Links */}
              <div className="border-t border-neutral-100 pt-4 space-y-1.5">
                <Link
                  href="/dashboard"
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-50 text-xs font-medium text-neutral-800 transition-colors group"
                >
                  <span className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-700 flex items-center justify-center group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                      <Ticket className="w-3.5 h-3.5" />
                    </div>
                    <span>My Event Passes</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-0.5 transition-all" />
                </Link>

                <Link
                  href="/events"
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-50 text-xs font-medium text-neutral-800 transition-colors group"
                >
                  <span className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-neutral-100 text-neutral-700 flex items-center justify-center group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                    <span>Browse Events</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-0.5 transition-all" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* ── 2. RIGHT COLUMN: PROFILE EDIT FORM (8 COLS) ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="lg:col-span-8"
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm p-6 sm:p-8 space-y-6"
            >
              <div className="border-b border-neutral-100 pb-4">
                <h2 className="text-xl font-bold text-neutral-950 tracking-tight">
                  Edit Personal Information
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Keep your institutional credentials updated for symposium accreditation and certificates.
                </p>
              </div>

              {/* Section 1: Contact Details */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 pb-1">
                  <User className="w-3.5 h-3.5 text-neutral-500" /> Personal &amp; Contact Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        placeholder="Your full name"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        placeholder="10-digit mobile number"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all"
                      />
                    </div>
                    <span className="text-[11px] text-neutral-400 mt-1 block">
                      Used for event entry verification and coordination.
                    </span>
                  </div>
                </div>

                {/* Email (Readonly) */}
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-200/70 bg-neutral-50 text-sm text-neutral-500 cursor-not-allowed select-none"
                    />
                  </div>
                  <span className="text-[11px] text-neutral-400 mt-1 block">
                    Linked to your authenticated Google account.
                  </span>
                </div>
              </div>

              {/* Section 2: Academic & Institutional Information */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 pb-1">
                  <Building className="w-3.5 h-3.5 text-neutral-500" /> Academic &amp; Institution Details
                </h3>

                {/* College / Institution */}
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                    College / University / Institution <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      required
                      placeholder="e.g. KMCT Institute of Emerging Technology and Management"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Department */}
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                      Department / Branch
                    </label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-neutral-200 bg-white text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all cursor-pointer appearance-none"
                      >
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400 text-xs">
                        ▼
                      </div>
                    </div>
                  </div>

                  {/* Semester */}
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                      Semester / Year
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                      <select
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-neutral-200 bg-white text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all cursor-pointer appearance-none"
                      >
                        <option value="">Select Semester</option>
                        {semesters.map((sem) => (
                          <option key={sem} value={sem}>
                            {sem}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400 text-xs">
                        ▼
                      </div>
                    </div>
                  </div>
                </div>

                {/* USN / Roll Number */}
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                    USN / University Registration Number
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      value={usn}
                      onChange={(e) => setUsn(e.target.value)}
                      placeholder="e.g. KMC22CS042"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all"
                    />
                  </div>
                  <span className="text-[11px] text-neutral-400 mt-1 block">
                    Will appear on verified certificates and activity credentials.
                  </span>
                </div>
              </div>

              {/* Submit / Action Bar */}
              <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <Link
                  href="/dashboard"
                  className="text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                  Cancel &amp; Return
                </Link>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <AnimatePresence>
                    {savedSuccess && (
                      <motion.span
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-xs font-medium text-emerald-600 flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Changes Saved
                      </motion.span>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-neutral-900 text-white font-medium text-xs sm:text-sm tracking-wide hover:bg-black transition-all shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer select-none"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
