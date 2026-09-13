"use client";
import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { Send, Loader2, Bell } from "lucide-react";

const INPUT_CLS = "w-full px-3 py-2 bg-[#0C0C14] border-2 border-white/20 text-sm text-white font-mono placeholder:text-white/20 focus:outline-none focus:border-[#FFE816] transition-colors";

function PriorityBadge({ priority }: { priority: string }) {
  const map: Record<string, string> = {
    URGENT:  "bg-red-400 text-black border-black",
    NORMAL:  "bg-[#97F8B7] text-black border-black",
    SUCCESS: "bg-[#C3FF16] text-black border-black",
  };
  return (
    <span className={`font-pixel text-[8px] uppercase px-1.5 py-0.5 border shadow-[1px_1px_0px_#000] ${map[priority] ?? "bg-white/10 text-white border-white/20"}`}>
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
    try { const res = await api.get("/api/ops/notifications/"); setNotifications(res.data); }
    catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) { showToast("Subject and message are required.", "error"); return; }
    setSending(true);
    try {
      await api.post("/api/ops/notifications/", { subject, message, priority, recipients_criteria: recipients });
      showToast("Notification sent!", "success");
      setSubject(""); setMessage("");
      fetchNotifications();
    } catch { showToast("Failed to send.", "error"); }
    finally { setSending(false); }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center justify-center w-9 h-9 bg-[#FFE816] border-2 border-black shadow-[3px_3px_0px_#000]">
          <Bell className="w-4 h-4 text-black" />
        </div>
        <div>
          <h1 className="font-pixel text-xl font-bold text-white uppercase">Notifications</h1>
          <p className="font-mono text-[10px] text-white/30 uppercase">Broadcast Messages</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compose */}
        <div className="border-2 border-white/20 bg-[#161622] shadow-[4px_4px_0px_rgba(255,255,255,0.06)] p-5">
          <div className="flex items-center gap-2 mb-5 pb-4 border-b-2 border-white/10">
            <Send className="w-4 h-4 text-[#FFE816]" />
            <span className="font-pixel text-[10px] text-white uppercase tracking-wider">Compose Broadcast</span>
          </div>
          <form onSubmit={handleSend} className="space-y-3">
            <div>
              <label className="block font-pixel text-[9px] text-white/30 uppercase tracking-wider mb-1.5">Subject</label>
              <input type="text" placeholder="Notification subject..." value={subject}
                onChange={(e) => setSubject(e.target.value)} required className={INPUT_CLS} />
            </div>
            <div>
              <label className="block font-pixel text-[9px] text-white/30 uppercase tracking-wider mb-1.5">Message</label>
              <textarea placeholder="Notification body..." value={message}
                onChange={(e) => setMessage(e.target.value)} required rows={4}
                className={INPUT_CLS + " resize-none"} />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block font-pixel text-[9px] text-white/30 uppercase tracking-wider mb-1.5">Priority</label>
                <select value={priority} onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0C0C14] border-2 border-white/20 text-sm text-white font-mono focus:outline-none focus:border-[#FFE816] transition-colors">
                  <option value="NORMAL">Normal</option>
                  <option value="URGENT">Urgent</option>
                  <option value="SUCCESS">Success</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block font-pixel text-[9px] text-white/30 uppercase tracking-wider mb-1.5">Recipients</label>
                <select value={recipients} onChange={(e) => setRecipients(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0C0C14] border-2 border-white/20 text-sm text-white font-mono focus:outline-none focus:border-[#FFE816] transition-colors">
                  <option>All Registered Users</option>
                  <option>Admins Only</option>
                </select>
              </div>
            </div>
            <button type="submit" disabled={sending}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#FFE816] text-black font-pixel text-[10px] uppercase border-2 border-black shadow-[3px_3px_0px_#000] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-50">
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Send Broadcast
            </button>
          </form>
        </div>

        {/* History */}
        <div className="border-2 border-white/20 bg-[#161622] shadow-[4px_4px_0px_rgba(255,255,255,0.06)]">
          <div className="px-5 py-4 border-b-2 border-white/10 flex items-center gap-2">
            <Bell className="w-4 h-4 text-white/40" />
            <span className="font-pixel text-[10px] text-white uppercase tracking-wider">History</span>
            <span className="ml-auto font-pixel text-[9px] text-white/30">{notifications.length} sent</span>
          </div>
          <div className="divide-y divide-white/5 max-h-[480px] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-5 h-5 animate-spin text-[#FFE816]" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-10 text-center font-pixel text-[10px] text-white/20 uppercase">No notifications yet.</div>
            ) : notifications.map((n: any) => (
              <div key={n.id} className="p-4 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <p className="font-pixel text-[10px] text-white uppercase leading-tight">{n.subject}</p>
                  <PriorityBadge priority={n.priority} />
                </div>
                <p className="font-mono text-[10px] text-white/40 line-clamp-2 mb-1">{n.message}</p>
                <p className="font-mono text-[9px] text-white/20">{new Date(n.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
