import React from 'react';
import FadeInUp from '../common/FadeInUp';


const missions = [
    {
        title: "Mission",
        description: "Accessible, hands-on security education—workshops, labs, and CTFs for every level."
    },
    {
        title: "Vision",
        description: "A community of ethical hackers and builders who protect, innovate, and lead."
    },
    {
        title: "Culture",
        description: "Learn in public, share notes, collaborate on projects, and grow fast—together."
    }
];

const WhyJoin = () => {
    return (
        <section className="py-20 md:py-32 bg-background relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-start">
                    {/* Left Column - Text */}
                    <div className="lg:sticky lg:top-32">
                        <FadeInUp>
                            <h2 className="text-3xl md:text-5xl font-display font-medium text-white mb-6">
                                Why Join ASTRA?
                            </h2>
                        </FadeInUp>
                        <FadeInUp delay={0.1}>
                            <p className="text-gray-400 text-sm xs:text-base md:text-lg font-light leading-relaxed max-w-lg mb-8">
                                Depending on where you are in your journey, ASTRA accelerates your growth from student to professional.
                            </p>
                        </FadeInUp>
                        <FadeInUp delay={0.2}>
                             <div className="flex gap-4">
                                <div className="text-center">
                                    <h4 className="text-2xl md:text-3xl font-display font-bold text-primary">500+</h4>
                                    <span className="text-sm text-gray-500">Members</span>
                                </div>
                                <div className="w-[1px] bg-white/10 h-10"></div>
                                <div className="text-center">
                                    <h4 className="text-2xl md:text-3xl font-display font-bold text-primary">50+</h4>
                                    <span className="text-sm text-gray-500">Events</span>
                                </div>
                             </div>
                        </FadeInUp>
                    </div>

                    {/* Right Column - Benefit Cards */}
                    <div className="flex flex-col gap-6">
                        {[
                            { title: "Skill Development", desc: "Master tools like Kali Linux, Metasploit, Wireshark, and Python for security." },
                            { title: "CTF Competitions", desc: "Compete in global and local Capture The Flag events to test your skills." },
                            { title: "Networking", desc: "Connect with alumni, industry experts, and like-minded peers." },
                            { title: "Certifications", desc: "Guidance on achieving CEH, OSCP, CompTIA Security+, and more." }
                        ].map((item, index) => (
                            <FadeInUp key={index} delay={index * 0.1}>
                                <div
                                    className="bg-white/5 border border-white/10 p-5 md:p-8 rounded-2xl hover:bg-white/10 transition-colors duration-300"
                                >
                                    <h3 className="text-lg md:text-xl font-display font-medium text-white mb-3 text-primary">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm md:text-base leading-relaxed font-light">
                                        {item.desc}
                                    </p>
                                </div>
                            </FadeInUp>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyJoin;
