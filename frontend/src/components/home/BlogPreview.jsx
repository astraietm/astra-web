

import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import FadeInUp from '../common/FadeInUp';

const blogs = [
    {
        category: "Guides",
        title: "Your First CTF: What to Expect",
        description: "A beginner-friendly overview of categories, strategy, and learning loops.",
    },
    {
        category: "Tooling",
        title: "Building a Lightweight Security Toolkit",
        description: "Browser extensions, CLI essentials, and how to stay organized ethically."
    },
    {
        category: "Ops",
        title: "Blue Team Basics: Reading Logs with Purpose",
        description: "Common signals, correlation thinking, and practical triage patterns."
    }
];

const BlogPreview = () => {
    return (
        <section className="py-20 md:py-32 bg-background relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="mb-10 md:mb-16">

                    <FadeInUp>
                         <h2 className="text-4xl md:text-5xl font-display font-medium text-white mb-6">
                            Blog Preview
                        </h2>
                    </FadeInUp>
                    <FadeInUp delay={0.1}>
                        <p className="text-gray-400 text-lg font-light">
                            Short reads on tools, walkthroughs, and security mindset—written by the ASTRA community.
                        </p>
                    </FadeInUp>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {blogs.map((blog, index) => (
                        <FadeInUp key={index} delay={index * 0.1}>
                             <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-2xl hover:bg-white/10 transition-colors group flex flex-col h-full">
                                <div className="mb-6">
                                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300 font-medium group-hover:border-primary/50 group-hover:text-primary transition-colors">
                                        {blog.category}
                                    </span>
                                </div>
                                
                                <h3 className="text-xl font-display font-medium text-white mb-4 leading-snug">
                                    {blog.title}
                                </h3>
                                
                                <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-grow">
                                    {blog.description}
                                </p>
                                
                                <Link to="/blog" className="flex items-center gap-2 text-primary font-medium text-sm hover:gap-3 transition-all">
                                    Read more <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </FadeInUp>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BlogPreview;
