import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
    FiUsers, 
    FiCheckCircle, 
    FiClock, 
    FiSearch, 
    FiFilter, 
    FiDownload, 
    FiArrowLeft,
    FiUser,
    FiMail,
    FiCalendar,
    FiShield
} from 'react-icons/fi';

const AdminDashboard = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterEvent, setFilterEvent] = useState('all');
    const [stats, setStats] = useState({ total: 0, attended: 0, pending: 0 });

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        if (user && !user.is_staff) {
            navigate('/');
        }
    }, [user, navigate]);

    useEffect(() => {
        fetchRegistrations();
    }, [token]);

    const fetchRegistrations = async () => {
        try {
            const response = await axios.get(`${API_URL}/admin-registrations/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRegistrations(response.data);
            calculateStats(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching registrations:', error);
            setLoading(false);
        }
    };

    const calculateStats = (data) => {
        const total = data.length;
        const attended = data.filter(r => r.is_used || r.status === 'ATTENDED').length;
        setStats({
            total,
            attended,
            pending: total - attended
        });
    };

    const filteredData = registrations.filter(reg => {
        const matchesSearch = 
            reg.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.token?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesFilter = filterEvent === 'all' || reg.event_details.title === filterEvent;
        
        return matchesSearch && matchesFilter;
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
            reg.is_used ? 'Attended' : 'Pending'
        ]);

        const csvContent = [headers, ...csvData].map(e => e.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `registrations_${new Date().toLocaleDateString()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#030712] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-white/60 font-medium font-mono animate-pulse uppercase tracking-widest text-sm">Initializing Secure Access...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#030712] text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-outfit">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <button 
                            onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-white/50 hover:text-primary transition-colors mb-4 group"
                        >
                            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-medium uppercase tracking-wider">Back to Terminal</span>
                        </button>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-white to-primary/50 bg-clip-text text-transparent flex items-center gap-3">
                            <FiShield className="text-primary" />
                            Central Intelligence
                        </h1>
                        <p className="text-white/50 mt-2 font-mono text-sm">Mission Control: Accessing Registration Database v2.4.0</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => navigate('/admin/scanner')}
                            className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-primary/50 transition-all duration-300 group"
                        >
                            <FiSearch className="text-primary group-hover:scale-110 transition-transform" />
                            <span className="font-medium uppercase tracking-wider text-sm">Launch Scanner</span>
                        </button>
                        <button 
                            onClick={exportToCSV}
                            className="flex items-center gap-2 px-6 py-3 bg-primary text-black rounded-xl hover:bg-primary-hover transition-all duration-300 font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] group"
                        >
                            <FiDownload className="group-hover:translate-y-0.5 transition-transform" />
                            <span className="uppercase tracking-wider text-sm">Export Data</span>
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                    {[
                        { label: 'Total Enlisted', value: stats.total, icon: FiUsers, color: 'primary' },
                        { label: 'Confirmed Access', value: stats.attended, icon: FiCheckCircle, color: 'green-500' },
                        { label: 'Awaiting Entrance', value: stats.pending, icon: FiClock, color: 'yellow-500' }
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white/5 border border-white/10 p-8 rounded-3xl relative overflow-hidden group hover:border-white/20 transition-all"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                                <stat.icon size={80} />
                            </div>
                            <p className="text-white/50 text-sm font-medium uppercase tracking-widest mb-1">{stat.label}</p>
                            <h3 className={`text-4xl font-bold text-${stat.color}`}>{stat.value}</h3>
                        </motion.div>
                    ))}
                </div>

                {/* Filters & Search */}
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl mb-8 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                        <input 
                            type="text" 
                            placeholder="Search by name, email, or token..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary/50 transition-all font-mono text-sm"
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <FiFilter className="text-white/30" />
                        <select 
                            value={filterEvent}
                            onChange={(e) => setFilterEvent(e.target.value)}
                            className="w-full md:w-64 bg-black/40 border border-white/5 rounded-xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-all text-sm appearance-none cursor-pointer"
                        >
                            {uniqueEvents.map(event => (
                                <option key={event} value={event} className="bg-[#030712]">{event === 'all' ? 'All Operations' : event}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/[0.02]">
                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-white/40">Registrant</th>
                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-white/40">Operation</th>
                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-white/40">Access Key</th>
                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-white/40">Timestamp</th>
                                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-white/40">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                <AnimatePresence mode='popLayout'>
                                    {filteredData.length > 0 ? (
                                        filteredData.map((reg, i) => (
                                            <motion.tr 
                                                key={reg.id}
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="hover:bg-white/[0.02] transition-colors group"
                                            >
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/10 text-primary">
                                                            <FiUser className="text-lg" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-white group-hover:text-primary transition-colors">{reg.user_name || 'Incognito Agent'}</p>
                                                            <p className="text-xs text-white/40 flex items-center gap-1 mt-0.5">
                                                                <FiMail className="scale-75" />
                                                                {reg.user_email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-primary/40 animate-pulse"></div>
                                                        <span className="text-sm font-medium text-white/80">{reg.event_details.title}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <code className="text-[10px] bg-white/5 px-2 py-1 rounded border border-white/10 text-primary font-mono select-all">
                                                        {reg.token}
                                                    </code>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <p className="text-xs text-white/50 flex items-center gap-1.5 font-mono">
                                                        <FiCalendar className="text-primary/50" />
                                                        {new Date(reg.timestamp).toLocaleDateString()}
                                                        <span className="opacity-30">|</span>
                                                        {new Date(reg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-5">
                                                    {reg.is_used || reg.status === 'ATTENDED' ? (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-widest border border-green-500/20">
                                                            <FiCheckCircle />
                                                            Accessed
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-[10px] font-bold uppercase tracking-widest border border-yellow-500/20">
                                                            <FiClock />
                                                            Pending
                                                        </span>
                                                    )}
                                                </td>
                                            </motion.tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-20 text-center">
                                                <FiUsers className="mx-auto text-4xl text-white/10 mb-4" />
                                                <p className="text-white/30 font-mono uppercase tracking-[0.2em] text-sm italic">No records found matching criteria</p>
                                            </td>
                                        </tr>
                                    )}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer Insight */}
                <div className="mt-8 flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">
                    <p>Encryption: AES-256-GCM</p>
                    <p>Total Records Processed: {registrations.length}</p>
                    <p>System State: Nominal</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
