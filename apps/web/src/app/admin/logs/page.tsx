"use client";

import React, { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import {
  Loader2,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Info,
  Search,
  RefreshCw,
  X,
  Copy,
  Check,
} from "lucide-react";

function LevelBadge({ level }: { level: string }) {
  const map: Record<string, { bg: string; text: string; border: string; icon: React.ReactNode }> = {
    SUCCESS: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/20",
      icon: <CheckCircle2 className="w-3 h-3" />,
    },
    ERROR: {
      bg: "bg-red-500/10",
      text: "text-red-400",
      border: "border-red-500/20",
      icon: <AlertTriangle className="w-3 h-3" />,
    },
    WARN: {
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      border: "border-amber-500/20",
      icon: <AlertTriangle className="w-3 h-3" />,
    },
    INFO: {
      bg: "bg-blue-500/10",
      text: "text-blue-400",
      border: "border-blue-500/20",
      icon: <Info className="w-3 h-3" />,
    },
  };
  const normalizedLevel = (level || "INFO").toUpperCase();
  const current = map[normalizedLevel] ?? {
    bg: "bg-neutral-800",
    text: "text-neutral-300",
    border: "border-neutral-700",
    icon: <Info className="w-3 h-3" />,
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${current.bg} ${current.text} ${current.border}`}
    >
      {current.icon}
      {normalizedLevel}
    </span>
  );
}

export default function AdminLogs() {
  const { showToast } = useToast();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [selectedLog, setSelectedLog] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchLogs = useCallback(
    async (isSilent = false) => {
      if (!isSilent) setRefreshing(true);
      try {
        const params = new URLSearchParams();
        if (selectedLevel !== "ALL") params.append("level", selectedLevel);
        if (searchQuery.trim()) params.append("search", searchQuery.trim());

        const res = await api.get(`/api/ops/logs/?${params.toString()}`);
        setLogs(Array.isArray(res.data) ? res.data : res.data?.results || []);
      } catch {
        if (!isSilent) showToast("Failed to fetch system logs.", "error");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [selectedLevel, searchQuery, showToast]
  );

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchLogs(true);
    }, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchLogs]);

  const handleCopyDetails = () => {
    if (!selectedLog) return;
    navigator.clipboard.writeText(JSON.stringify(selectedLog, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast("Log details copied to clipboard.", "success");
  };

  const levels = ["ALL", "INFO", "SUCCESS", "WARN", "ERROR"];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-neutral-800/80">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-white text-neutral-950 shadow-sm">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Audit Logs &amp; Events
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
              Live telemetry and operational audit trails
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              autoRefresh
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white"
            }`}
          >
            {autoRefresh ? "● Live Stream On" : "○ Live Stream Off"}
          </button>
          <button
            onClick={() => fetchLogs()}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Level Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {levels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                selectedLevel === lvl
                  ? "bg-white text-neutral-950 shadow-sm font-semibold"
                  : "bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search action, actor, message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-950/80 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-neutral-600 transition-all"
          />
        </div>
      </div>

      {/* Logs Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
          <span className="text-xs text-neutral-400">Loading audit records...</span>
        </div>
      ) : (
        <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/50 backdrop-blur-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950/40">
                  {["Timestamp", "Level", "Action", "Actor", "Details"].map((h) => (
                    <th
                      key={h}
                      className="text-left p-3.5 text-xs font-medium text-neutral-400 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 font-mono">
                {logs.map((log: any) => (
                  <tr
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className="hover:bg-neutral-800/30 transition-colors cursor-pointer"
                  >
                    <td className="p-3.5 text-neutral-400 whitespace-nowrap text-[11px]">
                      {new Date(log.timestamp || log.created_at).toLocaleString()}
                    </td>
                    <td className="p-3.5">
                      <LevelBadge level={log.level} />
                    </td>
                    <td className="p-3.5 font-semibold text-white">{log.action || "EVENT"}</td>
                    <td className="p-3.5 text-neutral-300">{log.actor || log.user || "System"}</td>
                    <td className="p-3.5 text-neutral-400 max-w-xs truncate">{log.message || log.details}</td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-xs text-neutral-500 font-sans">
                      No logs found matching criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
              <div className="flex items-center gap-2">
                <LevelBadge level={selectedLog.level} />
                <h3 className="text-sm font-semibold text-white">{selectedLog.action}</h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1.5 rounded-lg border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 text-xs text-neutral-300 font-mono overflow-x-auto max-h-80">
              <pre>{JSON.stringify(selectedLog, null, 2)}</pre>
            </div>

            <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-neutral-800">
              <button
                onClick={handleCopyDetails}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-neutral-950 hover:bg-neutral-100 text-xs font-semibold tracking-wide transition-all shadow-sm cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy Payload"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
