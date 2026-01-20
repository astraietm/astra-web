import React from 'react';

const BackgroundOrbs = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
       <div 
        className="absolute top-0 right-0 w-[500px] h-[500px] sm:w-[800px] sm:h-[800px] bg-primary/5 rounded-full blur-[40px] sm:blur-[120px] opacity-30 transform-gpu"
       />
       
       <div 
        className="absolute bottom-0 left-0 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-blue-500/5 rounded-full blur-[40px] sm:blur-[100px] opacity-20 transform-gpu"
       />
    </div>
  );
};

export default BackgroundOrbs;
