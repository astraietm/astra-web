import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Upload, Trash2, Shield, Image, Loader2, Edit2, X, Check, Database, AlertTriangle } from 'lucide-react';
import { getOptimizedImageUrl } from '../utils/helpers';

const AdminGallery = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [uploading, setUploading] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('workshops');
    const [imageFile, setImageFile] = useState(null);
    const [editingItem, setEditingItem] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    useEffect(() => {
        if (user && !user.is_staff) {
            navigate('/');
        } else {
            fetchGalleryItems();
        }
    }, [user, navigate]);

    const fetchGalleryItems = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/gallery/`);
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching gallery:', error);
            setError('Neural link severed. Failed to retrieve asset archives.');
        } finally {
            setLoading(false);
        }
    };

    const [dragActive, setDragActive] = useState(false);
    const [preview, setPreview] = useState(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFile = (file) => {
        setImageFile(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleEditStart = (item) => {
        setEditingItem(item);
        setTitle(item.title);
        setCategory(item.category);
        setPreview(item.image_url);
        setImageFile(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingItem(null);
        setTitle('');
        setCategory('workshops');
        setPreview(null);
        setImageFile(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title) return;
        if (!editingItem && !imageFile) return;

        setUploading(true);
        try {
            let imageUrl = editingItem ? editingItem.image_url : '';
            let publicId = editingItem ? editingItem.public_id : '';

            if (imageFile) {
                const formData = new FormData();
                formData.append('file', imageFile);
                formData.append('upload_preset', UPLOAD_PRESET);

                const cloudinaryRes = await axios.post(
                    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                    formData
                );
                imageUrl = cloudinaryRes.data.secure_url;
                publicId = cloudinaryRes.data.public_id;
            }

            const payload = {
                title,
                category,
                image_url: imageUrl,
                public_id: publicId
            };

            const config = { headers: { Authorization: `Bearer ${token}` } };
            if (editingItem) {
                await axios.put(`${API_URL}/gallery/${editingItem.id}/`, payload, config);
            } else {
                await axios.post(`${API_URL}/gallery/`, payload, config);
            }
            handleCancelEdit();
            fetchGalleryItems();
        } catch (error) {
            console.error('Operation failed:', error);
            alert('Operation failed. Check console for details.');
        } finally {
            setUploading(false);
        }
    };

    const [deleteId, setDeleteId] = useState(null);

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await axios.delete(`${API_URL}/gallery/${deleteId}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchGalleryItems();
            if (editingItem && editingItem.id === deleteId) {
                handleCancelEdit();
            }
            setDeleteId(null);
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Failed to delete image.');
            setDeleteId(null);
        }
    };

    const handleDelete = (id) => {
        setDeleteId(id);
    };

    return (
        <div className="space-y-12 pb-24 font-inter">
            {/* Asset Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-px bg-blue-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">Asset Management</span>
                    </div>
                    <h1 className="text-5xl font-black text-white tracking-tighter leading-none uppercase">Gallery Hub</h1>
                    <p className="text-slate-500 text-sm font-medium">Manage neural archives and operational telemetry visuals.</p>
                </div>
                
                <div className="flex gap-4">
                    <button 
                        onClick={fetchGalleryItems}
                        className="h-14 px-8 rounded-2xl bg-white/[0.03] border border-white/5 text-slate-300 hover:text-white hover:bg-white/[0.05] transition-all flex items-center justify-center group"
                    >
                        <Shield className={`w-5 h-5 ${loading ? 'animate-spin text-blue-500' : 'group-hover:scale-110'}`} />
                    </button>
                </div>
            </div>

            {error && (
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-[2rem] flex items-center justify-between">
                    <div className="flex items-center gap-4 text-rose-500">
                        <AlertTriangle size={24} />
                        <span className="text-xs font-black uppercase tracking-widest">{error}</span>
                    </div>
                    <button onClick={fetchGalleryItems} className="px-6 py-2 rounded-xl bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all">Retry Link</button>
                </motion.div>
            )}

            <div className="grid lg:grid-cols-12 gap-10">
                {/* Left Column: Upload UI */}
                <div className="lg:col-span-4">
                    <div className={`sticky top-24 backdrop-blur-3xl border rounded-[2.5rem] p-10 shadow-2xl transition-all duration-500
                        ${editingItem ? 'bg-blue-600/[0.05] border-blue-500/20' : 'bg-[#050505]/60 border-white/5'}`}>
                         
                         <div className="flex items-center justify-between mb-8">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Protocol Interface</p>
                                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                                    {editingItem ? 'Asset Update' : 'New Archive'}
                                </h2>
                            </div>
                            {editingItem && (
                                <button onClick={handleCancelEdit} className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-all">
                                    <X size={18} />
                                </button>
                            )}
                         </div>

                        {!CLOUD_NAME || !UPLOAD_PRESET ? (
                            <div className="p-6 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                                Configuration Failure: Cloudinary credentials missing.
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div 
                                    className={`relative group cursor-pointer transition-all duration-500 rounded-[2rem] border-2 border-dashed h-64 flex flex-col items-center justify-center overflow-hidden
                                        ${dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-white/5 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]'}`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    <input type="file" onChange={handleFileChange} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" required={!editingItem && !preview} />
                                    
                                    {preview ? (
                                        <div className="absolute inset-0 w-full h-full z-10 group-hover:scale-105 transition-transform duration-700">
                                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-sm">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Upload className="text-white" size={24} />
                                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Replace Visual</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-8 relative z-10 pointer-events-none flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 bg-white/[0.03] rounded-[1.5rem] border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                                <Image className="text-slate-600 group-hover:text-blue-500 transition-colors" size={32} />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xs font-black text-white uppercase tracking-widest mb-1">Upload Visual</p>
                                                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Drag or Click to Select</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest pl-1">Asset Designation</label>
                                        <input 
                                            type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                                            className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-sm font-bold text-white focus:border-blue-500/20 focus:outline-none transition-all placeholder:text-slate-800"
                                            placeholder="e.g. Operation Omega 2025" required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest pl-1">Category Classification</label>
                                        <select 
                                            value={category} onChange={(e) => setCategory(e.target.value)}
                                            className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-sm font-bold text-slate-400 focus:border-blue-500/20 focus:outline-none transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="workshops">Workshops</option>
                                            <option value="ctf">CTF Operations</option>
                                            <option value="seminars">Seminars</option>
                                            <option value="hackathons">Hackathons</option>
                                            <option value="other">Other Assets</option>
                                        </select>
                                    </div>
                                </div>

                                <button 
                                    type="submit" disabled={uploading}
                                    className={`w-full h-16 rounded-2xl transition-all duration-500 flex items-center justify-center gap-3 font-black text-[11px] uppercase tracking-widest
                                        ${editingItem ? 'bg-blue-600 text-white shadow-[0_0_30px_rgba(37,99,235,0.3)]' : 'bg-white text-black hover:bg-blue-600 hover:text-white'}
                                    `}
                                >
                                    {uploading ? <Loader2 className="animate-spin" size={20} /> : (editingItem ? <Check size={20} /> : <Upload size={20} />)}
                                    {uploading ? 'Processing Architecture...' : (editingItem ? 'Commit Updates' : 'Deploy Asset')}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Right Column: Registry Grid */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="flex items-center justify-between pb-4 border-b border-white/5">
                        <h2 className="text-xl font-black text-white uppercase tracking-tighter">Asset Registry</h2>
                        <span className="px-4 py-1.5 rounded-xl bg-white/[0.02] border border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            {items.length} Synchronized Records
                        </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                        {items.map((item, idx) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                key={item.id} 
                                className={`group relative bg-[#050505]/60 backdrop-blur-xl rounded-[2rem] overflow-hidden border transition-all duration-500 aspect-square shadow-2xl
                                    ${editingItem?.id === item.id ? 'border-blue-500 bg-blue-500/5 rotate-1 grayscale' : 'border-white/5 hover:border-blue-500/30 hover:-translate-y-2'}
                                `}
                            >
                                <img src={getOptimizedImageUrl(item.image_url, 'grid')} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" />
                                
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-1">{item.category}</p>
                                        <h3 className="font-black text-base text-white uppercase tracking-tight line-clamp-2">{item.title}</h3>
                                    </div>
                                </div>

                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 z-10 translate-x-4 group-hover:translate-x-0">
                                     <button onClick={() => handleEditStart(item)} className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-3xl border border-white/20 text-white flex items-center justify-center hover:bg-blue-600 hover:border-blue-500 transition-all shadow-2xl">
                                        <Edit2 size={16} strokeWidth={2.5} />
                                    </button>
                                     <button onClick={() => handleDelete(item.id)} className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-3xl border border-white/20 text-white flex items-center justify-center hover:bg-rose-500 hover:border-rose-500 transition-all shadow-2xl">
                                        <Trash2 size={16} strokeWidth={2.5} />
                                    </button>
                                </div>

                                {editingItem?.id === item.id && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-blue-600/20 backdrop-blur-sm">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-10 h-10 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                            <span className="text-[9px] font-black text-white uppercase tracking-[0.4em]">Configuring...</span>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                    
                    {loading && items.length === 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="aspect-square bg-white/[0.02] border border-white/5 rounded-[2rem] animate-pulse" />
                            ))}
                        </div>
                    )}
                    
                    {!loading && items.length === 0 && (
                        <div className="h-96 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-[3rem] bg-[#050505]/40 p-12 text-center">
                            <Database size={48} className="text-slate-800 mb-6" strokeWidth={1} />
                            <p className="text-xl font-black text-slate-500 uppercase tracking-widest">Archive Empty</p>
                            <p className="text-[10px] font-bold text-slate-700 uppercase tracking-[0.2em] mt-2">Zero operational visuals synchronized</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Tactical Logout/Deletion Confirmation */}
            <AnimatePresence>
                {deleteId && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setDeleteId(null)} />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-[#050505] border border-white/5 rounded-[3rem] p-12 max-w-lg w-full shadow-2xl overflow-hidden">
                             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-600 to-transparent" />
                             
                             <div className="flex flex-col items-center text-center relative z-10 space-y-10">
                                 <div className="w-24 h-24 bg-rose-500/10 rounded-[2.5rem] flex items-center justify-center border border-rose-500/20 shadow-[0_0_50px_rgba(244,63,94,0.2)] animate-pulse">
                                     <Trash2 className="w-10 h-10 text-rose-500" strokeWidth={2.5} />
                                 </div>
                                 <div className="space-y-3">
                                     <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">TERMINATE ASSET</h3>
                                     <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xs mx-auto">
                                         This action will permanently purge the visual record from the neural archives. This cannot be reversed.
                                     </p>
                                 </div>
                                 <div className="flex w-full gap-6">
                                     <button onClick={() => setDeleteId(null)} className="flex-1 h-16 rounded-[1.5rem] border border-white/5 text-[11px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-all">
                                         Abort Operation
                                     </button>
                                     <button onClick={confirmDelete} className="flex-1 h-16 rounded-[1.5rem] bg-rose-600 text-white font-black text-[11px] uppercase tracking-widest hover:bg-rose-500 transition-all shadow-[0_0_40px_rgba(244,63,94,0.3)]">
                                         Execute Purge
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
