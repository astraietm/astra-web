import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const HackingAnimation = () => {
    const canvasRef = useRef(null);
    const shouldReduceMotion = useReducedMotion();
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (shouldReduceMotion) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Discovered System Marker
        class Marker {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.opacity = 0;
                this.maxOpacity = 0.4 + Math.random() * 0.3;
                this.fadeIn = true;
                this.lifespan = 180 + Math.random() * 120; // 3-5 seconds
                this.age = 0;
                this.size = 2 + Math.random() * 2;
                this.isVulnerable = Math.random() > 0.85; // 15% chance
            }

            update() {
                this.age++;

                if (this.fadeIn) {
                    this.opacity += 0.02;
                    if (this.opacity >= this.maxOpacity) {
                        this.fadeIn = false;
                    }
                } else if (this.age > this.lifespan) {
                    this.opacity -= 0.015;
                }

                return this.opacity <= 0 && !this.fadeIn;
            }

            draw() {
                const color = this.isVulnerable ? '255, 159, 10' : '6, 182, 212'; // Amber or Cyan
                
                // Outer ring
                ctx.strokeStyle = `rgba(${color}, ${this.opacity * 0.6})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
                ctx.stroke();

                // Inner dot
                ctx.fillStyle = `rgba(${color}, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();

                // Crosshair for vulnerable systems
                if (this.isVulnerable) {
                    ctx.strokeStyle = `rgba(${color}, ${this.opacity * 0.5})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(this.x - this.size * 3, this.y);
                    ctx.lineTo(this.x + this.size * 3, this.y);
                    ctx.moveTo(this.x, this.y - this.size * 3);
                    ctx.lineTo(this.x, this.y + this.size * 3);
                    ctx.stroke();
                }
            }
        }

        // Scan state
        let scanActive = false;
        let scanAngle = 0;
        let scanCenterX = canvas.width / 2;
        let scanCenterY = canvas.height / 2;
        let nextScanTime = 480; // 8 seconds at 60fps
        let scanTimer = 0;
        const markers = [];

        // Spawn markers during scan
        function spawnMarker() {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * Math.min(canvas.width, canvas.height) * 0.4;
            const x = scanCenterX + Math.cos(angle) * distance;
            const y = scanCenterY + Math.sin(angle) * distance;
            markers.push(new Marker(x, y));
        }

        function animate() {
            // Fade trail
            ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Scan logic
            if (isVisible) {
                scanTimer++;

                if (scanTimer >= nextScanTime && !scanActive) {
                    scanActive = true;
                    scanAngle = 0;
                    scanTimer = 0;
                    nextScanTime = 480 + Math.random() * 240; // 8-12 seconds
                }

                if (scanActive) {
                    scanAngle += 0.012;

                    // Radar sweep
                    const radius = Math.max(canvas.width, canvas.height) * 0.6;
                    const gradient = ctx.createRadialGradient(
                        scanCenterX, scanCenterY, 0,
                        scanCenterX, scanCenterY, radius
                    );
                    gradient.addColorStop(0, 'rgba(6, 182, 212, 0.025)');
                    gradient.addColorStop(0.4, 'rgba(6, 182, 212, 0.012)');
                    gradient.addColorStop(1, 'rgba(6, 182, 212, 0)');

                    ctx.save();
                    ctx.translate(scanCenterX, scanCenterY);
                    ctx.rotate(scanAngle);
                    ctx.fillStyle = gradient;
                    ctx.fillRect(-radius, -radius / 12, radius, radius / 6);
                    ctx.restore();

                    // Spawn markers as scan progresses
                    if (Math.random() > 0.92) {
                        spawnMarker();
                    }

                    // Complete scan
                    if (scanAngle >= Math.PI * 2) {
                        scanActive = false;
                    }
                }
            }

            // Update and draw markers
            for (let i = markers.length - 1; i >= 0; i--) {
                const expired = markers[i].update();
                markers[i].draw();
                if (expired) markers.splice(i, 1);
            }

            requestAnimationFrame(animate);
        }

        animate();

        const handleScroll = () => {
            setIsVisible(window.scrollY < window.innerHeight * 0.7);
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            scanCenterX = canvas.width / 2;
            scanCenterY = canvas.height / 2;
        });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [shouldReduceMotion, isVisible]);

    if (shouldReduceMotion) {
        return null;
    }

    return (
        <>
            {/* Canvas Animation */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 pointer-events-none z-0"
                style={{ opacity: 0.5 }}
            />

            {/* Coordinate Grid Overlay */}
            <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.012]">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="scan-grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(6, 182, 212, 0.5)" strokeWidth="0.5"/>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#scan-grid)" />
                </svg>
            </div>

            {/* Subtle Ambient Glow */}
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-cyan-500/3 rounded-full blur-[160px]"
                animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.2, 0.35, 0.2],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-black/75 pointer-events-none z-10" />
        </>
    );
};

export default HackingAnimation;
