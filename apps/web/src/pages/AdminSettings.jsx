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
    Moon, 
    Sun, 
    Users, 
    Mail, 
    Trash2, 
    Shield, 
    Cpu, 
    Zap, 
    Activity, 
    ChevronRight, 
    Plus, 
    Key,
    Monitor,
    Network,
    Terminal
} from 'lucide-react';

const Toggle = ({ enabled, onChange }) => (
    <button 
        onClick={() => onChange(!enabled)}
        className={`w-14 h-8 flex items-center rounded-full p-1 transition-all duration-500 relative ${enabled ? 'bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.4)] border-blue-500/50' : 'bg-white/[0.05] border-white/10 border'}`}
    >
        <div className={`bg-white w-6 h-6 rounded-full shadow-2xl transform transition-all duration-500 flex items-center justify-center ${enabled ? 'translate-x-6' : 'translate-x-0'}`}>
            <div className={`w-1 h-1 rounded-full ${enabled ? 'bg-blue-600' : 'bg-slate-300'}`} />
        </div>
    </button>
);

const SettingSection = ({ icon: Icon, title, sub, children }) => (
    <div className="bg-white/[0.01] border border-white/[0.03] rounded-[2.5rem] p-10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        
        <div className="flex items-center gap-6 mb-12 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-blue-500 shadow-inner group-hover:scale-110 transition-transform">
                <Icon size={24} />
            </div>
            <div className="flex flex-col">
                <h3 className="text-xl font-black text-white uppercase tracking-widest">{title}</h3>
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mt-1">{sub}</p>
            </div>
        </div>

        <div className="space-y-10 relative z-10">
            {children}
        </div>
    </div>
);

const SettingItem = ({ label, description, rightElement }) => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group/item">
        <div className="space-y-1.5 flex-1 pr-6">
            <h4 className="text-sm font-black text-slate-200 uppercase tracking-tight group-hover/item:text-white transition-colors">{label}</h4>
            <p className="text-[11px] font-bold text-slate-600 uppercase tracking-widest leading-relaxed max-w-xl group-hover/item:text-slate-500 transition-colors">{description}</p>
        </div>
        <div className="shrink-0">
            {rightElement}
        </div>
    </div>
);

