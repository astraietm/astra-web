import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ----------------------------------------------------------------------
// PURE R3F VERSION (NO DREI HELPERS)
// ----------------------------------------------------------------------

const CyberShapeManual = () => {
    const groupRef = useRef();
    const meshRef = useRef();
    const wireframeRef = useRef();
    const ringRef = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        // Fallback for pointer if undefined
        const mx = state.pointer ? state.pointer.x : 0;
        const my = state.pointer ? state.pointer.y : 0;

        // Manual "Float" effect
        if (groupRef.current) {
            groupRef.current.position.y = Math.sin(t) * 0.1; // Gentle float up/down
        }

        // Rotation logic
        if (meshRef.current) {
            meshRef.current.rotation.x = Math.cos(t / 4) / 8 + my / 5;
            meshRef.current.rotation.y = Math.sin(t / 4) / 8 + mx / 5;
        }

        if (wireframeRef.current) {
             wireframeRef.current.rotation.copy(meshRef.current.rotation);
             // Add slight offset rotation for depth
             wireframeRef.current.rotation.y += 0.1;
        }

        if (ringRef.current) {
            ringRef.current.rotation.z = t * 0.2;
            ringRef.current.rotation.x = Math.sin(t * 0.5) * 0.2;
        }
    });

    return (
        <group ref={groupRef} scale={1.2}>
            {/* Solid Core */}
            <mesh ref={meshRef}>
                <octahedronGeometry args={[1.5, 0]} />
                <meshStandardMaterial color="#050505" roughness={0.1} metalness={0.8} />
            </mesh>

            {/* Wireframe */}
            <mesh ref={wireframeRef}>
                <octahedronGeometry args={[1.5, 0]} />
                <meshBasicMaterial color="#00f3ff" wireframe transparent opacity={0.1} />
            </mesh>

            {/* Ring */}
            <mesh ref={ringRef} scale={2}>
                <torusGeometry args={[1.2, 0.02, 16, 100]} />
                <meshStandardMaterial color="#22c55e" />
            </mesh>
        </group>
    );
};

const Hero3D = () => {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        {/* Render a fallback background BEHIND the canvas immediately */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#020202] to-[#0a0a0a]" />

        <Canvas
            camera={{ position: [0, 0, 6], fov: 45 }}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'transparent' }}
            onCreated={({ gl }) => { 
                gl.setClearColor(new THREE.Color('#000000'), 0); // Transparent background
            }}
        >
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={2} color="#22c55e" />
            <pointLight position={[-10, -10, -5]} intensity={1} color="#00f3ff" />
            
            <CyberShapeManual />
        </Canvas>
    </div>
  );
};

export default Hero3D;
