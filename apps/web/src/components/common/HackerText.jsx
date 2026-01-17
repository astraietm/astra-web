import React, { useState, useEffect } from 'react';

const HackerText = ({ text, className = "", speed = 40 }) => {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = React.useRef(null);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";

  const scramble = () => {
    let iteration = 0;
    
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
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
        clearInterval(intervalRef.current);
        setDisplayText(text); // Ensure final state is correct
      }

      iteration += 1 / 3;
    }, speed);
  };

  useEffect(() => {
    scramble();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text]);

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
