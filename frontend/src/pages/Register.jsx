import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle, Loader2, ShieldCheck, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import eventsData from '../data/events';
import ScrollReveal from '../components/common/ScrollReveal';

const Register = () => {
    const { id } = useParams();
    const event = eventsData.find(e => e.id === parseInt(id));

    const [formData, setFormData] = useState({});
    const [status, setStatus] = useState('idle'); // idle, submitting, success, error
    const [focusedField, setFocusedField] = useState(null);

    // Simulated "System Check" steps for the submission effect
    const [submissionStep, setSubmissionStep] = useState(0);
    const steps = ["Encrypting Data...", "Handshaking with Server...", "Verifying Credentials...", "Access Granted"];

    if (!event) {
        return (
            <div className="min-h-screen pt-32 pb-12 flex items-center justify-center text-center bg-background">
                <div className="space-y-4">
                    <div className="inline-block p-4 rounded-full bg-red-500/10 border border-red-500/20 mb-4">
                        <Terminal className="w-8 h-8 text-red-500" />
                    </div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Event Not Found</h1>
                    <Link to="/events" className="text-primary hover:text-cyan-300 transition-colors font-mono text-sm underline underline-offset-4">Return to Events</Link>
                </div>
            </div>
        );
    }

    const { registration_config } = event;

    if (!registration_config || !registration_config.isOpen) {
        return (
            <div className="min-h-screen pt-32 pb-12 flex items-center justify-center text-center bg-background">
                <div className="max-w-md px-6">
                    <h1 className="text-3xl font-display font-bold text-white mb-4">Registration Closed</h1>
                    <p className="text-gray-400 mb-8 font-light">Sorry, the secure gateway for this event is currently locked. Please check back later or contact an administrator.</p>
                    <Link to="/events" className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-white hover:bg-white/10 hover:border-primary/50 transition-all font-mono text-sm">/return_to_events</Link>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');

        // Simulation of a complex verification process
        let currentStep = 0;
        const interval = setInterval(() => {
            currentStep++;
            setSubmissionStep(currentStep);
            if (currentStep >= steps.length) {
                clearInterval(interval);
                setStatus('success');
                console.log("Registered:", { eventId: id, ...formData });
            }
        }, 800);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen pt-32 pb-20 bg-background relative overflow-hidden">

            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px]"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
                <div className="absolute inset-0 bg-noise opacity-[0.03]"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10 md:pt-10">
                <Link to="/events" className="inline-flex items-center text-gray-500 hover:text-white transition-colors mb-8 group font-mono text-xs tracking-widest uppercase">
                    <ArrowLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back_to_Events
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-12 lg:gap-24 items-start max-w-6xl mx-auto">

                    {/* Left Column: Event Info */}
                    <div className="lg:sticky lg:top-32">
                        <ScrollReveal>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="font-mono text-xs text-green-500 tracking-widest uppercase">Registration Active</span>
                            </div>

                            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-none tracking-tight">
                                {event.title}
                            </h1>

                            <div className="flex flex-col gap-4 text-gray-400 mb-8 border-l-2 border-primary/20 pl-6">
                                <p className="font-light text-lg">{event.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mb-12">
                                <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                                    <div className="text-xs font-mono text-gray-500 uppercase mb-1">Timeline</div>
                                    <div className="text-white font-medium">{event.date}</div>
                                </div>
                                <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                                    <div className="text-xs font-mono text-gray-500 uppercase mb-1">Sector</div>
                                    <div className="text-white font-medium">{event.venue}</div>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* Right Column: Registration Form */}
                    <ScrollReveal delay={0.2} width="100%">
                        <div className="bg-surface/50 backdrop-blur-xl border border-white/10 rounded-2xl p-1 shadow-2xl relative group">

                            {/* Glowing Border Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-blue-600/20 rounded-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                            <div className="bg-[#0A0F1C] rounded-xl p-6 md:p-8 relative z-10 h-full">
                                <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                                    <h3 className="text-xl font-display font-bold text-white">Secure Entry</h3>
                                    <ShieldCheck className="w-5 h-5 text-primary" />
                                </div>

                                <AnimatePresence mode="wait">
                                    {status === 'success' ? (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-center py-10"
                                        >
                                            <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                                                <div className="absolute inset-0 border border-green-500/30 rounded-full animate-ping"></div>
                                                <CheckCircle className="w-10 h-10 text-green-500" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-white mb-2">Access Granted</h3>
                                            <p className="text-gray-400 mb-8 max-w-xs mx-auto">Your registration has been encrypted and stored securely. Check your inbox for the uplink key.</p>
                                            <Link to="/events" className="w-full block py-4 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 hover:border-white/20 transition-all font-mono text-sm uppercase tracking-wider">
                                                Return_to_Base
                                            </Link>
                                        </motion.div>
                                    ) : status === 'submitting' ? (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="py-20 text-center space-y-6"
                                        >
                                            <div className="relative w-20 h-20 mx-auto">
                                                <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin"></div>
                                                <div className="absolute inset-2 border-r-2 border-blue-500 rounded-full animate-spin reverse"></div>
                                            </div>
                                            <div className="font-mono text-sm text-primary animate-pulse">
                                                {steps[Math.min(submissionStep, steps.length - 1)]}
                                            </div>
                                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden max-w-[200px] mx-auto">
                                                <motion.div
                                                    className="h-full bg-primary"
                                                    initial={{ width: "0%" }}
                                                    animate={{ width: `${(submissionStep / steps.length) * 100}%` }}
                                                />
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.form
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            onSubmit={handleSubmit}
                                            className="space-y-5"
                                        >
                                            {registration_config.fields.map((field) => (
                                                <motion.div
                                                    key={field.name}
                                                    className="relative group"
                                                    initial={false}
                                                    animate={focusedField === field.name ? { scale: 1.02 } : { scale: 1 }}
                                                >
                                                    <label htmlFor={field.name} className={`block text-xs font-mono mb-2 transition-colors ${focusedField === field.name ? 'text-primary' : 'text-gray-400'}`}>
                                                        {field.label} {field.required && <span className="text-red-400">*</span>}
                                                    </label>

                                                    {field.type === 'select' ? (
                                                        <div className="relative">
                                                            <select
                                                                id={field.name}
                                                                name={field.name}
                                                                required={field.required}
                                                                onChange={handleChange}
                                                                onFocus={() => setFocusedField(field.name)}
                                                                onBlur={() => setFocusedField(null)}
                                                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3.5 text-white appearance-none focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all outline-none"
                                                            >
                                                                <option value="">Select Protocol</option>
                                                                {field.options.map(opt => (
                                                                    <option key={opt} value={opt} className="bg-gray-900">{opt}</option>
                                                                ))}
                                                            </select>
                                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="relative">
                                                            <input
                                                                type={field.type}
                                                                id={field.name}
                                                                name={field.name}
                                                                placeholder={field.placeholder || ""}
                                                                required={field.required}
                                                                onChange={handleChange}
                                                                onFocus={() => setFocusedField(field.name)}
                                                                onBlur={() => setFocusedField(null)}
                                                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all outline-none"
                                                            />
                                                            {/* Corner accents using pseudo-elements logic via spans */}
                                                            <span className={`absolute top-0 left-0 w-2 h-2 border-t border-l transition-colors duration-300 ${focusedField === field.name ? 'border-primary' : 'border-transparent'}`}></span>
                                                            <span className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r transition-colors duration-300 ${focusedField === field.name ? 'border-primary' : 'border-transparent'}`}></span>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            ))}

                                            <div className="pt-6">
                                                <button
                                                    type="submit"
                                                    disabled={status === 'submitting'}
                                                    className="w-full bg-gradient-to-r from-primary to-blue-600 text-black font-bold font-display text-lg py-4 rounded-xl hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
                                                >
                                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                                        Initialize Sequence <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                    </span>
                                                    {/* Shine Effect */}
                                                    <div className="absolute top-0 -left-[100%] w-full h-full bg-white/30 transform skew-x-12 group-hover:animate-[shine_1s_infinite]"></div>
                                                </button>
                                            </div>

                                            <div className="text-center">
                                                <p className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">
                                                    Encrypted • Secure • Verified
                                                </p>
                                            </div>
                                        </motion.form>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </div>
    );
};

export default Register;
