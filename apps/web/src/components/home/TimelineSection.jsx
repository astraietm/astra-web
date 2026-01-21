import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Check } from "lucide-react";

const timelineEvents = [
  {
    phase: "01",
    title: "Registration Opens",
    date: "Jan 15, 2025",
    description:
      "Sign up individually or as a team. Early bird registrations get exclusive perks and priority access.",
    status: "completed",
  },
  {
    phase: "02",
    title: "Team Formation",
    date: "Jan 25, 2025",
    description:
      "Connect with other participants, form teams, and start brainstorming ideas for your project.",
    status: "completed",
  },
  {
    phase: "03",
    title: "Shortlisting",
    date: "Feb 1, 2025",
    description:
      "Selected teams will be announced. Get ready with your development environment and tools.",
    status: "current",
  },
  {
    phase: "04",
    title: "Grand Finale",
    date: "Feb 15-16, 2025",
    description:
      "24 hours of intense coding, mentorship sessions, and final presentations to the jury.",
    status: "upcoming",
  },
];

export function TimelineSection() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const lineHeight = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "100%"]);

  return (
    <section
      id="timeline"
      className="relative bg-background py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 text-center"
        >
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Schedule
          </p>
          <h2 className="mt-4 text-3xl font-normal tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Event Timeline
          </h2>
        </motion.div>

        {/* Timeline */}
        <div ref={containerRef} className="relative">
          {/* Progress Line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-border md:left-1/2 md:-translate-x-px">
            <motion.div
              className="absolute top-0 left-0 w-full bg-foreground"
              style={{ height: lineHeight }}
            />
          </div>

          {/* Events */}
          <div className="space-y-12 md:space-y-24">
            {timelineEvents.map((event, index) => (
              <motion.div
                key={event.phase}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`relative flex flex-col gap-4 md:flex-row md:items-center md:gap-12 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Content */}
                <div
                  className={`ml-20 flex-1 md:ml-0 ${
                    index % 2 === 0 ? "md:text-right" : "md:text-left"
                  }`}
                >
                  <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    {event.date}
                  </span>
                  <h3 className="mt-2 text-xl font-medium tracking-tight text-foreground">
                    {event.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-md">
                    {event.description}
                  </p>
                </div>

                {/* Node */}
                <div className="absolute left-8 md:static md:left-auto -translate-x-1/2 md:translate-x-0 flex h-4 w-4 items-center justify-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 ${
                      event.status === "completed"
                        ? "border-foreground bg-foreground"
                        : event.status === "current"
                          ? "border-foreground bg-background"
                          : "border-border bg-background"
                    }`}
                  >
                    {event.status === "completed" && (
                      <Check className="h-4 w-4 text-background" />
                    )}
                    {event.status === "current" && (
                      <div className="h-2 w-2 rounded-full bg-foreground animate-pulse" />
                    )}
                  </div>
                </div>

                {/* Phase Number */}
                <div
                  className={`hidden flex-1 md:block ${
                    index % 2 === 0 ? "text-left" : "text-right"
                  }`}
                >
                  <span className="text-6xl font-light text-border">
                    {event.phase}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
