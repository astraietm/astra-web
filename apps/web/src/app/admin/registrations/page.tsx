"use client";
import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { Search, Loader2, Users, Eye, X } from "lucide-react";
import { TicketPass } from "@/components/events/TicketPass";

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
  const [selectedReg, setSelectedReg] = useState<any | null>(null);
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
      (r.phone_number || r.user_phone || "").toLowerCase().includes(q) ||
      (r.college || r.user_college || "").toLowerCase().includes(q) ||
      (r.team_name || "").toLowerCase().includes(q) ||
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
            placeholder="Search name, email, phone, college..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 bg-[#161622] border-2 border-white/20 text-sm text-white font-mono placeholder:text-white/20 focus:outline-none focus:border-[#FFE816] w-72 transition-colors"
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
                  {["ID", "User / Contact", "College & Dept", "Event", "Status", "Team", "Payment", "Action"].map((h) => (
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
                      <div className="font-mono text-white font-bold">{reg.user_name || reg.user_email}</div>
                      <div className="font-mono text-white/40 text-[10px]">{reg.user_email}</div>
                      {(reg.phone_number || reg.user_phone) && (
                        <div className="font-mono text-[#FFE816] text-[10px] mt-0.5">📞 {reg.phone_number || reg.user_phone}</div>
                      )}
                    </td>
                    <td className="p-3 font-mono text-white/70 max-w-[180px] truncate">
                      <div>{reg.college || reg.user_college || "—"}</div>
                      {reg.department && <div className="text-white/40 text-[10px]">{reg.department} ({reg.year_of_study || ""})</div>}
                    </td>
                    <td className="p-3 text-white/80 max-w-[200px] truncate font-mono">
                      {reg.event_details?.title || `Event #${reg.event}`}
                    </td>
                    <td className="p-3"><StatusBadge status={reg.status} /></td>
                    <td className="p-3 font-mono text-white/60">
                      {reg.team_name ? (
                        <div>
                          <span className="font-bold text-white/80">{reg.team_name}</span>
                          {reg.team_members && <div className="text-[10px] text-white/30 truncate max-w-[140px]">{reg.team_members}</div>}
                        </div>
                      ) : "—"}
                    </td>
                    <td className="p-3 font-mono">
                      {reg.payment_details ? (
                        <span className={reg.payment_details.status === "SUCCESS" ? "text-[#C3FF16]" : "text-[#FFE816]"}>
                          {reg.payment_details.status} (₹{reg.payment_details.amount})
                        </span>
                      ) : (
                        <span className="text-white/30">Free</span>
                      )}
                    </td>
                    <td className="p-3 font-mono">
                      <button
                        onClick={() => setSelectedReg(reg)}
                        className="flex items-center gap-1 px-2 py-1 bg-white/10 hover:bg-[#FFE816] hover:text-black text-white font-mono text-[10px] uppercase border border-white/20 transition-colors"
                      >
                        <Eye className="w-3 h-3" /> Ticket Pass
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-12 text-center font-pixel text-[10px] text-white/20 uppercase">
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

      {/* Ticket Pass Modal */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-gray-900 border-2 border-white/20 p-6 my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <h3 className="font-pixel text-sm text-[#FFE816] uppercase">Registration Ticket Pass Details</h3>
              <button
                onClick={() => setSelectedReg(null)}
                className="p-1 text-white/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <TicketPass registration={selectedReg} showPrintButton={true} />
          </div>
        </div>
      )}
    </div>
  );
}
