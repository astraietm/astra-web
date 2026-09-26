"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  const pathname = usePathname();

  // Do not render public footer on admin portal routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="py-8 sm:py-12 bg-graph-paper border-t-2 border-black/10">
      <div className="max-w-5xl mx-auto px-6 sm:px-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-black" />
            <span className="font-pixel text-xs font-bold uppercase tracking-wider text-black">
              ASTRA 2026
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-gray-500">
            <Link href="/about" className="hover:text-black transition-colors">About</Link>
            <Link href="/contact" className="hover:text-black transition-colors">Contact</Link>
            <Link href="/events" className="hover:text-black transition-colors">Events</Link>
            <Link href="/gallery" className="hover:text-black transition-colors">Gallery</Link>
            <Link href="/terms" className="hover:text-black transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-black transition-colors">Privacy</Link>
            <Link href="/refund-policy" className="hover:text-black transition-colors">Refund Policy</Link>
            <Link href="/shipping-policy" className="hover:text-black transition-colors">Shipping</Link>
          </div>
        </div>
        <div className="text-center">
          <p className="font-mono text-xs sm:text-sm text-gray-400 tracking-wide">
            crafted @ dept. of cyber security, kmct &lt;3
          </p>
        </div>
      </div>
    </footer>
  );
};
