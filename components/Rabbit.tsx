import React from 'react';
import * as THREE from 'three';

export const Rabbit: React.FC = () => {
  const pink = "#ffb7b2";
  const darkPink = "#ff9e99";
  const shirtColor = "#89cff0"; // Baby blue

  // Plush material setup
  const plushMaterial = (
    <meshPhysicalMaterial 
      color={pink} 
      roughness={1} 
      metalness={0} 
      sheen={1}
      sheenColor={new THREE.Color(pink).offsetHSL(0, 0, 0.1)}
      sheenRoughness={0.5}
      clearcoat={0}
    />
  );

  return (
    <group>
      {/* Clothing (Blue Hoodie Body) */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.37, 0.42, 0.5, 32]} />
        <meshStandardMaterial color={shirtColor} roughness={0.9} />
      </mesh>

      {/* Body (Lower part sticking out) */}
      <mesh position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.35, 32, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        {plushMaterial}
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <sphereGeometry args={[0.28, 32, 32]} />
        {plushMaterial}
      </mesh>

      {/* Ears */}
      <mesh position={[-0.1, 1.1, 0]} rotation={[0, 0, -0.2]} castShadow>
        <capsuleGeometry args={[0.08, 0.5, 4, 8]} />
        {plushMaterial}
      </mesh>
      <mesh position={[0.1, 1.1, 0]} rotation={[0, 0, 0.2]} castShadow>
        <capsuleGeometry args={[0.08, 0.5, 4, 8]} />
        {plushMaterial}
      </mesh>
      
      {/* Ear Insides */}
      <mesh position={[-0.1, 1.1, 0.06]} rotation={[0, 0, -0.2]}>
        <capsuleGeometry args={[0.04, 0.35, 4, 8]} />
        <meshStandardMaterial color={darkPink} roughness={1} />
      </mesh>
      <mesh position={[0.1, 1.1, 0.06]} rotation={[0, 0, 0.2]}>
        <capsuleGeometry args={[0.04, 0.35, 4, 8]} />
        <meshStandardMaterial color={darkPink} roughness={1} />
      </mesh>

      {/* Arms (Sleeves) */}
      <mesh position={[-0.35, 0.4, 0.1]} rotation={[0.5, 0, -0.5]}>
        <capsuleGeometry args={[0.09, 0.32, 4, 8]} />
        <meshStandardMaterial color={shirtColor} roughness={0.9} />
      </mesh>
      <mesh position={[0.35, 0.4, 0.1]} rotation={[0.5, 0, 0.5]}>
        <capsuleGeometry args={[0.09, 0.32, 4, 8]} />
        <meshStandardMaterial color={shirtColor} roughness={0.9} />
      </mesh>

      {/* Paws sticking out of sleeves */}
      <mesh position={[-0.42, 0.25, 0.25]}>
         <sphereGeometry args={[0.08]} />
         {plushMaterial}
      </mesh>
      <mesh position={[0.42, 0.25, 0.25]}>
         <sphereGeometry args={[0.08]} />
         {plushMaterial}
      </mesh>

      {/* Legs */}
      <mesh position={[-0.15, 0.05, 0.25]} rotation={[1.5, 0, 0]}>
        <capsuleGeometry args={[0.09, 0.35, 4, 8]} />
        {plushMaterial}
      </mesh>
      <mesh position={[0.15, 0.05, 0.25]} rotation={[1.5, 0, 0]}>
        <capsuleGeometry args={[0.09, 0.35, 4, 8]} />
        {plushMaterial}
      </mesh>
      
      {/* Face details */}
      <mesh position={[0, 0.75, 0.26]} scale={[1, 0.8, 1]}>
         <sphereGeometry args={[0.04, 16, 16]} />
         <meshStandardMaterial color="black" roughness={0.2} />
      </mesh>
      <mesh position={[-0.1, 0.8, 0.24]}>
         <sphereGeometry args={[0.025, 16, 16]} />
         <meshStandardMaterial color="black" roughness={0.2} />
      </mesh>
      <mesh position={[0.1, 0.8, 0.24]}>
         <sphereGeometry args={[0.025, 16, 16]} />
         <meshStandardMaterial color="black" roughness={0.2} />
      </mesh>
      
      {/* Hoodie strings */}
      <mesh position={[-0.1, 0.3, 0.23]} rotation={[0,0,-0.1]}>
         <capsuleGeometry args={[0.015, 0.2]} />
         <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0.1, 0.3, 0.23]} rotation={[0,0,0.1]}>
         <capsuleGeometry args={[0.015, 0.2]} />
         <meshStandardMaterial color="white" />
      </mesh>

    </group>
  );
};