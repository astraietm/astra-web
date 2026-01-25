import React, { useRef } from 'react';
import { toPng } from 'html-to-image';
import { Calendar, MapPin, Clock, User, Hash, Download, Ticket as TicketIcon, QrCode } from 'lucide-react';

const Ticket = React.forwardRef(({ registration, event: rawEvent }, ref) => {
  if (!registration || !rawEvent) return null;

  // Normalize event data
  const event = {
    title: rawEvent.title,
    date: rawEvent.event_date || rawEvent.date,
    time: rawEvent.time || (rawEvent.event_date ? new Date(rawEvent.event_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBA'),
    venue: rawEvent.venue || 'Main Campus',
  };

  const participantName = registration.user_name || 'Guest Participant';
  const passId = registration.token?.slice(0, 8).toUpperCase() || 'TEMP';
  const qrCode = registration.qr_code;

  return (
    <div className="p-8 bg-[#020408] flex items-center justify-center">
        <div 
            ref={ref}
            className="relative w-[600px] h-[300px] bg-[#0A0C10] border border-white/10 rounded-3xl overflow-hidden flex shadow-2xl"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
            {/* Left Section - Main Info */}
            <div className="flex-1 p-8 flex flex-col justify-between relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500 rounded-full blur-[100px]" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                            <TicketIcon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Official Entry Pass</span>
                    </div>

                    <h2 className="text-3xl font-bold text-white tracking-tighter mb-4 leading-tight">
                        {event.title}
                    </h2>

                    <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                        <div className="flex items-center gap-2 text-gray-400">
                            <Calendar className="w-3.5 h-3.5 text-blue-400" />
                            <span className="text-[11px] font-medium leading-none">
                                {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                            <Clock className="w-3.5 h-3.5 text-blue-400" />
                            <span className="text-[11px] font-medium leading-none">{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 col-span-2">
                            <MapPin className="w-3.5 h-3.5 text-blue-400" />
                            <span className="text-[11px] font-medium leading-none">{event.venue}</span>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 pt-6 border-t border-white/5 flex items-end justify-between">
                    <div>
                        <div className="text-[9px] uppercase tracking-widest text-gray-500 font-bold mb-1">Participant</div>
                        <div className="text-sm font-bold text-white flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-blue-400" />
                            {participantName}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-[9px] uppercase tracking-widest text-gray-500 font-bold mb-1">Pass ID</div>
                        <div className="text-[11px] font-mono text-gray-400">#{passId}</div>
                    </div>
                </div>
            </div>

            {/* Stub Divider */}
            <div className="w-px border-l-2 border-dashed border-white/10 relative">
                <div className="absolute -top-4 -left-[9px] w-4 h-4 bg-[#020408] rounded-full border border-white/10" />
                <div className="absolute -bottom-4 -left-[9px] w-4 h-4 bg-[#020408] rounded-full border border-white/10" />
            </div>

            {/* Right Section - QR Code */}
            <div className="w-[200px] bg-white/5 p-8 flex flex-col items-center justify-center gap-6">
                <div className="p-2 bg-white rounded-2xl shadow-xl">
                    <img 
                        src={qrCode} 
                        alt="Join QR" 
                        className="w-24 h-24"
                    />
                </div>
                <div className="text-center">
                    <div className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-2">Scan to Verify</div>
                    <img src="/logo.png" alt="" className="h-4 opacity-50 mx-auto" onError={(e) => e.target.style.display='none'} />
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">ASTRA 2026</span>
                </div>
            </div>
        </div>
    </div>
  );
});

const TicketDownload = ({ registration, event, className }) => {
    const ticketRef = useRef(null);
    const [downloading, setDownloading] = React.useState(false);

    const downloadTicket = async () => {
        if (!ticketRef.current) return;
        
        try {
            setDownloading(true);
            
            // Wait a tiny bit for any layout/images to stabilize
            await new Promise(r => setTimeout(r, 100));

            const dataUrl = await toPng(ticketRef.current, {
                cacheBust: true,
                pixelRatio: 2,
                // FIX: Filter out external stylesheets that trigger CORS/SecurityError
                filter: (node) => {
                    if (node.tagName === 'LINK' && node.rel === 'stylesheet') {
                        // Keep only internal or relative stylesheets
                        return node.href.includes(window.location.origin);
                    }
                    return true;
                },
                // Skip the fancy font embedding for external sheets to avoid the SecurityError
                skipFonts: true, 
            });
            
            const link = document.createElement('a');
            link.download = `ASTRA_Ticket_${event?.title?.replace(/\s+/g, '_')}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Failed to generate ticket:', err);
            // Fallback for Safari/Mobile or restricted environments
            alert('Ticket generation failed. Please try again or take a screenshot.');
        } finally {
            setDownloading(false);
        }
    };

    return (
        <>
            {/* Hidden Ticket for Rendering */}
            <div className="fixed -left-[9999px] -top-[9999px] pointer-events-none">
                <Ticket ref={ticketRef} registration={registration} event={event} />
            </div>

            <button
                onClick={downloadTicket}
                disabled={downloading}
                className={className}
            >
                {downloading ? (
                    <span className="animate-pulse">Generating...</span>
                ) : (
                    <>
                        <Download className="w-4 h-4" />
                        Download Ticket
                    </>
                )}
            </button>
        </>
    );
};

export default TicketDownload;
