import React, { useState } from 'react';
import FadeInUp from '../components/common/FadeInUp';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { facultyMembers, coreMembers } from '../data/team';
import CyberBackground from '../components/common/CyberBackground';
import { Github, Linkedin } from 'lucide-react';

const About = () => {
    return (
        <div className="bg-background min-h-screen relative overflow-hidden">
            <CyberBackground />
            <div className="absolute inset-0 bg-background/80 backdrop-blur-[1px] pointer-events-none"></div>

            <div className="container mx-auto px-6 pt-32 pb-32 relative z-10">
                {/* --- Hero --- */}
                <div className="max-w-4xl mb-24 text-center mx-auto">
                    <FadeInUp>
                        <h1 className="text-5xl md:text-7xl font-display font-medium text-white mb-6">
                            We are <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">ASTRA</span>.
                        </h1>
                        <p className="text-xl text-gray-400 font-light max-w-3xl mx-auto leading-relaxed">
                            The intelligent defense network of <br />
                            <span className="text-white font-medium block mt-2 md:inline md:mt-0">KMCT Institute of Emerging Technology and Management</span>
                        </p>
                    </FadeInUp>
                </div>

                {/* --- Faculty Advisors (Keep Professional Cards) --- */}
                <div className="mb-32 max-w-5xl mx-auto">
                    <FadeInUp delay={0.2}>
                         <div className="flex items-center gap-4 mb-12 justify-center">
                            <h2 className="text-sm font-mono text-primary uppercase tracking-[0.3em]">Command Hierarchy</h2>
                        </div>
                    </FadeInUp>
                    {/* Using Flex Wrap for centering orphaned items instead of rigid Grid */}
                    <div className="flex flex-wrap justify-center gap-6">
                        {facultyMembers.map((member, i) => (
                            <div key={i} className="w-full md:w-[calc(50%-12px)] max-w-lg">
                                <FacultyCard member={member} index={i} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- Core Team --- */}
                <div className="max-w-full md:px-12 mx-auto">
                    <FadeInUp delay={0.3}>
                        <div className="flex items-center gap-4 mb-24 justify-center">
                            <h2 className="text-sm font-mono text-primary uppercase tracking-[0.3em]">Operative Network</h2>
                        </div>
                    </FadeInUp>

                    {/* MOBILE LAYOUT (Advanced Tech Stack) */}
                    <div className="md:hidden flex flex-col gap-4 perspective-[1000px]">
                        {coreMembers.map((member, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, x: -50, rotateY: -15, skewX: 10 }}
                                whileInView={{ opacity: 1, x: 0, rotateY: 0, skewX: 0 }}
                                viewport={{ once: true, margin: "-10%" }}
                                transition={{ 
                                    type: "spring",
                                    stiffness: 200,
                                    damping: 15,
                                    delay: i % 4 * 0.1 // Stagger in batches
                                }}
                                className="group relative bg-[#0A0A0A] border border-white/10 p-4 rounded-xl overflow-hidden"
                            >
                                {/* Flash Effect on Entry */}
                                <motion.div 
                                    initial={{ x: "-100%", opacity: 0.5 }}
                                    whileInView={{ x: "200%", opacity: 0 }}
                                    transition={{ duration: 0.8, delay: (i % 4 * 0.1) + 0.2, ease: "circOut" }}
                                    className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-primary/20 to-transparent z-10 skew-x-12"
                                />

                                <div className="flex items-center gap-4 relative z-0">
                                    <div className="w-16 h-16 rounded-full overflow-hidden border border-white/10 shrink-0 shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:border-primary/50 transition-colors">
                                        <img 
                                            src={member.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} 
                                            alt={member.name}
                                            className="w-full h-full object-cover" 
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-white font-display font-bold text-lg leading-none mb-1">{member.name}</h3>
                                        <p className="text-primary text-xs uppercase font-mono tracking-widest opacity-80">{member.role}</p>
                                    </div>
                                    
                                    {/* Tech Decor / ID */}
                                    <div className="flex flex-col items-end gap-1 opacity-30">
                                        <div className="w-16 h-[2px] bg-white"></div>
                                        <span className="text-[9px] font-mono sm:block hidden">OP-{i.toString().padStart(3, '0')}</span>
                                        {member.github && (
                                            <a href={member.github} className="text-white opacity-100 hover:text-primary z-20">
                                                <Github className="w-4 h-4" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* DESKTOP LAYOUT (Bubble Cluster) - Visible only on MD+ screens */}
                    <div className="hidden md:block">
                        <LayoutGroup>
                            <motion.div layout className="flex flex-wrap justify-center gap-4">
                                {coreMembers.map((member, i) => (
                                    <BubbleCard key={i} member={member} index={i} />
                                ))}
                            </motion.div>
                        </LayoutGroup>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- BUBBLE COMPONENT (Desktop Only) ---
const BubbleCard = ({ member, index }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            layout
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="relative z-0 hover:z-10"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            viewport={{ once: true }}
        >
            <motion.div
                layout
                className={`relative bg-[#0A0A0A] border border-white/10 overflow-hidden cursor-pointer backdrop-blur-md transition-shadow duration-300 ${
                    isHovered ? 'shadow-[0_0_30px_-5px_rgba(0,255,65,0.2)] border-primary/30' : ''
                }`}
                style={{
                    borderRadius: 9999, 
                }}
                animate={{
                    width: isHovered ? 340 : 100,
                    height: 100,
                }}
                transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30
                }}
            >
                <div className="absolute inset-0 flex items-center pl-1.5">
                    
                    {/* Avatar */}
                    <motion.div 
                        layout="position"
                        className="shrink-0 rounded-full overflow-hidden border border-white/5 bg-gray-800"
                        style={{ width: 90, height: 90 }}
                    >
                        <img 
                            src={member.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${index}&backgroundColor=transparent`} 
                            alt={member.name}
                            className="w-full h-full object-cover" 
                        />
                    </motion.div>

                    {/* Text Content */}
                    <AnimatePresence>
                        {isHovered && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -5 }}
                                transition={{ duration: 0.2, delay: 0.1 }}
                                className="pl-4 pr-6 flex flex-col justify-center min-w-[200px]"
                            >
                                <h3 className="text-white font-display font-medium text-lg truncate leading-tight">
                                    {member.name}
                                </h3>
                                <p className="text-primary/70 text-xs uppercase font-mono tracking-wider truncate mb-1">
                                    {member.role}
                                </p>
                                
                                <div className="flex gap-2">
                                    {member.github && (
                                        <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-[10px] text-gray-400 bg-white/5 px-2 py-0.5 rounded-full hover:bg-white/10 hover:text-white transition-colors">
                                            GITHUB
                                        </a>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            </motion.div>
        </motion.div>
    );
};

// --- Faculty Component (Holographic Card) ---
const FacultyCard = ({ member, index }) => (
    <motion.div
        initial={{ opacity: 0, x: -50, rotateY: -15, skewX: 10 }}
        whileInView={{ opacity: 1, x: 0, rotateY: 0, skewX: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ 
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: index * 0.1 
        }}
        whileHover={{ scale: 1.02 }}
        className="group relative h-full w-full overflow-hidden rounded-xl"
    >
        {/* Flash Effect - Fixed Gradient */}
        <motion.div 
            initial={{ x: "-100%", opacity: 0 }}
            whileInView={{ x: "200%", opacity: 1 }}
            transition={{ duration: 0.8, delay: (index * 0.1) + 0.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent z-20 -skew-x-12 pointer-events-none mix-blend-overlay"
        />

        {/* Animated Gradient Border */}
        <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/30 to-cyan-500/30 rounded-xl opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500" />
        
        {/* Main Card Content */}
        <div className="relative h-full bg-[#080808] border border-white/5 rounded-xl p-4 md:p-6 flex items-center gap-4 md:gap-6 overflow-hidden transition-colors hover:border-primary/20 z-10">
            
            {/* 3D Moving Light Glare (Desktop Hover) */}
            <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 group-hover:animate-[shine_1.5s_infinite]" />

            {/* Avatar Scanner Effect */}
            <div className="relative shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border border-white/10 group-hover:border-primary/50 transition-colors duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                <img 
                    src={member.image} 
                    alt={member.name} 
                    loading="eager"
                    className="w-full h-full object-cover" 
                />
                {/* Scanning Line - Made sharper and less obstructing */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent translate-y-[-100%] group-hover:animate-[scan_2s_linear_infinite] pointer-events-none mix-blend-overlay" />
            </div>

            <div className="relative z-10 w-full text-left">
                <h3 className="text-lg md:text-xl font-display font-medium text-white mb-1 group-hover:text-primary transition-colors">
                    {member.name}
                </h3>
                <div className="flex items-center justify-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)] animate-pulse"></span>
                    <p className="text-gray-400 text-xs uppercase tracking-widest font-mono">
                        {member.role}
                    </p>
                </div>
            </div>

            {/* Corner Decor */}
            <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-white/5 rounded-full group-hover:bg-cyan-500/50 transition-colors" />
            <div className="absolute bottom-2 right-2 flex gap-1">
                 <div className="w-1 h-3 bg-white/5 rounded-full group-hover:bg-primary/20 transition-colors delay-75" />
                 <div className="w-1 h-2 bg-white/5 rounded-full group-hover:bg-primary/20 transition-colors" />
            </div>
        </div>
    </motion.div>
);

export default About;
