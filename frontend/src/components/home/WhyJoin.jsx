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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-start">
                    {/* Left Column - Text */}
                    <div className="lg:sticky lg:top-32">
                        <FadeInUp>
                            <h2 className="text-4xl md:text-5xl font-display font-medium text-white mb-6">
                                Mission & Vision
                            </h2>
                        </FadeInUp>
                        <FadeInUp delay={0.1}>
                            <p className="text-gray-400 text-lg font-light leading-relaxed max-w-lg">
                                ASTRA builds a strong cybersecurity culture on campus through practical
                                learning, peer mentorship, and responsible innovation.
                            </p>
                        </FadeInUp>
                    </div>

                    {/* Right Column - Mission Cards */}
                    <div className="flex flex-col gap-6">
                        {missions.map((item, index) => (
                            <FadeInUp key={index} delay={index * 0.1}>
                                <div
                                    className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-2xl hover:bg-white/10 transition-colors duration-300"
                                >
                                    <h3 className="text-xl font-display font-medium text-white mb-3">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-400 leading-relaxed font-light">
                                        {item.description}
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
