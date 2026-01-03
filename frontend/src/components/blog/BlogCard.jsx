import React, { useRef, useState } from 'react';

import { Calendar, User, ArrowRight, Tag } from 'lucide-react';

const BlogCard = ({ post, index }) => {
  const divRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current || isFocused) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
        ref={divRef}
        onMouseMove={handleMouseMove}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative bg-surface border border-white/5 rounded-2xl overflow-hidden group flex flex-col h-full"
    >
        {/* Spotlight Effect */}
         <div
            className='pointer-events-none absolute -inset-px transition opacity-500 rounded-2xl'
            style={{
                opacity,
                background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(0, 255, 157, 0.1), transparent 40%)`,
            }}
        />
        <div
            className='pointer-events-none absolute -inset-px transition opacity-500 rounded-2xl'
            style={{
                opacity,
                background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(0, 255, 157, 0.3), transparent 40%)`,
                maskImage: 'linear-gradient(black, black) content-box, linear-gradient(black, black)',
                WebkitMaskImage: 'linear-gradient(black, black) content-box, linear-gradient(black, black)',
                maskComposite: 'exclude',
                WebkitMaskComposite: 'xor',
            }}
        />

        <div className="relative h-52 overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-tr from-surface/80 to-transparent z-10"></div>
            <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
                <div className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-md border border-white/10 text-primary text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                <Tag className="w-3 h-3" />
                {post.category}
            </div>
        </div>
        <div className="p-6 flex-grow flex flex-col relative z-20">
            <div className="flex items-center gap-4 text-xs font-medium text-gray-500 mb-4">
                    <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" />
                    <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <User className="w-3 h-3" />
                    <span>{post.author}</span>
                </div>
            </div>
            <h2 className="text-xl font-display font-bold mb-3 leading-snug group-hover:text-primary transition-colors">{post.title}</h2>
            <p className="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">
                {post.excerpt}
            </p>
            <button className="flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-wider hover:gap-3 transition-all mt-auto self-start">
                Read Article <ArrowRight className="w-4 h-4" />
            </button>
        </div>
    </div>
  );
};

export default BlogCard;
