import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  Calendar, Clock, MapPin, Users, ArrowLeft, Share2,
  Download, CheckCircle2, XCircle, Timer, Sparkles, Award, Target
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
    toast?.success?.('Registration opened!');
  };

  if (loading) {
    return <SkeletonLoader variant="hero" />;
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Event not found</p>
          <Link to="/events" className="text-primary hover:underline text-sm mt-4 inline-block">
            ← Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const isCompleted = new Date(event.date) < new Date();
  const isLocked = !event.is_registration_open;

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-gray-200">
      {/* Minimal Background */}
      <div className="fixed inset-0 z-0 opacity-[0.02]" 
           style={{
               backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px), 
                               linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)`,
               backgroundSize: '80px 80px',
           }} 
      />

      {/* Back Button */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-24 pb-8">
        <button
          onClick={() => navigate('/events')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Events
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 pb-20">
        
        {/* Hero Card */}
        <div className="bg-gradient-to-br from-[#0D1117] to-[#0A0F1C] border border-white/10 rounded-3xl overflow-hidden mb-8">
          <div className="p-8 md:p-12">
            
            {/* Status & Category */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {isCompleted ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400 border border-gray-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Completed
                </span>
              ) : isLocked ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                  <XCircle className="w-3.5 h-3.5" />
                  Registration Closed
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Open for Registration
                </span>
              )}
              <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                {event.category || 'Workshop'}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {event.title}
            </h1>

            {/* Description */}
            <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-3xl">
              {event.description || event.short_description}
            </p>

            {/* Countdown Timer */}
            {timeLeft && !isCompleted && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Timer className="w-5 h-5 text-primary" />
                  <span className="text-sm text-gray-400">Event starts in</span>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {Object.entries(timeLeft).map(([unit, value]) => (
                    <div key={unit} className="text-center p-4 bg-white/5 border border-white/10 rounded-xl">
                      <div className="text-3xl font-bold text-white mb-1">{value}</div>
                      <div className="text-xs text-gray-500 capitalize">{unit}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleRegister}
                disabled={isCompleted || isLocked}
                className="px-8 py-3.5 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Register Now
              </button>
              <button
                onClick={handleShare}
                className="px-8 py-3.5 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 transition-all flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button className="px-8 py-3.5 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 transition-all flex items-center gap-2">
                <Download className="w-4 h-4" />
                Add to Calendar
              </button>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          
          {/* Event Details */}
          <div className="bg-gradient-to-br from-[#0D1117] to-[#0A0F1C] border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Event Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Date</div>
                  <div className="text-sm text-white font-medium">
                    {new Date(event.date).toLocaleDateString('en-US', { 
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Duration</div>
                  <div className="text-sm text-white font-medium">{event.duration || '2-3 hours'}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Venue</div>
                  <div className="text-sm text-white font-medium">{event.venue || 'To be announced'}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Capacity</div>
                  <div className="text-sm text-white font-medium">
                    {event.registered_count || 0} / {event.registration_limit || '∞'} registered
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* What You'll Learn */}
          <div className="bg-gradient-to-br from-[#0D1117] to-[#0A0F1C] border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">What You'll Learn</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 mt-0.5">
                  <Target className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-sm text-gray-400">Hands-on cybersecurity challenges</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 mt-0.5">
                  <Target className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-sm text-gray-400">Real-world security scenarios</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 mt-0.5">
                  <Award className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-sm text-gray-400">Certificates and prizes</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 mt-0.5">
                  <Target className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-sm text-gray-400">Networking with security professionals</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Requirements & Contact */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Requirements */}
          <div className="bg-gradient-to-br from-[#0D1117] to-[#0A0F1C] border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Requirements</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                Basic cybersecurity knowledge
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                Laptop required
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                Team of 2-4 members (for CTF events)
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="bg-gradient-to-br from-[#0D1117] to-[#0A0F1C] border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
            <p className="text-sm text-gray-400 mb-3">For queries, reach out to:</p>
            <div className="space-y-2">
              <p className="text-sm text-primary">events@astra.edu</p>
              <p className="text-sm text-gray-500">+91 1234567890</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
