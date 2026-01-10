import React from 'react';
import blogData from '../data/blogs.json';
import BlogCard from '../components/blog/BlogCard';

import CyberBackground from '../components/common/CyberBackground';

const Blog = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 bg-background relative overflow-hidden">
      <CyberBackground />
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Latest <span className="text-primary">Insights</span>
            </h1>
            <p className="text-gray-400 max-w-2xl text-lg">
                Articles, tutorials, and news from the cybersecurity world.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogData.map((post, index) => (
                <BlogCard key={post.id} post={post} index={index} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
