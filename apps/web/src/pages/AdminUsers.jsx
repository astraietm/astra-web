import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
    Users,
    Search,
    Download,
    User as UserIcon,
    Mail,
    Phone,
    Building2,
    Shield,
    Clock,
    Zap,
    Filter,
    ChevronRight,
    SearchX,
    Loader2
} from 'lucide-react';

const AdminUsers = () => {
    const { token } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

    useEffect(() => {
        fetchUsers();
    }, [token]);

    const fetchUsers = async () => {
        if (!token) {
            console.error('No auth token available for users');
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            console.log('Fetching users from:', `${API_URL}/auth/admin-users/`);
            console.log('Token present:', !!token);

            const response = await axios.get(`${API_URL}/auth/admin-users/`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log('Users fetched successfully:', response.data.length);
            setUsers(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error.response?.status, error.response?.data || error.message);
            setUsers([]);
            setLoading(false);
        }
    };

    const filteredData = users.filter(user => {
        const matchesSearch =
            user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.college?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const exportToCSV = () => {
        const headers = ['Name', 'Email', 'Phone', 'College', 'USN', 'Role', 'Joined Date'];
        const csvData = filteredData.map(user => [
            user.full_name,
            user.email,
            user.phone_number || '',
            user.college || '',
            user.usn || '',
            user.role,
            new Date(user.date_joined).toLocaleString()
        ]);
        const csvContent = [headers, ...csvData].map(e => e.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `users_${new Date().toLocaleDateString()}.csv`;
        link.click();
    };

    const roleColors = {
        'ADMIN': 'text-red-500 bg-red-500/5 border-red-500/20',
        'ORGANIZER': 'text-purple-500 bg-purple-500/5 border-purple-500/20',
        'USER': 'text-blue-500 bg-blue-500/5 border-blue-500/20'
    };

    return (
        <div className="space-y-12">
            {/* Tactical Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-px w-12 bg-blue-500" />
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">User Database</span>
                    </div>
                    <div>
                        <h1 className="text-6xl font-black text-white/5 uppercase tracking-tighter absolute -mt-4 pointer-events-none select-none">Identity Matrix</h1>
                        <h1 className="text-3xl font-black text-white uppercase tracking-wider relative z-10">Users & Access</h1>
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-2 max-w-md leading-relaxed">
                            Total authorized personnel: <span className="text-blue-500">{filteredData.length}</span>
                        </p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={fetchUsers}
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
                    {/* Search Component */}
                    <div className="md:col-span-9 relative group/input">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within/input:text-blue-500 transition-colors z-10" />
                        <input
                            type="text"
                            placeholder="SEARCH USER IDENTIFIER (NAME, EMAIL, PHONE, COLLEGE)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black/40 border border-white/[0.03] rounded-[2rem] py-4 pl-14 pr-6 text-[11px] font-black tracking-widest text-slate-300 placeholder:text-slate-700 focus:outline-none focus:border-blue-500/30 focus:bg-white/[0.02] transition-all"
                        />
                    </div>
                    {/* Role Filter */}
                    <div className="md:col-span-3">
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="w-full bg-black/40 border border-white/[0.03] rounded-[2rem] py-4 px-8 text-[11px] font-black tracking-widest text-slate-300 focus:outline-none focus:border-blue-500/30 appearance-none cursor-pointer uppercase"
                        >
                            <option value="all">Clearance: All</option>
                            <option value="ADMIN">Admin</option>
                            <option value="ORGANIZER">Organizer</option>
                            <option value="USER">User</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Tactical Grid/Table */}
            <div className="relative group">
                <div className="absolute inset-0 bg-white/[0.01] border border-white/[0.04] rounded-[2.5rem] backdrop-blur-3xl overflow-hidden" />
                <div className="relative overflow-x-auto custom-scrollbar">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-white/[0.04]">
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Identity</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Contact Vector</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Institution</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Clearance</th>
                                <th className="px-8 py-6 text-left text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Sync Date</th>
                                <th className="px-8 py-6 text-right text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Ops</th>
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
                                filteredData.map((user, idx) => (
                                    <motion.tr
                                        key={user.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.01 }}
                                        className="group/row hover:bg-white/[0.02] transition-colors"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                {user.avatar ? (
                                                    <img
                                                        src={user.avatar}
                                                        alt={user.full_name}
                                                        className="w-11 h-11 rounded-2xl border border-white/5 group-hover/row:border-blue-500/30 transition-all"
                                                    />
                                                ) : (
                                                    <div className="w-11 h-11 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-[13px] font-black text-blue-500 group-hover/row:border-blue-500/30 transition-all">
                                                        {user.full_name?.[0]?.toUpperCase() || 'U'}
                                                    </div>
                                                )}
                                                <div className="flex flex-col">
                                                    <span className="text-[13px] font-black text-slate-200 uppercase tracking-tight">{user.full_name || 'Unknown'}</span>
                                                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter mt-1">{user.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1">
                                                {user.phone_number && (
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="w-3 h-3 text-slate-600" />
                                                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-tight">{user.phone_number}</span>
                                                    </div>
                                                )}
                                                {user.usn && (
                                                    <span className="text-[9px] font-bold text-slate-600 uppercase">USN: {user.usn}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <Building2 className="w-3.5 h-3.5 text-slate-600" />
                                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-tight">{user.college || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest ${roleColors[user.role] || roleColors['USER']}`}>
                                                <Shield className="w-3.5 h-3.5" />
                                                {user.role}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-tighter">{new Date(user.date_joined).toLocaleDateString()}</span>
                                                <span className="text-[10px] font-bold text-slate-600 uppercase mt-1 tracking-widest">{new Date(user.date_joined).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-3 bg-white/[0.03] border border-white/5 rounded-xl text-slate-500 hover:text-white hover:border-white/20 transition-all active:scale-95">
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-8 py-24 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-20">
                                            <SearchX className="w-16 h-16 text-slate-600 stroke-1" />
                                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Query_Null: No Users Found</div>
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

export default AdminUsers;
