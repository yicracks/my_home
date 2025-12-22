import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface ParticleLampProps {
  isOn: boolean;
  toggle: () => void;
}

export const ParticleLamp: React.FC<ParticleLampProps> = ({ isOn, toggle }) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Warm Yellow Color
  const lightColor = "#ffaa33"; 
  const offColor = "#444";

  const count = 150;
  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const r = 0.25; 
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      temp[i * 3] = x;
      temp[i * 3 + 1] = y;
      temp[i * 3 + 2] = z;
    }
    return temp;
  }, []);

  useFrame((state) => {
      if (isOn && pointsRef.current) {
          pointsRef.current.rotation.y += 0.005;
          pointsRef.current.rotation.z += 0.002;
          
          const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
          pointsRef.current.scale.set(scale, scale, scale);
      }
  });

  return (
    <group onClick={(e) => { e.stopPropagation(); toggle(); }}>
      {/* Base */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.1, 32]} />
        <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Stem */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.3]} />
        <meshStandardMaterial color="#555" />
      </mesh>

      {/* The Particles */}
      <points ref={pointsRef} position={[0, 0.45, 0]}>
        <bufferGeometry>
            <bufferAttribute 
                attach="attributes-position" 
                count={count} 
                array={particles} 
                itemSize={3} 
            />
        </bufferGeometry>
        <pointsMaterial 
            size={0.03} 
            color={isOn ? lightColor : offColor} 
            transparent
            opacity={isOn ? 1 : 0.3}
            sizeAttenuation
        />
      </points>
      
      {/* Light Source - Warm Yellow */}
      {isOn && (
          <pointLight position={[0, 0.45, 0]} intensity={3.0} color={lightColor} distance={5} decay={2} />
      )}
    </group>
  );
};