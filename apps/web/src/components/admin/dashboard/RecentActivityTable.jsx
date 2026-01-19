import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Terminal, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const StatusBadge = ({ isUsed, status }) => {
    // If it's used, it's definitely checked in/attended
    if (isUsed || status === 'ATTENDED') {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                <CheckCircle size={10} />
                ATTENDED
            </span>
        );
    }
    
    // Default registered
    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock size={10} />
            PENDING
        </span>
    );
};

const UserAvatar = ({ name }) => {
    const initials = name 
        ? name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() 
        : '??';
        
    const colors = [
        'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-cyan-500'
    ];
    // Simple hash for consistent color
    const colorIndex = initials.charCodeAt(0) % colors.length;
    
    return (
        <div className={`w-8 h-8 rounded-lg ${colors[colorIndex]} text-white flex items-center justify-center text-xs font-bold shadow-lg`}>
            {initials}
        </div>
    );
};

const RecentActivityTable = ({ registrations, isLoading }) => {
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <div className="bg-vision-card backdrop-blur-2xl border border-white/5 rounded-[20px] p-6 h-[300px] animate-pulse">
                <div className="flex justify-between mb-6">
                     <div className="h-6 w-32 bg-white/10 rounded" />
                     <div className="h-8 w-8 bg-white/10 rounded" />
                </div>
                <div className="space-y-4">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="h-12 w-full bg-white/5 rounded-lg" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-vision-card backdrop-blur-2xl border border-white/5 rounded-[20px] p-6 flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-white font-bold text-lg font-orbitron tracking-wide">Live Feed</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="relative w-2 h-2">
                             <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping"></span>
                             <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </div>
                        <p className="text-gray-400 text-xs text-mono uppercase"><span className="text-white font-bold">{registrations.length}</span> recent registrations</p>
                    </div>
                </div>
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2.5 text-vision-primary bg-vision-primary/10 border border-vision-primary/20 rounded-xl hover:bg-vision-primary hover:text-white transition-all shadow-[0_0_15px_rgba(6,182,212,0.1)] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                    onClick={() => navigate('/admin/registrations')}
                    title="View All Records"
                >
                    <Terminal size={18} />
                </motion.button>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto flex-1 no-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr>
                            <th className="text-[10px] text-gray-500 uppercase font-bold py-3 pl-4 border-b border-white/5 font-mono tracking-wider">User</th>
                            <th className="text-[10px] text-gray-500 uppercase font-bold py-3 border-b border-white/5 font-mono tracking-wider">Event Protocol</th>
                            <th className="text-[10px] text-gray-500 uppercase font-bold py-3 border-b border-white/5 text-center font-mono tracking-wider">Status</th>
                            <th className="text-[10px] text-gray-500 uppercase font-bold py-3 border-b border-white/5 text-right pr-4 font-mono tracking-wider">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {registrations.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center py-12">
                                    <div className="flex flex-col items-center gap-3">
                                        <AlertCircle className="w-8 h-8 text-gray-600" />
                                        <p className="text-gray-500 text-sm font-medium">No recent activity on the network.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            registrations.map((reg, i) => (
                                <motion.tr 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    key={i} 
                                    className="group hover:bg-white/[0.03] transition-colors border-b border-white/[0.02] last:border-0"
                                >
                                    <td className="py-4 pl-4">
                                        <div className="flex items-center gap-3">
                                            <UserAvatar name={reg.user_details?.full_name} />
                                            <div className="flex flex-col">
                                                 <span className="text-white text-sm font-bold group-hover:text-vision-primary transition-colors cursor-pointer">{reg.user_details?.full_name || "Unknown Agent"}</span>
                                                 <span className="text-gray-500 text-[10px] font-mono">{reg.user_details?.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-vision-secondary/50"></div>
                                            <span className="text-gray-300 font-medium text-xs font-mono">{reg.event_details?.title || "Unknown protocol"}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 text-center">
                                        <StatusBadge isUsed={reg.is_used} status={reg.status} />
                                    </td>
                                    <td className="py-4 pr-4 text-right">
                                        <span className="text-gray-500 text-[10px] font-mono whitespace-nowrap">
                                            {new Date(reg.registration_date).toLocaleDateString(undefined, { month: '2-digit', day: '2-digit' })}
                                            <span className="mx-1 opacity-50">|</span>
                                            {new Date(reg.registration_date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false })}
                                        </span>
                                    </td>
                                </motion.tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentActivityTable;
