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
  Trash2,
  X,
  Copy,
  Check,
  Terminal,
} from "lucide-react";

function LevelBadge({ level }: { level: string }) {
  const map: Record<string, { cls: string; icon: React.ReactNode }> = {
    SUCCESS: { cls: "bg-[#C3FF16] text-black border-black", icon: <CheckCircle2 className="w-3 h-3" /> },
    ERROR: { cls: "bg-red-400 text-black border-black", icon: <AlertTriangle className="w-3 h-3" /> },
    WARN: { cls: "bg-[#FFE816] text-black border-black", icon: <AlertTriangle className="w-3 h-3" /> },
    INFO: { cls: "bg-[#97F8B7] text-black border-black", icon: <Info className="w-3 h-3" /> },
  };
  const normalizedLevel = (level || "INFO").toUpperCase();
  const { cls, icon } = map[normalizedLevel] ?? {
    cls: "bg-white/10 text-white border-white/20",
    icon: <Info className="w-3 h-3" />,
  };
  return (
    <span className={`inline-flex items-center gap-1 font-pixel text-[8px] uppercase px-1.5 py-0.5 border shadow-[1px_1px_0px_#000] ${cls}`}>
      {icon}
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

  const fetchLogs = useCallback(async (isSilent = false) => {
    if (!isSilent) setRefreshing(true);
    try {
      const params = new URLSearchParams();
      if (selectedLevel !== "ALL") params.append("level", selectedLevel);
      if (searchQuery.trim()) params.append("search", searchQuery.trim());

      const res = await api.get(`/api/ops/logs/?${params.toString()}`);
      setLogs(Array.isArray(res.data) ? res.data : res.data?.results || []);
    } catch {
      if (!isSilent) showToast("Failed to load audit logs.", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedLevel, searchQuery, showToast]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchLogs(true);
    }, 10000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchLogs]);

  const handleClearLogs = async () => {
    if (!confirm("Are you sure you want to purge all system audit logs?")) return;
    try {
      await api.delete("/api/ops/logs/clear/");
      showToast("Audit logs purged successfully.", "success");
      fetchLogs();
    } catch {
      showToast("Failed to clear logs.", "error");
    }
  };

  const copyLogDetail = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-[#E8CCFF] border-2 border-black shadow-[3px_3px_0px_#000]">
            <Terminal className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="font-pixel text-xl font-bold text-white uppercase tracking-wide">Django System Audit Logs</h1>
            <p className="font-mono text-[11px] text-white/40 uppercase">
              {logs.length} Log Entries Recorded in Database
            </p>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            type="button"
            className={`px-3 py-1.5 font-mono text-xs font-bold uppercase border-2 border-black transition-colors shadow-[2px_2px_0px_#000] flex items-center gap-1.5 ${
              autoRefresh ? "bg-th-lime text-black" : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${autoRefresh ? "animate-spin" : ""}`} />
            {autoRefresh ? "Auto (10s)" : "Auto Off"}
          </button>

          <button
            onClick={() => fetchLogs()}
            disabled={refreshing}
            type="button"
            className="px-3 py-1.5 bg-[#FFE816] text-black font-mono text-xs font-bold uppercase border-2 border-black hover:bg-yellow-300 transition-colors shadow-[2px_2px_0px_#000] flex items-center gap-1.5 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>

          <button
            onClick={handleClearLogs}
            type="button"
            className="px-3 py-1.5 bg-red-500 text-white font-mono text-xs font-bold uppercase border-2 border-black hover:bg-red-600 transition-colors shadow-[2px_2px_0px_#000] flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Logs
          </button>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#161622] p-4 border-2 border-white/15 shadow-[4px_4px_0px_rgba(255,255,255,0.06)]">
        {/* Search */}
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-white/40 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search action, details, user, IP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-black/40 border-2 border-white/20 text-white font-mono text-xs placeholder:text-white/30 focus:outline-none focus:border-[#FFE816]"
          />
        </div>

        {/* Level Dropdown */}
        <div>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="w-full px-3 py-2 bg-black/40 border-2 border-white/20 text-white font-mono text-xs focus:outline-none focus:border-[#FFE816]"
          >
            <option value="ALL">All Levels</option>
            <option value="INFO">INFO</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="WARN">WARN</option>
            <option value="ERROR">ERROR</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 bg-[#161622] border-2 border-white/15">
          <Loader2 className="w-8 h-8 animate-spin text-[#FFE816]" />
          <span className="font-pixel text-xs text-white/40 uppercase animate-pulse">
            Fetching Logs from DB...
          </span>
        </div>
      ) : (
        <div className="border-2 border-white/20 bg-[#161622] shadow-[4px_4px_0px_rgba(255,255,255,0.06)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b-2 border-white/15 bg-white/[0.04]">
                  {["Level", "Action / Module", "Log Details", "User / Actor", "IP Address", "Timestamp", "View"].map((h) => (
                    <th
                      key={h}
                      className="text-left p-3 font-pixel text-[9px] text-white/50 uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.map((log: any, i) => (
                  <tr
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className={`border-b border-white/5 cursor-pointer hover:bg-white/[0.06] transition-colors ${
                      i % 2 === 0 ? "" : "bg-white/[0.015]"
                    }`}
                  >
                    <td className="p-3 whitespace-nowrap">
                      <LevelBadge level={log.level} />
                    </td>
                    <td className="p-3 font-pixel text-[10px] text-white uppercase tracking-wide whitespace-nowrap">
                      {log.action}
                    </td>
                    <td className="p-3 font-mono text-white/60 max-w-xs truncate">
                      {log.details || "—"}
                    </td>
                    <td className="p-3 font-mono text-white/50 whitespace-nowrap">
                      {log.user_email || log.user || "System"}
                    </td>
                    <td className="p-3 font-mono text-white/40 whitespace-nowrap">
                      {log.ip_address || "—"}
                    </td>
                    <td className="p-3 font-mono text-white/40 whitespace-nowrap">
                      {log.timestamp ? new Date(log.timestamp).toLocaleString("en-IN") : "—"}
                    </td>
                    <td className="p-3 font-mono text-[10px] text-[#FFE816] hover:underline whitespace-nowrap">
                      Details →
                    </td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-16 text-center font-pixel text-xs text-white/30 uppercase">
                      No matching log entries found in Database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 border-t-2 border-white/10 flex items-center justify-between font-pixel text-[10px] text-white/40 uppercase">
            <span>Showing {logs.length} entries</span>
            <span>Database Backend: Active</span>
          </div>
        </div>
      )}

      {/* Log Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-[#161622] border-4 border-white p-6 shadow-[10px_10px_0px_#000] text-white space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b-2 border-white/20 pb-3">
              <div className="flex items-center gap-2">
                <LevelBadge level={selectedLog.level} />
                <h3 className="font-pixel text-sm font-bold uppercase text-white tracking-wider">
                  {selectedLog.action}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-black/40 p-3 border-2 border-white/10 font-mono text-xs">
              <div>
                <span className="text-[9px] uppercase text-white/40 block">Log ID</span>
                <span className="font-bold text-white">#{selectedLog.id}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase text-white/40 block">Actor</span>
                <span className="font-bold text-white truncate block">
                  {selectedLog.user_email || selectedLog.user || "System"}
                </span>
              </div>
              <div>
                <span className="text-[9px] uppercase text-white/40 block">IP Address</span>
                <span className="font-bold text-white">{selectedLog.ip_address || "N/A"}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase text-white/40 block">Timestamp</span>
                <span className="font-bold text-white text-[10px]">
                  {selectedLog.timestamp ? new Date(selectedLog.timestamp).toLocaleString("en-IN") : "N/A"}
                </span>
              </div>
            </div>

            {/* Full Message / Payload Text */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-pixel text-[10px] text-white/50 uppercase tracking-wider">
                  Raw Log Record Details
                </span>
                <button
                  onClick={() => copyLogDetail(selectedLog.details || "")}
                  type="button"
                  className="flex items-center gap-1 font-mono text-[10px] text-[#FFE816] hover:underline"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <pre className="p-4 bg-black border-2 border-white/20 font-mono text-xs text-emerald-400 whitespace-pre-wrap break-words max-h-72 overflow-y-auto leading-relaxed shadow-inner">
                {selectedLog.details || "No additional payload details recorded."}
              </pre>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-5 py-2 bg-white text-black font-display font-bold text-xs uppercase border-2 border-black hover:bg-gray-200 transition-colors shadow-[2px_2px_0px_#000]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
