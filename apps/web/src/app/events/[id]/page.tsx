"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { PixelFrame } from "@/components/ui/PixelFrame";
import { StickerBadge } from "@/components/ui/StickerBadge";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast-context";
import api from "@/lib/api";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Award,
  ArrowLeft,
  ArrowRight,
  Shield,
  Loader2,
  CheckCircle2,
  CreditCard,
  Share2,
} from "lucide-react";

interface EventDetailData {
  id: number;
  title: string;
  description: string;
  event_date: string;
  venue: string;
  image: string;
  category: string;
  time: string;
  duration: string;
  registration_start: string;
  registration_end: string;
  registration_limit: number;
  is_registration_open: boolean;
  is_team_event: boolean;
  team_size_min: number;
  team_size_max: number;
  requires_payment: boolean;
  payment_amount: string;
  content_blocks: any[];
  coordinators: any[];
  prize: string;
  registration_count: number;
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, setIsLoginModalOpen } = useAuth();
  const { showToast } = useToast();

  const [event, setEvent] = useState<EventDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params?.id) return;
    fetchEventDetail();
  }, [params?.id]);

  const fetchEventDetail = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/events/${params.id}/`);
      setEvent(res.data);
    } catch (err: any) {
      console.error("Failed to fetch event detail:", err);
      setError("Failed to load event details. The event may not exist.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    router.push(`/register/${params.id}`);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      showToast("Event link copied to clipboard!", "success");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 max-w-5xl mx-auto flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-black" />
          <p className="font-mono text-sm uppercase tracking-widest text-neutral-600">
            Loading Event Details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 max-w-3xl mx-auto text-center">
        <PixelFrame accentColor="yellow" className="p-8">
          <h2 className="font-display text-3xl uppercase mb-4 leading-none">EVENT NOT FOUND</h2>
          <p className="font-body text-neutral-700 mb-6">{error || "Event details are unavailable."}</p>
          <Link
            href="/events"
            className="inline-flex items-center space-x-2 bg-black text-white px-6 py-3 font-body font-bold text-sm uppercase hover:bg-neutral-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Events</span>
          </Link>
        </PixelFrame>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 max-w-5xl mx-auto">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/events"
          className="inline-flex items-center space-x-2 font-body font-semibold text-sm uppercase tracking-wider text-neutral-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Events</span>
        </Link>
      </div>

      <PixelFrame className="p-6 md:p-10 mb-8">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <StickerBadge color="pink">{event.category || "EVENT"}</StickerBadge>

          {event.is_team_event ? (
            <StickerBadge color="mint">
              Team ({event.team_size_min}-{event.team_size_max})
            </StickerBadge>
          ) : (
            <StickerBadge color="yellow">Solo</StickerBadge>
          )}

          {event.requires_payment ? (
            <StickerBadge color="lilac">₹{event.payment_amount}</StickerBadge>
          ) : (
            <StickerBadge color="lime">FREE</StickerBadge>
          )}

          {event.is_registration_open ? (
            <span className="font-pixel text-[10px] text-green-700 bg-green-100 px-2 py-1 border border-green-400 uppercase">
              REGISTRATION OPEN
            </span>
          ) : (
            <span className="font-pixel text-[10px] text-red-700 bg-red-100 px-2 py-1 border border-red-400 uppercase">
              REGISTRATION CLOSED
            </span>
          )}
        </div>

        <h1 className="font-display text-4xl md:text-6xl uppercase tracking-normal mb-6 leading-none">
          {event.title}
        </h1>

        {/* Quick details banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-neutral-100 border-2 border-black mb-8 font-body text-sm">
          <div>
            <span className="text-xs text-neutral-500 uppercase block font-semibold">Date</span>
            <div className="flex items-center space-x-1.5 font-bold mt-1">
              <Calendar className="w-4 h-4" />
              <span>{event.event_date ? new Date(event.event_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "TBA"}</span>
            </div>
          </div>

          <div>
            <span className="text-xs text-neutral-500 uppercase block font-semibold">Time</span>
            <div className="flex items-center space-x-1.5 font-bold mt-1">
              <Clock className="w-4 h-4" />
              <span>{event.time || "TBA"}</span>
            </div>
          </div>

          <div>
            <span className="text-xs text-neutral-500 uppercase block font-semibold">Venue</span>
            <div className="flex items-center space-x-1.5 font-bold mt-1 truncate">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{event.venue || "Campus Main Stage"}</span>
            </div>
          </div>

          <div>
            <span className="text-xs text-neutral-500 uppercase block font-semibold">Prize Pool</span>
            <div className="flex items-center space-x-1.5 font-bold mt-1 text-emerald-700">
              <Award className="w-4 h-4" />
              <span>{event.prize || "Exciting Rewards"}</span>
            </div>
          </div>
        </div>

        {/* Image banner if present */}
        {event.image && (
          <div className="mb-8 border-2 border-black overflow-hidden max-h-96">
            <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Description */}
        <div className="mb-8">
          <h2 className="font-display text-2xl uppercase mb-3 border-b-2 border-black pb-1 leading-none">
            About The Event
          </h2>
          <p className="font-body text-neutral-800 text-base sm:text-lg leading-relaxed whitespace-pre-line">
            {event.description}
          </p>
        </div>

        {/* Dynamic Content Blocks if present */}
        {event.content_blocks && event.content_blocks.length > 0 && (
          <div className="mb-8 space-y-6">
            {event.content_blocks.map((block: any, idx: number) => (
              <div key={idx} className="p-4 bg-yellow-50 border-2 border-black">
                <h3 className="font-display text-xl uppercase mb-2 leading-none">{block.title || block.heading}</h3>
                <p className="font-body text-neutral-700">{block.content || block.text || block.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Coordinators */}
        {event.coordinators && event.coordinators.length > 0 && (
          <div className="mb-8">
            <h2 className="font-display text-2xl uppercase mb-3 border-b-2 border-black pb-1 leading-none">
              Event Coordinators
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {event.coordinators.map((coord: any, idx: number) => (
                <div key={idx} className="p-3 border border-black bg-neutral-50 font-body text-sm flex justify-between items-center">
                  <span className="font-bold">{coord.name}</span>
                  <span className="text-neutral-600">{coord.phone || coord.contact}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t-2 border-black">
          <button
            onClick={handleShare}
            className="px-4 py-2 border-2 border-black bg-white hover:bg-neutral-100 font-body font-bold text-sm uppercase flex items-center space-x-2 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Event</span>
          </button>

          {event.is_registration_open ? (
            <button
              onClick={handleRegisterClick}
              className="px-8 py-3 bg-black text-white hover:bg-neutral-800 font-body text-base uppercase font-bold tracking-wider flex items-center space-x-3 transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>{user ? "Register Now" : "Login to Register"}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              disabled
              className="px-8 py-3 bg-neutral-300 text-neutral-600 font-body text-base uppercase font-bold cursor-not-allowed border-2 border-neutral-400"
            >
              Registration Closed
            </button>
          )}
        </div>
      </PixelFrame>
    </div>
  );
}
