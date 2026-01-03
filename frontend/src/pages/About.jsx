import React from 'react';
import { Shield, Target, Globe, BookOpen, Terminal, Wifi, Lock, Cpu, Quote } from 'lucide-react';
import FadeInUp from '../components/common/FadeInUp';
import HackerText from '../components/common/HackerText';
import { motion } from 'framer-motion';
import { facultyMembers, coreMembers } from '../data/team';

// ----------------------------------------------------------------------
// NOTE: To update the team members, edit the file: src/data/team.js
// ----------------------------------------------------------------------

const focusAreas = [
    {
        icon: BookOpen,
        title: "Cybersecurity Education",
        description: "Bridging the gap between theory and practice with comprehensive study materials and sessions."
    },
    {
        icon: Terminal,
        title: "Ethical Hacking",
        description: "Promoting responsible disclosure and hands-on penetration testing skills in safe environments."
    },
    {
        icon: Wifi,
        title: "Network Security",
        description: "Deep diving into protocols, traffic analysis, and securing infrastructure against modern threats."
    },
    {
        icon: Lock,
        title: "Cyber Awareness",
        description: "Educating students and the community about digital hygiene, privacy, and staying safe online."
    }
];

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

const About = () => {
    return (
        <div className="bg-background min-h-screen pt-32 pb-20 relative overflow-hidden">
             {/* Ultra-Dynamic Background */}
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-background to-background pointer-events-none"></div>
             
             <div className="absolute inset-0 pointer-events-none">
                 {/* Moving Grid */}
                 <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:60px_60px] opacity-40 animate-[pulse_8s_ease-in-out_infinite]"></div>
                 
                 {/* Rotating Nebula Orbs */}
                 <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] md:w-[1000px] md:h-[1000px] bg-primary/10 rounded-full blur-[120px] animate-[spin_60s_linear_infinite] opacity-40"></div>
                 <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] md:w-[800px] md:h-[800px] bg-blue-600/10 rounded-full blur-[120px] animate-[spin_40s_linear_infinite_reverse] opacity-30"></div>
                 
                 {/* Floating Particles */}
                 <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-ping opacity-20"></div>
                 <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-blue-500 rounded-full animate-pulse opacity-20"></div>
                 <div className="absolute bottom-10 left-1/2 w-1 h-1 bg-white rounded-full animate-bounce opacity-40"></div>
             </div>
             
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

                {/* Mission & Vision */}
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
                                
                                <div className="relative w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-8">
                                    <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl animate-[spin_4s_linear_infinite]"></div>
                                    <div className="relative w-full h-full bg-gradient-to-br from-primary/20 to-transparent rounded-2xl flex items-center justify-center text-primary ring-1 ring-primary/30 group-hover:scale-110 transition-all duration-500 z-10">
                                        <Target className="w-8 h-8 md:w-10 md:h-10 animate-[pulse_3s_ease-in-out_infinite]" />
                                    </div>
                                </div>
                                
                                <h2 className="text-[10px] md:text-sm font-mono text-primary tracking-[0.3em] uppercase mb-2 md:mb-4">Our Vision</h2>
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
                            <h2 className="text-xl md:text-3xl font-display font-medium text-white">Our Mission</h2>
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

                {/* Message from HOD */}
                <div className="max-w-6xl mx-auto mb-16 md:mb-32 px-4 md:px-0">
                    <FadeInUp delay={0.4}>
                        <div className="flex flex-col lg:grid lg:grid-cols-[400px_1fr] gap-8 md:gap-20 items-center">
                            
                            {/* Left: Image & Badge */}
                            <div className="relative flex flex-col items-center">
                                <div className="relative w-40 h-40 md:w-80 md:h-80 rounded-full border border-primary/20 p-2">
                                     {/* Spinning Ring */}
                                     <div className="absolute inset-0 rounded-full border border-dashed border-primary/20 animate-[spin_20s_linear_infinite]"></div>
                                     
                                     <div className="w-full h-full rounded-full overflow-hidden bg-gray-900 relative z-10">
                                        <img 
                                            src="images/hod.jpg" 
                                            alt="Thara Krishnan R" 
                                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                                            onError={(e) => {e.target.style.display='none'; e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-white/20">IMG</div>';}}
                                        />
                                     </div>

                                     {/* Quote Badge Overlay */}
                                     <div className="absolute bottom-2 right-4 md:bottom-10 md:right-4 w-10 h-10 md:w-16 md:h-16 bg-primary rounded-full flex items-center justify-center text-black z-20 shadow-lg shadow-primary/20">
                                         <Quote className="w-5 h-5 md:w-8 md:h-8 fill-current" />
                                     </div>
                                </div>
                                
                                <div className="mt-4 md:mt-8 text-center">
                                    <h4 className="text-white font-display font-bold text-lg md:text-2xl tracking-wide uppercase">Asst Prof. Thara Krishnan R</h4>
                                    <div className="h-1 w-8 md:w-12 bg-primary mx-auto my-2 md:my-3 rounded-full"></div>
                                    <p className="text-gray-400 font-mono text-[10px] md:text-xs uppercase tracking-[0.2em]">Head of Department</p>
                                </div>
                            </div>

                            {/* Right: Content */}
                            <div className="text-left">
                                <h2 className="text-2xl md:text-5xl font-display font-serif text-white mb-4 md:mb-8 block text-center lg:text-left">
                                    Message from <span className="text-primary italic">HOD</span>
                                </h2>
                                
                                <p className="text-gray-300 text-sm md:text-lg leading-relaxed font-light font-sans text-center lg:text-left">
                                    "Welcome to the Department of Cyber Security at KMCT Institute of Emerging Technology and Management. As cyber threats become increasingly sophisticated, our commitment is to prepare you for the forefront of this critical field. Our department offers a dynamic curriculum, cutting-edge labs, and opportunities for real-world experience to ensure you are equipped with the skills needed to protect and defend against digital threats. 
                                    <br /><br />
                                    Our experienced faculty members are dedicated to providing high-quality education and mentorship, helping you develop a deep understanding of cyber security principles and practices. We emphasize a hands-on approach to learning, encouraging innovation and practical problem-solving. We are proud of the resources and support available to our students and are excited to guide you on your journey to becoming a leader in cyber security. Together, we will work to advance the field and address the challenges of securing the digital landscape. Welcome aboard, and we look forward to your success and contributions in this vital area."
                                </p>
                            </div>

                        </div>
                    </FadeInUp>
                </div>

                {/* Active Personnel / Team Section */}
                <div className="max-w-7xl mx-auto mb-12 md:mb-24 px-4 md:px-0">
                     <FadeInUp delay={0.6}>
                        <div className="flex items-center gap-2 md:gap-3 mb-6 md:mb-10 border-b border-white/10 pb-4">
                            <Shield className="w-4 h-4 md:w-6 md:h-6 text-primary" />
                            <h2 className="text-xl md:text-3xl font-display font-bold tracking-tight text-white">Active Personnel</h2>
                            <span className="ml-auto text-[10px] md:text-xs font-mono text-primary bg-primary/10 px-2 md:px-3 py-1 rounded border border-primary/20 animate-pulse">STATUS: ONLINE</span>
                        </div>
                     </FadeInUp>
                     
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
                                                <p className="text-[10px] md:text-xs font-mono text-gray-500 uppercase tracking-widest mb-2 md:mb-3">{member.role}</p>
                                                <div className="h-[1px] w-full bg-white/10 mb-2 md:mb-3"></div>
                                                <div className="flex justify-between text-[10px] font-mono text-gray-600 group-hover:text-primary/70">
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
                                            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em] mb-6">{member.role}</p>
                                            
                                            {/* Footer Specs */}
                                            <div className="w-full mt-auto pt-4 border-t border-white/10 flex justify-between text-[10px] font-mono text-gray-600 group-hover:text-primary max-w-[80%] mx-auto">
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
