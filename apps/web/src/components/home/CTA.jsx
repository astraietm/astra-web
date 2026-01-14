import React from 'react';
import ScrollReveal from '../common/ScrollReveal';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';


const CTA = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
            <div 
                className="relative rounded-3xl p-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"
            >
                <div className="relative rounded-3xl overflow-hidden bg-white/5 px-8 py-20 md:p-24 text-center backdrop-blur-2xl">
                    {/* Aurora Background */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-float"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-float" style={{ animationDelay: '-2s' }}></div>

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 mb-8 backdrop-blur-md">
                            <ShieldCheck className="w-4 h-4 text-cyan-400" />
                            <span className="text-sm font-medium text-white">Secure Your Future</span>
                        </div>
                        
                        <ScrollReveal variant="scale">
                            <h2 className="text-5xl md:text-7xl font-display font-medium text-white mb-8 tracking-tight">
                                Ready to <span className="text-gradient-primary">Initialize?</span>
                            </h2>
                        </ScrollReveal>
                        
                        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                            Join elite researchers and architects building the next generation of secure systems.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <ScrollReveal delay={0.2} variant="left">
                                <Link 
                                    to="/contact" 
                                    className="inline-flex w-full sm:w-auto items-center justify-center px-8 py-4 bg-white text-black font-semibold rounded-full hover:shadow-lg hover:shadow-white/10 transition-all gap-2 group"
                                >
                                    Start Application <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </ScrollReveal>
                            <ScrollReveal delay={0.3} variant="right">
                                <Link 
                                    to="/about" 
                                    className="inline-flex w-full sm:w-auto items-center justify-center px-8 py-4 bg-transparent border border-white/10 text-white font-semibold rounded-full hover:bg-white/5 transition-all"
                                >
                                    Learn More
                                </Link>
                            </ScrollReveal>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};

export default CTA;
