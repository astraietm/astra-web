import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Flag, Cpu, ShieldAlert } from 'lucide-react';

const activities = [
    {
        icon: Terminal,
        title: "Cybersecurity Workshops",
        description: "Hands-on sessions on Linux, Networking, and Security fundamentals."
    },
    {
        icon: Flag,
        title: "CTF Competitions",
        description: "Participate in Capture The Flag events to test and sharpen your skills."
    },
    {
        icon: Cpu,
        title: "Ethical Hacking Labs",
        description: "Safe, legal environments to practice penetration testing techniques."
    },
    {
        icon: ShieldAlert,
        title: "Cyber Awareness",
        description: "Educating the community on staying safe in the digital world."
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

const AboutSection = () => {
    return (
        <section className="py-20 md:py-32 bg-background relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] opacity-30"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px] opacity-30"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <motion.div 
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="max-w-4xl mx-auto mb-20 text-center"
                >
                    <motion.div variants={fadeInUp}>
                        <h2 className="text-4xl md:text-5xl font-display font-medium text-white mb-6">
                            About <span className="text-primary">ASTRA</span>
                        </h2>
                    </motion.div>
                    <motion.div variants={fadeInUp}>
                        <p className="text-gray-400 text-lg md:text-xl font-light leading-relaxed">
                            ASTRA is the official platform for cybersecurity enthusiasts at KMCT IETM. 
                            Our mission is to foster a community of ethical hackers, security researchers, and 
                            technology leaders who are equipped to tackle tomorrow's digital threats. 
                            We bridge the gap between academic theory and real-world application.
                        </p>
                    </motion.div>
                </motion.div>

                <motion.div 
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {activities.map((item, index) => (
                        <motion.div 
                            key={index} 
                            variants={fadeInUp}
                            whileHover={{ y: -10 }}
                            className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all duration-300 h-full flex flex-col items-center text-center group relative overflow-hidden"
                        >
                             <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform relative z-10">
                                <item.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-display font-medium text-white mb-3 relative z-10">
                                {item.title}
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed relative z-10">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default AboutSection;
