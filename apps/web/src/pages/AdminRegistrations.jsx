import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, 
    CheckCircle, 
    Clock, 
    Search, 
    Filter, 
    Download, 
    User as UserIcon,
    ArrowUpDown,
    MoreVertical,
    Mail,
    Calendar,
    ChevronRight,
    SearchX,
    Cpu,
    Shield,
    Globe,
    Zap
} from 'lucide-react';

const AdminRegistrations = () => {
    const { token } = useAuth();
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterEvent, setFilterEvent] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

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
            (reg.is_used || reg.status === 'ATTENDED') ? 'Attended' : 'Pending'
        ]);
        const csvContent = [headers, ...csvData].map(e => e.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `registrations_${new Date().toLocaleDateString()}.csv`;
        link.click();
    };

    return (
        <div className="space-y-12">
            {/* Tactical Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-px w-12 bg-blue-500" />
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Node Access Registry</span>
                    </div>
                    <div>
                        <h1 className="text-6xl font-black text-white/5 uppercase tracking-tighter absolute -mt-4 pointer-events-none select-none">Personnel Archive</h1>
                        <h1 className="text-3xl font-black text-white uppercase tracking-wider relative z-10">Live Registrations</h1>
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-2 max-w-md leading-relaxed">
                            Total nodes synchronized: <span className="text-blue-500">{filteredData.length}</span>
                        </p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={fetchRegistrations}
                        className="px-6 py-3 bg-white/[0.02] border border-white/10 text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/[0.05] hover:border-blue-500/30 transition-all flex items-center gap-2"
                    >
                        <Zap className="w-4 h-4 text-blue-500" />
                        Sync Data
                    </button>
                    <button 
                        onClick={exportToCSV}
                        className="relative group overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-blue-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                        <div className="relative px-6 py-3 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl flex items-center gap-2 group-active:scale-95 transition-transform">
                            <Download className="w-4 h-4" />
                            Dump CSV
                        </div>
                    </button>
                </div>
            </div>

            {/* Tactical Utility Bar */}
            <div className="relative group p-1.5 bg-white/[0.01] border border-white/[0.03] rounded-[2.5rem] backdrop-blur-3xl">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-1.5">
                    {/* Search Component */}
                    <div className="md:col-span-6 relative group/input">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within/input:text-blue-500 transition-colors z-10" />
                        <input 
                            type="text" 
                            placeholder="SEARCH NODE IDENTIFIER (NAME, EMAIL, TOKEN)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black/40 border border-white/[0.03] rounded-[2rem] py-4 pl-14 pr-6 text-[11px] font-black tracking-widest text-slate-300 placeholder:text-slate-700 focus:outline-none focus:border-blue-500/30 focus:bg-white/[0.02] transition-all"
                        />
                    </div>
                    {/* Event Filter */}
                    <div className="md:col-span-3">
                        <select 
                            value={filterEvent}
                            onChange={(e) => setFilterEvent(e.target.value)}
                            className="w-full bg-black/40 border border-white/[0.03] rounded-[2rem] py-4 px-8 text-[11px] font-black tracking-widest text-slate-300 focus:outline-none focus:border-blue-500/30 appearance-none cursor-pointer uppercase"
                        >
                            <option value="all">Protocol: All</option>
                            {uniqueEvents.filter(e => e !== 'all').map(event => (
                                <option key={event} value={event}>{event}</option>
                            ))}
                        </select>
                    </div>
                    {/* Status Filter */}
                    <div className="md:col-span-3">
                        <select 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full bg-black/40 border border-white/[0.03] rounded-[2rem] py-4 px-8 text-[11px] font-black tracking-widest text-slate-300 focus:outline-none focus:border-blue-500/30 appearance-none cursor-pointer uppercase"
                        >
                            <option value="all">Access: Status All</option>
                            <option value="accessed">Status: Authorized</option>
                            <option value="pending">Status: Intercepted</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Tactical Grid/Table */}
            <div className="relative group">
                <div className="absolute inset-0 bg-white/[0.01] border border-white/[0.04] rounded-[2.5rem] backdrop-blur-3xl overflow-hidden" />
                <div className="relative overflow-x-auto custom-scrollbar">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-white/[0.04]">
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Authorized Node</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Registry Protocol</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Access Hash</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Sync Timestamp</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Integrity</th>
                                <th className="px-8 py-6 text-right text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Ops</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02]">
                            {loading ? (
                                Array.from({ length: 6 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="6" className="px-8 py-6"><div className="h-12 bg-white/[0.02] rounded-2xl w-full" /></td>
                                    </tr>
                                ))
                            ) : filteredData.length > 0 ? (
                                filteredData.map((reg, idx) => (
                                    <motion.tr 
                                        key={reg.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.01 }}
                                        className="group/row hover:bg-white/[0.02] transition-colors"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-11 h-11 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-[13px] font-black text-blue-500 group-hover/row:border-blue-500/30 transition-all">
                                                    {reg.user_name?.[0]?.toUpperCase() || 'U'}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[13px] font-black text-slate-200 uppercase tracking-tight">{reg.user_name || 'ROOT@ADMIN'}</span>
                                                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter mt-1">{reg.user_email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-[12px] font-black text-slate-400 uppercase tracking-widest">{reg.event_details.title}</span>
                                                <span className="text-[9px] font-bold text-slate-600 uppercase mt-1">Classification: Level_03</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 font-mono text-[10px] text-slate-500">
                                            <span className="bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/5 group-hover/row:text-blue-400 transition-colors uppercase tracking-widest">
                                                {reg.token.substring(0, 16)}...
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-tighter">{new Date(reg.timestamp).toLocaleDateString()}</span>
                                                <span className="text-[10px] font-bold text-slate-600 uppercase mt-1 tracking-widest">{new Date(reg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            {reg.is_used || reg.status === 'ATTENDED' ? (
                                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                                                    <CheckCircle className="w-3.5 h-3.5" />
                                                    Handshake Verified
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    Sync Pending
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-3 bg-white/[0.03] border border-white/5 rounded-xl text-slate-500 hover:text-white hover:border-white/20 transition-all active:scale-95">
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-8 py-24 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-20">
                                            <SearchX className="w-16 h-16 text-slate-600 stroke-1" />
                                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Query_Null: No Nodes Found</div>
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
