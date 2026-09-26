"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";
import {
  Shield,
  ShieldCheck,
  Sparkles,
  Ticket,
  Trophy,
  GraduationCap,
  ArrowLeft,
  Loader2,
  Lock,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import api from "@/lib/api";
import { useToast } from "@/lib/toast-context";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/dashboard";
  const { user, handleServerLogin } = useAuth();
  const { showToast } = useToast();

  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // If already logged in, redirect
  React.useEffect(() => {
    if (user) {
      router.push(nextUrl);
    }
  }, [user, router, nextUrl]);

  const onGoogleSuccess = async (credentialResponse: any) => {
    setIsAuthenticating(true);
    try {
      const res = await api.post("/api/auth/google/", {
        token: credentialResponse.credential,
      });

      handleServerLogin(res.data);
      showToast("Signed in successfully!", "success");

      // Redirect user to destination
      setTimeout(() => {
        router.push(nextUrl);
      }, 500);
    } catch (err: any) {
      console.error("Authentication failed:", err);
      setIsAuthenticating(false);
      showToast("Authentication failed. Please try again.", "error");
    }
  };

  return (
    <div className="relative min-h-screen pt-24 sm:pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-neutral-50/50 font-sans flex flex-col justify-center items-center overflow-hidden">
      {/* ── Minimal Animated Ambient Light Glows ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -25, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-amber-400/10 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{
            x: [0, -35, 0],
            y: [0, 30, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/3 -right-32 w-[650px] h-[650px] bg-blue-400/10 rounded-full blur-[160px]"
        />
        <div
          className="absolute inset-0 opacity-[0.3]"
          style={{
            backgroundImage: `radial-gradient(circle, #000000 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
            maskImage: "radial-gradient(ellipse at center, rgba(0,0,0,0.8), transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, rgba(0,0,0,0.8), transparent 75%)",
          }}
        />
      </div>

      {/* ── Main Container ── */}
      <div className="relative w-full max-w-4xl mx-auto space-y-6">
        {/* Back navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-200 bg-white/80 backdrop-blur-md text-xs font-medium text-neutral-700 hover:border-neutral-300 hover:bg-white transition-all shadow-sm select-none"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to ASTRA 2026</span>
          </Link>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-neutral-200/80 text-[11px] font-medium text-neutral-600 shadow-sm backdrop-blur-md">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Single Sign-On (SSO)</span>
          </span>
        </div>

        {/* ── Full Sign-In Grid Card ── */}
        <div className="bg-white/95 backdrop-blur-2xl rounded-3xl border border-neutral-200/80 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
          {/* Left Hero Brand Panel (5 cols) */}
          <div className="md:col-span-5 bg-neutral-950 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
            {/* Soft backdrop glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white text-neutral-950 flex items-center justify-center shadow-md">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-lg font-bold tracking-tight block text-white leading-tight">
                    ASTRA 2026
                  </span>
                  <span className="text-[11px] text-neutral-400 font-medium">
                    KMCT Calicut • Oct 06 &amp; 07
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                  Welcome to the Flagship Portal
                </h2>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Sign in with your official Google account to register for events, claim your QR passes, and access symposium challenges.
                </p>
              </div>

              {/* Benefits checklist */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2.5 text-xs text-neutral-300">
                  <Ticket className="w-4 h-4 text-amber-300 flex-shrink-0" />
                  <span>Instant verified entry pass generation</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-neutral-300">
                  <Trophy className="w-4 h-4 text-amber-300 flex-shrink-0" />
                  <span>Live national CTF leaderboard tracking</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-neutral-300">
                  <GraduationCap className="w-4 h-4 text-amber-300 flex-shrink-0" />
                  <span>Verified certificates &amp; KTU activity credits</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-8 border-t border-neutral-800 text-[11px] text-neutral-500">
              Department of Cyber Security • KMCT IETM
            </div>
          </div>

          {/* Right Action Panel (7 cols) */}
          <div className="md:col-span-7 p-8 sm:p-12 flex flex-col justify-center items-center text-center space-y-6">
            <motion.div
              className="w-16 h-16 bg-neutral-100 rounded-3xl border border-neutral-200 flex items-center justify-center shadow-sm text-neutral-900 mx-auto"
              animate={
                isAuthenticating
                  ? {
                      scale: [1, 1.05, 1],
                    }
                  : {}
              }
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {isAuthenticating ? (
                <Loader2 className="w-8 h-8 text-neutral-900 animate-spin" />
              ) : (
                <Lock className="w-8 h-8 text-neutral-800" />
              )}
            </motion.div>

            <div className="space-y-1.5 max-w-sm">
              <h1 className="text-2xl font-bold text-neutral-950 tracking-tight">
                {isAuthenticating ? "Verifying Credentials..." : "Sign In to ASTRA"}
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
                {isAuthenticating
                  ? "Establishing secure session token with ASTRA identity servers."
                  : "Use your Google account to sign in securely in one click."}
              </p>
            </div>

            {/* Google Login Component */}
            <div className="pt-2 min-h-[50px] flex items-center justify-center">
              {isAuthenticating ? (
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-5 py-2.5 rounded-full border border-emerald-200 shadow-sm">
                  <ShieldCheck className="w-4 h-4" /> Secure Session Authenticated
                </div>
              ) : (
                <div className="scale-105 origin-center">
                  <GoogleLogin
                    onSuccess={onGoogleSuccess}
                    onError={() => showToast("Google authentication failed.", "error")}
                    theme="outline"
                    shape="pill"
                    size="large"
                    width="280"
                  />
                </div>
              )}
            </div>

            {/* Security Guarantee Note */}
            <div className="pt-6 border-t border-neutral-100 w-full max-w-xs text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
                <span>Protected by KMCT Cyber Security</span>
              </div>
              <p className="text-[10px] text-neutral-400">
                Your credentials are encrypted end-to-end.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-neutral-50/60 font-sans">
          <Loader2 className="w-8 h-8 animate-spin text-neutral-900" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
