import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
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
    Calendar
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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Registrations</h1>
                    <p className="text-sm text-slate-500 mt-1">{filteredData.length} total registrations</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={fetchRegistrations}
                        className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        Refresh
                    </button>
                    <button 
                        onClick={exportToCSV}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search by name, email, or token..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400"
                        />
                    </div>
                    <select 
                        value={filterEvent}
                        onChange={(e) => setFilterEvent(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Events</option>
                        {uniqueEvents.filter(e => e !== 'all').map(event => (
                            <option key={event} value={event}>{event}</option>
                        ))}
                    </select>
                    <select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Status</option>
                        <option value="accessed">Attended</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    Participant
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    Event
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    Token
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <div className="flex items-center justify-center">
                                            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredData.length > 0 ? (
                                filteredData.map((reg, idx) => (
                                    <motion.tr 
                                        key={reg.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: idx * 0.02 }}
                                        className="hover:bg-slate-50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm shrink-0">
                                                    {reg.user_name?.[0]?.toUpperCase() || 'U'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900">{reg.user_name || 'Anonymous'}</p>
                                                    <p className="text-xs text-slate-500">{reg.user_email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-slate-900">{reg.event_details.title}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <code className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded font-mono">
                                                {reg.token.substring(0, 12)}...
                                            </code>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-slate-900">{new Date(reg.timestamp).toLocaleDateString()}</p>
                                            <p className="text-xs text-slate-500">{new Date(reg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            {reg.is_used || reg.status === 'ATTENDED' ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-200">
                                                    <CheckCircle className="w-3 h-3" />
                                                    Attended
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full border border-amber-200">
                                                    <Clock className="w-3 h-3" />
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                                <MoreVertical className="w-4 h-4 text-slate-600" />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                        <p className="text-sm text-slate-500">No registrations found</p>
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
