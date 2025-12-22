import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export const SpeakerDome: React.FC = () => {
  const meshRef = useRef<THREE.Group>(null);

  // Gentle rotation for the reflection to feel alive
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <group position={[0, 0.6, 0]} ref={meshRef}>
      {/* Main Cylinder Body */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 1.5, 1.5, 64, 1, true]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.95}
          opacity={1}
          metalness={0.1}
          roughness={0.05}
          ior={1.5}
          thickness={0.5}
          clearcoat={1}
          clearcoatRoughness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Spherical Top Cap */}
      <mesh position={[0, 1.5, 0]}>
        {/* Sphere segment starting from equator up */}
        <sphereGeometry args={[1.5, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.95}
          opacity={1}
          metalness={0.1}
          roughness={0.05}
          ior={1.5}
          thickness={0.5}
          clearcoat={1}
          clearcoatRoughness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* The inner funnel/vent at the top (modified for new shape) */}
      <mesh position={[0, 1.5, 0]} rotation={[Math.PI, 0, 0]}>
         <cylinderGeometry args={[0.3, 0.6, 0.8, 32, 1, true]} />
         <meshPhysicalMaterial
          color="#dddddd"
          transmission={0.8}
          roughness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};