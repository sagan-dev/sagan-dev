"use client";

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

// Animated Loog object - represents a stylized logo/brand element
function AnimatedLoog() {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Rotate the individual shape
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.3;
    }
    
    if (groupRef.current) {
      // Gentle floating motion for the entire group
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main Loog shape - a stylized geometric form */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <torusKnotGeometry args={[1, 0.3, 128, 16]} />
        <meshStandardMaterial 
          color="#8b5cf6" 
          metalness={0.7}
          roughness={0.2}
          emissive="#4c1d95"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Orbital elements */}
      <mesh position={[2.5, 0, 0]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial 
          color="#06b6d4" 
          metalness={0.8}
          roughness={0.1}
          emissive="#0891b2"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      <mesh position={[-2.5, 0, 0]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial 
          color="#06b6d4" 
          metalness={0.8}
          roughness={0.1}
          emissive="#0891b2"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Accent rings */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2, 0.05, 16, 100]} />
        <meshStandardMaterial 
          color="#fbbf24" 
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.7}
        />
      </mesh>
      
      {/* Brand text */}
      <Text
        position={[0, -3, 0]}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={200}
        lineHeight={1}
      >
        LOOG
      </Text>
    </group>
  );
}

// Scene lighting setup
function Lights() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={1}
        intensity={0.8}
        color="#06b6d4"
        castShadow
      />
    </>
  );
}

// Main Loog3D component
export default function Loog3D() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: 'transparent' }}
        shadows
      >
        <Lights />
        <AnimatedLoog />
        <OrbitControls 
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={15}
          autoRotate={false}
          autoRotateSpeed={2}
        />
      </Canvas>
    </div>
  );
}