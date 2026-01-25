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
    Search
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
        <div className="space-y-12 pb-24 font-inter">
            {/* Mission Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-px bg-blue-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">Operation Center</span>
                    </div>
                    <h1 className="text-5xl font-black text-white tracking-tighter leading-none uppercase">Events Hub</h1>
                    <p className="text-slate-500 text-sm font-medium">Manage deployment parameters for active events and challenges.</p>
                </div>
                
                <div className="flex gap-4">
                    <div className="relative group hidden lg:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Filter nodes..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-14 bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-2 pl-12 w-64 text-xs font-bold text-white focus:outline-none focus:border-blue-500/20 transition-all placeholder:text-slate-600"
                        />
                    </div>
                    <button 
                        onClick={handleCreate}
                        className="h-14 px-8 rounded-2xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-[0_0_30px_rgba(37,99,235,0.3)] flex items-center gap-3"
                    >
                        <Plus className="w-5 h-5 stroke-[3px]" />
                        <span>Deploy Event</span>
                    </button>
                </div>
            </div>

            {/* Tactical Grid */}
            <div className="relative">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 space-y-6">
                        <div className="w-12 h-12 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin shadow-[0_0_15px_rgba(59,130,246,0.3)]"></div>
                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em] animate-pulse">Synchronizing Nodes...</p>
                    </div>
                ) : filteredEvents.length === 0 ? (
                    <div className="py-24 flex flex-col items-center justify-center text-slate-800">
                        <Shield className="w-24 h-24 mb-6 stroke-1 opacity-20" />
                        <p className="text-xl font-black uppercase tracking-widest opacity-20">No active deployments found</p>
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
                            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100]"
                        />
                        <motion.div
                            initial={{ x: '100%', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '100%', opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-[#050505] border-l border-white/5 shadow-2xl z-[101] overflow-hidden flex flex-col"
                        >
                            <div className="p-10 border-b border-white/5 flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">Node Configuration</span>
                                    </div>
                                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
                                        {isEditing ? 'Modify Protocol' : 'Deploy Directive'}
                                    </h2>
                                </div>
                                <button onClick={() => setShowForm(false)} className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-all hover:scale-110">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-10 space-y-12">
                                <form id="eventForm" onSubmit={handleSubmit} className="space-y-12 pb-20">
                                    {/* CORE INTELLEGENCE */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-px bg-white/10" />
                                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Core Intelligence</h3>
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="col-span-2 space-y-2">
                                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest pl-1">Operation Title</label>
                                                <input required name="title" value={formData.title} onChange={handleChange} className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-white font-bold focus:border-blue-500/20 focus:outline-none transition-all placeholder:text-slate-800" placeholder="e.g. Project Nightfall" />
                                            </div>
                                            <div className="col-span-2 space-y-2">
                                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest pl-1">Briefing Content</label>
                                                <textarea required name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-white font-bold focus:border-blue-500/20 focus:outline-none transition-all placeholder:text-slate-800" placeholder="Detailed objective brief..." />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest pl-1">Classification / Category</label>
                                                <input required name="category" value={formData.category} onChange={handleChange} className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-white font-bold focus:border-blue-500/20 focus:outline-none transition-all placeholder:text-slate-800" placeholder="e.g. Tech Alpha" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest pl-1">Sector / Venue</label>
                                                <input required name="venue" value={formData.venue} onChange={handleChange} className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-white font-bold focus:border-blue-500/20 focus:outline-none transition-all" />
                                            </div>
                                            <div className="col-span-2 space-y-2">
                                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest pl-1">Telemetry Visual (Image URL)</label>
                                                <input name="image" value={formData.image} onChange={handleChange} className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-white font-mono text-xs focus:border-blue-500/20 focus:outline-none transition-all placeholder:text-slate-800" placeholder="https://..." />
                                            </div>
                                        </div>
                                    </div>

                                    {/* TEMPORAL PARAMETERS */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-px bg-white/10" />
                                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Temporal Parameters</h3>
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest pl-1">Deployment Date</label>
                                                <input required type="datetime-local" name="event_date" value={formData.event_date} onChange={handleChange} className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-white font-bold focus:border-blue-500/20 outline-none" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest pl-1">Personnel Limit</label>
                                                <input required type="number" name="registration_limit" value={formData.registration_limit} onChange={handleChange} className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-white font-bold focus:border-blue-500/20" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest pl-1">Window Open</label>
                                                <input required type="datetime-local" name="registration_start" value={formData.registration_start} onChange={handleChange} className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-white font-bold focus:border-blue-500/20 outline-none" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest pl-1">Window Close</label>
                                                <input required type="datetime-local" name="registration_end" value={formData.registration_end} onChange={handleChange} className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-white font-bold focus:border-blue-500/20 outline-none" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* OPERATION SECURITY */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-px bg-white/10" />
                                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Operational Config</h3>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-6 rounded-[1.5rem] bg-white/[0.02] border border-white/5">
                                                <div className="space-y-1">
                                                    <p className="text-sm font-black text-white uppercase tracking-tight">Node Access Open</p>
                                                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Allow new personnel registrations</p>
                                                </div>
                                                <Switch checked={formData.is_registration_open} onChange={() => setFormData(p => ({...p, is_registration_open: !p.is_registration_open}))} />
                                            </div>

                                            <div className="flex items-center justify-between p-6 rounded-[1.5rem] bg-white/[0.02] border border-white/5">
                                                <div className="space-y-1">
                                                    <p className="text-sm font-black text-white uppercase tracking-tight">Credit Verification</p>
                                                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Require payment for access</p>
                                                </div>
                                                <Switch checked={formData.requires_payment} onChange={() => setFormData(p => ({...p, requires_payment: !p.requires_payment}))} />
                                            </div>

                                            {formData.requires_payment && (
                                                <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} className="p-6 rounded-[1.5rem] bg-blue-500/5 border border-blue-500/10 space-y-4">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest pl-1">Credits Required (INR)</label>
                                                        <input type="number" name="payment_amount" value={formData.payment_amount} onChange={handleChange} className="w-full bg-black/40 border border-blue-500/20 rounded-2xl p-4 text-white font-mono font-bold focus:border-blue-500/40 outline-none" />
                                                    </div>
                                                </motion.div>
                                            )}

                                            <div className="flex items-center justify-between p-6 rounded-[1.5rem] bg-white/[0.02] border border-white/5">
                                                <div className="space-y-1">
                                                    <p className="text-sm font-black text-white uppercase tracking-tight">Squad Operation</p>
                                                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Team-based registration</p>
                                                </div>
                                                <Switch checked={formData.is_team_event} onChange={() => setFormData(p => ({...p, is_team_event: !p.is_team_event}))} />
                                            </div>

                                            {formData.is_team_event && (
                                                <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} className="p-6 rounded-[1.5rem] bg-purple-500/5 border border-purple-500/10 grid grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-purple-500 uppercase tracking-widest pl-1">Min Squad Size</label>
                                                        <input type="number" name="team_size_min" value={formData.team_size_min} onChange={handleChange} className="w-full bg-black/40 border border-purple-500/20 rounded-2xl p-4 text-white font-bold" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-purple-500 uppercase tracking-widest pl-1">Max Squad Size</label>
                                                        <input type="number" name="team_size_max" value={formData.team_size_max} onChange={handleChange} className="w-full bg-black/40 border border-purple-500/20 rounded-2xl p-4 text-white font-bold" />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                </form>
                            </div>

                            <div className="p-10 border-t border-white/5 bg-black/40 backdrop-blur-xl flex gap-6">
                                <button type="button" onClick={() => setShowForm(false)} className="flex-1 h-16 rounded-[1.5rem] border border-white/5 text-[11px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-all">
                                    Abort
                                </button>
                                <button type="submit" form="eventForm" className="flex-[2] h-16 rounded-[1.5rem] bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-[0_0_30px_rgba(37,99,235,0.2)]">
                                    {isEditing ? 'Commit Parameters' : 'Launch Operation'}
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
            className="group relative bg-[#050505]/60 backdrop-blur-xl border border-white/5 hover:border-blue-500/20 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:shadow-[0_0_50px_rgba(59,130,246,0.1)] flex flex-col"
        >
            <div className="p-10 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-8">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${event.is_registration_open ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse' : 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]'}`} />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{event.category}</span>
                        </div>
                    </div>
                    
                    <div className="flex gap-2">
                         <button onClick={() => onEdit(event)} className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-slate-500 hover:text-blue-500 hover:border-blue-500/30 transition-all">
                            <Edit2 size={16} strokeWidth={2.5} />
                        </button>
                        <button onClick={() => onDelete(event.id)} className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-slate-500 hover:text-rose-500 hover:border-rose-500/30 transition-all">
                            <Trash2 size={16} strokeWidth={2.5} />
                        </button>
                    </div>
                </div>

                <div className="space-y-3 mb-8">
                    <h3 className="text-3xl font-black text-white leading-tight uppercase tracking-tighter group-hover:text-blue-400 transition-colors">
                        {event.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4">
                        <span className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                            <Calendar size={12} className="text-blue-500" />
                            {new Date(event.event_date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                            <MapPin size={12} className="text-blue-500" />
                            {event.venue}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-auto">
                    <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5 space-y-1">
                        <span className="block text-[8px] font-black text-slate-600 uppercase tracking-widest">Personnel Load</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-black text-white font-mono">{event.registrations?.length || '0'}</span>
                            <span className="text-[10px] font-bold text-slate-600">/ {event.registration_limit}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="p-8 pt-0">
                <div className="flex items-center justify-between text-[8px] font-black text-slate-600 uppercase tracking-[0.2em] mb-3 pr-2">
                    <span>Operational Capacity</span>
                    <span className={progress > 80 ? 'text-rose-500' : 'text-blue-400'}>{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-[1px]">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full rounded-full ${progress > 80 ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]' : 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]'}`}
                    />
                </div>
            </div>
        </motion.div>
    );
};

const Switch = ({ checked, onChange }) => (
    <button 
        type="button"
        onClick={onChange}
        className={`w-14 h-8 rounded-2xl relative transition-all duration-300 ease-in-out border border-white/5 ${checked ? 'bg-blue-600' : 'bg-slate-800'}`}
    >
        <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-xl shadow-lg transition-transform duration-300 ease-in-out ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
);

export default AdminEvents;


