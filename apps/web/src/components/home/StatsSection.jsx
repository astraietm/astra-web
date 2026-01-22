import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const stats = [
  {
    value: 36,
    suffix: "hr",
    label: "Of Non-stop Innovation",
  },
  {
    value: 50,
    prefix: "₹",
    suffix: "K+",
    label: "In prizes and rewards",
  },
  {
    value: 300,
    suffix: "+",
    label: "Participants building together",
  },
  {
    value: 4,
    label: "Industry-focused tracks",
  },
];

function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
}) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section className="relative border-y border-border bg-background py-5 mt-2">
      <div
        ref={containerRef}
        className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-border md:grid-cols-4 md:divide-y-0"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.6,
              delay: index * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex flex-col items-start justify-between p-8 md:p-12"
          >
            <p className="text-4xl font-light tracking-tight text-foreground md:text-5xl lg:text-6xl">
              <AnimatedCounter
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
              />
            </p>
            <p className="mt-4 text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
