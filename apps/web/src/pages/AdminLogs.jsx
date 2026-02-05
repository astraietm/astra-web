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
    Key,
    Database,
    Clock,
    Terminal,
    Target,
    Zap,
    Cpu,
    SearchX,
    Loader2
} from 'lucide-react';

const LogRow = ({ type, message, user, ip, time, index }) => (
    <motion.tr 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.01 }}
        className="hover:bg-white/[0.01] transition-colors group border-b border-white/[0.03] last:border-0"
    >
        <td className="py-6 px-8">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] border
                ${type === 'ERROR' ? 'bg-rose-500/5 text-rose-500 border-rose-500/10' : 
                  type === 'WARN' ? 'bg-amber-500/5 text-amber-500 border-amber-500/10' : 
                  type === 'SUCCESS' ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/10' : 
                  'bg-blue-500/5 text-blue-500 border-blue-500/10'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${
                     type === 'ERROR' ? 'bg-rose-500' : 
                     type === 'WARN' ? 'bg-amber-500' : 
                     type === 'SUCCESS' ? 'bg-emerald-500' : 
                     'bg-blue-500'
                }`} />
                {type}
            </div>
        </td>
        <td className="py-6 px-8">
            <span className="text-[11px] font-black text-slate-300 uppercase tracking-tight group-hover:text-white transition-colors">
                {message}
            </span>
        </td>
        <td className="py-6 px-8">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center text-[10px] font-black text-slate-500 group-hover:text-blue-500 transition-colors">
                    {user?.[0]?.toUpperCase() || 'S'}
                </div>
                <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest truncate max-w-[150px]">
                    {user || 'SYST_ROOT'}
                </span>
            </div>
        </td>
        <td className="py-6 px-8">
            <code className="text-[10px] font-mono text-slate-600 bg-white/[0.01] px-3 py-1.5 rounded-lg border border-white/[0.03]">
                {ip || '0.0.0.0'}
            </code>
        </td>
        <td className="py-6 px-8 text-right font-mono">
            <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{new Date(time).toLocaleDateString()}</span>
                <span className="text-[9px] text-slate-800 tracking-widest">{new Date(time).toLocaleTimeString()}</span>
            </div>
        </td>
    </motion.tr>
);

const AdminLogs = () => {
    const { token } = useAuth();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    
    const [searchTerm, setSearchTerm] = useState('');
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, [token]);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/operations/logs/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLogs(response.data);
        } catch (error) {
            console.error("Failed to fetch logs", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredLogs = logs.filter(log => 
        (log.action || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
        (log.user_email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.level || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-12 pb-20">
            {/* Header */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10 relative">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-px w-8 bg-blue-500/40" />
                        <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.5em]">Security_Audit</span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-white uppercase tracking-[0.1em]">System_Activity_Logs</h1>
                        <p className="text-[11px] text-slate-500 mt-2 font-mono uppercase tracking-tight">
                            Total_Events: <span className="text-blue-500">{logs.length}</span> // Filtered: <span className="text-white">{filteredLogs.length}</span>
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 w-full xl:w-auto">
                    <div className="relative group flex-1 xl:flex-none xl:min-w-[400px]">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700 group-focus-within:text-blue-500 transition-colors z-10" />
                        <input
                            type="text"
                            placeholder="SCAN_AUDIT_TRAIL..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-14 w-full bg-white/[0.01] border border-white/[0.05] rounded-[1.25rem] pl-14 pr-6 text-xs font-black text-white placeholder:text-slate-800 focus:outline-none focus:bg-white/[0.03] focus:border-white/[0.1] transition-all uppercase tracking-widest"
                        />
                    </div>
                    <button
                        onClick={fetchLogs}
                        className="h-14 px-8 bg-white/[0.02] border border-white/[0.05] text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] rounded-[1.25rem] flex items-center gap-3 hover:bg-white/[0.05] hover:text-white transition-all"
                    >
                        <RotateCcw size={16} />
                        REFRESH
                    </button>
                    <button className="h-14 px-8 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-[1.25rem] flex items-center gap-3 hover:bg-blue-500 transition-all shadow-[0_12px_24px_rgba(37,99,235,0.3)] hover:-translate-y-0.5">
                        <Download size={16} />
                        EXPORT_LOGS
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {[
                    { label: 'Total_Operations', val: logs.length, icon: Activity, color: 'blue' },
                    { label: 'Security_Nodes', val: logs.filter(l => l.level === 'SUCCESS').length, icon: Shield, color: 'emerald' },
                    { label: 'Alert_Nodes', val: logs.filter(l => l.level === 'ERROR').length, icon: AlertTriangle, color: 'rose' },
                    { label: 'Active_Sectors', val: '04', icon: Cpu, color: 'indigo' }
                ].map((stat, i) => (
                    <div key={i} className="p-8 rounded-[2rem] bg-white/[0.01] border border-white/[0.03] flex items-center gap-6 hover:bg-white/[0.02] hover:border-white/10 transition-all group relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700" />
                         <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-500/5 border border-${stat.color}-500/10 flex items-center justify-center text-${stat.color}-500`}>
                            <stat.icon size={20} />
                         </div>
                         <div className="flex flex-col">
                            <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em]">{stat.label}</span>
                            <span className="text-3xl font-black text-white mt-1 tabular-nums tracking-tighter">{stat.val}</span>
                         </div>
                    </div>
                ))}
            </div>

            {/* Logs Table */}
            <div className="relative bg-white/[0.01] border border-white/[0.03] rounded-[2.5rem] overflow-hidden flex flex-col min-h-[600px]">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-600/[0.01] to-transparent pointer-events-none" />
                
                <div className="flex-1 overflow-x-auto custom-scrollbar relative z-10">
                    <table className="w-full border-collapse text-left">
                        <thead className="sticky top-0 bg-[#030303] z-20 border-b border-white/[0.03]">
                            <tr>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-700 uppercase tracking-[0.3em]">SEC_LEVEL</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-700 uppercase tracking-[0.3em]">OPERATION_MESSAGE</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-700 uppercase tracking-[0.3em]">USER_IDENTITY</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-700 uppercase tracking-[0.3em]">SRC_ENDPOINT</th>
                                <th className="px-8 py-6 text-right text-[10px] font-black text-slate-700 uppercase tracking-[0.3em]">TIMESTAMP</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {loading ? (
                                Array.from({ length: 8 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="5" className="px-8 py-6">
                                            <div className="h-8 bg-white/[0.02] border border-white/[0.05] rounded-xl w-full" />
                                        </td>
                                    </tr>
                                ))
                            ) : filteredLogs.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-40 text-center">
                                         <div className="flex flex-col items-center gap-8 opacity-20">
                                            <SearchX size={60} strokeWidth={1} />
                                            <div className="space-y-2 text-center">
                                                <p className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Zero_Log_Entries</p>
                                                <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">No matching activities recorded in this sector</p>
                                            </div>
                                         </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredLogs.map((log, i) => (
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
                <div className="p-8 border-t border-white/[0.03] bg-black/40 flex justify-between items-center relative z-10 backdrop-blur-xl">
                    <span className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em]">
                         STREAMING_RESULTS: <span className="text-blue-500">{filteredLogs.length}</span> / {logs.length} UNIT_NODES
                    </span>
                    <div className="flex items-center gap-4">
                        <button className="px-6 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-white hover:bg-white/[0.05] transition-all disabled:opacity-30">PREV_SECTOR</button>
                        <button className="px-6 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-white hover:bg-white/[0.05] transition-all disabled:opacity-30">NEXT_SECTOR</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogs;
