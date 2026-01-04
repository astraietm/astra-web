import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Terminal, Flag, Cpu, ShieldAlert, Zap, Globe, Lock, Server } from 'lucide-react';
import FadeInUp from '../common/FadeInUp';

// --- Card Data ---
const features = [
    {
        icon: Terminal,
        title: "Advanced Wargames",
        desc: "Simulate real-world cyber attacks in our isolated Red vs Blue environments.",
        color: "text-cyan-400",
        bg: "group-hover:shadow-[0_0_30px_-5px_rgba(34,211,238,0.3)]",
        border: "group-hover:border-cyan-500/50"
    },
    {
        icon: Globe,
        title: "Global Intelligence",
        desc: "Access real-time threat maps and OSINT data feeds from international agencies.",
        color: "text-purple-400",
        bg: "group-hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)]",
        border: "group-hover:border-purple-500/50"
    },
    {
        icon: Lock,
        title: "Crypto Analysis",
        desc: "Deep dive into blockchain security, smart contract auditing, and cryptography.",
        color: "text-pink-400",
        bg: "group-hover:shadow-[0_0_30px_-5px_rgba(244,114,182,0.3)]",
        border: "group-hover:border-pink-500/50"
    },
    {
        icon: Server,
        title: "Cloud Fortification",
        desc: "Architecting zero-trust infrastructure for next-gen cloud computing systems.",
        color: "text-emerald-400",
        bg: "group-hover:shadow-[0_0_30px_-5px_rgba(52,211,153,0.3)]",
        border: "group-hover:border-emerald-500/50"
    }
];

const AboutSection = () => {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start end", "end start"]
    });

    const y = useSpring(useTransform(scrollYProgress, [0, 1], [100, -100]), { stiffness: 100, damping: 30 });
    const rotate = useSpring(useTransform(scrollYProgress, [0, 1], [0, 15]), { stiffness: 100, damping: 30 });

    return (
        <section ref={targetRef} className="py-24 md:py-32 bg-background relative overflow-hidden">
            
            {/* Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)] pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    
                    {/* Left Content */}
                    <div className="relative">
                         <FadeInUp>
                            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                                <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                <span className="text-xs font-mono text-gray-300 uppercase tracking-widest">Next-Gen Initiative</span>
                            </div>
                            
                            <h2 className="text-4xl md:text-6xl font-display font-medium text-white mb-6 leading-[1.1]">
                                Engineering the <br /> 
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-purple-500">Defenders of Tomorrow</span>
                            </h2>
                            
                            <p className="text-gray-400 text-lg font-light leading-relaxed mb-8 max-w-xl">
                                We are not just a student club; we are a specialized unit dedicated to mastering the art of cybersecurity. 
                                From offensive maneuvers to defensive architecture, ASTRA bridges the gap between theory and the digital battlefield.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button className="px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 group">
                                    Join the Ranks
                                    <Terminal className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button className="px-8 py-4 bg-transparent border border-white/20 text-white font-medium rounded-lg hover:bg-white/5 transition-colors">
                                    View Operations
                                </button>
                            </div>
                        </FadeInUp>
                    </div>

                    {/* Right Interactive Cards */}
                    <div className="relative h-[600px] hidden lg:block perspective-1000">
                        {/* Orbiting Decor */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                             <div className="w-[500px] h-[500px] border border-white/5 rounded-full animate-[spin_60s_linear_infinite]"></div>
                             <div className="w-[350px] h-[350px] border border-dashed border-white/10 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
                        </div>

                        {/* Floating Cards Stack */}
                        <motion.div style={{ y, rotateX: rotate }} className="relative z-10 grid grid-cols-2 gap-4 w-full h-full p-8">
                             {features.map((feature, idx) => (
                                 <motion.div 
                                    key={idx}
                                    variants={{
                                        hidden: { opacity: 0, scale: 0.8 },
                                        visible: { opacity: 1, scale: 1 }
                                    }}
                                    initial="hidden"
                                    whileInView="visible"
                                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                                    whileHover={{ scale: 1.05, zIndex: 10 }}
                                    className={`group relative bg-[#0A0A0A]/90 backdrop-blur-xl border border-white/10 p-6 rounded-2xl transition-all duration-300 ${feature.border} hover:-translate-y-2`}
                                 >
                                      {/* Hover Glow */}
                                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl ${feature.bg}`}></div>
                                      
                                      <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-white/10 transition-colors`}>
                                          <feature.icon className={`w-6 h-6 ${feature.color}`} />
                                      </div>
                                      
                                      <h3 className="text-xl font-display font-medium text-white mb-2">{feature.title}</h3>
                                      <p className="text-sm text-gray-500 leading-relaxed font-light">{feature.desc}</p>
                                 </motion.div>
                             ))}
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default AboutSection;
