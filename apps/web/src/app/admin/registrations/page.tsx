"use client";
import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { Search, Download, Loader2, Trash2, CheckCircle2, Eye } from "lucide-react";

export default function AdminRegistrations() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { showToast } = useToast();

  const fetchRegistrations = async () => {
    try {
      const res = await api.get("/api/admin-registrations/");
      setRegistrations(Array.isArray(res.data) ? res.data : res.data?.results || []);
    } catch { showToast("Failed to load registrations.", "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRegistrations(); }, []);

  const filtered = registrations.filter((r: any) => {
    const q = search.toLowerCase();
    return !q || (r.user_email || "").toLowerCase().includes(q) || (r.user_name || "").toLowerCase().includes(q) || (r.event_details?.title || "").toLowerCase().includes(q);
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-display font-bold text-white">Registrations</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" placeholder="Search registrations..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 bg-[#111318] border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 w-64" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gray-500" /></div>
      ) : (
        <div className="bg-[#111318] border border-white/5 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-white/5 text-gray-400">
                <th className="text-left p-3 font-medium">ID</th>
                <th className="text-left p-3 font-medium">User</th>
                <th className="text-left p-3 font-medium">Event</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Team</th>
                <th className="text-left p-3 font-medium">Payment</th>
                <th className="text-left p-3 font-medium">Date</th>
              </tr></thead>
              <tbody>
                {filtered.map((reg: any) => (
                  <tr key={reg.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="p-3 text-gray-400 font-mono text-xs">#{reg.id}</td>
                    <td className="p-3"><div className="text-white text-xs">{reg.user_name || reg.user_email}</div><div className="text-gray-500 text-xs">{reg.user_email}</div></td>
                    <td className="p-3 text-gray-300 text-xs">{reg.event_details?.title || `Event #${reg.event}`}</td>
                    <td className="p-3"><span className={`px-2 py-0.5 text-xs rounded-full font-medium ${reg.status === 'REGISTERED' ? 'bg-emerald-500/10 text-emerald-400' : reg.status === 'ATTENDED' ? 'bg-blue-500/10 text-blue-400' : 'bg-yellow-500/10 text-yellow-400'}`}>{reg.status}</span></td>
                    <td className="p-3 text-gray-400 text-xs">{reg.team_name || "—"}</td>
                    <td className="p-3 text-xs">{reg.payment_details ? <span className={reg.payment_details.status === 'SUCCESS' ? 'text-emerald-400' : 'text-yellow-400'}>{reg.payment_details.status} (₹{reg.payment_details.amount})</span> : <span className="text-gray-500">Free</span>}</td>
                    <td className="p-3 text-gray-500 text-xs">{new Date(reg.timestamp).toLocaleDateString()}</td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-gray-500">No registrations found.</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="p-3 border-t border-white/5 text-xs text-gray-500">
            {filtered.length} of {registrations.length} registrations
          </div>
        </div>
      )}
    </div>
  );
}
