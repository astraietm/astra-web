import React from 'react';

const Loader = () => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <div className="w-4 h-4 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-4 h-4 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-4 h-4 rounded-full bg-primary animate-bounce"></div>
    </div>
  );
};

export default Loader;
