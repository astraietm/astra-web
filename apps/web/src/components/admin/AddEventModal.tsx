"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { X, Plus, Edit2, Loader2, Upload, CalendarDays, Sparkles } from "lucide-react";

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  eventToEdit?: any;
}

const CATEGORIES = ["KEYNOTE", "WORKSHOP", "FLAGSHIP CTF", "RESEARCH EXPO", "GRAND FINALE", "COMPETITION", "OTHER"];

const INPUT_CLS =
  "w-full px-3.5 py-2.5 bg-neutral-950/80 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-neutral-600 transition-all";
const SELECT_CLS =
  "w-full px-3.5 py-2.5 bg-neutral-950/80 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-neutral-600 transition-all";

const DEFAULT_FORM = {
  title: "",
  category: "WORKSHOP",
  venue: "",
  event_date: new Date().toISOString().slice(0, 16),
  registration_end: "",
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

export default function AddEventModal({ isOpen, onClose, onSuccess, eventToEdit }: AddEventModalProps) {
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState(DEFAULT_FORM);

  useEffect(() => {
    if (eventToEdit) {
      setFormData({
        title: eventToEdit.title || "",
        category: eventToEdit.category || "WORKSHOP",
        venue: eventToEdit.venue || "",
        event_date: eventToEdit.event_date ? new Date(eventToEdit.event_date).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
        registration_end: eventToEdit.registration_end ? new Date(eventToEdit.registration_end).toISOString().slice(0, 16) : "",
        registration_limit: eventToEdit.registration_limit || 100,
        is_registration_open: eventToEdit.is_registration_open ?? true,
        requires_payment: eventToEdit.requires_payment ?? false,
        payment_amount: eventToEdit.payment_amount || "0.00",
        is_team_event: eventToEdit.is_team_event ?? false,
        team_size_min: eventToEdit.team_size_min || 1,
        team_size_max: eventToEdit.team_size_max || 4,
        image: eventToEdit.image || "",
        description: eventToEdit.description || "",
        prize: eventToEdit.prize || "",
      });
    } else {
      setFormData(DEFAULT_FORM);
    }
  }, [eventToEdit, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please select a valid image file.", "error");
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
          showToast("Image uploaded successfully!", "success");
          return;
        }
      }

      // Fallback: convert to base64 Data URL if Cloudinary preset response wasn't ok
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setFormData((prev) => ({ ...prev, image: reader.result as string }));
          showToast("Image attached successfully!", "success");
        }
      };
      reader.readAsDataURL(file);
    } catch {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setFormData((prev) => ({ ...prev, image: reader.result as string }));
          showToast("Image attached successfully!", "success");
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.venue.trim()) {
      showToast("Title and Venue are required.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const eventDateObj = new Date(formData.event_date);
      const regStartObj = eventToEdit?.registration_start
        ? new Date(eventToEdit.registration_start)
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

      if (eventToEdit?.id) {
        await api.patch(`/api/operations/events/${eventToEdit.id}/`, payload);
        showToast("Event updated successfully!", "success");
      } else {
        await api.post("/api/operations/events/", payload);
        showToast("Event created successfully!", "success");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.error || err.response?.data?.detail || "Failed to save event.";
      showToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const isEditing = !!eventToEdit;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl p-6 sm:p-7 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-white text-neutral-950 shadow-sm">
              {isEditing ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {isEditing ? `Edit Event: ${eventToEdit.title}` : "Add New Event"}
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                {isEditing ? "Modify event configuration and details" : "Create a new event listing for ASTRA 2026"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Event Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Cyber Security Workshop"
                required
                className={INPUT_CLS}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Category <span className="text-red-400">*</span>
              </label>
              <select name="category" value={formData.category} onChange={handleChange} className={SELECT_CLS}>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Venue & Date/Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Venue <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                placeholder="e.g. Main Auditorium"
                required
                className={INPUT_CLS}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Date &amp; Start Time
              </label>
              <input
                type="datetime-local"
                name="event_date"
                value={formData.event_date}
                onChange={handleChange}
                className={INPUT_CLS}
              />
            </div>
          </div>

          {/* Limit, Registration Deadline & Image URL */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">Registration Limit</label>
              <input
                type="number"
                name="registration_limit"
                value={formData.registration_limit}
                onChange={handleChange}
                min={1}
                className={INPUT_CLS}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">Registration Deadline</label>
              <input
                type="datetime-local"
                name="registration_end"
                value={formData.registration_end}
                onChange={handleChange}
                className={INPUT_CLS}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-neutral-300">Image</label>
                {formData.image && (
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, image: "" }))}
                    className="text-[11px] text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="Image URL or upload"
                  className={INPUT_CLS}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="flex items-center gap-1.5 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-medium border border-neutral-700 transition-colors disabled:opacity-50 whitespace-nowrap cursor-pointer"
                  title="Upload image from computer"
                >
                  {uploadingImage ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  <span>Upload</span>
                </button>
              </div>
              {formData.image && (
                <div className="mt-2 flex items-center gap-2 p-1.5 rounded-lg border border-neutral-800 bg-neutral-950/60">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-7 h-7 object-cover rounded border border-neutral-800 flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                  <span className="text-[11px] text-neutral-400 truncate flex-1">{formData.image}</span>
                </div>
              )}
            </div>
          </div>

          {/* Toggles: Open Status, Payment & Team */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-xl border border-neutral-800/80 p-4 bg-neutral-950/50">
            {/* Registration Open Toggle */}
            <div>
              <label className="flex items-center gap-2.5 cursor-pointer mb-1">
                <input
                  type="checkbox"
                  name="is_registration_open"
                  checked={formData.is_registration_open}
                  onChange={handleChange}
                  className="w-4 h-4 rounded accent-emerald-500"
                />
                <span className="text-xs font-medium text-white">Registration Open</span>
              </label>
              <p className="text-[11px] text-neutral-500">Allow users to register</p>
            </div>

            {/* Payment Toggle */}
            <div>
              <label className="flex items-center gap-2.5 cursor-pointer mb-1">
                <input
                  type="checkbox"
                  name="requires_payment"
                  checked={formData.requires_payment}
                  onChange={handleChange}
                  className="w-4 h-4 rounded accent-amber-400"
                />
                <span className="text-xs font-medium text-white">Requires Fee</span>
              </label>
              {formData.requires_payment && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-neutral-400">₹</span>
                  <input
                    type="number"
                    name="payment_amount"
                    value={formData.payment_amount}
                    onChange={handleChange}
                    step="0.01"
                    placeholder="250.00"
                    className={INPUT_CLS + " text-xs"}
                  />
                </div>
              )}
            </div>

            {/* Team Event Toggle */}
            <div>
              <label className="flex items-center gap-2.5 cursor-pointer mb-1">
                <input
                  type="checkbox"
                  name="is_team_event"
                  checked={formData.is_team_event}
                  onChange={handleChange}
                  className="w-4 h-4 rounded accent-purple-400"
                />
                <span className="text-xs font-medium text-white">Team Event</span>
              </label>
              {formData.is_team_event && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[11px] text-neutral-400">Min:</span>
                  <input
                    type="number"
                    name="team_size_min"
                    value={formData.team_size_min}
                    onChange={handleChange}
                    min={1}
                    className={INPUT_CLS + " w-14 text-xs"}
                  />
                  <span className="text-[11px] text-neutral-400">Max:</span>
                  <input
                    type="number"
                    name="team_size_max"
                    value={formData.team_size_max}
                    onChange={handleChange}
                    min={1}
                    className={INPUT_CLS + " w-14 text-xs"}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Description & Prize */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Detailed event description..."
                className={INPUT_CLS}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">Prize Pool / Rewards</label>
              <input
                type="text"
                name="prize"
                value={formData.prize}
                onChange={handleChange}
                placeholder="e.g. ₹50,000 Cash Pool"
                className={INPUT_CLS}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-neutral-950 hover:bg-neutral-100 text-xs font-semibold tracking-wide transition-all shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : isEditing ? (
                <Edit2 className="w-3.5 h-3.5" />
              ) : (
                <Plus className="w-3.5 h-3.5" />
              )}
              <span>{isEditing ? "Save Changes" : "Create Event"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
