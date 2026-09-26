"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Image,
  Loader2,
  ArrowRight,
  Plus,
  QrCode,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import AddEventModal from "@/components/admin/AddEventModal";

interface Stats {
  totalEvents: number;
  totalRegistrations: number;
  totalGalleryItems: number;
}

const AdminCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`rounded-2xl border border-neutral-800/80 bg-neutral-900/50 backdrop-blur-xl shadow-sm ${className}`}
  >
    {children}
  </div>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">
    {children}
  </h2>
);

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string; border: string }> = {
    REGISTERED: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/20",
    },
    ATTENDED: {
      bg: "bg-blue-500/10",
      text: "text-blue-400",
      border: "border-blue-500/20",
    },
    CANCELLED: {
      bg: "bg-red-500/10",
      text: "text-red-400",
      border: "border-red-500/20",
    },
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

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalEvents: 0,
    totalRegistrations: 0,
    totalGalleryItems: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentRegistrations, setRecentRegistrations] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const isSuperUser = Boolean(user?.is_superuser);

  const fetchData = async () => {
    try {
      if (isSuperUser) {
        const [eventsRes, regsRes, galleryRes] = await Promise.all([
          api.get("/api/events/"),
          api.get("/api/admin-registrations/"),
          api.get("/api/gallery/"),
        ]);
        setStats({
          totalEvents: eventsRes.data.length,
          totalRegistrations: Array.isArray(regsRes.data)
            ? regsRes.data.length
            : regsRes.data?.results?.length || 0,
          totalGalleryItems: galleryRes.data.length,
        });
        const regs = Array.isArray(regsRes.data)
          ? regsRes.data
          : regsRes.data?.results || [];
        setRecentRegistrations(regs.slice(0, 8));
      } else {
        const [eventsRes, galleryRes] = await Promise.all([
          api.get("/api/events/"),
          api.get("/api/gallery/"),
        ]);
        setStats({
          totalEvents: eventsRes.data.length,
          totalRegistrations: 0,
          totalGalleryItems: galleryRes.data.length,
        });
      }
    } catch {
      /* silently fail */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isSuperUser]);

  const kpis = isSuperUser
    ? [
        {
          label: "Total Events",
          value: stats.totalEvents,
          icon: CalendarDays,
          href: "/admin/events",
          description: "Active symposium events",
        },
        {
          label: "Total Registrations",
          value: stats.totalRegistrations,
          icon: Users,
          href: "/admin/registrations",
          description: "Verified participant passes",
        },
        {
          label: "Gallery Media",
          value: stats.totalGalleryItems,
          icon: Image,
          href: "/admin/gallery",
          description: "Photos and highlight media",
        },
      ]
    : [
        {
          label: "Total Events",
          value: stats.totalEvents,
          icon: CalendarDays,
          href: "/admin/events",
          description: "Active symposium events",
        },
        {
          label: "Gallery Media",
          value: stats.totalGalleryItems,
          icon: Image,
          href: "/admin/gallery",
          description: "Photos and highlight media",
        },
        {
          label: "Ticket Scanner",
          value: "Active",
          icon: QrCode,
          href: "/admin/scanner",
          description: "Gate token validation",
        },
      ];

  return (
    <div className="space-y-8">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-neutral-800/80">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-white text-neutral-950 shadow-sm">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {isSuperUser ? "Admin Dashboard" : "Staff Portal"}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
              {isSuperUser
                ? "Overview of registrations, event management, and system activity."
                : "Operations console for scanners, media gallery, and event listings."}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-neutral-950 hover:bg-neutral-100 text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-sm hover:shadow active:scale-[0.99] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Event</span>
        </button>
      </div>

      <AddEventModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchData}
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
          <span className="text-xs text-neutral-400 uppercase tracking-widest font-medium">
            Loading dashboard data...
          </span>
        </div>
      ) : (
        <>
          {/* ── KPI Cards ── */}
          <div>
            <SectionTitle>Overview</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {kpis.map((kpi) => (
                <Link key={kpi.label} href={kpi.href}>
                  <AdminCard className="p-5 sm:p-6 group hover:border-neutral-700 transition-all hover:bg-neutral-900/70 cursor-pointer">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-neutral-800 border border-neutral-700/60 text-white">
                        <kpi.icon className="w-5 h-5 text-neutral-200" />
                      </div>
                      <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-1">
                      {kpi.value}
                    </p>
                    <p className="text-xs font-semibold text-neutral-300">
                      {kpi.label}
                    </p>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      {kpi.description}
                    </p>
                  </AdminCard>
                </Link>
              ))}
            </div>
          </div>

          {/* ── SuperUser: Recent Registrations / Staff: Quick Actions ── */}
          {isSuperUser ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <SectionTitle>Recent Registrations</SectionTitle>
                <Link
                  href="/admin/registrations"
                  className="text-xs font-medium text-neutral-400 hover:text-white transition-colors"
                >
                  View All Registrations →
                </Link>
              </div>

              <AdminCard className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-neutral-800 bg-neutral-950/40">
                        {["ID", "User", "Event", "Status", "Date"].map((h) => (
                          <th
                            key={h}
                            className="text-left p-3.5 text-xs font-medium text-neutral-400 uppercase tracking-wider"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60">
                      {recentRegistrations.map((reg: any) => (
                        <tr
                          key={reg.id}
                          className="hover:bg-neutral-800/30 transition-colors"
                        >
                          <td className="p-3.5 font-medium text-neutral-400">
                            #{reg.id}
                          </td>
                          <td className="p-3.5 font-medium text-white">
                            {reg.user_email ||
                              reg.user_name ||
                              `User #${reg.user}`}
                          </td>
                          <td className="p-3.5 text-neutral-300 max-w-[220px] truncate">
                            {reg.event_details?.title || `Event #${reg.event}`}
                          </td>
                          <td className="p-3.5">
                            <StatusBadge status={reg.status} />
                          </td>
                          <td className="p-3.5 text-neutral-400 font-medium">
                            {new Date(reg.timestamp).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                      {recentRegistrations.length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            className="p-10 text-center text-xs text-neutral-500"
                          >
                            No recent registrations recorded yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </AdminCard>
            </div>
          ) : (
            <div>
              <SectionTitle>Quick Actions</SectionTitle>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <Link href="/admin/events">
                  <AdminCard className="p-6 group hover:border-neutral-700 transition-all hover:bg-neutral-900/70">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-xl bg-neutral-800 border border-neutral-700/60 flex items-center justify-center text-white">
                        <CalendarDays className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-semibold text-white">
                        Events Manager
                      </h3>
                    </div>
                    <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
                      Create, update, or edit details for ASTRA fest events.
                    </p>
                    <span className="text-xs font-medium text-neutral-200 group-hover:text-white group-hover:underline flex items-center gap-1">
                      Manage Events →
                    </span>
                  </AdminCard>
                </Link>

                <Link href="/admin/gallery">
                  <AdminCard className="p-6 group hover:border-neutral-700 transition-all hover:bg-neutral-900/70">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-xl bg-neutral-800 border border-neutral-700/60 flex items-center justify-center text-white">
                        <Image className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-semibold text-white">
                        Media Gallery
                      </h3>
                    </div>
                    <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
                      Upload event photos, highlight banners, and media assets.
                    </p>
                    <span className="text-xs font-medium text-neutral-200 group-hover:text-white group-hover:underline flex items-center gap-1">
                      Manage Gallery →
                    </span>
                  </AdminCard>
                </Link>

                <Link href="/admin/scanner">
                  <AdminCard className="p-6 group hover:border-neutral-700 transition-all hover:bg-neutral-900/70">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-xl bg-neutral-800 border border-neutral-700/60 flex items-center justify-center text-white">
                        <QrCode className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-semibold text-white">
                        QR Gate Scanner
                      </h3>
                    </div>
                    <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
                      Verify ticket tokens and grant attendee entry at event gates.
                    </p>
                    <span className="text-xs font-medium text-neutral-200 group-hover:text-white group-hover:underline flex items-center gap-1">
                      Open Scanner →
                    </span>
                  </AdminCard>
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
