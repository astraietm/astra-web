import React from 'react';
import { Shield, Cpu, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
    {
        icon: Shield,
        title: "Elite Network",
        description: "Connect with the top security researchers and ethical hackers in the region.",
        gradient: "from-primary/20 to-green-500/20"
    },
    {
        icon: Cpu,
        title: "Skill Acquisition",
        description: "Master modern defense tactics through live-fire drills and workshops.",
        gradient: "from-blue-500/20 to-purple-500/20"
    },
    {
        icon: Globe,
        title: "Industry Access",
        description: "Direct pathways to internships and opportunities with leading cyber firms.",
        gradient: "from-orange-500/20 to-red-500/20"
    }
];

const WhyJoin = () => {
  return (
    <section className="py-16 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                Why <span className="text-primary">Initialize?</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
                We are not just a club. We are a protocol for excellence in the digital age.
            </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
                <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="group relative p-6 md:p-8 rounded-3xl bg-surface/30 border border-white/5 hover:border-white/10 transition-colors"
                >
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl blur-xl`}></div>
                    
                    <div className="relative z-10">
                        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <feature.icon className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-2xl font-display font-bold text-white mb-4">{feature.title}</h3>
                        <p className="text-gray-400 leading-relaxed">
                            {feature.description}
                        </p>
                    </div>
                </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default WhyJoin;
