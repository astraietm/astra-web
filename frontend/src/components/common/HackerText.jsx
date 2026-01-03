import React, { useState, useEffect } from 'react';

const HackerText = ({ text, className = "", speed = 40 }) => {
  const [displayText, setDisplayText] = useState(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";

  const scramble = () => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(prev => 
        text
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }

      iteration += 1 / 3;
    }, speed);
    
    return interval;
  };

  useEffect(() => {
    const interval = scramble();
    return () => clearInterval(interval);
  }, [text]); // Run on mount/text change

  return (
    <span 
      className={`font-mono cursor-default inline-block ${className}`}
      onMouseEnter={scramble}
    >
      {displayText}
    </span>
  );
};

export default HackerText;
