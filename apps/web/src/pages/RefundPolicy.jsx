import React from 'react';
import FadeInUp from '../components/common/FadeInUp';
import CyberBackground from '../components/common/CyberBackground';
import { RefreshCw, Clock, Mail, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const RefundPolicy = () => {
    return (
        <div className="bg-background min-h-screen relative overflow-hidden">
            <CyberBackground />
            <div className="absolute inset-0 bg-background/90 pointer-events-none"></div>
            
            <div className="container mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-16 sm:pb-24 relative z-10">
                {/* Hero Section */}
                <div className="max-w-4xl mx-auto mb-16 sm:mb-24 text-center">
                    <FadeInUp>
                        <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                            <RefreshCw className="w-5 h-5 text-primary" />
                            <span className="text-sm font-mono text-primary uppercase tracking-wider">Policy Document</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-medium text-white mb-6">
                            Refund & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">Cancellation</span>
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-400 font-light max-w-3xl mx-auto leading-relaxed">
                            Our commitment to fair and transparent refund and cancellation processes.
                        </p>
                    </FadeInUp>
                </div>

                {/* Cancellation Policy */}
                <div className="max-w-5xl mx-auto mb-12">
                    <FadeInUp delay={0.1}>
                        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 sm:p-8 hover:border-primary/30 transition-colors duration-300">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                                    <XCircle className="w-6 h-6 text-primary" />
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-display font-medium text-white mt-2">
                                    Cancellation Policy
                                </h2>
                            </div>
                            
                            <div className="ml-0 sm:ml-16 space-y-4 text-gray-400 leading-relaxed">
                                <p>
                                    Upon completing a Transaction, you are entering into a legally binding and enforceable agreement with us to purchase the product and/or service. After this point the User may cancel the Transaction unless it has been specifically provided for on the Platform.
                                </p>
                                <p>
                                    In which case, the cancellation will be subject to the terms mentioned on the Platform. We shall retain the discretion in approving any cancellation requests and we may ask for additional details before approving any requests.
                                </p>
                            </div>

                            <div className="mt-6 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-lg ml-0 sm:ml-16">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-1" />
                                    <div>
                                        <h4 className="text-yellow-400 font-medium mb-1">Important Note</h4>
                                        <p className="text-gray-400 text-sm leading-relaxed">
                                            Cancellation requests are subject to approval and may require additional verification before processing.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeInUp>
                </div>

                {/* Refund Policy */}
                <div className="max-w-5xl mx-auto mb-12">
                    <FadeInUp delay={0.2}>
                        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 sm:p-8 hover:border-primary/30 transition-colors duration-300">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                                    <CheckCircle className="w-6 h-6 text-primary" />
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-display font-medium text-white mt-2">
                                    Refund Policy
                                </h2>
                            </div>
                            
                            <div className="ml-0 sm:ml-16 space-y-4 text-gray-400 leading-relaxed">
                                <p>
                                    Once you have received the product and/or service, the only event where you can request for a replacement or a return and a refund is if the product and/or service does not match the description as mentioned on the Platform.
                                </p>
                            </div>
                        </div>
                    </FadeInUp>
                </div>

                {/* Time Limit */}
                <div className="max-w-5xl mx-auto mb-12">
                    <FadeInUp delay={0.25}>
                        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 sm:p-8 hover:border-primary/30 transition-colors duration-300">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                                    <Clock className="w-6 h-6 text-primary" />
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-display font-medium text-white mt-2">
                                    Time Limit for Refund Requests
                                </h2>
                            </div>
                            
                            <div className="ml-0 sm:ml-16">
                                <p className="text-gray-400 leading-relaxed mb-6">
                                    Any request for refund must be submitted within three days from the date of the Transaction or such number of days prescribed on the Platform, which shall in no event be less than three days.
                                </p>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                                <span className="text-primary font-bold text-sm">1</span>
                                            </div>
                                            <h4 className="text-white font-medium">Standard Period</h4>
                                        </div>
                                        <p className="text-gray-400 text-sm">Minimum 3 days from transaction date</p>
                                    </div>

                                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                                <span className="text-primary font-bold text-sm">2</span>
                                            </div>
                                            <h4 className="text-white font-medium">Extended Period</h4>
                                        </div>
                                        <p className="text-gray-400 text-sm">As specified on the Platform</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeInUp>
                </div>

                {/* How to Request a Refund */}
                <div className="max-w-5xl mx-auto mb-12">
                    <FadeInUp delay={0.3}>
                        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 sm:p-8 hover:border-primary/30 transition-colors duration-300">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                                    <Mail className="w-6 h-6 text-primary" />
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-display font-medium text-white mt-2">
                                    How to Request a Refund
                                </h2>
                            </div>
                            
                            <div className="ml-0 sm:ml-16 space-y-6">
                                <p className="text-gray-400 leading-relaxed">
                                    A User may submit a claim for a refund for a purchase made by following these steps:
                                </p>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-4 p-4 bg-background/50 border border-white/5 rounded-lg">
                                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                            <span className="text-primary font-bold text-sm">1</span>
                                        </div>
                                        <div>
                                            <h4 className="text-white font-medium mb-1">Raise a Ticket</h4>
                                            <p className="text-gray-400 text-sm">Contact us through our support system or raise a ticket on the Platform</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 bg-background/50 border border-white/5 rounded-lg">
                                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                            <span className="text-primary font-bold text-sm">2</span>
                                        </div>
                                        <div>
                                            <h4 className="text-white font-medium mb-1">Email Support</h4>
                                            <p className="text-gray-400 text-sm mb-2">Send an email to:</p>
                                            <a 
                                                href="mailto:seller+c0cae7d9708d4caaa2dd2b592ddfd3fd@instamojo.com" 
                                                className="text-primary hover:text-cyan-400 transition-colors text-sm break-all"
                                            >
                                                seller+c0cae7d9708d4caaa2dd2b592ddfd3fd@instamojo.com
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-4 bg-background/50 border border-white/5 rounded-lg">
                                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                            <span className="text-primary font-bold text-sm">3</span>
                                        </div>
                                        <div>
                                            <h4 className="text-white font-medium mb-1">Provide Details</h4>
                                            <p className="text-gray-400 text-sm">Include a clear and specific reason for the refund request, the exact terms that have been violated, and any supporting proof if required</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        <span className="text-white font-medium">Note:</span> Whether a refund will be provided will be determined by us, and we may ask for additional details before approving any requests.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </FadeInUp>
                </div>

                {/* Grievance Redressal */}
                <div className="max-w-5xl mx-auto">
                    <FadeInUp delay={0.35}>
                        <div className="bg-gradient-to-br from-primary/10 to-cyan-500/10 border border-primary/30 rounded-xl p-6 sm:p-8">
                            <h2 className="text-2xl sm:text-3xl font-display font-medium text-white mb-6">
                                Grievance Redressal
                            </h2>
                            
                            <div className="space-y-4 text-gray-300 leading-relaxed">
                                <p>
                                    You agree that if you have any question or complaint with regard to any product and/or service availed on our Platform, or pertaining to the Transaction, including but not limited to:
                                </p>
                                
                                <ul className="space-y-2 ml-6">
                                    <li className="flex items-start gap-3">
                                        <span className="text-primary mt-1 shrink-0">•</span>
                                        <span>Double debit of Transaction Amount</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-primary mt-1 shrink-0">•</span>
                                        <span>Fraudulent Transaction</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-primary mt-1 shrink-0">•</span>
                                        <span>Unauthorized Transaction</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-primary mt-1 shrink-0">•</span>
                                        <span>Refund requests</span>
                                    </li>
                                </ul>

                                <p className="pt-4">
                                    You may reach out to us through the contact information provided on the Platform or via the support channels mentioned above.
                                </p>
                            </div>
                        </div>
                    </FadeInUp>
                </div>
            </div>
        </div>
    );
};

export default RefundPolicy;
