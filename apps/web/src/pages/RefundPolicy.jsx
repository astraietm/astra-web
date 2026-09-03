import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCcw, CalendarX, CheckCircle2, XCircle } from 'lucide-react';

const RefundPolicy = () => {
    return (
        <div className="min-h-screen bg-black text-white pt-32 pb-20 selection:bg-red-500/30">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-900/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-900/5 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03]" />
            </div>

            <div className="container mx-auto px-4 relative z-10 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-xs font-medium uppercase tracking-wider mb-6">
                        <RefreshCcw className="w-4 h-4" />
                        Cancellations
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
                        Refund Policy
                    </h1>
                    <p className="text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                        Our policy ensures fairness while managing event logistics. Please read carefully before registering.
                    </p>
                </motion.div>

                <div className="space-y-6">
                    {/* General Rule */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="bg-zinc-900/30 border border-white/10 rounded-2xl p-8 backdrop-blur-sm"
                    >
                        <h2 className="text-xl font-semibold text-white mb-4">Refund Eligibility</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-green-500/5 border border-green-500/10 rounded-xl p-6">
                                <div className="flex items-center gap-3 mb-3 text-green-400 font-medium">
                                    <CheckCircle2 className="w-5 h-5" /> Eligible for Refund
                                </div>
                                <ul className="space-y-2 text-zinc-400 text-sm">
                                    <li>• Event cancellation by ASTRA.</li>
                                    <li>• Duplicate payment for the same ticket.</li>
                                    <li>• Technical error during transaction.</li>
                                </ul>
                            </div>
                            <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-6">
                                <div className="flex items-center gap-3 mb-3 text-red-400 font-medium">
                                    <XCircle className="w-5 h-5" /> Not Eligible
                                </div>
                                <ul className="space-y-2 text-zinc-400 text-sm">
                                    <li>• Participant cancellation / No-show.</li>
                                    <li>• Schedule conflict on participant's end.</li>
                                    <li>• Late arrival to event.</li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>

                    {/* Timeline */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="bg-zinc-900/30 border border-white/10 rounded-2xl p-8 backdrop-blur-sm"
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 shrink-0">
                                <CalendarX className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-white mb-3">Processing Timeline</h2>
                                <p className="text-zinc-400 leading-relaxed">
                                    Approved refunds are processed within <strong>5-7 business days</strong>. The amount will be credited back to the original method of payment (Source Account).
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="bg-zinc-900/30 border border-white/10 rounded-2xl p-8 backdrop-blur-sm"
                    >
                        <h2 className="text-xl font-semibold text-white mb-3">How to Request</h2>
                        <p className="text-zinc-400 leading-relaxed mb-4">
                            To request a refund (for eligible cases), please email us with your <strong>Transaction ID</strong> and <strong>Event Name</strong>.
                        </p>
                        <a href="mailto:support@astraietm.in" className="inline-flex items-center gap-2 text-white bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl transition-all">
                            Email Support
                        </a>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default RefundPolicy;
