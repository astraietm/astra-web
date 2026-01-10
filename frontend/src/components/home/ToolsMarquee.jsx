import React from 'react';
import { Terminal, Shield, Cpu, Wifi, Globe, Lock, Code, Database, Server, Smartphone } from 'lucide-react';

const tools = [
  { name: 'Kali Linux', icon: Terminal },
  { name: 'Metasploit', icon: Shield },
  { name: 'Wireshark', icon: Wifi },
  { name: 'Python', icon: Code },
  { name: 'Burp Suite', icon: Globe },
  { name: 'Nmap', icon: Database },
  { name: 'Docker', icon: Server },
  { name: 'Android Studio', icon: Smartphone },
  { name: 'Cryptography', icon: Lock },
  { name: 'Reverse Eng', icon: Cpu },
];

const ToolsMarquee = () => {
    // Determine total width for animation based on number of items
    // Using CSS variables to control the marquee duration dynamically if needed
    return (
        <section className="py-12 bg-background border-t border-white/5 overflow-hidden">
             <div className="container mx-auto px-4 mb-8 text-center">
                <p className="text-sm font-mono text-gray-500 uppercase tracking-widest">Powered By Modern Security Stack</p>
             </div>
            
             <div className="relative flex overflow-x-hidden group">
                 {/* Gradient Fade Edges */}
                <div className="absolute inset-y-0 left-0 w-20 md:w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-20 md:w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

                <div className="animate-marquee flex whitespace-nowrap gap-12 md:gap-24 items-center">
                    {/* Double the list for seamless loop */}
                    {[...tools, ...tools, ...tools].map((tool, index) => (
                        <div key={index} className="flex items-center gap-3 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-default group/item">
                            <tool.icon className="w-6 h-6 md:w-8 md:h-8 text-primary group-hover/item:scale-110 transition-transform" />
                            <span className="text-lg md:text-xl font-display font-medium text-white hidden md:block">{tool.name}</span>
                        </div>
                    ))}
                </div>
                
             </div>
        </section>
    );
};

export default ToolsMarquee;
