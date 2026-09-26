"use client";

import React, { useState } from "react";
import api from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { QrCode, CheckCircle2, XCircle, Loader2, ShieldCheck, User, Mail, Calendar } from "lucide-react";

export default function AdminScanner() {
  const [token, setToken] = useState("");
  const [result, setResult] = useState<any>(null);
  const [verifying, setVerifying] = useState(false);
  const { showToast } = useToast();

  const handleVerify = async () => {
    if (!token.trim()) {
      showToast("Please enter a token.", "error");
      return;
    }
    setVerifying(true);
    setResult(null);
    try {
      const res = await api.get(`/api/verify/${token.trim()}/`);
      setResult(res.data);
      showToast("Token verified!", "success");
    } catch (err: any) {
      const msg = err.response?.data?.error || err.response?.data?.detail || "Verification failed.";
      setResult({ error: msg });
      showToast(msg, "error");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 pb-2 border-b border-neutral-800/80">
        <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-white text-neutral-950 shadow-sm">
          <QrCode className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            QR Scanner &amp; Token Verifier
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
            Gate pass verification and attendee check-in
          </p>
        </div>
      </div>

      <div className="max-w-xl">
        {/* Verifier panel */}
        <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/50 backdrop-blur-xl p-6 sm:p-7 shadow-sm">
          <div className="flex items-center gap-2 mb-5 pb-4 border-b border-neutral-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">
              Gate Scanner Active
            </span>
          </div>

          <label className="block text-xs font-medium text-neutral-300 mb-2">
            Registration Token / Pass Key
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste or type token string..."
              onKeyDown={(e) => e.key === "Enter" && handleVerify()}
              className="flex-1 px-4 py-3 bg-neutral-950/80 border border-neutral-800 rounded-xl text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-neutral-600 transition-all font-mono tracking-wide"
            />
            <button
              onClick={handleVerify}
              disabled={verifying}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-neutral-950 hover:bg-neutral-100 font-semibold text-xs sm:text-sm tracking-wide transition-all shadow-sm disabled:opacity-50 whitespace-nowrap cursor-pointer"
            >
              {verifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>Verify</span>
            </button>
          </div>

          {/* Result */}
          {result && (
            <div
              className={`mt-6 rounded-xl border p-5 transition-all ${
                result.error
                  ? "border-red-500/30 bg-red-500/10 text-red-300"
                  : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              }`}
            >
              {result.error ? (
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-300">Verification Failed</p>
                    <p className="text-xs text-red-400/90 mt-1">{result.error}</p>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-emerald-500/20">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-semibold text-emerald-300">
                      Token Verified Successfully
                    </span>
                  </div>
                  <div className="space-y-2.5 text-xs text-neutral-300">
                    {result.user_name && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                        <span className="text-neutral-400 w-16 flex-shrink-0">Attendee:</span>
                        <span className="font-semibold text-white">{result.user_name}</span>
                      </div>
                    )}
                    {result.user_email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                        <span className="text-neutral-400 w-16 flex-shrink-0">Email:</span>
                        <span className="text-neutral-200">{result.user_email}</span>
                      </div>
                    )}
                    {result.event_details?.title && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                        <span className="text-neutral-400 w-16 flex-shrink-0">Event:</span>
                        <span className="font-medium text-white">{result.event_details.title}</span>
                      </div>
                    )}
                    {result.status && (
                      <div className="flex items-center gap-2 pt-2 border-t border-emerald-500/20">
                        <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span className="text-neutral-400 w-16 flex-shrink-0">Status:</span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {result.status}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
