import React, { useState } from 'react';
import { Shield, Github, Instagram, ArrowRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative bg-[#050505] border-t border-white/5 pt-20 pb-10 overflow-hidden font-sans">

            {/* Premium background noise */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

            <div className="container mx-auto px-6 md:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 mb-16">

                    {/* Brand Section */}
                    <div className="lg:w-1/3">
                        <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 group-hover:border-white/20 transition-all duration-300">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-white">ASTRA</span>
                        </Link>

                        <p className="text-base text-neutral-400 leading-relaxed mb-8 max-w-sm">
                            Securing the digital frontier through innovation, elite research, and next-gen defense systems.
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-4">
                            {[
                                { Icon: Github, href: "https://github.com/astraietm", label: "GitHub" },
                                { Icon: Instagram, href: "https://instagram.com/astra.ietm", label: "Instagram" }
                            ].map(({ Icon, href, label }, i) => (
                                <a
                                    key={i}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-neutral-400 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all duration-300"
                                >
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Grid - 2 Col static on mobile, 3 Col on Desktop */}
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">

                        {/* Platform */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Platform</h3>
                            <ul className="space-y-3">
                                <li>
                                    <Link to="/events" className="text-sm text-neutral-400 hover:text-white transition-colors">
                                        Events
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/gallery" className="text-sm text-neutral-400 hover:text-white transition-colors">
                                        Gallery
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Organization */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Company</h3>
                            <ul className="space-y-3">
                                <li>
                                    <Link to="/about" className="text-sm text-neutral-400 hover:text-white transition-colors">
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/contact" className="text-sm text-neutral-400 hover:text-white transition-colors">
                                        Contact
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Legal */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Legal</h3>
                            <ul className="space-y-3">
                                <li>
                                    <Link to="/terms" className="text-sm text-neutral-400 hover:text-white transition-colors">
                                        Terms
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/refund-policy" className="text-sm text-neutral-400 hover:text-white transition-colors">
                                        Refund Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/privacy" className="text-sm text-neutral-400 hover:text-white transition-colors">
                                        Privacy Policy
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-neutral-500">
                        © {currentYear} Astra Security. All rights reserved.
                    </p>

                    <div className="flex items-center gap-6 text-sm text-neutral-500">
                        <Link to="/privacy" className="hover:text-neutral-300 transition-colors">Privacy</Link>
                        <Link to="/terms" className="hover:text-neutral-300 transition-colors">Terms</Link>
                        <span>Designed by Astra</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
