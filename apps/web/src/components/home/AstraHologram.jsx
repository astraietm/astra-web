import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const Particles = ({ count = 2000 }) => {
  const mesh = useRef();
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const r = 3 + Math.random() * 2; 

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
        mesh.current.rotation.y -= delta / 10;
        mesh.current.rotation.x -= delta / 15;
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
        size={0.03}
        color="#00e0ff"
        transparent
        opacity={0.6}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </points>
  );
};

const TechRing = ({ radius, width = 0.02, speed, rotation }) => {
    const ref = useRef();
    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.z += delta * speed;
            ref.current.rotation.x += delta * (speed * 0.5);
        }
    });

    return (
        <group rotation={rotation}>
             <mesh ref={ref}>
                <torusGeometry args={[radius, width, 16, 100]} />
                <meshStandardMaterial color="#00e0ff" emissive="#00e0ff" emissiveIntensity={1} />
            </mesh>
        </group>
    );
};

const CoreHologram = () => {
    return (
        <mesh scale={2}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial 
                color="#00e0ff" 
                wireframe 
                transparent 
                opacity={0.3} 
                emissive="#00e0ff"
                emissiveIntensity={0.2}
            />
        </mesh>
    );
};

const AstraHologram = () => {
  return (
    <div className="w-full h-[400px] md:h-[500px] relative">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00e0ff" />
        
        <CoreHologram />
        <Particles count={1500} />
        <TechRing radius={3.5} speed={0.4} rotation={[Math.PI / 3, 0, 0]} />
        <TechRing radius={4.2} speed={-0.3} rotation={[-Math.PI / 3, 0, 0]} />
        
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
      
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-mono text-primary/40 tracking-[0.3em] uppercase pointer-events-none select-none">
          3D_MODEL_VIEW
      </div>
    </div>
  );
};

export default AstraHologram;
