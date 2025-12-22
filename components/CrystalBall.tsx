import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface CrystalBallProps {
  isOn: boolean;
  toggle: () => void;
}

export const CrystalBall: React.FC<CrystalBallProps> = ({ isOn, toggle }) => {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate Snow Particles
  const particleCount = 200;
  const particles = useMemo(() => {
    const temp = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      // Use cylindrical distribution (r, theta, y) instead of spherical
      // This ensures that as particles fall vertically (changing Y), they don't exit the sphere's curve
      // Sphere radius is 0.4. At y = +/- 0.3, radius is sqrt(0.4^2 - 0.3^2) = sqrt(0.07) ~ 0.26
      // So we limit max horizontal radius to 0.25
      const r = 0.25 * Math.sqrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      
      const x = r * Math.cos(theta);
      const z = r * Math.sin(theta);
      const y = (Math.random() * 0.6) - 0.3; // -0.3 to 0.3 range
      
      temp[i * 3] = x;
      temp[i * 3 + 1] = y;
      temp[i * 3 + 2] = z;
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (!isOn || !pointsRef.current) return;
    
    // Animate Snow
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < particleCount; i++) {
       // Move down
       positions[i * 3 + 1] -= 0.002;
       // Reset if too low
       if (positions[i * 3 + 1] < -0.3) {
         positions[i * 3 + 1] = 0.3;
       }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    // Rotate ball slightly
    pointsRef.current.rotation.y += 0.001;
  });

  return (
    <group>
      {/* Base */}
      <mesh position={[0, 0.05, 0]} onClick={(e) => { e.stopPropagation(); toggle(); }}>
         <cylinderGeometry args={[0.25, 0.3, 0.1, 32]} />
         <meshStandardMaterial color="#442211" roughness={0.5} />
      </mesh>
      
      {/* Button on Base */}
      <mesh position={[0, 0.08, 0.28]} rotation={[0.5, 0, 0]} onClick={(e) => { e.stopPropagation(); toggle(); }}>
          <boxGeometry args={[0.08, 0.02, 0.05]} />
          <meshStandardMaterial color={isOn ? "#ff0000" : "#550000"} emissive={isOn ? "#ff0000" : "#000"} emissiveIntensity={0.5} />
      </mesh>

      {/* Glass Sphere */}
      <mesh position={[0, 0.45, 0]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshPhysicalMaterial 
            color="white" 
            transmission={0.9} 
            roughness={0.05} 
            thickness={0.1} 
            ior={1.5}
            clearcoat={1}
            side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Internal Content (Tree) */}
      <group position={[0, 0.15, 0]}>
         {/* Tree Trunk */}
         <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.2]} />
            <meshStandardMaterial color="#3e2723" />
         </mesh>
         {/* Leaves */}
         <mesh position={[0, 0.25, 0]}>
            <coneGeometry args={[0.2, 0.3, 8]} />
            <meshStandardMaterial color="#1b5e20" />
         </mesh>
         <mesh position={[0, 0.4, 0]}>
            <coneGeometry args={[0.15, 0.25, 8]} />
            <meshStandardMaterial color="#2e7d32" />
         </mesh>
         
         {/* Light glow if on */}
         {isOn && <pointLight position={[0, 0.3, 0]} intensity={0.5} color="#88ffaa" distance={0.5} />}
      </group>

      {/* Snow Particles */}
      {isOn && (
          <points ref={pointsRef} position={[0, 0.45, 0]}>
            <bufferGeometry>
                <bufferAttribute 
                    attach="attributes-position" 
                    count={particles.length / 3} 
                    array={particles} 
                    itemSize={3} 
                />
            </bufferGeometry>
            <pointsMaterial size={0.015} color="white" transparent opacity={0.8} />
          </points>
      )}
    </group>
  );
};