"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import {
  LayoutDashboard, Users, CalendarDays, Image, QrCode, Bell, FileText, Settings,
  ChevronLeft, Menu, Search, LogOut, Shield, X
} from "lucide-react";

const SIDEBAR_LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/registrations", label: "Registrations", icon: Users },
  { href: "/admin/events", label: "Events", icon: CalendarDays },
  { href: "/admin/gallery", label: "Gallery", icon: Image },
  { href: "/admin/scanner", label: "Scanner", icon: QrCode },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
  { href: "/admin/logs", label: "Audit Logs", icon: FileText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !user.is_staff)) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  if (loading) return null;
  if (!user || !user.is_staff) return null;

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 flex flex-col font-sans antialiased">
      {/* Admin Header */}
      <header className="h-14 bg-[#0d0e14] border-b border-white/5 flex items-center justify-between px-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="lg:hidden p-2 text-gray-400 hover:text-white">
            <Menu className="w-5 h-5" />
          </button>
          <Link href="/admin" className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-500" />
            <span className="font-display font-bold text-sm">ASTRA ADMIN</span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xs text-gray-400 hover:text-white font-mono">
            ← Back to Site
          </Link>
          <button onClick={logout} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-400">
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </header>

      <div className="flex-1 flex min-w-0 relative">
        {/* Mobile Overlay */}
        {isMobileOpen && (
          <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setIsMobileOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-14 h-[calc(100vh-3.5rem)] z-40
          bg-[#0d0e14] border-r border-white/5
          flex flex-col transition-all duration-300
          ${isCollapsed ? 'w-20' : 'w-60'}
          ${isMobileOpen ? 'left-0' : '-left-60 lg:left-0'}
        `}>
          <div className="flex items-center justify-between p-3 border-b border-white/5">
            <button onClick={() => setIsCollapsed(!isCollapsed)} className="hidden lg:block p-1.5 text-gray-400 hover:text-white">
              <ChevronLeft className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
            </button>
            <button onClick={() => setIsMobileOpen(false)} className="lg:hidden p-1.5 text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <nav className="flex-1 py-2 overflow-y-auto">
            {SIDEBAR_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/admin' && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-blue-600/10 text-blue-400 font-medium'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <link.icon className="w-4.5 h-4.5 flex-shrink-0" />
                  {!isCollapsed && <span>{link.label}</span>}
                </Link>
              );
            })}
          </nav>

          {!isCollapsed && (
            <div className="p-4 border-t border-white/5">
              <div className="flex items-center gap-2">
                {user.avatar && <img src={user.avatar} alt="" className="w-7 h-7 rounded-full" />}
                <div className="text-xs overflow-hidden">
                  <p className="font-medium text-white truncate">{user.name}</p>
                  <p className="text-gray-500 truncate">{user.role}</p>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
