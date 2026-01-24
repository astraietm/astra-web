import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
        <div className="min-h-screen pt-32 pb-20 bg-background relative px-4">
             {/* Background Effects */}
             <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px]"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
            </div>

            <div className="container mx-auto max-w-5xl relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">My Tickets</h1>
                        <p className="text-gray-400">Manage your event access and credentials.</p>
                    </div>
                    {user && (
                        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-blue-600 flex items-center justify-center text-black font-bold relative overflow-hidden">
                                {user.avatar ? 
                                    <img src={user.avatar} className="w-full h-full object-cover" alt="User" /> 
                                    : (user.name ? user.name[0].toUpperCase() : 'U')
                                }
                            </div>
                            <div>
                                <div className="text-white font-bold text-sm">{user.name}</div>
                                <div className="text-xs text-gray-500">{user.email}</div>
                                {user.is_staff && (
                                    <div className="text-[10px] text-primary font-mono mt-1">STAFF ACCESS ENABLED</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {registrations.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 border border-white/5 rounded-3xl">
                        <Ticket className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl text-white font-bold mb-2">No Active Tickets</h3>
                        <p className="text-gray-400 mb-8 max-w-xs mx-auto">You haven't registered for any events yet. Secure your spot now.</p>
                        <Link to="/events" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black font-bold rounded-xl hover:bg-white transition-colors">
                            Browse Events <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        {registrations.map((reg) => {
                            const isUsed = reg.status === 'ATTENDED' || reg.is_used;
                            
                            return (
                                <motion.div 
                                    key={reg.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`group border rounded-2xl overflow-hidden transition-all duration-300 relative ${isUsed ? 'bg-[#0A0F1C]/50 border-white/5 grayscale-[0.5]' : 'bg-[#0A0F1C] border-white/10 hover:border-primary/30'}`}
                                >
                                    {/* Ticket Header / Token */}
                                    <div className="absolute top-0 right-0 p-4 opacity-50 text-[10px] font-mono text-gray-500 z-10">
                                        #{reg.token.substring(0, 8).toUpperCase()}
                                    </div>

                                    {/* Status Badge */}
                                    <div className="absolute top-4 left-4 z-10">
                                        {isUsed ? (
                                            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-bold uppercase tracking-wider">
                                                <CheckCircle2 className="w-3 h-3" /> Admitted
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider animate-pulse">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Active Ticket
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-6 pt-12 flex flex-col sm:flex-row gap-6">
                                        {/* QR Code Section */}
                                        <div className={`flex-shrink-0 bg-white p-2 rounded-xl h-fit w-fit mx-auto sm:mx-0 ${isUsed ? 'opacity-50' : 'opacity-100'}`}>
                                            <img src={reg.qr_code} alt="QR" className="w-24 h-24 object-contain" />
                                        </div>

                                        {/* Info Section */}
                                        <div className="flex-grow text-center sm:text-left">
                                            <h3 className={`text-xl font-bold text-white mb-2 leading-tight ${isUsed ? 'line-through text-gray-500' : ''}`}>
                                                {reg.event_details.title}
                                            </h3>
                                            
                                            <div className="space-y-1 mb-4">
                                                <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-gray-400">
                                                    <Calendar className="w-3 h-3" /> {reg.event_details.date}
                                                </div>
                                                <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-gray-400">
                                                    <MapPin className="w-3 h-3" /> {reg.event_details.venue}
                                                </div>
                                                {isUsed && reg.updated_at && (
                                                     <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-green-500/80 mt-2 font-mono">
                                                        <Clock className="w-3 h-3" /> Used: {new Date(reg.updated_at).toLocaleDateString()}
                                                    </div>
                                                )}
                                            </div>

                                            {!isUsed && (
                                                <TicketDownload 
                                                    registration={reg}
                                                    event={reg.event_details}
                                                    className="w-full sm:w-auto px-4 py-2 bg-white/5 hover:bg-primary hover:text-black border border-white/10 rounded-lg text-xs font-bold uppercase tracking-wider text-white transition-all flex items-center justify-center gap-2"
                                                />
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Bottom Status Strip */}
                                    <div className={`h-1 w-full ${isUsed ? 'bg-green-600/50' : 'bg-primary shadow-[0_0_10px_#06b6d4]'}`}></div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
