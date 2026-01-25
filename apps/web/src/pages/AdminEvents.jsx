import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
    Plus, 
    Edit2, 
    Trash2, 
    Calendar, 
    Clock, 
    Users, 
    ToggleLeft, 
    ToggleRight, 
    ArrowLeft,
    Save,
    X,
    Shield,
    AlertTriangle,
    RotateCcw,
    MapPin,
    Terminal,
    Search,
    Cpu,
    Zap,
    Target,
    Database,
    ChevronRight,
    SearchX
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

const AdminEvents = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const toast = useToast();

    // Modal / Slide-over state
    const [showForm, setShowForm] = useState(false);
    
    // Search / Filter
    const [searchQuery, setSearchQuery] = useState('');

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

    // Form State
    const initialFormState = {
        title: '',
        description: '',
        event_date: '',
        venue: '',
        image: '',
        category: '',
        registration_start: '',
        registration_end: '',
        registration_limit: 100,
        is_registration_open: true,
        payment_amount: 0,
        requires_payment: false,
        is_team_event: false,
        team_size_min: 1,
        team_size_max: 1
    };
    const [formData, setFormData] = useState(initialFormState);
    const [currentEventId, setCurrentEventId] = useState(null);

    useEffect(() => {
        if (user && !user.is_staff) {
            navigate('/');
        }
        fetchEvents();
    }, [user, navigate]);

    const fetchEvents = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/operations/events/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const sorted = response.data.sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
            setEvents(sorted);
        } catch (error) {
            console.error('Error fetching events:', error);
            setError('Failed to sync with intelligence database.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('WARNING: Confirm deletion of operation data? This action is irreversible.')) return;
        try {
            await axios.delete(`${API_URL}/operations/events/${id}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Operation record expunged.");
            fetchEvents();
        } catch (error) {
            toast.error("Deletion failed. Access denied.");
        }
    };

    const handleEdit = (event) => {
        setCurrentEventId(event.id);
        setFormData({
            title: event.title,
            description: event.description,
            event_date: event.event_date ? new Date(event.event_date).toISOString().slice(0, 16) : '',
            venue: event.venue,
            image: event.image,
            category: event.category,
            registration_start: event.registration_start ? new Date(event.registration_start).toISOString().slice(0, 16) : '',
            registration_end: event.registration_end ? new Date(event.registration_end).toISOString().slice(0, 16) : '',
            registration_limit: event.registration_limit,
            is_registration_open: event.is_registration_open,
            payment_amount: event.payment_amount || 0,
            requires_payment: event.requires_payment || false,
            is_team_event: event.is_team_event || false,
            team_size_min: event.team_size_min || 1,
            team_size_max: event.team_size_max || 1
        });
        setIsEditing(true);
        setShowForm(true);
    };

    const handleCreate = () => {
        setCurrentEventId(null);
        setFormData(initialFormState);
        setIsEditing(false);
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(`${API_URL}/operations/events/${currentEventId}/`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success("Operation parameters updated.");
            } else {
                await axios.post(`${API_URL}/operations/events/`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success("New operation initialized.");
            }
            setShowForm(false);
            fetchEvents();
        } catch (error) {
            console.error('Save error:', error);
            toast.error("Database write error.");
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const filteredEvents = events.filter(ev => 
        ev.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        ev.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-12">
            {/* Mission Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 relative">
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-px w-12 bg-blue-500" />
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Protocol Registry</span>
                    </div>
                    <div>
                        <h1 className="text-6xl font-black text-white/5 uppercase tracking-tighter absolute -mt-4 pointer-events-none select-none">Operation Center</h1>
                        <h1 className="text-3xl font-black text-white uppercase tracking-wider relative z-10">Events Dispatch</h1>
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-2 max-w-md leading-relaxed">
                            Managing <span className="text-blue-500">{filteredEvents.length}</span> active mission deployment sectors.
                        </p>
                    </div>
                </div>
                
                <div className="flex gap-4">
                    <div className="relative group hidden lg:block">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-blue-500 transition-colors z-10" />
                        <input 
                            type="text" 
                            placeholder="SEARCH OPERATION IDENTIFIER..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-16 bg-black/40 border border-white/[0.03] rounded-[2rem] py-4 pl-14 pr-6 w-80 text-[11px] font-black tracking-widest text-slate-300 placeholder:text-slate-700 focus:outline-none focus:border-blue-500/30 transition-all uppercase"
                        />
                    </div>
                    <button 
                        onClick={handleCreate}
                        className="relative group overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-blue-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                        <div className="relative h-16 px-10 bg-blue-600 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-[2rem] flex items-center gap-3 group-active:scale-95 transition-transform shadow-2xl">
                            <Plus size={20} strokeWidth={3} />
                            Deploy Mission
                        </div>
                    </button>
                </div>
            </div>

            {/* Tactical Grid */}
            <div className="relative">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-6">
                        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] animate-pulse">Syncing Intelligence Feed...</p>
                    </div>
                ) : filteredEvents.length === 0 ? (
                    <div className="py-40 flex flex-col items-center justify-center opacity-20 gap-4">
                        <SearchX className="w-20 h-20 text-slate-600 stroke-1" />
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Registry_Empty: No Assets Detected</div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                        {filteredEvents.map((event) => (
                            <EventCard 
                                key={event.id} 
                                event={event} 
                                onEdit={handleEdit} 
                                onDelete={handleDelete} 
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Tactical Slide-over Form */}
            <AnimatePresence>
                {showForm && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowForm(false)}
                            className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-[100]"
                        />
                        <motion.div
                            initial={{ x: '100%', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '100%', opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed right-0 top-0 bottom-0 w-full max-w-3xl bg-[#020202] border-l border-white/[0.04] shadow-2xl z-[101] overflow-hidden flex flex-col"
                        >
                            <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                                <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[100px]" />
                            </div>

                            <div className="p-12 border-b border-white/[0.04] flex items-center justify-between relative z-10 bg-black/40 backdrop-blur-3xl">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_rgba(37,99,235,1)]" />
                                        <span className="text-[9px] font-black uppercase tracking-[0.5em] text-blue-500">Node Configuration Terminal</span>
                                    </div>
                                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter">
                                        {isEditing ? 'Commit Parameters' : 'Launch Directive'}
                                    </h2>
                                </div>
                                <button onClick={() => setShowForm(false)} className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-slate-500 hover:text-white hover:border-white/20 transition-all hover:rotate-90">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-12 space-y-16 relative z-10 custom-scrollbar">
                                <form id="eventForm" onSubmit={handleSubmit} className="space-y-16 pb-20">
                                    {/* CORE INTELLEGENCE */}
                                    <div className="space-y-10">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                                                <Database size={18} />
                                            </div>
                                            <div className="flex flex-col">
                                                <h3 className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Core Data Matrix</h3>
                                                <p className="text-[9px] font-bold text-slate-600 uppercase mt-1">Primary Operational Constants</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-8">
                                            <div className="col-span-2 space-y-3">
                                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-2">Mission Identifier</label>
                                                <input required name="title" value={formData.title} onChange={handleChange} className="w-full bg-white/[0.02] border border-white/[0.06] rounded-3xl p-5 text-white font-black tracking-tight text-lg uppercase focus:border-blue-500/30 focus:bg-white/[0.04] focus:outline-none transition-all placeholder:text-slate-800" placeholder="E.G. PROJECT_X_ALPHA" />
                                            </div>
                                            <div className="col-span-2 space-y-3">
                                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-2">Intelligence Briefing</label>
                                                <textarea required name="description" value={formData.description} onChange={handleChange} rows={5} className="w-full bg-white/[0.02] border border-white/[0.06] rounded-3xl p-5 text-slate-300 font-bold focus:border-blue-500/30 focus:bg-white/[0.04] focus:outline-none transition-all placeholder:text-slate-800 leading-relaxed" placeholder="DETAILED OBJECTIVE SUMMARY..." />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-2">Sector Classification</label>
                                                <input required name="category" value={formData.category} onChange={handleChange} className="w-full bg-white/[0.02] border border-white/[0.06] rounded-3xl p-5 text-white font-black uppercase tracking-widest text-[11px] focus:border-blue-500/30 focus:bg-white/[0.04] focus:outline-none transition-all" placeholder="E.G. TECH_OPS" />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-2">Operational Venue</label>
                                                <input required name="venue" value={formData.venue} onChange={handleChange} className="w-full bg-white/[0.02] border border-white/[0.06] rounded-3xl p-5 text-white font-black uppercase tracking-widest text-[11px] focus:border-blue-500/30 focus:bg-white/[0.04] focus:outline-none transition-all" placeholder="PHYSICAL_LOCATION_ZONE" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* TEMPORAL PARAMETERS */}
                                    <div className="space-y-10">
                                         <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                                                <Clock size={18} />
                                            </div>
                                            <div className="flex flex-col">
                                                <h3 className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Temporal Window</h3>
                                                <p className="text-[9px] font-bold text-slate-600 uppercase mt-1">Mission Deployment Constraints</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-2">Launch Date-Time</label>
                                                <input required type="datetime-local" name="event_date" value={formData.event_date} onChange={handleChange} className="w-full bg-white/[0.02] border border-white/[0.06] rounded-3xl p-5 text-white font-black uppercase tracking-widest text-[11px] focus:border-blue-500/30 focus:bg-white/[0.04] outline-none" />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-2">Node Capacity</label>
                                                <input required type="number" name="registration_limit" value={formData.registration_limit} onChange={handleChange} className="w-full bg-white/[0.02] border border-white/[0.06] rounded-3xl p-5 text-white font-black uppercase tracking-widest text-[11px] focus:border-blue-500/30 focus:bg-white/[0.04]" />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-2">Registry Open</label>
                                                <input required type="datetime-local" name="registration_start" value={formData.registration_start} onChange={handleChange} className="w-full bg-white/[0.02] border border-white/[0.06] rounded-3xl p-5 text-white font-black uppercase tracking-widest text-[11px] focus:border-blue-500/30 focus:bg-white/[0.04] outline-none" />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-2">Registry Expire</label>
                                                <input required type="datetime-local" name="registration_end" value={formData.registration_end} onChange={handleChange} className="w-full bg-white/[0.02] border border-white/[0.06] rounded-3xl p-5 text-white font-black uppercase tracking-widest text-[11px] focus:border-blue-500/30 focus:bg-white/[0.04] outline-none" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* SECURITY & CREDITS */}
                                    <div className="space-y-10">
                                         <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                                                <Shield size={18} />
                                            </div>
                                            <div className="flex flex-col">
                                                <h3 className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Validation Protocols</h3>
                                                <p className="text-[9px] font-bold text-slate-600 uppercase mt-1">Access Control & Resource Tokens</p>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="flex items-center justify-between p-6 rounded-[2rem] bg-white/[0.01] border border-white/[0.04] hover:bg-white/[0.03] transition-colors">
                                                <div className="space-y-1.5">
                                                    <p className="text-xs font-black text-white uppercase tracking-widest">Public Uplink</p>
                                                    <p className="text-[9px] text-slate-600 font-bold uppercase tracking-tight leading-none">Enable node registry access</p>
                                                </div>
                                                <Switch checked={formData.is_registration_open} onChange={() => setFormData(p => ({...p, is_registration_open: !p.is_registration_open}))} />
                                            </div>

                                            <div className="flex items-center justify-between p-6 rounded-[2rem] bg-white/[0.01] border border-white/[0.04] hover:bg-white/[0.03] transition-colors">
                                                <div className="space-y-1.5">
                                                    <p className="text-xs font-black text-white uppercase tracking-widest">Credit Lock</p>
                                                    <p className="text-[9px] text-slate-600 font-bold uppercase tracking-tight leading-none">Require resource tokens</p>
                                                </div>
                                                <Switch checked={formData.requires_payment} onChange={() => setFormData(p => ({...p, requires_payment: !p.requires_payment}))} />
                                            </div>

                                            {formData.requires_payment && (
                                                <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} className="col-span-2 p-8 rounded-[2rem] bg-blue-500/5 border border-blue-500/10 space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Required Credits per Node</label>
                                                        <span className="text-[9px] font-bold text-slate-700 uppercase">CURRENCY_UNIT: INR</span>
                                                    </div>
                                                    <input type="number" name="payment_amount" value={formData.payment_amount} onChange={handleChange} className="w-full bg-black/40 border border-blue-500/20 rounded-2xl p-5 text-2xl font-black text-white font-mono focus:border-blue-500/40 outline-none transition-all shadow-inner" />
                                                </motion.div>
                                            )}

                                            <div className="col-span-2 flex items-center justify-between p-6 rounded-[2.5rem] bg-white/[0.01] border border-white/[0.04] hover:bg-white/[0.03] transition-colors">
                                                <div className="space-y-1.5">
                                                    <p className="text-xs font-black text-white uppercase tracking-widest">Squad Synchronization</p>
                                                    <p className="text-[9px] text-slate-600 font-bold uppercase tracking-tight leading-none">Enable multi-node team-based registry</p>
                                                </div>
                                                <Switch checked={formData.is_team_event} onChange={() => setFormData(p => ({...p, is_team_event: !p.is_team_event}))} />
                                            </div>

                                            {formData.is_team_event && (
                                                <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} className="col-span-2 p-8 rounded-[2.5rem] bg-purple-500/5 border border-purple-500/10 grid grid-cols-2 gap-8">
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black text-purple-500 uppercase tracking-widest ml-1">Min Squad Size</label>
                                                        <input type="number" name="team_size_min" value={formData.team_size_min} onChange={handleChange} className="w-full bg-black/40 border border-purple-500/20 rounded-2xl p-4 text-white font-black text-center" />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black text-purple-500 uppercase tracking-widest ml-1">Max Squad Size</label>
                                                        <input type="number" name="team_size_max" value={formData.team_size_max} onChange={handleChange} className="w-full bg-black/40 border border-purple-500/20 rounded-2xl p-4 text-white font-black text-center" />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                </form>
                            </div>

                            <div className="p-12 border-t border-white/[0.04] bg-black/60 backdrop-blur-3xl flex gap-8 relative z-10">
                                <button type="button" onClick={() => setShowForm(false)} className="flex-1 h-20 rounded-[2rem] bg-white/[0.02] border border-white/10 text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] hover:text-white hover:bg-white/[0.05] transition-all active:scale-95">
                                    Abort Ops
                                </button>
                                <button type="submit" form="eventForm" className="flex-[2] relative group">
                                    <div className="absolute inset-0 bg-blue-600 rounded-[2rem] blur-xl opacity-20 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative h-20 w-full bg-blue-600 rounded-[2rem] text-[11px] font-black text-white uppercase tracking-[0.4em] flex items-center justify-center gap-4 group-active:scale-95 transition-transform overflow-hidden">
                                        <Zap size={20} className="fill-white animate-pulse" />
                                        {isEditing ? 'Commit Matrix Update' : 'Initialize Global Deployment'}
                                    </div>
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

const EventCard = ({ event, onEdit, onDelete }) => {
    const isPast = new Date(event.event_date) < new Date();
    const progress = Math.min(((event.registrations?.length || 0) / event.registration_limit) * 100, 100);
    
    return (
        <motion.div 
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative h-[550px] flex flex-col"
        >
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-white/[0.01] border border-white/[0.05] rounded-[3rem] transition-all duration-700 group-hover:bg-white/[0.03] group-hover:border-white/[0.1] shadow-2xl z-0" />
            
            <div className="relative z-10 p-10 flex flex-col h-full overflow-hidden">
                {/* Visual Identity Layer */}
                <div className="flex items-start justify-between mb-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className={`w-2.5 h-2.5 rounded-full ${event.is_registration_open ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-pulse' : 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]'}`} />
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] group-hover:text-slate-400 transition-colors">{event.category}</span>
                        </div>
                    </div>
                    
                    <div className="flex gap-2.5">
                         <button onClick={() => onEdit(event)} className="w-11 h-11 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-slate-600 hover:text-blue-500 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all active:scale-90">
                            <Edit2 size={16} strokeWidth={3} />
                        </button>
                        <button onClick={() => onDelete(event.id)} className="w-11 h-11 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all active:scale-90">
                            <Trash2 size={16} strokeWidth={3} />
                        </button>
                    </div>
                </div>

                {/* Identity & Mission Data */}
                <div className="space-y-6 flex-1">
                    <div className="relative">
                        <h3 className="text-4xl font-black text-white leading-[0.9] uppercase tracking-tighter group-hover:text-blue-400 transition-all duration-500 transform group-hover:translate-x-2">
                            {event.title}
                        </h3>
                        <div className="h-px w-0 bg-blue-500/40 group-hover:w-full transition-all duration-700 mt-4" />
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2.5 px-4 py-2 bg-white/[0.02] border border-white/5 rounded-2xl text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] group-hover:border-white/10 transition-colors">
                            <Calendar size={13} className="text-blue-500" />
                            {new Date(event.event_date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2.5 px-4 py-2 bg-white/[0.02] border border-white/5 rounded-2xl text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] group-hover:border-white/10 transition-colors">
                            <MapPin size={13} className="text-blue-500" />
                            {event.venue}
                        </div>
                    </div>

                    <p className="text-[11px] font-bold text-slate-600 uppercase leading-relaxed tracking-widest line-clamp-3 group-hover:text-slate-400 transition-colors">
                        {event.description}
                    </p>
                </div>

                {/* Telemetry Footer */}
                <div className="mt-12 space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white/[0.02] p-6 rounded-[2rem] border border-white/5 space-y-1.5 group-hover:bg-white/[0.04] transition-all">
                            <span className="block text-[9px] font-black text-slate-700 uppercase tracking-widest leading-none">Node Saturation</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-black text-white uppercase tracking-tighter">{event.registrations?.length || '0'}</span>
                                <span className="text-[10px] font-bold text-slate-700 uppercase">/ {event.registration_limit}</span>
                            </div>
                        </div>
                        <div className="bg-white/[0.02] p-6 rounded-[2rem] border border-white/5 space-y-1.5 group-hover:bg-white/[0.04] transition-all flex flex-col justify-center">
                             <span className="block text-[9px] font-black text-slate-700 uppercase tracking-widest leading-none">Access Level</span>
                             <span className="text-[13px] font-black text-blue-500 uppercase tracking-widest mt-1">LVL_0{Math.floor(Math.random()*4)+1}_SECURE</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-[9px] font-black text-slate-700 uppercase tracking-[0.3em] px-1">
                            <span>Operational Load</span>
                            <span className={progress > 80 ? 'text-rose-500' : 'text-blue-500'}>{Math.round(progress)}% SYNCHRONIZED</span>
                        </div>
                        <div className="h-2 w-full bg-white/[0.03] rounded-full overflow-hidden p-[1px] relative">
                             {/* Pulsing Shadow behind progress */}
                            <div className="absolute inset-x-0 h-full bg-blue-500/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                                className={`h-full rounded-full relative z-10 ${progress > 80 ? 'bg-gradient-to-r from-rose-600 to-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.5)]' : 'bg-gradient-to-r from-blue-600 to-indigo-400 shadow-[0_0_15px_rgba(37,99,235,0.5)]'}`}
                            />
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Card Accent Glow */}
            <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-blue-600/5 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        </motion.div>
    );
};

const Switch = ({ checked, onChange }) => (
    <button 
        type="button"
        onClick={onChange}
        className={`w-16 h-9 rounded-full relative transition-all duration-500 ease-[0.19,1,0.22,1] border ${checked ? 'bg-blue-600 border-blue-500/50 shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'bg-white/[0.05] border-white/10'}`}
    >
        <motion.div 
            animate={{ x: checked ? 28 : 4 }}
            className={`absolute top-1.5 w-6 h-6 bg-white rounded-full shadow-2xl`}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
    </button>
);

export default AdminEvents;
