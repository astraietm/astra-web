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

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) return;
        try {
            await axios.delete(`${API_URL}/operations/events/${id}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Event deleted successfully.");
            fetchEvents();
        } catch (error) {
            toast.error("Failed to delete event.");
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
                toast.success("Event updated successfully.");
            } else {
                await axios.post(`${API_URL}/operations/events/`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success("Event created successfully.");
            }
            setShowForm(false);
            fetchEvents();
        } catch (error) {
            console.error('Save error:', error);
            toast.error("Failed to save event. Please check your inputs.");
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
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 relative">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-px w-12 bg-blue-500" />
                        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em]">Administration</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white uppercase tracking-wider relative z-10">Events Management</h1>
                        <p className="text-sm text-slate-400 mt-2 max-w-md leading-relaxed">
                            Create and manage <span className="text-white font-medium">{filteredEvents.length}</span> active events.
                        </p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="relative group hidden lg:block">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors z-10" />
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-12 bg-white/[0.05] border border-white/[0.1] rounded-xl py-4 pl-12 pr-6 w-80 text-sm font-medium text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-all"
                        />
                    </div>
                    <button
                        onClick={handleCreate}
                        className="relative group overflow-hidden"
                    >
                        <div className="relative h-12 px-8 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-3 hover:bg-blue-500 transition-all shadow-lg">
                            <Plus size={18} strokeWidth={2.5} />
                            Create Event
                        </div>
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="relative">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-6">
                        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                        <p className="text-sm font-medium text-slate-500">Loading events...</p>
                    </div>
                ) : filteredEvents.length === 0 ? (
                    <div className="py-40 flex flex-col items-center justify-center opacity-40 gap-4">
                        <SearchX className="w-16 h-16 text-slate-600 stroke-1" />
                        <div className="text-sm font-medium text-slate-500">No events found matching your criteria</div>
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

            {/* Form */}
            <AnimatePresence>
                {showForm && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowForm(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                        />
                        <motion.div
                            initial={{ x: '100%', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '100%', opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-[#0a0a0a] border-l border-white/[0.1] shadow-2xl z-[101] overflow-hidden flex flex-col"
                        >
                            <div className="p-8 border-b border-white/[0.1] flex items-center justify-between relative z-10 bg-[#0a0a0a]">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-bold text-white tracking-tight">
                                        {isEditing ? 'Edit Event' : 'Create New Event'}
                                    </h2>
                                    <p className="text-sm text-slate-400">Configure event details and settings</p>
                                </div>
                                <button onClick={() => setShowForm(false)} className="w-10 h-10 rounded-full bg-white/[0.05] flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.1] transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-10 relative z-10 custom-scrollbar">
                                <form id="eventForm" onSubmit={handleSubmit} className="space-y-12 pb-10">
                                    
                                    {/* Basic Info */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 text-slate-300 pb-2 border-b border-white/[0.05]">
                                            <Database size={18} />
                                            <h3 className="text-sm font-bold uppercase tracking-wider">Basic Information</h3>
                                        </div>
                                        <div className="grid grid-cols-1 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide ml-1">Event Title</label>
                                                <input required name="title" value={formData.title} onChange={handleChange} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 text-white font-medium focus:border-blue-500/50 focus:bg-white/[0.05] focus:outline-none transition-all placeholder:text-slate-600" placeholder="e.g. Annual Tech Summit" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide ml-1">Description</label>
                                                <textarea required name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 text-slate-200 font-normal focus:border-blue-500/50 focus:bg-white/[0.05] focus:outline-none transition-all placeholder:text-slate-600 leading-relaxed" placeholder="Enter full event description..." />
                                            </div>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide ml-1">Category</label>
                                                    <input required name="category" value={formData.category} onChange={handleChange} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 text-white text-sm focus:border-blue-500/50 focus:bg-white/[0.05] focus:outline-none transition-all" placeholder="e.g. Workshop" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide ml-1">Venue</label>
                                                    <input required name="venue" value={formData.venue} onChange={handleChange} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 text-white text-sm focus:border-blue-500/50 focus:bg-white/[0.05] focus:outline-none transition-all" placeholder="e.g. Main Auditorium" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Schedule */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 text-slate-300 pb-2 border-b border-white/[0.05]">
                                            <Clock size={18} />
                                            <h3 className="text-sm font-bold uppercase tracking-wider">Schedule & Capacity</h3>
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide ml-1">Event Date & Time</label>
                                                <input required type="datetime-local" name="event_date" value={formData.event_date} onChange={handleChange} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 text-white text-sm focus:border-blue-500/50 focus:bg-white/[0.05] outline-none" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide ml-1">Max Capacity</label>
                                                <input required type="number" name="registration_limit" value={formData.registration_limit} onChange={handleChange} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 text-white text-sm focus:border-blue-500/50 focus:bg-white/[0.05]" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide ml-1">Registration Opens</label>
                                                <input required type="datetime-local" name="registration_start" value={formData.registration_start} onChange={handleChange} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 text-white text-sm focus:border-blue-500/50 focus:bg-white/[0.05] outline-none" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide ml-1">Registration Closes</label>
                                                <input required type="datetime-local" name="registration_end" value={formData.registration_end} onChange={handleChange} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 text-white text-sm focus:border-blue-500/50 focus:bg-white/[0.05] outline-none" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Settings */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 text-slate-300 pb-2 border-b border-white/[0.05]">
                                            <Shield size={18} />
                                            <h3 className="text-sm font-bold uppercase tracking-wider">Access & Permissions</h3>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="flex items-center justify-between p-5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors">
                                                <div className="space-y-1">
                                                    <p className="text-sm font-bold text-white">Registration Status</p>
                                                    <p className="text-xs text-slate-500">Allow users to register for this event</p>
                                                </div>
                                                <Switch checked={formData.is_registration_open} onChange={() => setFormData(p => ({ ...p, is_registration_open: !p.is_registration_open }))} />
                                            </div>

                                            <div className="flex items-center justify-between p-5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors">
                                                <div className="space-y-1">
                                                    <p className="text-sm font-bold text-white">Paid Event</p>
                                                    <p className="text-xs text-slate-500">Require payment for registration</p>
                                                </div>
                                                <Switch checked={formData.requires_payment} onChange={() => setFormData(p => ({ ...p, requires_payment: !p.requires_payment }))} />
                                            </div>

                                            {formData.requires_payment && (
                                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-6 rounded-xl bg-blue-500/5 border border-blue-500/10 space-y-3">
                                                    <label className="text-xs font-bold text-blue-400 uppercase tracking-wide">Fee Amount (INR)</label>
                                                    <input type="number" name="payment_amount" value={formData.payment_amount} onChange={handleChange} className="w-full bg-black/40 border border-blue-500/20 rounded-lg p-3 text-xl font-bold text-white focus:border-blue-500/40 outline-none" />
                                                </motion.div>
                                            )}

                                            <div className="flex items-center justify-between p-5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors">
                                                <div className="space-y-1">
                                                    <p className="text-sm font-bold text-white">Team Event</p>
                                                    <p className="text-xs text-slate-500">Enable team-based registration capabilities</p>
                                                </div>
                                                <Switch checked={formData.is_team_event} onChange={() => setFormData(p => ({ ...p, is_team_event: !p.is_team_event }))} />
                                            </div>

                                            {formData.is_team_event && (
                                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-6 rounded-xl bg-purple-500/5 border border-purple-500/10 grid grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-purple-400 uppercase tracking-wide">Min Size</label>
                                                        <input type="number" name="team_size_min" value={formData.team_size_min} onChange={handleChange} className="w-full bg-black/40 border border-purple-500/20 rounded-lg p-3 text-white text-center" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-purple-400 uppercase tracking-wide">Max Size</label>
                                                        <input type="number" name="team_size_max" value={formData.team_size_max} onChange={handleChange} className="w-full bg-black/40 border border-purple-500/20 rounded-lg p-3 text-white text-center" />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                </form>
                            </div>

                            <div className="p-8 border-t border-white/[0.1] bg-[#0a0a0a] flex gap-4 relative z-10">
                                <button type="button" onClick={() => setShowForm(false)} className="px-8 py-4 rounded-xl bg-white/[0.05] text-xs font-bold text-slate-300 uppercase tracking-wider hover:bg-white/[0.1] transition-all">
                                    Cancel
                                </button>
                                <button type="submit" form="eventForm" className="flex-1 px-8 py-4 bg-blue-600 rounded-xl text-xs font-bold text-white uppercase tracking-wider hover:bg-blue-500 transition-all shadow-lg flex items-center justify-center gap-2">
                                    <Save size={18} />
                                    {isEditing ? 'Save Changes' : 'Create Event'}
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
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative flex flex-col bg-[#0a0a0a] border border-white/[0.08] rounded-3xl overflow-hidden hover:border-white/[0.2] transition-all duration-300"
        >
            <div className="p-8 flex flex-col h-full z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${event.is_registration_open ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
                            {event.is_registration_open ? 'Active' : 'Closed'}
                        </div>
                        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{event.category}</span>
                    </div>

                    <div className="flex gap-2">
                        <button onClick={() => onEdit(event)} className="p-2 rounded-lg bg-white/[0.03] text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all">
                            <Edit2 size={16} />
                        </button>
                        <button onClick={() => onDelete(event.id)} className="p-2 rounded-lg bg-white/[0.03] text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all">
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-4 flex-1">
                    <h3 className="text-2xl font-bold text-white leading-tight group-hover:text-blue-400 transition-colors">
                        {event.title}
                    </h3>

                    <div className="flex flex-col gap-2 text-sm text-slate-400">
                        <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-blue-500" />
                            {new Date(event.event_date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-pink-500" />
                            {event.venue}
                        </div>
                    </div>
                </div>

                {/* Footer / Stats */}
                <div className="mt-8 pt-6 border-t border-white/[0.05] space-y-4">
                    <div className="flex items-end justify-between">
                        <div>
                            <span className="text-xs font-medium text-slate-500 block mb-1">Registrations</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-bold text-white">{event.registrations?.length || '0'}</span>
                                <span className="text-xs text-slate-600 font-medium">/ {event.registration_limit}</span>
                            </div>
                        </div>
                        <div className={`px-3 py-1 rounded-lg text-xs font-bold ${progress >= 100 ? 'bg-rose-500/10 text-rose-500' : 'bg-blue-500/10 text-blue-500'}`}>
                            {Math.round(progress)}% Full
                        </div>
                    </div>
                    
                    <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className={`h-full rounded-full ${progress >= 100 ? 'bg-rose-500' : 'bg-blue-500'}`}
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const Switch = ({ checked, onChange }) => (
    <button
        type="button"
        onClick={onChange}
        className={`w-12 h-7 rounded-full relative transition-all duration-300 border ${checked ? 'bg-blue-600 border-blue-500' : 'bg-white/[0.05] border-white/10'}`}
    >
        <motion.div
            animate={{ x: checked ? 20 : 2 }}
            className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm`}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
    </button>
);

export default AdminEvents;
