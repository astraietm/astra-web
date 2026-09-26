"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  Sparkles,
  Calendar,
  MapPin,
  ArrowUpRight,
  Mail,
  Phone,
  Ticket,
  ExternalLink,
  Heart,
} from "lucide-react";

export const Footer: React.FC = () => {
  const pathname = usePathname();

  // Do not render public footer on admin portal routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="relative bg-neutral-950 text-white font-sans overflow-hidden border-t border-neutral-800/80">
      {/* Subtle Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-amber-400/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-16 pb-12">
        {/* Top Grid: Brand Showcase + Link Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-neutral-800/80">
          {/* Brand & Mission Column (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white text-neutral-950 flex items-center justify-center shadow-sm">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                ASTRA 2026
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20 text-[11px] font-semibold">
                National Symposium
              </span>
            </div>

            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-sm">
              The premier national cyber security symposium and 24H ethical hacking CTF WarGames hosted by the Department of Cyber Security at KMCT IETM, Calicut.
            </p>

            {/* Quick Metrics Pills */}
            <div className="flex flex-wrap gap-2.5 pt-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs text-neutral-300">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>October 06 &amp; 07, 2026</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs text-neutral-300">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>KMCT Calicut, Kerala</span>
              </div>
            </div>
          </div>

          {/* Navigation Columns (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Column 1: Explore Events */}
            <div className="space-y-3.5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
                Explore Events
              </h3>
              <ul className="space-y-2.5 text-xs text-neutral-400">
                <li>
                  <Link
                    href="/events"
                    className="hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span>All Events Directory</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/events"
                    className="hover:text-white transition-colors"
                  >
                    Flagship CTF WarGames
                  </Link>
                </li>
                <li>
                  <Link
                    href="/events"
                    className="hover:text-white transition-colors"
                  >
                    Keynotes &amp; Panels
                  </Link>
                </li>
                <li>
                  <Link
                    href="/events"
                    className="hover:text-white transition-colors"
                  >
                    Technical Workshops
                  </Link>
                </li>
                <li>
                  <Link
                    href="/gallery"
                    className="hover:text-white transition-colors"
                  >
                    Symposium Gallery
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Attendee Hub */}
            <div className="space-y-3.5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
                Attendee Hub
              </h3>
              <ul className="space-y-2.5 text-xs text-neutral-400">
                <li>
                  <Link
                    href="/dashboard"
                    className="hover:text-white transition-colors flex items-center gap-1"
                  >
                    <Ticket className="w-3.5 h-3.5 text-amber-400" />
                    <span>My Entry Passes</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/profile"
                    className="hover:text-white transition-colors"
                  >
                    Account Profile
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors"
                  >
                    About ASTRA
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Coordinators &amp; Support
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Legal & Policies */}
            <div className="space-y-3.5 col-span-2 sm:col-span-1">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
                Policies &amp; Legal
              </h3>
              <ul className="space-y-2.5 text-xs text-neutral-400">
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/refund-policy"
                    className="hover:text-white transition-colors"
                  >
                    Refund &amp; Cancellation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shipping-policy"
                    className="hover:text-white transition-colors"
                  >
                    Pass Delivery Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Operational Status */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              ASTRA 2026 Network Active • KMCT Institute of Emerging Technology &amp; Management
            </span>
          </div>

          <div className="flex items-center gap-1 text-neutral-400">
            <span>Crafted with passion by Dept. of Cyber Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
