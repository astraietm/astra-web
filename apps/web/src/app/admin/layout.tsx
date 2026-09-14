"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  LayoutDashboard, Users, CalendarDays, Image, QrCode, Bell,
  FileText, Settings, ChevronLeft, Menu, LogOut, Shield, X, Terminal,
} from "lucide-react";

const SIDEBAR_LINKS = [
  { href: "/admin",                  label: "Dashboard",      icon: LayoutDashboard, badge: "01" },
  { href: "/admin/registrations",    label: "Registrations",  icon: Users,           badge: "02" },
  { href: "/admin/events",           label: "Events",         icon: CalendarDays,    badge: "03" },
  { href: "/admin/gallery",          label: "Gallery",        icon: Image,           badge: "04" },
  { href: "/admin/scanner",          label: "Scanner",        icon: QrCode,          badge: "05" },
  { href: "/admin/notifications",    label: "Notifications",  icon: Bell,            badge: "06" },
  { href: "/admin/logs",             label: "Audit Logs",     icon: FileText,        badge: "07" },
  { href: "/admin/settings",         label: "Settings",       icon: Settings,        badge: "08" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const hasAdminAccess = Boolean(user && (user.is_staff || user.is_superuser));

  useEffect(() => {
    if (!loading && !hasAdminAccess) router.push("/");
  }, [hasAdminAccess, loading, router]);

  useEffect(() => { setIsMobileOpen(false); }, [pathname]);

  if (loading) return (
    <div className="min-h-screen bg-[#0C0C14] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <span className="font-pixel text-xs text-[#FFE816] animate-pulse uppercase tracking-widest">
          [ LOADING ASTRA ADMIN ]
        </span>
        <div className="w-48 h-1 bg-white/10 overflow-hidden">
          <div className="h-full bg-[#FFE816] animate-[marquee_1.2s_linear_infinite] w-1/3" />
        </div>
      </div>
    </div>
  );
  if (!hasAdminAccess) return null;

  return (
    <div
      className="min-h-screen text-white flex flex-col font-sans antialiased"
      style={{
        backgroundColor: "#0C0C14",
        backgroundImage:
          "linear-gradient(to right, rgba(80,80,120,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(80,80,120,0.15) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      {/* ─── HEADER ─── */}
      <header className="h-14 sticky top-0 z-50 flex items-center justify-between px-4 border-b-2 border-white/20 bg-[#0C0C14]/95 backdrop-blur-md">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            id="admin-mobile-menu-btn"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden flex items-center justify-center w-8 h-8 border-2 border-white/30 text-white hover:border-[#FFE816] hover:text-[#FFE816] transition-colors"
          >
            <Menu className="w-4 h-4" />
          </button>
          <Link href="/admin" className="flex items-center gap-2 group">
            <div className="flex items-center justify-center w-7 h-7 bg-[#FFE816] border-2 border-black">
              <Shield className="w-3.5 h-3.5 text-black" />
            </div>
            <span className="font-pixel text-[11px] font-bold text-white uppercase tracking-wider group-hover:text-[#FFE816] transition-colors">
              ASTRA ADMIN
            </span>
          </Link>
          <div className="hidden sm:flex items-center gap-1 bg-[#C3FF16]/10 border border-[#C3FF16]/30 px-2 py-0.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C3FF16] opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#C3FF16]" />
            </span>
            <span className="font-mono text-[9px] text-[#C3FF16] uppercase tracking-wider">ONLINE</span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {user?.avatar && (
            <img src={user.avatar} alt="" className="w-6 h-6 rounded-full border-2 border-white/30 hidden sm:block" />
          )}
          <span className="hidden sm:block font-mono text-[10px] text-white/60 uppercase">{user?.name?.split(" ")[0]}</span>
          <Link
            href="/"
            className="hidden sm:flex items-center gap-1 font-mono text-[10px] text-white/50 border border-white/20 px-2.5 py-1 hover:border-white/60 hover:text-white transition-colors uppercase"
          >
            ← SITE
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 font-mono text-[10px] text-red-400 border border-red-500/30 px-2.5 py-1 hover:bg-red-500/10 hover:border-red-400 transition-colors uppercase"
          >
            <LogOut className="w-3 h-3" />
            <span className="hidden sm:inline">LOGOUT</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex min-w-0 relative">
        {/* Mobile Overlay — starts below the sticky header */}
        {isMobileOpen && (
          <div
            className="fixed top-14 inset-x-0 bottom-0 bg-black/70 z-30 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* ─── SIDEBAR ─── */}
        <aside
          className={`
            fixed lg:sticky top-14 h-[calc(100vh-3.5rem)] z-40
            bg-[#0C0C14] border-r-2 border-white/15
            flex flex-col transition-all duration-300 ease-in-out
            ${isCollapsed ? "w-16" : "w-56"}
            ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(80,80,120,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(80,80,120,0.12) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        >
          {/* Collapse toggle */}
          <div className="flex items-center justify-between p-3 border-b-2 border-white/10">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex items-center justify-center w-7 h-7 border-2 border-white/20 text-white/50 hover:border-[#FFE816] hover:text-[#FFE816] transition-colors"
            >
              <ChevronLeft className={`w-3.5 h-3.5 transition-transform ${isCollapsed ? "rotate-180" : ""}`} />
            </button>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden flex items-center justify-center w-7 h-7 border-2 border-white/20 text-white/50 hover:border-white hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            {!isCollapsed && (
              <span className="font-pixel text-[9px] text-white/30 uppercase tracking-wider">INDEX</span>
            )}
          </div>

          {/* Nav links */}
          <nav className="flex-1 py-3 overflow-y-auto space-y-0.5 px-2">
            {SIDEBAR_LINKS.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/admin" && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    group flex items-center gap-3 px-3 py-2.5 text-xs font-mono uppercase tracking-wide
                    border-2 transition-all duration-100 relative
                    ${isActive
                      ? "border-[#FFE816] bg-[#FFE816] text-black"
                      : "border-transparent text-white/50 hover:border-white/30 hover:text-white hover:bg-white/5"
                    }
                  `}
                >
                  <link.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-black" : ""}`} />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 truncate">{link.label}</span>
                      <span className={`font-pixel text-[9px] ${isActive ? "text-black/60" : "text-white/20"}`}>
                        {link.badge}
                      </span>
                    </>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User footer */}
          {!isCollapsed && (
            <div className="p-3 border-t-2 border-white/10">
              <div className="flex items-center gap-2 border-2 border-white/10 p-2">
                {user?.avatar ? (
                  <img src={user.avatar} alt="" className="w-6 h-6 border border-white/30 flex-shrink-0" />
                ) : (
                  <div className="w-6 h-6 bg-[#F79CFF] border border-black flex items-center justify-center flex-shrink-0">
                    <Shield className="w-3 h-3 text-black" />
                  </div>
                )}
                <div className="overflow-hidden">
                  <p className="font-pixel text-[9px] text-white uppercase truncate">{user?.name}</p>
                  <p className="font-mono text-[8px] text-white/40 uppercase truncate">
                    {user?.is_superuser ? "SUPERUSER" : "STAFF"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* ─── MAIN CONTENT ─── */}
        <main className="flex-1 flex flex-col min-w-0 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
