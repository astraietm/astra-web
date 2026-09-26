"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function RegisterIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/events");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50/60 font-sans">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-900" />
        <p className="text-xs font-medium text-neutral-500">Redirecting to Events Directory...</p>
      </div>
    </div>
  );
}
