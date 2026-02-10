import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
    Users,
    CheckCircle,
    Clock,
    Search,
    Download,
    ChevronRight,
    SearchX,
    Filter,
    RefreshCw,
    Trash2
} from 'lucide-react';

const AdminRegistrations = () => {
    const { token } = useAuth();
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterEvent, setFilterEvent] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [copyingToken, setCopyingToken] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

    useEffect(() => {
        fetchRegistrations();
    }, [token]);

    const fetchRegistrations = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/admin-registrations/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRegistrations(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching registrations:', error);
            setLoading(false);
        }
    };

    const handleClearAll = async () => {
        if (!window.confirm("ARE YOU SURE? This will DELETE ALL REGISTRATIONS from the database. This action cannot be undone.")) return;

        setLoading(true);
        try {
            await axios.delete(`${API_URL}/admin-registrations/clear/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRegistrations([]);
            setLoading(false);
        } catch (error) {
            console.error('Error clearing registrations:', error);
            setLoading(false);
        }
    };

    const filteredData = registrations.filter(reg => {
        const matchesSearch =
            reg.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.token?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesEvent = filterEvent === 'all' || reg.event_details.title === filterEvent;
        const isAccessed = reg.is_used || reg.status === 'ATTENDED';
        const matchesStatus =
            filterStatus === 'all' ||
            (filterStatus === 'accessed' && isAccessed) ||
            (filterStatus === 'pending' && !isAccessed);
        return matchesSearch && matchesEvent && matchesStatus;
    });

    const uniqueEvents = ['all', ...new Set(registrations.map(r => r.event_details.title))];

    const exportToCSV = () => {
        const headers = ['Name', 'Email', 'Event', 'Registration Date', 'Token', 'Status'];
        const csvData = filteredData.map(reg => [
            reg.user_name,
            reg.user_email,
            reg.event_details.title,
            new Date(reg.timestamp).toLocaleString(),
            reg.token,
            (reg.is_used || reg.status === 'ATTENDED') ? 'Attended' : 'Registered'
        ]);
        const csvContent = [headers, ...csvData].map(e => e.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `registrations_${new Date().toLocaleDateString()}.csv`;
        link.click();
    };

    const handleCopyToken = (t) => {
        navigator.clipboard.writeText(t);
        setCopyingToken(t);
        setTimeout(() => setCopyingToken(null), 2000);
    };

    return (
        <div className="space-y-10 pb-10">
            {/* Context Header */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-px w-8 bg-blue-500/40" />
                        <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.5em]">Inventory_Audit</span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-white uppercase tracking-[0.1em]">Security_Registry</h1>
                        <p className="text-[11px] text-slate-500 mt-2 font-mono uppercase tracking-tight">
                            Total_Records_Loaded: <span className="text-blue-500">{registrations.length}</span> // Filtered_View: <span className="text-white">{filteredData.length}</span>
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={handleClearAll}
                        className="px-5 py-2.5 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-500/20 transition-all flex items-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" />
                        PURGE_ALL
                    </button>
                    <button
                        onClick={fetchRegistrations}
                        className="px-5 py-2.5 bg-white/[0.02] border border-white/[0.05] text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/[0.05] hover:text-white transition-all flex items-center gap-2"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        SYNC_REGISTRY
                    </button>
                    <button
                        onClick={exportToCSV}
                        className="px-5 py-2.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2 hover:bg-blue-500 transition-all shadow-[0_8px_20px_rgba(37,99,235,0.3)]"
                    >
                        <Download className="w-4 h-4" />
                        EXTRACT_CSV
                    </button>
                </div>
            </div>

            {/* Tactical Control Bar */}
            <div className="p-2 bg-white/[0.01] border border-white/[0.03] rounded-3xl backdrop-blur-3xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/[0.02] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 relative z-10">
                    <div className="md:col-span-6 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                        <input
                            type="text"
                            placeholder="SEARCH_BY_IDENTITY_OR_TOKEN..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/[0.01] border border-white/[0.03] rounded-2xl py-3.5 pl-11 pr-4 text-xs font-bold text-white placeholder:text-slate-800 focus:outline-none focus:bg-white/[0.03] focus:border-white/[0.08] transition-all uppercase tracking-widest"
                        />
                    </div>
                    <div className="md:col-span-3 relative">
                        <select
                            value={filterEvent}
                            onChange={(e) => setFilterEvent(e.target.value)}
                            className="w-full bg-white/[0.01] border border-white/[0.03] rounded-2xl py-3.5 px-4 text-xs font-bold text-slate-500 focus:outline-none focus:bg-white/[0.03] appearance-none cursor-pointer uppercase tracking-widest"
                        >
                            <option value="all">EVENT_ALL</option>
                            {uniqueEvents.filter(e => e !== 'all').map(event => (
                                <option key={event} value={event}>{event}</option>
                            ))}
                        </select>
                    </div>
                    <div className="md:col-span-3 relative">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full bg-white/[0.01] border border-white/[0.03] rounded-2xl py-3.5 px-4 text-xs font-bold text-slate-500 focus:outline-none focus:bg-white/[0.03] appearance-none cursor-pointer uppercase tracking-widest"
                        >
                            <option value="all">STATUS_ALL</option>
                            <option value="accessed">STATE_VERIFIED</option>
                            <option value="pending">STATE_PENDING</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Matrix Data Grid */}
            <div className="border border-white/[0.03] rounded-[2.5rem] overflow-hidden bg-white/[0.01] backdrop-blur-sm relative">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/[0.03] bg-white/[0.01]">
                                <th className="px-8 py-6 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Identity_Node</th>
                                <th className="px-8 py-6 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Operational_Node</th>
                                <th className="px-8 py-6 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Security_Token</th>
                                <th className="px-8 py-6 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Registry_Timestamp</th>
                                <th className="px-8 py-6 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Validation_State</th>
                                <th className="px-8 py-6 text-right text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Utilities</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02]">
                            {loading ? (
                                Array.from({ length: 8 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="6" className="px-8 py-7"><div className="h-3 bg-white/[0.02] rounded-full w-full" /></td>
                                    </tr>
                                ))
                            ) : filteredData.length > 0 ? (
                                filteredData.map((reg, idx) => (
                                    <motion.tr
                                        key={reg.id}
                                        initial={{ opacity: 0, x: -4 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.02 }}
                                        className="hover:bg-white/[0.02] transition-all duration-300 group"
                                    >
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-xs font-black text-blue-500 group-hover:bg-blue-600/10 group-hover:border-blue-500/30 transition-all duration-500">
                                                    {reg.user_name?.[0]?.toUpperCase() || 'U'}
                                                </div>
                                                <div className="min-w-0 space-y-1">
                                                    <p className="text-[11px] font-black text-white uppercase tracking-tight leading-none">{reg.user_name || 'UNSPECIFIED_NODE'}</p>
                                                    <p className="text-[9px] text-slate-500 font-mono lower-case opacity-60 truncate leading-none">{reg.user_email}</p>

                                                    {reg.team_name && (
                                                        <div className="mt-3 space-y-2">
                                                            <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-md bg-blue-500/5 border border-blue-500/10">
                                                                <Users size={8} className="text-blue-500" />
                                                                <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">{reg.team_name}</span>
                                                            </div>
                                                            {reg.team_members && (
                                                                <div className="flex flex-wrap gap-1.5 pl-1">
                                                                    {(typeof reg.team_members === 'string' ? reg.team_members.split(',') : reg.team_members).map((member, i) => (
                                                                        <span key={i} className="text-[7px] font-black text-slate-600 bg-white/[0.02] px-1.5 py-0.5 rounded border border-white/[0.03] uppercase tracking-tighter">
                                                                            {member.trim()}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{reg.event_details.title}</span>
                                                <span className="text-[8px] font-black text-blue-500/40 uppercase tracking-[0.2em] mt-1">NODE_ASSIGNED</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <button
                                                onClick={() => handleCopyToken(reg.token)}
                                                className="group/token relative flex flex-col items-start cursor-pointer transition-opacity active:opacity-60"
                                            >
                                                <code className="text-[10px] font-mono text-slate-500 group-hover/token:text-blue-400 transition-colors">
                                                    {reg.token.substring(0, 8)}...{reg.token.substring(reg.token.length - 4)}
                                                </code>
                                                <span className="text-[7px] font-black text-slate-800 uppercase tracking-widest mt-0.5 group-hover/token:text-blue-500/40 transition-colors">
                                                    {copyingToken === reg.token ? 'COPIED_TO_CLIPBOARD' : 'CLICK_TO_CLONE'}
                                                </span>
                                            </button>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col">
                                                <p className="text-[10px] font-mono text-slate-400 font-black">{new Date(reg.timestamp).toLocaleDateString([], { year: 'numeric', month: 'short', day: '2-digit' })}</p>
                                                <p className="text-[9px] font-mono text-slate-700 uppercase">{new Date(reg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}_UTC</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            {reg.is_used || reg.status === 'ATTENDED' ? (
                                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/[0.03] border border-emerald-500/10 shadow-[inner_0_0_10px_rgba(16,185,129,0.02)]">
                                                    <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                    <span className="text-[9px] font-black text-emerald-500/80 uppercase tracking-widest">VERIFIED</span>
                                                </div>
                                            ) : (
                                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/[0.03] border border-amber-500/10">
                                                    <div className="w-1 h-1 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)] animate-pulse" />
                                                    <span className="text-[9px] font-black text-amber-500/80 uppercase tracking-widest">PENDING</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button className="p-2.5 bg-white/[0.02] border border-white/[0.05] rounded-xl text-slate-700 hover:text-white hover:bg-white/[0.05] hover:border-white/10 transition-all">
                                                <ChevronRight size={14} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-8 py-32 text-center">
                                        <div className="flex flex-col items-center gap-6 opacity-20">
                                            <SearchX className="w-16 h-16 text-slate-500" />
                                            <div className="space-y-1">
                                                <p className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Grid_Search_Null</p>
                                                <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">No spectral signatures match your query parameters</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminRegistrations;
