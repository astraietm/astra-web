import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
    Calendar, Clock, MapPin, Users, ArrowLeft, Share2,
    Wallet, CheckCircle2, XCircle, Timer, Sparkles, Award, Target, ChevronRight, CreditCard, Loader2
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import SkeletonLoader from '../components/common/SkeletonLoader';
import HawkinsLabDetail from '../components/events/HawkinsLabDetail';
import { useAuth } from '../context/AuthContext';
import TeamRegistrationModal from '../components/events/TeamRegistrationModal';
import ConfirmRegistrationModal from '../components/events/ConfirmRegistrationModal';
import TicketDownload from '../components/events/TicketDownload';
import useRazorpayPayment from '../components/payment/RazorpayPayment';
import eventsData from '../data/events';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const { user, token, requireLogin } = useAuth();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [registrationData, setRegistrationData] = useState(null);
    const [registering, setRegistering] = useState(false);
    const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const handlePayment = useRazorpayPayment();

    useEffect(() => {
        const fetchEvent = async () => {
            const CACHE_KEY = 'astra_events_v2';
            let hasCachedData = false;

            // Helper to Map Event Data safely
            const mapEventData = (data) => ({
                ...data,
                date: data.event_date || data.date,
                is_paid: data.requires_payment !== undefined ? data.requires_payment : data.is_paid,
                fee: data.payment_amount ? `₹${data.payment_amount}` : data.fee,
                is_registration_open: data.is_registration_open !== undefined ? data.is_registration_open : true,
                is_team_event: data.is_team_event,
                registration_start: data.registration_start,
                registration_end: data.registration_end,
                registration_limit: data.registration_limit,
            });

            // 1. Try Cache
            try {
                const cached = sessionStorage.getItem(CACHE_KEY);
                if (cached) {
                    const events = JSON.parse(cached);
                    const cachedEvent = events.find(e => e.id === parseInt(id));
                    if (cachedEvent) {
                        setEvent(mapEventData(cachedEvent));
                        setLoading(false);
                        hasCachedData = true;
                    }
                }
            } catch (e) {
                console.warn("Detail cache lookup failed", e);
            }

            // 2. Fetch Fresh
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/events/${id}/`);
                let fetchedData = response.data;

                // MERGE: Augment backend data with local rich content
                const localData = eventsData.find(e => e.id === parseInt(id));
                if (localData) {
                    fetchedData = {
                        ...fetchedData,
                        description: localData.long_description || localData.description || fetchedData.description,
                        content_blocks: localData.content_blocks || [],
                        coordinators: localData.coordinators || fetchedData.coordinators || [],
                        venue: localData.venue || fetchedData.venue,
                        time: localData.time || fetchedData.time,
                        image: localData.image || fetchedData.image,
                        fee: localData.fee || fetchedData.fee,
                        // Force team config from local if present
                        is_team_event: localData.is_team_event !== undefined ? localData.is_team_event : fetchedData.is_team_event,
                        team_size_min: localData.team_size_min || fetchedData.team_size_min,
                        team_size_max: localData.team_size_max || fetchedData.team_size_max
                    };
                }

                const mappedEvent = mapEventData(fetchedData);
                setEvent(mappedEvent);
            } catch (error) {
                console.error('Failed to fetch event from backend:', error);

                // Fallback to local data only if cache failed
                if (!hasCachedData) {
                    const localEvent = eventsData.find(e => e.id === parseInt(id));
                    if (localEvent) {
                        setEvent(localEvent);
                        toast.info('Event data loaded locally. Registration requires backend sync.');
                    } else {
                        toast.error('Event not found in database or local storage');
                    }
                }
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    // Check Registration Status
    useEffect(() => {
        if (token && id) {
            axios.get(`${import.meta.env.VITE_API_URL}/my-registrations/`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => {
                    const registration = res.data.find(r => r.event === parseInt(id));
                    if (registration) {
                        setIsRegistered(true);
                        setRegistrationData(registration);
                    }
                })
                .catch(err => {
                    console.error("Failed to check registration", err);
                    setIsRegistered(false);
                    setRegistrationData(null);
                });
        }
    }, [token, id]);

    // Security: Immediate state wipe on logout
    useEffect(() => {
        if (!token || !user) {
            setIsRegistered(false);
            setRegistrationData(null);
        }
    }, [token, user]);

    useEffect(() => {
        if (!event) return;
        const calculateTimeLeft = () => {
            // ... (timer logic) ...
            const eventDate = new Date(event.date);
            const now = new Date();
            const difference = eventDate - now;

            if (difference > 0) {
                return {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                };
            }
            return null;
        };
        setTimeLeft(calculateTimeLeft());
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    }, [event]);

    const handleRegister = () => {
        if (registering) return;

        requireLogin({
            run: async (freshToken) => {
                if (isRegistered || registering) return;

                if (isRegistered) {
                    toast.info("You are already registered.");
                    return;
                }

                // Check for Team Event
                if (event.is_team_event) {
                    setIsTeamModalOpen(true);
                    return;
                }

                // For Individual Events (Paid or Free), open confirmation modal to collect details
                setIsConfirmModalOpen(true);
            }
        });
    };

    // Handle confirmed registration (Individual)
    const handleConfirmedRegistration = async (formData) => {
        try {
            setRegistering(true);
            const activeToken = token;

            // Prepare extra data
            const extraData = {
                college: formData.college,
                department: formData.department,
                year_of_study: formData.year_of_study,
                full_name: formData.full_name,
                phone_number: formData.phone_number
            };

            if (event.is_paid) {
                // Handle Payment Flow
                await handlePayment({
                    eventId: event.id,
                    eventName: event.title,
                    amount: parseInt(event.fee.replace(/\D/g, '') || '0'),
                    tokenOverride: activeToken,
                    ...extraData, // Pass college, dept, year, phone to Razorpay handler
                    onSuccess: (registration) => {
                        setIsRegistered(true);
                        setRegistrationData(registration);
                        setIsConfirmModalOpen(false);
                        setRegistering(false);
                        toast.success(`Payment Successful! Registered for ${event.title}.`);
                    },
                    onFailure: (error) => {
                        setRegistering(false);
                        toast.error(error);
                    }
                });
            } else {
                // Free Event Flow
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/register/`,
                    {
                        event: id,
                        ...extraData
                    },
                    { headers: { Authorization: `Bearer ${activeToken}` } }
                );
                setIsRegistered(true);
                setIsConfirmModalOpen(false);
                setRegistering(false);
                toast.success('Registration Successful! Access Granted.');
            }
        } catch (err) {
            toast.error(err.response?.data?.error || 'Registration failed.');
            setRegistering(false);
        }
    };

    if (loading) return <SkeletonLoader variant="hero" />;

    if (!event) {
        // ... (404 logic) ...
        return (
            <div className="min-h-screen bg-[#020408] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-400 mb-4">Event not found</p>
                    <button onClick={() => navigate('/events')} className="text-blue-400 hover:text-blue-300 text-sm">
                        Back to Events
                    </button>
                </div>
            </div>
        );
    }

    const isCompleted = new Date(event.date) < new Date();
    const isLocked = !event.is_registration_open;


    return (
        <div className="min-h-screen bg-[#020202] text-white selection:bg-blue-500/30 overflow-x-hidden font-outfit">

            {/* --- CINEMATIC BACKGROUND --- */}
            <div className="fixed inset-0 z-0 bg-black pointer-events-none">
                {/* Base Gradient */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#0f172a,transparent_70%)]" />

                {/* Cyberpunk Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-50" />

                {/* Ambient Glow Orbs */}
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-700" />
                <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute bottom-[-10%] right-[20%] w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[100px]" />
                
                {/* Aesthetic Noise */}
                <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.15] mix-blend-overlay" />
            </div>

            <main className="relative z-10">
                {/* Navigation Bar (Page Specific) */}
                <div className="absolute top-8 left-0 w-full px-6 lg:px-12 flex justify-between items-center pointer-events-none">
                    <button
                        onClick={() => navigate('/events')}
                        className="pointer-events-auto group flex items-center gap-3 px-4 py-2 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-full hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        <span>Archives</span>
                    </button>
                    <div className="pointer-events-auto flex items-center gap-4">
                        <button className="p-3 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-full text-gray-400 hover:text-white transition-all">
                            <Share2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* --- PRE-HERO SPACE --- */}
                <div className="h-32" />

                <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:grid lg:grid-cols-12 gap-10 md:gap-16 items-start">

                    {/* LEFT SIDE: Content */}
                    <div className="lg:col-span-7 space-y-12 md:space-y-20 pt-10 w-full order-2 lg:order-1">

                        {/* Massive Title Section */}
                        <div className="space-y-8 relative">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-4"
                            >
                                <div className="h-[1px] w-12 bg-cyan-400" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400">
                                    {event.category || 'Classified Session'}
                                </span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
                                className="text-4xl xs:text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9] font-outfit uppercase will-change-transform"
                            >
                                <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/30">
                                    {event.title}
                                </span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
                                className="text-base md:text-xl text-slate-400 leading-relaxed font-medium max-w-2xl uppercase tracking-wide opacity-80"
                            >
                                {event.description || event.short_description}
                            </motion.p>
                        </div>

                        {/* Structured Content Blocks */}
                        <div className="space-y-8 md:space-y-12">
                            {event.content_blocks && event.content_blocks.map((block, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-10%" }}
                                    transition={{ duration: 0.8, delay: index * 0.1 }}
                                    className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-12 hover:border-cyan-500/20 transition-all group will-change-transform"
                                >
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="p-2.5 rounded-xl bg-cyan-400/10 border border-cyan-400/20 group-hover:bg-cyan-400/20 transition-colors">
                                            <Target size={20} className="text-cyan-400" />
                                        </div>
                                        <h3 className="text-xl md:text-2xl font-black tracking-tight text-white group-hover:text-cyan-400 transition-colors uppercase">
                                            {block.title}
                                        </h3>
                                    </div>

                                    {block.list && (
                                        <ul className="grid gap-6">
                                            {block.list.map((item, idx) => (
                                                <li key={idx} className="flex items-start gap-4">
                                                    <div className="w-5 h-5 rounded bg-white/5 flex items-center justify-center text-[9px] font-black text-cyan-400 shrink-0 mt-0.5 border border-white/5 uppercase">
                                                        {idx + 1}
                                                    </div>
                                                    <span className="text-slate-400 font-medium leading-relaxed text-sm md:text-base">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    {block.items && (
                                        <div className="grid md:grid-cols-2 gap-6">
                                            {block.items.map((item, idx) => (
                                                <div key={idx} className="bg-black/40 p-6 rounded-2xl md:rounded-3xl border border-white/5 hover:border-cyan-500/10 transition-all">
                                                    <h4 className="text-white font-black mb-3 tracking-tight uppercase text-sm">{item.title}</h4>
                                                    <p className="text-slate-500 text-[11px] md:text-xs leading-relaxed font-bold uppercase tracking-wider">{item.content}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {block.content && (
                                        <p className="text-slate-400 leading-relaxed font-medium text-sm md:text-lg">
                                            {block.content}
                                        </p>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        {/* Coordinators Section */}
                        {event.coordinators && event.coordinators.length > 0 && (
                            <div className="space-y-8 pb-20">
                                <div className="flex items-center gap-4">
                                    <div className="h-px flex-1 bg-white/5" />
                                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-600">Command_Units</span>
                                    <div className="h-px flex-1 bg-white/5" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {event.coordinators.map((c, i) => (
                                        <div key={i} className="flex items-center gap-5 p-5 bg-white/[0.02] border border-white/5 rounded-2xl md:rounded-3xl group hover:border-cyan-500/20 transition-all">
                                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-600 p-px">
                                                <div className="w-full h-full bg-[#020202] rounded-[11px] md:rounded-[15px] flex items-center justify-center text-xl font-black">
                                                    {c.name.charAt(0)}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-[8px] font-black text-cyan-400 uppercase tracking-widest mb-1">OPERATOR</div>
                                                <div className="text-white font-black tracking-tight uppercase text-sm">{c.name}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* RIGHT SIDE: Action Panel */}
                    <div className="lg:col-span-5 w-full sticky top-32 pb-12 order-1 lg:order-2">

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative bg-[#050505] border border-white/10 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] overflow-hidden"
                        >
                            {/* Decorative Background Beams */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-600/5 blur-[60px]" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-900/5 blur-[60px]" />

                            {/* Metadata Wall */}
                            <div className="space-y-8 mb-10 md:mb-12">
                                <div className="flex justify-between items-center">
                                    <div className="px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center gap-2">
                                        <span className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-gray-500' : 'bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-pulse'}`} />
                                        <span className="text-[9px] font-black uppercase text-cyan-400 tracking-[0.2em] leading-none">
                                            {isCompleted ? 'Expired' : 'Live_Status'}
                                        </span>
                                    </div>
                                    {event.fee && <div className="text-2xl font-black text-white font-space uppercase tracking-tighter">{event.fee}</div>}
                                </div>

                                <div className="grid gap-6 pt-4">
                                    {[
                                        { icon: Calendar, label: "Temporal Origin", value: new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' }) },
                                        { icon: Clock, label: "Execution Window", value: `${event.time} (${event.duration || '2 Hours'})` },
                                        { icon: MapPin, label: "Deployment Zone", value: event.venue || 'Campus HQ' },
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-5 group">
                                            <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:bg-cyan-400/10 group-hover:border-cyan-400/20 transition-all">
                                                <item.icon size={20} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
                                            </div>
                                            <div>
                                                <div className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-600 mb-1">{item.label}</div>
                                                <div className="text-[13px] md:text-sm font-black text-slate-200 tracking-tight uppercase">{item.value}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Countdown or Status Indicator */}
                            {!isCompleted && timeLeft && (
                                <div className="bg-white/[0.03] rounded-[2rem] p-6 mb-8 border border-white/5 backdrop-blur-3xl">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-[9px] uppercase font-black tracking-[0.3em] text-cyan-400/50">Time_To_Pulse</span>
                                        <Timer size={14} className="text-cyan-400" />
                                    </div>
                                    <div className="flex justify-between px-2">
                                        {[
                                            { label: 'days', value: timeLeft.days },
                                            { label: 'hours', value: timeLeft.hours },
                                            { label: 'mins', value: timeLeft.minutes },
                                            { label: 'secs', value: timeLeft.seconds }
                                        ].map((item) => (
                                            <div key={item.label} className="text-center">
                                                <div className="text-2xl font-black text-white leading-none mb-1 tabular-nums italic tracking-tighter">{item.value.toString().padStart(2, '0')}</div>
                                                <div className="text-[8px] font-black uppercase tracking-widest text-slate-600">{item.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Live Capacity Tracker */}
                            {event.max_participation > 0 && (
                                <div className="bg-white/5 rounded-[2rem] p-6 mb-6 border border-white/5 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <Users className="w-16 h-16 text-cyan-400 transform rotate-12 translate-x-4 -translate-y-4" />
                                    </div>
                                    
                                    <div className="flex justify-between items-end mb-3 relative z-10">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[9px] uppercase font-black tracking-widest text-slate-600">Active_Slots</span>
                                                {(event.registration_count || 0) > (event.max_participation * 0.8) && (
                                                    <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-[8px] font-black text-red-500 uppercase tracking-wider animate-pulse">
                                                        CRITICAL_LOAD
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-2xl font-black text-white tabular-nums italic">
                                                {event.registration_count || 0} <span className="text-slate-600 text-sm">/ {event.max_participation}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xl font-black text-cyan-400 tabular-nums italic">
                                                {Math.max(0, event.max_participation - (event.registration_count || 0))}
                                            </div>
                                            <div className="text-[8px] font-black uppercase tracking-widest text-slate-600">Available</div>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden relative z-10">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min(100, ((event.registration_count || 0) / event.max_participation) * 100)}%` }}
                                            transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                                            className={`h-full rounded-full ${
                                                ((event.registration_count || 0) / event.max_participation) > 0.9 
                                                ? 'bg-red-500' 
                                                : 'bg-gradient-to-r from-cyan-600 to-blue-400'
                                            }`} 
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Primary Action Button */}
                            <div className="space-y-4">
                                <button
                                    onClick={handleRegister}
                                    disabled={isCompleted || isLocked || isRegistered || registering}
                                    className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] transition-all duration-700 relative overflow-hidden group
                                ${isRegistered
                                            ? 'bg-cyan-400/10 text-cyan-400 border border-cyan-400/20'
                                            : 'bg-white text-black hover:bg-cyan-400 hover:text-black hover:shadow-[0_20px_40px_-10px_rgba(34,211,238,0.3)] active:scale-[0.98]'
                                        } disabled:opacity-30 disabled:scale-100 shadow-2xl will-change-transform`}
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-3">
                                        {registering ? (
                                            <Loader2 size={16} className="animate-spin" />
                                        ) : isRegistered ? (
                                            <CheckCircle2 size={16} />
                                        ) : (
                                            <CreditCard size={16} />
                                        )}
                                        {registering ? 'Processing_Auth...' :
                                            isRegistered ? 'Verified_Access' :
                                                isCompleted ? 'Transmission_End' :
                                                    isLocked ? 'Pending_Sync' : 'Initialize_Access'}
                                    </span>
                                </button>

                                {isRegistered && registrationData?.qr_code && (
                                    <TicketDownload
                                        registration={registrationData}
                                        event={event}
                                        className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl transition-all text-[9px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95"
                                    />
                                )}

                                <button className="w-full py-4 text-slate-700 hover:text-slate-400 transition-colors text-[8px] font-black uppercase tracking-[0.4em]">
                                    Request_Command_Support
                                </button>
                            </div>


                            {/* Achievement / Highlight badges in footer of card */}
                            <div className="mt-12 pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-default">
                                    <Award size={14} />
                                    <span className="text-[8px] font-black uppercase tracking-widest leading-none mt-0.5">Tactical_Merit</span>
                                </div>
                                <div className="flex items-center gap-2 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-default">
                                    <Target size={14} />
                                    <span className="text-[8px] font-black uppercase tracking-widest leading-none mt-0.5">High_Value</span>
                                </div>
                            </div>
                        </motion.div>


                        {/* Prize Pool Spotlight (If any) */}
                        {event.prize && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="mt-8 p-8 rounded-[2.5rem] bg-gradient-to-br from-yellow-500/10 to-transparent border border-yellow-500/20 flex items-center justify-between"
                            >
                                <div>
                                    <div className="text-[10px] font-black text-yellow-500 uppercase tracking-widest mb-1">Total Prize Pool</div>
                                    <div className="text-3xl font-black text-white font-space uppercase tracking-tighter italic">{event.prize}</div>
                                </div>
                                <div className="w-14 h-14 rounded-2xl bg-yellow-500/20 flex items-center justify-center border border-yellow-500/30">
                                    <Award className="w-7 h-7 text-yellow-500" />
                                </div>
                            </motion.div>
                        )}

                    </div>
                </div>
            </main>


            <TeamRegistrationModal
                isOpen={isTeamModalOpen}
                onClose={() => setIsTeamModalOpen(false)}
                event={event}
                onSuccess={() => setIsRegistered(true)}
            />

            <ConfirmRegistrationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleConfirmedRegistration}
                eventName={event?.title}
                eventId={id}
                token={token}
                isLoading={registering}
            />
        </div>
    );
};

export default EventDetail;
