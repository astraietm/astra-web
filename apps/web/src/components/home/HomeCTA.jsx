import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function HomeCTA() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section className="relative border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center"
        >
          <h2 className="max-w-2xl text-balance text-3xl font-normal tracking-tight text-foreground md:text-4xl lg:text-5xl">
            Ready to build the future?
          </h2>
          <p className="mt-4 max-w-md text-muted-foreground">
            Join 200+ developers competing for ₹50K+ in prizes. Limited spots
            available.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/register/astra-2026">
                <Button
                size="lg"
                className="btn-premium group gap-2 rounded-full bg-foreground px-8 text-background hover:bg-foreground/90"
                >
                Register Now
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
            </Link>
            <Link to="/about">
                <Button
                variant="outline"
                size="lg"
                className="rounded-full px-8 bg-transparent"
                >
                Learn More
                </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HomeCTA;
