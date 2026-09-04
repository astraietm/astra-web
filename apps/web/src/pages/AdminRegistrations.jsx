import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
    Users, 
    CheckCircle2, 
    Clock, 
    Search, 
    Download, 
    ChevronRight, 
    RefreshCw, 
    Trash2,
    Copy,
    Check,
    Filter,
    X,
    UserCheck,
    Ticket
} from 'lucide-react';
import PageHeader from '../components/admin/common/PageHeader';
import StatusBadge from '../components/admin/common/StatusBadge';
import EmptyState from '../components/admin/common/EmptyState';
import { TableSkeleton } from '../components/admin/common/LoadingSkeleton';
import AttendeeDrawer from '../components/admin/common/AttendeeDrawer';

const AdminRegistrations = () => {
    const { token } = useAuth();
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterEvent, setFilterEvent] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [copyingToken, setCopyingToken] = useState(null);
    const [selectedAttendee, setSelectedAttendee] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

    const fetchRegistrations = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/admin-registrations/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRegistrations(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error("Failed to fetch registrations", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRegistrations();
    }, [token]);

    const handleClearAll = async () => {
        if (!window.confirm("Are you sure you want to delete ALL registrations? This action cannot be undone.")) return;
        
        setLoading(true);
        try {
            await axios.delete(`${API_URL}/admin-registrations/clear/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRegistrations([]);
        } catch (error) {
            console.error('Error clearing registrations:', error);
        } finally {
            setLoading(false);
        }
    };

    const uniqueEvents = useMemo(() => {
        return ['all', ...new Set(registrations.map(r => r.event_details?.title).filter(Boolean))];
    }, [registrations]);

    const filteredData = useMemo(() => {
        return registrations.filter(reg => {
            const matchesSearch = 
                reg.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                reg.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                reg.token?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesEvent = filterEvent === 'all' || reg.event_details?.title === filterEvent;
            const isAccessed = reg.is_used || reg.status === 'ATTENDED';
            const matchesStatus = 
                filterStatus === 'all' || 
                (filterStatus === 'attended' && isAccessed) || 
                (filterStatus === 'pending' && !isAccessed);
            return matchesSearch && matchesEvent && matchesStatus;
        });
    }, [registrations, searchTerm, filterEvent, filterStatus]);

    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 25;

    // Reset pagination on filter/search change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterEvent, filterStatus]);

    const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredData.slice(start, start + pageSize);
    }, [filteredData, currentPage, pageSize]);

    // Statistics
    const stats = useMemo(() => {
        const total = registrations.length;
        const attended = registrations.filter(r => r.is_used || r.status === 'ATTENDED').length;
        const pending = total - attended;
        const rate = total > 0 ? Math.round((attended / total) * 100) : 0;
        return { total, attended, pending, rate };
    }, [registrations]);

    const exportToCSV = () => {
        const headers = ['Name', 'Email', 'Event', 'Registration Date', 'Token', 'Status'];
        const csvData = filteredData.map(reg => [
            `"${reg.user_name || 'Anonymous'}"`,
            `"${reg.user_email || ''}"`,
            `"${reg.event_details?.title || ''}"`,
            `"${new Date(reg.timestamp).toLocaleString()}"`,
            `"${reg.token || ''}"`,
            (reg.is_used || reg.status === 'ATTENDED') ? 'Checked In' : 'Registered'
        ]);
        const csvContent = [headers.join(','), ...csvData.map(e => e.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `astra_registrations_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    const handleCopyToken = (e, t) => {
        e.stopPropagation();
        navigator.clipboard.writeText(t);
        setCopyingToken(t);
        setTimeout(() => setCopyingToken(null), 2000);
    };

    const hasActiveFilters = searchTerm !== '' || filterEvent !== 'all' || filterStatus !== 'all';

    const resetFilters = () => {
        setSearchTerm('');
        setFilterEvent('all');
        setFilterStatus('all');
    };

    return (
        <div className="space-y-6 pb-12">
            {/* Standard SaaS Page Header */}
            <PageHeader
                title="Registrations & Passes"
                subtitle="Manage registered participants, view digital pass credentials, and export attendee rosters."
                breadcrumbs={[
                    { label: 'Admin', to: '/admin' },
                    { label: 'Registrations' }
                ]}
                actions={
                    <div className="flex flex-wrap items-center gap-2.5">
                        {registrations.length > 0 && (
                            <button 
                                onClick={handleClearAll}
                                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold transition-colors"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                Clear All
                            </button>
                        )}
                        <button 
                            onClick={fetchRegistrations}
                            disabled={loading}
                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.08] text-xs font-semibold transition-colors disabled:opacity-50"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                        <button 
                            onClick={exportToCSV}
                            disabled={filteredData.length === 0}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold transition-colors shadow-sm shadow-blue-500/20"
                        >
                            <Download className="w-3.5 h-3.5" />
                            Export CSV ({filteredData.length})
                        </button>
                    </div>
                }
            />

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl bg-[#111319] border border-white/[0.06] flex items-center justify-between">
                    <div>
                        <p className="text-xs text-slate-400 font-medium">Total Registered</p>
                        <p className="text-xl font-bold text-white mt-1">{stats.total}</p>
                    </div>
                    <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                        <Users className="w-4 h-4" />
                    </div>
                </div>

                <div className="p-4 rounded-xl bg-[#111319] border border-white/[0.06] flex items-center justify-between">
                    <div>
                        <p className="text-xs text-slate-400 font-medium">Checked In</p>
                        <p className="text-xl font-bold text-emerald-400 mt-1">{stats.attended}</p>
                    </div>
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <UserCheck className="w-4 h-4" />
                    </div>
                </div>

                <div className="p-4 rounded-xl bg-[#111319] border border-white/[0.06] flex items-center justify-between">
                    <div>
                        <p className="text-xs text-slate-400 font-medium">Pending Entry</p>
                        <p className="text-xl font-bold text-amber-400 mt-1">{stats.pending}</p>
                    </div>
                    <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                        <Clock className="w-4 h-4" />
                    </div>
                </div>

                <div className="p-4 rounded-xl bg-[#111319] border border-white/[0.06] flex items-center justify-between">
                    <div>
                        <p className="text-xs text-slate-400 font-medium">Turnout Rate</p>
                        <p className="text-xl font-bold text-indigo-400 mt-1">{stats.rate}%</p>
                    </div>
                    <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <Ticket className="w-4 h-4" />
                    </div>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-3 bg-[#111319] border border-white/[0.06] rounded-xl flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input 
                        type="text" 
                        placeholder="Search by participant name, email, or ticket token..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#0d0f14] border border-white/[0.08] rounded-lg py-2 pl-9 pr-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    {/* Event Filter */}
                    <div className="relative min-w-[170px]">
                        <select 
                            value={filterEvent}
                            onChange={(e) => setFilterEvent(e.target.value)}
                            className="w-full bg-[#0d0f14] border border-white/[0.08] rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer"
                        >
                            <option value="all">All Events</option>
                            {uniqueEvents.filter(e => e !== 'all').map(event => (
                                <option key={event} value={event}>{event}</option>
                            ))}
                        </select>
                        <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                    </div>

                    {/* Status Filter */}
                    <select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-[#0d0f14] border border-white/[0.08] rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer"
                    >
                        <option value="all">All Statuses</option>
                        <option value="attended">Checked In</option>
                        <option value="pending">Pending</option>
                    </select>

                    {hasActiveFilters && (
                        <button
                            onClick={resetFilters}
                            className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white text-xs transition-colors"
                            title="Reset filters"
                        >
                            <X className="w-3.5 h-3.5" />
                            <span>Reset</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Registrations Table */}
            <div className="bg-[#111319] border border-white/[0.06] rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                                <th className="px-5 py-3.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Participant</th>
                                <th className="px-5 py-3.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Event</th>
                                <th className="px-5 py-3.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Ticket Token</th>
                                <th className="px-5 py-3.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Registered Date</th>
                                <th className="px-5 py-3.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-5 py-3.5 text-right text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Pass</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                            {loading ? (
                                <TableSkeleton rows={6} cols={6} />
                            ) : paginatedData.length > 0 ? (
                                paginatedData.map((reg) => {
                                    const isAttended = reg.is_used || reg.status === 'ATTENDED';
                                    const initial = (reg.user_name?.[0] || 'U').toUpperCase();

                                    return (
                                        <tr 
                                            key={reg.id || reg.token}
                                            onClick={() => setSelectedAttendee(reg)}
                                            className="hover:bg-white/[0.02] cursor-pointer transition-colors group"
                                        >
                                            {/* Participant */}
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-semibold">
                                                        {initial}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                                                            {reg.user_name || 'Anonymous Participant'}
                                                        </p>
                                                        <p className="text-[11px] text-slate-400 truncate">
                                                            {reg.user_email || 'No email provided'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Event */}
                                            <td className="px-5 py-3.5">
                                                <span className="text-xs font-medium text-slate-200">
                                                    {reg.event_details?.title || 'Unknown Event'}
                                                </span>
                                            </td>

                                            {/* Ticket Token */}
                                            <td className="px-5 py-3.5">
                                                <button 
                                                    type="button"
                                                    onClick={(e) => handleCopyToken(e, reg.token)}
                                                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] text-[11px] font-mono text-slate-300 hover:text-white transition-colors"
                                                    title="Click to copy token"
                                                >
                                                    {copyingToken === reg.token ? (
                                                        <>
                                                            <Check className="w-3 h-3 text-emerald-400" />
                                                            <span className="text-emerald-400 text-[10px]">Copied</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy className="w-3 h-3 text-slate-400" />
                                                            <span>{reg.token ? `${reg.token.slice(0, 6)}...${reg.token.slice(-4)}` : 'N/A'}</span>
                                                        </>
                                                    )}
                                                </button>
                                            </td>

                                            {/* Registered Date */}
                                            <td className="px-5 py-3.5">
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-slate-300">
                                                        {reg.timestamp ? new Date(reg.timestamp).toLocaleDateString(undefined, {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        }) : '—'}
                                                    </span>
                                                    <span className="text-[10px] text-slate-500">
                                                        {reg.timestamp ? new Date(reg.timestamp).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        }) : ''}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="px-5 py-3.5">
                                                <StatusBadge 
                                                    status={isAttended ? 'success' : 'neutral'}
                                                    label={isAttended ? 'Checked In' : 'Registered'}
                                                />
                                            </td>

                                            {/* Action / View */}
                                            <td className="px-5 py-3.5 text-right">
                                                <button 
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedAttendee(reg);
                                                    }}
                                                    className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                                                    title="View attendee pass details"
                                                >
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} className="p-0">
                                        <EmptyState
                                            icon={Users}
                                            title={hasActiveFilters ? "No matching registrations" : "No registrations found"}
                                            description={
                                                hasActiveFilters 
                                                    ? "Try adjusting your search term or filters to find what you're looking for."
                                                    : "Participants who sign up for your events will show up in this directory."
                                            }
                                            actionLabel={hasActiveFilters ? "Clear Filters" : undefined}
                                            onAction={hasActiveFilters ? resetFilters : undefined}
                                        />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer / Summary & Pagination */}
                {!loading && filteredData.length > 0 && (
                    <div className="px-5 py-3 border-t border-white/[0.06] bg-white/[0.01] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
                        <div>
                            Showing <strong className="text-white">{(currentPage - 1) * pageSize + 1}</strong> to <strong className="text-white">{Math.min(currentPage * pageSize, filteredData.length)}</strong> of <strong className="text-white">{filteredData.length}</strong> participants
                            {filteredData.length !== registrations.length && (
                                <span className="text-slate-500 ml-1"> (filtered from {registrations.length})</span>
                            )}
                        </div>
                        {totalPages > 1 && (
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    className="px-2.5 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed text-xs font-medium text-slate-300 hover:text-white transition-colors"
                                >
                                    Previous
                                </button>
                                <span className="px-2 font-mono text-[11px] text-slate-400">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    type="button"
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    className="px-2.5 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed text-xs font-medium text-slate-300 hover:text-white transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Slide-over Attendee Pass Drawer */}
            <AttendeeDrawer 
                isOpen={Boolean(selectedAttendee)}
                onClose={() => setSelectedAttendee(null)}
                attendee={selectedAttendee}
            />
        </div>
    );
};

export default AdminRegistrations;
