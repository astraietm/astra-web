import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle, Loader2, ShieldCheck, Terminal, AlertCircle, Download, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// import eventsData from '../data/events'; // REMOVED DUMMY DATA
import ScrollReveal from '../components/common/ScrollReveal';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const { id } = useParams();
    // const event = eventsData.find(e => e.id === parseInt(id));
    
    // REAL DATA FETCHING
    const [event, setEvent] = useState(null);
    const [loadingEvent, setLoadingEvent] = useState(true);
    const { token, user, setIsLoginModalOpen } = useAuth();

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                // Try fetching from public events endpoint
                // Note: Adjust endpoint if your backend uses a different path like /api/events/
                const response = await fetch(`${import.meta.env.VITE_API_URL}/events/${id}/`);
                if (response.ok) {
                    const data = await response.json();
                    // Normalize data structure if needed
                    const normalizedEvent = {
                        ...data,
                        date: data.event_date ? new Date(data.event_date).toLocaleDateString(undefined, {
                            year: 'numeric', month: 'long', day: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                        }) : 'Date TBA',
                        // Ensure description and venue exist
                        description: data.description || 'No description available.',
                        venue: data.venue || 'TBA'
                    };
                    setEvent(normalizedEvent);
                } else {
                    setEvent(null);
                }
            } catch (error) {
                console.error("Failed to fetch event details", error);
                setEvent(null);
            } finally {
                setLoadingEvent(false);
            }
        };
        if (id) fetchEvent();
    }, [id]);

    // Trigger login modal if not authenticated
    useEffect(() => {
        if (!user) {
            const timer = setTimeout(() => setIsLoginModalOpen(true), 100);
            return () => clearTimeout(timer);
        }
    }, [user, setIsLoginModalOpen]);

    // Form state matching Django backend requirements
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone_number: ''
    });

    // CRITICAL FIX: Reset state when user changes (e.g. Logout -> Login as different user)
    // ensuring User B doesn't see User A's QR code if the component didn't unmount.
    useEffect(() => {
        setStatus('idle');
        setTicketData(null);
        setSubmissionStep(0);
        setErrorMsg('');
        setFocusedField(null);
    }, [user?.email]); 


    // Pre-fill form with user data if available
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                full_name: user.name || user.full_name || '',
                email: user.email || ''
            }));
        }
    }, [user]);
    
    const [status, setStatus] = useState('idle'); // idle, submitting, success, error
    const [errorMsg, setErrorMsg] = useState('');
    const [ticketData, setTicketData] = useState(null);
    const [focusedField, setFocusedField] = useState(null);

    // Simulated "System Check" steps for the submission effect
    const [submissionStep, setSubmissionStep] = useState(0);
    const steps = ["Encrypting Data...", "Handshaking with Server...", "Verifying Credentials...", "Access Granted"];

    if (loadingEvent) {
         return (
            <div className="min-h-screen flex items-center justify-center bg-background text-white">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
         );
    }

    if (!event) {
        return (
            <div className="min-h-screen pt-32 pb-12 flex items-center justify-center text-center bg-background">
                <div className="space-y-4">
                    <div className="inline-block p-4 rounded-full bg-red-500/10 border border-red-500/20 mb-4">
                        <Terminal className="w-8 h-8 text-red-500" />
                    </div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Event Not Found</h1>
                    <p className="text-gray-400">The requested event ID #{id} was not found in the database.</p>
                    <Link to="/events" className="text-primary hover:text-cyan-300 transition-colors font-mono text-sm underline underline-offset-4">Return to Events</Link>
                </div>
            </div>
        );
    }

    // Access Denied View for Unauthenticated Users
    if (!user) {
        return (
             <div className="min-h-screen pt-32 pb-20 bg-background relative overflow-hidden flex flex-col items-center justify-center">
                {/* Background Effects */}
                <div className="fixed inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[120px]"></div>
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
                </div>

                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative z-10 max-w-md w-full mx-4 p-8 bg-black/40 backdrop-blur-xl border border-red-500/20 rounded-2xl text-center shadow-2xl"
                >
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 relative group">
                        <div className="absolute inset-0 border border-red-500/40 rounded-full animate-ping opacity-20"></div>
                        <Lock className="w-10 h-10 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-display font-bold text-white mb-2">Access Restricted</h2>
                    <p className="text-gray-400 mb-8">
                        Secure clearance is required to proceed with registration for <span className="text-white font-medium">{event.title}</span>.
                    </p>
                    <button 
                        onClick={() => setIsLoginModalOpen(true)}
                        className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-red-500/25 flex items-center justify-center gap-2"
                    >
                        <UserIcon className="w-4 h-4" /> Authenticate to Continue
                    </button>
                    <div className="mt-6 flex justify-center">
                        <Link to="/events" className="text-xs font-mono text-gray-500 hover:text-gray-300 flex items-center gap-1 transition-colors">
                            <ArrowLeft className="w-3 h-3" /> ABORT SEQUENCE
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        setErrorMsg('');
        setSubmissionStep(0);

        // 1. Simulate the cool "hacking" progress steps
        let currentStep = 0;
        const interval = setInterval(() => {
            currentStep++;
            setSubmissionStep(currentStep);
            
            // Stop animation when we reach the end or if we are waiting for API
            if (currentStep >= steps.length - 1) {
                clearInterval(interval);
                submitToBackend();
            }
        }, 600);
    };

    const submitToBackend = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/register/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Add JWT Token
                },
                body: JSON.stringify({
                    event: event.id, // Send ID, not name
                    // User info is inferred from token by backend, but we might want to update phone
                    // For now, let's just send what we have. 
                    // Note: Backend CreateView currently only uses `user` from request and `event` from body.
                    // It ignores extra fields unless we override `perform_create` or Serializer.
                    // We should probably update the serializer to accept/update phone number, but 
                    // for now let's just register.
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSubmissionStep(steps.length); // Complete the visual steps
                setTicketData(data);
                setStatus('success');
            } else {
                setStatus('error');
                // Handle different error structures
                // Django DRF errors are usually { field: [errors] } or { detail: "message" }
                if (data.detail) {
                    setErrorMsg(data.detail);
                } else if (data.error) {
                    setErrorMsg(data.error);
                } else {
                    const firstKey = Object.keys(data)[0];
                    const firstError = data[firstKey];
                    setErrorMsg(`${firstKey}: ${Array.isArray(firstError) ? firstError[0] : firstError}`);
                }
            }
        } catch (error) {
            console.error('Registration Error:', error);
            setStatus('error');
            setErrorMsg('Failed to connect to the server. Is it running?');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const downloadQR = () => {
        if (!ticketData?.qr_code) return;
        const link = document.createElement('a');
        link.href = ticketData.qr_code;
        link.download = `${event.title.replace(/\s+/g, '_')}_Ticket.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen pt-32 pb-20 bg-background relative overflow-hidden">

            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px]"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
                <div className="absolute inset-0 bg-noise opacity-[0.03]"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10 md:pt-10">
                <Link to="/events" className="inline-flex items-center text-gray-500 hover:text-white transition-colors mb-8 group font-mono text-xs tracking-widest uppercase">
                    <ArrowLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back_to_Events
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-12 lg:gap-24 items-start max-w-6xl mx-auto">

                    {/* Left Column: Event Info */}
                    <div className="lg:sticky lg:top-32">
                        <ScrollReveal>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="font-mono text-xs text-green-500 tracking-widest uppercase">Registration Active</span>
                            </div>

                            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-none tracking-tight">
                                {event.title}
                            </h1>

                            <div className="flex flex-col gap-4 text-gray-400 mb-8 border-l-2 border-primary/20 pl-6">
                                <p className="font-light text-lg">{event.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mb-12">
                                <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                                    <div className="text-xs font-mono text-gray-500 uppercase mb-1">Timeline</div>
                                    <div className="text-white font-medium">{event.date}</div>
                                </div>
                                <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                                    <div className="text-xs font-mono text-gray-500 uppercase mb-1">Sector</div>
                                    <div className="text-white font-medium">{event.venue}</div>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* Right Column: Registration Form */}
                    <ScrollReveal delay={0.2} width="100%">
                        <div className="bg-surface/50 backdrop-blur-xl border border-white/10 rounded-2xl p-1 shadow-2xl relative group">

                            {/* Glowing Border Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-blue-600/20 rounded-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                            <div className="bg-[#0A0F1C] rounded-xl p-6 md:p-8 relative z-10 h-full">
                                <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                                    <h3 className="text-xl font-display font-bold text-white">Secure Entry</h3>
                                    <ShieldCheck className="w-5 h-5 text-primary" />
                                </div>

                                <AnimatePresence mode="wait">
                                    {status === 'success' ? (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-center py-6"
                                        >
                                            <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                                                <div className="absolute inset-0 border border-green-500/30 rounded-full animate-ping"></div>
                                                <CheckCircle className="w-10 h-10 text-green-500" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-white mb-2">Access Granted</h3>
                                            <p className="text-gray-400 mb-6 max-w-xs mx-auto">Your registration has been encrypted. Save your credential key below.</p>
                                            
                                            {/* QR Code Display */}
                                            <div className="bg-white p-4 rounded-xl border-4 border-primary/20 shadow-inner mb-6 mx-auto inline-block">
                                                <img 
                                                    src={ticketData?.qr_code} 
                                                    alt="Entry QR Code" 
                                                    className="w-40 h-40 object-contain"
                                                />
                                            </div>

                                            <div className="space-y-3">
                                                <button
                                                    onClick={downloadQR}
                                                    className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-black font-bold rounded-xl hover:bg-primary/90 transition-all uppercase text-sm tracking-wider"
                                                >
                                                    <Download className="w-4 h-4" /> Save Ticket
                                                </button>
                                                
                                                <Link to="/events" className="w-full block py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 hover:border-white/20 transition-all font-mono text-sm uppercase tracking-wider">
                                                    Return_to_Base
                                                </Link>
                                            </div>
                                        </motion.div>
                                    ) : status === 'submitting' ? (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="py-20 text-center space-y-6"
                                        >
                                            <div className="relative w-20 h-20 mx-auto">
                                                <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin"></div>
                                                <div className="absolute inset-2 border-r-2 border-blue-500 rounded-full animate-spin reverse"></div>
                                            </div>
                                            <div className="font-mono text-sm text-primary animate-pulse">
                                                {steps[Math.min(submissionStep, steps.length - 1)]}
                                            </div>
                                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden max-w-[200px] mx-auto">
                                                <motion.div
                                                    className="h-full bg-primary"
                                                    initial={{ width: "0%" }}
                                                    animate={{ width: `${(submissionStep / steps.length) * 100}%` }}
                                                />
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.form
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            onSubmit={handleSubmit}
                                            className="space-y-5"
                                        >
                                            {status === 'error' && (
                                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 text-red-400 text-xs font-mono">
                                                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                                    <span>{errorMsg}</span>
                                                </div>
                                            )}

                                            {/* HARDCODED FIELDS FOR BACKEND API */}
                                            {[
                                                { name: "full_name", label: "Full Name", type: "text", placeholder: "e.g. Alex Chen", disabled: true }, // Name is from Google
                                                { name: "email", label: "Email Address", type: "email", placeholder: "e.g. alex@university.edu", disabled: true }, // Email is from Google
                                                { name: "phone_number", label: "Phone Number", type: "tel", placeholder: "e.g. +91 98765 43210" }
                                            ].map((field) => (
                                                <motion.div
                                                    key={field.name}
                                                    className="relative group"
                                                    initial={false}
                                                    animate={focusedField === field.name ? { scale: 1.02 } : { scale: 1 }}
                                                >
                                                    <label htmlFor={field.name} className={`block text-xs font-mono mb-2 transition-colors ${focusedField === field.name ? 'text-primary' : 'text-gray-400'}`}>
                                                        {field.label} {field.disabled && <span className="text-gray-600 ml-2">(Pre-filled)</span>}
                                                    </label>

                                                    <div className="relative">
                                                        <input
                                                            type={field.type}
                                                            id={field.name}
                                                            name={field.name}
                                                            placeholder={field.placeholder || ""}
                                                            required={!field.disabled}
                                                            disabled={field.disabled}
                                                            value={formData[field.name]}
                                                            onChange={handleChange}
                                                            onFocus={() => !field.disabled && setFocusedField(field.name)}
                                                            onBlur={() => setFocusedField(null)}
                                                            className={`w-full border rounded-lg px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all outline-none ${field.disabled ? 'bg-white/5 border-white/5 text-gray-400 cursor-not-allowed' : 'bg-black/40 border-white/10'}`}
                                                        />
                                                        {/* Corner accents */}
                                                        {!field.disabled && (
                                                            <>
                                                                <span className={`absolute top-0 left-0 w-2 h-2 border-t border-l transition-colors duration-300 ${focusedField === field.name ? 'border-primary' : 'border-transparent'}`}></span>
                                                                <span className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r transition-colors duration-300 ${focusedField === field.name ? 'border-primary' : 'border-transparent'}`}></span>
                                                            </>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            ))}

                                            <div className="pt-6">
                                                <button
                                                    type="submit"
                                                    disabled={status === 'submitting'}
                                                    className="w-full bg-gradient-to-r from-primary to-blue-600 text-black font-bold font-display text-lg py-4 rounded-xl hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
                                                >
                                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                                        Initialize Sequence <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                    </span>
                                                    {/* Shine Effect */}
                                                    <div className="absolute top-0 -left-[100%] w-full h-full bg-white/30 transform skew-x-12 group-hover:animate-[shine_1s_infinite]"></div>
                                                </button>
                                            </div>

                                            <div className="text-center">
                                                <p className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">
                                                    Encrypted • Secure • Verified
                                                </p>
                                            </div>
                                        </motion.form>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </div>
    );
};

// Simple Icon component for the error state
function UserIcon({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    )
}

export default Register;
