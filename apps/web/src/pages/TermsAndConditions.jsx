import React from 'react';
import FadeInUp from '../components/common/FadeInUp';
import CyberBackground from '../components/common/CyberBackground';
import { FileText, Shield, AlertCircle, Scale, Globe, Lock } from 'lucide-react';

const TermsAndConditions = () => {
    const sections = [
        {
            icon: Shield,
            title: "Eligibility",
            content: "You hereby represent and warrant that you have the right, power, and authority to agree to the Terms, to become a party to a legally binding agreement and to perform your obligations here under."
        },
        {
            icon: FileText,
            title: "Definitions",
            items: [
                {
                    term: "Payment Instrument",
                    definition: "includes credit card, debit card, bank account, prepaid payment instrument, Unified Payment Interface (UPI), Immediate Payment Service (IMPS) or any other methods of payments which shall be developed or added or deployed by banks and financial institutions from time to time."
                },
                {
                    term: "Platform",
                    definition: "refers to the website or platform where the Merchant offers its products or services and where the Transaction may be initiated."
                },
                {
                    term: "Transaction",
                    definition: "shall refer to the order or request placed by the User with the Merchant to purchase the products and/or services listed on the Platform by paying the Transaction Amount to the Merchant."
                },
                {
                    term: "Transaction Amount",
                    definition: "shall mean the amount paid by the User in connection with a Transaction."
                },
                {
                    term: "User/Users",
                    definition: "means any person availing the products and/or services offered on the Platform."
                },
                {
                    term: "Website",
                    definition: "shall mean www.instamojo.com or the mobile application."
                }
            ]
        },
        {
            icon: Lock,
            title: "Merchant's Rights",
            content: "You agree that we may collect, store, and share the information provided by you in order to deliver the products and/or services availed by you on our Platform and/or contact you in relation to the same."
        },
        {
            icon: AlertCircle,
            title: "Your Responsibilities",
            content: "You agree to provide us with true, complete and up-to-date information about yourself as may be required for the purpose of completing the Transactions. This information includes but is not limited to the personal details such as name, email address, phone number, delivery address, age, and gender (or any other information that we may deem necessary for us to fulfil the Transaction) as well as the accurate payment information required for the transaction."
        }
    ];

    const prohibitedActions = [
        "Systematically retrieve data or other content from the Platform to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.",
        "Make any unauthorized use of the Platform, including collecting usernames and/or email addresses of users by electronic or other means for the purpose of sending unsolicited email, or creating user accounts by automated means or under false pretenses.",
        "Circumvent, disable, or otherwise interfere with security-related features of the Platform, including features that prevent or restrict the use or copying of any Content or enforce limitations on the use of the Platform and/or the Content contained therein.",
        "Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords.",
        "Make improper use of our support services or submit false reports of abuse or misconduct.",
        "Engage in any automated use of the system, such as using scripts to send comments or messages, or using any data mining, robots, or similar data gathering and extraction tools.",
        "Interfere with, disrupt, or create an undue burden on the Platform or the networks or services connected to the Platform.",
        "Attempt to impersonate another user or person or use the username of another user.",
        "Use any information obtained from the Platform in order to harass, abuse, or harm another person.",
        "Use the Platform as part of any effort to compete with us or otherwise use the Platform and/or the Content for any revenue-generating endeavor or commercial enterprise.",
        "Decipher, decompile, disassemble, or reverse engineer any of the software comprising or in any way making up a part of the Platform.",
        "Attempt to bypass any measures of the Platform designed to prevent or restrict access to the Platform, or any portion of the Platform.",
        "Harass, annoy, intimidate, or threaten any of our employees or agents engaged in providing any portion of the Platform to you.",
        "Copy or adapt the Platform's software, including but not limited to Flash, PHP, HTML, JavaScript, or other code.",
        "Upload or transmit (or attempt to upload or to transmit) viruses, Trojan horses, or other material, including excessive use of capital letters and spamming (continuous posting of repetitive text), that interferes with any party's uninterrupted use and enjoyment of the Platform.",
        "Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Platform.",
        "Use the Platform in a manner inconsistent with any applicable laws or regulations."
    ];

    const reviewGuidelines = [
        "You should have firsthand experience with the person/entity being reviewed.",
        "Your reviews should not contain offensive profanity, or abusive, racist, offensive, or hate language.",
        "Your reviews should not contain discriminatory references based on religion, race, gender, national origin, age, marital status, sexual orientation, or disability.",
        "Your reviews should not contain references to illegal activity.",
        "You should not be affiliated with competitors if posting negative reviews.",
        "You should not make any conclusions as to the legality of conduct.",
        "You may not post any false or misleading statements.",
        "You may not organize a campaign encouraging others to post reviews, whether positive or negative."
    ];

    return (
        <div className="bg-background min-h-screen relative overflow-hidden">
            <CyberBackground />
            <div className="absolute inset-0 bg-background/90 pointer-events-none"></div>
            
            <div className="container mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-16 sm:pb-24 relative z-10">
                {/* Hero Section */}
                <div className="max-w-4xl mx-auto mb-16 sm:mb-24 text-center">
                    <FadeInUp>
                        <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                            <Scale className="w-5 h-5 text-primary" />
                            <span className="text-sm font-mono text-primary uppercase tracking-wider">Legal Agreement</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-medium text-white mb-6">
                            Terms and <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">Conditions</span>
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-400 font-light max-w-3xl mx-auto leading-relaxed">
                            By accessing this webpage, you are agreeing to be bound by these Terms and Conditions in a legally binding agreement between us and you.
                        </p>
                    </FadeInUp>
                </div>

                {/* Agreement Notice */}
                <div className="max-w-5xl mx-auto mb-12">
                    <FadeInUp delay={0.1}>
                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 sm:p-6">
                            <div className="flex items-start gap-4">
                                <AlertCircle className="w-6 h-6 text-primary shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-white font-display font-medium mb-2">Important Notice</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        Please read these Terms carefully before accessing or using the Website. If you do not agree to the Terms, you may not access the Platform. We reserve the right to update and change the Terms and Conditions by posting updates and changes to the Platform. You are advised to check the Terms and Conditions from time to time for any updates or changes that may impact you.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </FadeInUp>
                </div>

                {/* Main Sections */}
                <div className="max-w-5xl mx-auto space-y-8 mb-12">
                    {sections.map((section, index) => (
                        <FadeInUp key={index} delay={0.1 + index * 0.05}>
                            <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 sm:p-8 hover:border-primary/30 transition-colors duration-300">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                                        <section.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <h2 className="text-2xl sm:text-3xl font-display font-medium text-white mt-2">
                                        {section.title}
                                    </h2>
                                </div>
                                
                                {section.content && (
                                    <p className="text-gray-400 leading-relaxed ml-0 sm:ml-16">
                                        {section.content}
                                    </p>
                                )}
                                
                                {section.items && (
                                    <div className="space-y-4 ml-0 sm:ml-16">
                                        {section.items.map((item, idx) => (
                                            <div key={idx} className="border-l-2 border-primary/30 pl-4">
                                                <h4 className="text-white font-medium mb-1">{item.term}</h4>
                                                <p className="text-gray-400 text-sm leading-relaxed">{item.definition}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </FadeInUp>
                    ))}
                </div>

                {/* Prohibited Actions */}
                <div className="max-w-5xl mx-auto mb-12">
                    <FadeInUp delay={0.3}>
                        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 sm:p-8">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                                    <AlertCircle className="w-6 h-6 text-red-400" />
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-display font-medium text-white mt-2">
                                    Prohibited Actions
                                </h2>
                            </div>
                            
                            <p className="text-gray-400 mb-6 ml-0 sm:ml-16">
                                You may not access or use the Platform for any purpose other than that for which we make the Platform available. As a User of the Platform, you agree not to:
                            </p>
                            
                            <ul className="space-y-3 ml-0 sm:ml-16">
                                {prohibitedActions.map((action, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-gray-400 text-sm leading-relaxed">
                                        <span className="text-red-400 mt-1 shrink-0">×</span>
                                        <span>{action}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </FadeInUp>
                </div>

                {/* Limitation of Liability */}
                <div className="max-w-5xl mx-auto mb-12">
                    <FadeInUp delay={0.35}>
                        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 sm:p-8">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                                    <Shield className="w-6 h-6 text-primary" />
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-display font-medium text-white mt-2">
                                    Limitation of Liability
                                </h2>
                            </div>
                            
                            <p className="text-gray-400 leading-relaxed ml-0 sm:ml-16">
                                The User agrees that the only recourse that the User has in the event of receiving a defective product and/or deficiency in service or a product and/or service which does not match the provided description is to initiate the refund process which will be subject to the terms for refund under this agreement. We hereby expressly disclaim any liability to them for any losses. The User shall indemnify and hold harmless the Merchant and its affiliates, agents and representatives from and against any and all claims, demands, causes of action, obligations, liabilities, losses, damages, injuries, costs and expenses incurred or sustained by reason of or arising out of any breach or alleged breach of any of the terms herein by the User.
                            </p>
                        </div>
                    </FadeInUp>
                </div>

                {/* Review Guidelines */}
                <div className="max-w-5xl mx-auto mb-12">
                    <FadeInUp delay={0.4}>
                        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 sm:p-8">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                                    <FileText className="w-6 h-6 text-primary" />
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-display font-medium text-white mt-2">
                                    Guidelines for Reviews
                                </h2>
                            </div>
                            
                            <p className="text-gray-400 mb-6 ml-0 sm:ml-16">
                                We may provide you areas on the Platform to leave reviews or ratings. When posting a review, you must comply with the following criteria:
                            </p>
                            
                            <ul className="space-y-3 ml-0 sm:ml-16">
                                {reviewGuidelines.map((guideline, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-gray-400 text-sm leading-relaxed">
                                        <span className="text-primary mt-1 shrink-0">✓</span>
                                        <span>{guideline}</span>
                                    </li>
                                ))}
                            </ul>
                            
                            <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg ml-0 sm:ml-16">
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    We may accept, reject, or remove reviews in our sole discretion. We have absolutely no obligation to screen reviews or to delete reviews, even if anyone considers reviews objectionable or inaccurate. By posting a review, you hereby grant to us a perpetual, non-exclusive, worldwide, royalty-free, fully paid, assignable, and sublicensable right and license to reproduce, modify, translate, transmit by any means, display, perform and/or distribute all content relating to reviews.
                                </p>
                            </div>
                        </div>
                    </FadeInUp>
                </div>

                {/* Governing Laws */}
                <div className="max-w-5xl mx-auto mb-12">
                    <FadeInUp delay={0.45}>
                        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 sm:p-8">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                                    <Globe className="w-6 h-6 text-primary" />
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-display font-medium text-white mt-2">
                                    Governing Laws & Dispute Resolution
                                </h2>
                            </div>
                            
                            <div className="space-y-4 ml-0 sm:ml-16 text-gray-400 leading-relaxed">
                                <p>
                                    Please note that these terms of use, their subject matter and their formation, are governed by the laws of India. You and we both agree that the courts of India will have exclusive jurisdiction over any dispute.
                                </p>
                                <p>
                                    Any dispute or claim arising out of or in connection with or relating to these Terms or their breach, termination or invalidity hereof ("Dispute") shall be referred to and finally resolved by arbitration in Bengaluru in accordance with the Arbitration and Conciliation Act, 1996 for the time being in force, which rules are deemed to be incorporated by reference in this clause.
                                </p>
                                <p>
                                    Within 30 (thirty) days of the issue of a notice of Dispute, the parties shall mutually agree on the appointment of a sole arbitrator. The seat of arbitration shall be India and the arbitration proceedings shall be conducted in the English language. The parties shall keep the arbitration confidential and not disclose to any person, other than those necessary to the proceedings, any information, transcripts or award unless required to do so by law.
                                </p>
                            </div>
                        </div>
                    </FadeInUp>
                </div>

                {/* Disclaimer */}
                <div className="max-w-5xl mx-auto">
                    <FadeInUp delay={0.5}>
                        <div className="bg-gradient-to-br from-primary/10 to-cyan-500/10 border border-primary/30 rounded-xl p-6 sm:p-8">
                            <h2 className="text-2xl sm:text-3xl font-display font-medium text-white mb-6">
                                Disclaimer
                            </h2>
                            
                            <div className="space-y-4 text-gray-300 text-sm leading-relaxed">
                                <p>
                                    Upon initiating a Transaction, you as a User are entering into a legally binding and enforceable contract with us to purchase the products and/or services, and you shall pay the price as listed on the Platform through legitimate and legal sources of funds and through the accepted Payment Instruments.
                                </p>
                                <p>
                                    You shall provide accurate payment details to the secure payment system for making purchase on the Platform. The information provided by you may be utilized or shared with any third party if required in relation to fraud verifications or by law, regulation or court order. We expressly disclaim all liabilities that may arise as a consequence of any unauthorized use of a User's Payment Instrument.
                                </p>
                                <p>
                                    All payments undertaken by you are subject to your own risk and volition. We shall not be liable for any loss or damage occurred to you arising directly or indirectly due to the decline of authorization for any Transaction, malfunction, errors and/or unscrupulous activities.
                                </p>
                                <p>
                                    The content on our Platform is provided for general information only. The information provided does not amount to advice from us in any manner and should not be relied upon. Where our Platform contains links to other websites and resources provided by third parties, these links are provided for your information only.
                                </p>
                            </div>
                        </div>
                    </FadeInUp>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;
