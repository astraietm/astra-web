"use client";
import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { Search, Loader2, Users } from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    REGISTERED: "bg-[#C3FF16] text-black border-black",
    ATTENDED:   "bg-[#97F8B7] text-black border-black",
    CANCELLED:  "bg-red-400 text-black border-black",
  };
  return (
    <span className={`font-pixel text-[8px] uppercase px-1.5 py-0.5 border ${map[status] ?? "bg-white/10 text-white border-white/20"}`}>
      {status}
    </span>
  );
}

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
    return !q || (r.user_email || "").toLowerCase().includes(q) ||
      (r.user_name || "").toLowerCase().includes(q) ||
      (r.event_details?.title || "").toLowerCase().includes(q);
  });

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 bg-[#C3FF16] border-2 border-black">
            <Users className="w-4 h-4 text-black" />
          </div>
          <div>
            <h1 className="font-pixel text-xl font-bold text-white uppercase">Registrations</h1>
            <p className="font-mono text-[10px] text-white/30 uppercase">{registrations.length} total records</p>
          </div>
        </div>
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
          <input
            type="text"
            placeholder="Search users, events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 bg-[#161622] border-2 border-white/20 text-sm text-white font-mono placeholder:text-white/20 focus:outline-none focus:border-[#FFE816] w-60 transition-colors"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#FFE816]" />
          <span className="font-pixel text-[10px] text-white/30 uppercase animate-pulse">Loading...</span>
        </div>
      ) : (
        <div className="border-2 border-white/20 bg-[#161622]">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b-2 border-white/15 bg-white/[0.03]">
                  {["ID", "User", "Event", "Status", "Team", "Payment", "Date"].map((h) => (
                    <th key={h} className="text-left p-3 font-pixel text-[9px] text-white/40 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((reg: any, i) => (
                  <tr
                    key={reg.id}
                    className={`border-b border-white/5 hover:bg-white/[0.04] transition-colors ${i % 2 === 0 ? "" : "bg-white/[0.015]"}`}
                  >
                    <td className="p-3 font-mono text-white/30">#{reg.id}</td>
                    <td className="p-3">
                      <div className="font-mono text-white">{reg.user_name || reg.user_email}</div>
                      <div className="font-mono text-white/30 text-[10px]">{reg.user_email}</div>
                    </td>
                    <td className="p-3 text-white/60 max-w-[200px] truncate font-mono">
                      {reg.event_details?.title || `Event #${reg.event}`}
                    </td>
                    <td className="p-3"><StatusBadge status={reg.status} /></td>
                    <td className="p-3 font-mono text-white/40">{reg.team_name || "—"}</td>
                    <td className="p-3 font-mono">
                      {reg.payment_details ? (
                        <span className={reg.payment_details.status === "SUCCESS" ? "text-[#C3FF16]" : "text-[#FFE816]"}>
                          {reg.payment_details.status} (₹{reg.payment_details.amount})
                        </span>
                      ) : (
                        <span className="text-white/30">Free</span>
                      )}
                    </td>
                    <td className="p-3 font-mono text-white/30 whitespace-nowrap">
                      {new Date(reg.timestamp).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-12 text-center font-pixel text-[10px] text-white/20 uppercase">
                      No registrations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t-2 border-white/10 flex items-center justify-between">
            <span className="font-pixel text-[9px] text-white/30 uppercase">
              {filtered.length} / {registrations.length} records
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
