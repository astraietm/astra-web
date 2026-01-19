import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Shield, Users, CreditCard, Scale, AlertOctagon } from 'lucide-react';

const TermsAndConditions = () => {
    const sections = [
        {
            icon: Users,
            title: "Eligibility",
            content: "Participation in ASTRA events is open to students and professionals. By registering, you confirm you are at least 13 years of age. Participants under 18 require parental consent. We reserve the right to verify student identity via college ID cards."
        },
        {
            icon: CreditCard,
            title: "Payment Terms",
            content: "All event registrations must be paid in full via our secure payment gateway (Razorpay). Prices are listed in INR. We accept UPI, Cards, and Net Banking. Registration is confirmed only upon successful payment capture."
        },
        {
            icon: Shield,
            title: "Code of Conduct",
            content: "ASTRA fosters an inclusive and professional environment. Harassment, discrimination, or disruptive behavior during events will result in immediate disqualification and removal without refund. All participants must adhere to campus regulations."
        },
        {
            icon: FileText,
            title: "Intellectual Property",
            content: "Content presented during workshops and hackathons remains the property of ASTRA or the respective speakers. Recording or distributing event materials without explicit permission is prohibited."
        },
        {
            icon: AlertOctagon,
            title: "Limitation of Liability",
            content: "ASTRA is a student-run non-profit. We are not liable for personal injury, lost property, or incidental damages occurring during physical events. Participation is at your own risk."
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white pt-32 pb-20 selection:bg-blue-500/30">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-900/5 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
            </div>

            <div className="container mx-auto px-4 relative z-10 max-w-4xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-xs font-medium uppercase tracking-wider mb-6">
                        <Scale className="w-4 h-4" />
                        Usage Agreement
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
                        Terms & Conditions
                    </h1>
                    <p className="text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                        By accessing astraietm.in and registering for our events, you agree to be bound by these terms.
                    </p>
                    <p className="text-xs text-zinc-600 mt-4">Last Updated: January 19, 2026</p>
                </motion.div>

                {/* Content */}
                <div className="grid gap-6">
                    {/* Introduction */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-zinc-900/30 border border-white/10 rounded-2xl p-8 backdrop-blur-sm"
                    >
                        <h2 className="text-xl font-semibold text-white mb-4">1. Introduction</h2>
                        <p className="text-zinc-400 leading-relaxed">
                            ASTRA (Association of Students for Technology & Research Advancement) is a student community dedicated to technical growth. This website serves as a platform for event registrations and community updates.
                        </p>
                    </motion.div>

                    {/* Dynamic Sections */}
                    {sections.map((section, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + (index * 0.05) }}
                            className="bg-zinc-900/30 border border-white/10 rounded-2xl p-8 backdrop-blur-sm group hover:border-white/20 transition-colors"
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-xl bg-white/5 border border-white/10 shrink-0 group-hover:bg-white/10 transition-colors">
                                    <section.icon className="w-5 h-5 text-zinc-300" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-white mb-3">{index + 2}. {section.title}</h2>
                                    <p className="text-zinc-400 leading-relaxed">
                                        {section.content}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {/* Jurisdiction */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-zinc-900/30 border border-white/10 rounded-2xl p-8 backdrop-blur-sm"
                    >
                        <h2 className="text-xl font-semibold text-white mb-4">Governing Law</h2>
                        <p className="text-zinc-400 leading-relaxed">
                            These Terms shall be governed by and defined following the laws of India. ASTRA and yourself irrevocably consent that the courts of India shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;
