import React, { useState, useEffect, useMemo } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
    CheckCircle2, 
    XCircle, 
    AlertTriangle,
    Loader2, 
    Scan, 
    Camera,
    RefreshCw,
    Search,
    UserCheck,
    Calendar,
    Users,
    Clock,
    Trash2,
    Ticket
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '../components/admin/common/PageHeader';
import StatusBadge from '../components/admin/common/StatusBadge';

const AdminScanner = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [scanResult, setScanResult] = useState(null); 
    const [isScanning, setIsScanning] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [scanHistory, setScanHistory] = useState([]);
    const [manualToken, setManualToken] = useState('');

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

    useEffect(() => {
        if (user && !user.is_staff) {
            navigate('/');
        }
    }, [user, navigate]);

    const verifyToken = async (rawCode) => {
        if (!rawCode || isLoading) return;

        setIsScanning(false);
        setIsLoading(true);

        let tokenToVerify = rawCode.trim();
        if (rawCode.includes('/verify/')) {
             tokenToVerify = rawCode.split('/verify/')[1].replace('/', '');
        } 

        try {
            // First try /operations/verify/${token}/, fallback to /verify/${token}/
            let response = await fetch(`${API_URL}/operations/verify/${tokenToVerify}/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.status === 404) {
                response = await fetch(`${API_URL}/verify/${tokenToVerify}/`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            }
            const data = await response.json();

            let statusType = 'invalid';
            if (data.valid) {
                statusType = 'valid';
            } else if (
                data.message?.toLowerCase().includes('already') ||
                data.registrant?.status === 'ATTENDED' ||
                data.registrant?.is_used
            ) {
                statusType = 'already_used';
            }

            const result = {
                status: statusType,
                data: data,
                token: tokenToVerify,
                timestamp: new Date(),
                id: Math.random().toString(36).substring(2, 9)
            };

            setScanResult(result);
            setScanHistory(prev => [result, ...prev].slice(0, 20));
        } catch (err) {
            console.error("Verification failed", err);
            setScanResult({ 
                status: 'invalid', 
                data: { message: "Could not connect to the verification service." },
                token: tokenToVerify,
                timestamp: new Date(),
                id: Math.random().toString(36).substring(2, 9)
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleScan = (detectedCodes) => {
        if (!isScanning || isLoading) return;
        const code = detectedCodes[0]?.rawValue;
        if (code) {
            verifyToken(code);
        }
    };

    const handleManualSubmit = (e) => {
        e.preventDefault();
        if (manualToken.trim()) {
            verifyToken(manualToken.trim());
            setManualToken('');
        }
    };

    const resetScan = () => {
        setScanResult(null);
        setIsScanning(true);
    };

    const validCount = scanHistory.filter(s => s.status === 'valid').length;
    const alreadyUsedCount = scanHistory.filter(s => s.status === 'already_used').length;
    const invalidCount = scanHistory.filter(s => s.status === 'invalid').length;

    return (
        <div className="space-y-6 pb-12">
            {/* Standard SaaS Page Header */}
            <PageHeader
                title="Ticket Scanner"
                subtitle="Validate attendee QR codes at entrance gates and record verified admissions in real time."
                breadcrumbs={[
                    { label: 'Admin', to: '/admin' },
                    { label: 'Scanner' }
                ]}
                badge={
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Scanner Active
                    </div>
                }
            />

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Area: Viewfinder & Manual Input */}
                <div className="lg:col-span-7 space-y-4">
                    <div className="bg-[#111319] border border-white/[0.06] rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center relative overflow-hidden shadow-sm min-h-[440px]">
                        
                        {/* Camera Box */}
                        <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden border border-white/10 bg-black/80 flex items-center justify-center shadow-lg">
                            
                            {/* Viewfinder Target Guides */}
                            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-blue-500 rounded-tl z-20 pointer-events-none" />
                            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-blue-500 rounded-tr z-20 pointer-events-none" />
                            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-blue-500 rounded-bl z-20 pointer-events-none" />
                            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-blue-500 rounded-br z-20 pointer-events-none" />

                            {isScanning && !scanResult && (
                                <div className="w-full h-full relative z-10">
                                    <Scanner 
                                        onScan={handleScan}
                                        components={{ audio: false, finder: false }}
                                        styles={{ container: { width: '100%', height: '100%' } }}
                                    />
                                    {/* Scan Line Overlay */}
                                    <div className="absolute inset-x-0 h-0.5 bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)] animate-pulse pointer-events-none top-1/2 -translate-y-1/2" />
                                    
                                    <div className="absolute bottom-4 inset-x-0 text-center z-20 pointer-events-none">
                                        <span className="text-[11px] font-medium text-slate-300 px-3 py-1 rounded-full bg-[#0d0f14]/85 border border-white/10 backdrop-blur-sm">
                                            Align ticket QR code in frame
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Loading State */}
                            <AnimatePresence>
                                {isLoading && (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 bg-[#0d0f14]/90 z-30 flex flex-col items-center justify-center space-y-3 backdrop-blur-sm"
                                    >
                                        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                                        <div className="text-center">
                                            <p className="text-xs font-semibold text-white">Validating Pass</p>
                                            <p className="text-[11px] text-slate-400">Verifying ticket credentials...</p>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Result Overlay */}
                                {scanResult && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        className="absolute inset-0 z-40 bg-[#111319] p-6 flex flex-col justify-between overflow-y-auto"
                                    >
                                        {/* State 1: VALID TICKET */}
                                        {scanResult.status === 'valid' && (
                                            <div className="space-y-4 text-left">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                                                        <UserCheck className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Valid Ticket</span>
                                                        <h3 className="text-base font-bold text-white">Checked In Successfully</h3>
                                                    </div>
                                                </div>

                                                <div className="p-4 rounded-xl bg-[#0d0f14] border border-white/[0.06] space-y-2.5">
                                                    <div>
                                                        <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Participant Name</span>
                                                        <p className="text-sm font-semibold text-white">
                                                            {scanResult.data?.registrant?.user_details?.full_name || scanResult.data?.registrant?.user_name || 'Participant'}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Event</span>
                                                        <p className="text-xs font-medium text-blue-400">
                                                            {scanResult.data?.registrant?.event_details?.title || 'Festival Event'}
                                                        </p>
                                                    </div>

                                                    <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs">
                                                        <span className="text-[10px] text-slate-500">Pass Token</span>
                                                        <code className="text-[11px] font-mono text-slate-300">
                                                            {scanResult.token ? `${scanResult.token.slice(0, 8)}...` : 'Verified'}
                                                        </code>
                                                    </div>

                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="text-[10px] text-slate-500">Check-in Time</span>
                                                        <span className="text-[11px] font-mono text-slate-300">
                                                            {scanResult.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* State 2: ALREADY CHECKED IN */}
                                        {scanResult.status === 'already_used' && (
                                            <div className="space-y-4 text-left">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                                                        <AlertTriangle className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Already Checked In</span>
                                                        <h3 className="text-base font-bold text-white">Ticket Previously Used</h3>
                                                    </div>
                                                </div>

                                                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                                                    <p className="text-xs text-amber-200">
                                                        This ticket has already been used for entry.
                                                    </p>
                                                    {scanResult.data?.registrant && (
                                                        <div className="pt-2 border-t border-amber-500/15 space-y-1 text-xs">
                                                            <div className="flex justify-between">
                                                                <span className="text-slate-400">Participant:</span>
                                                                <span className="text-white font-medium">
                                                                    {scanResult.data.registrant.user_details?.full_name || scanResult.data.registrant.user_name || 'Participant'}
                                                                </span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-slate-400">Event:</span>
                                                                <span className="text-slate-200">
                                                                    {scanResult.data.registrant.event_details?.title || 'Festival Event'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* State 3: INVALID TICKET */}
                                        {scanResult.status === 'invalid' && (
                                            <div className="space-y-4 text-left">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                                                        <XCircle className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Invalid Ticket</span>
                                                        <h3 className="text-base font-bold text-white">Ticket Not Verified</h3>
                                                    </div>
                                                </div>

                                                <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-1.5">
                                                    <p className="text-xs text-rose-300">
                                                        {scanResult.data?.message || 'Ticket could not be verified in the registration database.'}
                                                    </p>
                                                    <p className="text-[11px] text-slate-400">
                                                        Please double-check the ticket code or confirm the attendee registration.
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        <button 
                                            type="button"
                                            onClick={resetScan}
                                            className="w-full mt-4 py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
                                        >
                                            <RefreshCw className="w-3.5 h-3.5" />
                                            Ready for Next Attendee
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Scanner Helper Note */}
                        <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                            <Camera className="w-4 h-4 text-slate-500" />
                            <span>Ensure camera has focus and venue has sufficient lighting.</span>
                        </div>
                    </div>

                    {/* Manual Token Fallback */}
                    <div className="p-4 rounded-xl bg-[#111319] border border-white/[0.06]">
                        <form onSubmit={handleManualSubmit} className="space-y-2">
                            <label className="text-xs font-medium text-slate-300 flex items-center gap-2">
                                <Ticket className="w-3.5 h-3.5 text-slate-400" />
                                Manual Ticket Code Entry
                            </label>
                            <div className="flex gap-2">
                                <input 
                                    type="text"
                                    placeholder="Enter or paste ticket token..."
                                    value={manualToken}
                                    onChange={(e) => setManualToken(e.target.value)}
                                    className="flex-1 bg-[#0d0f14] border border-white/[0.08] rounded-lg py-2 px-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors font-mono"
                                />
                                <button
                                    type="submit"
                                    disabled={!manualToken.trim() || isLoading}
                                    className="px-4 py-2 bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-semibold rounded-lg transition-colors border border-white/[0.08] disabled:opacity-50"
                                >
                                    Verify Pass
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Area: Scan Activity & History */}
                <div className="lg:col-span-5 space-y-4">
                    {/* Metrics Cards: Verified, Already Checked In, Invalid */}
                    <div className="grid grid-cols-3 gap-2.5">
                        <div className="p-3.5 rounded-xl bg-[#111319] border border-white/[0.06]">
                            <span className="text-[11px] font-medium text-slate-400">Verified</span>
                            <div className="text-xl font-bold text-emerald-400 mt-1">{validCount}</div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-[#111319] border border-white/[0.06]">
                            <span className="text-[11px] font-medium text-slate-400">Used</span>
                            <div className="text-xl font-bold text-amber-400 mt-1">{alreadyUsedCount}</div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-[#111319] border border-white/[0.06]">
                            <span className="text-[11px] font-medium text-slate-400">Declined</span>
                            <div className="text-xl font-bold text-rose-400 mt-1">{invalidCount}</div>
                        </div>
                    </div>

                    {/* Scan Feed */}
                    <div className="bg-[#111319] border border-white/[0.06] rounded-xl overflow-hidden flex flex-col shadow-sm">
                        <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Scan className="w-4 h-4 text-slate-400" />
                                <h3 className="text-xs font-semibold text-white">Recent Scans</h3>
                            </div>
                            {scanHistory.length > 0 && (
                                <button 
                                    onClick={() => setScanHistory([])}
                                    className="text-[11px] text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1"
                                >
                                    <Trash2 className="w-3 h-3" />
                                    Clear
                                </button>
                            )}
                        </div>

                        <div className="p-3 max-h-[400px] overflow-y-auto space-y-2">
                            {scanHistory.length === 0 ? (
                                <div className="py-12 text-center text-slate-500 text-xs">
                                    <Scan className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                    <p className="font-medium text-slate-400">No scans recorded yet</p>
                                    <p className="text-[11px] text-slate-500 mt-0.5">Scanned participant tickets will appear here.</p>
                                </div>
                            ) : (
                                scanHistory.map((scan) => {
                                    const isValid = scan.status === 'valid';
                                    const isAlreadyUsed = scan.status === 'already_used';
                                    
                                    let badgeStatus = 'error';
                                    let badgeLabel = 'Declined';
                                    if (isValid) {
                                        badgeStatus = 'success';
                                        badgeLabel = 'Verified';
                                    } else if (isAlreadyUsed) {
                                        badgeStatus = 'warning';
                                        badgeLabel = 'Already Used';
                                    }

                                    return (
                                        <div 
                                            key={scan.id}
                                            className="p-3 rounded-lg bg-[#0d0f14] border border-white/[0.05] space-y-1.5"
                                        >
                                            <div className="flex items-center justify-between text-xs">
                                                <StatusBadge 
                                                    status={badgeStatus}
                                                    label={badgeLabel}
                                                />
                                                <span className="text-[10px] font-mono text-slate-400">
                                                    {scan.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                </span>
                                            </div>

                                            {scan.data?.registrant ? (
                                                <div className="mt-1">
                                                    <p className="text-xs font-semibold text-white truncate">
                                                        {scan.data.registrant.user_details?.full_name || scan.data.registrant.user_name || 'Participant'}
                                                    </p>
                                                    <p className="text-[11px] text-slate-400 truncate">
                                                        {scan.data.registrant.event_details?.title || 'Festival Event'}
                                                    </p>
                                                </div>
                                            ) : (
                                                <p className="text-[11px] text-rose-300 truncate">
                                                    {scan.data?.message || 'Invalid ticket token'}
                                                </p>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminScanner;
