import React from 'react';
import { motion } from 'framer-motion';

const BackgroundOrbs = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
       <motion.div 
        animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] opacity-30"
       />
       
       <motion.div 
        animate={{ 
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.5, 1]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] opacity-20"
       />
    </div>
  );
};

export default BackgroundOrbs;
