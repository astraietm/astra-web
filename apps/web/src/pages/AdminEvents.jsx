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

    const API_URL = import.meta.env.VITE_API_URL;

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
            // Sort by date descending
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

    // Filtered Events
    const filteredEvents = events.filter(ev => 
        ev.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        ev.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-[#050505] overflow-hidden font-sans text-gray-200">
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full relative z-10">
                
                {/* Header */}
                <header className="px-8 py-6 border-b border-white/10 bg-[#0A0A0A]/80 backdrop-blur-md flex justify-between items-center z-20">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                            <Terminal className="text-primary w-8 h-8" />
                            Events Control
                        </h1>
                        <p className="text-sm text-gray-500 font-mono mt-1">
                            MANAGE ACTIVE OPERATIONS & PARAMETERS
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <input 
                                type="text" 
                                placeholder="Search Protocols..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 pl-10 w-64 text-sm focus:outline-none focus:border-primary/50 transition-all text-white placeholder-gray-600"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                        </div>

                        <button 
                            onClick={handleCreate}
                            className="bg-primary hover:bg-primary/90 text-black font-bold px-6 py-2 rounded-xl flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(0,224,255,0.2)]"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Initialize Event</span>
                        </button>
                    </div>
                </header>

                {/* Content Grid */}
                <div className="flex-1 overflow-y-auto p-8 relative">
                    {/* Background Grid */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" />

                    {loading ? (
                        <div className="flex flex-col h-full items-center justify-center space-y-4">
                            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                            <p className="font-mono text-primary animate-pulse">SYNCING DATABASE...</p>
                        </div>
                    ) : filteredEvents.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50">
                            <Shield className="w-24 h-24 mb-4 stroke-1" />
                            <p className="text-xl font-light">NO OPERATIONS FOUND</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10 pb-20">
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
            </div>

            {/* Slide-over Form */}
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
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-[#0F0F11] border-l border-white/10 shadow-2xl z-[101] overflow-hidden flex flex-col"
                        >
                            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#0A0A0A]">
                                <div>
                                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                        {isEditing ? <Edit2 className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-primary" />}
                                        {isEditing ? 'Modify Protocol' : 'New Directive'}
                                    </h2>
                                    <p className="text-xs text-gray-500 font-mono mt-1">ID: {isEditing ? currentEventId : 'AUTO_GEN'}</p>
                                </div>
                                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                    <X className="w-6 h-6 text-gray-400" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8">
                                <form id="eventForm" onSubmit={handleSubmit} className="space-y-8">
                                    
                                    {/* Basic Info */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                            <div className="w-1 h-4 bg-primary rounded-full" />
                                            Core Data
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="col-span-2">
                                                <label className="block text-xs text-gray-500 mb-1">Operation Title</label>
                                                <input required name="title" value={formData.title} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors" placeholder="e.g. Project Omega" />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-xs text-gray-500 mb-1">Description</label>
                                                <textarea required name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors" placeholder="Brief briefing..." />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Category</label>
                                                <input required name="category" value={formData.category} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors" placeholder="e.g. Workshop" />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Venue</label>
                                                <input required name="venue" value={formData.venue} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors" />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-xs text-gray-500 mb-1">Cover Image URL</label>
                                                <input name="image" value={formData.image} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors text-sm font-mono" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Timing */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                            <div className="w-1 h-4 bg-blue-500 rounded-full" />
                                            Temporal Paramaters
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Event Date</label>
                                                <input required type="datetime-local" name="event_date" value={formData.event_date} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none transition-colors opacity-80" />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Limit</label>
                                                <input required type="number" name="registration_limit" value={formData.registration_limit} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none transition-colors" />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Reg Start</label>
                                                <input required type="datetime-local" name="registration_start" value={formData.registration_start} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none transition-colors opacity-80" />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Reg End</label>
                                                <input required type="datetime-local" name="registration_end" value={formData.registration_end} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none transition-colors opacity-80" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Advanced Settings */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                            <div className="w-1 h-4 bg-purple-500 rounded-full" />
                                            Advanced Config
                                        </h3>
                                        
                                        <div className="bg-white/5 rounded-xl p-4 space-y-4 border border-white/10">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-300">Registration Open</span>
                                                <Switch checked={formData.is_registration_open} onChange={() => setFormData(p => ({...p, is_registration_open: !p.is_registration_open}))} />
                                            </div>
                                            
                                            <div className="h-px bg-white/10" />

                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-300">Requires Payment</span>
                                                <Switch checked={formData.requires_payment} onChange={() => setFormData(p => ({...p, requires_payment: !p.requires_payment}))} />
                                            </div>
                                            {formData.requires_payment && (
                                                <div className="mt-2 pl-4 border-l-2 border-purple-500/50">
                                                    <label className="block text-xs text-gray-500 mb-1">Amount (INR)</label>
                                                    <input type="number" name="payment_amount" value={formData.payment_amount} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white focus:border-purple-500 focus:outline-none transition-colors" />
                                                </div>
                                            )}

                                            <div className="h-px bg-white/10" />

                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-300">Team Event</span>
                                                <Switch checked={formData.is_team_event} onChange={() => setFormData(p => ({...p, is_team_event: !p.is_team_event}))} />
                                            </div>
                                            {formData.is_team_event && (
                                                <div className="grid grid-cols-2 gap-4 mt-2 pl-4 border-l-2 border-purple-500/50">
                                                    <div>
                                                        <label className="block text-xs text-gray-500 mb-1">Min Members</label>
                                                        <input type="number" name="team_size_min" value={formData.team_size_min} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white focus:border-purple-500 focus:outline-none transition-colors" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-gray-500 mb-1">Max Members</label>
                                                        <input type="number" name="team_size_max" value={formData.team_size_max} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white focus:border-purple-500 focus:outline-none transition-colors" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </form>
                            </div>

                            <div className="p-6 border-t border-white/10 bg-[#0A0A0A] flex gap-4">
                                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-semibold">
                                    Abort
                                </button>
                                <button type="submit" form="eventForm" className="flex-1 py-3 rounded-xl bg-primary text-black font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                                    {isEditing ? 'Save Changes' : 'Execute Creation'}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

// Sub-components for cleaner code
const EventCard = ({ event, onEdit, onDelete }) => {
    const isPast = new Date(event.event_date) < new Date();
    
    return (
        <motion.div 
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative bg-[#0F0F11] border border-white/5 hover:border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5"
        >
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${event.is_registration_open ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`} />
                        <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">{event.category}</span>
                    </div>
                    
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => onEdit(event)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-primary transition-colors">
                            <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => onDelete(event.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-primary transition-colors">{event.title}</h3>
                <div className="flex items-center gap-4 text-xs text-gray-500 font-mono mb-6">
                    <span className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" />
                        {new Date(event.event_date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3" />
                        {event.venue}
                    </span>
                    {event.requires_payment && (
                         <span className="flex items-center gap-1.5 text-yellow-500/80">
                            ₹{event.payment_amount}
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                        <span className="block text-gray-500 mb-1">Registrations</span>
                        <span className="text-white font-mono">{event.registrations?.length || '0'} / {event.registration_limit}</span>
                    </div>
                    <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                        <span className="block text-gray-500 mb-1">Status</span>
                        <span className={isPast ? 'text-orange-500' : 'text-green-500'}>{isPast ? 'COMPLETED' : 'ACTIVE'}</span>
                    </div>
                </div>
            </div>
            
             {/* Progress Bar for registrations */}
             <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
                <div 
                    className="h-full bg-primary/50" 
                    style={{ width: `${Math.min(((event.registrations?.length || 0) / event.registration_limit) * 100, 100)}%` }} 
                />
            </div>
        </motion.div>
    );
};

const Switch = ({ checked, onChange }) => (
    <button 
        type="button"
        onClick={onChange}
        className={`w-11 h-6 rounded-full relative transition-colors duration-200 ease-in-out border border-white/10 ${checked ? 'bg-primary' : 'bg-gray-700'}`}
    >
        <span className={`block w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out absolute top-0.5 ${checked ? 'translate-x-6' : 'translate-x-0.5'}`} />
    </button>
);

export default AdminEvents;


