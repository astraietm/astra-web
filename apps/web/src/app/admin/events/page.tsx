"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import {
  CalendarDays,
  Loader2,
  RefreshCcw,
  Plus,
  Edit2,
  Trash2,
  MapPin,
  Users,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import AddEventModal from "@/components/admin/AddEventModal";

function CategoryBadge({ category }: { category: string }) {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    KEYNOTE: { bg: "bg-amber-400/10", text: "text-amber-300", border: "border-amber-400/20" },
    WORKSHOP: { bg: "bg-emerald-400/10", text: "text-emerald-300", border: "border-emerald-400/20" },
    "FLAGSHIP CTF": { bg: "bg-purple-400/10", text: "text-purple-300", border: "border-purple-400/20" },
    "RESEARCH EXPO": { bg: "bg-blue-400/10", text: "text-blue-300", border: "border-blue-400/20" },
    "GRAND FINALE": { bg: "bg-pink-400/10", text: "text-pink-300", border: "border-pink-400/20" },
  };
  const current = colors[category?.toUpperCase()] ?? {
    bg: "bg-neutral-800",
    text: "text-neutral-300",
    border: "border-neutral-700",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${current.bg} ${current.text} ${current.border}`}
    >
      {category}
    </span>
  );
}

export default function AdminEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const { showToast } = useToast();

  const fetchEvents = async () => {
    try {
      const res = await api.get("/api/events/");
      setEvents(res.data);
    } catch {
      showToast("Failed to load events.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await api.post("/api/operations/sync-events/");
      showToast("Events synced successfully!", "success");
      fetchEvents();
    } catch {
      showToast("Sync failed.", "error");
    } finally {
      setSyncing(false);
    }
  };

  const handleEditClick = (event: any) => {
    setEditingEvent(event);
    setIsAddModalOpen(true);
  };

  const handleAddNewClick = () => {
    setEditingEvent(null);
    setIsAddModalOpen(true);
  };

  const handleDeleteEvent = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await api.delete(`/api/operations/events/${id}/`);
      showToast("Event deleted.", "success");
      fetchEvents();
    } catch (err: any) {
      showToast(err.response?.data?.error || "Failed to delete event.", "error");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-neutral-800/80">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-white text-neutral-950 shadow-sm">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Events Manager
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
              {events.length} configured symposium events
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAddNewClick}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-neutral-950 hover:bg-neutral-100 text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </button>
          <button
            onClick={handleSync}
            disabled={syncing}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs sm:text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {syncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
            <span>Sync</span>
          </button>
        </div>
      </div>

      <AddEventModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingEvent(null);
        }}
        onSuccess={fetchEvents}
        eventToEdit={editingEvent}
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
          <span className="text-xs text-neutral-400 uppercase tracking-widest font-medium">
            Loading events...
          </span>
        </div>
      ) : (
        <div className="grid gap-4">
          {events.map((event: any) => {
            const pct = event.registration_limit
              ? Math.min(100, Math.round(((event.registration_count || 0) / event.registration_limit) * 100))
              : 0;
            return (
              <div
                key={event.id}
                className="rounded-2xl border border-neutral-800/80 bg-neutral-900/50 backdrop-blur-xl p-5 sm:p-6 shadow-sm hover:border-neutral-700 transition-all"
              >
                <div className="flex flex-col sm:flex-row items-start gap-5">
                  {/* Date block */}
                  <div className="flex-shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-neutral-800 border border-neutral-700/60 text-white shadow-sm">
                    <span className="text-base font-bold leading-none">
                      {event.event_date
                        ? new Date(event.event_date).toLocaleDateString("en-US", { day: "2-digit" })
                        : "--"}
                    </span>
                    <span className="text-[10px] font-semibold text-neutral-400 uppercase mt-0.5">
                      {event.event_date
                        ? new Date(event.event_date).toLocaleDateString("en-US", { month: "short" })
                        : "OCT"}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <CategoryBadge category={event.category} />
                      {event.requires_payment && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
                          ₹{event.payment_amount}
                        </span>
                      )}
                      {event.is_team_event && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20">
                          Team
                        </span>
                      )}
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                          event.is_registration_open
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-red-500/10 text-red-400 border-red-500/20"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            event.is_registration_open ? "bg-emerald-400" : "bg-red-400"
                          }`}
                        />
                        {event.is_registration_open ? "Open" : "Closed"}
                      </span>

                      {/* Action buttons: Edit & Delete */}
                      <div className="flex items-center gap-2 ml-auto">
                        <button
                          onClick={() => handleEditClick(event)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-medium border border-neutral-700 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id, event.title)}
                          className="flex items-center justify-center w-8 h-8 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/40 transition-colors cursor-pointer"
                          title="Delete Event"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white mb-1 leading-snug">
                      {event.title}
                    </h3>
                    <p className="text-xs text-neutral-400 mb-3 line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400 mb-3">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                        {event.venue}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-neutral-500" />
                        {event.registration_count || 0} / {event.registration_limit} registrations
                      </span>
                    </div>

                    {/* Capacity bar */}
                    <div className="space-y-1">
                      <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-400 rounded-full transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-neutral-500 font-medium">
                        <span>Capacity</span>
                        <span>{pct}% filled</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {events.length === 0 && (
            <div className="rounded-2xl border border-neutral-800 p-16 text-center">
              <p className="text-xs text-neutral-500">No events found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
