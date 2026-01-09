import React, { useState } from 'react';
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
    const [searchTerm, setSearchTerm] = useState('');

    const logs = [
        { type: 'INFO', message: 'User login successful', user: 'admin@astra.net', ip: '192.168.1.4', time: '10:42:05 AM' },
        { type: 'SUCCESS', message: 'New Event created: Cyber Workshop', user: 'admin@astra.net', ip: '192.168.1.4', time: '10:38:12 AM' },
        { type: 'ERROR', message: 'Failed login attempt (Wrong Password)', user: 'unknown', ip: '45.32.11.89', time: '10:15:00 AM' },
        { type: 'WARN', message: 'High CPU usage detected (85%)', user: 'SYSTEM', ip: 'localhost', time: '09:55:23 AM' },
        { type: 'INFO', message: 'Daily database backup completed', user: 'SYSTEM', ip: 'localhost', time: '04:00:00 AM' },
        { type: 'SUCCESS', message: 'Email blast dispatched (1250 sent)', user: 'admin@astra.net', ip: '192.168.1.4', time: 'Yesterday' },
        { type: 'ERROR', message: 'API connection timeout: /stripe/v1', user: 'system', ip: 'localhost', time: 'Yesterday' },
        { type: 'INFO', message: 'New user registration: john.doe@mit.edu', user: 'john.doe', ip: '10.0.0.12', time: 'Yesterday' },
    ];

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
                                .filter(log => log.message.toLowerCase().includes(searchTerm.toLowerCase()) || log.user.toLowerCase().includes(searchTerm.toLowerCase()))
                                .map((log, i) => (
                                    <LogRow key={i} {...log} />
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