const AdminSettings = () => {
    const { token } = useAuth();
    const API_URL = import.meta.env.VITE_API_URL;

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
        fetchSettings();
        fetchTeam();
    }, [token]);

    const fetchTeam = async () => {
        try {
            const response = await axios.get(`${API_URL}/ops/team/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTeamMembers(response.data);
        } catch (error) {
            console.error("Failed to fetch team", error);
        }
    };

    const handleAddMember = async () => {
        try {
            await axios.post(`${API_URL}/ops/team/`, {
                email: newMemberEmail,
                role: newMemberRole
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewMemberEmail('');
            fetchTeam(); // Refresh list
            alert('Team member added!');
        } catch (error) {
            console.error("Failed to add member", error);
            alert('Failed to add member.');
        }
    };

    const handleDeleteMember = async (id) => {
        if(!confirm('Are you sure you want to remove this member?')) return;
        try {
            await axios.delete(`${API_URL}/ops/team/${id}/`, {
                 headers: { Authorization: `Bearer ${token}` }
            });
            fetchTeam();
        } catch (error) {
           console.error("Failed to remove member", error);
        }
    };

    const fetchSettings = async () => {
        try {
            const response = await axios.get(`${API_URL}/ops/settings/`, {
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
            await axios.post(`${API_URL}/ops/settings/`, settings, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Settings saved successfully!');
        } catch (error) {
            console.error("Failed to save settings", error);
            alert('Failed to save settings.');
        } finally {
            setSaving(false);
        }
    };

    const updateSetting = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="space-y-16 pb-20">
            {/* Mission Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 relative">
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-px w-12 bg-blue-500" />
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Environmental Registry</span>
                    </div>
                    <div>
                        <h1 className="text-6xl font-black text-white/5 uppercase tracking-tighter absolute -mt-4 pointer-events-none select-none">OS Config</h1>
                        <h1 className="text-3xl font-black text-white uppercase tracking-wider relative z-10">System Parameters</h1>
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-2 max-w-md leading-relaxed">
                            Fine-tuning global environmental variables for the Astra ecosystem.
                        </p>
                    </div>
                </div>
                
                <div className="flex gap-4">
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="relative group overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-blue-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-100 transition-opacity" />
                        <div className="relative h-16 px-12 bg-blue-600 text-white text-[11px] font-black uppercase tracking-[0.4em] rounded-[2rem] flex items-center gap-3 group-active:scale-95 transition-transform shadow-2xl border border-white/10">
                            <Save size={18} />
                            {saving ? 'Synchronizing...' : 'Commit Local Delta'}
                        </div>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                {/* General Config */}
                <SettingSection icon={Globe} title="Operational General" sub="Global Accessibility Parameters">
                    <SettingItem 
                        label="Public Handshake" 
                        description="Allow external network nodes to initialize new session registrations publicly."
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
                        description="Enforce terminal lockdown. Deny public access to all mission sectors. Root only."
                        rightElement={
                            <Toggle 
                                enabled={settings.maintenanceMode} 
                                onChange={(val) => updateSetting('maintenanceMode', val)} 
                            />
                        }
                    />
                </SettingSection>

                {/* Notifications */}
                <SettingSection icon={Bell} title="Telemetry Alerts" sub="Communication & Dispatch Matrix">
                    <SettingItem 
                        label="Unified Messaging" 
                        description="Enable automated SMTP relay for mission-critical audit trails and password recovery."
                        rightElement={
                            <Toggle 
                                enabled={settings.emailNotifications} 
                                onChange={(val) => updateSetting('emailNotifications', val)} 
                            />
                        }
                    />
                    <div className="h-px w-full bg-white/[0.03]" />
                     <SettingItem 
                        label="Real-time Webhooks" 
                        description="Bridge core events to Slack intelligence sectors for real-time tactical monitoring."
                        rightElement={
                            <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:text-white transition-colors underline decoration-2 underline-offset-8">INIT_BRIDGE</button>
                        }
                    />
                </SettingSection>

                {/* Security */}
                <SettingSection icon={Lock} title="Cryptography" sub="Access Control & Security Shield">
                    <SettingItem 
                        label="Multi-Factor Uplink" 
                        description="Enforce secondary cryptographic verification for all root and administrative assets."
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
                        description="Automatically terminate inactive sessions to prevent unauthorized node access."
                        rightElement={
                            <select className="bg-black/40 border border-white/[0.05] rounded-xl px-4 py-2 text-[10px] font-black text-slate-300 focus:outline-none focus:border-blue-500/30 uppercase tracking-widest">
                                <option>15_MINUTES</option>
                                <option>30_MINUTES</option>
                                <option>01_HOUR_EXP</option>
                                <option>04_HOURS_MAX</option>
                            </select>
                        }
                    />
                </SettingSection>

                {/* Database */}
                <SettingSection icon={Server} title="Memory Buffer" sub="Data Retention & Integrity Ops">
                    <SettingItem 
                        label="Volatile Cache Purge" 
                        description="Force refresh the global state by purging all temporary memory buffers."
                        rightElement={
                            <button className="px-6 py-2.5 bg-white/[0.02] border border-white/10 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition-all">TERMINATE_CACHE</button>
                        }
                    />
                    <div className="h-px w-full bg-white/[0.03]" />
                    <SettingItem 
                        label="Neural Storage Stats" 
                        description="Retrieve real-time telemetry from the primary intelligence database node."
                        rightElement={
                            <div className="flex items-center gap-3">
                                <Activity size={16} className="text-emerald-500" />
                                <span className="text-[10px] font-black text-emerald-500 uppercase">Latency: 0.12ms</span>
                            </div>
                        }
                    />
                </SettingSection>

                {/* Team Access */}
                <div className="xl:col-span-2">
                    <SettingSection icon={Users} title="Personnel Access List" sub="Operational Team Management">
                        <div className="space-y-10">
                            {/* Add New Personnel */}
                            <div className="flex flex-col md:flex-row gap-4 items-end bg-white/[0.01] p-8 rounded-[2rem] border border-white/[0.03] group/input shadow-inner">
                                <div className="flex-1 space-y-3 w-full">
                                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">New Node Email Identifier</label>
                                    <div className="relative">
                                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" />
                                        <input 
                                            type="email" 
                                            placeholder="PERSONNEL@NETWORK.UPLINK" 
                                            value={newMemberEmail}
                                            onChange={(e) => setNewMemberEmail(e.target.value)}
                                            className="w-full bg-black/60 border border-white/[0.04] rounded-2xl py-4 pl-14 pr-6 text-[11px] font-black text-slate-200 focus:outline-none focus:border-blue-500/30 transition-all uppercase placeholder:text-slate-800"
                                        />
                                    </div>
                                </div>
                                <div className="w-full md:w-48 space-y-3">
                                     <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Access Tier</label>
                                     <select 
                                        value={newMemberRole}
                                        onChange={(e) => setNewMemberRole(e.target.value)}
                                        className="w-full bg-black/60 border border-white/[0.04] rounded-2xl py-4 px-6 text-[11px] font-black text-slate-200 focus:outline-none focus:border-blue-500/30 transition-all uppercase appearance-none cursor-pointer"
                                     >
                                         <option value="VOLUNTEER">VOLUNTEER_LVL_1</option>
                                         <option value="ADMIN">ADMIN_ROOT_TIER</option>
                                     </select>
                                </div>
                                <button 
                                    onClick={handleAddMember}
                                    disabled={!newMemberEmail}
                                    className="h-14 px-10 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-blue-500 transition-all disabled:opacity-30 disabled:grayscale mb-0.5"
                                >
                                    Authorize
                                </button>
                            </div>

                            {/* Personnel List */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {teamMembers.length === 0 ? (
                                    <div className="col-span-full py-20 flex flex-col items-center gap-4 opacity-20 border border-dashed border-white/5 rounded-[2rem]">
                                        <History size={40} />
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">No Personnel Synced</span>
                                    </div>
                                ) : (
                                    teamMembers.map((member) => (
                                        <motion.div 
                                            key={member.id} 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex justify-between items-center bg-white/[0.01] p-6 rounded-[2rem] border border-white/[0.03] hover:border-white/[0.1] hover:bg-white/[0.02] transition-all group/card"
                                        >
                                            <div className="flex items-center gap-5">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xs font-black shadow-inner border transition-all group-hover/card:scale-110 ${member.role === 'ADMIN' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                                                    {member.role[0]}
                                                </div>
                                                <div className="flex flex-col">
                                                    <p className="text-[13px] font-black text-slate-200 uppercase tracking-tight truncate max-w-[140px] md:max-w-xs">{member.email}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full ${member.role === 'ADMIN' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                                            {member.role}
                                                        </span>
                                                        <span className="text-[8px] font-bold text-slate-700 uppercase">ID: NODE_{member.id}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => handleDeleteMember(member.id)}
                                                className="w-10 h-10 rounded-xl bg-rose-500/5 border border-rose-500/10 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all active:scale-90"
                                                title="Revoke Access"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </motion.div>
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
