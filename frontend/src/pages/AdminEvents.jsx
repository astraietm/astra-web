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
    Shield
} from 'lucide-react';

const AdminEvents = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL;

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        event_date: '',
        venue: '',
        image: '',
        category: '',
        registration_start: '',
        registration_end: '',
        registration_limit: 100,
        is_registration_open: true
    });

    useEffect(() => {
        if (user && !user.is_staff) {
            navigate('/');
        }
        fetchEvents();
    }, [user, navigate]);

    const fetchEvents = async () => {
        try {
            const response = await axios.get(`${API_URL}/operations/events/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEvents(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching events:', error);
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this operation?')) return;
        try {
            await axios.delete(`${API_URL}/operations/events/${id}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchEvents();
        } catch (error) {
            console.error('Error deleting event:', error);
            alert('Failed to delete event');
        }
    };

    const handleEdit = (event) => {
        setCurrentEvent(event);
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
            is_registration_open: event.is_registration_open
        });
        setIsEditing(true);
    };

    const handleCreate = () => {
        setCurrentEvent(null);
        setFormData({
            title: '',
            description: '',
            event_date: '',
            venue: '',
            image: '',
            category: '',
            registration_start: '',
            registration_end: '',
            registration_limit: 100,
            is_registration_open: true
        });
        setIsEditing(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentEvent) {
                await axios.put(`${API_URL}/operations/events/${currentEvent.id}/`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(`${API_URL}/operations/events/`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            setIsEditing(false);
            fetchEvents();
        } catch (error) {
            console.error('Error saving event:', error);
            const errorMsg = error.response?.data 
                ? (typeof error.response.data === 'object' ? JSON.stringify(error.response.data) : error.response.data)
                : 'Failed to save event';
            alert(errorMsg);
        }
    };

    if (loading) return <div className="text-white text-center mt-20">Initializing...</div>;

    return (
        <div className="space-y-8 pb-12">
            {/* Context Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-widest uppercase flex items-center gap-3">
                         <Calendar className="text-primary w-6 h-6" />
                         Operation_Manager
                    </h1>
                    <p className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.3em] mt-1">Configure Mission Parameters & Protocols</p>
                </div>
                <button 
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-black rounded-xl font-black shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all uppercase tracking-widest text-xs"
                >
                    <Plus className="w-4 h-4" />
                    New_Operation
                </button>
            </div>


                {isEditing ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#050505] border border-white/10 rounded-3xl p-8 mb-20 relative z-10 shadow-2xl"
                    >
                        <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/10">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                {currentEvent ? <Edit2 className="text-primary" /> : <Plus className="text-primary" />}
                                {currentEvent ? 'Edit Operation Protocol' : 'Initialize New Operation'}
                            </h2>
                            <button onClick={() => setIsEditing(false)} className="text-white/50 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Operation Title</label>
                                    <input 
                                        type="text" 
                                        value={formData.title}
                                        onChange={e => setFormData({...formData, title: e.target.value})}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-all font-mono text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Category</label>
                                    <input 
                                        type="text" 
                                        value={formData.category}
                                        onChange={e => setFormData({...formData, category: e.target.value})}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-all font-mono text-sm"
                                        placeholder="WORKSHOP, SEMINAR, CTF..."
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Venue / Location</label>
                                    <input 
                                        type="text" 
                                        value={formData.venue}
                                        onChange={e => setFormData({...formData, venue: e.target.value})}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-all font-mono text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Event Date</label>
                                    <input 
                                        type="datetime-local" 
                                        value={formData.event_date}
                                        onChange={e => setFormData({...formData, event_date: e.target.value})}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-all font-mono text-sm text-white-calendar [color-scheme:dark]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Cover Image URL</label>
                                    <input 
                                        type="url" 
                                        value={formData.image}
                                        onChange={e => setFormData({...formData, image: e.target.value})}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-all font-mono text-sm"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-6 h-full">
                                <div className="border border-white/10 rounded-xl p-4 bg-white/[0.02]">
                                    <h3 className="text-primary font-mono text-sm uppercase mb-4 opacity-80">Registration Protocols</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Start Time</label>
                                            <input 
                                                type="datetime-local" 
                                                value={formData.registration_start}
                                                onChange={e => setFormData({...formData, registration_start: e.target.value})}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-all font-mono text-sm text-white-calendar [color-scheme:dark]"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">End Time</label>
                                            <input 
                                                type="datetime-local" 
                                                value={formData.registration_end}
                                                onChange={e => setFormData({...formData, registration_end: e.target.value})}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-all font-mono text-sm text-white-calendar [color-scheme:dark]"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Capacity Limit</label>
                                            <input 
                                                type="number" 
                                                value={formData.registration_limit}
                                                onChange={e => setFormData({...formData, registration_limit: parseInt(e.target.value)})}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-all font-mono text-sm"
                                                min="1"
                                                required
                                            />
                                        </div>
                                        <div className="flex items-center justify-between pt-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-white/40">Registration Status</label>
                                            <button 
                                                type="button"
                                                onClick={() => setFormData({...formData, is_registration_open: !formData.is_registration_open})}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                                    formData.is_registration_open 
                                                    ? 'bg-green-500/20 text-green-500 border border-green-500/30' 
                                                    : 'bg-red-500/20 text-red-500 border border-red-500/30'
                                                }`}
                                            >
                                                {formData.is_registration_open ? <ToggleRight /> : <ToggleLeft />}
                                                {formData.is_registration_open ? 'OPEN' : 'CLOSED'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex-1 flex flex-col min-h-[200px]">
                                    <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Briefing / Description</label>
                                    <textarea 
                                        value={formData.description}
                                        onChange={e => setFormData({...formData, description: e.target.value})}
                                        className="w-full flex-1 bg-black/40 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-primary/50 transition-all font-mono text-sm resize-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-2 flex justify-end gap-4 mt-4 pt-4 border-t border-white/10">
                                <button 
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-6 py-3 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-all uppercase tracking-wider text-sm font-medium"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="px-8 py-3 bg-primary text-black rounded-xl font-bold hover:bg-primary-hover shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all flex items-center gap-2 uppercase tracking-wider text-sm"
                                >
                                    <Save size={18} />
                                    Save Protocol
                                </button>
                            </div>
                        </form>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.isArray(events) && events.map(event => (
                            <motion.div 
                                key={event.id}
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden group hover:border-white/20 transition-all"
                            >
                                <div className="h-48 overflow-hidden relative">
                                    <img 
                                        src={event.image || 'https://via.placeholder.com/400x200'} 
                                        alt={event.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 right-4 bg-black/80 backdrop-blur px-3 py-1 rounded-full border border-white/10 text-primary text-xs font-bold uppercase tracking-wider">
                                        {event.category}
                                    </div>
                                    <div className={`absolute bottom-4 left-4 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
                                        event.is_registration_open 
                                        ? 'bg-green-500/20 text-green-500 border-green-500/30'
                                        : 'bg-red-500/20 text-red-500 border-red-500/30'
                                    }`}>
                                        <div className={`w-2 h-2 rounded-full ${event.is_registration_open ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                                        {event.is_registration_open ? 'Reg Open' : 'Reg Closed'}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                                    <div className="space-y-2 text-sm text-white/50 mb-6 font-mono">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-primary" />
                                            {new Date(event.event_date).toLocaleString()}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users size={14} className="text-primary" />
                                            Max Capacity: {event.registration_limit}
                                        </div>
                                    </div>
                                    <div className="flex gap-3 pt-4 border-t border-white/10">
                                        <button 
                                            onClick={() => handleEdit(event)}
                                            className="flex-1 flex items-center justify-center gap-2 py-2 bg-white/5 rounded-lg text-sm font-medium hover:bg-white/10 hover:text-primary transition-all"
                                        >
                                            <Edit2 size={16} />
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(event.id)}
                                            className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-500/10 rounded-lg text-sm font-medium text-red-500/80 hover:bg-red-500/20 hover:text-red-500 transition-all"
                                        >
                                            <Trash2 size={16} />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
        </div>
    );
};

export default AdminEvents;
