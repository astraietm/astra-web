import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Terminal } from 'lucide-react';

const CTA = () => {
  return (
    <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-5xl">
            <div className="relative rounded-[3rem] overflow-hidden border border-white/10 bg-surface/50 p-12 md:p-24 text-center">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/50 rounded-full border border-white/10 mb-8 backdrop-blur-md">
                        <Terminal className="w-4 h-4 text-primary" />
                        <span className="text-sm font-mono text-gray-300">SYSTEM_READY</span>
                    </div>
                    
                    <h2 className="text-5xl md:text-7xl font-display font-bold text-white mb-8 tracking-tight">
                        Initialize Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Journey</span>
                    </h2>
                    
                    <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-light">
                        The firewall is open. The nodes are active. Join the next generation of digital defenders today.
                    </p>

                    <Link 
                        to="/contact" 
                        className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-bold text-lg rounded-full hover:bg-gray-200 transition-all hover:scale-105 btn-shine"
                    >
                        Join Deployment <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </div>
    </section>
  );
};

export default CTA;
