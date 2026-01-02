import React from 'react';
import { Mail, MapPin, Phone, Send, Terminal, Globe, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const Contact = () => {
  return (
    <div className="min-h-screen pt-32 pb-12 bg-background relative overflow-hidden flex flex-col justify-center">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
            
            {/* Contact Info & Map */}
            <div>
                 <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-primary/20 rounded-full bg-primary/5 backdrop-blur-sm">
                        <Terminal className="w-3 h-3 text-primary" />
                        <span className="text-primary text-xs font-mono tracking-widest uppercase">Encryption: AES-256</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
                        Secure <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Uplink</span>
                    </h1>
                     <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                        Establish a direct line to Astra HQ. All transmissions are encrypted and monitored for security.
                    </p>
                </motion.div>

                <div className="space-y-6 mb-12">
                     <div className="group flex items-center gap-4 p-4 rounded-xl border border-white/5 hover:border-primary/20 bg-surface/50 backdrop-blur-sm transition-colors cursor-pointer">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <Mail className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-1">Frequency</h3>
                            <p className="text-white font-medium">contact@astra-kmct.org</p>
                        </div>
                    </div>
                     <div className="group flex items-center gap-4 p-4 rounded-xl border border-white/5 hover:border-primary/20 bg-surface/50 backdrop-blur-sm transition-colors cursor-pointer">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <MapPin className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <h3 className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-1">Coordinates</h3>
                            <p className="text-white font-medium">KMCT IETM, Kerala 673601</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Terminal Form */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-black/80 backdrop-blur-xl p-1 rounded-2xl border border-white/10 shadow-2xl"
            >
                <div className="bg-surface rounded-xl border border-white/5 overflow-hidden">
                    {/* Terminal Header */}
                     <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                        </div>
                        <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">secure_transmission.exe</div>
                    </div>

                    <form className="p-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
                        
                        <div className="space-y-2">
                            <label className="text-xs font-mono text-primary uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1 h-1 bg-primary rounded-full"></span> Identify_User
                            </label>
                            <input 
                                type="text" 
                                placeholder="> Enter Codename"
                                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-gray-700"
                            />
                        </div>

                         <div className="space-y-2">
                            <label className="text-xs font-mono text-primary uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1 h-1 bg-primary rounded-full"></span> Communication_Channel
                            </label>
                             <input 
                                type="email" 
                                placeholder="> Enter Frequency ID (Email)"
                                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-gray-700"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-mono text-primary uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1 h-1 bg-primary rounded-full"></span> Data_Payload
                            </label>
                            <textarea 
                                rows="4"
                                placeholder="> Input Message Stream..."
                                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-gray-700 resize-none"
                            ></textarea>
                        </div>

                        <button className="w-full bg-primary/10 text-primary border border-primary/20 font-mono font-bold py-4 rounded-lg hover:bg-primary hover:text-black transition-all flex items-center justify-center gap-2 group">
                            INITIALIZE_UPLINK <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>
                </div>
            </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
