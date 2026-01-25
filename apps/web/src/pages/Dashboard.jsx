import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Ticket, Calendar, MapPin, Download, ArrowRight, Loader2, CheckCircle2, Clock } from 'lucide-react';
import TicketDownload from '../components/events/TicketDownload';

const Dashboard = () => {
    const { token, user, logout } = useAuth();
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/');
            return; // Don't run fetch if redirecting
        }

        const fetchRegistrations = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/my-registrations/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setRegistrations(data);
                } else if (response.status === 401) {
                    logout(); // Token expired
                }
            } catch (error) {
                console.error("Failed to fetch tickets", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRegistrations();
        
        // Poll every 1 second to update status (Active -> Admitted) in near real-time
        const interval = setInterval(fetchRegistrations, 1000);
        return () => clearInterval(interval);
    }, [user, token, navigate, logout]);


    if (loading) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center bg-black">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020202] text-white selection:bg-blue-500/30 overflow-x-hidden font-outfit pt-32 pb-32">
             
             {/* --- BACKGROUND SCENE --- */}
             <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] opacity-10" />
            </div>

            <main className="container mx-auto max-w-6xl px-6 relative z-10">
                
                {/* --- HEADER SECTION --- */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-20">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-px bg-blue-500" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">Personnel Registry</span>
                        </div>
                        <h1 className="text-6xl md:text-7xl font-bold text-white tracking-tighter leading-none">
                            My Tickets
                        </h1>
                        <p className="text-gray-500 text-lg max-w-md font-light leading-relaxed">
                            Authorized credentials for upcoming events and classified sessions.
                        </p>
                    </div>

                    {user && (
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-1 mx-2 flex items-center bg-white/[0.03] border border-white/10 rounded-[2rem] backdrop-blur-3xl pr-8"
                        >
                            <div className="w-14 h-14 rounded-full p-1 bg-gradient-to-tr from-blue-600 via-blue-400 to-purple-600">
                                <div className="w-full h-full rounded-full bg-[#050505] overflow-hidden flex items-center justify-center border border-white/10 shadow-2xl">
                                    {user.avatar ? 
                                        <img src={user.avatar} className="w-full h-full object-cover" alt="User" /> 
                                        : <span className="text-xl font-black">{user.name?.[0].toUpperCase()}</span>
                                    }
                                </div>
                            </div>
                            <div className="ml-4">
                                <div className="text-sm font-black tracking-tight text-white mb-0.5">{user.name}</div>
                                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none">
                                    {user.is_staff ? 'System Administrator' : 'Verified Participant'}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* --- TICKETS GRID --- */}
                {registrations.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-32 text-center rounded-[3rem] bg-white/[0.01] border border-white/5 border-dashed"
                    >
                        <Ticket className="w-16 h-16 text-gray-800 mx-auto mb-6 opacity-40" />
                        <h3 className="text-2xl font-bold text-gray-500 tracking-tight mb-2">No Active Nodes Found</h3>
                        <p className="text-gray-600 text-sm max-w-xs mx-auto mb-10 leading-relaxed font-light">
                            Your registration database is currently empty. Re-sync with primary event servers to proceed.
                        </p>
                        <Link to="/events" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                            Secure Access <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                        <AnimatePresence mode='popLayout'>
                            {registrations.map((reg, idx) => {
                                const isUsed = reg.status === 'ATTENDED' || reg.is_used;
                                
                                return (
                                    <motion.div 
                                        key={reg.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                                        className={`group relative rounded-[2.5rem] border overflow-hidden flex flex-col transition-all duration-500 ${
                                            isUsed 
                                            ? 'bg-white/[0.01] border-white/5 opacity-60 grayscale' 
                                            : 'bg-[#050505] border-white/10 hover:border-blue-500/40 hover:shadow-[0_40px_80px_-20px_rgba(59,130,246,0.1)]'
                                        }`}
                                    >
                                        {/* Status & ID Header */}
                                        <div className="p-8 flex items-center justify-between border-b border-white/5 relative z-10 transition-colors group-hover:bg-blue-600/5">
                                            <div className="flex items-center gap-2.5">
                                                <div className={`w-1.5 h-1.5 rounded-full ${isUsed ? 'bg-gray-700' : 'bg-blue-500 animate-pulse'}`} />
                                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] font-mono ${isUsed ? 'text-gray-600' : 'text-blue-500'}`}>
                                                    {isUsed ? 'Deactivated' : 'Operational'}
                                                </span>
                                            </div>
                                            <div className="text-[10px] font-mono text-gray-700 uppercase font-black">
                                                ID: {reg.token.substring(0, 8)}
                                            </div>
                                        </div>

                                        <div className="p-8 flex flex-col sm:flex-row gap-10 items-start md:items-center h-full">
                                            {/* QR Visual Card */}
                                            <div className="relative shrink-0 mx-auto sm:mx-0">
                                                <div className={`p-3 bg-white rounded-3xl relative z-10 transition-transform duration-500 group-hover:scale-105 shadow-2xl ${isUsed ? 'opacity-40' : 'opacity-100'}`}>
                                                    <img src={reg.qr_code} alt="QR" className="w-24 h-24 object-contain" />
                                                </div>
                                                <div className="absolute inset-0 bg-blue-600/20 blur-[30px] opacity-0 group-hover:opacity-100 transition-opacity rounded-full z-0" />
                                            </div>

                                            {/* Data Section */}
                                            <div className="flex-1 text-center sm:text-left space-y-5">
                                                <h3 className={`text-3xl font-bold tracking-tight text-white transition-colors duration-300 ${isUsed ? 'text-gray-700' : 'group-hover:text-blue-400'}`}>
                                                    {reg.event_details.title}
                                                </h3>
                                                
                                                <div className="flex flex-wrap justify-center sm:justify-start gap-x-6 gap-y-2">
                                                    <div className="flex items-center gap-2 text-[11px] text-gray-500 font-bold uppercase tracking-widest">
                                                        <Calendar className="w-3.5 h-3.5 text-blue-500" /> 
                                                        {new Date(reg.event_details.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[11px] text-gray-500 font-bold uppercase tracking-widest">
                                                        <MapPin className="w-3.5 h-3.5 text-blue-500" /> 
                                                        {reg.event_details.venue || 'HQ'}
                                                    </div>
                                                </div>

                                                <div className="pt-2">
                                                    {!isUsed ? (
                                                        <TicketDownload 
                                                            registration={reg}
                                                            event={reg.event_details}
                                                            className="w-full sm:w-auto px-6 py-2.5 bg-white text-black hover:bg-blue-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group/btn shadow-xl"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center sm:justify-start gap-2 text-[10px] text-gray-700 font-bold text-center italic">
                                                            Entry Terminated • No longer active
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Cinematic Line Bottom */}
                                        <div className={`h-1 w-full bg-gradient-to-r from-transparent via-blue-950 to-transparent absolute bottom-0 transition-opacity duration-1000 ${isUsed ? 'opacity-0' : 'opacity-100'}`}>
                                            <div className="h-full w-full bg-blue-600/40 blur-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-1000" />
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
