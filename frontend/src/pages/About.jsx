import React from 'react';
import { Target, Lightbulb, Users, Shield, Terminal, Cpu } from 'lucide-react';


const About = () => {
    const stats = [
        { label: "Operations Active", value: "24/7" },
        { label: "Members Deployed", value: "50+" },
        { label: "Vulnerabilities Patched", value: "128" },
        { label: "CTF Victories", value: "15" },
    ];

  return (
    <div className="bg-background min-h-screen pt-32 pb-12 overflow-hidden relative">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-primary/20 rounded-full bg-primary/5 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="text-primary text-xs font-mono tracking-widest uppercase">Classified Access Only</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tight">
                WHO IS <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">ASTRA?</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed font-light max-w-2xl mx-auto">
                We are the elite cybersecurity division of KMCT IETM. A collective of ethical hackers, researchers, and innovators securing the digital frontier.
            </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-24">
            {stats.map((stat, index) => (
                <div key={index} className="bg-surface/30 backdrop-blur-sm border border-white/10 p-6 rounded-2xl text-center group hover:border-primary/30 transition-colors relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                    <div className="relative z-10">
                        <div className="text-3xl md:text-4xl font-display font-bold text-white mb-1 group-hover:text-primary transition-colors">{stat.value}</div>
                        <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">{stat.label}</div>
                    </div>
                </div>
            ))}
        </div>

        {/* Mission & Vision - Holographic Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-24">
            <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-surface p-8 rounded-3xl border border-white/10 h-full overflow-hidden">
                    {/* Scanner Line */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-primary/50 shadow-[0_0_15px_#00E0FF] translate-y-[-10px] group-hover:animate-[scan_2s_linear_infinite]"></div>
                    
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform duration-300">
                        <Target className="w-7 h-7" />
                    </div>
                    <h2 className="text-3xl font-display font-bold mb-4">Prime Directive</h2>
                    <p className="text-gray-400 leading-relaxed text-lg">
                        To empower the next generation of defenders. We conduct high-level operations including CTFs, penetration testing workshops, and live-fire cyber drills to prepare agents for real-world threats.
                    </p>
                </div>
            </div>
             <div className="relative group">
                 <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-surface p-8 rounded-3xl border border-white/10 h-full overflow-hidden">
                     {/* Scanner Line */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-blue-500/50 shadow-[0_0_15px_#3B82F6] translate-y-[-10px] group-hover:animate-[scan_2s_linear_infinite] delay-1000"></div>

                    <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 text-blue-500 group-hover:scale-110 transition-transform duration-300">
                        <Lightbulb className="w-7 h-7" />
                    </div>
                    <h2 className="text-3xl font-display font-bold mb-4">Strategic Vision</h2>
                    <p className="text-gray-400 leading-relaxed text-lg">
                        To establish a global network of elite security researchers. We envision a future where digital sovereignty is protected by ethical innovation and technical excellence.
                    </p>
                </div>
            </div>
        </div>

        {/* Personnel Section */}
        <div>
            <div className="flex items-center gap-3 mb-10 border-b border-white/10 pb-4">
                <Users className="w-6 h-6 text-primary" />
                <h2 className="text-3xl font-display font-bold tracking-tight">Active Personnel</h2>
                <span className="ml-auto text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">STATUS: ONLINE</span>
            </div>
            
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((item, i) => (

                    <div 
                        key={item} 
                        className="group bg-surface rounded-none clip-path-polygon p-[1px] relative"
                    >
                         {/* Border Gradient using parent p-[1px] and bg */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent group-hover:from-primary/50 transition-colors"></div>
                        
                        <div className="bg-black relative h-full p-6 flex flex-col items-center">
                            {/* Corner Decors */}
                            <div className="absolute top-0 left-0 w-3 h-3 border-l border-t border-white/30 group-hover:border-primary transition-colors"></div>
                            <div className="absolute top-0 right-0 w-3 h-3 border-r border-t border-white/30 group-hover:border-primary transition-colors"></div>
                            <div className="absolute bottom-0 left-0 w-3 h-3 border-l border-b border-white/30 group-hover:border-primary transition-colors"></div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-white/30 group-hover:border-primary transition-colors"></div>

                            <div className="w-24 h-24 mb-4 relative">
                                <div className="absolute inset-0 border-2 border-primary/30 rounded-full border-dashed animate-[spin_10s_linear_infinite]"></div>
                                <img 
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item + 5}`} 
                                    alt="Agent" 
                                    className="w-full h-full rounded-full grayscale group-hover:grayscale-0 transition-all duration-500 p-1"
                                />
                            </div>
                            
                            <h3 className="font-display font-bold text-lg text-white mb-1">Agent {item + 34}</h3>
                            <p className="text-gray-500 text-xs font-mono uppercase tracking-widest mb-4">Security Analyst</p>
                            
                            <div className="w-full flex justify-between items-center text-[10px] font-mono text-gray-600 border-t border-white/10 pt-3 mt-auto group-hover:text-primary transition-colors">
                                <span>ID: 8XK-{item}9</span>
                                <span>LVL: 0{item}</span>
                            </div>
                        </div>
                    </div>
                ))}
             </div>
        </div>

      </div>
    </div>
  );
};

export default About;
