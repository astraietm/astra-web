import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
    Activity, 
    Search, 
    Download, 
    RefreshCw, 
    ShieldCheck, 
    AlertTriangle, 
    Server, 
    X,
    Filter,
    Clock,
    Calendar
} from 'lucide-react';
import PageHeader from '../components/admin/common/PageHeader';
import StatusBadge from '../components/admin/common/StatusBadge';
import EmptyState from '../components/admin/common/EmptyState';
import { TableSkeleton } from '../components/admin/common/LoadingSkeleton';

const AdminLogs = () => {
    const { token } = useAuth();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('ALL');
    const [dateRange, setDateRange] = useState('ALL'); // 'ALL' | 'TODAY' | '7D' | '30D'
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/operations/logs/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLogs(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Failed to fetch logs", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [token]);

    const filteredLogs = useMemo(() => {
        const now = new Date();
        return logs.filter(log => {
            const matchesSearch = 
                (log.action || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                (log.user_email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (log.level || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (log.ip_address || '').toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesLevel = selectedLevel === 'ALL' || (log.level || '').toUpperCase() === selectedLevel;

            let matchesDate = true;
            if (dateRange !== 'ALL' && log.timestamp) {
                const logDate = new Date(log.timestamp);
                const diffMs = now - logDate;
                const diffDays = diffMs / (1000 * 60 * 60 * 24);
                if (dateRange === 'TODAY') {
                    matchesDate = diffDays <= 1;
                } else if (dateRange === '7D') {
                    matchesDate = diffDays <= 7;
                } else if (dateRange === '30D') {
                    matchesDate = diffDays <= 30;
                }
            }

            return matchesSearch && matchesLevel && matchesDate;
        });
    }, [logs, searchTerm, selectedLevel, dateRange]);

    // Metric stats
    const stats = useMemo(() => {
        const total = logs.length;
        const success = logs.filter(l => (l.level || '').toUpperCase() === 'SUCCESS').length;
        const warnings = logs.filter(l => (l.level || '').toUpperCase() === 'WARN' || (l.level || '').toUpperCase() === 'WARNING').length;
        const errors = logs.filter(l => (l.level || '').toUpperCase() === 'ERROR').length;
        return { total, success, warnings, errors };
    }, [logs]);

    const exportLogsCSV = () => {
        const headers = ['Timestamp', 'User', 'Action', 'Resource', 'Status'];
        const csvData = filteredLogs.map(l => [
            `"${l.timestamp ? new Date(l.timestamp).toISOString() : ''}"`,
            `"${l.user_email || 'System'}"`,
            `"${l.action || ''}"`,
            `"${l.ip_address || '127.0.0.1'}"`,
            `"${l.level || 'INFO'}"`
        ]);
        const csvContent = [headers.join(','), ...csvData.map(e => e.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `astra_audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    const getBadgeStatus = (level) => {
        const l = (level || '').toUpperCase();
        if (l === 'ERROR') return 'error';
        if (l === 'WARN' || l === 'WARNING') return 'warning';
        if (l === 'SUCCESS') return 'success';
        return 'info';
    };

    const hasActiveFilters = searchTerm !== '' || selectedLevel !== 'ALL' || dateRange !== 'ALL';

    const resetFilters = () => {
        setSearchTerm('');
        setSelectedLevel('ALL');
        setDateRange('ALL');
    };

    return (
        <div className="space-y-6 pb-12">
            {/* Standard SaaS Page Header */}
            <PageHeader
                title="Activity & Audit Logs"
                subtitle="Review administrative operations, authorization records, and operational events across the festival platform."
                breadcrumbs={[
                    { label: 'Admin', to: '/admin' },
                    { label: 'Audit Logs' }
                ]}
                actions={
                    <div className="flex items-center gap-2.5">
                        <button 
                            onClick={fetchLogs}
                            disabled={loading}
                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.08] text-xs font-semibold transition-colors disabled:opacity-50"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                        <button
                            onClick={exportLogsCSV}
                            disabled={filteredLogs.length === 0}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold transition-colors shadow-sm shadow-blue-500/20"
                        >
                            <Download className="w-3.5 h-3.5" />
                            Export CSV
                        </button>
                    </div>
                }
            />

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl bg-[#111319] border border-white/[0.06] flex items-center justify-between">
                    <div>
                        <p className="text-xs text-slate-400 font-medium">Logged Records</p>
                        <p className="text-xl font-bold text-white mt-1">{stats.total}</p>
                    </div>
                    <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                        <Activity className="w-4 h-4" />
                    </div>
                </div>

                <div className="p-4 rounded-xl bg-[#111319] border border-white/[0.06] flex items-center justify-between">
                    <div>
                        <p className="text-xs text-slate-400 font-medium">Successful</p>
                        <p className="text-xl font-bold text-emerald-400 mt-1">{stats.success}</p>
                    </div>
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <ShieldCheck className="w-4 h-4" />
                    </div>
                </div>

                <div className="p-4 rounded-xl bg-[#111319] border border-white/[0.06] flex items-center justify-between">
                    <div>
                        <p className="text-xs text-slate-400 font-medium">Warnings</p>
                        <p className="text-xl font-bold text-amber-400 mt-1">{stats.warnings}</p>
                    </div>
                    <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                        <AlertTriangle className="w-4 h-4" />
                    </div>
                </div>

                <div className="p-4 rounded-xl bg-[#111319] border border-white/[0.06] flex items-center justify-between">
                    <div>
                        <p className="text-xs text-slate-400 font-medium">Errors & Alerts</p>
                        <p className="text-xl font-bold text-rose-400 mt-1">{stats.errors}</p>
                    </div>
                    <div className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                        <Server className="w-4 h-4" />
                    </div>
                </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="p-3 bg-[#111319] border border-white/[0.06] rounded-xl flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search audit records by action, user email, or IP address..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#0d0f14] border border-white/[0.08] rounded-lg py-2 pl-9 pr-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {/* Severity Filter */}
                    <div className="relative min-w-[130px]">
                        <select 
                            value={selectedLevel}
                            onChange={(e) => setSelectedLevel(e.target.value)}
                            className="w-full bg-[#0d0f14] border border-white/[0.08] rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer"
                        >
                            <option value="ALL">All Severities</option>
                            <option value="SUCCESS">Success</option>
                            <option value="INFO">Info</option>
                            <option value="WARN">Warning</option>
                            <option value="ERROR">Error</option>
                        </select>
                        <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                    </div>

                    {/* Date Range Filter */}
                    <div className="relative min-w-[120px]">
                        <select 
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="w-full bg-[#0d0f14] border border-white/[0.08] rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer"
                        >
                            <option value="ALL">All Dates</option>
                            <option value="TODAY">Last 24h</option>
                            <option value="7D">Last 7 Days</option>
                            <option value="30D">Last 30 Days</option>
                        </select>
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                    </div>

                    {hasActiveFilters && (
                        <button
                            onClick={resetFilters}
                            className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white text-xs transition-colors"
                        >
                            <X className="w-3.5 h-3.5" />
                            <span>Reset</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Audit Logs Table with exact requested columns: Timestamp, User, Action, Resource, Status */}
            <div className="bg-[#111319] border border-white/[0.06] rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                                <th className="px-5 py-3.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Timestamp</th>
                                <th className="px-5 py-3.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">User</th>
                                <th className="px-5 py-3.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Action</th>
                                <th className="px-5 py-3.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Resource / Host</th>
                                <th className="px-5 py-3.5 text-right text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                            {loading ? (
                                <TableSkeleton rows={8} cols={5} />
                            ) : filteredLogs.length > 0 ? (
                                filteredLogs.map((log, idx) => (
                                    <tr key={log.id || idx} className="hover:bg-white/[0.02] transition-colors">
                                        {/* Timestamp */}
                                        <td className="px-5 py-3.5 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-slate-200">
                                                    {log.timestamp ? new Date(log.timestamp).toLocaleDateString(undefined, {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    }) : '—'}
                                                </span>
                                                <span className="text-[10px] text-slate-500 font-mono">
                                                    {log.timestamp ? new Date(log.timestamp).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        second: '2-digit'
                                                    }) : ''}
                                                </span>
                                            </div>
                                        </td>

                                        {/* User */}
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-6 h-6 rounded-md bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[10px] font-bold text-slate-300 shrink-0">
                                                    {(log.user_email?.[0] || 'S').toUpperCase()}
                                                </div>
                                                <span className="text-xs text-slate-300 font-medium truncate max-w-[180px]">
                                                    {log.user_email || 'System'}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Action */}
                                        <td className="px-5 py-3.5">
                                            <span className="text-xs font-medium text-white">
                                                {log.action}
                                            </span>
                                        </td>

                                        {/* Resource / Host */}
                                        <td className="px-5 py-3.5">
                                            <span className="text-[11px] font-mono text-slate-400 bg-white/[0.02] px-2 py-0.5 rounded border border-white/[0.05]">
                                                {log.ip_address || '127.0.0.1'}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-5 py-3.5 text-right">
                                            <StatusBadge 
                                                status={getBadgeStatus(log.level)}
                                                label={(log.level || 'INFO').toUpperCase()}
                                            />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-0">
                                        <EmptyState 
                                            icon={Activity}
                                            title={hasActiveFilters ? "No matching log entries" : "No activity recorded yet"}
                                            description={
                                                hasActiveFilters 
                                                    ? "Try adjusting your search criteria or date filters."
                                                    : "Administrative operations and security events will be automatically recorded here."
                                            }
                                            actionLabel={hasActiveFilters ? "Reset Filters" : undefined}
                                            onAction={hasActiveFilters ? resetFilters : undefined}
                                        />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {!loading && filteredLogs.length > 0 && (
                    <div className="px-5 py-3 border-t border-white/[0.06] bg-white/[0.01] flex items-center justify-between text-xs text-slate-400">
                        <span>Showing <strong className="text-white">{filteredLogs.length}</strong> of <strong className="text-white">{logs.length}</strong> audit entries</span>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                            <Clock className="w-3 h-3" />
                            <span>Live audit logging active</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminLogs;
