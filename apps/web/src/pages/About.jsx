import React from 'react';
import { Shield } from 'lucide-react';
import FadeInUp from '../components/common/FadeInUp';
import HackerText from '../components/common/HackerText';
import { motion } from 'framer-motion';
import { facultyMembers, coreMembers } from '../data/team';
import CyberBackground from '../components/common/CyberBackground';

// ----------------------------------------------------------------------
// NOTE: To update the team members, edit the file: src/data/team.js
// ----------------------------------------------------------------------


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

//...

const About = () => {
    return (
        <div className="bg-background min-h-screen pt-32 pb-20 relative overflow-hidden">
             <CyberBackground />
             
             <div className="container mx-auto px-4 relative z-10">
                
                {/* Intro Section */}
                <div className="max-w-4xl mx-auto text-center mb-8 md:mb-24">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 md:mb-6 border border-white/10 rounded-full bg-white/5 backdrop-blur-sm">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                            <span className="text-gray-400 text-[10px] md:text-xs font-mono tracking-widest uppercase">Est. 2023</span>
                        </div>
                        <h1 className="text-3xl md:text-7xl font-display font-medium text-white mb-4 md:mb-8 tracking-tight">
                            About <span className="text-primary inline-block"><motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>ASTRA</motion.span></span>
                        </h1>
                    </motion.div>
                    <FadeInUp delay={0.1}>
                        <p className="text-sm md:text-2xl text-gray-300 font-light leading-relaxed px-4 md:px-0">
                            ASTRA is the official Cybersecurity Association of the Cybersecurity Department at <span className="text-white font-medium">KMCT Institute of Emerging Technology and Management</span>.
                        </p>
                    </FadeInUp>
                </div>



                {/* Active Personnel / Team Section */}
                <div className="max-w-7xl mx-auto mb-12 md:mb-24 px-4 md:px-0">

                     
                     {/* Faculty Advisors */}
                     <div className="mb-12 md:mb-16">
                        <FadeInUp delay={0.7}>
                            <h3 className="text-base md:text-xl font-display font-medium text-gray-500 mb-4 md:mb-6 uppercase tracking-widest pl-2 border-l-2 border-primary">Faculty Advisors</h3>
                        </FadeInUp>
                        <motion.div 
                            className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                        >
                            {facultyMembers.map((member, i) => (
                                <motion.div key={`faculty-${i}`} variants={fadeInUp} whileHover={{ scale: 1.02 }} className="h-full">
                                    <div className="group relative bg-black border border-white/10 p-1 h-full">
                                        {/* Corner Accents */}
                                        <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-white/30 group-hover:border-primary transition-colors"></div>
                                        <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-white/30 group-hover:border-primary transition-colors"></div>
                                        <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-white/30 group-hover:border-primary transition-colors"></div>
                                        <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-white/30 group-hover:border-primary transition-colors"></div>

                                        <div className="relative bg-white/5 p-4 md:p-6 flex flex-row items-center text-left gap-4 md:gap-6 h-full">
                                            <div className="relative">
                                                 <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-800 rounded-full overflow-hidden transition-all duration-500">
                                                    {/* IMAGE: If image is available use it, else placeholder */}
                                                    {member.image ? (
                                                        <img src={member.image} alt={member.name} className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110" />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-black flex items-center justify-center text-white/20">IMG</div>
                                                    )}
                                                 </div>
                                                 {/* Rotating Dashed Ring */}
                                                 <div className="absolute inset-[-4px] rounded-full border border-dashed border-primary/30 animate-[spin_10s_linear_infinite]"></div>
                                            </div>
                                            
                                            <div className="flex-1">
                                                <h4 className="text-lg md:text-xl font-display font-bold text-white mb-1 group-hover:text-primary transition-colors">
                                                    <HackerText text={member.name} speed={30} className="font-display font-bold" />
                                                </h4>
                                                <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-2 md:mb-3">{member.role}</p>
                                                <div className="h-[1px] w-full bg-white/10 mb-2 md:mb-3"></div>
                                                <div className="flex justify-between text-xs font-mono text-gray-600 group-hover:text-primary/70">
                                                    <span>ID: {member.id}</span>
                                                    <span>CLEARANCE: L5</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                     </div>

                     {/* Core Members */}
                     <div>
                        <FadeInUp delay={0.8}>
                            <h3 className="text-xl font-display font-medium text-gray-500 mb-6 uppercase tracking-widest pl-2 border-l-2 border-primary">Core Operatives</h3>
                        </FadeInUp>
                        <motion.div 
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                        >
                            {coreMembers.map((member, i) => (
                                <motion.div key={`student-${i}`} variants={fadeInUp} whileHover={{ y: -5, transition: { type: "spring", stiffness: 300 } }}>
                                    <div className="group relative w-full h-full bg-[#050505] border border-white/5 transition-all duration-300 hover:border-primary/50">
                                        
                                        {/* Card Content Container */}
                                        <div className="relative p-8 flex flex-col items-center text-center h-full">
                                            
                                            {/* Tactical Corners (Inside) */}
                                            <div className="absolute top-2 left-2 w-3 h-3 border-l border-t border-white/20 group-hover:border-primary/80 transition-colors"></div>
                                            <div className="absolute top-2 right-2 w-3 h-3 border-r border-t border-white/20 group-hover:border-primary/80 transition-colors"></div>
                                            <div className="absolute bottom-2 left-2 w-3 h-3 border-l border-b border-white/20 group-hover:border-primary/80 transition-colors"></div>
                                            <div className="absolute bottom-2 right-2 w-3 h-3 border-r border-b border-white/20 group-hover:border-primary/80 transition-colors"></div>

                                            {/* Avatar Section */}
                                            <div className="relative mb-6">
                                                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/5 group-hover:border-primary/50 transition-colors relative z-10 bg-gray-900">
                                                     <img 
                                                        src={member.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}&backgroundColor=transparent`} 
                                                        alt={member.name}
                                                        className="w-full h-full object-cover transition-all duration-500 opacity-80 group-hover:opacity-100 transform group-hover:scale-110"
                                                     />
                                                </div>
                                                {/* Dashed Ring */}
                                                <div className="absolute top-[-8px] left-[-8px] right-[-8px] bottom-[-8px] border border-dashed border-white/20 rounded-full animate-[spin_12s_linear_infinite] group-hover:border-primary/40"></div>
                                                <div className="absolute top-[-8px] left-[-8px] right-[-8px] bottom-[-8px] border border-dashed border-white/10 rounded-full animate-[spin_12s_linear_infinite_reverse] scale-110"></div>
                                            </div>

                                            {/* Text Content */}
                                            <div className="mb-1">
                                                 <HackerText text={member.name} speed={30} className="text-lg font-display font-bold text-white tracking-wide group-hover:text-primary transition-colors block" />
                                            </div>
                                            <p className="text-xs font-mono text-gray-500 uppercase tracking-[0.2em] mb-6">{member.role}</p>
                                            
                                            {/* Footer Specs */}
                                            <div className="w-full mt-auto pt-4 border-t border-white/10 flex justify-between text-xs font-mono text-gray-600 group-hover:text-primary max-w-[80%] mx-auto">
                                                <span>ID: {member.id}</span>
                                                <span>LVL: {member.level}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                     </div>
                </div>

             </div>
        </div>
    );
};

export default About;
