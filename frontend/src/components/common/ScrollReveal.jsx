import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const ScrollReveal = ({ 
    children, 
    width = "fit-content",
    variant = "up", // up, down, left, right, scale, blur
    delay = 0,
    duration = 0.8,
    className = "",
    once = true,
    amount = 0.3
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once, amount });

    const getVariants = () => {
        const base = {
            hidden: { opacity: 0 },
            visible: { opacity: 1 }
        };

        const transition = { 
            duration, 
            delay, 
            type: "spring", 
            stiffness: 50, 
            damping: 20 
        };

        switch (variant) {
            case "up":
                return {
                    hidden: { ...base.hidden, y: 50 },
                    visible: { ...base.visible, y: 0, transition }
                };
            case "down":
                return {
                    hidden: { ...base.hidden, y: -50 },
                    visible: { ...base.visible, y: 0, transition }
                };
            case "left":
                return {
                    hidden: { ...base.hidden, x: 50 },
                    visible: { ...base.visible, x: 0, transition }
                };
            case "right":
                return {
                    hidden: { ...base.hidden, x: -50 },
                    visible: { ...base.visible, x: 0, transition }
                };
            case "scale":
                return {
                    hidden: { ...base.hidden, scale: 0.9 },
                    visible: { ...base.visible, scale: 1, transition }
                };
            case "blur":
                return {
                    hidden: { ...base.hidden, filter: "blur(10px)", opacity: 0, scale: 0.95 },
                    visible: { ...base.visible, filter: "blur(0px)", opacity: 1, scale: 1, transition }
                };
            default: // up
                return {
                    hidden: { ...base.hidden, y: 50 },
                    visible: { ...base.visible, y: 0, transition }
                };
        }
    };


    const variants = getVariants();

    return (
        <div ref={ref} style={{ position: "relative", width }} className={className}>
            <motion.div
                variants={variants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
            >
                {children}
            </motion.div>
        </div>
    );
};

export default ScrollReveal;
