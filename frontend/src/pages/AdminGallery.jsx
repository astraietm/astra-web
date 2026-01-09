import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Trash2, Shield, Image, Loader2, Edit2, X, Check, Database, AlertTriangle } from 'lucide-react';

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

    const API_URL = import.meta.env.VITE_API_URL;
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
        setImageFile(null); // Reset file input as we might just be editing metadata
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
        // If creating new, need image. If editing, image is optional (can keep old)
        if (!editingItem && !imageFile) return;

        setUploading(true);

        try {
            let imageUrl = editingItem ? editingItem.image_url : '';
            let publicId = editingItem ? editingItem.public_id : '';

            // 1. Upload to Cloudinary if new file selected
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

            // 2. Save/Update metadata to Backend
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

            // Reset form and refresh
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
            // If deleting the item currently being edited, cancel edit
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
        <div className="space-y-8 pb-12">
            {/* Context Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-widest uppercase flex items-center gap-3">
                         <Image className="text-primary w-6 h-6" />
                         Asset_Registry
                    </h1>
                    <p className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.3em] mt-1">Manage Peripheral Intelligence Archives</p>
                </div>
                <button 
                    onClick={fetchGalleryItems}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all group"
                    title="Resync Registry"
                >
                    <Shield className={`w-4 h-4 ${loading ? 'animate-spin text-primary' : 'group-hover:scale-110'}`} />
                </button>
            </div>

            {error && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-between group">
                    <div className="flex items-center gap-3 text-rose-500">
                        <AlertTriangle className="w-5 h-5" />
                        <span className="text-xs font-mono font-bold uppercase tracking-widest">{error}</span>
                    </div>
                    <button onClick={fetchGalleryItems} className="text-[10px] font-mono text-rose-500 hover:underline uppercase tracking-widest">Retry_Sync</button>
                </div>
            )}



                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column: Upload/Edit Form */}
                    <div className="lg:col-span-1">
                        <div className={`sticky top-24 backdrop-blur-2xl border rounded-3xl p-6 lg:p-8 shadow-2xl transition-colors duration-500
                            ${editingItem ? 'bg-primary/5 border-primary/30' : 'bg-surface/30 border-white/10'}`}>
                             
                             <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    {editingItem ? <Edit2 className="w-5 h-5 text-primary" /> : <Upload className="w-5 h-5 text-primary" />}
                                    <span className="font-display tracking-wide">{editingItem ? 'Edit Metadata' : 'Upload Interface'}</span>
                                </h2>
                                {editingItem && (
                                    <button onClick={handleCancelEdit} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white">
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                             </div>

                            {!CLOUD_NAME || !UPLOAD_PRESET ? (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm leading-relaxed backdrop-blur-md">
                                    ⚠️ <strong>Configuration Error</strong><br/>
                                    Cloudinary credentials missing in env.
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Image Dropzone */}
                                    <div 
                                        className={`relative group cursor-pointer transition-all duration-300 rounded-2xl border-2 border-dashed h-56 flex flex-col items-center justify-center text-center overflow-hidden
                                            ${dragActive ? 'border-primary bg-primary/5' : 'border-white/10 bg-black/20 hover:border-white/30 hover:bg-white/5'}`}
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                    >
                                        <input 
                                            type="file" 
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                            // Required only if creating new (editingItem is null) AND we haven't selected a file yet AND there's no preview (edge case)
                                            // Actually simpler: NOT required if editingItem is present.
                                            required={!editingItem && !preview}
                                        />
                                        
                                        {preview ? (
                                            <div className="absolute inset-0 w-full h-full z-10 group-hover:scale-105 transition-transform duration-500">
                                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                                    <p className="text-white font-medium flex items-center gap-2">
                                                        <Upload className="w-4 h-4" /> Replace Image
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-6 relative z-10 pointer-events-none">
                                                <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 border border-white/10 shadow-inner">
                                                    <Image className="w-7 h-7 text-white/40 group-hover:text-primary transition-colors" />
                                                </div>
                                                <p className="text-white/80 font-medium mb-1">Drag image here</p>
                                                <p className="text-white/40 text-xs">or click to browse</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Inputs */}
                                    <div className="space-y-4">
                                        <div className="group">
                                            <label className="block text-xs font-mono text-primary uppercase tracking-widest mb-2 group-focus-within:text-white transition-colors">Asset Identity</label>
                                            <input 
                                                type="text" 
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all placeholder:text-white/20 hover:border-white/20"
                                                placeholder="e.g. Cyber Summit 2025"
                                                required
                                            />
                                        </div>
                                        <div className="group">
                                            <label className="block text-xs font-mono text-primary uppercase tracking-widest mb-2 group-focus-within:text-white transition-colors">Classification</label>
                                            <select 
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all appearance-none cursor-pointer text-white/80 hover:border-white/20"
                                            >
                                                <option value="workshops" className="bg-[#0A0F1C]">Workshops</option>
                                                <option value="ctf" className="bg-[#0A0F1C]">CTF</option>
                                                <option value="seminars" className="bg-[#0A0F1C]">Seminars</option>
                                                <option value="hackathons" className="bg-[#0A0F1C]">Hackathons</option>
                                                <option value="other" className="bg-[#0A0F1C]">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <button 
                                        type="submit" 
                                        disabled={uploading}
                                        className={`w-full font-bold py-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden group
                                            ${editingItem 
                                                ? 'bg-primary text-black hover:bg-white shadow-[0_0_20px_rgba(0,224,255,0.2)]' 
                                                : 'bg-white/10 border border-white/10 text-white hover:bg-primary hover:text-black hover:border-primary'
                                            }
                                        `}
                                    >
                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                        <span className="relative flex items-center gap-2">
                                            {uploading ? <Loader2 className="animate-spin w-5 h-5" /> : (editingItem ? <Check className="w-5 h-5" /> : <Upload className="w-5 h-5" />)}
                                            {uploading ? 'PROCESSING...' : (editingItem ? 'SAVE CHANGES' : 'DEPLOY TO ARCHIVE')}
                                        </span>
                                    </button>
                                    
                                    {editingItem && (
                                        <button 
                                            type="button"
                                            onClick={handleCancelEdit}
                                            className="w-full text-xs font-mono text-white/40 hover:text-white transition-colors uppercase tracking-widest"
                                        >
                                            Cancel Modification
                                        </button>
                                    )}
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Gallery Grid */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold font-display">Archives Database</h2>
                            <span className="text-xs font-mono text-white/40 bg-white/5 px-2 py-1 rounded border border-white/5">
                                {items.length} RECORDS FOUND
                            </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {items.map(item => (
                                <div 
                                    key={item.id} 
                                    className={`group relative bg-surface/50 backdrop-blur-md rounded-2xl overflow-hidden border transition-all duration-300 aspect-[4/3] shadow-lg
                                        ${editingItem?.id === item.id ? 'ring-2 ring-primary border-transparent scale-[0.98] opacity-50 grayscale' : 'border-white/5 hover:border-primary/50 hover:shadow-primary/10 hover:-translate-y-1'}
                                    `}
                                >
                                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                                    
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            <p className="text-[10px] text-primary font-mono uppercase tracking-widest mb-1">{item.category}</p>
                                            <h3 className="font-bold text-sm leading-tight text-white mb-2 line-clamp-2">{item.title}</h3>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="absolute top-2 right-2 flex gap-2 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100 z-10">
                                         <button 
                                            onClick={() => handleEditStart(item)}
                                            className="p-2 bg-white/10 backdrop-blur-md text-white rounded-lg hover:bg-primary hover:text-black transition-colors shadow-lg border border-white/10"
                                            title="Edit Metadata"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                         <button 
                                            onClick={() => handleDelete(item.id)}
                                            className="p-2 bg-red-500/20 backdrop-blur-md text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors shadow-lg border border-red-500/20"
                                            title="Delete Asset"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>

                                    {/* Active Indicator */}
                                    {editingItem?.id === item.id && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                                            <span className="text-primary font-mono text-xs uppercase tracking-widest border border-primary/50 px-3 py-1 rounded-full animate-pulse">
                                                Editing...
                                            </span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        
                        {loading && items.length === 0 ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-24 bg-white/[0.02] border border-white/5 rounded-2xl animate-pulse" />
                                ))}
                            </div>
                        ) : items.length === 0 ? (
                            <div className="h-64 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-3xl bg-[#0A0A0B]">
                                <Shield className="w-12 h-12 text-white/5 mb-4" />
                                <p className="text-gray-500 font-mono text-[10px] uppercase tracking-[0.3em]">No Intelligence Assets Logged</p>
                            </div>
                        ) : null}
                    </div>
                </div>
                {/* Custom Delete Confirmation Modal */}
                {deleteId && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300" onClick={() => setDeleteId(null)}></div>
                        <div className="relative bg-[#0A0F1C]/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 md:p-8 max-w-md w-full shadow-[0_0_50px_rgba(239,68,68,0.2)] overflow-hidden scale-100 animate-in fade-in zoom-in-95 duration-200">
                             {/* Glow Effect */}
                             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
                             <div className="absolute -top-20 -left-20 w-40 h-40 bg-red-500/20 blur-3xl rounded-full pointer-events-none"></div>
                             <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-red-500/10 blur-3xl rounded-full pointer-events-none"></div>

                             <div className="flex flex-col items-center text-center relative z-10">
                                 <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse">
                                     <Trash2 className="w-9 h-9 text-red-500" />
                                 </div>
                                 <h3 className="text-2xl font-bold font-display text-white mb-2">Confirm Termination</h3>
                                 <p className="text-white/60 text-sm mb-8 leading-relaxed max-w-xs mx-auto">
                                     This action will permanently purge this asset from the neural archives. <br/> <span className="text-red-400 font-mono text-xs mt-2 block">&gt;&gt; ACTION CANNOT BE UNDONE</span>
                                 </p>
                                 <div className="flex w-full gap-4">
                                     <button 
                                         onClick={() => setDeleteId(null)}
                                         className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-colors border border-white/5 hover:border-white/20 backdrop-blur-md"
                                     >
                                         Abort
                                     </button>
                                     <button 
                                         onClick={confirmDelete}
                                         className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:scale-[1.02]"
                                     >
                                         Execute Delete
                                     </button>
                                 </div>
                             </div>
                        </div>
                    </div>
                )}
        </div>
    );
};

export default AdminGallery;
