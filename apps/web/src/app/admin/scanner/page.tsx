"use client";
import React, { useState } from "react";
import api from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { QrCode, CheckCircle2, XCircle, Loader2, Camera } from "lucide-react";

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
      showToast("Token verified successfully!", "success");
    } catch (err: any) {
      const msg = err.response?.data?.error || err.response?.data?.detail || "Verification failed.";
      setResult({ error: msg });
      showToast(msg, "error");
    } finally { setVerifying(false); }
  };

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-white mb-6">QR Scanner / Token Verifier</h1>

      <div className="bg-[#111318] border border-white/5 rounded-xl p-6 max-w-lg">
        <div className="flex items-center gap-3 mb-4">
          <QrCode className="w-6 h-6 text-blue-400" />
          <h2 className="text-sm font-medium text-white">Verify Registration Token</h2>
        </div>
        <div className="flex gap-3">
          <input type="text" value={token} onChange={(e) => setToken(e.target.value)} placeholder="Enter or scan token..."
            onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
            className="flex-1 px-3 py-2.5 bg-[#090A0F] border border-white/10 rounded-lg text-sm text-white font-mono" />
          <button onClick={handleVerify} disabled={verifying}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {verifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} Verify
          </button>
        </div>

        {result && (
          <div className={`mt-4 p-4 rounded-lg border ${result.error ? 'border-red-500/20 bg-red-500/5' : 'border-emerald-500/20 bg-emerald-500/5'}`}>
            {result.error ? (
              <div className="flex items-center gap-2 text-red-400"><XCircle className="w-5 h-5" /><span className="text-sm">{result.error}</span></div>
            ) : (
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-emerald-400 font-medium"><CheckCircle2 className="w-5 h-5" /> Verified Successfully</div>
                {result.user_name && <p className="text-gray-300">Name: {result.user_name}</p>}
                {result.user_email && <p className="text-gray-300">Email: {result.user_email}</p>}
                {result.event_details?.title && <p className="text-gray-300">Event: {result.event_details.title}</p>}
                {result.status && <p className="text-gray-300">Status: {result.status}</p>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
