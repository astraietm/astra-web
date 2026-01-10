import React from 'react';
import CipherReveal from './CipherReveal';
import { Terminal } from 'lucide-react';

const CyberSectionHeader = ({ title, subtitle, className = "" }) => {
    return (
        <div className={`mb-10 md:mb-16 flex flex-col items-start gap-2 ${className}`}>
            <div className="flex items-center gap-2 text-primary/80 font-mono text-xs md:text-sm uppercase tracking-widest px-3 py-1 border border-primary/20 rounded-full bg-primary/5">
                <Terminal className="w-3 h-3 md:w-4 md:h-4" />
                <span>root@astra:~/sudo {subtitle || "execute"}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white leading-tight">
                <span className="text-primary mr-2 md:mr-4">{">"}</span>
                <CipherReveal text={title} />
                <span className="animate-pulse text-primary ml-1">_</span>
            </h2>
        </div>
    );
};

export default CyberSectionHeader;
