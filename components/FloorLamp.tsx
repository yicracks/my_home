import React, { useRef } from 'react';
import * as THREE from 'three';

interface FloorLampProps {
  isOn: boolean;
  toggle: () => void;
}

export const FloorLamp: React.FC<FloorLampProps> = ({ isOn, toggle }) => {
  const stringRef = useRef<THREE.Group>(null);
  const warmColor = "#ffaa33"; // Warm Yellow/Orange

  const handlePull = (e: any) => {
      e.stopPropagation();
      toggle();
  };

  return (
    <group>
      {/* Base */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.1, 32]} />
        <meshStandardMaterial color="#222" metalness={0.5} roughness={0.2} />
      </mesh>

      {/* Pole */}
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 5, 16]} />
        <meshStandardMaterial color="#222" metalness={0.5} roughness={0.2} />
      </mesh>

      {/* Shade */}
      <group position={[0, 4.5, 0]}>
        <mesh castShadow>
             <cylinderGeometry args={[0.4, 0.8, 0.8, 32, 1, true]} />
             <meshStandardMaterial color="#f0e6d2" side={THREE.DoubleSide} transparent opacity={0.9} />
        </mesh>
        {/* Bulb visual */}
        <mesh position={[0, -0.1, 0]}>
             <sphereGeometry args={[0.15, 16, 16]} />
             <meshStandardMaterial color={isOn ? "#ffffcc" : "#ccc"} emissive={isOn ? warmColor : "#000"} emissiveIntensity={isOn ? 2 : 0} />
        </mesh>
        
        {/* The Light Source - Warm Yellow */}
        {isOn && (
            <pointLight position={[0, -0.2, 0]} intensity={5} distance={15} color={warmColor} castShadow />
        )}
        {isOn && (
             <spotLight position={[0, 0, 0]} target-position={[0, -5, 0]} angle={0.5} penumbra={0.4} intensity={6} color={warmColor} castShadow />
        )}
      </group>

      {/* Pull String Switch */}
      <group position={[0, 4.1, 0.35]} ref={stringRef}>
         <mesh position={[0, 0, 0]}>
             <cylinderGeometry args={[0.005, 0.005, 0.8]} /> 
             <meshStandardMaterial color="#fff" />
         </mesh>
         <mesh 
            position={[0, -0.4, 0]} 
            onClick={handlePull}
            onPointerOver={() => document.body.style.cursor = 'pointer'}
            onPointerOut={() => document.body.style.cursor = 'auto'}
         >
             <sphereGeometry args={[0.04]} />
             <meshStandardMaterial color="gold" metalness={1} roughness={0.1} />
         </mesh>
      </group>
    </group>
  );
};