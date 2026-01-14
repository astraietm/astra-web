import React from 'react';
import { motion } from 'framer-motion';
import { Target, BookOpen, Cpu, Globe } from 'lucide-react';
import FadeInUp from '../common/FadeInUp';

const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            duration: 0.8
        }
    }
};

import HackerText from '../common/HackerText';
import StatusLED from '../common/StatusLED';

const VisionMission = () => {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Cyber Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)] pointer-events-none"></div>

            <div className="container mx-auto px-4 relative z-10">

                {/* Vision Section */}
                <div className="max-w-4xl mx-auto mb-16 md:mb-24 text-center px-4 md:px-0">
                    <FadeInUp delay={0.2}>
                        <motion.div
                            className="relative group"
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-blue-500/10 to-primary/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse"></div>
                            <div className="relative bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 p-5 md:p-16 rounded-3xl overflow-hidden hover:border-primary/50 transition-all duration-500 hover:shadow-[0_0_50px_-10px_rgba(0,224,255,0.2)]">

                                {/* Decor */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-pulse"></div>
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-pulse"></div>
                                
                                {/* Corner Glitch Accents */}
                                <div className="absolute top-4 left-4 w-2 h-2 border-l border-t border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="absolute top-4 right-4 w-2 h-2 border-r border-t border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="absolute bottom-4 left-4 w-2 h-2 border-l border-b border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="absolute bottom-4 right-4 w-2 h-2 border-r border-b border-primary/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                
                                <StatusLED color="blue" label="SYSTEM_ACTIVE" className="absolute top-6 right-6 z-20" />

                                <div className="relative w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-8">
                                    <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl animate-[spin_4s_linear_infinite]"></div>
                                    <div className="relative w-full h-full bg-gradient-to-br from-primary/20 to-transparent rounded-2xl flex items-center justify-center text-primary ring-1 ring-primary/30 group-hover:scale-110 transition-all duration-500 z-10">
                                        <Target className="w-8 h-8 md:w-10 md:h-10 animate-[pulse_3s_ease-in-out_infinite]" />
                                    </div>
                                </div>

                                <h2 className="text-[10px] md:text-sm font-mono text-primary tracking-[0.3em] uppercase mb-2 md:mb-4">
                                     <HackerText text="TARGET_ACQUIRED: VISION" speed={50} />
                                </h2>
                                <p className="text-lg md:text-3xl text-white font-light leading-relaxed tracking-tight">
                                    "To be a leader in <span className="text-primary font-normal">cybersecurity education</span> and innovation, shaping ethical professionals to secure the digital future."
                                </p>
                            </div>
                        </motion.div>
                    </FadeInUp>
                </div>

                {/* Mission Section */}
                <div className="max-w-7xl mx-auto mb-16 md:mb-32 px-4 md:px-0">
                    <FadeInUp delay={0.3}>
                        <div className="flex items-center gap-3 md:gap-6 mb-8 md:mb-12">
                            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/10"></div>
                            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary/50"></span>
                            <h2 className="text-xl md:text-3xl font-display font-medium text-white">
                                <HackerText text="Mission_Protocols" />
                            </h2>
                            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary/50"></span>
                            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/10"></div>
                        </div>
                    </FadeInUp>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                    >
                        {/* Mission 1: Education */}
                        <motion.div variants={fadeInUp} whileHover={{ y: -10, transition: { type: "spring", stiffness: 300 } }}>
                            <div className="group h-full bg-white/[0.03] backdrop-blur-sm border border-white/5 p-5 md:p-10 rounded-3xl hover:border-blue-500/50 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden shadow-lg hover:shadow-blue-500/20">
                                {/* Active Bottom Border */}
                                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>

                                {/* Scan Line */}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000"></div>

                                <StatusLED color="blue" label="EDU_NODE" className="absolute top-6 left-6 z-20" />

                                <div className="absolute top-0 right-0 p-4 md:p-8 opacity-0 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-700">
                                    <BookOpen className="w-16 h-16 md:w-40 md:h-40 text-blue-500" />
                                </div>
                                <div className="w-10 h-10 md:w-14 md:h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 md:mb-8 text-blue-500 group-hover:bg-blue-500 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-500">
                                    <BookOpen className="w-5 h-5 md:w-7 md:h-7" />
                                </div>
                                <h3 className="text-lg md:text-2xl font-display font-medium text-white mb-2 md:mb-4 group-hover:text-blue-400 transition-colors">Education</h3>
                                <p className="text-gray-400 text-sm md:text-base leading-relaxed relative z-10 group-hover:text-gray-300 transition-colors">
                                    To provide a high-quality, future-focused education in cybersecurity, empowering students with the knowledge, technical skills, and ethical grounding necessary to excel in diverse cyber-related careers.
                                </p>
                            </div>
                        </motion.div>

                        {/* Mission 2: Innovation */}
                        <motion.div variants={fadeInUp} whileHover={{ y: -10, transition: { type: "spring", stiffness: 300 } }}>
                            <div className="group h-full bg-white/[0.03] backdrop-blur-sm border border-white/5 p-5 md:p-10 rounded-3xl hover:border-purple-500/50 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden shadow-lg hover:shadow-purple-500/20">
                                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000"></div>

                                <StatusLED color="purple" label="R&D_LAB" className="absolute top-6 left-6 z-20" />

                                <div className="absolute top-0 right-0 p-4 md:p-8 opacity-0 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-700">
                                    <Cpu className="w-16 h-16 md:w-40 md:h-40 text-purple-500" />
                                </div>
                                <div className="w-10 h-10 md:w-14 md:h-14 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 md:mb-8 text-purple-500 group-hover:bg-purple-500 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all duration-500">
                                    <Cpu className="w-5 h-5 md:w-7 md:h-7" />
                                </div>
                                <h3 className="text-lg md:text-2xl font-display font-medium text-white mb-2 md:mb-4 group-hover:text-purple-400 transition-colors">Innovation</h3>
                                <p className="text-gray-400 text-sm md:text-base leading-relaxed relative z-10 group-hover:text-gray-300 transition-colors">
                                    To foster innovation and continuous learning, encouraging students and faculty to explore emerging technologies, develop secure solutions, and lead boldly in a rapidly evolving digital landscape.
                                </p>
                            </div>
                        </motion.div>

                        {/* Mission 3: Research */}
                        <motion.div variants={fadeInUp} whileHover={{ y: -10, transition: { type: "spring", stiffness: 300 } }}>
                            <div className="group h-full bg-white/[0.03] backdrop-blur-sm border border-white/5 p-5 md:p-10 rounded-3xl hover:border-green-500/50 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden shadow-lg hover:shadow-green-500/20">
                                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-green-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000"></div>

                                <StatusLED color="green" label="NET_SEC" className="absolute top-6 left-6 z-20" />

                                <div className="absolute top-0 right-0 p-4 md:p-8 opacity-0 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-700">
                                    <Globe className="w-16 h-16 md:w-40 md:h-40 text-green-500" />
                                </div>
                                <div className="w-10 h-10 md:w-14 md:h-14 bg-green-500/10 rounded-xl flex items-center justify-center mb-4 md:mb-8 text-green-500 group-hover:bg-green-500 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] transition-all duration-500">
                                    <Globe className="w-5 h-5 md:w-7 md:h-7" />
                                </div>
                                <h3 className="text-lg md:text-2xl font-display font-medium text-white mb-2 md:mb-4 group-hover:text-green-400 transition-colors">Research</h3>
                                <p className="text-gray-400 text-sm md:text-base leading-relaxed relative z-10 group-hover:text-gray-300 transition-colors">
                                    To engage in impactful research and collaboration, addressing real-world cybersecurity challenges through interdisciplinary approaches and contributing to the safety, resilience, and advancement of society.
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default VisionMission;
