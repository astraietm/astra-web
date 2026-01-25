import React, { useRef } from 'react';
import { toPng } from 'html-to-image';
import { Calendar, MapPin, Clock, User, Hash, Download, Ticket as TicketIcon, QrCode } from 'lucide-react';

const Ticket = React.forwardRef(({ registration, event: rawEvent }, ref) => {
  if (!registration || !rawEvent) return null;

  const isHawkins = rawEvent.title?.toLowerCase().includes('hawkins') || rawEvent.id === 1;
  const theme = {
    primary: isHawkins ? '#ef4444' : '#3b82f6',
    secondary: isHawkins ? '#b91c1c' : '#1d4ed8',
    bg: '#020202',
    accent: isHawkins ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
    glow: isHawkins ? '0 0 40px rgba(239, 68, 68, 0.2)' : '0 0 40px rgba(59, 130, 246, 0.2)'
  };

  const event = {
    title: rawEvent.title,
    date: rawEvent.event_date || rawEvent.date,
    time: rawEvent.time || '10:00 AM',
    venue: rawEvent.venue || 'Main Campus',
  };

  const participantName = registration.user_name || 'Guest Participant';
  const passId = registration.token?.slice(0, 8).toUpperCase() || 'TEMP';
  const qrCode = registration.qr_code;

  return (
    <div className="p-12 bg-black flex items-center justify-center">
        <div 
            ref={ref}
            className="relative w-[1000px] h-[450px] bg-[#020202] rounded-[3rem] overflow-hidden flex border border-white/10 shadow-2xl"
            style={{ 
                fontFamily: "'Segoe UI', Roboto, sans-serif",
                boxShadow: theme.glow
            }}
        >
            {/* Background Texture/Grid */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
            
            {/* Left Content Area */}
            <div className="flex-1 p-16 flex flex-col justify-between relative z-10">
                
                {/* Header Branding */}
                <div className="flex items-center justify-between pointer-events-none">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-white/10"
                             style={{ background: theme.accent }}>
                            <TicketIcon className="w-6 h-6" style={{ color: theme.primary }} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Classification</span>
                            <span className="text-xs font-bold uppercase tracking-widest text-white">
                                {isHawkins ? 'Emergency Protocol' : 'Standard Authorization'}
                            </span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Session Node</span>
                        <div className="text-xs font-mono font-bold text-white">AX-{passId.slice(0,4)}</div>
                    </div>
                </div>

                {/* Event Title Section */}
                <div className="py-8">
                    <h1 className="text-5xl font-black text-white tracking-tighter leading-[0.9] mb-4 uppercase">
                        {event.title}
                    </h1>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-gray-400">
                             <Calendar className="w-4 h-4" style={{ color: theme.primary }} />
                             <span className="text-sm font-bold uppercase tracking-wider">
                                {new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric' })}
                             </span>
                        </div>
                        <div className="w-px h-3 bg-white/10" />
                        <div className="flex items-center gap-2 text-gray-400">
                             <Clock className="w-4 h-4" style={{ color: theme.primary }} />
                             <span className="text-sm font-bold uppercase tracking-wider">{event.time}</span>
                        </div>
                    </div>
                </div>

                {/* Participant Data Bar */}
                <div className="flex items-end justify-between pt-10 border-t border-white/10">
                    <div className="flex gap-12">
                        <div>
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-30 mb-2 block">Participant</span>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[10px] font-bold">
                                    {participantName.charAt(0)}
                                </div>
                                <span className="text-lg font-bold text-white tracking-tight">{participantName}</span>
                            </div>
                        </div>
                        <div>
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-30 mb-2 block">Location</span>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" style={{ color: theme.primary }} />
                                <span className="text-sm font-bold text-gray-300">{event.venue}</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                         <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-30 mb-2 block">Auth Token</span>
                         <span className="text-sm font-mono font-bold" style={{ color: theme.primary }}>{passId}</span>
                    </div>
                </div>
            </div>

            {/* Aesthetic Stub Divider */}
            <div className="w-[100px] h-full flex flex-col items-center justify-center relative">
                <div className="h-full w-px border-l-2 border-dashed border-white/20 relative">
                    <div className="absolute -top-10 -left-10 w-20 h-20 bg-black rounded-full border-b border-white/10" />
                    <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-black rounded-full border-t border-white/10" />
                </div>
                {/* Vertical Text */}
                <div className="absolute rotate-90 whitespace-nowrap text-[10px] font-black uppercase tracking-[0.6em] opacity-10 text-white">
                    ADMIT ONE // SECURE ENTRY // ASTRA 2026
                </div>
            </div>

            {/* Right Scanning Section */}
            <div className="w-[300px] bg-white/[0.02] flex flex-col items-center justify-center p-12 border-l border-white/5">
                <div className="relative p-3 bg-white rounded-[2rem] shadow-2xl mb-8 group">
                    <img 
                        src={qrCode} 
                        alt="QR" 
                        className="w-32 h-32 relative z-10"
                    />
                    <div className="absolute inset-0 bg-white/20 blur-[20px] -z-0" />
                </div>
                <div className="text-center space-y-4">
                    <div className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 inline-block">
                        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/50">Scanner Validated</span>
                    </div>
                    <div className="pt-2">
                        <div className="text-[10px] font-black uppercase tracking-[0.5em] text-white">ASTRA</div>
                        <div className="text-[8px] font-bold text-gray-600 mt-1">Classified Credentials // 2026</div>
                    </div>
                </div>
            </div>
            
            {/* Cinematic Overlay Beams */}
            <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none"
                 style={{ background: theme.accent, opacity: 0.3 }} />
        </div>
    </div>
  );
});

const TicketDownload = ({ registration, event, className }) => {
    const ticketRef = useRef(null);
    const [downloading, setDownloading] = React.useState(false);

    const downloadTicket = async () => {
        if (!ticketRef.current) return;
        
        const passId = registration.token?.slice(0, 8).toUpperCase() || 'TEMP';

        try {
            setDownloading(true);
            
            // Wait for DOM to be fully ready and styles to calculate
            await new Promise(r => setTimeout(r, 200));

            const dataUrl = await toPng(ticketRef.current, {
                cacheBust: true,
                pixelRatio: 3, // Even higher quality for professional look
                style: {
                    transform: 'scale(1)', // Ensure no weird transforms are inherited
                },
                filter: (node) => {
                    // Filter out external stylesheets that trigger CORS/SecurityError
                    if (node.tagName === 'LINK' && node.rel === 'stylesheet') {
                        return node.href.includes(window.location.origin);
                    }
                    // Filter out non-existent or failing images that might crash the renderer
                    if (node.tagName === 'IMG' && !node.complete && node.src) {
                         return false;
                    }
                    return true;
                },
                skipFonts: true, // Google fonts are problematic with html-to-image
            });
            
            const link = document.createElement('a');
            link.download = `ASTRA_Pass_${event?.title?.replace(/\s+/g, '_')}_${passId}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Failed to generate ticket:', err);
            // Alert user with a more helpful message
            alert('Pass generation encountered an error. This usually happens on some mobile browsers or restricted networks. Please take a screenshot of your pass instead.');
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
