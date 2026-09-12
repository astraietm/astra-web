import React from "react";
import Link from "next/link";
import { PixelFrame } from "@/components/ui/PixelFrame";
import { StickerBadge } from "@/components/ui/StickerBadge";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-graph-paper">
      <PixelFrame dotGrid cornerAccent className="p-10 sm:p-14 text-center max-w-lg">
        <StickerBadge color="pink" rotation={-2}>ERROR 404</StickerBadge>
        <h1 className="font-pixel text-6xl sm:text-8xl font-extrabold text-black mt-4">404</h1>
        <p className="font-editorial italic text-2xl text-gray-700 mt-3">
          This page does not exist in the matrix.
        </p>
        <p className="font-sans text-sm text-gray-500 mt-2 mb-8">
          The route you requested could not be found. It may have been moved or deleted.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/"
            className="px-6 py-3 bg-black text-white font-display font-bold text-xs uppercase tracking-wider border-2 border-black hover:bg-th-yellow hover:text-black transition-colors shadow-[3px_3px_0px_#000]">
            BACK TO HOME →
          </Link>
          <Link href="/events"
            className="px-6 py-3 bg-white text-black font-display font-bold text-xs uppercase tracking-wider border-2 border-black hover:bg-gray-100 transition-colors shadow-[3px_3px_0px_#000]">
            VIEW EVENTS
          </Link>
        </div>
      </PixelFrame>
    </div>
  );
}
