"use client";
import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { Send, Loader2, Bell } from "lucide-react";

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState("NORMAL");
  const [recipients, setRecipients] = useState("All Registered Users");
  const [sending, setSending] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchNotifications = async () => {
      try { const res = await api.get("/api/ops/notifications/"); setNotifications(res.data); } catch {} finally { setLoading(false); }
    };
    fetchNotifications();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) { showToast("Subject and message are required.", "error"); return; }
    setSending(true);
    try {
      await api.post("/api/ops/notifications/", { subject, message, priority, recipients_criteria: recipients });
      showToast("Notification sent!", "success");
      setSubject(""); setMessage("");
      const res = await api.get("/api/ops/notifications/"); setNotifications(res.data);
    } catch { showToast("Failed to send.", "error"); }
    finally { setSending(false); }
  };

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-white mb-6">Notifications</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#111318] border border-white/5 rounded-xl p-5">
          <h2 className="text-sm font-medium text-white mb-4 flex items-center gap-2"><Send className="w-4 h-4" /> Send Notification</h2>
          <form onSubmit={handleSend} className="space-y-3">
            <input type="text" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} required
              className="w-full px-3 py-2 bg-[#090A0F] border border-white/10 rounded-lg text-sm text-white" />
            <textarea placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} required rows={4}
              className="w-full px-3 py-2 bg-[#090A0F] border border-white/10 rounded-lg text-sm text-white resize-none" />
            <div className="flex gap-3">
              <select value={priority} onChange={(e) => setPriority(e.target.value)}
                className="px-3 py-2 bg-[#090A0F] border border-white/10 rounded-lg text-sm text-white">
                <option value="NORMAL">Normal</option><option value="URGENT">Urgent</option><option value="SUCCESS">Success</option>
              </select>
              <select value={recipients} onChange={(e) => setRecipients(e.target.value)}
                className="flex-1 px-3 py-2 bg-[#090A0F] border border-white/10 rounded-lg text-sm text-white">
                <option>All Registered Users</option><option>Admins Only</option>
              </select>
            </div>
            <button type="submit" disabled={sending}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Send
            </button>
          </form>
        </div>
        <div className="bg-[#111318] border border-white/5 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-white/5"><h2 className="text-sm font-medium text-white">History</h2></div>
          <div className="divide-y divide-white/5 max-h-[500px] overflow-y-auto">
            {notifications.map((n: any) => (
              <div key={n.id} className="p-3 hover:bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <Bell className={`w-3.5 h-3.5 ${n.priority === 'URGENT' ? 'text-red-400' : 'text-gray-500'}`} />
                  <span className="text-sm text-white font-medium">{n.subject}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{n.message}</p>
                <p className="text-xs text-gray-600 mt-1">{new Date(n.created_at).toLocaleString()}</p>
              </div>
            ))}
            {notifications.length === 0 && <div className="p-8 text-center text-gray-500 text-sm">No notifications yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
