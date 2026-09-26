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
  ArrowRight,
  CheckCircle2,
  Loader2,
  Save,
  ShieldCheck,
  Ticket,
  Calendar,
  Sparkles,
} from "lucide-react";
import { MarqueeTicker } from "@/components/ui/MarqueeTicker";

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
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-graph-paper">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-black" />
          <p className="font-mono text-sm uppercase tracking-widest text-neutral-600">
            Loading Account Details...
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="w-full relative bg-graph-paper min-h-screen pb-24">
      {/* ─── MARQUEE TICKER HEADER ─── */}
      <div className="pt-20 sm:pt-24">
        <MarqueeTicker
          items={[
            "ASTRA 2026 // PARTICIPANT ACCOUNT",
            "OCT 6 & 7 — KMCT CALICUT",
            "MANAGE PROFILE & INSTITUTIONAL AFFILIATION",
            "OFFICIAL CREDENTIALS",
          ]}
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8 pb-4 border-b-2 border-black/20">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-white border-2 border-black px-3.5 py-1.5 font-mono text-xs font-bold uppercase hover:bg-[#FFE816] transition-colors shadow-[2px_2px_0px_#000] select-none"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>My Passes</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-gray-500 uppercase">
              ACCOUNT SETTINGS
            </span>
          </div>
        </div>

        {/* Page Title & Intro */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-xs font-bold bg-[#FFE816] text-black border-2 border-black px-2.5 py-0.5 uppercase shadow-[2px_2px_0px_#000]">
              PARTICIPANT PROFILE
            </span>
            <span className="font-mono text-xs bg-black text-white px-2 py-0.5 font-bold uppercase">
              ASTRA 2026
            </span>
          </div>

          <h1 className="font-anton text-4xl sm:text-6xl uppercase text-black tracking-tight leading-none mb-3">
            YOUR PROFILE &amp; PREFERENCES
          </h1>

          <p className="font-editorial italic text-xl sm:text-2xl text-gray-700 max-w-2xl">
            Verify and maintain your contact, college, and academic details for seamless event entry and certificate issuance.
          </p>
        </div>

        {/* ─── TWO-COLUMN MODERN EDITORIAL LAYOUT ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ── 1. LEFT COLUMN: IDENTITY CARD (4 COLS) ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-4 space-y-6"
          >
            {/* Identity Card */}
            <div className="bg-white border-2 border-black shadow-[6px_6px_0px_#000] p-6 space-y-5">
              <div className="flex items-start gap-4">
                <div className="relative">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name || "User Avatar"}
                      className="w-16 h-16 border-2 border-black object-cover shadow-[2px_2px_0px_#FFE816]"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-[#0C0C14] border-2 border-black flex items-center justify-center text-white">
                      <User className="w-8 h-8" />
                    </div>
                  )}
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-black" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="mb-1">
                    {user.is_staff ? (
                      <span className="font-pixel text-[8px] bg-[#FFE816] text-black px-1.5 py-0.5 font-bold uppercase tracking-wider">
                        STAFF // ORGANIZER
                      </span>
                    ) : (
                      <span className="font-pixel text-[8px] bg-black text-white px-1.5 py-0.5 font-bold uppercase tracking-wider">
                        ATTENDEE
                      </span>
                    )}
                  </div>
                  <h3 className="font-anton text-xl uppercase text-black leading-tight truncate">
                    {user.name || user.full_name || "Participant"}
                  </h3>
                  <p className="font-mono text-xs text-gray-500 truncate mt-0.5">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Verified Account Indicator */}
              <div className="bg-[#FAF9F6] border border-black p-3 flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="font-mono text-[11px] font-bold text-black uppercase leading-tight">
                    Verified Google Account
                  </p>
                  <p className="font-mono text-[10px] text-gray-500 leading-tight mt-0.5">
                    Primary email authenticated
                  </p>
                </div>
              </div>

              {/* Profile Completion Meter */}
              <div className="border-t-2 border-black/10 pt-4 space-y-2">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-bold text-black uppercase">Profile Status</span>
                  <span className="font-bold text-black">{percentage}%</span>
                </div>
                <div className="w-full bg-[#E5E5F0] border border-black h-2 overflow-hidden">
                  <motion.div
                    className="bg-[#FFE816] h-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                  />
                </div>
                <p className="font-mono text-[10px] text-gray-500">
                  {percentage === 100
                    ? "✓ All required profile details are complete."
                    : "* Please ensure phone & college are saved to register for events."}
                </p>
              </div>

              {/* Quick Navigation Links */}
              <div className="border-t-2 border-black/10 pt-4 space-y-2">
                <Link
                  href="/dashboard"
                  className="flex items-center justify-between p-2.5 bg-[#FAF9F6] border border-black text-xs font-mono font-bold uppercase hover:bg-[#C3FF16] transition-colors group"
                >
                  <span className="flex items-center gap-2">
                    <Ticket className="w-3.5 h-3.5" /> My Event Passes
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  href="/events"
                  className="flex items-center justify-between p-2.5 bg-[#FAF9F6] border border-black text-xs font-mono font-bold uppercase hover:bg-th-yellow transition-colors group"
                >
                  <span className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" /> Browse Events
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* ── 2. RIGHT COLUMN: PROFILE EDIT FORM (8 COLS) ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="lg:col-span-8"
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white border-2 border-black shadow-[6px_6px_0px_#000] p-6 sm:p-8 space-y-6"
            >
              <div className="border-b-2 border-black pb-4 flex items-center justify-between">
                <div>
                  <h2 className="font-anton text-2xl uppercase text-black leading-tight">
                    Edit Personal Information
                  </h2>
                  <p className="font-mono text-xs text-gray-600 mt-1">
                    Keep your institutional credentials updated for symposium accreditation.
                  </p>
                </div>
                <Sparkles className="w-5 h-5 text-black hidden sm:block" />
              </div>

              {/* Section 1: Contact Details */}
              <div className="space-y-4">
                <h4 className="font-mono text-xs font-bold uppercase text-black flex items-center gap-1.5 pb-1 border-b border-black/10">
                  <User className="w-3.5 h-3.5 text-black" /> Personal &amp; Contact Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block font-mono text-xs font-bold text-black uppercase mb-1.5">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        placeholder="Your Full Name"
                        className="w-full pl-10 pr-3.5 py-2.5 border-2 border-black font-sans text-sm text-black placeholder:text-gray-400 focus:outline-none focus:bg-[#FFFEE5] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block font-mono text-xs font-bold text-black uppercase mb-1.5">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        placeholder="10-digit mobile number"
                        className="w-full pl-10 pr-3.5 py-2.5 border-2 border-black font-mono text-sm text-black placeholder:text-gray-400 focus:outline-none focus:bg-[#FFFEE5] transition-colors"
                      />
                    </div>
                    <span className="font-mono text-[10px] text-gray-500 mt-1 block">
                      Used for SMS entry verification &amp; coordinator calls.
                    </span>
                  </div>
                </div>

                {/* Email (Readonly) */}
                <div>
                  <label className="block font-mono text-xs font-bold text-black uppercase mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full pl-10 pr-3.5 py-2.5 border-2 border-black/40 bg-gray-100 font-mono text-sm text-gray-600 cursor-not-allowed select-none"
                    />
                  </div>
                  <span className="font-mono text-[10px] text-gray-500 mt-1 block">
                    Linked to your Google Single Sign-On account.
                  </span>
                </div>
              </div>

              {/* Section 2: Academic & Institutional Information */}
              <div className="space-y-4 pt-2">
                <h4 className="font-mono text-xs font-bold uppercase text-black flex items-center gap-1.5 pb-1 border-b border-black/10">
                  <Building className="w-3.5 h-3.5 text-black" /> Academic &amp; Institution Details
                </h4>

                {/* College / Institution */}
                <div>
                  <label className="block font-mono text-xs font-bold text-black uppercase mb-1.5">
                    College / University / Institution *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      required
                      placeholder="e.g. KMCT Institute of Emerging Technology and Management"
                      className="w-full pl-10 pr-3.5 py-2.5 border-2 border-black font-sans text-sm text-black placeholder:text-gray-400 focus:outline-none focus:bg-[#FFFEE5] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Department */}
                  <div>
                    <label className="block font-mono text-xs font-bold text-black uppercase mb-1.5">
                      Department / Branch
                    </label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full pl-10 pr-8 py-2.5 border-2 border-black bg-white font-mono text-sm text-black focus:outline-none focus:bg-[#FFFEE5] transition-colors cursor-pointer appearance-none"
                      >
                        <option value="">Select Department</option>
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-xs">
                        ▼
                      </div>
                    </div>
                  </div>

                  {/* Semester */}
                  <div>
                    <label className="block font-mono text-xs font-bold text-black uppercase mb-1.5">
                      Semester / Year
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <select
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        className="w-full pl-10 pr-8 py-2.5 border-2 border-black bg-white font-mono text-sm text-black focus:outline-none focus:bg-[#FFFEE5] transition-colors cursor-pointer appearance-none"
                      >
                        <option value="">Select Semester</option>
                        {semesters.map((sem) => (
                          <option key={sem} value={sem}>
                            {sem}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-xs">
                        ▼
                      </div>
                    </div>
                  </div>
                </div>

                {/* USN / Roll Number */}
                <div>
                  <label className="block font-mono text-xs font-bold text-black uppercase mb-1.5">
                    USN / University Registration Number
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={usn}
                      onChange={(e) => setUsn(e.target.value)}
                      placeholder="e.g. KMC22CS042"
                      className="w-full pl-10 pr-3.5 py-2.5 border-2 border-black font-mono text-sm text-black placeholder:text-gray-400 focus:outline-none focus:bg-[#FFFEE5] transition-colors"
                    />
                  </div>
                  <span className="font-mono text-[10px] text-gray-500 mt-1 block">
                    Printed on your verified certificates and KTU activity point credentials.
                  </span>
                </div>
              </div>

              {/* Submit / Action Bar */}
              <div className="pt-4 border-t-2 border-black flex flex-col sm:flex-row items-center justify-between gap-4">
                <Link
                  href="/dashboard"
                  className="font-mono text-xs uppercase font-bold text-gray-600 hover:text-black transition-colors"
                >
                  Cancel &amp; Return
                </Link>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <AnimatePresence>
                    {savedSuccess && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="font-mono text-xs font-bold text-emerald-700 flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Saved!
                      </motion.span>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full sm:w-auto px-8 py-3 bg-[#FFE816] text-black font-display font-bold text-xs sm:text-sm uppercase tracking-wider border-2 border-black hover:bg-black hover:text-white transition-colors shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer select-none"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving Changes...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Profile Changes</span>
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
