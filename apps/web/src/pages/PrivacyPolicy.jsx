import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, Database, Cookie, Share2, Mail } from 'lucide-react';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-black text-white pt-32 pb-20 selection:bg-green-500/30">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-green-900/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-900/5 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03]" />
            </div>

            <div className="container mx-auto px-4 relative z-10 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-xs font-medium uppercase tracking-wider mb-6">
                        <Lock className="w-4 h-4" />
                        Data Protection
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
                        Privacy Policy
                    </h1>
                    <p className="text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                        We value your privacy. This policy outlines how ASTRA collects, uses, and protects your information.
                    </p>
                </motion.div>

                <div className="space-y-6">
                    {/* Data Collection */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="bg-zinc-900/30 border border-white/10 rounded-2xl p-8 backdrop-blur-sm"
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 shrink-0">
                                <Database className="w-6 h-6 text-green-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-white mb-3">Information We Collect</h2>
                                <p className="text-zinc-400 leading-relaxed mb-4">
                                    We collect minimal data necessary for event registration and communication:
                                </p>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-zinc-400 text-sm">
                                    <li className="flex items-center gap-2"><span className="w-1 h-1 bg-green-500 rounded-full"></span> Full Name</li>
                                    <li className="flex items-center gap-2"><span className="w-1 h-1 bg-green-500 rounded-full"></span> Email Address</li>
                                    <li className="flex items-center gap-2"><span className="w-1 h-1 bg-green-500 rounded-full"></span> Phone Number</li>
                                    <li className="flex items-center gap-2"><span className="w-1 h-1 bg-green-500 rounded-full"></span> Payment Status (via Razorpay)</li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>

                    {/* How we use data */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="bg-zinc-900/30 border border-white/10 rounded-2xl p-8 backdrop-blur-sm"
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 shrink-0">
                                <Eye className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-white mb-3">How We Use Data</h2>
                                <ul className="space-y-2 text-zinc-400">
                                    <li>• To process your event registration and issue tickets.</li>
                                    <li>• To communicate event schedules, updates, and changes.</li>
                                    <li>• To verify student identity for restricted events.</li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>

                    {/* Third Party */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="bg-zinc-900/30 border border-white/10 rounded-2xl p-8 backdrop-blur-sm"
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 shrink-0">
                                <Share2 className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-white mb-3">Third-Party Disclosure</h2>
                                <p className="text-zinc-400 leading-relaxed">
                                    We do not sell, trade, or transfer your personal data to outside parties. This does not include trusted third parties like <strong>Razorpay</strong> (for payment processing) who agree to keep this information confidential.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Cookies */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                        className="bg-zinc-900/30 border border-white/10 rounded-2xl p-8 backdrop-blur-sm"
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 shrink-0">
                                <Cookie className="w-6 h-6 text-orange-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-white mb-3">Cookies</h2>
                                <p className="text-zinc-400 leading-relaxed">
                                    We use cookies solely for session management and to improve website performance (e.g., keeping you logged in). We do not use cookies for invasive ad tracking.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-12 text-center">
                    <p className="text-zinc-500 text-sm">
                        Questions? Contact our Data Officer at <a href="mailto:support@astraietm.in" className="text-white hover:underline transition-colors">support@astraietm.in</a>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
