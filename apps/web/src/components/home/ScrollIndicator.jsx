import React from 'react';

const ScrollIndicator = () => {
  return (
    <div 
        className="absolute bottom-24 left-1/2 transform -translate-x-1/2 hidden md:flex flex-col items-center gap-3"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-mono">Scroll to Scan</span>
        <div className="w-[20px] h-[35px] border-2 border-primary/30 rounded-full flex justify-center p-1">
            <div 
                className="w-1 h-1 bg-primary rounded-full animate-bounce"
            />
        </div>
      </div>
  );
};

export default ScrollIndicator;
