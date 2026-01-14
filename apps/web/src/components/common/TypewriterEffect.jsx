import React, { useState, useEffect } from 'react';

const TypewriterEffect = ({ text, speed = 50, delay = 0, className = "" }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setStarted(true);
        }, delay);
        return () => clearTimeout(timeout);
    }, [delay]);

    useEffect(() => {
        if (!started) return;

        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex <= text.length) {
                setDisplayedText(text.slice(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(interval);
            }
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed, started]);

    return (
        <span className={`${className} font-mono`}>
            {displayedText}
            <span className="animate-pulse">_</span>
        </span>
    );
};

export default TypewriterEffect;
