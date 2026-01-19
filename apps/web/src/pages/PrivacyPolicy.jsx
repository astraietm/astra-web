import React from 'react';
import FadeInUp from '../components/common/FadeInUp';
import CyberBackground from '../components/common/CyberBackground';
import { Shield, Lock, Eye, Server, Globe, Mail } from 'lucide-react';

const PrivacyPolicy = () => {
    return (
        <div className="bg-background min-h-screen relative overflow-hidden">
            <CyberBackground />
            <div className="absolute inset-0 bg-background/90 pointer-events-none"></div>
            
            <div className="container mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-16 sm:pb-24 relative z-10">
                {/* Hero Section */}
                <div className="max-w-4xl mx-auto mb-16 sm:mb-24 text-center">
                    <FadeInUp>
                        <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                            <Shield className="w-5 h-5 text-primary" />
                            <span className="text-sm font-mono text-primary uppercase tracking-wider">Legal Document</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-medium text-white mb-6">
                            Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">Policy</span>
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-400 font-light max-w-3xl mx-auto leading-relaxed">
                            We are committed to protecting your personal information and your right to privacy.
                        </p>
                    </FadeInUp>
                </div>

                {/* Information We Collect */}
                <div className="max-w-5xl mx-auto mb-12">
                    <FadeInUp delay={0.1}>
                        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 sm:p-8 hover:border-primary/30 transition-colors duration-300">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                                    <Eye className="w-6 h-6 text-primary" />
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-display font-medium text-white mt-2">
                                    Information We Collect
                                </h2>
                            </div>
                            
                            <div className="ml-0 sm:ml-16 space-y-4 text-gray-400 leading-relaxed">
                                <p>
                                    We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, when you participate in activities on the website or otherwise when you contact us.
                                </p>
                                <ul className="list-disc pl-5 space-y-2 mt-4">
                                    <li>Names and Contact Data (email addresses, phone numbers, etc.)</li>
                                    <li>Credentials (passwords, hints, and similar security information)</li>
                                    <li>Payment Data (data necessary to process your payment if you make purchases)</li>
                                </ul>
                            </div>
                        </div>
                    </FadeInUp>
                </div>

                {/* How We Use Information */}
                <div className="max-w-5xl mx-auto mb-12">
                    <FadeInUp delay={0.2}>
                        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 sm:p-8 hover:border-primary/30 transition-colors duration-300">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                                    <Server className="w-6 h-6 text-primary" />
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-display font-medium text-white mt-2">
                                    How We Use Your Information
                                </h2>
                            </div>
                            
                            <div className="ml-0 sm:ml-16 space-y-4 text-gray-400 leading-relaxed">
                                <p>
                                    We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
                                </p>
                                <div className="grid sm:grid-cols-2 gap-4 mt-6">
                                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                                        <h4 className="text-white font-medium mb-2">Account Handling</h4>
                                        <p className="text-sm">To facilitate account creation and logon process.</p>
                                    </div>
                                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                                        <h4 className="text-white font-medium mb-2">Communication</h4>
                                        <p className="text-sm">To send you marketing and promotional communications.</p>
                                    </div>
                                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                                        <h4 className="text-white font-medium mb-2">Security</h4>
                                        <p className="text-sm">To protect our Services and for fraud monitoring/prevention.</p>
                                    </div>
                                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                                        <h4 className="text-white font-medium mb-2">Improvement</h4>
                                        <p className="text-sm">To enforce our terms, conditions and policies for business purposes.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeInUp>
                </div>

                {/* Sharing Information */}
                <div className="max-w-5xl mx-auto mb-12">
                    <FadeInUp delay={0.3}>
                        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 sm:p-8 hover:border-primary/30 transition-colors duration-300">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                                    <Globe className="w-6 h-6 text-primary" />
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-display font-medium text-white mt-2">
                                    Sharing Your Information
                                </h2>
                            </div>
                            
                            <div className="ml-0 sm:ml-16 text-gray-400 leading-relaxed">
                                <p className="mb-4">
                                    We may process or share your data that we hold based on the following legal basis:
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <span className="text-primary mt-1">•</span>
                                        <span><strong>Consent:</strong> We may process your data if you have given us specific consent to use your personal information for a specific purpose.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-primary mt-1">•</span>
                                        <span><strong>Legitimate Interests:</strong> We may process your data when it is reasonably necessary to achieve our legitimate business interests.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-primary mt-1">•</span>
                                        <span><strong>Legal Obligations:</strong> We may disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </FadeInUp>
                </div>

                {/* Data Security */}
                <div className="max-w-5xl mx-auto mb-12">
                    <FadeInUp delay={0.4}>
                        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 sm:p-8 hover:border-primary/30 transition-colors duration-300">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                                    <Lock className="w-6 h-6 text-primary" />
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-display font-medium text-white mt-2">
                                    Data Security
                                </h2>
                            </div>
                            
                            <div className="ml-0 sm:ml-16 text-gray-400 leading-relaxed">
                                <p>
                                    We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure. Although we will do our best to protect your personal information, transmission of personal information to and from our website is at your own risk. You should only access the services within a secure environment.
                                </p>
                            </div>
                        </div>
                    </FadeInUp>
                </div>

                {/* Contact Us */}
                <div className="max-w-5xl mx-auto">
                    <FadeInUp delay={0.5}>
                        <div className="bg-gradient-to-br from-primary/10 to-cyan-500/10 border border-primary/30 rounded-xl p-6 sm:p-8">
                            <div className="flex items-center gap-4 mb-6">
                                <Mail className="w-6 h-6 text-primary" />
                                <h2 className="text-2xl sm:text-3xl font-display font-medium text-white">
                                    Contact Us
                                </h2>
                            </div>
                            
                            <div className="text-gray-300 leading-relaxed">
                                <p className="mb-4">
                                    If you have questions or comments about this policy, you may email us at:
                                </p>
                                <a 
                                    href="mailto:contact@astra.ietm" 
                                    className="text-primary hover:text-cyan-400 transition-colors text-lg font-medium"
                                >
                                    contact@astraietm.com
                                </a>
                            </div>
                        </div>
                    </FadeInUp>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
