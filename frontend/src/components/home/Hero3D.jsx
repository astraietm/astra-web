import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// ----------------------------------------------------------------------
// 3D ASSETS & LOGIC
// ----------------------------------------------------------------------

const CyberShape = () => {
  const meshRef = useRef();
  const wireframeRef = useRef();
  const ringRef = useRef();
  
  // Use useFrame for smooth animation loop
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const mouse = state.pointer; // Use 'pointer' instead of 'mouse' for newer R3F

    // 1. Idle Rotation + Mouse Parallax
    if (meshRef.current) {
        // Safe check for mouse existence
        const mx = mouse ? mouse.x : 0;
        const my = mouse ? mouse.y : 0;
        
        meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, Math.cos(t / 4) / 8 + my / 5, 0.1);
        meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, Math.sin(t / 4) / 8 + mx / 5, 0.1);
    }
    
    // Wireframe rotates slightly faster/opposite for depth
    if (wireframeRef.current && meshRef.current) {
        wireframeRef.current.rotation.x = meshRef.current.rotation.x;
        wireframeRef.current.rotation.y = meshRef.current.rotation.y + t * 0.05;
    }

    // Outer Ring Rotation - "Gyroscope" style
    if (ringRef.current) {
        ringRef.current.rotation.z = t * 0.1;
        ringRef.current.rotation.x = Math.sin(t * 0.2) * 0.5;
    }
  });

  return (
    <group scale={1.2}>
      {/* Floating Wrapper for organic movement */}
      <Float
        speed={1.5} // Animation speed
        rotationIntensity={0.5} // XYZ rotation intensity
        floatIntensity={1} // Up/down float intensity
      >
        {/* Main Solid Core */}
        <mesh ref={meshRef}>
          <octahedronGeometry args={[1.5, 0]} />
          <meshStandardMaterial 
            color="#050505" 
            roughness={0.1} 
            metalness={0.8} 
            flatShading={true}
          />
        </mesh>

        {/* Wireframe Overlay for "Hacker" aesthetic */}
        <mesh ref={wireframeRef} scale={1.51}>
          <octahedronGeometry args={[1.5, 0]} />
          <meshBasicMaterial 
            color="#00f3ff" 
            wireframe 
            transparent 
            opacity={0.1}
          />
        </mesh>
        
        {/* Tech Ring */}
        <mesh ref={ringRef} scale={2}>
            <torusGeometry args={[1.2, 0.02, 16, 100]} />
            <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.5} toneMapped={false} />
        </mesh>

        {/* Cloud/Nebula particles around object */}
        <Stars radius={10} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
      </Float>
    </group>
  );
};

const BackgroundParticles = () => {
    return (
        <group>
            <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
        </group>
    );
};

// Error Boundary for 3D Scene
class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error) {
      return { hasError: true };
    }
  
    componentDidCatch(error, errorInfo) {
      console.error("3D Scene Error:", error, errorInfo);
    }
  
    render() {
      if (this.state.hasError) {
        return <div className="absolute inset-0 bg-blue-900/20" />; // Fallback
      }
      return this.props.children;
    }
}

// Main Scene Component
const Hero3D = () => {
  return (
    <div className="absolute inset-0 z-0 w-full h-full">
        <ErrorBoundary>
            <Canvas
                dpr={[1, 2]} // Optimize pixel ratio
                gl={{ antialias: true }}
                camera={{ position: [0, 0, 6], fov: 45 }}
                style={{ width: '100%', height: '100%' }}
            >
                <Suspense fallback={null}>
                    <PerspectiveCamera makeDefault position={[0, 0, 8]} />
                    
                    {/* Lighting */}
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={2} color="#22c55e" />
                    <pointLight position={[-10, -10, -5]} intensity={1} color="#00f3ff" />

                    {/* Content */}
                    <CyberShape />
                    <BackgroundParticles />
                    
                    <fog attach="fog" args={['#000000', 5, 20]} />
                </Suspense>
            </Canvas>
        </ErrorBoundary>
    </div>
  );
};

export default Hero3D;
