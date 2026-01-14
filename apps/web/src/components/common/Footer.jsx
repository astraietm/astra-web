import React, { useState } from 'react';
import { Shield, Github, Twitter, Linkedin, ArrowRight, ChevronDown } from 'lucide-react';
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
    <footer className="bg-background border-t border-white/5 pt-12 md:pt-20 pb-8 md:pb-10">
      <div className="mx-auto w-full max-w-screen-xl px-4 md:px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-8 md:gap-8 mb-12 md:mb-16">
            
            {/* Brand Section - Horizontal on Mobile, Vertical on Desktop */}
            <div className="col-span-1 md:col-span-2 lg:col-span-2 flex flex-col items-center md:items-start mb-6 md:mb-0">
                <div className="flex w-full items-center justify-between md:justify-start md:gap-2 mb-4 md:mb-6">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                            <Shield className="w-4 h-4" />
                        </div>
                        <span className="font-display font-bold tracking-widest text-white text-xl">ASTRA</span>
                    </Link>
                    
                    {/* Socials - Right aligned on mobile header line */}
                    <div className="flex gap-4 md:hidden">
                        {[Github, Twitter, Linkedin].map((Icon, i) => (
                            <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
                                <Icon className="w-5 h-5"/>
                            </a>
                        ))}
                    </div>
                </div>
                
                {/* Socials - Visible on Desktop under logo */}
                <div className="hidden md:flex gap-4 mb-6">
                    {[Github, Twitter, Linkedin].map((Icon, i) => (
                        <a key={i} href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
                            <Icon className="w-4 h-4"/>
                        </a>
                    ))}
                </div>

                {/* Description - Visible on Mobile too now? No, keep hidden to save space or show if spacious */}
                <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-xs text-center md:text-left">
                    Securing the digital frontier through innovation, education, and elite research. Join the next generation of defenders.
                </p>
            </div>

            {/* Links Sections - Collapsible on Mobile */}
            <div className="col-span-1 md:col-span-1 border-t border-white/5 md:border-none pt-4 md:pt-0">
                <FooterSection title="Platform">
                    <ul className="space-y-4 text-sm text-gray-500 text-center md:text-left">
                        <li><Link to="/events" className="hover:text-primary transition-colors block py-1">Events</Link></li>
                        <li><Link to="/gallery" className="hover:text-primary transition-colors block py-1">Gallery</Link></li>

                        <li><a href="#" className="hover:text-primary transition-colors block py-1">CTF Portal</a></li>
                    </ul>
                </FooterSection>
            </div>

            <div className="col-span-1 md:col-span-1 border-t border-white/5 md:border-none pt-4 md:pt-0">
                 <FooterSection title="Organization">
                    <ul className="space-y-4 text-sm text-gray-500 text-center md:text-left">
                        <li><Link to="/about" className="hover:text-primary transition-colors block py-1">About Us</Link></li>
                        <li><a href="#" className="hover:text-primary transition-colors block py-1">Team</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors block py-1">Partners</a></li>
                        <li><Link to="/contact" className="hover:text-primary transition-colors block py-1">Contact</Link></li>
                    </ul>
                </FooterSection>
            </div>

            {/* Newsletter - Always Visible */}
            <div className="col-span-1 md:col-span-4 lg:col-span-2 mt-6 lg:mt-0 text-center md:text-left border-t border-white/5 md:border-none pt-8 md:pt-0">
                 <h3 className="font-display font-bold text-white mb-4">Stay Updated</h3>
                 <p className="text-gray-500 text-sm mb-4 max-w-xs mx-auto md:mx-0">Subscribe to our secure frequency for the latest intel.</p>
                 <form className="flex gap-2 max-w-sm mx-auto md:mx-0" onSubmit={(e) => e.preventDefault()}>
                    <input 
                        type="email" 
                        placeholder="Email for updates" 
                        className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 w-full"
                    />
                    <button className="bg-primary text-black font-bold rounded-lg px-4 py-3 hover:bg-primary/90 transition-colors">
                        <ArrowRight className="w-5 h-5" />
                    </button>
                 </form>
            </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-xs text-gray-600">
            <div className="flex gap-8 mb-4 md:mb-0">
                <span>© {currentYear} Astra Security.</span>
                <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-gray-400 transition-colors">Terms of Service</a>
            </div>
          <span className="flex items-center gap-2">
            Designed & Developed by <span className="text-gray-400 font-bold">Astra</span>
          </span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
