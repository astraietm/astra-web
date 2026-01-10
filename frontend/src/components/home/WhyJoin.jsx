import React from 'react';
import { BentoGrid, BentoGridItem } from './BentoGrid';
import { Terminal, Target, Users, Award, Shield, Code, ArrowRight } from 'lucide-react';
import FadeInUp from '../common/FadeInUp';

import CyberSectionHeader from '../common/CyberSectionHeader';

const WhyJoin = () => {
  return (
    <section className="py-20 md:py-32 bg-background relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto flex flex-col items-center mb-16 md:mb-24">
            <FadeInUp>
                 <CyberSectionHeader 
                    title="SYSTEM_BENEFITS"
                    subtitle="load_protocols"
                    className="items-center text-center"
                 />
                <p className="text-gray-400 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed mt-[-20px]">
                    Accelerate your growth from student to cyber-professional with our hands-on ecosystem.
                </p>
            </FadeInUp>
        </div>

        <BentoGrid className="max-w-6xl mx-auto md:auto-rows-[20rem]">
          {items.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              header={item.header}
              icon={item.icon}
              className={i === 3 || i === 6 ? "md:col-span-2" : ""}
            />
          ))}
        </BentoGrid>
      </div>
    </section>
  );
};

const HeaderImage = ({ color }) => (
    <div className={`flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br ${color} opacity-20`} />
);

const items = [
  {
    title: "Skill Development",
    description: "Master industry-standard tools like Kali Linux, Metasploit, Wireshark, and Python through hands-on labs.",
    header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-800 items-center justify-center border border-white/5">
                <Terminal className="w-16 h-16 text-neutral-700 group-hover/bento:text-primary transition-colors" />
            </div>,
    icon: <Code className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "CTF Competitions",
    description: "Test your skills in global Capture The Flag events. Compete, rank up, and get recognized.",
    header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-800 items-center justify-center border border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/10 animate-pulse" />
                <Target className="w-16 h-16 text-primary z-10" />
            </div>,
    icon: <Target className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Networking",
    description: "Connect with alumni, industry experts, and like-minded peers in the cybersecurity space.",
    header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-800 items-center justify-center border border-white/5">
                <Users className="w-16 h-16 text-neutral-700 group-hover/bento:text-blue-500 transition-colors" />
            </div>,
    icon: <Users className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Professional Certifications",
    description: "Guidance on achieving CEH, OSCP, CompTIA Security+, and other recognized certifications.",
    header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-800 items-center justify-center border border-white/5">
                <Award className="w-20 h-20 text-neutral-700 group-hover/bento:text-yellow-500 transition-colors" />
             </div>,
    icon: <Award className="h-4 w-4 text-neutral-500" />,
  },
];

export default WhyJoin;
