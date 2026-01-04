import React, { useRef, Suspense, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// ----------------------------------------------------------------------
// 3D ASSETS & LOGIC
// ----------------------------------------------------------------------

const CyberShape = () => {
  const meshRef = useRef();
  const wireframeRef = useRef();
  const ringRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Safely access pointer
    const mx = state.pointer?.x || 0;
    const my = state.pointer?.y || 0;

    if (meshRef.current) {
        meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, Math.cos(t / 4) / 8 + my / 5, 0.1);
        meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, Math.sin(t / 4) / 8 + mx / 5, 0.1);
    }
    
    if (wireframeRef.current && meshRef.current) {
        wireframeRef.current.rotation.x = meshRef.current.rotation.x;
        wireframeRef.current.rotation.y = meshRef.current.rotation.y + t * 0.05;
    }

    if (ringRef.current) {
        ringRef.current.rotation.z = t * 0.1;
        ringRef.current.rotation.x = Math.sin(t * 0.2) * 0.5;
    }
  });

  return (
    <group scale={1.2}>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
        {/* Solid Core */}
        <mesh ref={meshRef}>
          <octahedronGeometry args={[1.5, 0]} />
          <meshStandardMaterial color="#050505" roughness={0.1} metalness={0.8} />
        </mesh>

        {/* Wireframe */}
        <mesh ref={wireframeRef} scale={1.51}>
          <octahedronGeometry args={[1.5, 0]} />
          <meshBasicMaterial color="#00f3ff" wireframe transparent opacity={0.1} />
        </mesh>
        
        {/* Ring */}
        <mesh ref={ringRef} scale={2}>
            <torusGeometry args={[1.2, 0.02, 16, 100]} />
            <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.5} toneMapped={false} />
        </mesh>
      </Float>
    </group>
  );
};

// Error Boundary built purely for this component
class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error) {
      return { hasError: true };
    }
    
    componentDidCatch(error, info) {
        console.error("Hero3D Crash:", error, info);
    }
  
    render() {
      if (this.state.hasError) {
        // FALLBACK: Cool CSS Gradient if 3D dies
        return <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />;
      }
      return this.props.children;
    }
}

const Hero3D = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Artificial delay to ensure container is ready
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return <div className="absolute inset-0 bg-black" />;

  return (
    <div className="absolute inset-0 z-0 w-full h-full">
        <ErrorBoundary>
            <Canvas
                dpr={[1, 1.5]} // Lower DPR slightly for consistency
                gl={{ antialias: true, alpha: true }}
                camera={{ position: [0, 0, 6], fov: 45 }}
                style={{ width: '100%', height: '100%' }}
            >
                <Suspense fallback={null}>
                    <PerspectiveCamera makeDefault position={[0, 0, 8]} />
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={2} color="#22c55e" />
                    <pointLight position={[-10, -10, -5]} intensity={1} color="#00f3ff" />
                    
                    <CyberShape />
                    {/* REMOVED STARS to rule out shader compilation errors */}
                    
                    <fog attach="fog" args={['#000000', 5, 20]} />
                </Suspense>
            </Canvas>
        </ErrorBoundary>
    </div>
  );
};

export default Hero3D;
