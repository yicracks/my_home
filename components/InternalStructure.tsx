import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { COLORS } from '../constants';

interface InternalStructureProps {
  isPlaying: boolean;
}

const TurbineBlade: React.FC<{ index: number; total: number; isPlaying: boolean }> = ({ index, total, isPlaying }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const angle = (index / total) * Math.PI * 2;
  const radius = 0.8;
  
  // Position in a circle
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;

  useFrame((state) => {
    if (!meshRef.current) return;

    // Pulse animation logic
    if (isPlaying) {
      const time = state.clock.getElapsedTime();
      // Create a wave effect based on index and time
      const wave = Math.sin(time * 3 + index * 0.5) * 0.5 + 0.5;
      
      const targetEmissive = new THREE.Color(COLORS.lightOn);
      targetEmissive.multiplyScalar(0.2 + wave * 0.8); // Intensity varies between 0.2 and 1.0
      
      // @ts-ignore - Three types issue with emissive being Color
      meshRef.current.material.emissive = targetEmissive;
    } else {
       // Dim/Off state
       // @ts-ignore
       meshRef.current.material.emissive.lerp(new THREE.Color(COLORS.lightOff), 0.1);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={[x, 0.4, z]}
      rotation={[0, -angle, 0]}
    >
      {/* Abstract blade shape */}
      <boxGeometry args={[0.1, 0.6, 0.4]} />
      <meshStandardMaterial
        color="#333"
        roughness={0.4}
        metalness={0.8}
        emissive={COLORS.lightOff}
        emissiveIntensity={1}
      />
    </mesh>
  );
};

export const InternalStructure: React.FC<InternalStructureProps> = ({ isPlaying }) => {
  const bladeCount = 12;
  const blades = Array.from({ length: bladeCount });

  return (
    <group position={[0, 0, 0]}>
      {/* Central glow core */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.5, 0.8, 1.2, 32]} />
        <meshStandardMaterial
          color="#111"
          roughness={0.2}
          metalness={0.5}
        />
      </mesh>

      {/* Turbine Blades (The wavy pattern) */}
      {blades.map((_, i) => (
        <TurbineBlade key={i} index={i} total={bladeCount} isPlaying={isPlaying} />
      ))}
      
      {/* Inner Light Ring (Bottom glow) */}
      <pointLight
        position={[0, 0.5, 0]}
        intensity={isPlaying ? 2 : 0}
        color={COLORS.lightOn}
        distance={3}
        decay={2}
      />
    </group>
  );
};