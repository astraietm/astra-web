import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Upload, 
    Trash2, 
    Image as ImageIcon, 
    Loader2, 
    X, 
    Plus,
    Maximize2,
    Search,
    RefreshCw,
    Filter,
    Tag,
    FileText
} from 'lucide-react';
import { getOptimizedImageUrl } from '../utils/helpers';
import { useToast } from '../context/ToastContext';
import PageHeader from '../components/admin/common/PageHeader';
import StatusBadge from '../components/admin/common/StatusBadge';
import EmptyState from '../components/admin/common/EmptyState';

const CATEGORIES = [
    { value: 'ALL', label: 'All Categories' },
    { value: 'EVENT', label: 'Events' },
    { value: 'TECHNICAL', label: 'Technical' },
    { value: 'WINNERS', label: 'Winners' },
    { value: 'PROMO', label: 'Promotional' },
];

const AdminGallery = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ALL');

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

    const [newImage, setNewImage] = useState({
        title: '',
        category: 'EVENT',
        image: null,
        description: ''
    });

    useEffect(() => {
        if (user && !user.is_staff) {
            navigate('/');
        }
        fetchGallery();
    }, [user, navigate]);

    const fetchGallery = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/gallery/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const sorted = Array.isArray(response.data) ? response.data.sort((a, b) => b.id - a.id) : [];
            setItems(sorted);
        } catch (err) {
            console.error('Failed to fetch gallery:', err);
            toast?.error?.('Failed to fetch gallery items.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!newImage.title.trim() || !newImage.image) {
            toast?.error?.('Please provide a title and select an image file.');
            return;
        }

        setUploading(true);
        try {
            // 1. Upload image to Cloudinary
            const cloudFormData = new FormData();
            cloudFormData.append('file', newImage.image);
            cloudFormData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'astra_gallery');
            
            const cloudRes = await axios.post(
                `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dykinibqt'}/image/upload`,
                cloudFormData
            );

            const imageUrl = cloudRes.data.secure_url;
            const publicId = cloudRes.data.public_id;

            // 2. Map category and save to backend
            const catMap = {
                'EVENT': 'seminars',
                'TECHNICAL': 'ctf',
                'WINNERS': 'workshops',
                'PROMO': 'hackathons'
            };
            const backendCategory = catMap[newImage.category] || 'other';

            await axios.post(`${API_URL}/gallery/`, {
                title: newImage.title.trim(),
                category: backendCategory,
                image_url: imageUrl,
                public_id: publicId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setShowUploadModal(false);
            setNewImage({ title: '', category: 'EVENT', image: null, description: '' });
            toast?.success?.('Image uploaded successfully.');
            fetchGallery();
        } catch (err) {
            console.error('Upload failed:', err);
            toast?.error?.('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this media item?')) return;
        try {
            await axios.delete(`${API_URL}/gallery/${id}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast?.success?.('Image deleted successfully.');
            if (selectedImage?.id === id) {
                setSelectedImage(null);
            }
            fetchGallery();
        } catch (err) {
            console.error('Delete failed:', err);
            toast?.error?.('Failed to delete image.');
        }
    };

    const filteredItems = useMemo(() => {
        return items.filter(item => {
            const matchesSearch = 
                item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [items, searchQuery, selectedCategory]);

    return (
        <div className="space-y-6 pb-12">
            {/* Standard SaaS Page Header */}
            <PageHeader
                title="Media & Gallery"
                subtitle="Curate festival photography, event showcases, and media highlights for the public portal."
                breadcrumbs={[
                    { label: 'Admin', to: '/admin' },
                    { label: 'Gallery' }
                ]}
                badge={
                    <span className="text-xs text-slate-400 font-medium">
                        Media Items: <strong className="text-white">{items.length}</strong>
                    </span>
                }
                actions={
                    <div className="flex items-center gap-2.5">
                        <button 
                            onClick={fetchGallery}
                            disabled={loading}
                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.08] text-xs font-semibold transition-colors disabled:opacity-50"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors shadow-sm shadow-blue-500/20"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            Upload Media
                        </button>
                    </div>
                }
            />

            {/* Filter and Search Bar */}
            <div className="p-3 bg-[#111319] border border-white/[0.06] rounded-xl flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search media by title, category, or description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#0d0f14] border border-white/[0.08] rounded-lg py-2 pl-9 pr-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>

                {/* Category Pill Filters */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                    {CATEGORIES.map((cat) => {
                        const isSelected = selectedCategory === cat.value;
                        return (
                            <button
                                key={cat.value}
                                onClick={() => setSelectedCategory(cat.value)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                                    isSelected 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06]'
                                }`}
                            >
                                {cat.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Media Grid */}
            <div>
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="aspect-[4/3] rounded-xl bg-white/[0.02] border border-white/[0.05] animate-pulse" />
                        ))}
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="bg-[#111319] border border-white/[0.06] rounded-xl p-8">
                        <EmptyState 
                            icon={ImageIcon}
                            title="No media found"
                            description={
                                searchQuery || selectedCategory !== 'ALL'
                                    ? "No images match your active search or category filter."
                                    : "Upload high-resolution festival moments to showcase them in the gallery."
                            }
                            actionLabel="Upload Media"
                            onAction={() => setShowUploadModal(true)}
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredItems.map((item) => (
                            <div
                                key={item.id}
                                className="group relative bg-[#111319] border border-white/[0.06] hover:border-white/15 rounded-xl overflow-hidden transition-all shadow-sm flex flex-col"
                            >
                                {/* Thumbnail */}
                                <div className="relative aspect-[4/3] overflow-hidden bg-black/40">
                                    <img 
                                        src={getOptimizedImageUrl(item.image)} 
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        loading="lazy"
                                    />
                                    <div className="absolute top-2.5 left-2.5">
                                        <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] font-semibold text-slate-200 border border-white/10 uppercase tracking-wider">
                                            {item.category}
                                        </span>
                                    </div>
                                    
                                    {/* Action overlay on hover */}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedImage(item)}
                                            className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-colors"
                                            title="View media details"
                                        >
                                            <Maximize2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(item.id)}
                                            className="p-2 rounded-lg bg-rose-500/30 hover:bg-rose-500/50 text-rose-200 backdrop-blur-sm transition-colors"
                                            title="Delete media"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Caption info */}
                                <div className="p-3.5 flex items-start justify-between gap-2">
                                    <div className="min-w-0 flex-1">
                                        <h4 className="text-xs font-semibold text-white truncate" title={item.title}>
                                            {item.title}
                                        </h4>
                                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                                            {item.description || 'No description'}
                                        </p>
                                    </div>
                                    <span className="text-[10px] font-mono text-slate-500 flex-shrink-0">
                                        #{item.id}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Upload Modal */}
            <AnimatePresence>
                {showUploadModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowUploadModal(false)}
                            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="relative w-full max-w-lg bg-[#111319] border border-white/[0.08] rounded-2xl p-6 shadow-2xl z-10 space-y-5"
                        >
                            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                                <div>
                                    <h3 className="text-sm font-bold text-white">Upload Media Item</h3>
                                    <p className="text-xs text-slate-400">Add an image to the festival gallery.</p>
                                </div>
                                <button 
                                    onClick={() => setShowUploadModal(false)}
                                    className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={handleUpload} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-slate-300">Image Title *</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={newImage.title}
                                        onChange={(e) => setNewImage({...newImage, title: e.target.value})}
                                        placeholder="e.g. Hackathon Keynote Stage"
                                        className="w-full bg-[#0d0f14] border border-white/[0.08] rounded-lg py-2 px-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-slate-300">Category *</label>
                                        <select 
                                            value={newImage.category}
                                            onChange={(e) => setNewImage({...newImage, category: e.target.value})}
                                            className="w-full bg-[#0d0f14] border border-white/[0.08] rounded-lg py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                                        >
                                            <option value="EVENT">Event</option>
                                            <option value="TECHNICAL">Technical</option>
                                            <option value="WINNERS">Winners</option>
                                            <option value="PROMO">Promotional</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-slate-300">Image File *</label>
                                        <input 
                                            type="file" 
                                            required
                                            accept="image/*"
                                            onChange={(e) => setNewImage({...newImage, image: e.target.files[0]})}
                                            className="w-full text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-white/[0.06] file:text-slate-200 hover:file:bg-white/[0.1] file:cursor-pointer"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-slate-300">Description</label>
                                    <textarea 
                                        rows="3"
                                        value={newImage.description}
                                        onChange={(e) => setNewImage({...newImage, description: e.target.value})}
                                        placeholder="Optional caption or photo description..."
                                        className="w-full bg-[#0d0f14] border border-white/[0.08] rounded-lg p-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                                    />
                                </div>

                                <div className="flex justify-end gap-2.5 pt-2">
                                    <button 
                                        type="button" 
                                        onClick={() => setShowUploadModal(false)}
                                        className="px-4 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs font-semibold transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={uploading}
                                        className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                                        {uploading ? 'Uploading...' : 'Upload Image'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Lightbox / Details Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedImage(null)}
                            className="fixed inset-0 bg-black/90 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-4xl max-h-[90vh] bg-[#111319] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col md:flex-row"
                        >
                            {/* Image Preview */}
                            <div className="flex-1 bg-black/60 flex items-center justify-center p-4 min-h-[300px]">
                                <img 
                                    src={getOptimizedImageUrl(selectedImage.image)} 
                                    alt={selectedImage.title}
                                    className="max-w-full max-h-[75vh] object-contain rounded-lg"
                                />
                            </div>

                            {/* Details Sidebar */}
                            <div className="w-full md:w-80 bg-[#111319] border-t md:border-t-0 md:border-l border-white/[0.06] p-6 flex flex-col justify-between">
                                <div className="space-y-4">
                                    <div className="flex items-start justify-between">
                                        <span className="px-2.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
                                            {selectedImage.category}
                                        </span>
                                        <button 
                                            onClick={() => setSelectedImage(null)}
                                            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div>
                                        <h3 className="text-base font-bold text-white">{selectedImage.title}</h3>
                                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                                            {selectedImage.description || 'No description provided for this media.'}
                                        </p>
                                    </div>

                                    <div className="pt-4 border-t border-white/[0.06] space-y-2 text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Item ID</span>
                                            <span className="text-slate-300 font-mono">#{selectedImage.id}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Status</span>
                                            <span className="text-emerald-400 font-medium">Published</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/[0.06] flex items-center gap-2">
                                    <button 
                                        onClick={() => handleDelete(selectedImage.id)}
                                        className="flex-1 py-2 px-3 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        Delete
                                    </button>
                                    <button 
                                        onClick={() => setSelectedImage(null)}
                                        className="py-2 px-4 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs font-semibold transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminGallery;
