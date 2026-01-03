import React from 'react';

const BackgroundOrbs = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
       <div 
        className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] opacity-30 animate-pulse"
       />
       
       <div 
        className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] opacity-20 animate-pulse"
       />
    </div>
  );
};

export default BackgroundOrbs;
