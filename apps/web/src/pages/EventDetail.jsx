import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  Calendar, Clock, MapPin, Users, ArrowLeft, Share2,
  Wallet, CheckCircle2, XCircle, Timer, Sparkles, Award, Target, ChevronRight
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import SkeletonLoader from '../components/common/SkeletonLoader';
import HawkinsLabDetail from '../components/events/HawkinsLabDetail';
import { useAuth } from '../context/AuthContext';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user, token, requireLogin } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/events/${id}/`);
        const mappedEvent = {
          ...response.data,
          date: response.data.event_date,
        };
        setEvent(mappedEvent);
      } catch (error) {
        console.error('Failed to fetch event:', error);
        toast?.error?.('Failed to load event details');
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
            const registered = res.data.some(r => r.event === parseInt(id));
            setIsRegistered(registered);
        })
        .catch(err => console.error("Failed to check registration", err));
    }
  }, [token, id]);

  useEffect(() => {
    if (!event) return;
    const calculateTimeLeft = () => {
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
            try {
                setRegistering(true);
                // Use freshToken if available (from login flow), otherwise current token
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
      return <HawkinsLabDetail onRegister={handleRegister} isRegistered={isRegistered} />;
  }

  return (
    <div className="min-h-screen bg-[#020408] text-gray-200 selection:bg-blue-500/30 font-sans">
      
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
        <div className="text-center max-w-4xl mx-auto mb-20">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                <span className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-gray-500' : isLocked ? 'bg-orange-500' : 'bg-green-500 animate-pulse'}`} />
                <span className="text-xs font-medium text-gray-300 uppercase tracking-wide">
                    {isCompleted ? 'Event Ended' : isLocked ? 'Registration Closed' : 'Registration Open'}
                </span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
                {event.title}
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
                {event.description || event.short_description}
            </p>
        </div>


        {/* MAIN GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN: Details & Timer */}
            <div className="lg:col-span-2 space-y-6">
                
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
                <div className="bg-[#0A0C10]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sticky top-8">
                    <div className="space-y-4 mb-8">
                         <div className="flex items-center gap-3 text-gray-300">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            <span className="text-sm">{new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                         </div>
                         <div className="flex items-center gap-3 text-gray-300">
                            <Clock className="w-4 h-4 text-blue-500" />
                            <span className="text-sm">{event.duration || '2 Hours'}</span>
                         </div>
                         <div className="flex items-center gap-3 text-gray-300">
                            <MapPin className="w-4 h-4 text-blue-500" />
                            <span className="text-sm">{event.venue || 'TBA'}</span>
                         </div>
                    </div>

                    <button
                        onClick={handleRegister}
                        disabled={isCompleted || isLocked || isRegistered || registering}
                        className={`w-full py-4 font-bold rounded-xl transition-all flex items-center justify-center gap-2 mb-3
                           ${isRegistered 
                            ? 'bg-green-500/10 text-green-500 border border-green-500/20 cursor-default'
                            : 'bg-white text-black hover:scale-[1.02] active:scale-[0.98]'
                           } disabled:opacity-50 disabled:hover:scale-100`}
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
                                <span>{isCompleted ? 'Event Ended' : 'Register Now'}</span>
                                {!isCompleted && <ChevronRight className="w-4 h-4" />}
                            </>
                        )}
                    </button>
                    
                    <button className="w-full py-3 bg-white/5 text-white font-medium rounded-xl hover:bg-white/10 transition-colors border border-white/5 text-sm">
                        Add to Calendar
                    </button>
                </div>

            </div>

        </div>
      </div>
    </div>
  );
};

export default EventDetail;
