import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Settings, 
    Save, 
    Lock, 
    Globe, 
    Bell, 
    Server, 
    Database, 
    Users, 
    Mail, 
    Trash2, 
    Shield, 
    Activity,
    Cpu,
    Zap,
    Terminal,
    Target,
    RotateCcw,
    ShieldCheck,
    Cloud,
    Power,
    Command
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Toggle = ({ enabled, onChange }) => (
    <button 
        onClick={() => onChange(!enabled)}
        className={`w-14 h-8 flex items-center rounded-2xl p-1.5 transition-all duration-500 relative ${enabled ? 'bg-blue-600/20 border-blue-500/40' : 'bg-white/[0.02] border-white/[0.1]'} border-2`}
    >
        <motion.div 
            animate={{ 
                x: enabled ? 24 : 0,
                backgroundColor: enabled ? '#3b82f6' : '#334155',
                scale: enabled ? 1.1 : 1
            }}
            className={`w-4 h-4 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]`}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
        />
    </button>
);

const SettingSection = ({ icon: Icon, title, sub, children }) => (
    <div className="bg-white/[0.01] border border-white/[0.03] rounded-[2.5rem] p-10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-600/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        
        <div className="flex items-center gap-6 mb-12 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500/10 transition-all">
                <Icon size={22} />
            </div>
            <div className="flex flex-col gap-1">
                <h3 className="text-xl font-black text-white uppercase tracking-tight">{title}</h3>
                <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em]">{sub}</p>
            </div>
        </div>

        <div className="space-y-10 relative z-10">
            {children}
        </div>
    </div>
);

const SettingItem = ({ label, description, rightElement }) => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 group/item">
        <div className="space-y-2 pr-6 flex-1">
            <h4 className="text-[11px] font-black text-slate-300 uppercase tracking-widest group-hover/item:text-white transition-colors">{label}</h4>
            <p className="text-[10px] font-medium text-slate-500 leading-relaxed max-w-lg uppercase tracking-tight">{description}</p>
        </div>
        <div className="shrink-0">
            {rightElement}
        </div>
    </div>
);

