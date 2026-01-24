import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  Calendar, Clock, MapPin, Users, ArrowLeft, Share2,
  Wallet, CheckCircle2, XCircle, Timer, Sparkles, Award, Target, ChevronRight, CreditCard
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import SkeletonLoader from '../components/common/SkeletonLoader';
import HawkinsLabDetail from '../components/events/HawkinsLabDetail';
import { useAuth } from '../context/AuthContext';
import TeamRegistrationModal from '../components/events/TeamRegistrationModal';
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

  const handlePayment = useRazorpayPayment();

  // ... (useEffect fetches remain same) ...
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/events/${id}/`);
        const mappedEvent = {
          ...response.data,
          date: response.data.event_date,
          // Map backend fields to frontend names used in local data
          is_paid: response.data.requires_payment,
          fee: response.data.payment_amount ? `₹${response.data.payment_amount}` : response.data.fee,
          is_registration_open: response.data.is_registration_open !== undefined ? response.data.is_registration_open : true,
          is_team_event: response.data.is_team_event,
          registration_start: response.data.registration_start,
          registration_end: response.data.registration_end,
          registration_limit: response.data.registration_limit,
        };
        setEvent(mappedEvent);
      } catch (error) {
        console.error('Failed to fetch event from backend:', error);
        // Fallback to local data
        const localEvent = eventsData.find(e => e.id === parseInt(id));
        if (localEvent) {
             setEvent(localEvent);
             toast.info('Event data loaded locally. Registration requires backend sync.');
        } else {
             toast.error('Event not found in database or local storage');
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
        .catch(err => console.error("Failed to check registration", err));
    }
  }, [token, id]);

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
    requireLogin({
        run: async (freshToken) => {
            if (isRegistered) {
                toast.info("You are already registered.");
                return;
            }
            
            // Check for Team Event
            if (event.is_team_event) {
                setIsTeamModalOpen(true);
                return;
            }

            // Check for Paid Event
            if (event.is_paid) {
                setRegistering(true);
                try {
                    await handlePayment({
                        eventId: event.id,
                        eventName: event.title,
                        amount: parseInt(event.fee.replace(/\D/g, '')),
                        onSuccess: (registration) => {
                            setIsRegistered(true);
                            setRegistrationData(registration);
                            setRegistering(false);
                            toast.success(`Payment Successful! Registered for ${event.title}.`);
                        },
                        onFailure: (error) => {
                            setRegistering(false);
                            toast.error(error);
                        }
                    });
                } catch (err) {
                    setRegistering(false);
                    toast.error("Failed to initialize payment");
                }
                return;
            }

            try {
                setRegistering(true);
                const activeToken = freshToken || token;
                
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/register/`, 
                    { event: id }, 
                    { headers: { Authorization: `Bearer ${activeToken}` } }
                );
                setIsRegistered(true);
                toast.success('Registration Successful! Access Granted.');
            } catch (err) {
                toast.error(err.response?.data?.error || 'Registration failed.');
            } finally {
                setRegistering(false);
            }
        }
    });
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

  // Custom Event Loader for Hawkins Lab
  if (event.title.toLowerCase().includes('hawkins')) {
      return (
          <>
            <HawkinsLabDetail onRegister={handleRegister} isRegistered={isRegistered} registrationData={registrationData} />
            <TeamRegistrationModal 
                isOpen={isTeamModalOpen} 
                onClose={() => setIsTeamModalOpen(false)} 
                event={event} 
                onSuccess={() => setIsRegistered(true)} 
            />
          </>
      );
  }

  return (
    <div className="min-h-screen bg-[#020408] text-gray-200 selection:bg-blue-500/30 font-sans">

      {/* ... rest of UI ... */}
      
      {/* --- AMBIENT LIGHTING --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] opacity-40" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[120px] opacity-30" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        
        {/* Navigation */}
        <button
          onClick={() => navigate('/events')}
          className="group flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Events</span>
        </button>

        {/* HERO SECTION */}
        <div className="text-center max-w-4xl mx-auto mb-24 relative">
            {/* Decorative Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-32 bg-blue-500/20 blur-[100px] -z-10 pointer-events-none" />

            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-[#0A0C10]/80 border border-white/10 backdrop-blur-md shadow-2xl">
                <span className={`w-1.5 h-1.5 rounded-full shadow-[0_0_10px_currentColor] ${isCompleted ? 'bg-gray-500 text-gray-500' : isLocked ? 'bg-orange-500 text-orange-500' : 'bg-cyan-500 text-cyan-500 animate-pulse'}`} />
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">
                    {isCompleted ? 'Event Ended' : isLocked ? 'Registration Closed' : 'Registration Open'}
                </span>
            </div>

            {/* Title */}
            <h1 className="font-space font-bold text-5xl md:text-7xl lg:text-8xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40 mb-8 leading-[0.9]">
                {event.title}
            </h1>

            {/* Description */}
            <p className="font-light text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto tracking-wide">
                {event.description || event.short_description}
            </p>
        </div>


        {/* MAIN GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN: Details & Timer */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* Custom Content Blocks (e.g. Shadow Login) */}
                {event.content_blocks && event.content_blocks.map((block, index) => (

                    <div key={index} className="bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-colors duration-500">
                        <h3 className="font-space text-2xl font-bold text-white mb-6 uppercase tracking-tight">{block.title}</h3>
                        
                        {/* List Items */}
                        {block.list && (
                            <ul className="space-y-4">
                                {block.list.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-gray-400">
                                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/50 mt-2.5 shrink-0" />
                                        <span className="leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {/* Structured Items (e.g. Levels) */}
                        {block.items && (
                            <div className="grid gap-4">
                                {block.items.map((item, idx) => (
                                    <div key={idx} className="bg-black/20 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                                        <h4 className="font-space text-white text-lg font-bold mb-2">{item.title}</h4>
                                        <p className="text-gray-400 text-sm leading-relaxed">{item.content}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Plain Text Content */}
                        {block.content && (
                            <p className="text-gray-400 leading-relaxed font-light">{block.content}</p>
                        )}
                    </div>
                ))}


                {/* Countdown Card */}
                {!isCompleted && timeLeft && (
                    <div className="bg-[#0A0C10]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <Timer className="w-5 h-5 text-blue-400" />
                            <span className="text-sm font-medium text-gray-300 uppercase tracking-wider">Event Starts In</span>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {Object.entries(timeLeft).map(([unit, value]) => (
                                <div key={unit} className="text-center">
                                    <div className="text-4xl md:text-5xl font-bold text-white mb-1 tabular-nums">{value}</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">{unit}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* About / Highlights Card */}
                <div className="bg-[#0A0C10]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-8">
                    <h3 className="text-xl font-semibold text-white mb-6">Event Highlights</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {[
                            { icon: Target, text: "Hands-on Challenges" },
                            { icon: Sparkles, text: "Live Demonstrations" },
                            { icon: Award, text: "Certificates Provided" },
                            { icon: Users, text: "Networking Session" }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                                <item.icon className="w-4 h-4 text-blue-400" />
                                <span className="text-sm text-gray-300">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* RIGHT COLUMN: Action & Meta */}
            <div className="space-y-6">
                
                {/* Action Card */}
                {/* Action Card */}
                <div className="bg-[#050505] backdrop-blur-xl border border-white/10 rounded-3xl p-8 sticky top-8 shadow-2xl overflow-hidden">
                    {/* Subtle Gradient Line at Top */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-50" />

                    <div className="space-y-6 mb-8 relative z-10">
                         <div className="flex items-center gap-4 text-gray-300 group">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-cyan-500/30 transition-colors">
                                <Calendar className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                            </div>
                            <div>
                                <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-0.5">Date</div>
                                <div className="text-sm font-medium">{new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</div>
                            </div>
                         </div>
                         
                         <div className="flex items-center gap-4 text-gray-300 group">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-cyan-500/30 transition-colors">
                                <Clock className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                            </div>
                             <div>
                                <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-0.5">Time</div>
                                <div className="text-sm font-medium">{event.time} • {event.duration || '2 Hours'}</div>
                            </div>
                         </div>

                         <div className="flex items-center gap-4 text-gray-300 group">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-cyan-500/30 transition-colors">
                                <MapPin className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                            </div>
                            <div>
                                <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-0.5">Venue</div>
                                <div className="text-sm font-medium">{event.venue || 'TBA'}</div>
                            </div>
                         </div>

                         {event.fee && (
                             <div className="flex items-center gap-4 text-gray-300 group">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-green-500/30 transition-colors">
                                    <Wallet className="w-5 h-5 text-gray-400 group-hover:text-green-400 transition-colors" />
                                </div>
                                <div>
                                    <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-0.5">Entry Fee</div>
                                    <div className="text-sm font-medium text-white">{event.fee}</div>
                                </div>
                             </div>
                         )}
                         
                         {/* Prize & Meta Block */}
                         {(event.prize || event.max_participation) && (
                            <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                                {event.prize && (
                                    <div>
                                        <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Prize Pool</div>
                                        <div className="text-lg font-space font-bold text-yellow-400">{event.prize}</div>
                                    </div>
                                )}
                                {event.max_participation && (
                                     <div>
                                        <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Max Seats</div>
                                        <div className="text-lg font-space font-bold text-white">{event.max_participation}</div>
                                    </div>
                                )}
                            </div>
                         )}

                         {event.coordinators && event.coordinators.length > 0 && (
                            <div className="pt-6 border-t border-white/5">
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-3 font-bold">Event Coordinators</p>
                                <div className="space-y-3">
                                    {event.coordinators.map((c, i) => (
                                        <div key={i} className="flex items-center gap-3 text-sm text-gray-300">
                                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/10 flex items-center justify-center text-[10px] font-bold">
                                                {c.name.charAt(0)}
                                            </div>
                                            <span>{c.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                         )}
                    </div>

                    <button
                        onClick={handleRegister}
                        disabled={isCompleted || isLocked || isRegistered || registering}
                        className={`w-full py-4 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 mb-3 relative overflow-hidden group
                           ${isRegistered 
                            ? 'bg-green-500/10 text-green-500 border border-green-500/20 cursor-default shadow-[0_0_15px_rgba(34,197,94,0.1)]'
                            : 'bg-white text-black hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                           } disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none`}
                    >
                        {registering ? (
                            <span className="animate-pulse">Processing...</span>
                        ) : isRegistered ? (
                            <>
                                <CheckCircle2 className="w-5 h-5" />
                                <span>Ticket Confirmed</span>
                            </>
                        ) : (
                            <>
                                <span className="relative z-10">{isCompleted ? 'Event Ended' : 'Register Now'}</span>
                                {!isCompleted && <ChevronRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />}
                            </>
                        )}
                    </button>

                    {isRegistered && registrationData?.qr_code && (
                        <TicketDownload 
                            registration={registrationData}
                            event={event}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 mb-3 shadow-[0_0_15px_rgba(37,99,235,0.2)]"
                        />
                    )}
                    
                    <button className="w-full py-3 bg-white/5 text-gray-400 font-medium rounded-xl hover:bg-white/10 hover:text-white transition-colors border border-white/5 text-sm">
                        Add to Calendar
                    </button>
                </div>

            </div>

        </div>
      </div>
      <TeamRegistrationModal 
        isOpen={isTeamModalOpen} 
        onClose={() => setIsTeamModalOpen(false)} 
        event={event} 
        onSuccess={() => setIsRegistered(true)} 
      />
    </div>
  );
};

export default EventDetail;
