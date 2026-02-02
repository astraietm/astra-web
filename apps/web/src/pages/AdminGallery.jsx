import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeft, 
    Upload, 
    Trash2, 
    Image as ImageIcon, 
    Loader2, 
    Edit2, 
    X, 
    Plus,
    Maximize2,
    Search,
    Zap,
    Cpu
} from 'lucide-react';
import { getOptimizedImageUrl } from '../utils/helpers';

const AdminGallery = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL;

    const [newImage, setNewImage] = useState({
        title: '',
        category: 'EVENT',
        image: null,
        description: ''
    });

    useEffect(() => {
        fetchGallery();
    }, [token]);

    const fetchGallery = async () => {
        try {
            const response = await axios.get(`${API_URL}/gallery/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setItems(response.data);
        } catch (err) {
            setError('Failed to fetch gallery items.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        setUploading(true);
        const formData = new FormData();
        formData.append('title', newImage.title);
        formData.append('category', newImage.category);
        formData.append('description', newImage.description);
        if (newImage.image) formData.append('image', newImage.image);

        try {
            await axios.post(`${API_URL}/gallery/`, formData, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setShowUploadModal(false);
            setNewImage({ title: '', category: 'EVENT', image: null, description: '' });
            fetchGallery();
        } catch (err) {
            alert('Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this image?')) return;
        try {
            await axios.delete(`${API_URL}/gallery/${id}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchGallery();
        } catch (err) {
            alert('Delete failed.');
        }
    };

    return (
        <div className="space-y-12 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 relative">
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-px w-12 bg-blue-500" />
                        <span className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em]">Media</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white uppercase tracking-wider relative z-10">Gallery</h1>
                        <p className="text-sm font-medium text-slate-500 mt-2 max-w-md">
                            Manage event photos, promotional assets, and gallery content.
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center gap-6">
                    <div className="relative group hidden lg:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors z-10" />
                        <input 
                            type="text" 
                            placeholder="Search images..." 
                            className="h-12 bg-white/[0.03] border border-white/[0.05] rounded-xl pl-10 pr-6 w-64 text-sm font-medium text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-all"
                        />
                    </div>
                    <button 
                        onClick={() => setShowUploadModal(true)}
                        className="relative group overflow-hidden"
                    >
                        <div className="relative h-12 px-6 bg-blue-600 rounded-xl flex items-center gap-2 text-white text-xs font-bold uppercase tracking-wider hover:bg-blue-500 transition-all shadow-lg">
                            <Plus size={16} strokeWidth={3} />
                            Upload Image
                        </div>
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="relative">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-4">
                        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                        <p className="text-xs font-bold text-blue-500 uppercase tracking-widest">Loading Media...</p>
                    </div>
                ) : items.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center opacity-30 gap-6 border border-dashed border-white/10 rounded-3xl">
                        <ImageIcon size={48} strokeWidth={1} />
                        <span className="text-xs font-bold uppercase tracking-widest">No images found</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {items.map((item, idx) => (
                            <motion.div 
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#0a0a0a] border border-white/[0.08] hover:border-white/[0.2] transition-all"
                            >
                                <img 
                                    src={getOptimizedImageUrl(item.image)} 
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-100" 
                                    alt={item.title}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                                
                                <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                                    <div className="flex justify-between items-start opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-2 group-hover:translate-y-0">
                                        <div className="px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white uppercase tracking-wider">
                                            {item.category}
                                        </div>
                                        <button 
                                            onClick={() => handleDelete(item.id)}
                                            className="w-8 h-8 rounded-lg bg-rose-500/20 backdrop-blur-md border border-rose-500/30 flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>

                                    <div className="space-y-3 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                        <div>
                                            <h3 className="text-lg font-bold text-white leading-tight">{item.title}</h3>
                                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mt-1">
                                                ID: {item.id}
                                            </p>
                                        </div>
                                        <button 
                                            onClick={() => setSelectedImage(item)}
                                            className="w-full h-10 bg-white/[0.1] backdrop-blur-md border border-white/10 rounded-lg flex items-center justify-center gap-2 text-white text-[10px] font-bold uppercase tracking-wider hover:bg-white/20 transition-all"
                                        >
                                            <Maximize2 size={12} />
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Upload Modal */}
            <AnimatePresence>
                {showUploadModal && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowUploadModal(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[101]"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed inset-0 m-auto w-full max-w-lg h-fit bg-[#0a0a0a] border border-white/[0.1] rounded-3xl p-8 shadow-2xl z-[102] overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Upload Media</h2>
                                    <p className="text-sm text-slate-500">Add new images to the gallery</p>
                                </div>
                                <button onClick={() => setShowUploadModal(false)} className="p-2 rounded-lg hover:bg-white/10 text-slate-500 hover:text-white transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleUpload} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Title</label>
                                    <input 
                                        required 
                                        type="text" 
                                        value={newImage.title}
                                        onChange={(e) => setNewImage({...newImage, title: e.target.value})}
                                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-3 text-sm font-medium text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                                        placeholder="Event Title..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                     <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</label>
                                        <select 
                                            value={newImage.category}
                                            onChange={(e) => setNewImage({...newImage, category: e.target.value})}
                                            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-3 text-sm font-medium text-white focus:outline-none focus:border-blue-500/50 transition-all cursor-pointer"
                                        >
                                            <option value="EVENT">Event</option>
                                            <option value="TECHNICAL">Technical</option>
                                            <option value="WINNERS">Winners</option>
                                            <option value="PROMO">Promotional</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Image File</label>
                                        <div className="relative group">
                                            <input 
                                                required 
                                                type="file" 
                                                onChange={(e) => setNewImage({...newImage, image: e.target.files[0]})}
                                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                            />
                                            <div className="w-full bg-white/[0.03] border border-dashed border-white/10 rounded-xl p-3 flex items-center justify-center gap-2 text-slate-500 group-hover:text-blue-500 group-hover:border-blue-500/30 transition-all">
                                                <Upload size={16} />
                                                <span className="text-xs font-bold truncate max-w-[100px]">{newImage.image ? newImage.image.name : 'Choose File'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</label>
                                    <textarea 
                                        rows="3"
                                        value={newImage.description}
                                        onChange={(e) => setNewImage({...newImage, description: e.target.value})}
                                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-3 text-sm font-medium text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600 resize-none"
                                        placeholder="Optional description..."
                                    ></textarea>
                                </div>

                                <button 
                                    disabled={uploading}
                                    className="w-full h-12 bg-blue-600 rounded-xl text-white text-xs font-bold uppercase tracking-wider hover:bg-blue-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {uploading ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            Uploading...
                                        </>
                                    ) : 'Upload Image'}
                                </button>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Details Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedImage(null)}
                            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[101]"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="fixed inset-4 md:inset-10 bg-[#0a0a0a] border border-white/[0.1] rounded-3xl overflow-hidden z-[102] flex flex-col md:flex-row shadow-2xl"
                        >
                            <div className="flex-1 bg-black flex items-center justify-center p-8 relative">
                                <img 
                                    src={getOptimizedImageUrl(selectedImage.image)} 
                                    className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" 
                                    alt={selectedImage.title} 
                                />
                            </div>
                            <div className="w-full md:w-[400px] bg-[#0a0a0a] border-l border-white/[0.08] p-8 flex flex-col">
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <div className="px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-500 uppercase tracking-widest inline-block mb-3">
                                            {selectedImage.category}
                                        </div>
                                        <h2 className="text-2xl font-bold text-white leading-tight">{selectedImage.title}</h2>
                                    </div>
                                    <button onClick={() => setSelectedImage(null)} className="p-2 -mr-2 text-slate-500 hover:text-white transition-colors">
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="space-y-6 flex-1">
                                    <div className="space-y-2">
                                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</h3>
                                        <p className="text-sm font-medium text-slate-300 leading-relaxed">
                                            {selectedImage.description || "No description provided."}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/[0.05]">
                                        <div>
                                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">ID</span>
                                            <span className="text-sm font-medium text-white">{selectedImage.id}</span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">Date</span>
                                            <span className="text-sm font-medium text-white">{new Date().toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => setSelectedImage(null)}
                                    className="mt-8 w-full py-3 rounded-xl border border-white/[0.1] text-xs font-bold text-slate-400 hover:text-white hover:bg-white/[0.05] transition-all uppercase tracking-wider"
                                >
                                    Close Viewer
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminGallery;
