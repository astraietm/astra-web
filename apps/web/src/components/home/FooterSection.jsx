import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Github, Twitter, Linkedin, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const socialLinks = [
  { icon: Github, href: "https://github.com/astraietm", label: "GitHub" },
  { icon: Instagram, href: "https://instagram.com/astra.ietm", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Twitter, href: "#", label: "Twitter" },
];

const footerLinks = [
  {
    title: "Platform",
    links: [
      { label: "Events", href: "/events" },
      { label: "Gallery", href: "/gallery" },
    ],
  },
  {
    title: "Company",
    links: [
        { label: "About Us", href: "/about" },
        { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
        { label: "Terms", href: "/terms" },
        { label: "Refund Policy", href: "/refund-policy" },
        { label: "Shipping Policy", href: "/shipping-policy" },
        { label: "Privacy Policy", href: "/privacy" },
    ],
  },
];

export function FooterSection() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <footer className="relative border-t border-border bg-background">
      {/* CTA Section */}
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

      {/* Footer Links */}
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold tracking-tight">
                  ASTRA
                </span>
                <span className="rounded border border-border px-1.5 py-0.5 text-[10px] font-medium tracking-widest text-muted-foreground">
                  25
                </span>
              </div>
              <p className="mt-4 max-w-xs text-sm text-muted-foreground">
                Securing the digital frontier through innovation, elite research, and next-gen defense systems.
              </p>
              {/* Social Links */}
              <div className="mt-6 flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            {footerLinks.map((group) => (
              <div key={group.title}>
                <h3 className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  {group.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        className="text-sm text-foreground transition-colors hover:text-muted-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Astra Security. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
                <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
                <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
                <span>Designed by Astra</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