const AdminSettings = () => {
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

    const [settings, setSettings] = useState({
        registrationOpen: true,
        maintenanceMode: false,
        emailNotifications: true,
        publicProfile: true,
        twoFactor: true,
        darkMode: true
    });
    
    // Team Management State
    const [teamMembers, setTeamMembers] = useState([]);
    const [newMemberEmail, setNewMemberEmail] = useState('');
    const [newMemberRole, setNewMemberRole] = useState('VOLUNTEER');
    
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (user && !user.is_staff) {
            navigate('/');
        }
        fetchSettings();
        fetchTeam();
    }, [user, navigate]);

    const fetchTeam = async () => {
        try {
            const response = await axios.get(`${API_URL}/operations/team/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTeamMembers(response.data);
        } catch (error) {
            console.error("Failed to fetch team", error);
        }
    };

    const handleAddMember = async () => {
        try {
            await axios.post(`${API_URL}/operations/team/`, {
                email: newMemberEmail,
                role: newMemberRole
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewMemberEmail('');
            toast.success('New personnel node authorized.');
            fetchTeam();
        } catch (error) {
            toast.error('Authorization sequence failure.');
        }
    };

    const handleDeleteMember = async (id) => {
        if(!confirm('CRITICAL_PROCEDURE: TERMINATE_ACCESS_NODE? This action is permanent.')) return;
        try {
            await axios.delete(`${API_URL}/operations/team/${id}/`, {
                 headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Personnel node decommissioned.');
            fetchTeam();
        } catch (error) {
            toast.error('Termination failure.');
        }
    };

    const fetchSettings = async () => {
        try {
            const response = await axios.get(`${API_URL}/operations/settings/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data) {
                setSettings(prev => ({ ...prev, ...response.data }));
            }
        } catch (error) {
            console.error("Failed to fetch settings", error);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await axios.post(`${API_URL}/operations/settings/`, settings, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Operational parameters synchronized.');
        } catch (error) {
            toast.error('Protocol failure: Sync aborted.');
        } finally {
            setSaving(false);
        }
    };

    const updateSetting = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="space-y-12 pb-20">
            {/* Header */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10 relative">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-px w-8 bg-blue-500/40" />
                        <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.5em]">System_Config</span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-white uppercase tracking-[0.1em]">Tactical_Command_Center</h1>
                        <p className="text-[11px] text-slate-500 mt-2 font-mono uppercase tracking-tight">
                            Manage_Identity_Clusters: <span className="text-blue-500">{teamMembers.length}</span> // System_Status: <span className="text-emerald-500 font-black">STABLE</span>
                        </p>
                    </div>
                </div>
                
                <div className="flex gap-4 w-full xl:w-auto">
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 xl:flex-none h-14 px-10 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-[1.25rem] flex items-center justify-center gap-3 hover:bg-blue-500 transition-all shadow-[0_12px_30px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 disabled:opacity-50"
                    >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        {saving ? 'SYNCING_NODES' : 'COMMIT_CHANGES'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                {/* General Config */}
                <SettingSection icon={Globe} title="Node Visibility" sub="System_Access_Parameters">
                    <SettingItem 
                        label="Public Registration" 
                        description="Enable Identity Nodes to associate with established event nodes."
                        rightElement={
                            <Toggle 
                                enabled={settings.registrationOpen} 
                                onChange={(val) => updateSetting('registrationOpen', val)} 
                            />
                        }
                    />
                    <div className="h-px w-full bg-white/[0.03]" />
                    <SettingItem 
                        label="Maintenance Protocol" 
                        description="Deactivate sector access for non-admin nodes. System lockdown."
                        rightElement={
                            <Toggle 
                                enabled={settings.maintenanceMode} 
                                onChange={(val) => updateSetting('maintenanceMode', val)} 
                            />
                        }
                    />
                </SettingSection>

                {/* Notifications */}
                <SettingSection icon={Bell} title="Event Streams" sub="Protocol_Alert_Systems">
                    <SettingItem 
                        label="Binary Notification" 
                        description="Authorize automated signal transmission for status transitions."
                        rightElement={
                            <Toggle 
                                enabled={settings.emailNotifications} 
                                onChange={(val) => updateSetting('emailNotifications', val)} 
                            />
                        }
                    />
                    <div className="h-px w-full bg-white/[0.03]" />
                     <SettingItem 
                        label="External Webhook" 
                        description="Establish secure uplink to secondary communication clusters."
                        rightElement={
                            <button className="text-[9px] font-black text-blue-500 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2">
                                <Zap size={12} />
                                ESTABLISH_LINK
                            </button>
                        }
                    />
                </SettingSection>

                {/* Security */}
                <SettingSection icon={Lock} title="Auth Protocols" sub="Identity_Shield_Level">
                    <SettingItem 
                        label="Dual-Factor Auth" 
                        description="Require secondary verification node for administrative clearance."
                        rightElement={
                            <Toggle 
                                enabled={settings.twoFactor} 
                                onChange={(val) => updateSetting('twoFactor', val)} 
                            />
                        }
                    />
                    <div className="h-px w-full bg-white/[0.03]" />
                    <SettingItem 
                        label="Temporal Timeout" 
                        description="Automatically terminate active session upon detected inactivity."
                        rightElement={
                            <select className="bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 py-2.5 text-[10px] font-black text-white focus:outline-none focus:border-blue-500/30 uppercase tracking-widest cursor-pointer">
                                <option>15_MINUTES</option>
                                <option>30_MINUTES</option>
                                <option>01_HOUR</option>
                                <option>SESSION_LOCKED</option>
                            </select>
                        }
                    />
                </SettingSection>

                {/* Database */}
                <SettingSection icon={Server} title="Core Systems" sub="Cache_Node_Management">
                    <SettingItem 
                        label="Purge Cache" 
                        description="Reset local memory nodes to force binary synchronization."
                        rightElement={
                            <button className="px-5 py-2.5 bg-white/[0.03] border border-white/5 rounded-xl text-[9px] font-black text-slate-500 hover:text-white hover:bg-white/[0.08] transition-all uppercase tracking-widest leading-none">
                                PURGE_NODES
                            </button>
                        }
                    />
                    <div className="h-px w-full bg-white/[0.03]" />
                    <SettingItem 
                        label="Logic Latency" 
                        description="Current temporal offset from primary compute cluster."
                        rightElement={
                            <div className="flex items-center gap-3">
                                <Activity size={14} className="text-emerald-500" />
                                <span className="text-[10px] font-black text-emerald-500 font-mono tracking-tighter">12.04_MS</span>
                            </div>
                        }
                    />
                </SettingSection>

                {/* Team Access */}
                <div className="xl:col-span-2">
                    <SettingSection icon={Users} title="Personnel Manager" sub="Authorized_Operational_Nodes">
                        <div className="space-y-10">
                            {/* Add New Personnel */}
                            <div className="flex flex-col md:flex-row gap-6 items-end bg-white/[0.01] p-8 md:p-10 rounded-[2rem] border border-white/[0.03] relative group/add">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/[0.01] to-transparent pointer-events-none" />
                                <div className="flex-1 space-y-3 w-full relative z-10">
                                    <label className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em] ml-1">Identity_Endpoint</label>
                                    <div className="relative">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700 w-4 h-4" />
                                        <input 
                                            type="email" 
                                            placeholder="USER_IDENTIFIER..." 
                                            value={newMemberEmail}
                                            onChange={(e) => setNewMemberEmail(e.target.value)}
                                            className="w-full bg-white/[0.01] border border-white/[0.05] rounded-2xl py-5 pl-14 pr-6 text-sm font-black text-white focus:outline-none focus:border-blue-500/30 transition-all placeholder:text-slate-900 uppercase tracking-widest"
                                        />
                                    </div>
                                </div>
                                <div className="w-full md:w-64 space-y-3 relative z-10">
                                     <label className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em] ml-1">Access_Level</label>
                                     <select 
                                        value={newMemberRole}
                                        onChange={(e) => setNewMemberRole(e.target.value)}
                                        className="w-full bg-white/[0.02] border border-white/[0.05] rounded-2xl py-[1.125rem] px-5 text-[11px] font-black text-white focus:outline-none focus:border-blue-500/30 transition-all appearance-none cursor-pointer uppercase tracking-widest"
                                     >
                                         <option value="VOLUNTEER">Volunteer</option>
                                         <option value="ADMIN">Command_Admin</option>
                                     </select>
                                </div>
                                <button 
                                    onClick={handleAddMember}
                                    disabled={!newMemberEmail}
                                    className="h-[60px] px-8 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-blue-500 transition-all disabled:opacity-30 flex items-center justify-center gap-3 relative z-10 shadow-[0_12px_24px_rgba(37,99,235,0.2)]"
                                >
                                    <Plus size={16} strokeWidth={3} />
                                    AUTHORIZE
                                </button>
                            </div>

                            {/* Personnel List */}
                            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                                {teamMembers.length === 0 ? (
                                    <div className="col-span-full py-20 flex flex-col items-center gap-6 opacity-20 border border-dashed border-white/10 rounded-[2rem]">
                                        <Users size={40} strokeWidth={1} />
                                        <span className="text-[10px] font-black uppercase tracking-[0.5em]">Zero_Nodes_Authorized</span>
                                    </div>
                                ) : (
                                    teamMembers.map((member) => (
                                        <div 
                                            key={member.id} 
                                            className="flex flex-col gap-6 bg-white/[0.01] p-8 rounded-[2rem] border border-white/[0.03] hover:border-white/10 hover:bg-white/[0.02] transition-all group/node relative overflow-hidden"
                                        >
                                            <div className="flex justify-between items-start relative z-10">
                                                <div className="flex flex-col gap-1">
                                                     <div className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border flex items-center gap-2 w-fit ${member.role === 'ADMIN' ? 'bg-indigo-500/[0.03] text-indigo-500 border-indigo-500/10' : 'bg-emerald-500/[0.03] text-emerald-500 border-emerald-500/10'}`}>
                                                        <div className={`w-1 h-1 rounded-full ${member.role === 'ADMIN' ? 'bg-indigo-500' : 'bg-emerald-500'}`} />
                                                        {member.role === 'ADMIN' ? 'CMDR_CLEARANCE' : 'OPS_CLEARANCE'}
                                                     </div>
                                                </div>
                                                <button 
                                                    onClick={() => handleDeleteMember(member.id)}
                                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-800 hover:text-rose-500 hover:bg-rose-500/10 transition-all group-hover/node:opacity-100 opacity-0 duration-500"
                                                    title="Decommission Node"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>

                                            <div className="space-y-1 relative z-10">
                                                <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em]">SECURE_UPLINK</p>
                                                <p className="text-sm font-black text-white truncate max-w-full uppercase tracking-tight">{member.email}</p>
                                            </div>
                                            
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none opacity-0 group-hover/node:opacity-100 transition-opacity duration-1000" />
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </SettingSection>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
