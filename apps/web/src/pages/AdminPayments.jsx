import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CreditCard,
    CheckCircle,
    XCircle,
    Clock,
    Search,
    Download,
    ExternalLink,
    Zap,
    SearchX,
    Filter,
    ChevronRight,
    Loader2,
    Calendar,
    User
} from 'lucide-react';

const AdminPayments = () => {
    const { token } = useAuth();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

    useEffect(() => {
        fetchPayments();
    }, [token]);

    const fetchPayments = async () => {
        if (!token) return;

        setLoading(true);
        try {
            // We'll add this endpoint to the backend next
            const response = await axios.get(`${API_URL}/operations/payments/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPayments(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching payments:', error);
            setPayments([]);
            setLoading(false);
        }
    };

    const filteredData = payments.filter(pay => {
        const matchesSearch =
            pay.razorpay_order_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pay.razorpay_payment_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pay.user_email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || pay.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const exportToCSV = () => {
        const headers = ['Order ID', 'Payment ID', 'User Email', 'Event', 'Amount', 'Status', 'Date'];
        const csvData = filteredData.map(pay => [
            pay.razorpay_order_id,
            pay.razorpay_payment_id,
            pay.user_email,
            pay.event_title,
            pay.amount,
            pay.status,
            new Date(pay.created_at).toLocaleString()
        ]);
        const csvContent = [headers, ...csvData].map(e => e.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `payments_${new Date().toLocaleDateString()}.csv`;
        link.click();
    };

    return (
        <div className="space-y-12">
            {/* Tactical Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-px w-12 bg-blue-500" />
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Financial Matrix</span>
                    </div>
                    <div>
                        <h1 className="text-6xl font-black text-white/5 uppercase tracking-tighter absolute -mt-4 pointer-events-none select-none">Credit Ledger</h1>
                        <h1 className="text-3xl font-black text-white uppercase tracking-wider relative z-10">Razorpay Transactions</h1>
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-2 max-w-md leading-relaxed">
                            Monitoring resource token flow across <span className="text-blue-500">{filteredData.length}</span> verified nodes.
                        </p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={fetchPayments}
                        className="px-6 py-3 bg-white/[0.02] border border-white/10 text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/[0.05] hover:border-blue-500/30 transition-all flex items-center gap-2"
                    >
                        <Zap className="w-4 h-4 text-blue-500" />
                        Sync Ledger
                    </button>
                    <button
                        onClick={exportToCSV}
                        className="relative group overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-blue-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                        <div className="relative px-6 py-3 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl flex items-center gap-2 group-active:scale-95 transition-transform">
                            <Download className="w-4 h-4" />
                            Financial Dump
                        </div>
                    </button>
                </div>
            </div>

            {/* Tactical Utility Bar */}
            <div className="relative group p-1.5 bg-white/[0.01] border border-white/[0.03] rounded-[2.5rem] backdrop-blur-3xl">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-1.5">
                    <div className="md:col-span-9 relative group/input">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within/input:text-blue-500 transition-colors z-10" />
                        <input
                            type="text"
                            placeholder="SEARCH TRANSACTION ID, ORDER ID, OR PAYER EMAIL..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black/40 border border-white/[0.03] rounded-[2rem] py-4 pl-14 pr-6 text-[11px] font-black tracking-widest text-slate-300 placeholder:text-slate-700 focus:outline-none focus:border-blue-500/30 focus:bg-white/[0.02] transition-all"
                        />
                    </div>
                    <div className="md:col-span-3">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full bg-black/40 border border-white/[0.03] rounded-[2rem] py-4 px-8 text-[11px] font-black tracking-widest text-slate-300 focus:outline-none focus:border-blue-500/30 appearance-none cursor-pointer uppercase"
                        >
                            <option value="all">Status: All</option>
                            <option value="SUCCESS">Success</option>
                            <option value="PENDING">Pending</option>
                            <option value="FAILED">Failed</option>
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
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Credit Origin</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Transaction ID</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Amount</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Verification</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Timestamp</th>
                                <th className="px-8 py-6 text-right text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02]">
                            {loading ? (
                                Array.from({ length: 6 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="6" className="px-8 py-6"><div className="h-12 bg-white/[0.02] rounded-2xl w-full" /></td>
                                    </tr>
                                ))
                            ) : filteredData.length > 0 ? (
                                filteredData.map((pay, idx) => (
                                    <motion.tr
                                        key={idx}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.01 }}
                                        className="group/row hover:bg-white/[0.02] transition-colors"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-11 h-11 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-center justify-center text-blue-500 group-hover/row:scale-110 transition-transform">
                                                    <User size={18} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[12px] font-black text-slate-200 uppercase tracking-tight">{pay.user_email}</span>
                                                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter mt-1">{pay.event_title}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-1">
                                                <p className="text-[11px] font-black text-slate-400 font-mono tracking-widest">{pay.razorpay_order_id}</p>
                                                <p className="text-[9px] font-bold text-slate-700 font-mono">{pay.razorpay_payment_id || '---'}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-white font-black text-lg">
                                            ₹{pay.amount}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest ${pay.status === 'SUCCESS' ? 'text-emerald-500 bg-emerald-500/5 border-emerald-500/20' :
                                                    pay.status === 'FAILED' ? 'text-rose-500 bg-rose-500/5 border-rose-500/20' :
                                                        'text-amber-500 bg-amber-500/5 border-amber-500/20'
                                                }`}>
                                                {pay.status === 'SUCCESS' ? <CheckCircle size={14} /> :
                                                    pay.status === 'FAILED' ? <XCircle size={14} /> :
                                                        <Clock size={14} />}
                                                {pay.status}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                            {new Date(pay.created_at).toLocaleString()}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-3 bg-white/[0.03] border border-white/5 rounded-xl text-slate-500 hover:text-white hover:border-white/20 transition-all">
                                                <ExternalLink size={16} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-8 py-24 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-20">
                                            <SearchX className="w-16 h-16 text-slate-600" />
                                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Ledger_Empty: No Credits Detected</div>
                                        </div>
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

export default AdminPayments;
