"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Image,
  QrCode,
  Bell,
  FileText,
  Settings,
  ChevronLeft,
  Menu,
  LogOut,
  Shield,
  X,
  ArrowUpRight,
  Loader2,
} from "lucide-react";

const SIDEBAR_LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/events", label: "Events", icon: CalendarDays },
  { href: "/admin/gallery", label: "Gallery", icon: Image },
  { href: "/admin/scanner", label: "Scanner", icon: QrCode },
  { href: "/admin/registrations", label: "Registrations", icon: Users, superuserOnly: true },
  { href: "/admin/notifications", label: "Notifications", icon: Bell, superuserOnly: true },
  { href: "/admin/logs", label: "Audit Logs", icon: FileText, superuserOnly: true },
  { href: "/admin/settings", label: "Settings", icon: Settings, superuserOnly: true },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const hasAdminAccess = Boolean(user && (user.is_staff || user.is_superuser));
  const isSuperuserRoute = ["/admin/registrations", "/admin/notifications", "/admin/logs", "/admin/settings"].some(
    (r) => pathname === r || pathname?.startsWith(r + "/")
  );

  useEffect(() => {
    if (!loading) {
      if (!hasAdminAccess) {
        router.push("/");
      } else if (isSuperuserRoute && !user?.is_superuser) {
        router.push("/admin");
      }
    }
  }, [hasAdminAccess, isSuperuserRoute, loading, router, user]);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
          <span className="text-xs text-neutral-400 uppercase tracking-widest font-medium">
            Loading Admin Console...
          </span>
        </div>
      </div>
    );
  }

  if (!hasAdminAccess || (isSuperuserRoute && !user?.is_superuser)) return null;

  const visibleLinks = SIDEBAR_LINKS.filter((link) => !link.superuserOnly || user?.is_superuser);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans antialiased selection:bg-white selection:text-neutral-900">
      {/* ─── HEADER ─── */}
      <header className="h-16 sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-xl">
        {/* Left */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            id="admin-mobile-menu-btn"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl border border-neutral-800 text-neutral-300 hover:border-neutral-600 hover:text-white transition-colors"
          >
            <Menu className="w-4 h-4" />
          </button>

          <Link href="/admin" className="flex items-center gap-2.5 group">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white text-neutral-950 shadow-sm transition-transform group-hover:scale-105">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-white tracking-tight block leading-tight">
                ASTRA Admin
              </span>
              <span className="text-[10px] text-neutral-400 font-medium block leading-none">
                Management Portal
              </span>
            </div>
          </Link>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[10px] font-medium text-emerald-400 tracking-wide uppercase">
              System Online
            </span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2.5">
          {user?.avatar && (
            <img
              src={user.avatar}
              alt=""
              className="w-7 h-7 rounded-full object-cover ring-1 ring-neutral-700 hidden sm:block"
            />
          )}
          <div className="hidden md:flex flex-col text-right mr-1">
            <span className="text-xs font-semibold text-white leading-tight">
              {user?.name?.split(" ")[0]}
            </span>
            <span className="text-[10px] text-neutral-400 leading-none">
              {user?.is_superuser ? "Super Admin" : "Staff Admin"}
            </span>
          </div>

          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-neutral-300 hover:text-white px-3 py-1.5 rounded-full border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900 transition-all shadow-sm"
          >
            <span>Live Site</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
          </Link>

          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-red-400 hover:text-red-300 px-3 py-1.5 rounded-full border border-red-500/20 hover:border-red-500/40 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex min-w-0 relative">
        {/* Mobile Overlay */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* ─── SIDEBAR ─── */}
        <aside
          className={`
            fixed lg:sticky top-16 h-[calc(100vh-4rem)] z-40
            bg-neutral-950/90 backdrop-blur-xl border-r border-neutral-800/80
            flex flex-col transition-all duration-200 ease-in-out
            ${isCollapsed ? "w-18" : "w-60"}
            ${isMobileOpen ? "left-0" : "-left-64 lg:left-0"}
          `}
        >
          {/* Collapse toggle */}
          <div className="flex items-center justify-between p-3.5 border-b border-neutral-800/60">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg border border-neutral-800 text-neutral-400 hover:border-neutral-600 hover:text-white transition-colors cursor-pointer"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronLeft className={`w-3.5 h-3.5 transition-transform duration-200 ${isCollapsed ? "rotate-180" : ""}`} />
            </button>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden flex items-center justify-center w-7 h-7 rounded-lg border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            {!isCollapsed && (
              <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
                Navigation
              </span>
            )}
          </div>

          {/* Nav links */}
          <nav className="flex-1 py-3 overflow-y-auto space-y-1 px-3">
            {visibleLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/admin" && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    group flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium
                    transition-all duration-150 relative
                    ${isActive
                      ? "bg-white text-neutral-950 shadow-sm font-semibold"
                      : "text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900"
                    }
                  `}
                >
                  <link.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-neutral-950" : "text-neutral-400 group-hover:text-neutral-200"}`} />
                  {!isCollapsed && (
                    <span className="flex-1 truncate">{link.label}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User footer */}
          {!isCollapsed && (
            <div className="p-3 border-t border-neutral-800/60">
              <div className="flex items-center gap-3 rounded-xl bg-neutral-900/60 border border-neutral-800/60 p-2.5">
                {user?.avatar ? (
                  <img src={user.avatar} alt="" className="w-8 h-8 rounded-full object-cover ring-1 ring-neutral-700 flex-shrink-0" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center flex-shrink-0 text-neutral-300">
                    <Shield className="w-4 h-4" />
                  </div>
                )}
                <div className="overflow-hidden min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
                  <p className="text-[10px] text-neutral-400 truncate">
                    {user?.is_superuser ? "Super Admin" : "Staff Member"}
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
