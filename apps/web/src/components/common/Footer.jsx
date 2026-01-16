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
                className="flex items-center justify-between w-full py-2 md:hidden group"
            >
                <h3 className="font-display font-bold text-white group-hover:text-primary transition-colors">{title}</h3>
                <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`}
                />
            </button>

            {/* Desktop Header */}
            <h3 className="font-display font-bold text-white mb-6 hidden md:block">{title}</h3>

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
        <footer className="relative bg-[#050505] border-t border-white/5 pt-20 pb-10 overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent shadow-[0_0_50px_rgba(0,224,255,0.3)]"></div>
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">
                    
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-5 flex flex-col items-center md:items-start text-center md:text-left">
                        <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
                            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 group-hover:border-primary/50 group-hover:shadow-[0_0_20px_rgba(0,224,255,0.2)] transition-all duration-500">
                                <Shield className="w-5 h-5 text-white group-hover:text-primary transition-colors" />
                            </div>
                            <span className="text-2xl font-display font-bold tracking-widest text-white group-hover:tracking-[0.2em] transition-all duration-500">ASTRA</span>
                        </Link>
                        
                        <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-8 font-light">
                            Securing the digital frontier through innovation, education, and elite research. Join the next generation of defenders.
                        </p>

                        <div className="flex gap-4">
                            {[
                                { Icon: Github, href: "https://github.com/astraietm" },
                                { Icon: Instagram, href: "https://instagram.com/astra.ietm" }
                            ].map(({ Icon, href }, i) => (
                                <a 
                                    key={i} 
                                    href={href} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white hover:border-white/20 hover:scale-110 transition-all duration-300"
                                >
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Column 1 */}
                    <div className="col-span-1 md:col-span-3 md:col-start-8">
                        <FooterSection title="Platform">
                            <ul className="space-y-2">
                                <li>
                                    <Link to="/events" className="text-sm text-gray-500 hover:text-primary hover:translate-x-1 transition-all duration-300 inline-block py-1">
                                        Events
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/gallery" className="text-sm text-gray-500 hover:text-primary hover:translate-x-1 transition-all duration-300 inline-block py-1">
                                        Gallery
                                    </Link>
                                </li>
                            </ul>
                        </FooterSection>
                    </div>

                    {/* Links Column 2 */}
                    <div className="col-span-1 md:col-span-2">
                        <FooterSection title="Organization">
                            <ul className="space-y-2">
                                <li>
                                    <Link to="/about" className="text-sm text-gray-500 hover:text-primary hover:translate-x-1 transition-all duration-300 inline-block py-1">
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/contact" className="text-sm text-gray-500 hover:text-primary hover:translate-x-1 transition-all duration-300 inline-block py-1">
                                        Contact Us
                                    </Link>
                                </li>
                            </ul>
                        </FooterSection>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-gray-600 lg:pl-72">
                    <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                        <span>© {currentYear} Astra Security</span>
                        <a href="#" className="hover:text-primary/70 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-primary/70 transition-colors">Terms</a>
                    </div>
                    


                    <div className="flex items-center gap-1">
                         Designed by <span className="text-gray-400 font-bold ml-1">Astra</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
