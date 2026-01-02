import React from 'react';
import { Shield, Github, Twitter, Linkedin, Mail, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-white/5 pt-20 pb-10">
      <div className="mx-auto w-full max-w-screen-xl px-6">
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-16">
            <div className="col-span-2 lg:col-span-2">
                <Link to="/" className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                        <Shield className="w-4 h-4" />
                    </div>
                    <span className="font-display font-bold tracking-widest text-white text-xl">ASTRA</span>
                </Link>
                <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-xs">
                    Securing the digital frontier through innovation, education, and elite research. Join the next generation of defenders.
                </p>
                <div className="flex gap-4">
                    {[Github, Twitter, Linkedin].map((Icon, i) => (
                        <a key={i} href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
                            <Icon className="w-4 h-4"/>
                        </a>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="font-display font-bold text-white mb-6">Platform</h3>
                <ul className="space-y-4 text-sm text-gray-500">
                    <li><Link to="/events" className="hover:text-primary transition-colors">Events</Link></li>
                    <li><Link to="/gallery" className="hover:text-primary transition-colors">Gallery</Link></li>
                    <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                    <li><a href="#" className="hover:text-primary transition-colors">CTF Portal</a></li>
                </ul>
            </div>

            <div>
                <h3 className="font-display font-bold text-white mb-6">Organization</h3>
                <ul className="space-y-4 text-sm text-gray-500">
                    <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Team</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Partners</a></li>
                    <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                </ul>
            </div>

            <div className="col-span-2 md:col-span-4 lg:col-span-2 mt-8 lg:mt-0">
                 <h3 className="font-display font-bold text-white mb-6">Stay Updated</h3>
                 <p className="text-gray-500 text-sm mb-4">Subscribe to our secure frequency for the latest intel.</p>
                 <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                    <input 
                        type="email" 
                        placeholder="Enter your email" 
                        className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 w-full"
                    />
                    <button className="bg-primary text-black font-bold rounded-lg px-4 py-2 hover:bg-primary/90 transition-colors">
                        <ArrowRight className="w-4 h-4" />
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
            Designed & Developed by <span className="text-gray-400 font-bold">KMCT IETM</span>
          </span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
