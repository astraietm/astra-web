import React, { useState, useEffect } from 'react';
import { X, Loader2, User, Mail, Phone } from 'lucide-react';
import axios from 'axios';

const ConfirmRegistrationModal = ({ isOpen, onClose, onConfirm, eventName, token, isLoading }) => {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone_number: ''
    });
    const [fetchingProfile, setFetchingProfile] = useState(false);

    // Fetch user profile when modal opens
    useEffect(() => {
        if (isOpen && token) {
            fetchUserProfile();
        }
    }, [isOpen, token]);

    const fetchUserProfile = async () => {
        try {
            setFetchingProfile(true);
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/auth/me/`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setFormData({
                full_name: response.data.full_name || '',
                email: response.data.email || '',
                phone_number: response.data.phone_number || ''
            });
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        } finally {
            setFetchingProfile(false);
        }
    };

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(formData);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl shadow-primary/20 overflow-hidden animate-in fade-in zoom-in duration-300">

                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                    <h2 className="text-xl font-bold font-display text-white">
                        Confirm Registration
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {fetchingProfile ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                            <span className="ml-2 text-gray-400">Loading your details...</span>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* Event Name Display */}
                            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                                <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
                                    Event
                                </p>
                                <p className="text-white font-bold">
                                    {eventName}
                                </p>
                            </div>

                            {/* Editable Name Field */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                    <User className="w-3.5 h-3.5" />
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="full_name"
                                    required
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                    placeholder="Enter your full name"
                                />
                            </div>

                            {/* Email Field (Read-only) */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                    <Mail className="w-3.5 h-3.5" />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    readOnly
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 cursor-not-allowed"
                                />
                                <p className="text-xs text-gray-500 ml-1">
                                    Email from your Google account
                                </p>
                            </div>

                            {/* Phone Number Field */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                    <Phone className="w-3.5 h-3.5" />
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phone_number"
                                    required
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                    placeholder="e.g. +91 98765 43210"
                                />
                            </div>

                            <p className="text-xs text-gray-500 ml-1">
                                These details will appear on your ticket
                            </p>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-3 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading || !formData.full_name.trim() || !formData.phone_number.trim()}
                                    className="flex-[2] py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Registering...
                                        </>
                                    ) : (
                                        'Confirm Registration'
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConfirmRegistrationModal;
