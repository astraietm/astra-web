import React, { useRef } from 'react';
import { motion } from 'framer-motion';

const ScrollReveal = ({ 
    children, 
    width = "fit-content",
    variant = "up", // up, down, left, right, scale, blur
    delay = 0,
    duration = 0.4, // Faster default duration
    className = "",
    once = true,
    amount = 0.1 // Triggers sooner
}) => {
    const ref = useRef(null);

    const getVariants = () => {
        const base = {
            hidden: { opacity: 0 },
            visible: { opacity: 1 }
        };

        // Snappier spring physics
        const transition = { 
            duration, 
            delay, 
            type: "spring", 
            stiffness: 100, 
            damping: 20,
            mass: 0.5 // Lighter mass for faster movement
        };

        switch (variant) {
            case "up":
                return {
                    hidden: { ...base.hidden, y: 30 },
                    visible: { ...base.visible, y: 0, transition }
                };
            case "down":
                return {
                    hidden: { ...base.hidden, y: -30 },
                    visible: { ...base.visible, y: 0, transition }
                };
            case "left":
                return {
                    hidden: { ...base.hidden, x: 30 },
                    visible: { ...base.visible, x: 0, transition }
                };
            case "right":
                return {
                    hidden: { ...base.hidden, x: -30 },
                    visible: { ...base.visible, x: 0, transition }
                };
            case "scale":
                return {
                    hidden: { ...base.hidden, scale: 0.95 },
                    visible: { ...base.visible, scale: 1, transition }
                };
            case "blur":
                return {
                    hidden: { ...base.hidden, filter: "blur(10px)", opacity: 0, scale: 0.95 },
                    visible: { ...base.visible, filter: "blur(0px)", opacity: 1, scale: 1, transition }
                };
            default: // up
                return {
                    hidden: { ...base.hidden, y: 30 },
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
                whileInView="visible"
                viewport={{ once, amount }}
                style={{ willChange: "transform, opacity, filter" }}
            >
                {children}
            </motion.div>
        </div>
    );
};

export default ScrollReveal;
