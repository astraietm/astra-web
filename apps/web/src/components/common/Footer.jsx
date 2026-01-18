import React, { useState } from 'react';
import { Shield, Github, Instagram, ArrowRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const FooterSection = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="w-full">
            {/* Mobile Header */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full py-3 md:hidden group"
            >
                <h3 className="text-sm font-medium text-neutral-400 group-hover:text-white transition-colors uppercase tracking-wider">{title}</h3>
                <ChevronDown
                    className={`w-4 h-4 text-neutral-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-white' : ''}`}
                />
            </button>

            {/* Desktop Header */}
            <h3 className="text-sm font-medium text-neutral-500 mb-4 hidden md:block uppercase tracking-wider">{title}</h3>

            {/* Content */}
            <div className="hidden md:block">
                {children}
            </div>

            {/* Mobile Content */}
            <div
                className={`overflow-hidden md:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="pb-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative bg-[#050505] border-t border-white/10 pt-24 pb-12 overflow-hidden">
            
            {/* Subtle Grid Background */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.02]" 
                 style={{
                   backgroundImage: `
                     linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                     linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
                   `,
                   backgroundSize: '80px 80px'
                 }}
            />

            <div className="container mx-auto px-6 md:px-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-12">
                    
                    {/* Brand Section - Aura Style */}
                    <div className="col-span-1 md:col-span-4">
                        <Link to="/" className="inline-flex items-center gap-2.5 mb-6 group">
                            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 border border-white/10 group-hover:border-white/20 transition-all duration-300">
                                <Shield className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-white">ASTRA</span>
                        </Link>
                        
                        <p className="text-sm text-neutral-500 leading-relaxed max-w-xs mb-8">
                            Securing the digital frontier through innovation, education, and elite research. Join the next generation of defenders.
                        </p>

                        {/* Social Links - Aura Style */}
                        <div className="flex gap-3">
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
                                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all duration-300"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Spacer */}
                    <div className="hidden md:block md:col-span-2"></div>

                    {/* Links Column 1 - Platform */}
                    <div className="col-span-1 md:col-span-2">
                        <FooterSection title="Platform">
                            <ul className="space-y-3">
                                <li>
                                    <Link to="/events" className="text-sm text-neutral-400 hover:text-white transition-colors inline-block">
                                        Events
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/gallery" className="text-sm text-neutral-400 hover:text-white transition-colors inline-block">
                                        Gallery
                                    </Link>
                                </li>
                            </ul>
                        </FooterSection>
                    </div>

                    {/* Links Column 2 - Organization */}
                    <div className="col-span-1 md:col-span-2">
                        <FooterSection title="Organization">
                            <ul className="space-y-3">
                                <li>
                                    <Link to="/about" className="text-sm text-neutral-400 hover:text-white transition-colors inline-block">
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/contact" className="text-sm text-neutral-400 hover:text-white transition-colors inline-block">
                                        Contact Us
                                    </Link>
                                </li>
                            </ul>
                        </FooterSection>
                    </div>

                    {/* Links Column 3 - Legal */}
                    <div className="col-span-1 md:col-span-2">
                        <FooterSection title="Legal">
                            <ul className="space-y-3">
                                <li>
                                    <Link to="/terms" className="text-sm text-neutral-400 hover:text-white transition-colors inline-block">
                                        Terms & Conditions
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/refund-policy" className="text-sm text-neutral-400 hover:text-white transition-colors inline-block">
                                        Refund Policy
                                    </Link>
                                </li>
                            </ul>
                        </FooterSection>
                    </div>
                </div>

                {/* Bottom Bar - Aura Style */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex flex-wrap justify-center md:justify-start gap-6 text-xs text-neutral-600">
                        <span>© {currentYear} Astra Security</span>
                        <Link to="/terms" className="hover:text-neutral-400 transition-colors">Terms</Link>
                        <Link to="/refund-policy" className="hover:text-neutral-400 transition-colors">Refund Policy</Link>
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-xs text-neutral-600">
                        Designed by <span className="text-neutral-400 font-medium">Astra</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
