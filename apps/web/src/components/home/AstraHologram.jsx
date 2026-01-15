import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const ParticleGlobe = ({ count = 1500 }) => {
  const mesh = useRef();
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        // Uniform sphere distribution
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        const r = 2.5; 

        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
    }
    return positions;
  }, [count]);

  useFrame((state, delta) => {
    if (mesh.current) {
        mesh.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#6366F1" // Primary
        transparent
        opacity={0.8}
        sizeAttenuation={true}
      />
    </points>
  );
};

const SecurityShield = () => {
    return (
        <mesh scale={2.5}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial 
                color="#6366F1"
                wireframe
                transparent
                opacity={0.1}
            />
        </mesh>
    );
}

const AstraHologram = () => {
  return (
    <div className="w-full h-[400px] md:h-[600px] relative pointer-events-none">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#6366F1" />
        
        <SecurityShield />
        <ParticleGlobe count={2000} />
        
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} enablePan={false} />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] via-transparent to-transparent pointer-events-none" />
    </div>
  );
};

export default AstraHologram;
