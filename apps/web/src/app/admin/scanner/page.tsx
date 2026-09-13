"use client";
import React, { useState } from "react";
import api from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { QrCode, CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function AdminScanner() {
  const [token, setToken] = useState("");
  const [result, setResult] = useState<any>(null);
  const [verifying, setVerifying] = useState(false);
  const { showToast } = useToast();

  const handleVerify = async () => {
    if (!token.trim()) { showToast("Please enter a token.", "error"); return; }
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
    } finally { setVerifying(false); }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center justify-center w-9 h-9 bg-[#97F8B7] border-2 border-black shadow-[3px_3px_0px_#000]">
          <QrCode className="w-4 h-4 text-black" />
        </div>
        <div>
          <h1 className="font-pixel text-xl font-bold text-white uppercase">QR Scanner</h1>
          <p className="font-mono text-[10px] text-white/30 uppercase">Token Verification Terminal</p>
        </div>
      </div>

      <div className="max-w-xl">
        {/* Verifier panel */}
        <div className="border-2 border-white/20 bg-[#161622] shadow-[4px_4px_0px_rgba(255,255,255,0.06)] p-6 mb-4">
          <div className="flex items-center gap-2 mb-5 pb-4 border-b-2 border-white/10">
            <div className="w-2 h-2 rounded-full bg-[#C3FF16] animate-pulse" />
            <span className="font-pixel text-[10px] text-white/60 uppercase tracking-widest">Verification Terminal Online</span>
          </div>

          <label className="block font-pixel text-[9px] text-white/40 uppercase tracking-wider mb-2">
            Registration Token
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter or paste token..."
              onKeyDown={(e) => e.key === "Enter" && handleVerify()}
              className="flex-1 px-4 py-3 bg-[#0C0C14] border-2 border-white/20 text-sm text-white font-mono placeholder:text-white/20 focus:outline-none focus:border-[#FFE816] transition-colors tracking-wider"
            />
            <button
              onClick={handleVerify}
              disabled={verifying}
              className="flex items-center gap-2 px-5 py-3 bg-[#FFE816] text-black font-pixel text-[10px] uppercase border-2 border-black shadow-[3px_3px_0px_#000] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-50 whitespace-nowrap"
            >
              {verifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Verify
            </button>
          </div>

          {/* Result */}
          {result && (
            <div className={`mt-5 border-2 p-4 ${
              result.error
                ? "border-red-500/50 bg-red-500/5 shadow-[3px_3px_0px_rgba(239,68,68,0.2)]"
                : "border-[#C3FF16]/50 bg-[#C3FF16]/5 shadow-[3px_3px_0px_rgba(195,255,22,0.2)]"
            }`}>
              {result.error ? (
                <div className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <div>
                    <p className="font-pixel text-[10px] text-red-400 uppercase mb-1">Verification Failed</p>
                    <p className="font-mono text-xs text-red-300">{result.error}</p>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="w-5 h-5 text-[#C3FF16]" />
                    <span className="font-pixel text-[10px] text-[#C3FF16] uppercase tracking-wider">Verified Successfully</span>
                  </div>
                  <div className="space-y-2 font-mono text-xs">
                    {result.user_name && (
                      <div className="flex gap-3">
                        <span className="text-white/30 w-20 flex-shrink-0">Name</span>
                        <span className="text-white">{result.user_name}</span>
                      </div>
                    )}
                    {result.user_email && (
                      <div className="flex gap-3">
                        <span className="text-white/30 w-20 flex-shrink-0">Email</span>
                        <span className="text-white">{result.user_email}</span>
                      </div>
                    )}
                    {result.event_details?.title && (
                      <div className="flex gap-3">
                        <span className="text-white/30 w-20 flex-shrink-0">Event</span>
                        <span className="text-white">{result.event_details.title}</span>
                      </div>
                    )}
                    {result.status && (
                      <div className="flex gap-3 pt-2 border-t border-white/10">
                        <span className="text-white/30 w-20 flex-shrink-0">Status</span>
                        <span className="font-pixel text-[9px] bg-[#C3FF16] text-black px-2 py-0.5 border border-black shadow-[1px_1px_0px_#000]">
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

        <p className="font-mono text-[10px] text-white/20 uppercase text-center">
          Press ENTER or click Verify to check token
        </p>
      </div>
    </div>
  );
}
