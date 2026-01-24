import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import LightRays from "../common/LightRays";

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      {/* Light Rays Background */}
      <div className="absolute inset-0 z-0">
          <LightRays
            raysOrigin="top-center"
            raysColor="#ffffff"
            raysSpeed={1}
            lightSpread={0.5}
            rayLength={3}
            followMouse={true}
            mouseInfluence={0.1}
            noiseAmount={0}
            distortion={0}
            className="custom-rays"
            pulsating={false}
            fadeDistance={1}
            saturation={1}
        />
      </div>

      {/* 3D Visual Element - Abstract Triangle Shape */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        className="absolute right-[10%] top-1/2 hidden -translate-y-1/2 lg:block"
      >
        <svg
          width="400"
          height="400"
          viewBox="0 0 400 400"
          fill="none"
          className="animate-float"
        >
          <defs>
            <linearGradient id="triangleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#a3a3a3" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#525252" stopOpacity="0.1" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            d="M200 40 L360 320 Q200 380 40 320 Z"
            fill="none"
            stroke="url(#triangleGradient)"
            strokeWidth="2"
            filter="url(#glow)"
            className="animate-pulse-glow"
          />
          <path
            d="M200 80 L320 280 Q200 320 80 280 Z"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />
        </svg>
      </motion.div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-between px-4 sm:px-6 pb-12 pt-28">
        {/* Main Content */}
        <div className="flex flex-1 flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <h1 className="text-balance text-5xl font-normal leading-[0.9] tracking-tight text-foreground sm:text-7xl md:text-8xl lg:text-9xl">
              ASTRA
              <br />
              <span className="italic text-2xl sm:text-4xl md:text-5xl text-muted-foreground block mt-3 sm:mt-5">
                Cybersecurity Association of KMCT IETM
              </span>
            </h1>
          </motion.div>
        </div>


      </div>
    </section>
  );
}
