"use client";
import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { CalendarDays, Loader2, RefreshCcw, Plus, Edit2, Trash2 } from "lucide-react";
import AddEventModal from "@/components/admin/AddEventModal";

function CategoryBadge({ category }: { category: string }) {
  const colors: Record<string, string> = {
    KEYNOTE:       "bg-[#FFE816] text-black border-black",
    WORKSHOP:      "bg-[#C3FF16] text-black border-black",
    "FLAGSHIP CTF":"bg-[#F79CFF] text-black border-black",
    "RESEARCH EXPO":"bg-[#97F8B7] text-black border-black",
    "GRAND FINALE":"bg-[#E8CCFF] text-black border-black",
  };
  const cls = colors[category?.toUpperCase()] ?? "bg-white/10 text-white border-white/20";
  return (
    <span className={`font-pixel text-[8px] uppercase px-1.5 py-0.5 border shadow-[1px_1px_0px_#000] ${cls}`}>
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
    } catch { showToast("Failed to load events.", "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await api.post("/api/operations/sync-events/");
      showToast("Events synced successfully!", "success");
      fetchEvents();
    } catch { showToast("Sync failed.", "error"); }
    finally { setSyncing(false); }
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
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 bg-[#FFE816] border-2 border-black shadow-[3px_3px_0px_#000]">
            <CalendarDays className="w-4 h-4 text-black" />
          </div>
          <div>
            <h1 className="font-pixel text-xl font-bold text-white uppercase">Events</h1>
            <p className="font-mono text-[10px] text-white/30 uppercase">{events.length} events</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAddNewClick}
            className="flex items-center gap-2 px-4 py-2 bg-[#C3FF16] text-black font-pixel text-[10px] uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Event
          </button>
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-2 px-4 py-2 bg-[#FFE816] text-black font-pixel text-[10px] uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {syncing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCcw className="w-3.5 h-3.5" />}
            Sync Events
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
          <Loader2 className="w-6 h-6 animate-spin text-[#FFE816]" />
          <span className="font-pixel text-[10px] text-white/30 uppercase animate-pulse">Loading...</span>
        </div>
      ) : (
        <div className="grid gap-4">
          {events.map((event: any) => {
            const pct = event.registration_limit
              ? Math.min(100, Math.round((event.registration_count || 0) / event.registration_limit * 100))
              : 0;
            return (
              <div
                key={event.id}
                className="border-2 border-white/20 bg-[#161622] p-5 shadow-[4px_4px_0px_rgba(255,255,255,0.06)] hover:shadow-[6px_6px_0px_rgba(255,255,255,0.08)] transition-shadow"
              >
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  {/* Date block */}
                  <div className="flex-shrink-0 flex flex-col items-center justify-center w-14 h-14 bg-[#FFE816] border-2 border-black shadow-[2px_2px_0px_#000] text-black">
                    <span className="font-pixel text-xs font-bold leading-none">
                      {event.event_date ? new Date(event.event_date).toLocaleDateString("en-US", { day: "2-digit" }) : "--"}
                    </span>
                    <span className="font-pixel text-[8px] uppercase">
                      {event.event_date ? new Date(event.event_date).toLocaleDateString("en-US", { month: "short" }) : "OCT"}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <CategoryBadge category={event.category} />
                      {event.requires_payment && (
                        <span className="font-pixel text-[8px] uppercase px-1.5 py-0.5 border border-[#FFE816] text-[#FFE816] shadow-[1px_1px_0px_rgba(255,232,22,0.3)]">
                          ₹{event.payment_amount}
                        </span>
                      )}
                      {event.is_team_event && (
                        <span className="font-pixel text-[8px] uppercase px-1.5 py-0.5 border border-[#E8CCFF] text-[#E8CCFF]">
                          Team
                        </span>
                      )}
                      <span className={`font-pixel text-[8px] uppercase px-1.5 py-0.5 border ${event.is_registration_open ? "border-[#C3FF16] text-[#C3FF16]" : "border-red-400 text-red-400"}`}>
                        {event.is_registration_open ? "● Open" : "○ Closed"}
                      </span>

                      {/* Action buttons: Edit & Delete */}
                      <div className="flex items-center gap-1.5 ml-auto">
                        <button
                          onClick={() => handleEditClick(event)}
                          className="flex items-center gap-1 px-2.5 py-1 bg-[#FFE816] text-black font-pixel text-[8px] uppercase border border-black shadow-[1px_1px_0px_#000] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                        >
                          <Edit2 className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id, event.title)}
                          className="flex items-center justify-center w-6 h-6 border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-400 transition-colors"
                          title="Delete Event"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <h3 className="font-pixel text-sm text-white font-bold mb-1 leading-tight">{event.title}</h3>
                    <p className="font-mono text-[10px] text-white/40 mb-3 line-clamp-2">{event.description?.substring(0, 120)}</p>

                    <div className="flex flex-wrap gap-4 text-[10px] font-mono text-white/30 mb-3">
                      <span>📍 {event.venue}</span>
                      <span>👥 {event.registration_count || 0} / {event.registration_limit}</span>
                    </div>

                    {/* Capacity bar */}
                    <div className="h-1.5 bg-white/10 border border-white/10 overflow-hidden">
                      <div
                        className="h-full bg-[#C3FF16] transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="font-pixel text-[8px] text-white/20 mt-1">{pct}% capacity</p>
                  </div>
                </div>
              </div>
            );
          })}
          {events.length === 0 && (
            <div className="border-2 border-white/10 p-16 text-center">
              <p className="font-pixel text-[10px] text-white/20 uppercase">No events found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
