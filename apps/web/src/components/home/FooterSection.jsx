import { useRef } from "react";
import { Link } from "react-router-dom";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Instagram, 
  Linkedin, 
  Twitter, 
  Shield 
} from "lucide-react";
import { Button } from "@/components/ui/button";

const socialLinks = [
  { icon: Mail, href: "mailto:astra@kmct.ac.in", label: "Email" },
  { icon: Instagram, href: "https://instagram.com/astra.ietm", label: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
];

export function FooterSection() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black relative overflow-hidden pt-24 pb-12 border-t border-white/10">
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-16 md:gap-8 mb-24">
          
          {/* Left Side: Headline */}
          <div className="max-w-2xl">
            <h2 className="text-5xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter leading-[0.85] mb-8">
              LETS <br />
              <span className="text-cyan-500">CONNECT</span>
            </h2>
            <p className="text-gray-400 text-lg md:text-xl max-w-lg leading-relaxed">
              Have a question or want to sponsor? Reach out to us and let's build something incredible together.
            </p>
          </div>

          {/* Right Side: Contact & Location */}
          <div className="flex flex-col items-start md:items-end gap-8 w-full md:w-auto">
            
            {/* Location */}
            <div className="flex items-center gap-3 text-xl md:text-2xl font-medium text-white group cursor-pointer hover:text-cyan-400 transition-colors">
              <span>KMCT College of Engineering</span>
              <MapPin className="w-6 h-6 text-cyan-500" />
            </div>

            {/* Contact Button */}
            <Link to="/contact">
              <Button className="rounded-full h-auto py-4 px-8 text-lg bg-transparent border border-white/20 hover:bg-white/10 hover:border-white/40 text-white flex items-center gap-3 transition-all group">
                <Phone className="w-5 h-5 group-hover:scale-110 transition-transform" /> 
                <span>Contact us</span>
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
                  className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black hover:scale-110 transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>

          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-white/10 mb-12"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
          
          {/* Organized By */}
          <div>
            <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-[0.2em] mb-4">Organized By</p>
            <div className="flex items-center gap-4 opacity-80 hover:opacity-100 transition-opacity">
                {/* Logo Placeholder */}
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-cyan-500" />
                   </div>
                   <div>
                      <h4 className="text-white font-bold tracking-tight text-lg">ASTRA</h4>
                      <p className="text-xs text-gray-500">KMCT IETM</p>
                   </div>
                </div>
            </div>
          </div>

          {/* Copyright & Links */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 text-sm text-gray-500 font-medium">
             <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
             <span className="hidden md:inline w-1 h-1 rounded-full bg-gray-700"></span>
             <span>© {currentYear} Astra Security. All rights reserved.</span>
          </div>

        </div>
      </div>

      {/* Giant Watermark Text */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none select-none overflow-hidden flex justify-center">
         <h1 className="text-[25vw] font-black text-white/[0.02] leading-none tracking-tighter whitespace-nowrap translate-y-[20%]">
            ASTRA
         </h1>
      </div>

    </footer>
  );
}
