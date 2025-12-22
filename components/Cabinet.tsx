import React from 'react';
import { COLORS } from '../constants';

export const Cabinet: React.FC<any> = (props) => {
  return (
    <group {...props}>
      {/* Main Cabinet Body (Height 1.5, centered at y=0.75 so bottom is at y=0) */}
      <mesh receiveShadow position={[0, 0.75, 0]}>
        <boxGeometry args={[8, 1.5, 3]} />
        <meshStandardMaterial 
          color={COLORS.cabinet} 
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>
      
      {/* Cabinet Doors/Drawers detail */}
      <mesh position={[-2, 0.75, 1.51]}>
        <planeGeometry args={[3.8, 1.3]} />
        <meshStandardMaterial color="#2c1b18" roughness={0.8} />
      </mesh>
      <mesh position={[2, 0.75, 1.51]}>
        <planeGeometry args={[3.8, 1.3]} />
        <meshStandardMaterial color="#2c1b18" roughness={0.8} />
      </mesh>
      
      {/* Handles */}
      <mesh position={[-0.5, 0.75, 1.55]}>
         <boxGeometry args={[0.1, 0.4, 0.05]} />
         <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.5, 0.75, 1.55]}>
         <boxGeometry args={[0.1, 0.4, 0.05]} />
         <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
};