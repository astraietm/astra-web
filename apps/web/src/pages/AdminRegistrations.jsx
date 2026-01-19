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
        <div className="space-y-6 pb-12 font-inter">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                     <h1 className="text-3xl font-bold text-white tracking-tight">Registrations</h1>
                     <p className="text-slate-400 font-medium mt-1">Manage event participants and access logs.</p>
                </div>
                <div className="flex gap-3">
                    <button 
                         onClick={fetchRegistrations} 
                         className="h-10 px-4 rounded-lg bg-[#0f172a] border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-2 text-sm font-medium"
                    >
                         <div className={loading ? "animate-spin" : ""}>
                             <Clock size={16} />
                         </div>
                         Refresh
                    </button>
                    <button 
                        onClick={exportToCSV}
                        className="h-10 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center gap-2 text-sm font-bold shadow-lg shadow-indigo-900/20"
                    >
                        <Download size={16} />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="p-4 rounded-xl bg-[#0f172a] border border-slate-800 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                        type="text" 
                        placeholder="Search by name, email, or token..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                     <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <select 
                            value={filterEvent}
                            onChange={(e) => setFilterEvent(e.target.value)}
                            className="bg-slate-900/50 border border-slate-700 rounded-lg py-2.5 pl-10 pr-8 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer w-full md:w-48"
                        >
                            <option value="all">All Events</option>
                            {uniqueEvents.filter(e => e !== 'all').map(event => (
                                <option key={event} value={event}>{event}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-[#0f172a] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900/50 border-b border-slate-800">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Registrant</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Event</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Token</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {loading ? (
                                [1,2,3].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="6" className="px-6 py-4 h-16 bg-slate-800/10"></td>
                                    </tr>
                                ))
                            ) : filteredData.length > 0 ? (
                                filteredData.map((reg) => (
                                    <tr key={reg.id} className="hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-700 shrink-0">
                                                    {reg.team_name ? <Users size={16} /> : <UserIcon size={16} />}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm text-white group-hover:text-indigo-400 transition-colors">{reg.user_name || 'Anonymous'}</p>
                                                    <p className="text-xs text-slate-500">{reg.user_email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="max-w-[150px] truncate">
                                                 <span className="text-sm text-slate-300">{reg.event_details.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="inline-flex items-center px-2 py-1 rounded bg-slate-800 border border-slate-700 text-xs font-mono text-indigo-400">
                                                {reg.token}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs text-slate-400">
                                                <p className="text-slate-300">{new Date(reg.timestamp).toLocaleDateString()}</p>
                                                <p className="text-slate-600">{new Date(reg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {reg.is_used || reg.status === 'ATTENDED' ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                                                    <CheckCircle size={12} />
                                                    Attended
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium border border-amber-500/20">
                                                    <Clock size={12} />
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-white transition-colors">
                                                <ArrowRight size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-500">
                                            <Search size={32} className="mb-3 opacity-50" />
                                            <p className="text-sm font-medium">No registrations found</p>
                                            <p className="text-xs mt-1">Try adjusting your filters</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Simplified) */}
                <div className="px-6 py-4 bg-slate-900/30 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">
                        Showing {filteredData.length} records
                    </span>
                    <div className="flex gap-2">
                        <button className="p-2 rounded-lg border border-slate-800 text-slate-500 hover:border-slate-700 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                            <ArrowLeft size={16} />
                        </button>
                        <button className="p-2 rounded-lg border border-slate-800 text-slate-500 hover:border-slate-700 hover:text-white transition-all">
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminRegistrations;
