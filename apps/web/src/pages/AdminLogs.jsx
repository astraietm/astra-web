import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Shield, Search, Filter, Download, AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

const LogRow = ({ type, message, user, ip, time }) => (
    <tr className="hover:bg-white/5 transition-colors group border-b border-white/5 last:border-0 text-sm">
        <td className="py-4 px-4">
            <div className={`flex items-center gap-2 font-mono font-bold
                ${type === 'ERROR' ? 'text-rose-400' : 
                  type === 'WARN' ? 'text-amber-400' : 
                  type === 'SUCCESS' ? 'text-emerald-400' : 
                  'text-blue-400'}`}>
                {type === 'ERROR' && <XCircle size={14} />}
                {type === 'WARN' && <AlertTriangle size={14} />}
                {type === 'SUCCESS' && <CheckCircle size={14} />}
                {type === 'INFO' && <Info size={14} />}
                {type}
            </div>
        </td>
        <td className="py-4 px-4 text-gray-300 font-medium">
            {message}
        </td>
        <td className="py-4 px-4 text-gray-400 font-mono text-xs">
            {user}
        </td>
        <td className="py-4 px-4 text-gray-500 font-mono text-xs">
            {ip}
        </td>
        <td className="py-4 px-4 text-gray-500 text-xs text-right">
            {time}
        </td>
    </tr>
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
        <div className="space-y-6 max-w-7xl mx-auto h-[calc(100vh-140px)] flex flex-col">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-white flex items-center gap-3">
                        <Shield className="text-primary w-6 h-6" />
                        Security Audit Logs
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">Track and monitor all system activities</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white transition-colors">
                    <Download size={16} />
                    Export CSV
                </button>
            </div>

            <div className="bg-vision-card backdrop-blur-2xl border border-white/5 rounded-[20px] flex-1 flex flex-col overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-white/5 flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search logs..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#0B0F14] border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>
                    <button className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                        <Filter size={18} />
                    </button>
                </div>

                {/* Table */}
                <div className="flex-1 overflow-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white/5 sticky top-0 backdrop-blur-md z-10">
                            <tr>
                                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-left w-32">Level</th>
                                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-left">Message</th>
                                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-left w-48">User</th>
                                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-left w-32">IP Address</th>
                                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right w-32">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs
                                .filter(log => (log.action || '').toLowerCase().includes(searchTerm.toLowerCase()) || (log.user_email || '').toLowerCase().includes(searchTerm.toLowerCase()))
                                .map((log, i) => (
                                    <LogRow 
                                        key={i} 
                                        type={log.level}
                                        message={log.action}
                                        user={log.user_email}
                                        ip={log.ip_address}
                                        time={new Date(log.timestamp).toLocaleString()}
                                    />
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/5 flex justify-between items-center text-xs text-gray-500">
                    <span>Showing {logs.length} events</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 bg-white/5 rounded hover:bg-white/10 transition-colors">Previous</button>
                        <button className="px-3 py-1 bg-white/5 rounded hover:bg-white/10 transition-colors">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogs;
