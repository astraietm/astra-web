"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { LayoutDashboard, Users, CalendarDays, Image, Loader2, ArrowRight } from "lucide-react";

interface Stats {
  totalEvents: number;
  totalRegistrations: number;
  totalGalleryItems: number;
}

// ── Shared brutalist primitives ───────────────────────────────────────────────
const AdminCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`border-2 border-white/20 bg-[#161622] shadow-[4px_4px_0px_rgba(255,255,255,0.06)] ${className}`}>
    {children}
  </div>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="font-pixel text-[10px] uppercase tracking-widest text-white/40 mb-3">{children}</h2>
);

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    REGISTERED: "bg-[#C3FF16] text-black border-black",
    ATTENDED:   "bg-[#97F8B7] text-black border-black",
    CANCELLED:  "bg-red-400 text-black border-black",
  };
  return (
    <span className={`font-pixel text-[8px] uppercase px-1.5 py-0.5 border shadow-[1px_1px_0px_#000] ${map[status] ?? "bg-white/10 text-white border-white/20"}`}>
      {status}
    </span>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ totalEvents: 0, totalRegistrations: 0, totalGalleryItems: 0 });
  const [loading, setLoading] = useState(true);
  const [recentRegistrations, setRecentRegistrations] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, regsRes, galleryRes] = await Promise.all([
          api.get("/api/events/"),
          api.get("/api/admin-registrations/"),
          api.get("/api/gallery/"),
        ]);
        setStats({
          totalEvents: eventsRes.data.length,
          totalRegistrations: Array.isArray(regsRes.data) ? regsRes.data.length : regsRes.data?.results?.length || 0,
          totalGalleryItems: galleryRes.data.length,
        });
        const regs = Array.isArray(regsRes.data) ? regsRes.data : regsRes.data?.results || [];
        setRecentRegistrations(regs.slice(0, 8));
      } catch { /* silently fail */ }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const kpis = [
    { label: "Total Events",   value: stats.totalEvents,        icon: CalendarDays, accent: "#FFE816", href: "/admin/events" },
    { label: "Registrations",  value: stats.totalRegistrations, icon: Users,        accent: "#C3FF16", href: "/admin/registrations" },
    { label: "Gallery Items",  value: stats.totalGalleryItems,  icon: Image,        accent: "#F79CFF", href: "/admin/gallery" },
  ];

  return (
    <div>
      {/* ── Page header ── */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center justify-center w-9 h-9 bg-[#FFE816] border-2 border-black shadow-[3px_3px_0px_#000]">
          <LayoutDashboard className="w-4 h-4 text-black" />
        </div>
        <div>
          <h1 className="font-pixel text-xl font-bold text-white uppercase tracking-wide">Dashboard</h1>
          <p className="font-editorial italic text-xs text-white/40">ASTRA 2026 Control Center</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#FFE816]" />
          <span className="font-pixel text-[10px] text-white/30 uppercase animate-pulse">Loading data...</span>
        </div>
      ) : (
        <>
          {/* ── KPI Cards ── */}
          <SectionTitle>// System Overview</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {kpis.map((kpi) => (
              <Link key={kpi.label} href={kpi.href}>
                <AdminCard className="p-5 group hover:shadow-[6px_6px_0px_rgba(255,255,255,0.1)] transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="flex items-center justify-center w-9 h-9 border-2 border-black shadow-[2px_2px_0px_#000]"
                      style={{ backgroundColor: kpi.accent }}
                    >
                      <kpi.icon className="w-4 h-4 text-black" />
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="font-pixel text-4xl font-bold text-white mb-1">{kpi.value}</p>
                  <p className="font-mono text-[10px] text-white/40 uppercase tracking-wider">{kpi.label}</p>
                </AdminCard>
              </Link>
            ))}
          </div>

          {/* ── Recent Registrations ── */}
          <SectionTitle>// Recent Registrations</SectionTitle>
          <AdminCard>
            <div className="border-b-2 border-white/10 px-4 py-3 flex items-center justify-between">
              <span className="font-pixel text-[10px] text-white uppercase tracking-wider">Latest Activity</span>
              <Link href="/admin/registrations" className="font-mono text-[10px] text-[#FFE816] uppercase hover:underline">
                View All →
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b-2 border-white/10 bg-white/[0.02]">
                    {["#", "User", "Event", "Status", "Date"].map((h) => (
                      <th key={h} className="text-left p-3 font-pixel text-[9px] text-white/40 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentRegistrations.map((reg: any, i) => (
                    <tr key={reg.id} className={`border-b border-white/5 hover:bg-white/[0.03] transition-colors ${i % 2 === 0 ? "" : "bg-white/[0.015]"}`}>
                      <td className="p-3 font-mono text-white/30">#{reg.id}</td>
                      <td className="p-3 font-mono text-white">{reg.user_email || reg.user_name || `User #${reg.user}`}</td>
                      <td className="p-3 text-white/60 max-w-[180px] truncate">{reg.event_details?.title || `Event #${reg.event}`}</td>
                      <td className="p-3"><StatusBadge status={reg.status} /></td>
                      <td className="p-3 font-mono text-white/30">{new Date(reg.timestamp).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {recentRegistrations.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-10 text-center font-pixel text-[10px] text-white/20 uppercase">
                        No registrations yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </AdminCard>
        </>
      )}
    </div>
  );
}
