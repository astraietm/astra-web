"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { Search, Loader2, Users, Eye, X, Phone, Mail, Building, Ticket } from "lucide-react";
import { TicketPass } from "@/components/events/TicketPass";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; border: string }> = {
    REGISTERED: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
    ATTENDED: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
    CANCELLED: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" },
  };
  const current = map[status] ?? {
    bg: "bg-neutral-800",
    text: "text-neutral-300",
    border: "border-neutral-700",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${current.bg} ${current.text} ${current.border}`}
    >
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
    } catch {
      showToast("Failed to load registrations.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const filtered = registrations.filter((r: any) => {
    const q = search.toLowerCase();
    return (
      !q ||
      (r.user_email || "").toLowerCase().includes(q) ||
      (r.user_name || "").toLowerCase().includes(q) ||
      (r.phone_number || r.user_phone || "").toLowerCase().includes(q) ||
      (r.college || r.user_college || "").toLowerCase().includes(q) ||
      (r.team_name || "").toLowerCase().includes(q) ||
      (r.event_details?.title || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-neutral-800/80">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-white text-neutral-950 shadow-sm">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Registrations
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
              {registrations.length} registered participant records
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search attendee, email, college..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-950/80 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-neutral-600 transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
          <span className="text-xs text-neutral-400 uppercase tracking-widest font-medium">
            Loading registrations...
          </span>
        </div>
      ) : (
        <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/50 backdrop-blur-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950/40">
                  {["ID", "User / Contact", "College & Dept", "Event", "Status", "Team", "Payment", "Action"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left p-3.5 text-xs font-medium text-neutral-400 uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {filtered.map((reg: any) => (
                  <tr key={reg.id} className="hover:bg-neutral-800/30 transition-colors">
                    <td className="p-3.5 font-medium text-neutral-500">#{reg.id}</td>
                    <td className="p-3.5">
                      <div className="font-semibold text-white">{reg.user_name || reg.user_email}</div>
                      <div className="text-[11px] text-neutral-400">{reg.user_email}</div>
                      {(reg.phone_number || reg.user_phone) && (
                        <div className="text-[11px] text-neutral-500 mt-0.5">
                          📞 {reg.phone_number || reg.user_phone}
                        </div>
                      )}
                    </td>
                    <td className="p-3.5 max-w-[200px]">
                      <div className="text-neutral-300 truncate">{reg.college || reg.user_college || "—"}</div>
                      {(reg.department || reg.user_dept) && (
                        <div className="text-[11px] text-neutral-500">
                          {reg.department || reg.user_dept} • {reg.semester || reg.user_sem || ""}
                        </div>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className="font-medium text-white block max-w-[180px] truncate">
                        {reg.event_details?.title || `Event #${reg.event}`}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <StatusBadge status={reg.status} />
                    </td>
                    <td className="p-3.5 text-neutral-400">
                      {reg.team_name ? (
                        <span className="text-purple-300 font-medium">{reg.team_name}</span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="p-3.5">
                      {reg.payment_verified ? (
                        <span className="text-emerald-400 font-medium">Verified</span>
                      ) : reg.event_details?.requires_payment ? (
                        <span className="text-amber-400">Pending</span>
                      ) : (
                        <span className="text-neutral-500">Free</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <button
                        onClick={() => setSelectedReg(reg)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium transition-colors cursor-pointer"
                        title="View Pass"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Pass</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-xs text-neutral-500">
                      No registrations found matching your query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Ticket Pass Viewer Modal */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative max-w-sm w-full">
            <button
              onClick={() => setSelectedReg(null)}
              className="absolute -top-10 right-0 p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <TicketPass registration={selectedReg} />
          </div>
        </div>
      )}
    </div>
  );
}
