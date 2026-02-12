import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
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
    Calendar,
    ChevronRight,
    SearchX,
    Cpu,
    Shield,
    Globe,
    Zap,
    X,
    Phone,
    Building2,
    Info,
    Check,
    AlertCircle,
    CreditCard
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

const AdminRegistrations = () => {
    const { token } = useAuth();
    const toast = useToast();
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterEvent, setFilterEvent] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedRegistration, setSelectedRegistration] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

    useEffect(() => {
        fetchRegistrations();
    }, [token]);

    const fetchRegistrations = async () => {
        if (!token) return;

        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/operations/registrations/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRegistrations(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching registrations:', error);
            setRegistrations([]);
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        setUpdatingStatus(id);
        try {
            await axios.patch(`${API_URL}/operations/registrations/${id}/`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(`Node status updated to ${newStatus}`);
            fetchRegistrations();
        } catch (error) {
            toast.error("Status synchronization failed.");
        } finally {
            setUpdatingStatus(null);
        }
    };

    const filteredData = registrations.filter(reg => {
        const matchesSearch =
            reg.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.token?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.team_name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesEvent = filterEvent === 'all' || reg.event_details.title === filterEvent;
        const matchesStatus = filterStatus === 'all' || reg.status === filterStatus;
        return matchesSearch && matchesEvent && matchesStatus;
    });

    const uniqueEvents = ['all', ...new Set(registrations.map(r => r.event_details.title))];

    const exportToCSV = () => {
        const headers = ['Name', 'Email', 'Phone', 'College', 'Event', 'Team Name', 'Date', 'Status'];
        const csvData = filteredData.map(reg => [
            reg.user_name,
            reg.user_email,
            reg.user_phone,
            reg.user_college,
            reg.event_details.title,
            reg.team_name || 'N/A',
            new Date(reg.timestamp).toLocaleString(),
            reg.status
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
            {/* Tactical Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-px w-12 bg-blue-500" />
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Node Access Registry</span>
                    </div>
                    <div>
                        <h1 className="text-6xl font-black text-white/5 uppercase tracking-tighter absolute -mt-4 pointer-events-none select-none">Personnel Archive</h1>
                        <h1 className="text-3xl font-black text-white uppercase tracking-wider relative z-10">Live Registrations</h1>
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-2 max-w-md leading-relaxed">
                            Total synchronized nodes: <span className="text-blue-500">{filteredData.length}</span>
                        </p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={fetchRegistrations}
                        className="px-6 py-3 bg-white/[0.02] border border-white/10 text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/[0.05] hover:border-blue-500/30 transition-all flex items-center gap-2"
                    >
                        <Zap className="w-4 h-4 text-blue-500" />
                        Sync Data
                    </button>
                    <button
                        onClick={exportToCSV}
                        className="relative group overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-blue-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                        <div className="relative px-6 py-3 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl flex items-center gap-2 group-active:scale-95 transition-transform">
                            <Download className="w-4 h-4" />
                            Dump CSV
                        </div>
                    </button>
                </div>
            </div>

            {/* Tactical Utility Bar */}
            <div className="relative group p-1.5 bg-white/[0.01] border border-white/[0.03] rounded-[2.5rem] backdrop-blur-3xl">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-1.5">
                    <div className="md:col-span-6 relative group/input">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within/input:text-blue-500 transition-colors z-10" />
                        <input
                            type="text"
                            placeholder="SEARCH NODE IDENTIFIER (NAME, EMAIL, TOKEN, TEAM)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black/40 border border-white/[0.03] rounded-[2rem] py-4 pl-14 pr-6 text-[11px] font-black tracking-widest text-slate-300 placeholder:text-slate-700 focus:outline-none focus:border-blue-500/30 focus:bg-white/[0.02] transition-all"
                        />
                    </div>
                    <div className="md:col-span-3">
                        <select
                            value={filterEvent}
                            onChange={(e) => setFilterEvent(e.target.value)}
                            className="w-full bg-black/40 border border-white/[0.03] rounded-[2rem] py-4 px-8 text-[11px] font-black tracking-widest text-slate-300 focus:outline-none focus:border-blue-500/30 appearance-none cursor-pointer uppercase"
                        >
                            <option value="all">Protocol: All</option>
                            {uniqueEvents.filter(e => e !== 'all').map(event => (
                                <option key={event} value={event}>{event}</option>
                            ))}
                        </select>
                    </div>
                    <div className="md:col-span-3">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full bg-black/40 border border-white/[0.03] rounded-[2rem] py-4 px-8 text-[11px] font-black tracking-widest text-slate-300 focus:outline-none focus:border-blue-500/30 appearance-none cursor-pointer uppercase"
                        >
                            <option value="all">Status: All</option>
                            <option value="REGISTERED">Verified</option>
                            <option value="ATTENDED">Accessed</option>
                            <option value="PENDING">Pending</option>
                            <option value="CANCELLED">Denied</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Tactical Table */}
            <div className="relative group">
                <div className="absolute inset-0 bg-white/[0.01] border border-white/[0.04] rounded-[2.5rem] backdrop-blur-3xl overflow-hidden" />
                <div className="relative overflow-x-auto custom-scrollbar">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-white/[0.04]">
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Authorized Node</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Registry Protocol</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Squad Identity</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Integrity</th>
                                <th className="px-8 py-6 text-right text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Ops</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02]">
                            {loading ? (
                                Array.from({ length: 6 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="5" className="px-8 py-6"><div className="h-12 bg-white/[0.02] rounded-2xl w-full" /></td>
                                    </tr>
                                ))
                            ) : filteredData.length > 0 ? (
                                filteredData.map((reg, idx) => (
                                    <motion.tr
                                        key={reg.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.01 }}
                                        className="group/row hover:bg-white/[0.02] transition-colors"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-11 h-11 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-[13px] font-black text-blue-500 group-hover/row:border-blue-500/30 transition-all">
                                                    {reg.user_name?.[0]?.toUpperCase() || 'U'}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[13px] font-black text-slate-200 uppercase tracking-tight">{reg.user_name || 'Anonymous'}</span>
                                                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter mt-1">{reg.user_email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-[12px] font-black text-slate-400 uppercase tracking-widest">{reg.event_details.title}</span>
                                                <span className="text-[9px] font-bold text-slate-600 uppercase mt-1">LVL: {reg.event_details.category}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{reg.team_name || 'LONE_NODE'}</span>
                                                <span className="text-[9px] font-bold text-slate-600 uppercase mt-1">Hash: {reg.token.substring(0, 8)}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest ${reg.status === 'ATTENDED' ? 'text-emerald-500 bg-emerald-500/5 border-emerald-500/20' :
                                                    reg.status === 'REGISTERED' ? 'text-blue-500 bg-blue-500/5 border-blue-500/20' :
                                                        'text-amber-500 bg-amber-500/5 border-amber-500/20'
                                                }`}>
                                                {reg.status === 'ATTENDED' ? <CheckCircle size={14} /> :
                                                    reg.status === 'REGISTERED' ? <Zap size={14} /> :
                                                        <Clock size={14} />}
                                                {reg.status}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2 text-right">
                                                {reg.status === 'REGISTERED' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(reg.id, 'ATTENDED')}
                                                        disabled={updatingStatus === reg.id}
                                                        className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50"
                                                    >
                                                        {updatingStatus === reg.id ? 'SYNCING...' : 'ADMIT'}
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => setSelectedRegistration(reg)}
                                                    className="p-3 bg-white/[0.03] border border-white/5 rounded-xl text-slate-500 hover:text-white hover:border-white/20 transition-all"
                                                >
                                                    <Info size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-24 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-20">
                                            <SearchX className="w-16 h-16 text-slate-600" />
                                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Query_Null: No Nodes Found</div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Registration Details Modal */}
            <AnimatePresence>
                {selectedRegistration && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedRegistration(null)}
                            className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-[150]"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-[#080808] border border-white/10 rounded-[2.5rem] shadow-2xl z-[151] overflow-hidden"
                        >
                            <div className="p-10 space-y-10">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-500">
                                            <Shield size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Personnel Intel</h3>
                                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">Registry ID: {selectedRegistration.id}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedRegistration(null)} className="w-12 h-12 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-slate-600 hover:text-white transition-all">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="space-y-1.5">
                                            <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em] ml-1">Full Identity</p>
                                            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-[13px] font-black text-white uppercase tracking-tight">
                                                {selectedRegistration.user_name}
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em] ml-1">Tactical Contact</p>
                                            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-3">
                                                <Phone className="w-4 h-4 text-blue-500" />
                                                <span className="text-[13px] font-black text-slate-300 uppercase tracking-tight">{selectedRegistration.user_phone || 'UNAVAILABLE'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="space-y-1.5">
                                            <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em] ml-1">Origin Institution</p>
                                            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-3">
                                                <Building2 className="w-4 h-4 text-emerald-500" />
                                                <span className="text-[13px] font-black text-slate-300 uppercase tracking-tight truncate">{selectedRegistration.user_college || 'N/A'}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em] ml-1">Assigned Protocol</p>
                                            <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex items-center gap-3">
                                                <Calendar className="w-4 h-4 text-blue-500" />
                                                <span className="text-[13px] font-black text-white uppercase tracking-tight truncate font-space">{selectedRegistration.event_details.title}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {selectedRegistration.team_name && (
                                        <div className="col-span-2 space-y-3">
                                            <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em] ml-1">Squad Members</p>
                                            <div className="p-6 bg-white/[0.01] border border-white/5 rounded-3xl space-y-3">
                                                <p className="text-[11px] font-black text-blue-500 uppercase tracking-[0.2em] mb-4">TEAM: {selectedRegistration.team_name}</p>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {Array.isArray(selectedRegistration.team_members) ? (
                                                        selectedRegistration.team_members.map((m, i) => (
                                                            <div key={i} className="px-4 py-2.5 bg-white/[0.03] border border-white/5 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                                {m}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className="text-[10px] font-bold text-slate-600 uppercase italic">Raw Data Stream: {selectedRegistration.team_members}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {selectedRegistration.payment_details && (
                                        <div className="col-span-2 p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
                                                    <CreditCard size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-emerald-500/80 uppercase tracking-widest">Transaction Verified</p>
                                                    <p className="text-[13px] font-black text-white uppercase tracking-tight">Order: {selectedRegistration.payment_details.razorpay_order_id}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[14px] font-black text-white tracking-widest">₹{selectedRegistration.payment_details.amount}</p>
                                                <p className="text-[9px] font-bold text-slate-600 uppercase mt-1">Status: {selectedRegistration.payment_details.status}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        onClick={() => setSelectedRegistration(null)}
                                        className="flex-1 py-4 bg-white/[0.02] border border-white/5 rounded-[1.5rem] text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-white transition-all"
                                    >
                                        Close Intel
                                    </button>
                                    {selectedRegistration.status === 'REGISTERED' && (
                                        <button
                                            onClick={() => {
                                                handleStatusUpdate(selectedRegistration.id, 'ATTENDED');
                                                setSelectedRegistration(null);
                                            }}
                                            className="flex-[2] py-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-[1.5rem] hover:bg-blue-700 transition-all flex items-center justify-center gap-3"
                                        >
                                            <Check size={16} />
                                            Authorize Entry
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminRegistrations;
