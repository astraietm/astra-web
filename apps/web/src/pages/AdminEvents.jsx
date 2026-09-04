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
    ArrowLeft,
    Save,
    X,
    MapPin,
    Search,
    RotateCcw,
    ChevronRight,
    LayoutGrid,
    List,
    DollarSign,
    Layers
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import PageHeader from '../components/admin/common/PageHeader';
import StatusBadge from '../components/admin/common/StatusBadge';
import EmptyState from '../components/admin/common/EmptyState';
import { TableSkeleton } from '../components/admin/common/LoadingSkeleton';

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
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
    const [activeCategory, setActiveCategory] = useState('All');

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
        category: 'Technical',
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
            toast.success("Synchronizing events...");
            const response = await axios.post(`${API_URL}/operations/sync-events/`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                toast.success(`Sync complete. ${response.data.event_count} events updated.`);
                fetchEvents();
            } else {
                toast.error("Sync failed: " + response.data.error);
            }
        } catch (error) {
            console.error('Sync error:', error);
            toast.error("Failed to synchronize events.");
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
            category: event.category || 'Technical',
            registration_start: event.registration_start ? new Date(event.registration_start).toISOString().slice(0, 16) : '',
            registration_end: event.registration_end ? new Date(event.registration_end).toISOString().slice(0, 16) : '',
            registration_limit: event.registration_limit || 100,
            is_registration_open: event.is_registration_open ?? true,
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
            toast.error("Failed to save changes. Please try again.");
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const categories = ['All', 'Technical', 'Workshops', 'Hackathons', 'Cultural'];

    const filteredEvents = events.filter(ev => {
        const matchesSearch = ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (ev.category && ev.category.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = activeCategory === 'All' || 
            (ev.category && ev.category.toLowerCase() === activeCategory.toLowerCase());
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-6 pb-16">
            {/* Header */}
            <PageHeader
                title="Events"
                subtitle="Manage your events, schedules, capacity, and registration rules."
                breadcrumbs={[{ label: 'Admin', to: '/admin' }, { label: 'Events' }]}
                actions={
                    <div className="flex items-center gap-2.5">
                        <button
                            onClick={handleSync}
                            className="h-9 px-3.5 bg-[#111319] hover:bg-white/[0.06] border border-white/[0.08] text-xs font-semibold text-slate-300 hover:text-white rounded-xl flex items-center gap-2 transition-colors"
                        >
                            <RotateCcw size={14} />
                            <span>Sync</span>
                        </button>
                        <button
                            onClick={handleCreate}
                            className="h-9 px-3.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors shadow-sm"
                        >
                            <Plus size={15} />
                            <span>Create Event</span>
                        </button>
                    </div>
                }
            />

            {/* Filter & Toolbar Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Category Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                                activeCategory === cat
                                    ? 'bg-blue-600/15 text-blue-400 font-semibold border border-blue-500/30'
                                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Search & View Switcher */}
                <div className="flex items-center gap-2.5">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Filter events..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-9 w-full bg-[#111319] border border-white/[0.08] rounded-xl pl-9 pr-3 text-xs font-medium text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/40 transition-colors"
                        />
                    </div>

                    <div className="flex items-center bg-[#111319] border border-white/[0.08] p-0.5 rounded-xl">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white/[0.08] text-white' : 'text-slate-400 hover:text-white'}`}
                            title="Grid View"
                        >
                            <LayoutGrid size={15} />
                        </button>
                        <button
                            onClick={() => setViewMode('table')}
                            className={`p-1.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-white/[0.08] text-white' : 'text-slate-400 hover:text-white'}`}
                            title="Table View"
                        >
                            <List size={15} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content: Grid or Table */}
            {loading ? (
                viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-64 rounded-2xl bg-[#111319] border border-white/[0.06] animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="bg-[#111319] border border-white/[0.06] rounded-2xl overflow-hidden">
                        <TableSkeleton rows={6} cols={5} />
                    </div>
                )
            ) : filteredEvents.length === 0 ? (
                <EmptyState
                    icon={Calendar}
                    title="No events found"
                    description="No events match your current filter criteria. Create an event or adjust search."
                    action={
                        <button
                            onClick={handleCreate}
                            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
                        >
                            <Plus size={14} />
                            <span>Create First Event</span>
                        </button>
                    }
                />
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredEvents.map((event) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-[#111319] border border-white/[0.06] rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/[0.06] text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-white/[0.01]">
                                    <th className="py-3.5 px-6">Event Title</th>
                                    <th className="py-3.5 px-6">Date & Venue</th>
                                    <th className="py-3.5 px-6">Category</th>
                                    <th className="py-3.5 px-6">Capacity</th>
                                    <th className="py-3.5 px-6 text-center">Status</th>
                                    <th className="py-3.5 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.03] text-xs">
                                {filteredEvents.map((event) => {
                                    const capacity = event.registration_limit || 100;
                                    const registered = event.registrations?.length || 0;
                                    const percent = Math.min(100, Math.round((registered / capacity) * 100));

                                    return (
                                        <tr key={event.id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="py-4 px-6 font-semibold text-white">
                                                {event.title}
                                            </td>
                                            <td className="py-4 px-6 text-slate-300">
                                                <div className="space-y-0.5">
                                                    <p>{event.event_date ? new Date(event.event_date).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'TBD'}</p>
                                                    <p className="text-[11px] text-slate-400">{event.venue || 'Main Stage'}</p>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-slate-400">
                                                {event.category || 'General'}
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="space-y-1 w-28">
                                                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                                                        <span>{registered}/{capacity}</span>
                                                        <span>{percent}%</span>
                                                    </div>
                                                    <div className="w-full h-1 bg-white/[0.08] rounded-full overflow-hidden">
                                                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${percent}%` }} />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <StatusBadge status={event.is_registration_open ? 'Registration Open' : 'Registration Closed'} />
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        onClick={() => handleEdit(event)}
                                                        className="p-1.5 rounded-lg hover:bg-white/[0.06] text-slate-400 hover:text-white transition-colors"
                                                        title="Edit Event"
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(event.id)}
                                                        className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors"
                                                        title="Delete Event"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Create / Edit Event Drawer / Modal */}
            <AnimatePresence>
                {showForm && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowForm(false)}
                            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[1000]"
                        />
                        <motion.div
                            initial={{ x: '100%', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '100%', opacity: 0 }}
                            transition={{ type: "spring", stiffness: 220, damping: 25 }}
                            className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-[#0D0F15] border-l border-white/[0.08] shadow-2xl z-[1001] overflow-hidden flex flex-col"
                        >
                            {/* Drawer Header */}
                            <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-bold text-white tracking-tight">
                                        {isEditing ? 'Edit Event Details' : 'Create New Event'}
                                    </h2>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        Configure event parameters, timing, and registration limits.
                                    </p>
                                </div>
                                <button 
                                    onClick={() => setShowForm(false)} 
                                    className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:text-white transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Drawer Form Body */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                <form id="eventForm" onSubmit={handleSubmit} className="space-y-6">
                                    {/* SECTION: BASIC INFO */}
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">General Information</h3>
                                        
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-slate-300">Event Title</label>
                                            <input
                                                required
                                                type="text"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleChange}
                                                placeholder="e.g. Autonomous Robotics Hackathon"
                                                className="w-full bg-[#111319] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/40"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-medium text-slate-300">Category</label>
                                                <select
                                                    name="category"
                                                    value={formData.category}
                                                    onChange={handleChange}
                                                    className="w-full bg-[#111319] border border-white/[0.08] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500/40 cursor-pointer"
                                                >
                                                    <option value="Technical">Technical</option>
                                                    <option value="Workshops">Workshops</option>
                                                    <option value="Hackathons">Hackathons</option>
                                                    <option value="Cultural">Cultural</option>
                                                    <option value="General">General</option>
                                                </select>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-medium text-slate-300">Venue</label>
                                                <input
                                                    type="text"
                                                    name="venue"
                                                    value={formData.venue}
                                                    onChange={handleChange}
                                                    placeholder="e.g. Seminar Hall A"
                                                    className="w-full bg-[#111319] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/40"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-slate-300">Description</label>
                                            <textarea
                                                rows="3"
                                                name="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                placeholder="Short summary of the event..."
                                                className="w-full bg-[#111319] border border-white/[0.08] rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/40 resize-none leading-relaxed"
                                            />
                                        </div>
                                    </div>

                                    {/* SECTION: SCHEDULE & CAPACITY */}
                                    <div className="space-y-4 pt-4 border-t border-white/[0.06]">
                                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Schedule & Capacity</h3>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-medium text-slate-300">Event Date & Time</label>
                                                <input
                                                    type="datetime-local"
                                                    name="event_date"
                                                    value={formData.event_date}
                                                    onChange={handleChange}
                                                    className="w-full bg-[#111319] border border-white/[0.08] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500/40"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-medium text-slate-300">Max Capacity</label>
                                                <input
                                                    type="number"
                                                    name="registration_limit"
                                                    value={formData.registration_limit}
                                                    onChange={handleChange}
                                                    min="1"
                                                    className="w-full bg-[#111319] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500/40"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-medium text-slate-300">Registration Opens</label>
                                                <input
                                                    type="datetime-local"
                                                    name="registration_start"
                                                    value={formData.registration_start}
                                                    onChange={handleChange}
                                                    className="w-full bg-[#111319] border border-white/[0.08] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500/40"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-medium text-slate-300">Registration Closes</label>
                                                <input
                                                    type="datetime-local"
                                                    name="registration_end"
                                                    value={formData.registration_end}
                                                    onChange={handleChange}
                                                    className="w-full bg-[#111319] border border-white/[0.08] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500/40"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* SECTION: RULES & FEES */}
                                    <div className="space-y-4 pt-4 border-t border-white/[0.06]">
                                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Registration Rules</h3>

                                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-xs font-semibold text-white">Open for Registration</p>
                                                    <p className="text-[11px] text-slate-400">Allow participants to register immediately</p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    name="is_registration_open"
                                                    checked={formData.is_registration_open}
                                                    onChange={handleChange}
                                                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                                                />
                                            </div>

                                            <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
                                                <div>
                                                    <p className="text-xs font-semibold text-white">Paid Event</p>
                                                    <p className="text-[11px] text-slate-400">Requires registration entry fee</p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    name="requires_payment"
                                                    checked={formData.requires_payment}
                                                    onChange={handleChange}
                                                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                                                />
                                            </div>

                                            {formData.requires_payment && (
                                                <div className="pt-2">
                                                    <label className="text-xs font-medium text-slate-300 block mb-1">Fee (INR)</label>
                                                    <input
                                                        type="number"
                                                        name="payment_amount"
                                                        value={formData.payment_amount}
                                                        onChange={handleChange}
                                                        className="w-full bg-[#111319] border border-white/[0.08] rounded-xl px-4 py-2 text-xs text-white"
                                                    />
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
                                                <div>
                                                    <p className="text-xs font-semibold text-white">Team Event</p>
                                                    <p className="text-[11px] text-slate-400">Participants register as squads/teams</p>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    name="is_team_event"
                                                    checked={formData.is_team_event}
                                                    onChange={handleChange}
                                                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                                                />
                                            </div>

                                            {formData.is_team_event && (
                                                <div className="grid grid-cols-2 gap-4 pt-2">
                                                    <div>
                                                        <label className="text-xs font-medium text-slate-300 block mb-1">Min Team Size</label>
                                                        <input
                                                            type="number"
                                                            name="team_size_min"
                                                            value={formData.team_size_min}
                                                            onChange={handleChange}
                                                            min="1"
                                                            className="w-full bg-[#111319] border border-white/[0.08] rounded-xl px-4 py-2 text-xs text-white"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-medium text-slate-300 block mb-1">Max Team Size</label>
                                                        <input
                                                            type="number"
                                                            name="team_size_max"
                                                            value={formData.team_size_max}
                                                            onChange={handleChange}
                                                            min="1"
                                                            className="w-full bg-[#111319] border border-white/[0.08] rounded-xl px-4 py-2 text-xs text-white"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </form>
                            </div>

                            {/* Drawer Actions */}
                            <div className="p-4 border-t border-white/[0.08] bg-[#0A0C11] flex gap-3">
                                <button 
                                    type="button" 
                                    onClick={() => setShowForm(false)} 
                                    className="px-4 py-2.5 rounded-xl bg-white/[0.04] text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.08] transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    form="eventForm" 
                                    className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm flex items-center justify-center gap-2"
                                >
                                    <Save size={14} />
                                    <span>{isEditing ? 'Save Changes' : 'Create Event'}</span>
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
    const capacity = event.registration_limit || 100;
    const registered = event.registrations?.length || 0;
    const progress = Math.min(100, Math.round((registered / capacity) * 100));

    return (
        <div className="group flex flex-col bg-[#111319] border border-white/[0.06] hover:border-white/[0.12] rounded-2xl overflow-hidden transition-all duration-200 shadow-sm">
            <div className="p-5 flex flex-col flex-1">
                {/* Status & Actions Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                    <StatusBadge 
                        status={event.is_registration_open ? 'Registration Open' : 'Registration Closed'} 
                    />
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={() => onEdit(event)} 
                            className="p-1.5 rounded-lg hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors"
                            title="Edit Event"
                        >
                            <Edit2 size={13} />
                        </button>
                        <button 
                            onClick={() => onDelete(event.id)} 
                            className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors"
                            title="Delete Event"
                        >
                            <Trash2 size={13} />
                        </button>
                    </div>
                </div>

                {/* Event Title & Metadata */}
                <h3 className="text-base font-semibold text-white tracking-tight leading-snug mb-3 group-hover:text-blue-400 transition-colors">
                    {event.title}
                </h3>

                <div className="space-y-1.5 text-xs text-slate-400 mb-4">
                    <div className="flex items-center gap-2">
                        <Calendar size={13} className="text-slate-500 shrink-0" />
                        <span className="truncate">
                            {event.event_date ? new Date(event.event_date).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'Date TBD'}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin size={13} className="text-slate-500 shrink-0" />
                        <span className="truncate">{event.venue || 'Venue TBD'}</span>
                    </div>
                </div>

                {/* Capacity Progress Bar */}
                <div className="mt-auto pt-4 border-t border-white/[0.04] space-y-2">
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-[11px] text-slate-400">Capacity</span>
                        <span className="text-[11px] font-mono font-semibold text-slate-200">
                            {registered}/{capacity} ({progress}%)
                        </span>
                    </div>
                    <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                        <div 
                            style={{ width: `${progress}%` }} 
                            className={`h-full rounded-full transition-all duration-300 ${progress >= 100 ? 'bg-rose-500' : 'bg-blue-600'}`} 
                        />
                    </div>
                </div>
            </div>

            {/* Bottom Card Footer */}
            <div className="px-5 py-2.5 bg-[#0E1017] border-t border-white/[0.04] flex items-center justify-between text-xs">
                <span className="text-slate-400">{event.category || 'General'}</span>
                <button
                    onClick={() => onEdit(event)}
                    className="text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1 transition-colors"
                >
                    <span>Configure</span>
                    <ChevronRight size={13} />
                </button>
            </div>
        </div>
    );
};

export default AdminEvents;
