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
    RefreshCw
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
            (reg.is_used || reg.status === 'ATTENDED') ? 'Attended' : 'Registered'
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
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-px w-12 bg-blue-500" />
                        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em]">Administration</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white uppercase tracking-wider relative z-10">Registrations</h1>
                        <p className="text-sm text-slate-400 mt-2">
                            Total records found: <span className="text-white font-bold">{filteredData.length}</span>
                        </p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={fetchRegistrations}
                        className="px-6 py-3 bg-white/[0.05] border border-white/[0.1] text-slate-300 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-white/[0.1] transition-all flex items-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                    <button 
                        onClick={exportToCSV}
                        className="relative px-6 py-3 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 hover:bg-blue-500 transition-all shadow-lg"
                    >
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="p-2 bg-[#0a0a0a] border border-white/[0.08] rounded-2xl">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                    {/* Search */}
                    <div className="md:col-span-6 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors z-10" />
                        <input 
                            type="text" 
                            placeholder="Search by name, email, or token..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/[0.03] border border-transparent rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-white placeholder:text-slate-600 focus:outline-none focus:bg-white/[0.05] transition-all"
                        />
                    </div>
                    {/* Event Filter */}
                    <div className="md:col-span-3 relative">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 z-10" />
                        <select 
                            value={filterEvent}
                            onChange={(e) => setFilterEvent(e.target.value)}
                            className="w-full bg-white/[0.03] border border-transparent rounded-xl py-3 pl-10 pr-8 text-sm font-medium text-slate-300 focus:outline-none focus:bg-white/[0.05] appearance-none cursor-pointer"
                        >
                            <option value="all">All Events</option>
                            {uniqueEvents.filter(e => e !== 'all').map(event => (
                                <option key={event} value={event}>{event}</option>
                            ))}
                        </select>
                    </div>
                    {/* Status Filter */}
                    <div className="md:col-span-3 relative">
                         <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-500 z-10" />
                        <select 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full bg-white/[0.03] border border-transparent rounded-xl py-3 pl-10 pr-8 text-sm font-medium text-slate-300 focus:outline-none focus:bg-white/[0.05] appearance-none cursor-pointer"
                        >
                            <option value="all">All Statuses</option>
                            <option value="accessed">Attended</option>
                            <option value="pending">Registered</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="border border-white/[0.08] rounded-3xl overflow-hidden bg-[#0a0a0a]">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Participant</th>
                                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Event</th>
                                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Token Code</th>
                                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Registered At</th>
                                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.05]">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="6" className="px-6 py-8"><div className="h-4 bg-white/[0.05] rounded w-full" /></td>
                                    </tr>
                                ))
                            ) : filteredData.length > 0 ? (
                                filteredData.map((reg, idx) => (
                                    <motion.tr 
                                        key={reg.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="hover:bg-white/[0.02] transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-xs font-bold text-blue-500">
                                                    {reg.user_name?.[0]?.toUpperCase() || 'U'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white">{reg.user_name || 'N/A'}</p>
                                                    <p className="text-xs text-slate-500">{reg.user_email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-slate-300">{reg.event_details.title}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <code className="text-xs font-mono text-slate-400 bg-white/[0.05] px-2 py-1 rounded">
                                                {reg.token.substring(0, 12)}...
                                            </code>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-slate-400">{new Date(reg.timestamp).toLocaleDateString()}</p>
                                            <p className="text-xs text-slate-600">{new Date(reg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            {reg.is_used || reg.status === 'ATTENDED' ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                                    <CheckCircle size={12} />
                                                    Attended
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                                    <Clock size={12} />
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 text-slate-500 hover:text-white transition-colors">
                                                <ChevronRight size={16} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-24 text-center">
                                        <div className="flex flex-col items-center gap-3 opacity-50">
                                            <SearchX className="w-12 h-12 text-slate-600" />
                                            <p className="text-sm font-medium text-slate-500">No registrations found</p>
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
