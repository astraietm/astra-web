import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Terminal } from 'lucide-react';

const Loader = () => {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);

  const phases = [
    { text: 'Initializing security protocols', icon: Shield },
    { text: 'Establishing secure connection', icon: Lock },
    { text: 'Loading ASTRA systems', icon: Terminal },
  ];

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    const phaseInterval = setInterval(() => {
      setCurrentPhase((prev) => (prev + 1) % phases.length);
    }, 2000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(phaseInterval);
    };
  }, []);

  const CurrentIcon = phases[currentPhase].icon;

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="relative w-full max-w-md px-8">
        {/* Main Container */}
        <div className="relative">
          {/* Glowing Background */}
          <motion.div
            className="absolute inset-0 bg-cyan-500/5 blur-3xl rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Icon Container */}
          <div className="relative mb-8 flex justify-center">
            <motion.div
              className="relative w-24 h-24 flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              {/* Outer Ring */}
              <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 border-dashed" />
              
              {/* Middle Ring */}
              <motion.div
                className="absolute inset-2 rounded-full border-2 border-cyan-500/40"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />

              {/* Icon */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPhase}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ duration: 0.5 }}
                  className="relative z-10 w-12 h-12 flex items-center justify-center bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-sm rounded-full border border-cyan-400/40"
                >
                  <CurrentIcon className="w-6 h-6 text-cyan-400" strokeWidth={2} />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Phase Text */}
          <div className="relative mb-6 h-6 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentPhase}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-sm text-cyan-400/80 font-mono"
              >
                {phases[currentPhase].text}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Progress Bar */}
          <div className="relative mb-4">
            {/* Background */}
            <div className="h-2 bg-slate-800/50 rounded-full overflow-hidden border border-cyan-500/20">
              {/* Progress Fill */}
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 relative overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              >
                {/* Shimmer Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            </div>

            {/* Progress Percentage */}
            <div className="mt-2 flex justify-between items-center">
              <span className="text-xs text-slate-500 font-mono">LOADING</span>
              <span className="text-xs text-cyan-400 font-mono">{progress}%</span>
            </div>
          </div>

          {/* Loading Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-cyan-400 rounded-full"
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>

          {/* Terminal-style Text */}
          <div className="mt-8 p-4 bg-slate-900/50 rounded-lg border border-cyan-500/20 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="font-mono text-xs text-green-400/70 space-y-1">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span className="text-cyan-400">$</span> astra --init
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="flex items-center gap-2"
              >
                <span className="text-slate-500">›</span> Connecting to secure network...
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="flex items-center gap-2"
              >
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  _
                </motion.span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
