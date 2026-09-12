'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export const HeroScene3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 360;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5.5;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 3. Artifact Group: Outer Dodecahedron Wireframe + Inner Glowing Core + Orbiting Pixel Nodes
    const artifactGroup = new THREE.Group();
    scene.add(artifactGroup);

    // Outer Geometry: Icosahedron Wireframe
    const outerGeo = new THREE.IcosahedronGeometry(1.6, 1);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0x0E0F12,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    artifactGroup.add(outerMesh);

    // Outer Edge Lines (Neon Highlight)
    const edgesGeo = new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.62, 0));
    const edgesMat = new THREE.LineBasicMaterial({
      color: 0xDFE104, // Acid Yellow
      linewidth: 2,
    });
    const wireframeEdges = new THREE.LineSegments(edgesGeo, edgesMat);
    artifactGroup.add(wireframeEdges);

    // Inner Glowing Core (Octahedron)
    const coreGeo = new THREE.OctahedronGeometry(0.85, 0);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x10B981, // Neon Green
      wireframe: true,
      transparent: true,
      opacity: 0.8,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    artifactGroup.add(coreMesh);

    // Orbiting Pixel Particles (cubes)
    const particleCount = 28;
    const particleGeo = new THREE.BoxGeometry(0.08, 0.08, 0.08);
    const particleMat = new THREE.MeshBasicMaterial({ color: 0xEC4899 }); // Magenta
    const particles: THREE.Mesh[] = [];

    for (let i = 0; i < particleCount; i++) {
      const p = new THREE.Mesh(particleGeo, particleMat);
      const theta = (i / particleCount) * Math.PI * 2;
      const phi = Math.acos(2 * (i / particleCount) - 1);
      const r = 2.2 + Math.sin(i) * 0.3;

      p.position.x = r * Math.sin(phi) * Math.cos(theta);
      p.position.y = r * Math.sin(phi) * Math.sin(theta);
      p.position.z = r * Math.cos(phi);
      artifactGroup.add(p);
      particles.push(p);
    }

    setIsLoaded(true);

    // Mouse Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      targetX = (x / rect.width) * 0.8;
      targetY = (y / rect.height) * 0.8;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        // Continuous gentle rotation
        outerMesh.rotation.x = elapsedTime * 0.15;
        outerMesh.rotation.y = elapsedTime * 0.2;

        wireframeEdges.rotation.x = -elapsedTime * 0.12;
        wireframeEdges.rotation.y = -elapsedTime * 0.18;

        coreMesh.rotation.x = elapsedTime * 0.3;
        coreMesh.rotation.z = elapsedTime * 0.25;

        // Particle pulsation
        particles.forEach((p, index) => {
          p.rotation.x += 0.02;
          p.rotation.y += 0.02;
        });

        // Smooth mouse parallax lerp
        mouseX += (targetX - mouseX) * 0.05;
        mouseY += (targetY - mouseY) * 0.05;

        artifactGroup.rotation.y = mouseX + elapsedTime * 0.1;
        artifactGroup.rotation.x = mouseY + Math.sin(elapsedTime * 0.5) * 0.1;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      // Dispose resources
      outerGeo.dispose();
      outerMat.dispose();
      edgesGeo.dispose();
      edgesMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[320px] sm:h-[400px] md:h-[460px] flex items-center justify-center">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Decorative HUD Framing */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3">
        <div className="flex justify-between items-center text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-[#DFE104] animate-pulse" />
            ARTIFACT_3D // CORE_NODE
          </span>
          <span>SYS_STATUS: ACTIVE</span>
        </div>
        <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-zinc-500">
          <span>COORDS: 09.9312° N, 76.2673° E</span>
          <span className="text-emerald-500 font-bold">60 FPS // LOW_OVERHEAD</span>
        </div>
      </div>
    </div>
  );
};
