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
    Cpu,
    Target,
    Database,
    ChevronRight,
    SearchX,
    Filter,
    Camera,
    CloudUpload
} from 'lucide-react';
import { getOptimizedImageUrl } from '../utils/helpers';
import { useToast } from '../context/ToastContext';

const AdminGallery = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const toast = useToast();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

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
            const sorted = response.data.sort((a, b) => b.id - a.id);
            setItems(sorted);
        } catch (err) {
            setError('PROTOCOL_FAILURE: UNABLE_TO_RETRIEVE_MEDIA_NODES');
            toast.error('Failed to fetch gallery items.');
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
            toast.success('Media node synthesized successfully.');
            fetchGallery();
        } catch (err) {
            toast.error('Upload protocol failure.');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('CRITICAL_PROCEDURE: TERMINATE_MEDIA_NODE? This action is permanent.')) return;
        try {
            await axios.delete(`${API_URL}/gallery/${id}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Media node decommissioned.');
            fetchGallery();
        } catch (err) {
            toast.error('Termination sequence failure.');
        }
    };

    const filteredItems = items.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-12 pb-20">
            {/* Header */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10 relative">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-px w-8 bg-blue-500/40" />
                        <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.5em]">Media_Library</span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-white uppercase tracking-[0.1em]">Visual_Archive_Core</h1>
                        <p className="text-[11px] text-slate-500 mt-2 font-mono uppercase tracking-tight">
                            Total_Assets: <span className="text-blue-500">{items.length}</span> // Filtered: <span className="text-white">{filteredItems.length}</span>
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 w-full xl:w-auto">
                    <div className="relative group flex-1 xl:flex-none xl:min-w-[400px]">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700 group-focus-within:text-blue-500 transition-colors z-10" />
                        <input
                            type="text"
                            placeholder="SEARCH_MEDIA_ARCHIVE..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-14 w-full bg-white/[0.01] border border-white/[0.05] rounded-[1.25rem] pl-14 pr-6 text-xs font-black text-white placeholder:text-slate-800 focus:outline-none focus:bg-white/[0.03] focus:border-white/[0.1] transition-all uppercase tracking-widest"
                        />
                    </div>
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="h-14 px-8 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-[1.25rem] flex items-center gap-3 hover:bg-blue-500 transition-all shadow-[0_12px_24px_rgba(37,99,235,0.3)] hover:-translate-y-0.5"
                    >
                        <CloudUpload size={16} strokeWidth={3} />
                        UPLINK_MEDIA
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="relative">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="aspect-[4/5] bg-white/[0.02] border border-white/[0.05] rounded-[2rem] animate-pulse" />
                        ))}
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="py-40 flex flex-col items-center justify-center opacity-20 gap-8">
                        <SearchX className="w-20 h-20 text-slate-600" strokeWidth={1} />
                        <div className="space-y-2 text-center">
                            <p className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Zero_Assets_Located</p>
                            <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">No matching visual nodes in the current sector</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredItems.map((item, idx) => (
                            <GalleryCard 
                                key={item.id}
                                item={item}
                                index={idx}
                                onDelete={handleDelete}
                                onExpand={setSelectedImage}
                            />
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
                            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[1000]"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed inset-0 m-auto w-full max-w-lg h-fit bg-[#030303] border border-white/[0.05] rounded-[2.5rem] p-10 shadow-[0_0_100px_rgba(37,99,235,0.1)] z-[1001] overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-[200px] bg-gradient-to-b from-blue-600/[0.03] to-transparent pointer-events-none" />
                            
                            <div className="flex items-center justify-between mb-12 relative z-10">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                        <span className="text-[8px] font-black text-blue-500 uppercase tracking-[0.5em]">Uplink_Node</span>
                                    </div>
                                    <h2 className="text-2xl font-black text-white uppercase tracking-[0.1em]">Synthesize_Media</h2>
                                </div>
                                <button onClick={() => setShowUploadModal(false)} className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/[0.08] transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleUpload} className="space-y-10 relative z-10">
                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black text-slate-700 uppercase tracking-[0.2em] ml-1">Asset_Title</label>
                                        <input 
                                            required 
                                            type="text" 
                                            value={newImage.title}
                                            onChange={(e) => setNewImage({...newImage, title: e.target.value})}
                                            className="w-full bg-white/[0.01] border border-white/[0.05] rounded-[1.25rem] p-5 text-sm font-black text-white focus:border-blue-500/30 focus:bg-white/[0.02] focus:outline-none transition-all placeholder:text-slate-900 uppercase tracking-widest"
                                            placeholder="NODE_IDENTIFIER..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-8">
                                         <div className="space-y-3">
                                            <label className="text-[9px] font-black text-slate-700 uppercase tracking-[0.2em] ml-1">Classification</label>
                                            <select 
                                                value={newImage.category}
                                                onChange={(e) => setNewImage({...newImage, category: e.target.value})}
                                                className="w-full bg-white/[0.01] border border-white/[0.05] rounded-[1.25rem] p-5 text-[10px] font-black text-white focus:outline-none focus:border-blue-500/30 transition-all cursor-pointer uppercase tracking-widest"
                                            >
                                                <option value="EVENT">Event</option>
                                                <option value="TECHNICAL">Technical</option>
                                                <option value="WINNERS">Winners</option>
                                                <option value="PROMO">Promotional</option>
                                            </select>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[9px] font-black text-slate-700 uppercase tracking-[0.2em] ml-1">Binary_Payload</label>
                                            <div className="relative group">
                                                <input 
                                                    required 
                                                    type="file" 
                                                    onChange={(e) => setNewImage({...newImage, image: e.target.files[0]})}
                                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                />
                                                <div className="w-full bg-white/[0.01] border border-dashed border-white/10 rounded-[1.25rem] p-5 flex items-center justify-center gap-3 text-slate-500 group-hover:text-blue-500 group-hover:border-blue-500/30 transition-all">
                                                    <Upload size={16} />
                                                    <span className="text-[10px] font-black border-none uppercase tracking-widest truncate max-w-[100px]">{newImage.image ? newImage.image.name : 'SOURCE_FILE'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black text-slate-700 uppercase tracking-[0.2em] ml-1">Metadata_Description</label>
                                        <textarea 
                                            rows="3"
                                            value={newImage.description}
                                            onChange={(e) => setNewImage({...newImage, description: e.target.value})}
                                            className="w-full bg-white/[0.01] border border-white/[0.05] rounded-[1.25rem] p-5 text-xs font-medium text-slate-400 focus:border-blue-500/30 focus:bg-white/[0.02] focus:outline-none transition-all placeholder:text-slate-900 resize-none leading-relaxed"
                                            placeholder="DESCRIBE_CONTENTS..."
                                        ></textarea>
                                    </div>
                                </div>

                                <button 
                                    disabled={uploading}
                                    className="w-full h-16 bg-blue-600 rounded-[1.25rem] text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-blue-500 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-[0_12px_30px_rgba(37,99,235,0.4)]"
                                >
                                    {uploading ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            SYNTHESIZING...
                                        </>
                                    ) : (
                                        <>
                                            <CloudUpload size={16} />
                                            COMMIT_TO_ARCHIVE
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Details Viewer (Full Screen) */}
            <AnimatePresence>
                {selectedImage && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedImage(null)}
                            className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-[2000]"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="fixed inset-4 md:inset-12 bg-[#030303] border border-white/[0.05] rounded-[3rem] overflow-hidden z-[2001] flex flex-col xl:flex-row shadow-[0_0_200px_rgba(0,0,0,0.8)]"
                        >
                            <div className="flex-1 bg-black/40 flex items-center justify-center p-8 md:p-12 relative overflow-hidden group/viewer">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/[0.05] via-transparent to-transparent opacity-50" />
                                <motion.img 
                                    layoutId={`img-${selectedImage.id}`}
                                    src={getOptimizedImageUrl(selectedImage.image)} 
                                    className="max-w-full max-h-full object-contain rounded-2xl shadow-[0_50px_100px_rgba(0,0,0,0.5)] relative z-10" 
                                    alt={selectedImage.title} 
                                />
                                <button onClick={() => setSelectedImage(null)} className="absolute top-10 right-10 w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/[0.08] transition-all z-20 xl:hidden">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="w-full xl:w-[500px] bg-[#030303] border-l border-white/[0.05] p-10 md:p-16 flex flex-col relative">
                                <div className="absolute top-0 right-0 w-full h-[300px] bg-gradient-to-b from-blue-600/[0.03] to-transparent pointer-events-none" />
                                
                                <div className="flex justify-between items-start mb-12 relative z-10">
                                    <div className="space-y-4">
                                        <div className="px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[9px] font-black text-blue-500 uppercase tracking-[0.4em] inline-block">
                                            {selectedImage.category}
                                        </div>
                                        <h2 className="text-3xl font-black text-white uppercase tracking-tight leading-tight">{selectedImage.title}</h2>
                                    </div>
                                    <button onClick={() => setSelectedImage(null)} className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/[0.08] transition-all hidden xl:flex">
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="space-y-10 flex-1 relative z-10">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 text-slate-600">
                                            <Database size={14} className="text-blue-500" />
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">Asset_Metadata</h3>
                                            <div className="h-px flex-1 bg-white/[0.03]" />
                                        </div>
                                        <p className="text-sm font-medium text-slate-400 leading-relaxed max-w-md">
                                            {selectedImage.description || "NO_DESCRIPTION_UPLOADED"}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-10">
                                        <div className="space-y-2">
                                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] block">NODE_ID</span>
                                            <span className="text-sm font-black text-white font-mono uppercase tracking-widest">{selectedImage.id}</span>
                                        </div>
                                        <div className="space-y-2">
                                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] block">PROTOCOL</span>
                                            <span className="text-sm font-black text-emerald-500 font-mono">SECURE_AV</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12 flex gap-4 relative z-10">
                                    <button 
                                        onClick={() => handleDelete(selectedImage.id)}
                                        className="h-16 px-8 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-3 flex-1"
                                    >
                                        <Trash2 size={16} />
                                        DECOMMISSION
                                    </button>
                                    <button 
                                        onClick={() => setSelectedImage(null)}
                                        className="h-16 px-10 rounded-2xl bg-white/[0.03] border border-white/[0.05] text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hover:bg-white/[0.08] hover:text-white transition-all flex items-center justify-center"
                                    >
                                        RETURN
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

const GalleryCard = ({ item, index, onDelete, onExpand }) => {
    return (
        <motion.div 
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            className="group relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-white/[0.01] border border-white/[0.03] hover:border-blue-500/30 transition-all duration-700"
        >
            <motion.img 
                layoutId={`img-${item.id}`}
                src={getOptimizedImageUrl(item.image)} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-40 group-hover:opacity-100" 
                alt={item.title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-700" />
            
            {/* Tactical Frame */}
            <div className="absolute inset-4 border border-white/[0.03] rounded-[1.8rem] pointer-events-none group-hover:border-white/10 transition-colors duration-700" />
            
            <div className="absolute inset-0 p-10 flex flex-col justify-between z-10">
                <div className="flex justify-between items-start opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-y-4 group-hover:translate-y-0">
                    <div className="px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-[8px] font-black text-white uppercase tracking-[0.3em]">
                        {item.category}
                    </div>
                </div>

                <div className="space-y-6 translate-y-8 group-hover:translate-y-0 transition-all duration-700">
                    <div className="space-y-2">
                        <h3 className="text-xl font-black text-white uppercase tracking-tight leading-tight group-hover:text-blue-500 transition-colors duration-500">{item.title}</h3>
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] mt-1">NODE_{item.id}</p>
                    </div>
                    
                    <div className="flex gap-3">
                        <button 
                            onClick={() => onExpand(item)}
                            className="flex-1 h-12 bg-white/[0.05] backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-center gap-3 text-white text-[9px] font-black uppercase tracking-[0.3em] hover:bg-blue-600 hover:border-blue-500 transition-all duration-300"
                        >
                            <Maximize2 size={12} />
                            EXPAND
                        </button>
                        <button 
                            onClick={() => onDelete(item.id)}
                            className="w-12 h-12 bg-rose-500/10 backdrop-blur-md border border-rose-500/20 rounded-2xl flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-300"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AdminGallery;
