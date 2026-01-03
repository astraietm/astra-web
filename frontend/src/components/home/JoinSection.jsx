import React from 'react';
import FadeInUp from '../common/FadeInUp';


const JoinSection = () => {
    return (
        <section className="py-20 lg:py-32 bg-background relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-6xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 lg:p-16 overflow-hidden relative">
                     {/* Background Glow */}
                     <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

                    <div className="flex flex-col items-center text-center">
                        <FadeInUp>
                            <h2 className="text-4xl font-display font-bold text-white mb-6">
                                Join ASTRA
                            </h2>
                        </FadeInUp>
                        <FadeInUp delay={0.1}>
                            <p className="text-gray-400 mb-8 leading-relaxed max-w-2xl">
                                UI-only form for now—this step focuses on a beautiful, interactive front-end.
                            </p>
                        </FadeInUp>
                        
                        <div className="flex flex-wrap justify-center gap-6">
                            {[
                                "Weekly sessions & guided learning",
                                "Mentorship, teams, and competitions",
                                "Projects, talks, and industry exposure"
                            ].map((item, i) => (
                                <FadeInUp key={i} delay={0.2 + (i * 0.1)}>
                                    <div className="flex items-center gap-3 text-gray-300 bg-white/5 px-4 py-2 rounded-full border border-white/5 hover:bg-white/10 transition-colors">
                                        <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"></span>
                                        {item}
                                    </div>
                                </FadeInUp>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default JoinSection;
