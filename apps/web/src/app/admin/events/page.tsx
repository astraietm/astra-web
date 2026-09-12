"use client";
import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { Plus, Edit, Loader2, RefreshCcw, Save, X } from "lucide-react";

export default function AdminEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
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

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-display font-bold text-white">Events</h1>
        <button onClick={handleSync} disabled={syncing}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50">
          {syncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
          Sync Events
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gray-500" /></div>
      ) : (
        <div className="grid gap-4">
          {events.map((event: any) => (
            <div key={event.id} className="bg-[#111318] border border-white/5 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/10 text-blue-400 font-medium">{event.category}</span>
                    {event.requires_payment && <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/10 text-yellow-400">₹{event.payment_amount}</span>}
                    {event.is_team_event && <span className="px-2 py-0.5 text-xs rounded-full bg-purple-500/10 text-purple-400">Team</span>}
                  </div>
                  <h3 className="text-lg font-display font-bold text-white">{event.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">{event.description?.substring(0, 120)}...</p>
                  <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
                    <span>📅 {new Date(event.event_date).toLocaleDateString()}</span>
                    <span>📍 {event.venue}</span>
                    <span>👥 {event.registration_count || 0}/{event.registration_limit} registered</span>
                    <span className={event.is_registration_open ? 'text-emerald-400' : 'text-red-400'}>
                      {event.is_registration_open ? '✅ Open' : '🚫 Closed'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {events.length === 0 && <div className="text-center py-20 text-gray-500">No events found.</div>}
        </div>
      )}
    </div>
  );
}
