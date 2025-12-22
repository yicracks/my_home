import React from 'react';
import * as THREE from 'three';
import { COLORS } from '../constants';

export const Base: React.FC = () => {
  return (
    <group position={[0, -0.6, 0]}>
      {/* Main Cloth Cylinder */}
      <mesh castShadow receiveShadow position={[0, 0.6, 0]}>
        <cylinderGeometry args={[1.52, 1.52, 1.2, 64]} />
        <meshStandardMaterial
          color={COLORS.fabric}
          roughness={0.9} // Very rough to simulate fabric
          normalScale={new THREE.Vector2(1, 1)}
        />
      </mesh>

      {/* Bottom Cap/Rubber foot */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[1.4, 1.4, 0.1, 64]} />
        <meshStandardMaterial color="#000" roughness={0.5} />
      </mesh>

      {/* The metal rim between base and glass - NOW DARK GOLD */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[1.53, 1.53, 0.05, 64]} />
        <meshStandardMaterial
          color={COLORS.darkGold}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {/* Logo Placeholder */}
      <mesh position={[0, 0.6, 1.53]} rotation={[0, 0, 0]}>
        <planeGeometry args={[0.8, 0.15]} />
        <meshBasicMaterial color="#000" />
        <group position={[0, 0, 0.01]}>
             {/* Simple text simulation for logo */}
             <mesh position={[-0.2, 0, 0]}>
                <boxGeometry args={[0.2, 0.02, 0.01]} />
                <meshBasicMaterial color="#aaa" />
             </mesh>
             <mesh position={[0.2, 0, 0]}>
                <boxGeometry args={[0.2, 0.02, 0.01]} />
                <meshBasicMaterial color="#aaa" />
             </mesh>
        </group>
      </mesh>
    </group>
  );
};