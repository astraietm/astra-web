import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Mail, Clock, AlertCircle } from 'lucide-react';

const ShippingPolicy = () => {
    return (
        <div className="min-h-screen bg-black text-white pt-32 pb-20 selection:bg-red-500/30">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03]" />
            </div>

            <div className="container mx-auto px-4 relative z-10 max-w-4xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-xs font-medium uppercase tracking-wider mb-6">
                        <Truck className="w-4 h-4" />
                        Digital Delivery
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
                        Shipping & Delivery Policy
                    </h1>
                    <p className="text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                        Since ASTRA organizes events and workshops, our delivery method is entirely digital.
                    </p>
                </motion.div>

                <div className="space-y-6">
                    {/* Main Policy Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-zinc-900/30 border border-white/10 rounded-2xl p-8 backdrop-blur-sm"
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 shrink-0">
                                <Mail className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-white mb-3">Confirmation & Tickets</h2>
                                <p className="text-zinc-400 leading-relaxed">
                                    Upon successful registration and payment for an event, you will receive an automated confirmation email immediately. This email will contain your:
                                </p>
                                <ul className="mt-4 space-y-2 text-zinc-400 pl-4 border-l border-white/10 ml-1">
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                        <span>Payment Receipt / Invoice</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                        <span>Unique QR Code / Entry Ticket</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                        <span>Event Schedule & Venue Details</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>

                    {/* Timeline */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-zinc-900/30 border border-white/10 rounded-2xl p-8 backdrop-blur-sm"
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 shrink-0">
                                <Clock className="w-6 h-6 text-orange-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-white mb-3">Delivery Timeline</h2>
                                <p className="text-zinc-400 leading-relaxed">
                                    Digital delivery is instant. In rare cases of high server traffic, email delivery might take up to 10-15 minutes. If you do not receive your confirmation within 1 hour, please check your spam folder.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* No Physical Shipping */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-zinc-900/30 border border-white/10 rounded-2xl p-8 backdrop-blur-sm"
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 shrink-0">
                                <AlertCircle className="w-6 h-6 text-red-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-white mb-3">No Physical Shipping</h2>
                                <p className="text-zinc-400 leading-relaxed">
                                    ASTRA is a student association organizing on-campus and virtual events. We do not sell physical goods, and no physical items will be shipped to your address. All "products" listed are service-based event registrations.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Footer Contact */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-12 text-center"
                >
                    <p className="text-zinc-500 text-sm">
                        Issues with your ticket? Contact us at <a href="mailto:support@astraietm.in" className="text-white hover:underline transition-colors">support@astraietm.in</a>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default ShippingPolicy;
