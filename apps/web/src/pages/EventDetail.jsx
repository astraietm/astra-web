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
                        fee: localData.fee || fetchedData.fee
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
            <div className="fixed inset-0 z-0">
                <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-900/5 rounded-full blur-[150px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]" />
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

                <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:grid lg:grid-cols-12 gap-16 items-start">

                    {/* LEFT SIDE: Content */}
                    <div className="lg:col-span-7 space-y-20 pt-10">

                        {/* Massive Title Section */}
                        <div className="space-y-8 relative">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-4"
                            >
                                <div className="h-[1px] w-12 bg-blue-500" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">
                                    {event.category || 'Classified Session'}
                                </span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
                                className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.85] font-outfit"
                            >
                                <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/30">
                                    {event.title}
                                </span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
                                className="text-lg md:text-xl text-gray-400 leading-relaxed font-light max-w-2xl"
                            >
                                {event.description || event.short_description}
                            </motion.p>
                        </div>

                        {/* Structured Content Blocks */}
                        <div className="space-y-12">
                            {event.content_blocks && event.content_blocks.map((block, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: index * 0.1 }}
                                    className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 md:p-12 hover:border-white/10 transition-all group"
                                >
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="p-2.5 rounded-xl bg-blue-600/10 border border-blue-500/20">
                                            <Target className="w-5 h-5 text-blue-500" />
                                        </div>
                                        <h3 className="text-2xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
                                            {block.title}
                                        </h3>
                                    </div>

                                    {block.list && (
                                        <ul className="grid gap-6">
                                            {block.list.map((item, idx) => (
                                                <li key={idx} className="flex items-start gap-4">
                                                    <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-black text-blue-500 shrink-0 mt-0.5 border border-white/5">
                                                        {idx + 1}
                                                    </div>
                                                    <span className="text-gray-400 font-light leading-relaxed">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    {block.items && (
                                        <div className="grid md:grid-cols-2 gap-6">
                                            {block.items.map((item, idx) => (
                                                <div key={idx} className="bg-black/40 p-6 rounded-3xl border border-white/5 hover:bg-black/60 transition-all">
                                                    <h4 className="text-white font-bold mb-3 tracking-tight">{item.title}</h4>
                                                    <p className="text-gray-500 text-sm leading-relaxed">{item.content}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {block.content && (
                                        <p className="text-gray-400 leading-relaxed font-light text-lg">
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
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Operational Personnel</span>
                                    <div className="h-px flex-1 bg-white/5" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {event.coordinators.map((c, i) => (
                                        <div key={i} className="flex items-center gap-5 p-5 bg-white/[0.02] border border-white/5 rounded-3xl group hover:bg-white/[0.04] transition-all">
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 p-px">
                                                <div className="w-full h-full bg-[#050505] rounded-[15px] flex items-center justify-center text-xl font-bold">
                                                    {c.name.charAt(0)}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Coordinator</div>
                                                <div className="text-white font-bold tracking-tight">{c.name}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* RIGHT SIDE: Action Panel */}
                    <div className="lg:col-span-5 w-full sticky top-12 pb-12">

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative bg-[#050505] border border-white/10 rounded-[3rem] p-10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] overflow-hidden"
                        >
                            {/* Decorative Background Beams */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[60px]" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-900/10 blur-[60px]" />

                            {/* Metadata Wall */}
                            <div className="space-y-8 mb-12">
                                <div className="flex justify-between items-center">
                                    <div className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center gap-2">
                                        <span className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-gray-500' : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse'}`} />
                                        <span className="text-[10px] font-black uppercase text-blue-400 tracking-widest leading-none">
                                            {isCompleted ? 'Expired' : 'Live Status'}
                                        </span>
                                    </div>
                                    {event.fee && <div className="text-2xl font-bold text-white font-space uppercase tracking-tighter">{event.fee}</div>}
                                </div>

                                <div className="grid gap-6 pt-4">
                                    {[
                                        { icon: Calendar, label: "Event Date", value: new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' }) },
                                        { icon: Clock, label: "Temporal Slot", value: `${event.time} (${event.duration || '2 Hours'})` },
                                        { icon: MapPin, label: "Physical Venue", value: event.venue || 'Campus HQ' },
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-5 group">
                                            <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:bg-blue-600/10 group-hover:border-blue-500/20 transition-all">
                                                <item.icon className="w-5 h-5 text-gray-500 group-hover:text-blue-500 transition-colors" />
                                            </div>
                                            <div>
                                                <div className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600 mb-1">{item.label}</div>
                                                <div className="text-sm font-bold text-gray-200 tracking-tight">{item.value}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Countdown or Status Indicator */}
                            {!isCompleted && timeLeft && (
                                <div className="bg-white/5 rounded-[2rem] p-6 mb-10 border border-white/5">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-[10px] uppercase font-black tracking-widest text-gray-500">Time Until Pulse</span>
                                        <Timer className="w-3.5 h-3.5 text-blue-500" />
                                    </div>
                                    <div className="flex justify-between px-2">
                                        {Object.entries(timeLeft).map(([unit, val]) => (
                                            <div key={unit} className="text-center">
                                                <div className="text-2xl font-black text-white leading-none mb-1 tabular-nums">{val}</div>
                                                <div className="text-[8px] font-bold uppercase tracking-widest text-gray-600">{unit}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Primary Action Button */}
                            <div className="space-y-4">
                                <button
                                    onClick={handleRegister}
                                    disabled={isCompleted || isLocked || isRegistered || registering}
                                    className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all duration-500 relative overflow-hidden group
                                ${isRegistered
                                            ? 'bg-blue-600/10 text-blue-500 border border-blue-500/20'
                                            : 'bg-white text-black hover:bg-blue-500 hover:text-white hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] active:scale-[0.98]'
                                        } disabled:opacity-50 disabled:scale-100 shadow-2xl`}
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-3">
                                        {registering ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : isRegistered ? (
                                            <CheckCircle2 className="w-4 h-4" />
                                        ) : (
                                            <CreditCard className="w-4 h-4" />
                                        )}
                                        {registering ? 'Processing' :
                                            isRegistered ? 'Access Granted' :
                                                isCompleted ? 'Entry Terminated' :
                                                    isLocked ? 'Coming Soon' : 'Secure Ticket'}
                                    </span>
                                </button>

                                {isRegistered && registrationData?.qr_code && (
                                    <TicketDownload
                                        registration={registrationData}
                                        event={event}
                                        className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl transition-all text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3"
                                    />
                                )}

                                <button className="w-full py-4 text-gray-600 hover:text-gray-400 transition-colors text-[9px] font-bold uppercase tracking-[0.25em]">
                                    Request Event Support
                                </button>
                            </div>

                            {/* Achievement / Highlight badges in footer of card */}
                            <div className="mt-12 pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2 opacity-50">
                                    <Award className="w-3.5 h-3.5" />
                                    <span className="text-[8px] font-bold uppercase tracking-widest">Digital Merit</span>
                                </div>
                                <div className="flex items-center gap-2 opacity-50">
                                    <Target className="w-3.5 h-3.5" />
                                    <span className="text-[8px] font-bold uppercase tracking-widest">High Impact</span>
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
