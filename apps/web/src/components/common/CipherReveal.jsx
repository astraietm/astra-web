import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+-=[]{}|;:,.<>?";

const CipherReveal = ({ text, className = "", delay = 0 }) => {
    const [display, setDisplay] = useState("");
    const [isRevealed, setIsRevealed] = useState(false);

    useEffect(() => {
        let iterations = 0;
        const interval = setInterval(() => {
            setDisplay(
                text
                    .split("")
                    .map((char, index) => {
                        if (index < iterations) {
                            return text[index];
                        }
                        return CHARS[Math.floor(Math.random() * CHARS.length)];
                    })
                    .join("")
            );

            if (iterations >= text.length) {
                clearInterval(interval);
                setIsRevealed(true);
            }

            iterations += 1 / 2; // Speed of reveal
        }, 50); // Speed of scramble

        // Start delay
        const startTimeout = setTimeout(() => {
             // Logic is handled by interval, but we could delay the start of the interval here
        }, delay * 1000);

        return () => {
            clearInterval(interval);
            clearTimeout(startTimeout);
        };
    }, [text, delay]);

    return (
        <span className={className}>
            {display}
        </span>
    );
};

export default CipherReveal;
