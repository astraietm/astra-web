"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { Send, Loader2, Bell, AlertTriangle, CheckCircle2, Info } from "lucide-react";

function PriorityBadge({ priority }: { priority: string }) {
  const map: Record<string, { bg: string; text: string; border: string }> = {
    URGENT: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" },
    NORMAL: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
    SUCCESS: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
  };
  const current = map[priority] ?? {
    bg: "bg-neutral-800",
    text: "text-neutral-300",
    border: "border-neutral-700",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${current.bg} ${current.text} ${current.border}`}
    >
      {priority}
    </span>
  );
}

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState("NORMAL");
  const [recipients, setRecipients] = useState("All Registered Users");
  const [sending, setSending] = useState(false);
  const { showToast } = useToast();

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/api/ops/notifications/");
      setNotifications(res.data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) {
      showToast("Subject and message are required.", "error");
      return;
    }
    setSending(true);
    try {
      await api.post("/api/ops/notifications/", {
        subject,
        message,
        priority,
        recipients_criteria: recipients,
      });
      showToast("Notification broadcasted successfully!", "success");
      setSubject("");
      setMessage("");
      fetchNotifications();
    } catch {
      showToast("Failed to send notification.", "error");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 pb-2 border-b border-neutral-800/80">
        <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-white text-neutral-950 shadow-sm">
          <Bell className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Broadcast &amp; Notifications
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
            Send announcements and alert emails to registered participants
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Send Broadcast Form */}
        <div className="lg:col-span-6 rounded-2xl border border-neutral-800/80 bg-neutral-900/50 backdrop-blur-xl p-6 sm:p-7 shadow-sm">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Send className="w-4 h-4 text-white" /> Create Announcement
          </h2>
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Subject line <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Schedule Update for Keynote Hall"
                className="w-full px-3.5 py-2.5 bg-neutral-950/80 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-neutral-600 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-950/80 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-neutral-600 transition-all cursor-pointer"
                >
                  <option value="NORMAL">Normal</option>
                  <option value="URGENT">Urgent</option>
                  <option value="SUCCESS">Success</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">Recipients</label>
                <select
                  value={recipients}
                  onChange={(e) => setRecipients(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-950/80 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-neutral-600 transition-all cursor-pointer"
                >
                  <option value="All Registered Users">All Registered Users</option>
                  <option value="Workshop Attendees">Workshop Attendees</option>
                  <option value="CTF Participants">CTF Participants</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Message Content <span className="text-red-400">*</span>
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your announcement details here..."
                className="w-full px-3.5 py-2.5 bg-neutral-950/80 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-neutral-600 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full py-2.5 px-4 rounded-xl bg-white text-neutral-950 hover:bg-neutral-100 font-semibold text-xs sm:text-sm tracking-wide transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Send Broadcast</span>
            </button>
          </form>
        </div>

        {/* History Feed */}
        <div className="lg:col-span-6 space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Past Announcements
          </h2>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-white" />
              <span className="text-xs text-neutral-400">Loading history...</span>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notif: any) => (
                <div
                  key={notif.id}
                  className="rounded-2xl border border-neutral-800/80 bg-neutral-900/50 backdrop-blur-xl p-4 sm:p-5 shadow-sm space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-white truncate">{notif.subject}</h3>
                    <PriorityBadge priority={notif.priority} />
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">{notif.message}</p>
                  <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-2 border-t border-neutral-800">
                    <span>Target: {notif.recipients_criteria}</span>
                    <span>{new Date(notif.created_at).toLocaleString()}</span>
                  </div>
                </div>
              ))}
              {notifications.length === 0 && (
                <div className="rounded-2xl border border-neutral-800 p-12 text-center">
                  <p className="text-xs text-neutral-500">No past announcements found.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
