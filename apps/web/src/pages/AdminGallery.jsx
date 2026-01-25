import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeft, 
    Upload, 
    Trash2, 
    Shield, 
    Image as ImageIcon, 
    Loader2, 
    Edit2, 
    X, 
    Check, 
    Database, 
    AlertTriangle,
    Plus,
    Maximize2,
    Filter,
    Search,
    ChevronRight,
    Zap,
    Cpu,
    Target
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
            setError('Failed to fetch intelligence visuals.');
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
            alert('Upload failed. Access denied.');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('WARNING: Confirm visual asset decommissioning?')) return;
        try {
            await axios.delete(`${API_URL}/gallery/${id}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchGallery();
        } catch (err) {
            alert('Decommission failed.');
        }
    };

    return (
        <div className="space-y-16 pb-20">
            {/* Tactical Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 relative">
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-px w-12 bg-blue-500" />
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Visual Intelligence Archive</span>
                    </div>
                    <div>
                        <h1 className="text-6xl font-black text-white/5 uppercase tracking-tighter absolute -mt-4 pointer-events-none select-none">Asset Matrix</h1>
                        <h1 className="text-3xl font-black text-white uppercase tracking-wider relative z-10">Gallery Protocol</h1>
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-2 max-w-md leading-relaxed">
                            Organizing high-fidelity telemetry captures and mission visuals.
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center gap-6">
                    <div className="relative group hidden lg:block">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-blue-500 transition-colors z-10" />
                        <input 
                            type="text" 
                            placeholder="SEARCH VISUAL IDENTIFIER..." 
                            className="h-16 bg-black/40 border border-white/[0.03] rounded-[2rem] py-4 pl-14 pr-6 w-80 text-[11px] font-black tracking-widest text-slate-300 placeholder:text-slate-700 focus:outline-none focus:border-blue-500/30 transition-all uppercase"
                        />
                    </div>
                    <button 
                        onClick={() => setShowUploadModal(true)}
                        className="relative group overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-blue-600 rounded-[2rem] blur-lg opacity-20 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative h-16 px-10 bg-blue-600 rounded-[2rem] flex items-center gap-3 group-active:scale-95 transition-transform text-white text-[11px] font-black uppercase tracking-[0.2em] border border-white/10 shadow-2xl">
                            <Plus size={20} strokeWidth={3} />
                            Ingest Asset
                        </div>
                    </button>
                </div>
            </div>

            {/* Tactical Grid */}
            <div className="relative">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-6">
                        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] animate-pulse">Syncing Visual Matrix...</p>
                    </div>
                ) : items.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center opacity-10 gap-6 border border-dashed border-white/5 rounded-[3rem]">
                        <ImageIcon size={60} strokeWidth={1} />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">No Assets Logged</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {items.map((item, idx) => (
                            <motion.div 
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-white/[0.02] border border-white/[0.05] hover:border-blue-500/30 transition-all duration-700 hover:shadow-[0_40px_80px_rgba(0,0,0,0.6)]"
                            >
                                <img 
                                    src={getOptimizedImageUrl(item.image)} 
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0 opacity-40 group-hover:opacity-100" 
                                    alt={item.title}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                                
                                <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                                    <div className="flex justify-between items-start opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-y-4 group-hover:translate-y-0">
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-black text-white uppercase tracking-widest">
                                            {item.category}
                                        </div>
                                        <button 
                                            onClick={() => handleDelete(item.id)}
                                            className="w-10 h-10 rounded-xl bg-rose-500/20 backdrop-blur-md border border-rose-500/30 flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all active:scale-90"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    <div className="space-y-4 translate-y-8 group-hover:translate-y-0 transition-all duration-700">
                                        <div className="space-y-1">
                                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">{item.title}</h3>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-2 flex items-center gap-2">
                                                <div className="w-1 h-1 rounded-full bg-blue-500" />
                                                ID: VIS_NODE_{item.id}
                                            </p>
                                        </div>
                                        <button 
                                            onClick={() => setSelectedImage(item)}
                                            className="w-full h-14 bg-white/[0.05] backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-center gap-3 text-white text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                                        >
                                            <Maximize2 size={14} />
                                            Analyze Asset
                                        </button>
                                    </div>
                                </div>

                                {/* HUD Overlay Decoration */}
                                <div className="absolute top-4 left-4 w-4 h-[1px] bg-white/20 group-hover:bg-blue-500/60 transition-colors" />
                                <div className="absolute top-4 left-4 w-[1px] h-4 bg-white/20 group-hover:bg-blue-500/60 transition-colors" />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Ingest Modal */}
            <AnimatePresence>
                {showUploadModal && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowUploadModal(false)}
                            className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-[101]"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed inset-0 m-auto w-full max-w-xl h-fit bg-[#020202] border border-white/[0.08] rounded-[3rem] p-12 shadow-2xl z-[102] overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[80px] pointer-events-none" />
                            
                            <div className="flex items-center justify-between mb-12 relative z-10">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,1)] animate-pulse" />
                                        <span className="text-[9px] font-black uppercase tracking-[0.5em] text-blue-500">Asset Ingestion</span>
                                    </div>
                                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">New Registry</h2>
                                </div>
                                <button onClick={() => setShowUploadModal(false)} className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-slate-500 hover:text-white transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleUpload} className="space-y-8 relative z-10">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Asset Header</label>
                                    <input 
                                        required 
                                        type="text" 
                                        value={newImage.title}
                                        onChange={(e) => setNewImage({...newImage, title: e.target.value})}
                                        className="w-full bg-black/40 border border-white/[0.08] rounded-2xl p-5 text-white font-black uppercase tracking-widest text-[11px] focus:border-blue-500/30 transition-all placeholder:text-slate-800"
                                        placeholder="E.G. CHAMPIONS_CUP_2026"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                     <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Classification</label>
                                        <select 
                                            value={newImage.category}
                                            onChange={(e) => setNewImage({...newImage, category: e.target.value})}
                                            className="w-full bg-black/40 border border-white/[0.08] rounded-2xl p-5 text-[11px] font-black text-white uppercase tracking-widest focus:outline-none focus:border-blue-500/30 transition-all cursor-pointer appearance-none"
                                        >
                                            <option value="EVENT">EVENT_NODE</option>
                                            <option value="TECHNICAL">TECHNICAL</option>
                                            <option value="WINNERS">WINNERS_ARCHIVE</option>
                                            <option value="PROMO">PROMOTIONAL</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Source Node</label>
                                        <div className="relative group/file">
                                            <input 
                                                required 
                                                type="file" 
                                                onChange={(e) => setNewImage({...newImage, image: e.target.files[0]})}
                                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                            />
                                            <div className="w-full bg-black/40 border border-dashed border-white/10 rounded-2xl p-5 flex items-center justify-center gap-3 text-slate-600 group-hover/file:border-blue-500/30 group-hover/file:text-blue-500 transition-all">
                                                <Upload size={18} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">{newImage.image ? newImage.image.name.substring(0, 15) + '...' : 'Upload File'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Asset Briefing</label>
                                    <textarea 
                                        rows="4"
                                        value={newImage.description}
                                        onChange={(e) => setNewImage({...newImage, description: e.target.value})}
                                        className="w-full bg-black/40 border border-white/[0.08] rounded-2xl p-5 text-slate-400 font-bold uppercase tracking-widest text-[11px] focus:border-blue-500/30 focus:outline-none transition-all placeholder:text-slate-800 resize-none"
                                        placeholder="ADDITIONAL SYSTEM DATA..."
                                    ></textarea>
                                </div>

                                <button 
                                    disabled={uploading}
                                    className="w-full h-20 relative group mt-4"
                                >
                                    <div className="absolute inset-0 bg-blue-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="relative h-full w-full bg-blue-600 text-white text-[11px] font-black uppercase tracking-[0.4em] rounded-3xl flex items-center justify-center gap-4 transition-all group-active:scale-95 border border-white/10 overflow-hidden disabled:opacity-50 disabled:grayscale">
                                        <Zap size={20} className="fill-white animate-pulse" />
                                        {uploading ? 'INGESTING...' : 'Commit to Matrix'}
                                    </div>
                                </button>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Asset Analyzer Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedImage(null)}
                            className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-[101]"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="fixed inset-10 bg-black/40 border border-white/10 rounded-[4rem] overflow-hidden z-[102] flex flex-col md:flex-row shadow-[0_0_100px_rgba(0,0,0,1)]"
                        >
                            <div className="flex-[2] bg-black flex items-center justify-center p-10 relative overflow-hidden">
                                <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                                <img 
                                    src={getOptimizedImageUrl(selectedImage.image)} 
                                    className="max-w-full max-h-full object-contain relative z-10 rounded-2xl shadow-2xl" 
                                    alt={selectedImage.title} 
                                />
                                {/* Overlay Corners */}
                                <div className="absolute top-10 left-10 w-20 h-20 border-t-2 border-l-2 border-blue-600/40 rounded-tl-3xl z-20" />
                                <div className="absolute bottom-10 right-10 w-20 h-20 border-b-2 border-r-2 border-blue-600/40 rounded-br-3xl z-20" />
                            </div>
                            <div className="flex-1 bg-[#020202] border-l border-white/10 p-16 space-y-12">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                                            <Cpu size={18} />
                                        </div>
                                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em]">Asset_Analysis_Report</span>
                                    </div>
                                    <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">{selectedImage.title}</h2>
                                    <div className="flex gap-4">
                                        <span className="px-4 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedImage.category}</span>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                     <div className="flex items-center gap-3">
                                        <div className="w-8 h-px bg-white/10" />
                                        <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Telemetry Synopsis</h3>
                                    </div>
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px] leading-relaxed">
                                        {selectedImage.description || "NO ADDITIONAL TELEMETRY LOGGED FOR THIS ASSET NODE."}
                                    </p>
                                </div>

                                <div className="mt-auto pt-12 border-t border-white/[0.04] space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white/[0.02] p-6 rounded-3xl border border-white/5 space-y-1">
                                            <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest block">Node_ID</span>
                                            <span className="text-sm font-black text-white font-mono uppercase">VIS_{selectedImage.id}</span>
                                        </div>
                                        <div className="bg-white/[0.02] p-6 rounded-3xl border border-white/5 space-y-1">
                                            <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest block">Status</span>
                                            <span className="text-sm font-black text-emerald-500 uppercase">SYNCHRONIZED</span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setSelectedImage(null)}
                                        className="w-full h-20 bg-white/[0.03] border border-white/[0.08] rounded-3xl text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] hover:text-white hover:bg-white/[0.05] transition-all"
                                    >
                                        TERMINATE_ANALYSIS
                                    </button>
                                </div>
                            </div>
                            <button 
                                onClick={() => setSelectedImage(null)}
                                className="absolute top-10 right-10 w-16 h-16 rounded-full bg-black/60 backdrop-blur-3xl border border-white/10 flex items-center justify-center text-white hover:scale-110 transition-transform active:scale-95 z-[110]"
                            >
                                <X size={32} />
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminGallery;
