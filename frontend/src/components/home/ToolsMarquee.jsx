import React from 'react';

const tools = [
  { 
    name: 'Kali Linux', 
    logo: 'https://www.kali.org/images/kali-dragon-icon.svg',
  },
  { 
    name: 'Metasploit', 
    logo: 'https://www.metasploit.com/assets/metasploit-r7-logo.svg',
  },
  { 
    name: 'Wireshark', 
    logo: 'https://www.wireshark.org/assets/icons/wireshark-fin.png',
  },
  { 
    name: 'Python', 
    logo: 'https://www.python.org/static/community_logos/python-logo-generic.svg',
  },
  { 
    name: 'Burp Suite', 
    logo: 'https://portswigger.net/content/images/logos/burp-suite-logo.svg',
  },
  { 
    name: 'Nmap', 
    logo: 'https://nmap.org/images/nmap-logo-256x256.png',
  },
  { 
    name: 'Docker', 
    logo: 'https://www.docker.com/wp-content/uploads/2022/03/Moby-logo.png',
  },
  { 
    name: 'Android Studio', 
    logo: 'https://developer.android.com/static/studio/images/new-studio-logo-1_1920.png',
  },
  { 
    name: 'Hashcat', 
    logo: 'https://hashcat.net/hashcat/img/logo.svg',
  },
  { 
    name: 'John the Ripper', 
    logo: 'https://www.openwall.com/john/img/john.png',
  },
];

const ToolsMarquee = () => {
    return (
        <section className="py-12 bg-background border-y border-white/5 overflow-hidden">
            
            <div className="relative flex overflow-x-hidden">
                {/* Gradient Fade Edges */}
                <div className="absolute inset-y-0 left-0 w-32 md:w-48 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-32 md:w-48 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

                <div className="animate-marquee flex gap-8 items-center">
                    {[...tools, ...tools, ...tools].map((tool, index) => (
                        <div 
                            key={index} 
                            className="group flex-shrink-0"
                        >
                            {/* Simple Dark Card */}
                            <div className="flex items-center gap-4 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg transition-all duration-300 cursor-pointer min-w-[200px]">
                                
                                {/* Logo */}
                                <div className="flex items-center justify-center w-10 h-10 flex-shrink-0">
                                    <img 
                                        src={tool.logo} 
                                        alt={tool.name}
                                        className="w-full h-full object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                    <div className="hidden w-10 h-10 items-center justify-center text-xl font-bold text-white/30">
                                        {tool.name.charAt(0)}
                                    </div>
                                </div>
                                
                                {/* Tool Name */}
                                <p className="text-sm font-medium text-white/70 group-hover:text-white transition-colors duration-300">
                                    {tool.name}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ToolsMarquee;
