"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  CreditCard,
  CheckCircle2,
  XCircle,
  Upload,
  Sparkles,
  Save,
  Loader2,
  Trash2,
  Trophy,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Eye,
} from "lucide-react";

interface EventEditorFormProps {
  eventId?: string | number;
  initialData?: any;
}

const CATEGORIES = [
  "KEYNOTE",
  "WORKSHOP",
  "FLAGSHIP CTF",
  "RESEARCH EXPO",
  "GRAND FINALE",
  "COMPETITION",
  "OTHER",
];

const DEFAULT_FORM = {
  title: "",
  category: "COMPETITION",
  venue: "",
  event_date: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
  registration_end: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16),
  registration_limit: 100,
  is_registration_open: true,
  requires_payment: false,
  payment_amount: "0.00",
  is_team_event: false,
  team_size_min: 1,
  team_size_max: 4,
  image: "",
  description: "",
  prize: "",
};

export default function EventEditorForm({ eventId, initialData }: EventEditorFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [loading, setLoading] = useState(!!eventId && !initialData);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const isEditing = !!eventId;

  // Load event data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        category: initialData.category || "COMPETITION",
        venue: initialData.venue || "",
        event_date: initialData.event_date
          ? new Date(initialData.event_date).toISOString().slice(0, 16)
          : new Date().toISOString().slice(0, 16),
        registration_end: initialData.registration_end
          ? new Date(initialData.registration_end).toISOString().slice(0, 16)
          : "",
        registration_limit: initialData.registration_limit || 100,
        is_registration_open: initialData.is_registration_open ?? true,
        requires_payment: initialData.requires_payment ?? false,
        payment_amount: initialData.payment_amount || "0.00",
        is_team_event: initialData.is_team_event ?? false,
        team_size_min: initialData.team_size_min || 1,
        team_size_max: initialData.team_size_max || 4,
        image: initialData.image || "",
        description: initialData.description || "",
        prize: initialData.prize || "",
      });
      setLoading(false);
    } else if (eventId) {
      const fetchEvent = async () => {
        try {
          setLoading(true);
          const res = await api.get(`/api/events/${eventId}/`);
          const data = res.data;
          setFormData({
            title: data.title || "",
            category: data.category || "COMPETITION",
            venue: data.venue || "",
            event_date: data.event_date
              ? new Date(data.event_date).toISOString().slice(0, 16)
              : new Date().toISOString().slice(0, 16),
            registration_end: data.registration_end
              ? new Date(data.registration_end).toISOString().slice(0, 16)
              : "",
            registration_limit: data.registration_limit || 100,
            is_registration_open: data.is_registration_open ?? true,
            requires_payment: data.requires_payment ?? false,
            payment_amount: data.payment_amount || "0.00",
            is_team_event: data.is_team_event ?? false,
            team_size_min: data.team_size_min || 1,
            team_size_max: data.team_size_max || 4,
            image: data.image || "",
            description: data.description || "",
            prize: data.prize || "",
          });
        } catch {
          showToast("Failed to load event for editing.", "error");
          router.push("/admin/events");
        } finally {
          setLoading(false);
        }
      };
      fetchEvent();
    }
  }, [eventId, initialData, router, showToast]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please select a valid image file (PNG, JPG, WebP).", "error");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast("Image file size must be less than 10MB.", "error");
      return;
    }

    setUploadingImage(true);
    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dykinibqt";
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "astra_gallery";

      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        const json = await res.json();
        if (json.secure_url) {
          setFormData((prev) => ({ ...prev, image: json.secure_url }));
          showToast("Poster uploaded successfully!", "success");
          return;
        }
      }

      // Fallback: convert to base64 Data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setFormData((prev) => ({ ...prev, image: reader.result as string }));
          showToast("Poster attached successfully!", "success");
        }
      };
      reader.readAsDataURL(file);
    } catch {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setFormData((prev) => ({ ...prev, image: reader.result as string }));
          showToast("Poster attached successfully!", "success");
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast("Event title is required.", "error");
      return;
    }
    if (!formData.venue.trim()) {
      showToast("Venue is required.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const eventDateObj = new Date(formData.event_date);
      const regStartObj = initialData?.registration_start
        ? new Date(initialData.registration_start)
        : new Date();
      const regEndObj = formData.registration_end
        ? new Date(formData.registration_end)
        : new Date(eventDateObj.getTime() + 24 * 60 * 60 * 1000);

      const payload = {
        ...formData,
        registration_limit: Number(formData.registration_limit) || 100,
        payment_amount: formData.requires_payment ? String(formData.payment_amount) : "0.00",
        team_size_min: formData.is_team_event ? Number(formData.team_size_min) : 1,
        team_size_max: formData.is_team_event ? Number(formData.team_size_max) : 1,
        event_date: eventDateObj.toISOString(),
        registration_start: regStartObj.toISOString(),
        registration_end: regEndObj.toISOString(),
      };

      if (eventId) {
        await api.patch(`/api/operations/events/${eventId}/`, payload);
        showToast("Event updated successfully!", "success");
      } else {
        await api.post("/api/operations/events/", payload);
        showToast("Event created successfully!", "success");
      }

      router.push("/admin/events");
    } catch (err: any) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Failed to save event. Please check required fields.";
      showToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 font-sans">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
        <p className="text-xs text-neutral-400 font-medium uppercase tracking-widest">
          Loading Event Config...
        </p>
      </div>
    );
  }

  // Format date preview
  const previewDateObj = formData.event_date ? new Date(formData.event_date) : new Date();
  const previewDate = !isNaN(previewDateObj.getTime())
    ? previewDateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "October 06, 2026";
  const previewTime = !isNaN(previewDateObj.getTime())
    ? previewDateObj.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    : "10:00 AM";

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans pb-16">
      {/* ─── Page Top Navigation Bar ─── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/admin/events"
              className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Events Manager</span>
            </Link>
            <span className="text-xs text-neutral-600">/</span>
            <span className="text-xs text-neutral-300 font-medium">
              {isEditing ? `Edit: ${formData.title || "Event"}` : "New Event"}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {isEditing ? `Edit Event: ${formData.title}` : "Create New Symposium Event"}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400">
            Configure symposium schedule, arena venue, ticket capacity, and entry fees.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <Link
            href="/admin/events"
            className="px-4 py-2.5 rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-800 hover:text-white text-xs sm:text-sm font-medium transition-colors"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-neutral-950 hover:bg-neutral-100 font-semibold text-xs sm:text-sm tracking-wide transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEditing ? "Save Changes" : "Publish Event"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ─── Main Two-Column Layout ─── */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── LEFT COLUMN: Configuration Sections (7 cols) ── */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Core Event Details */}
          <div className="bg-neutral-900/90 rounded-3xl border border-neutral-800/80 p-6 sm:p-7 space-y-5 shadow-sm">
            <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-800/80">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Event Identity &amp; Schedule
              </h2>
            </div>

            <div className="space-y-4">
              {/* Event Title */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Event Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 24H National Live CTF WarGames"
                  className="w-full px-4 py-3 bg-neutral-950/80 border border-neutral-800 rounded-2xl text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-neutral-600 transition-all shadow-inner"
                />
              </div>

              {/* Category & Venue Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-neutral-950/80 border border-neutral-800 rounded-2xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-neutral-600 transition-all cursor-pointer shadow-inner"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Arena / Venue <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Network Lab / Main Auditorium"
                    className="w-full px-4 py-3 bg-neutral-950/80 border border-neutral-800 rounded-2xl text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-neutral-600 transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Date & Start Time + Registration Deadline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Event Date &amp; Start Time <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="event_date"
                    value={formData.event_date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-neutral-950/80 border border-neutral-800 rounded-2xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-neutral-600 transition-all cursor-pointer shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Registration Deadline
                  </label>
                  <input
                    type="datetime-local"
                    name="registration_end"
                    value={formData.registration_end}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-neutral-950/80 border border-neutral-800 rounded-2xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-neutral-600 transition-all cursor-pointer shadow-inner"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Capacity, Pricing & Team Rules */}
          <div className="bg-neutral-900/90 rounded-3xl border border-neutral-800/80 p-6 sm:p-7 space-y-5 shadow-sm">
            <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-800/80">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Registration Controls &amp; Pricing
              </h2>
            </div>

            {/* Toggle Switches Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Registration Open Toggle */}
              <label
                className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                  formData.is_registration_open
                    ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-300"
                    : "bg-neutral-950/60 border-neutral-800 text-neutral-400"
                }`}
              >
                <input
                  type="checkbox"
                  name="is_registration_open"
                  checked={formData.is_registration_open}
                  onChange={handleChange}
                  className="w-4 h-4 rounded accent-emerald-500"
                />
                <div>
                  <span className="text-xs font-semibold block">Registration Open</span>
                  <span className="text-[10px] text-neutral-400">Accept live submissions</span>
                </div>
              </label>

              {/* Requires Payment Toggle */}
              <label
                className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                  formData.requires_payment
                    ? "bg-amber-950/30 border-amber-500/30 text-amber-300"
                    : "bg-neutral-950/60 border-neutral-800 text-neutral-400"
                }`}
              >
                <input
                  type="checkbox"
                  name="requires_payment"
                  checked={formData.requires_payment}
                  onChange={handleChange}
                  className="w-4 h-4 rounded accent-amber-500"
                />
                <div>
                  <span className="text-xs font-semibold block">Requires Fee</span>
                  <span className="text-[10px] text-neutral-400">Paid entry via Razorpay</span>
                </div>
              </label>

              {/* Team Event Toggle */}
              <label
                className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                  formData.is_team_event
                    ? "bg-purple-950/30 border-purple-500/30 text-purple-300"
                    : "bg-neutral-950/60 border-neutral-800 text-neutral-400"
                }`}
              >
                <input
                  type="checkbox"
                  name="is_team_event"
                  checked={formData.is_team_event}
                  onChange={handleChange}
                  className="w-4 h-4 rounded accent-purple-500"
                />
                <div>
                  <span className="text-xs font-semibold block">Team Event</span>
                  <span className="text-[10px] text-neutral-400">Multi-person teams</span>
                </div>
              </label>
            </div>

            {/* Dynamic Numeric Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Registration Capacity Limit
                </label>
                <input
                  type="number"
                  name="registration_limit"
                  min="1"
                  max="10000"
                  value={formData.registration_limit}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-neutral-950/80 border border-neutral-800 rounded-2xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-neutral-600 transition-all shadow-inner"
                />
              </div>

              {formData.requires_payment ? (
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Registration Fee (₹ INR)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="payment_amount"
                    value={formData.payment_amount}
                    onChange={handleChange}
                    placeholder="50.00"
                    className="w-full px-4 py-3 bg-neutral-950/80 border border-neutral-800 rounded-2xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-neutral-600 transition-all shadow-inner"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Entry Pricing
                  </label>
                  <div className="w-full px-4 py-3 bg-neutral-950/40 border border-neutral-800/60 rounded-2xl text-sm text-neutral-400 select-none">
                    Free Registration (₹0.00)
                  </div>
                </div>
              )}
            </div>

            {/* Team Sizing (if team event) */}
            {formData.is_team_event && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="grid grid-cols-2 gap-4 pt-3 border-t border-neutral-800/80"
              >
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Min Team Size
                  </label>
                  <input
                    type="number"
                    name="team_size_min"
                    min="1"
                    max="20"
                    value={formData.team_size_min}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-neutral-950/80 border border-neutral-800 rounded-2xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-neutral-600 transition-all shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Max Team Size
                  </label>
                  <input
                    type="number"
                    name="team_size_max"
                    min="1"
                    max="20"
                    value={formData.team_size_max}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-neutral-950/80 border border-neutral-800 rounded-2xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-neutral-600 transition-all shadow-inner"
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Card 3: Synopsis & Rewards */}
          <div className="bg-neutral-900/90 rounded-3xl border border-neutral-800/80 p-6 sm:p-7 space-y-5 shadow-sm">
            <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-800/80">
              <Trophy className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Synopsis &amp; Prize Pool
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Prize Pool / Rewards Description
                </label>
                <input
                  type="text"
                  name="prize"
                  value={formData.prize}
                  onChange={handleChange}
                  placeholder="e.g. ₹50,000 Cash Pool + Certificates + Merch"
                  className="w-full px-4 py-3 bg-neutral-950/80 border border-neutral-800 rounded-2xl text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-neutral-600 transition-all shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Event Description / Rules Synopsis
                </label>
                <textarea
                  name="description"
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Provide comprehensive details about the challenge structure, scoring metrics, prerequisites, and timeline..."
                  className="w-full px-4 py-3 bg-neutral-950/80 border border-neutral-800 rounded-2xl text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-neutral-600 transition-all resize-y shadow-inner"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Poster Artwork & Live Mockup (5 cols) ── */}
        <div className="lg:col-span-5 space-y-6">
          {/* Poster Upload & URL */}
          <div className="bg-neutral-900/90 rounded-3xl border border-neutral-800/80 p-6 sm:p-7 space-y-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-blue-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Poster Visual
                </h2>
              </div>
              {formData.image && (
                <button
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, image: "" }))}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" /> Remove
                </button>
              )}
            </div>

            {/* Poster Upload Box */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-neutral-800 hover:border-neutral-600 rounded-2xl p-6 text-center cursor-pointer bg-neutral-950/60 hover:bg-neutral-950 transition-all group"
              >
                {uploadingImage ? (
                  <div className="py-6 flex flex-col items-center gap-2 text-neutral-400">
                    <Loader2 className="w-8 h-8 animate-spin text-white" />
                    <p className="text-xs font-medium">Uploading high-res poster...</p>
                  </div>
                ) : formData.image ? (
                  <div className="space-y-3">
                    <div className="relative rounded-xl overflow-hidden aspect-[3/4] max-h-[300px] mx-auto border border-neutral-800 bg-neutral-950">
                      <img
                        src={formData.image}
                        alt="Event poster"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <p className="text-[11px] text-neutral-400 group-hover:text-white transition-colors">
                      Click to replace poster artwork
                    </p>
                  </div>
                ) : (
                  <div className="py-8 space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 mx-auto group-hover:text-white group-hover:scale-110 transition-all">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">Upload Poster Image</p>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        PNG, JPG, WebP up to 10MB
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Direct Image URL input */}
              <div className="mt-3">
                <label className="block text-[11px] font-medium text-neutral-400 mb-1">
                  Or Paste Public Image URL:
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://res.cloudinary.com/..."
                  className="w-full px-3.5 py-2 bg-neutral-950/80 border border-neutral-800 rounded-xl text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Live Card Preview Mockup */}
          <div className="bg-neutral-900/90 rounded-3xl border border-neutral-800/80 p-6 sm:p-7 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 pb-3 border-b border-neutral-800/80">
              <Eye className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Live Public Preview
              </h2>
            </div>

            {/* Public Card Mockup */}
            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-md text-neutral-950">
              <div className="relative aspect-[16/9] bg-neutral-950 overflow-hidden">
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt={formData.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-neutral-500 p-4 text-center space-y-1">
                    <Sparkles className="w-8 h-8 text-amber-400" />
                    <span className="text-xs font-bold text-white">
                      {formData.title || "Event Title"}
                    </span>
                  </div>
                )}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="backdrop-blur-md bg-neutral-950/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full border border-white/10">
                    {formData.category}
                  </span>
                  <span className="backdrop-blur-md bg-white/90 text-neutral-950 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {formData.is_team_event
                      ? `Team (${formData.team_size_min}-${formData.team_size_max})`
                      : "Solo"}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <h3 className="text-base font-bold text-neutral-950 leading-tight">
                    {formData.title || "Untitled Symposium Event"}
                  </h3>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    {previewDate} • {previewTime} • {formData.venue || "KMCT Campus"}
                  </p>
                </div>

                {formData.prize && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-semibold">
                    <Trophy className="w-3 h-3 text-amber-600" />
                    <span>{formData.prize}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-neutral-950">
                    {formData.requires_payment
                      ? `₹${formData.payment_amount || "0.00"}`
                      : "FREE ENTRY"}
                  </span>
                  <span className="text-[11px] text-neutral-500 font-medium">
                    Limit: {formData.registration_limit} Slots
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
