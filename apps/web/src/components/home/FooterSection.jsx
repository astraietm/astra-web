import { useRef } from "react";
import { Link } from "react-router-dom";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Instagram, 
  Github 
} from "lucide-react";
import { Button } from "@/components/ui/button";

const socialLinks = [
  { icon: Mail, href: "mailto:astra@kmct.ac.in", label: "Email" },
  { icon: Github, href: "https://github.com/astraietm", label: "Github" },
  { icon: Instagram, href: "https://instagram.com/astra.ietm", label: "Instagram" },
];

export function FooterSection() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black relative overflow-hidden pt-24 pb-12 border-t border-white/10">
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 md:gap-8 mb-20 md:mb-24">
          
          {/* Left Side: Headline */}
          <div className="max-w-2xl">
            <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter leading-[0.85] mb-8 uppercase">
                ESTABLISH <br />
              <span className="text-cyan-500">COMMS</span>
            </h2>
          </div>

          {/* Right Side: Contact & Location */}
          <div className="flex flex-col items-start md:items-end gap-8 w-full md:w-auto">
            
            {/* Location */}
            <div className="flex items-center gap-3 text-lg sm:text-xl md:text-2xl font-bold text-white group cursor-pointer hover:text-cyan-400 transition-colors uppercase tracking-tight">
              <span>KMCT CAMPUS HQ</span>
              <MapPin className="w-5 h-5 md:w-6 md:h-6 text-cyan-500" />
            </div>

            {/* Contact Button */}
            <Link to="/contact" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto rounded-xl h-auto py-4 px-8 text-[10px] font-black uppercase tracking-[0.2em] bg-white/[0.02] border border-white/10 hover:bg-white hover:text-black transition-all group">
                <Phone size={14} className="group-hover:scale-110 transition-transform" /> 
                <span>Initiate_Contact</span>
              </Button>
            </Link>

            {/* Social Icons */}
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center text-white hover:bg-cyan-400 hover:text-black hover:border-cyan-400 hover:scale-110 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-12" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          
          {/* Organized By */}
          <div className="w-full md:w-auto">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Command_Structure</p>
            <div className="flex items-center gap-4">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center overflow-hidden">
                      <img src="/favicon.svg" alt="Astra Logo" className="w-6 h-6 object-contain opacity-80" />
                   </div>
                   <div>
                      <h4 className="text-white font-black tracking-tight text-lg leading-none mb-1">ASTRA</h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Digital Defense Force</p>
                   </div>
                </div>
            </div>
          </div>

          {/* Copyright & Links */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 text-[10px] md:text-sm text-slate-500 font-bold uppercase tracking-widest w-full md:w-auto">
             <Link to="/privacy" className="hover:text-cyan-400 transition-colors">Privacy_Protocols</Link>
             <div className="hidden md:block w-1 h-1 rounded-full bg-slate-800" />
             <span className="opacity-60">© {currentYear} Astra Command. All units operational.</span>
          </div>
        </div>
      </div>

      {/* Giant Watermark Text */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none select-none overflow-hidden flex justify-center z-0">
         <h1 className="text-[25vw] font-black text-white/[0.01] leading-none tracking-tighter whitespace-nowrap translate-y-[30%] uppercase">
            SECURED
         </h1>
      </div>


    </footer>
  );
}
