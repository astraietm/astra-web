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
    SearchX,
    Loader2
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
            const sorted = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setEvents(sorted);
        } catch (error) {
            console.error('Error fetching events:', error);
            setError('Failed to load events.');
        } finally {
            setLoading(false);
        }
    };

    const handleSync = async () => {
        try {
            toast.success("Initiating event synchronization...");
            const response = await axios.post(`${API_URL}/operations/sync-events/`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                toast.success(`Sync complete! ${response.data.event_count} events in database.`);
                fetchEvents(); // Refresh the list
            } else {
                toast.error("Sync failed: " + response.data.error);
            }
        } catch (error) {
            console.error('Sync error:', error);
            toast.error("Failed to synchronize events.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('CRITICAL_ACTION: PERMANENTLY_DELETE_EVENT_NODE? This procedure is irreversible.')) return;
        try {
            await axios.delete(`${API_URL}/operations/events/${id}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Event node decommissioned successfully.");
            fetchEvents();
        } catch (error) {
            toast.error("Failed to terminate event node.");
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
                toast.success("Operational parameters updated.");
            } else {
                await axios.post(`${API_URL}/operations/events/`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success("New operational node initialized.");
            }
            setShowForm(false);
            fetchEvents();
        } catch (error) {
            console.error('Save error:', error);
            toast.error("Protocol failure: Unable to synchronize changes.");
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
        <div className="space-y-12 pb-20">
            {/* Header */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10 relative">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-px w-8 bg-blue-500/40" />
                        <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.5em]">Command_Center</span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-white uppercase tracking-[0.1em]">Event_Lifecycle_Manager</h1>
                        <p className="text-[11px] text-slate-500 mt-2 font-mono uppercase tracking-tight">
                            Active_Operations: <span className="text-blue-500">{events.length}</span> // Filtered: <span className="text-white">{filteredEvents.length}</span>
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 w-full xl:w-auto">
                    <div className="relative group flex-1 xl:flex-none xl:min-w-[400px]">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700 group-focus-within:text-blue-500 transition-colors z-10" />
                        <input
                            type="text"
                            placeholder="SCAN_OPERATIONS..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-14 w-full bg-white/[0.01] border border-white/[0.05] rounded-[1.25rem] pl-14 pr-6 text-xs font-black text-white placeholder:text-slate-800 focus:outline-none focus:bg-white/[0.03] focus:border-white/[0.1] transition-all uppercase tracking-widest"
                        />
                    </div>
                    <button
                        onClick={handleSync}
                        className="h-14 px-8 bg-purple-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-[1.25rem] flex items-center gap-3 hover:bg-purple-500 transition-all shadow-[0_12px_24px_rgba(168,85,247,0.3)] hover:-translate-y-0.5"
                    >
                        <RotateCcw size={16} strokeWidth={3} />
                        SYNC_EVENTS
                    </button>
                    <button
                        onClick={handleCreate}
                        className="h-14 px-8 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-[1.25rem] flex items-center gap-3 hover:bg-blue-500 transition-all shadow-[0_12px_24px_rgba(37,99,235,0.3)] hover:-translate-y-0.5"
                    >
                        <Plus size={16} strokeWidth={3} />
                        INITIALIZE_NODE
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="relative z-0">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-80 bg-white/[0.02] border border-white/[0.05] rounded-[2.5rem] animate-pulse" />
                        ))}
                    </div>
                ) : filteredEvents.length === 0 ? (
                    <div className="py-40 flex flex-col items-center justify-center opacity-20 gap-8">
                        <SearchX className="w-20 h-20 text-slate-600" strokeWidth={1} />
                        <div className="space-y-2 text-center">
                            <p className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Zero_Nodes_Detected</p>
                            <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Awaiting sector population or expansion of query parameters</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                        {filteredEvents.map((event, idx) => (
                            <EventCard
                                key={event.id}
                                event={event}
                                index={idx}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Form Slide-over */}
            <AnimatePresence>
                {showForm && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowForm(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[1000]"
                        />
                        <motion.div
                            initial={{ x: '100%', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '100%', opacity: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 25 }}
                            className="fixed right-0 top-0 bottom-0 w-full max-w-3xl bg-[#030303] border-l border-white/[0.05] shadow-[0_0_100px_rgba(37,99,235,0.1)] z-[1001] overflow-hidden flex flex-col"
                        >
                            <div className="absolute top-0 right-0 w-full h-[300px] bg-gradient-to-b from-blue-600/[0.03] to-transparent pointer-events-none" />

                            <div className="p-10 border-b border-white/[0.05] flex items-center justify-between relative z-10">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                        <span className="text-[8px] font-black text-blue-500 uppercase tracking-[0.5em]">Protocol_Config</span>
                                    </div>
                                    <h2 className="text-2xl font-black text-white uppercase tracking-[0.1em]">
                                        {isEditing ? 'RECONFIGURE_NODE' : 'INITIALIZE_SEQUENCE'}
                                    </h2>
                                </div>
                                <button onClick={() => setShowForm(false)} className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/[0.08] transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-10 space-y-12 relative z-10 custom-scrollbar">
                                <form id="eventForm" onSubmit={handleSubmit} className="space-y-16 pb-20">

                                    {/* CORE DATA */}
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-4 text-slate-600">
                                            <Database size={14} className="text-blue-500" />
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">Core_Data_Parameters</h3>
                                            <div className="h-px flex-1 bg-white/[0.03]" />
                                        </div>
                                        <div className="grid grid-cols-1 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-[9px] font-black text-slate-700 uppercase tracking-[0.2em] ml-1">Title_Signature</label>
                                                <input required name="title" value={formData.title} onChange={handleChange} className="w-full bg-white/[0.01] border border-white/[0.05] rounded-2xl p-5 text-sm font-black text-white focus:border-blue-500/30 focus:bg-white/[0.02] focus:outline-none transition-all placeholder:text-slate-900 uppercase tracking-widest" placeholder="NODE_IDENTIFIER..." />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[9px] font-black text-slate-700 uppercase tracking-[0.2em] ml-1">Objective_Description</label>
                                                <textarea required name="description" value={formData.description} onChange={handleChange} rows={5} className="w-full bg-white/[0.01] border border-white/[0.05] rounded-2xl p-5 text-slate-400 font-medium text-xs focus:border-blue-500/30 focus:bg-white/[0.02] focus:outline-none transition-all placeholder:text-slate-900 leading-relaxed" placeholder="DEFINE_OBJECTIVES..." />
                                            </div>
                                            <div className="grid grid-cols-2 gap-8">
                                                <div className="space-y-3">
                                                    <label className="text-[9px] font-black text-slate-700 uppercase tracking-[0.2em] ml-1">Classification</label>
                                                    <input required name="category" value={formData.category} onChange={handleChange} className="w-full bg-white/[0.01] border border-white/[0.05] rounded-2xl p-5 text-xs font-black text-white focus:border-blue-500/30 uppercase tracking-widest" placeholder="WORKSHOP..." />
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[9px] font-black text-slate-700 uppercase tracking-[0.2em] ml-1">Sector_Location</label>
                                                    <input required name="venue" value={formData.venue} onChange={handleChange} className="w-full bg-white/[0.01] border border-white/[0.05] rounded-2xl p-5 text-xs font-black text-white focus:border-blue-500/30 uppercase tracking-widest" placeholder="AUDITORIUM_01..." />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* TEMPORAL ARCS */}
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-4 text-slate-600">
                                            <Clock size={14} className="text-pink-500" />
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">Temporal_Registry</h3>
                                            <div className="h-px flex-1 bg-white/[0.03]" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-[9px] font-black text-slate-700 uppercase tracking-[0.2em] ml-1">Event_Timestamp</label>
                                                <input required type="datetime-local" name="event_date" value={formData.event_date} onChange={handleChange} className="w-full bg-white/[0.01] border border-white/[0.05] rounded-2xl p-5 text-white text-xs font-mono focus:border-blue-500/30 outline-none" />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[9px] font-black text-slate-700 uppercase tracking-[0.2em] ml-1">Capacity_Limit</label>
                                                <input required type="number" name="registration_limit" value={formData.registration_limit} onChange={handleChange} className="w-full bg-white/[0.01] border border-white/[0.05] rounded-2xl p-5 text-white text-xs font-mono focus:border-blue-500/30" />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[9px] font-black text-slate-700 uppercase tracking-[0.2em] ml-1">Registry_Open</label>
                                                <input required type="datetime-local" name="registration_start" value={formData.registration_start} onChange={handleChange} className="w-full bg-white/[0.01] border border-white/[0.05] rounded-2xl p-5 text-white text-xs font-mono focus:border-blue-500/30 outline-none" />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[9px] font-black text-slate-700 uppercase tracking-[0.2em] ml-1">Registry_Final</label>
                                                <input required type="datetime-local" name="registration_end" value={formData.registration_end} onChange={handleChange} className="w-full bg-white/[0.01] border border-white/[0.05] rounded-2xl p-5 text-white text-xs font-mono focus:border-blue-500/30 outline-none" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* SECURITY & ACCESS */}
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-4 text-slate-600">
                                            <Shield size={14} className="text-emerald-500" />
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">Node_Security_Protocol</h3>
                                            <div className="h-px flex-1 bg-white/[0.03]" />
                                        </div>

                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="flex items-center justify-between p-6 rounded-[1.5rem] bg-white/[0.01] border border-white/[0.05] hover:bg-white/[0.02] transition-colors group/row">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black text-white uppercase tracking-widest">Registry_Enabled</p>
                                                    <p className="text-[8px] text-slate-700 font-mono uppercase tracking-tight">Allows Identity Nodes to associate with this Operational Node</p>
                                                </div>
                                                <Switch checked={formData.is_registration_open} onChange={() => setFormData(p => ({ ...p, is_registration_open: !p.is_registration_open }))} />
                                            </div>

                                            <div className="flex items-center justify-between p-6 rounded-[1.5rem] bg-white/[0.01] border border-white/[0.05] hover:bg-white/[0.02] transition-colors">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black text-white uppercase tracking-widest">Resource_Exchange_Required</p>
                                                    <p className="text-[8px] text-slate-700 font-mono uppercase tracking-tight">Registration requires credit authorization</p>
                                                </div>
                                                <Switch checked={formData.requires_payment} onChange={() => setFormData(p => ({ ...p, requires_payment: !p.requires_payment }))} />
                                            </div>

                                            {formData.requires_payment && (
                                                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-8 rounded-[1.5rem] bg-blue-500/[0.02] border border-blue-500/10 space-y-4">
                                                    <label className="text-[9px] font-black text-blue-500 uppercase tracking-[0.3em]">Resource_Amount (INR)</label>
                                                    <div className="flex items-baseline gap-3">
                                                        <span className="text-xl font-black text-blue-500">₹</span>
                                                        <input type="number" name="payment_amount" value={formData.payment_amount} onChange={handleChange} className="w-full bg-transparent border-none text-3xl font-black text-white focus:outline-none placeholder:text-slate-900" placeholder="0.00" />
                                                    </div>
                                                </motion.div>
                                            )}

                                            <div className="flex items-center justify-between p-6 rounded-[1.5rem] bg-white/[0.01] border border-white/[0.05] hover:bg-white/[0.02] transition-colors">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black text-white uppercase tracking-widest">Multi_Link_Operation</p>
                                                    <p className="text-[8px] text-slate-700 font-mono uppercase tracking-tight">Enable tactical unit clustering (Teams)</p>
                                                </div>
                                                <Switch checked={formData.is_team_event} onChange={() => setFormData(p => ({ ...p, is_team_event: !p.is_team_event }))} />
                                            </div>

                                            {formData.is_team_event && (
                                                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-8 rounded-[1.5rem] bg-purple-500/[0.02] border border-purple-500/10 grid grid-cols-2 gap-8">
                                                    <div className="space-y-4">
                                                        <label className="text-[9px] font-black text-purple-500 uppercase tracking-[0.3em]">Min_Unit_Size</label>
                                                        <input type="number" name="team_size_min" value={formData.team_size_min} onChange={handleChange} className="w-full bg-white/[0.02] border border-purple-500/10 rounded-xl p-4 text-white text-center font-black" />
                                                    </div>
                                                    <div className="space-y-4">
                                                        <label className="text-[9px] font-black text-purple-500 uppercase tracking-[0.3em]">Max_Unit_Size</label>
                                                        <input type="number" name="team_size_max" value={formData.team_size_max} onChange={handleChange} className="w-full bg-white/[0.02] border border-purple-500/10 rounded-xl p-4 text-white text-center font-black" />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                </form>
                            </div>

                            <div className="p-10 border-t border-white/[0.05] bg-black flex gap-6 relative z-10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
                                <button type="button" onClick={() => setShowForm(false)} className="px-10 py-5 rounded-2xl bg-white/[0.03] text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] hover:bg-white/[0.08] hover:text-white transition-all">
                                    ABORT_SEQUENCE
                                </button>
                                <button type="submit" form="eventForm" className="flex-1 px-10 py-5 bg-blue-600 rounded-2xl text-[9px] font-black text-white uppercase tracking-[0.3em] hover:bg-blue-500 transition-all shadow-[0_12px_30px_rgba(37,99,235,0.4)] flex items-center justify-center gap-3">
                                    <Save size={16} />
                                    {isEditing ? 'UPDATE_GRID_DATA' : 'COMMIT_NEW_NODE'}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

const EventCard = ({ event, onEdit, onDelete, index }) => {
    const isPast = new Date(event.event_date) < new Date();
    const progress = Math.min(((event.registrations?.length || 0) / event.registration_limit) * 100, 100);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            className="group relative flex flex-col bg-white/[0.01] border border-white/[0.03] rounded-[2.5rem] overflow-hidden hover:border-blue-500/20 hover:bg-white/[0.02] transition-all duration-700"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/[0.05] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

            <div className="p-10 flex flex-col h-full relative z-10">
                {/* Header Section */}
                <div className="flex items-start justify-between mb-10">
                    <div className="flex flex-col gap-3">
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-[0.3em] border ${event.is_registration_open ? 'bg-emerald-500/[0.03] text-emerald-500 border-emerald-500/10' : 'bg-rose-500/[0.03] text-rose-500 border-rose-500/10'}`}>
                            <div className={`w-1 h-1 rounded-full ${event.is_registration_open ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                            {event.is_registration_open ? 'OPS_OPEN' : 'OPS_LOCKED'}
                        </div>
                        <span className="text-[9px] font-black text-blue-500/40 uppercase tracking-[0.4em] px-1">{event.category}</span>
                    </div>

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <button onClick={() => onEdit(event)} className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] text-slate-500 hover:text-white hover:bg-blue-600 transition-all flex items-center justify-center">
                            <Edit2 size={14} />
                        </button>
                        <button onClick={() => onDelete(event.id)} className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] text-slate-500 hover:text-white hover:bg-rose-600 transition-all flex items-center justify-center">
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>

                {/* Content Section */}
                <div className="space-y-6 flex-1">
                    <h3 className="text-xl font-black text-white uppercase tracking-tight leading-tight group-hover:text-blue-500 transition-colors duration-500">
                        {event.title}
                    </h3>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-slate-400 group-hover:text-slate-300 transition-colors">
                            <div className="w-7 h-7 rounded-lg bg-white/[0.03] border border-white/[0.05] flex items-center justify-center">
                                <Calendar size={12} className="text-blue-500/60" />
                            </div>
                            <span className="text-[10px] font-mono font-black uppercase tracking-tight">
                                {new Date(event.event_date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }).toUpperCase()}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-400 group-hover:text-slate-300 transition-colors">
                            <div className="w-7 h-7 rounded-lg bg-white/[0.03] border border-white/[0.05] flex items-center justify-center">
                                <MapPin size={12} className="text-pink-500/60" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{event.venue}</span>
                        </div>
                    </div>
                </div>

                {/* Registry Analytics */}
                <div className="mt-12 pt-8 border-t border-white/[0.05] space-y-5">
                    <div className="flex items-end justify-between">
                        <div className="space-y-1">
                            <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.4em]">REGISTRY_LOAD</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-black text-white tabular-nums tracking-tighter">{event.registrations?.length || '0'}</span>
                                <span className="text-[10px] text-slate-800 font-mono">/ {event.registration_limit}</span>
                            </div>
                        </div>
                        <div className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest ${progress >= 100 ? 'bg-rose-500/10 text-rose-500' : 'bg-blue-600/10 text-blue-500'}`}>
                            {Math.round(progress)}%_UTILIZED
                        </div>
                    </div>

                    <div className="h-1.5 w-full bg-white/[0.02] border border-white/[0.05] rounded-full overflow-hidden p-[2px]">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                            className={`h-full rounded-full relative ${progress >= 100 ? 'bg-rose-500' : 'bg-blue-600'}`}
                        >
                            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] animate-[shimmer_2s_infinite]" />
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="px-10 py-5 bg-white/[0.01] border-t border-white/[0.03] flex items-center justify-between group-hover:bg-white/[0.03] transition-colors duration-500">
                <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-7 h-7 rounded-full bg-slate-900 border-2 border-[#030303] flex items-center justify-center overflow-hidden">
                                <Users size={12} className="text-slate-700" />
                            </div>
                        ))}
                    </div>
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">+ {event.registrations?.length || 0} LINKED_NODES</span>
                </div>
                <button
                    onClick={() => onEdit(event)}
                    className="p-2 text-slate-800 hover:text-blue-500 hover:translate-x-1 transition-all"
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        </motion.div>
    );
};

const Switch = ({ checked, onChange }) => (
    <button
        type="button"
        onClick={onChange}
        className={`w-14 h-8 rounded-[1rem] relative transition-all duration-500 border-2 ${checked ? 'bg-blue-600/20 border-blue-500/40' : 'bg-white/[0.02] border-white/[0.1]'}`}
    >
        <motion.div
            animate={{
                x: checked ? 26 : 4,
                scale: checked ? 1.1 : 1,
                backgroundColor: checked ? '#3b82f6' : '#334155'
            }}
            className={`absolute top-1.5 w-4 h-4 rounded-full shadow-lg`}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
        />
    </button>
);

export default AdminEvents;
