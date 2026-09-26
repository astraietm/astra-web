"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { X, Plus, Edit2, Loader2, Upload } from "lucide-react";

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  eventToEdit?: any;
}

const CATEGORIES = ["KEYNOTE", "WORKSHOP", "FLAGSHIP CTF", "RESEARCH EXPO", "GRAND FINALE", "COMPETITION", "OTHER"];

const INPUT_CLS = "w-full px-3 py-2 bg-[#0C0C14] border-2 border-white/20 text-xs text-white font-mono placeholder:text-white/20 focus:outline-none focus:border-[#FFE816] transition-colors";
const SELECT_CLS = "w-full px-3 py-2 bg-[#0C0C14] border-2 border-white/20 text-xs text-white font-mono focus:outline-none focus:border-[#FFE816] transition-colors";

const DEFAULT_FORM = {
  title: "",
  category: "WORKSHOP",
  venue: "",
  event_date: new Date().toISOString().slice(0, 16),
  registration_end: "",
  time: "10:00 AM",
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
        time: eventToEdit.time || "10:00 AM",
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl border-2 border-white/20 bg-[#161622] shadow-[8px_8px_0px_#000] p-6 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-[#FFE816] border-2 border-black shadow-[2px_2px_0px_#000]">
              {isEditing ? <Edit2 className="w-4 h-4 text-black" /> : <Plus className="w-4 h-4 text-black" />}
            </div>
            <div>
              <h2 className="font-pixel text-base font-bold text-white uppercase">
                {isEditing ? `Edit Event: ${eventToEdit.title}` : "Add New Event"}
              </h2>
              <p className="font-mono text-[9px] text-white/40 uppercase">
                {isEditing ? "Modify event configuration" : "Create event entry for ASTRA 2026"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 border-2 border-white/20 text-white/60 hover:text-white hover:border-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-pixel text-[9px] text-white/40 uppercase mb-1">Event Title *</label>
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
              <label className="block font-pixel text-[9px] text-white/40 uppercase mb-1">Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} className={SELECT_CLS}>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Venue & Date/Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-pixel text-[9px] text-white/40 uppercase mb-1">Venue *</label>
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
              <label className="block font-pixel text-[9px] text-white/40 uppercase mb-1">Date & Start Time</label>
              <input
                type="datetime-local"
                name="event_date"
                value={formData.event_date}
                onChange={handleChange}
                className={INPUT_CLS}
              />
            </div>
            <div>
              <label className="block font-pixel text-[9px] text-white/40 uppercase mb-1">Display Time</label>
              <input
                type="text"
                name="time"
                value={formData.time}
                onChange={handleChange}
                placeholder="10:00 AM"
                className={INPUT_CLS}
              />
            </div>
          </div>

          {/* Limit, Registration Deadline & Image URL */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-pixel text-[9px] text-white/40 uppercase mb-1">Registration Limit</label>
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
              <label className="block font-pixel text-[9px] text-white/40 uppercase mb-1">Registration Deadline</label>
              <input
                type="datetime-local"
                name="registration_end"
                value={formData.registration_end}
                onChange={handleChange}
                className={INPUT_CLS}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-pixel text-[9px] text-white/40 uppercase">Image (URL or File Upload)</label>
                {formData.image && (
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, image: "" }))}
                    className="font-pixel text-[8px] text-red-400 hover:text-red-300 uppercase underline cursor-pointer"
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
                  placeholder="https://... or click Upload"
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
                  className="flex items-center gap-1.5 px-3 py-2 bg-[#FFE816] text-black font-pixel text-[9px] uppercase border-2 border-black shadow-[2px_2px_0px_#000] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-50 whitespace-nowrap cursor-pointer"
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
                <div className="mt-2 flex items-center gap-2 p-1.5 border border-white/10 bg-[#0C0C14]">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-7 h-7 object-cover border border-white/20 flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                  <span className="font-mono text-[9px] text-white/60 truncate flex-1">{formData.image}</span>
                </div>
              )}
            </div>
          </div>

          {/* Toggles: Open Status, Payment & Team */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-2 border-white/10 p-3 bg-[#0C0C14]">
            {/* Registration Open Toggle */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer mb-2">
                <input
                  type="checkbox"
                  name="is_registration_open"
                  checked={formData.is_registration_open}
                  onChange={handleChange}
                  className="w-4 h-4 accent-[#C3FF16]"
                />
                <span className="font-pixel text-[9px] text-white uppercase">Registration Open</span>
              </label>
              <p className="font-mono text-[8px] text-white/30">Allow users to register</p>
            </div>

            {/* Payment Toggle */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer mb-2">
                <input
                  type="checkbox"
                  name="requires_payment"
                  checked={formData.requires_payment}
                  onChange={handleChange}
                  className="w-4 h-4 accent-[#FFE816]"
                />
                <span className="font-pixel text-[9px] text-white uppercase">Requires Fee</span>
              </label>
              {formData.requires_payment && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-xs text-[#FFE816]">₹</span>
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
              <label className="flex items-center gap-2 cursor-pointer mb-2">
                <input
                  type="checkbox"
                  name="is_team_event"
                  checked={formData.is_team_event}
                  onChange={handleChange}
                  className="w-4 h-4 accent-[#E8CCFF]"
                />
                <span className="font-pixel text-[9px] text-white uppercase">Team Event</span>
              </label>
              {formData.is_team_event && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-[9px] text-white/40">Min:</span>
                  <input
                    type="number"
                    name="team_size_min"
                    value={formData.team_size_min}
                    onChange={handleChange}
                    min={1}
                    className={INPUT_CLS + " w-14"}
                  />
                  <span className="font-mono text-[9px] text-white/40">Max:</span>
                  <input
                    type="number"
                    name="team_size_max"
                    value={formData.team_size_max}
                    onChange={handleChange}
                    min={1}
                    className={INPUT_CLS + " w-14"}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Description & Prize */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-pixel text-[9px] text-white/40 uppercase mb-1">Description</label>
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
              <label className="block font-pixel text-[9px] text-white/40 uppercase mb-1">Prize Pool / Rewards</label>
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
          <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border-2 border-white/20 text-white/60 font-pixel text-[10px] uppercase hover:bg-white/5 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2 bg-[#FFE816] text-black font-pixel text-[10px] uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : isEditing ? (
                <Edit2 className="w-3.5 h-3.5" />
              ) : (
                <Plus className="w-3.5 h-3.5" />
              )}
              {isEditing ? "Save Changes" : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
