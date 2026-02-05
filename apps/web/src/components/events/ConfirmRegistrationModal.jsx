import React, { useState, useEffect } from 'react';
import { X, Loader2, User, Mail, Phone, GraduationCap, Building, BookOpen } from 'lucide-react';
import axios from 'axios';

const OPEN_EVENTS = [995, 996]; // Shadow Login (995), Cipher Decode (996)

const DEPARTMENTS = [
    'CSE A', 'CSE B', 'Cyber Security', 'AI/DS', 'BBA', 'BCA A', 'BCA B', 'BCA', 'MCA', 'MBA', 'Diploma CSE', 'Diploma AIML', 'Other'
];

const YEARS = [
    '1st Year',
    '2nd Year',
    '3rd Year',
    '4th Year',
    'Other'
];

const ConfirmRegistrationModal = ({ isOpen, onClose, onConfirm, eventName, eventId, token, isLoading }) => {
    const isIntraCollege = !OPEN_EVENTS.includes(parseInt(eventId));

    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone_number: '',
        college: '',
        department: '',
        year_of_study: ''
    });
    const [fetchingProfile, setFetchingProfile] = useState(false);

    // Fetch user profile when modal opens
    useEffect(() => {
        if (isOpen && token) {
            fetchUserProfile();
            document.body.style.overflow = 'hidden';
        } else if (isOpen) {
             document.body.style.overflow = 'hidden';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, token]);

    // Handle initial state for fields
    useEffect(() => {
        if (isIntraCollege) {
            setFormData(prev => ({
                ...prev,
                college: 'KMCT Institute of Emerging Technology and Management'
            }));
        }
    }, [isIntraCollege, isOpen]);

    const fetchUserProfile = async () => {
        try {
            setFetchingProfile(true);
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/auth/me/`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Logic: If IntraCollege, force KMCT. Else use profile college (if exists) or empty.
            // If profile has dept/year, pre-fill them too.
            const userCollege = isIntraCollege 
                ? 'KMCT Institute of Emerging Technology and Management' 
                : (response.data.college || '');

            setFormData(prev => ({
                ...prev,
                full_name: response.data.full_name || '',
                email: response.data.email || '',
                phone_number: response.data.phone_number || '',
                college: userCollege,
                department: response.data.department || '',
                year_of_study: response.data.year_of_study || ''
            }));
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

            <div className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl shadow-primary/20 overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5 sticky top-0 backdrop-blur-md z-10">
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
                            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl mb-6">
                                <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
                                    Event
                                </p>
                                <p className="text-white font-bold text-lg">
                                    {eventName}
                                </p>
                                {isIntraCollege && (
                                    <div className="mt-2 text-[10px] font-bold uppercase tracking-widest text-yellow-500 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                                        Exclusively for KMCT IETM Students
                                    </div>
                                )}
                            </div>

                            {/* Standard Fields */}
                            <div className="grid gap-5">
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
                                </div>

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
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                            </div>
                            
                            {/* Academic Fields (Conditioned) */}
                            <div className="pt-4 border-t border-white/5 space-y-5">
                                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                                    <GraduationCap className="w-4 h-4 text-blue-500" />
                                    Academic Details
                                </h3>
                                
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                        <Building className="w-3.5 h-3.5" />
                                        College
                                    </label>
                                    <input
                                        type="text"
                                        name="college"
                                        value={formData.college}
                                        onChange={handleChange}
                                        readOnly={isIntraCollege} // Read only if intra college
                                        required
                                        className={`w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all ${isIntraCollege ? 'opacity-70 cursor-not-allowed bg-white/[0.02] text-gray-400' : ''}`}
                                        placeholder="Enter your college name"
                                    />
                                </div>

                                {isIntraCollege && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                                <BookOpen className="w-3.5 h-3.5" />
                                                Department
                                            </label>
                                            <div className="relative">
                                                <select
                                                    name="department"
                                                    value={formData.department}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
                                                >
                                                    <option value="" className="bg-[#0a0a0a]">Select Dept</option>
                                                    {DEPARTMENTS.map(dept => (
                                                        <option key={dept} value={dept} className="bg-[#0a0a0a]">{dept}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">▼</div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                                <GraduationCap className="w-3.5 h-3.5" />
                                                Year / Batch
                                            </label>
                                            <div className="relative">
                                                <select
                                                    name="year_of_study"
                                                    value={formData.year_of_study}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all appearance-none cursor-pointer"
                                                >
                                                    <option value="" className="bg-[#0a0a0a]">Select Year</option>
                                                    {YEARS.map(year => (
                                                        <option key={year} value={year} className="bg-[#0a0a0a]">{year}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">▼</div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer Note */}
                            <p className="text-xs text-gray-500 text-center pt-2">
                                By registering, you agree to the event rules.
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
                                    disabled={isLoading || !formData.full_name.trim() || !formData.phone_number.trim() || !formData.college.trim() || (isIntraCollege && (!formData.department || !formData.year_of_study))}
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
