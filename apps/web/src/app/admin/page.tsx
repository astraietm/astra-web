"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { LayoutDashboard, Users, CalendarDays, Image, Loader2 } from "lucide-react";

interface Stats {
  totalEvents: number;
  totalRegistrations: number;
  totalGalleryItems: number;
  totalUsers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ totalEvents: 0, totalRegistrations: 0, totalGalleryItems: 0, totalUsers: 0 });
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
          totalUsers: 0,
        });
        const regs = Array.isArray(regsRes.data) ? regsRes.data : regsRes.data?.results || [];
        setRecentRegistrations(regs.slice(0, 10));
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const kpis = [
    { label: "Total Events", value: stats.totalEvents, icon: CalendarDays, color: "text-blue-400" },
    { label: "Registrations", value: stats.totalRegistrations, icon: Users, color: "text-emerald-400" },
    { label: "Gallery Items", value: stats.totalGalleryItems, icon: Image, color: "text-purple-400" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-white mb-6">Dashboard</h1>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="bg-[#111318] border border-white/5 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                  <span className="text-sm text-gray-400">{kpi.label}</span>
                </div>
                <p className="text-3xl font-display font-bold text-white">{kpi.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#111318] border border-white/5 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-white/5">
              <h2 className="text-sm font-display font-bold text-white">Recent Registrations</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-gray-400">
                    <th className="text-left p-3 font-medium">User</th>
                    <th className="text-left p-3 font-medium">Event</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRegistrations.map((reg: any) => (
                    <tr key={reg.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="p-3 text-white">{reg.user_email || reg.user_name || `User #${reg.user}`}</td>
                      <td className="p-3 text-gray-300">{reg.event_details?.title || `Event #${reg.event}`}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                          reg.status === 'REGISTERED' ? 'bg-emerald-500/10 text-emerald-400' :
                          reg.status === 'ATTENDED' ? 'bg-blue-500/10 text-blue-400' :
                          'bg-yellow-500/10 text-yellow-400'
                        }`}>{reg.status}</span>
                      </td>
                      <td className="p-3 text-gray-500">{new Date(reg.timestamp).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {recentRegistrations.length === 0 && (
                    <tr><td colSpan={4} className="p-8 text-center text-gray-500">No registrations yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
