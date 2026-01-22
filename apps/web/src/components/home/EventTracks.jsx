import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Shield, Brain, Lightbulb, Blocks, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const tracks = [
  {
    icon: Shield,
    title: "Cyber Security",
    description: "Build defense systems, ethical hacking tools, and security solutions for the digital age.",
    tags: ["Encryption", "Penetration Testing", "Zero Trust"],
    gradient: "from-blue-500/20 to-cyan-500/20",
    border: "group-hover:border-cyan-500/50"
  },
  {
    icon: Brain,
    title: "AI/ML",
    description: "Create intelligent systems using machine learning, neural networks, and generative AI.",
    tags: ["Deep Learning", "NLP", "Computer Vision"],
    gradient: "from-purple-500/20 to-pink-500/20",
    border: "group-hover:border-purple-500/50"
  },
  {
    icon: Lightbulb,
    title: "Open Innovation",
    description: "Solve real-world problems with creative solutions. No boundaries, just innovation.",
    tags: ["Social Impact", "Sustainability", "EdTech"],
    gradient: "from-amber-500/20 to-orange-500/20",
    border: "group-hover:border-amber-500/50"
  },
  {
    icon: Blocks,
    title: "Web3",
    description: "Build the decentralized future with blockchain, DeFi, and distributed applications.",
    tags: ["Smart Contracts", "DeFi", "NFTs"],
    gradient: "from-emerald-500/20 to-teal-500/20",
    border: "group-hover:border-emerald-500/50"
  },
];

export function EventTracks() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section id="tracks" className="relative bg-background py-32 overflow-hidden">
       {/* Ambient Background Glows */}
       <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[128px] pointer-events-none" />
       <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-24 max-w-2xl"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px w-8 bg-blue-500" />
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
              Event Tracks
            </p>
          </div>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6">
            CHOOSE YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">PATH</span>
          </h2>
          <p className="text-lg text-gray-400 leading-relaxed max-w-lg">
            Four specialized tracks designed to challenge boundaries. 
            Pick your domain and architect the future.
          </p>
        </motion.div>

        {/* Tracks Grid */}
        <div ref={containerRef} className="grid gap-6 md:grid-cols-2 lg:gap-8">
          {tracks.map((track, index) => (
            <motion.div
              key={track.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={cn(
                "group relative p-8 md:p-12 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:bg-white/[0.04]",
                track.border
              )}
            >
               {/* Hover Gradient Overlay */}
               <div className={cn(
                   "absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br pointer-events-none",
                   track.gradient
               )} />

              <div className="relative z-10">
                {/* Icon Header */}
                <div className="mb-8 flex items-start justify-between">
                  <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-500">
                    <track.icon className="h-6 w-6 text-white" />
                  </div>
                  <ArrowUpRight className="h-6 w-6 text-white/30 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                </div>

                {/* Text Content */}
                <h3 className="text-3xl font-bold text-white mb-4 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-colors">
                  {track.title}
                </h3>
                <p className="text-base text-gray-400 leading-relaxed mb-8">
                  {track.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {track.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs font-medium uppercase tracking-wider text-white/50 bg-white/5 rounded-full border border-white/5 group-hover:border-white/20 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
