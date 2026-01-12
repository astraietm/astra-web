import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  Calendar, Clock, MapPin, Users, Shield, ArrowLeft, Share2,
  Download, Trophy, Target, Zap, CheckCircle, XCircle, Timer
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import SkeletonLoader from '../components/common/SkeletonLoader';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/events/${id}/`);
        const mappedEvent = {
          ...response.data,
          date: response.data.event_date,
          image: response.data.image || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070'
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

  // Countdown Timer
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.short_description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast?.success?.('Link copied to clipboard!');
    }
  };

  const handleRegister = () => {
    toast?.success?.('Registration opened! (Feature coming soon)');
  };

  if (loading) {
    return <SkeletonLoader variant="hero" />;
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#05080f] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 font-mono">Event not found</p>
          <Link to="/events" className="text-primary hover:underline font-mono text-sm mt-4 inline-block">
                &lt; Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const isCompleted = new Date(event.date) < new Date();
  const isLocked = !event.is_registration_open;

  return (
    <div className="min-h-screen bg-[#05080f] text-gray-200">
      {/* Global Effects */}
      <div className="fixed inset-0 z-0 opacity-[0.02] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.1)_2px,rgba(255,255,255,0.1)_4px)]" />
      <div className="fixed inset-0 z-0 opacity-[0.03]" 
           style={{
               backgroundImage: `radial-gradient(circle, rgba(99, 102, 241, 0.4) 1px, transparent 1px)`,
               backgroundSize: '50px 50px',
           }} 
      />

      {/* Back Button */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-24 pb-8">
        <button
          onClick={() => navigate('/events')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-mono text-sm mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          [BACK_TO_OPERATIONS]
        </button>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 pb-12">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0F141F] to-[#0A0F1C] border border-white/10 rounded-lg">
          {/* Corner Accents */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-primary/50" />
          <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-primary/50" />
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-primary/50" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-primary/50" />

          <div className="p-8 md:p-12">
            {/* Status Badge */}
            <div className="flex items-center gap-3 mb-6">
              {isCompleted ? (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-mono font-bold bg-gray-500/20 text-gray-400 border border-gray-500/30 uppercase">
                  <CheckCircle className="w-4 h-4" />
                  COMPLETED
                </span>
              ) : isLocked ? (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/30 uppercase">
                  <XCircle className="w-4 h-4" />
                  REGISTRATION_CLOSED
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-mono font-bold bg-green-500/20 text-green-400 border border-green-500/30 uppercase">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  ACTIVE
                </span>
              )}
              <span className="px-3 py-1.5 rounded-sm text-xs font-mono bg-primary/10 text-primary border border-primary/20 uppercase">
                {event.category || 'CTF'}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-display uppercase tracking-tight">
              {event.title}
            </h1>

            {/* Description */}
            <p className="text-gray-400 text-lg leading-relaxed mb-8 border-l-2 border-primary/30 pl-6">
              {event.description || event.short_description}
            </p>

            {/* Countdown Timer */}
            {timeLeft && !isCompleted && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Timer className="w-5 h-5 text-primary" />
                  <span className="text-sm font-mono text-gray-400 uppercase">Event Starts In:</span>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {Object.entries(timeLeft).map(([unit, value]) => (
                    <div key={unit} className="text-center p-4 bg-black/30 border border-primary/20 rounded">
                      <div className="text-3xl font-bold text-primary font-mono">{value}</div>
                      <div className="text-xs text-gray-500 font-mono uppercase mt-1">{unit}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-xs text-gray-600 font-mono uppercase">Date</div>
                  <div className="text-sm text-white font-mono">
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-xs text-gray-600 font-mono uppercase">Duration</div>
                  <div className="text-sm text-white font-mono">{event.duration || '2-3 Hours'}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded">
                <MapPin className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-xs text-gray-600 font-mono uppercase">Venue</div>
                  <div className="text-sm text-white font-mono">{event.venue || 'TBA'}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded">
                <Users className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-xs text-gray-600 font-mono uppercase">Capacity</div>
                  <div className="text-sm text-white font-mono">
                    {event.registered_count || 0}/{event.registration_limit || '∞'}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleRegister}
                disabled={isCompleted || isLocked}
                className="group/btn relative overflow-hidden px-8 py-4 bg-primary text-black font-bold rounded transition-all hover:shadow-[0_0_20px_rgba(99,102,241,0.6)] font-mono text-sm uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Shield className="w-5 h-5" />
                <span className="relative z-10">[DEPLOY_REGISTRATION]</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
              </button>
              <button
                onClick={handleShare}
                className="px-8 py-4 bg-white/5 text-white font-bold rounded border border-white/20 hover:bg-white/10 transition-all font-mono text-sm uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                <span>&gt; share_mission</span>
              </button>
              <button className="px-8 py-4 bg-white/5 text-white font-bold rounded border border-white/20 hover:bg-white/10 transition-all font-mono text-sm uppercase tracking-wider flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                <span>&gt; add_to_calendar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info Sections */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Event Highlights */}
          <div className="p-6 bg-gradient-to-br from-[#0F141F] to-[#0A0F1C] border border-white/10 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-bold text-white font-mono uppercase">Highlights</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                Hands-on challenges
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                Real-world scenarios
              </li>
              <li className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-primary" />
                Prizes & certificates
              </li>
            </ul>
          </div>

          {/* Requirements */}
          <div className="p-6 bg-gradient-to-br from-[#0F141F] to-[#0A0F1C] border border-white/10 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-green-400" />
              <h3 className="text-lg font-bold text-white font-mono uppercase">Requirements</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Basic security knowledge
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Laptop required
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Team of 2-4 members
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="p-6 bg-gradient-to-br from-[#0F141F] to-[#0A0F1C] border border-white/10 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-bold text-white font-mono uppercase">Contact</h3>
            </div>
            <p className="text-sm text-gray-400 mb-2">For queries, reach out to:</p>
            <p className="text-sm text-primary font-mono">events@astra.edu</p>
            <p className="text-sm text-gray-500 font-mono mt-1">+91 1234567890</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
