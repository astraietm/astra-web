import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Trash2, Shield, Image, Loader2 } from 'lucide-react';

const AdminGallery = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    
    // New Item State
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('workshops');
    const [imageFile, setImageFile] = useState(null);

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
        try {
            const response = await axios.get(`${API_URL}/gallery/`);
            setItems(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching gallery:', error);
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!imageFile || !title) return;

        setUploading(true);

        try {
            // 1. Upload to Cloudinary
            const formData = new FormData();
            formData.append('file', imageFile);
            formData.append('upload_preset', UPLOAD_PRESET);

            const cloudinaryRes = await axios.post(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                formData
            );

            const { secure_url, public_id } = cloudinaryRes.data;

            // 2. Save metadata to Backend
            await axios.post(
                `${API_URL}/gallery/`,
                {
                    title,
                    category,
                    image_url: secure_url,
                    public_id: public_id
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            // Reset form and refresh
            setTitle('');
            setImageFile(null);
            fetchGalleryItems();
            alert('Image uploaded successfully!');

        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed. Check console for details.');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this image?')) return;
        try {
            await axios.delete(`${API_URL}/gallery/${id}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchGalleryItems();
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Failed to delete image.');
        }
    };

    if (loading) return <div className="text-white text-center pt-20">Loading...</div>;

    return (
        <div className="min-h-screen bg-[#030712] text-white pt-24 pb-12 px-4 font-outfit">
            <div className="max-w-6xl mx-auto">
                <button 
                    onClick={() => navigate('/admin')}
                    className="flex items-center gap-2 text-white/50 hover:text-primary mb-8"
                >
                    <ArrowLeft /> Back to Dashboard
                </button>

                <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
                    <Image className="text-primary" /> Gallery Manager
                </h1>

                {/* Upload Section */}
                <div className="bg-white/5 border border-white/10 p-8 rounded-2xl mb-12">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Upload className="w-5 h-5 text-primary" /> Upload New Image
                    </h2>
                    
                    {!CLOUD_NAME || !UPLOAD_PRESET ? (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg">
                            ⚠️ Cloudinary credentials missing in .env file (VITE_CLOUDINARY_CLOUD_NAME, VITE_CLOUDINARY_UPLOAD_PRESET)
                        </div>
                    ) : (
                        <form onSubmit={handleUpload} className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Image Title</label>
                                    <input 
                                        type="text" 
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 focus:border-primary/50 outline-none"
                                        placeholder="e.g. Cyber Summit 2025"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Category</label>
                                    <select 
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 focus:border-primary/50 outline-none"
                                    >
                                        <option value="workshops">Workshops</option>
                                        <option value="ctf">CTF</option>
                                        <option value="seminars">Seminars</option>
                                        <option value="hackathons">Hackathons</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Select Image</label>
                                    <input 
                                        type="file" 
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 focus:border-primary/50 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-black hover:file:bg-primary-hover"
                                        required
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={uploading}
                                    className="w-full bg-primary text-black font-bold py-3 rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {uploading ? <Loader2 className="animate-spin" /> : <Upload className="w-5 h-5" />}
                                    {uploading ? 'Uploading...' : 'Upload to Gallery'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Existing Images */}
                <h2 className="text-xl font-bold mb-6">Existing Images ({items.length})</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {items.map(item => (
                        <div key={item.id} className="group relative bg-surface rounded-xl overflow-hidden border border-white/5">
                            <img src={item.image_url} alt={item.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                <h3 className="font-bold">{item.title}</h3>
                                <p className="text-xs text-primary uppercase tracking-widest">{item.category}</p>
                                <button 
                                    onClick={() => handleDelete(item.id)}
                                    className="absolute top-2 right-2 p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminGallery;
