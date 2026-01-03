import React from 'react';

const GlitchText = ({ text, className = "" }) => {
    return (
        <span className={`relative inline-block group ${className}`}>
            <span className="relative z-10">{text}</span>
            <span 
                className="absolute top-0 left-0 -z-10 w-full h-full text-red-500 opacity-70 animate-pulse translate-x-[2px] transition-all duration-100 mix-blend-screen"
                aria-hidden="true"
            >
                {text}
            </span>
            <span 
                className="absolute top-0 left-0 -z-10 w-full h-full text-blue-500 opacity-70 animate-pulse -translate-x-[2px] transition-all duration-100 mix-blend-screen"
                style={{ animationDelay: '0.1s' }}
                aria-hidden="true"
            >
                {text}
            </span>
        </span>
    );
};

export default GlitchText;
