import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = "px-6 py-3 font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-primary text-black hover:bg-white hover:shadow-[0_0_20px_rgba(0,224,255,0.4)]",
    outline: "border border-white/20 text-white hover:bg-white/10",
    ghost: "text-primary hover:text-white"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
