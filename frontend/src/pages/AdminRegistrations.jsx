import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
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
    Calendar,
    ArrowRight,
    ArrowLeft
} from 'lucide-react';

const AdminRegistrations = () => {
    const { token } = useAuth();
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterEvent, setFilterEvent] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    const API_URL = import.meta.env.VITE_API_URL;

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
        <div className="space-y-6 pb-12">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-widest uppercase flex items-center gap-3">
                         <Users className="text-primary w-6 h-6" />
                         Record_Archives
                    </h1>
                    <p className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.3em] mt-1">Intelligence Database & Personnel Logistics</p>
                </div>
                <button 
                    onClick={fetchRegistrations}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all group"
                >
                    <Download className={`w-4 h-4 ${loading ? 'animate-spin text-primary' : 'group-hover:scale-110'}`} />
                </button>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-4 flex-1 w-full">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input 
                            type="text" 
                            placeholder="Search agents, emails, tokens..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/30"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                         <Filter className="w-4 h-4 text-gray-500" />
                         <select 
                            value={filterEvent}
                            onChange={(e) => setFilterEvent(e.target.value)}
                            className="bg-white/5 border border-white/5 rounded-xl py-2 px-4 text-sm focus:outline-none appearance-none cursor-pointer hover:bg-white/10"
                        >
                            {uniqueEvents.map(event => (
                                <option key={event} value={event} className="bg-[#0A0A0B]">{event === 'all' ? 'All Operations' : event}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <button 
                    onClick={exportToCSV}
                    className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl hover:bg-primary/20 transition-all font-bold text-sm uppercase tracking-wider"
                >
                    <Download className="w-4 h-4" />
                    Export CSV
                </button>
            </div>

            {/* Table Container */}
            <div className="bg-[#0A0A0B] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-white/5">
                                <th className="px-6 py-4 text-[10px] font-mono font-black text-gray-500 uppercase tracking-widest">Registrant</th>
                                <th className="px-6 py-4 text-[10px] font-mono font-black text-gray-500 uppercase tracking-widest">Operation</th>
                                <th className="px-6 py-4 text-[10px] font-mono font-black text-gray-500 uppercase tracking-widest">Access Key</th>
                                <th className="px-6 py-4 text-[10px] font-mono font-black text-gray-500 uppercase tracking-widest">Timestamp</th>
                                <th className="px-6 py-4 text-[10px] font-mono font-black text-gray-500 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-mono font-black text-gray-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                [1,2,3].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="6" className="px-6 py-4 h-16 bg-white/[0.01]"></td>
                                    </tr>
                                ))
                            ) : filteredData.length > 0 ? (
                                filteredData.map((reg) => (
                                    <tr key={reg.id} className="hover:bg-white/[0.01] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-primary">
                                                    <UserIcon className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm text-white group-hover:text-primary transition-colors">{reg.user_name || 'Classified'}</p>
                                                    <p className="text-[10px] text-gray-500 font-mono tracking-tight">{reg.user_email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-medium text-gray-300">{reg.event_details.title}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <code className="text-[10px] bg-primary/5 text-primary px-2 py-1 rounded border border-primary/10 font-mono">
                                                {reg.token}
                                            </code>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-[10px] text-gray-500 font-mono">
                                                <p>{new Date(reg.timestamp).toLocaleDateString()}</p>
                                                <p className="opacity-50">{new Date(reg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {reg.is_used || reg.status === 'ATTENDED' ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">
                                                    <CheckCircle size={10} />
                                                    Accessed
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase tracking-wider border border-amber-500/20">
                                                    <Clock size={10} />
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white transition-all">
                                                <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <p className="text-gray-600 font-mono text-xs uppercase tracking-widest">No Intelligence Records Found</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Simplified Pagination */}
                <div className="px-6 py-4 bg-white/[0.01] border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                        Showing {filteredData.length} records
                    </span>
                    <div className="flex gap-2">
                        <button className="p-2 rounded-lg border border-white/5 text-gray-600 hover:text-white transition-all disabled:opacity-30" disabled>
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg border border-white/5 text-gray-600 hover:text-white transition-all">
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminRegistrations;
