import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
    Shield, 
    Search, 
    Filter, 
    Download, 
    AlertTriangle, 
    CheckCircle, 
    Info, 
    XCircle,
    RotateCcw,
    Activity,
    Users,
    Key
} from 'lucide-react';

const LogRow = ({ type, message, user, ip, time, index }) => (
    <motion.tr 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.01 }}
        className="hover:bg-white/[0.02] transition-colors group border-b border-white/[0.03] last:border-0"
    >
        <td className="py-5 px-8">
            <div className={`flex items-center gap-3 font-bold text-xs uppercase tracking-wider
                ${type === 'ERROR' ? 'text-rose-500' : 
                  type === 'WARN' ? 'text-amber-500' : 
                  type === 'SUCCESS' ? 'text-emerald-500' : 
                  'text-blue-500'}`}>
                <div className={`w-2 h-2 rounded-full ${
                     type === 'ERROR' ? 'bg-rose-500' : 
                     type === 'WARN' ? 'bg-amber-500' : 
                     type === 'SUCCESS' ? 'bg-emerald-500' : 
                     'bg-blue-500'
                }`} />
                {type}
            </div>
        </td>
        <td className="py-5 px-8">
            <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
                    {message}
                </span>
            </div>
        </td>
        <td className="py-5 px-8">
            <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center text-xs font-bold text-slate-500 group-hover:text-blue-400 transition-colors">
                    {user?.[0]?.toUpperCase() || 'S'}
                </div>
                <span className="text-xs font-medium text-slate-400 truncate max-w-[150px]">
                    {user || 'System'}
                </span>
            </div>
        </td>
        <td className="py-5 px-8">
            <code className="text-xs font-mono text-slate-500 bg-white/[0.02] px-2 py-1 rounded border border-white/5">
                {ip || '0.0.0.0'}
            </code>
        </td>
        <td className="py-5 px-8 text-right">
            <div className="flex flex-col items-end">
                <span className="text-xs font-medium text-slate-400">{new Date(time).toLocaleDateString()}</span>
                <span className="text-[10px] text-slate-600 mt-1">{new Date(time).toLocaleTimeString()}</span>
            </div>
        </td>
    </motion.tr>
);

const AdminLogs = () => {
    const { token } = useAuth();
    const API_URL = import.meta.env.VITE_API_URL;
    
    const [searchTerm, setSearchTerm] = useState('');
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, [token]);

    const fetchLogs = async () => {
        try {
            const response = await axios.get(`${API_URL}/ops/logs/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLogs(response.data);
        } catch (error) {
            console.error("Failed to fetch logs", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-px w-12 bg-blue-500" />
                        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em]">System</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white uppercase tracking-wider relative z-10">Audit Logs</h1>
                        <p className="text-sm text-slate-400 mt-2 max-w-md leading-relaxed">
                            View all system activities, security events, and user actions.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={fetchLogs}
                        className="px-6 py-3 bg-white/[0.05] border border-white/10 text-slate-300 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-white/[0.1] transition-all flex items-center gap-2"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Refresh
                    </button>
                    <button className="relative group overflow-hidden">
                        <div className="relative px-8 py-3 bg-blue-600 rounded-xl flex items-center gap-2 text-white text-xs font-bold uppercase tracking-wider shadow-lg hover:bg-blue-500 transition-all">
                            <Download size={14} />
                            Export CSV
                        </div>
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Events', val: logs.length, icon: Activity, color: 'blue' },
                    { label: 'Security Alerts', val: '0', icon: Shield, color: 'emerald' },
                    { label: 'Errors', val: '0', icon: AlertTriangle, color: 'rose' },
                    { label: 'Users Active', val: '12', icon: Users, color: 'violet' }
                ].map((stat, i) => (
                    <div key={i} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/[0.08] flex items-center gap-5 hover:border-white/[0.2] transition-all">
                         <div className={`w-12 h-12 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center text-${stat.color}-500`}>
                            <stat.icon size={24} />
                         </div>
                         <div className="flex flex-col">
                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{stat.label}</span>
                            <span className="text-2xl font-bold text-white mt-1">{stat.val}</span>
                         </div>
                    </div>
                ))}
            </div>

            {/* Logs Table Container */}
            <div className="relative bg-[#0a0a0a] border border-white/[0.08] rounded-3xl overflow-hidden min-h-[600px] flex flex-col">
                {/* Search / Filter Overlay */}
                <div className="p-6 border-b border-white/[0.08] flex items-center gap-6 relative z-10">
                    <div className="flex-1 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors z-10" />
                        <input 
                            type="text" 
                            placeholder="Search logs..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-12 w-full bg-white/[0.03] border border-white/[0.05] rounded-xl pl-10 pr-6 text-sm font-medium text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-all"
                        />
                    </div>
                    <button className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-slate-500 hover:text-white transition-all">
                        <Filter size={18} />
                    </button>
                    <div className="h-8 w-px bg-white/[0.08]" />
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                         Live
                    </div>
                </div>

                {/* Table */}
                <div className="flex-1 overflow-x-auto custom-scrollbar relative z-10">
                    <table className="w-full border-collapse text-left">
                        <thead className="sticky top-0 bg-[#0a0a0a] z-20 border-b border-white/[0.08]">
                            <tr>
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Level</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Message</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                                <th className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">IP Address</th>
                                <th className="px-8 py-5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.05]">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="5" className="px-8 py-6">
                                            <div className="h-8 bg-white/[0.05] rounded w-full" />
                                        </td>
                                    </tr>
                                ))
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-24 text-center">
                                         <div className="flex flex-col items-center gap-4 opacity-40">
                                            <Shield size={40} className="text-slate-500" />
                                            <span className="text-sm font-medium text-slate-500">No logs found</span>
                                         </div>
                                    </td>
                                </tr>
                            ) : (
                                logs
                                    .filter(log => (log.action || '').toLowerCase().includes(searchTerm.toLowerCase()) || (log.user_email || '').toLowerCase().includes(searchTerm.toLowerCase()))
                                    .map((log, i) => (
                                        <LogRow 
                                            key={i} 
                                            index={i}
                                            type={log.level}
                                            message={log.action}
                                            user={log.user_email}
                                            ip={log.ip_address}
                                            time={log.timestamp}
                                        />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/[0.08] bg-[#0a0a0a] flex justify-between items-center relative z-10">
                    <span className="text-xs font-medium text-slate-500">
                         Showing {logs.length} results
                    </span>
                    <div className="flex items-center gap-3">
                        <button className="px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.05] text-xs font-bold text-slate-400 hover:text-white transition-all disabled:opacity-50">Previous</button>
                        <button className="px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.05] text-xs font-bold text-slate-400 hover:text-white transition-all disabled:opacity-50">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogs;
