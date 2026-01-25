import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
    Users, 
    CheckCircle, 
    Clock, 
    Search, 
    Filter, 
    Download, 
    User as UserIcon,
    Mail,
    ArrowRight,
    ArrowLeft,
    ChevronDown
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
        <div className="space-y-10 pb-20 font-inter">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-px bg-blue-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">Data Hub</span>
                    </div>
                    <h1 className="text-5xl font-black text-white tracking-tighter leading-none">REGISTRATIONS</h1>
                    <p className="text-slate-500 text-sm font-medium">Monitoring personnel records across active Astra nodes.</p>
                </div>

                <div className="flex gap-4">
                    <button 
                         onClick={fetchRegistrations} 
                         className="h-14 px-8 rounded-2xl bg-white/[0.03] border border-white/5 text-slate-300 hover:text-white hover:bg-white/[0.05] hover:border-white/10 transition-all flex items-center gap-3 text-[10px] font-black uppercase tracking-widest"
                    >
                         <div className={loading ? "animate-spin" : ""}>
                             <Clock size={16} />
                         </div>
                         Refresh
                    </button>
                    <button 
                        onClick={exportToCSV}
                        className="h-14 px-8 rounded-2xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-[0_0_30px_rgba(37,99,235,0.3)] flex items-center gap-3"
                    >
                        <Download size={16} />
                        Export Data
                    </button>
                </div>
            </div>

            {/* Tactical Filter Bar */}
            <div className="p-4 rounded-[2rem] bg-[#050505]/60 backdrop-blur-xl border border-white/5 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search by identity, comms, or token..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/20 focus:bg-white/[0.04] transition-all"
                    />
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                     <div className="relative group flex-1 md:flex-initial">
                        <Filter className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                        <select 
                            value={filterEvent}
                            onChange={(e) => setFilterEvent(e.target.value)}
                            className="bg-white/[0.02] border border-white/5 rounded-2xl py-4 pl-14 pr-12 text-sm font-bold text-slate-400 focus:outline-none focus:border-blue-500/20 focus:bg-white/[0.04] appearance-none cursor-pointer w-full md:w-56 transition-all"
                        >
                            <option value="all">All Event Nodes</option>
                            {uniqueEvents.filter(e => e !== 'all').map(event => (
                                <option key={event} value={event}>{event}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none group-focus-within:rotate-180 transition-transform" />
                    </div>
                </div>
            </div>

            {/* Tactical Table Container */}
            <div className="bg-[#050505]/60 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden relative overflow-x-auto shadow-2xl">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/5">
                            <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Authorized Personnel</th>
                            <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Sector / Event</th>
                            <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Access Key</th>
                            <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Timestamp</th>
                            <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Status</th>
                            <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] text-right">Ops</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.02]">
                        {loading ? (
                            [1,2,3,4,5].map(i => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan="6" className="px-10 py-8">
                                        <div className="h-6 bg-white/[0.02] rounded-full w-3/4 mx-auto" />
                                    </td>
                                </tr>
                            ))
                        ) : filteredData.length > 0 ? (
                            filteredData.map((reg, idx) => (
                                <motion.tr 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.03 }}
                                    key={reg.id} 
                                    className="hover:bg-blue-600/[0.02] transition-colors group relative"
                                >
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-slate-500 group-hover:text-blue-500 group-hover:border-blue-500/30 transition-all shrink-0">
                                                {reg.team_name ? <Users size={20} /> : <UserIcon size={20} />}
                                            </div>
                                            <div>
                                                <p className="font-black text-white text-base group-hover:text-blue-400 transition-colors uppercase tracking-tight">{reg.user_name || 'Anonymous'}</p>
                                                <p className="text-[11px] font-bold text-slate-600 uppercase tracking-widest leading-none mt-1">{reg.user_email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-sm">
                                        <span className="text-white font-bold group-hover:text-blue-200 transition-colors">{reg.event_details.title}</span>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="inline-flex items-center px-4 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[11px] font-black text-blue-500 tracking-widest font-mono">
                                            {reg.token.substring(0, 12)}...
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="space-y-1">
                                            <p className="text-xs font-black text-white uppercase">{new Date(reg.timestamp).toLocaleDateString()}</p>
                                            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{new Date(reg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        {reg.is_used || reg.status === 'ATTENDED' ? (
                                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                                                <CheckCircle size={12} strokeWidth={3} />
                                                Verified
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-widest border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                                                <Clock size={12} strokeWidth={3} />
                                                In-Transit
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <button className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-slate-600 hover:text-white hover:border-blue-500/40 hover:bg-blue-600/10 transition-all">
                                            <ArrowRight size={18} />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-10 py-24 text-center">
                                    <div className="flex flex-col items-center justify-center">
                                        <Search size={48} className="text-slate-800 mb-6" />
                                        <p className="text-xl font-black text-slate-500 uppercase tracking-widest">No matching nodes found</p>
                                        <p className="text-sm font-bold text-slate-700 mt-2 uppercase tracking-[0.2em]">Adjust system parameters to filter results</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Tactical Footer / Pagination */}
                <div className="px-10 py-6 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
                        System Records Synchronized: {filteredData.length} entries
                    </span>
                    <div className="flex gap-3">
                        <button className="w-10 h-10 rounded-xl border border-white/5 text-slate-700 hover:border-white/10 hover:text-white transition-all disabled:opacity-20 flex items-center justify-center" disabled>
                            <ArrowLeft size={16} />
                        </button>
                        <button className="w-10 h-10 rounded-xl border border-white/5 text-slate-700 hover:border-white/20 hover:text-white transition-all flex items-center justify-center">
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminRegistrations;
