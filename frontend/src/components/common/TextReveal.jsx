import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const TextReveal = ({ text, className = "", delay = 0 }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });
    
    // Split text into words
    const words = text.split(" ");

    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: delay }
        }
    };

    const child = {
        hidden: { 
            opacity: 0,
            y: 20,
            filter: "blur(10px)",
        },
        visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
                duration: 0.8,
                ease: [0.2, 0.65, 0.3, 0.9]
            }
        }
    };

    return (
        <motion.div 
            ref={ref}
            variants={container}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className={`flex flex-wrap ${className}`}
        >
            {words.map((word, index) => (
                <motion.span key={index} variants={child} className="mr-[0.2em] last:mr-0 inline-block">
                    {word}
                </motion.span>
            ))}
        </motion.div>
    );
};

export default TextReveal;
