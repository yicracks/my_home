import React from 'react';
import { RoundedBox } from '@react-three/drei';

const Bear: React.FC = () => {
  const bearColor = "#c58c49"; // Lighter golden brown for contrast
  const snoutColor = "#eacba8";

  return (
    // Updated Bear: 
    // Y=1.0 slightly lower to "sit" into cushion.
    // Z=-0.2 moved back to lean against backrest.
    <group position={[-0.8, 1.0, -0.2]} rotation={[-0.3, 0.3, 0]} scale={0.28}>
      
      {/* Body - Fuzzy texture via roughness */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color={bearColor} roughness={1} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 1.4, 0.1]}>
        <sphereGeometry args={[0.85, 32, 32]} />
        <meshStandardMaterial color={bearColor} roughness={1} />
      </mesh>
      
      {/* Ears */}
      <mesh position={[-0.6, 2, 0.1]}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial color={bearColor} roughness={1} />
      </mesh>
      <mesh position={[0.6, 2, 0.1]}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial color={bearColor} roughness={1} />
      </mesh>
      
      {/* Snout */}
      <mesh position={[0, 1.3, 0.75]}>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshStandardMaterial color={snoutColor} roughness={1} />
      </mesh>
      
      {/* Eyes */}
      <mesh position={[-0.25, 1.6, 0.8]}>
        <sphereGeometry args={[0.08]} />
        <meshStandardMaterial color="black" roughness={0.2} />
      </mesh>
      <mesh position={[0.25, 1.6, 0.8]}>
        <sphereGeometry args={[0.08]} />
        <meshStandardMaterial color="black" roughness={0.2} />
      </mesh>
      
      {/* Nose */}
      <mesh position={[0, 1.4, 1.0]}>
        <sphereGeometry args={[0.08]} />
        <meshStandardMaterial color="black" roughness={0.2} />
      </mesh>
      
      {/* Arms - Relaxed */}
      <mesh position={[-0.9, 0.2, 0.3]} rotation={[0, 0, -0.2]}>
        <capsuleGeometry args={[0.3, 0.8, 4, 8]} />
        <meshStandardMaterial color={bearColor} roughness={1} />
      </mesh>
      <mesh position={[0.9, 0.2, 0.3]} rotation={[0, 0, 0.2]}>
        <capsuleGeometry args={[0.3, 0.8, 4, 8]} />
        <meshStandardMaterial color={bearColor} roughness={1} />
      </mesh>
      
      {/* Legs */}
      <mesh position={[-0.5, -0.7, 0.8]} rotation={[1.2, 0, -0.2]}>
        <capsuleGeometry args={[0.32, 0.7, 4, 8]} />
        <meshStandardMaterial color={bearColor} roughness={1} />
      </mesh>
      <mesh position={[0.5, -0.7, 0.8]} rotation={[1.2, 0, 0.2]}>
        <capsuleGeometry args={[0.32, 0.7, 4, 8]} />
        <meshStandardMaterial color={bearColor} roughness={1} />
      </mesh>

      {/* Feet/Paws */}
      <mesh position={[-0.5, -0.5, 1.2]} rotation={[0.2, 0, -0.2]}>
         <sphereGeometry args={[0.35, 16, 16]} />
         <meshStandardMaterial color={bearColor} roughness={1} />
      </mesh>
      <mesh position={[-0.5, -0.45, 1.45]} rotation={[0.2, 0, -0.2]}>
         <circleGeometry args={[0.15]} />
         <meshStandardMaterial color={snoutColor} roughness={1} />
      </mesh>

      <mesh position={[0.5, -0.5, 1.2]} rotation={[0.2, 0, 0.2]}>
         <sphereGeometry args={[0.35, 16, 16]} />
         <meshStandardMaterial color={bearColor} roughness={1} />
      </mesh>
      <mesh position={[0.5, -0.45, 1.45]} rotation={[0.2, 0, 0.2]}>
         <circleGeometry args={[0.15]} />
         <meshStandardMaterial color={snoutColor} roughness={1} />
      </mesh>

    </group>
  );
};

export const Sofa: React.FC = () => {
  const leatherColor = "#3d2b1f"; // Richer, darker brown
  
  const leatherMaterial = (
    <meshStandardMaterial 
        color={leatherColor} 
        roughness={0.6} 
        metalness={0.1}
    />
  );

  // Tufting buttons
  const buttons = [];
  for (let x = -1.2; x <= 1.2; x += 0.6) {
    buttons.push(
      <mesh key={x} position={[x, 1.4, -0.25]} rotation={[0, 0, 0]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#2a1a10" roughness={0.8} />
      </mesh>
    );
  }

  return (
    <group>
      {/* Main Base */}
      <RoundedBox args={[3.5, 0.5, 2]} radius={0.1} smoothness={4} position={[0, 0.25, 0]} castShadow receiveShadow>
        {leatherMaterial}
      </RoundedBox>
      
      {/* Backrest */}
      <RoundedBox args={[3.5, 1.5, 0.5]} radius={0.1} smoothness={4} position={[0, 1.25, -0.75]} castShadow receiveShadow>
        {leatherMaterial}
      </RoundedBox>

      {/* Tufted Details on Backrest */}
      {buttons}
      
      {/* Armrests */}
      <RoundedBox args={[0.5, 1, 2.1]} radius={0.1} smoothness={4} position={[-1.5, 0.75, 0]} castShadow receiveShadow>
        {leatherMaterial}
      </RoundedBox>
      <RoundedBox args={[0.5, 1, 2.1]} radius={0.1} smoothness={4} position={[1.5, 0.75, 0]} castShadow receiveShadow>
        {leatherMaterial}
      </RoundedBox>
      
      {/* Cushions */}
      <RoundedBox args={[1.35, 0.25, 1.5]} radius={0.15} smoothness={4} position={[-0.64, 0.6, 0.2]} castShadow receiveShadow>
        <meshStandardMaterial color="#4a3b2f" roughness={0.7} />
      </RoundedBox>
      <RoundedBox args={[1.35, 0.25, 1.5]} radius={0.15} smoothness={4} position={[0.64, 0.6, 0.2]} castShadow receiveShadow>
        <meshStandardMaterial color="#4a3b2f" roughness={0.7} />
      </RoundedBox>

      {/* Legs */}
      <mesh position={[-1.5, -0.1, -0.8]}>
        <cylinderGeometry args={[0.05, 0.03, 0.2]} />
        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[1.5, -0.1, -0.8]}>
        <cylinderGeometry args={[0.05, 0.03, 0.2]} />
        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[-1.5, -0.1, 0.8]}>
        <cylinderGeometry args={[0.05, 0.03, 0.2]} />
        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[1.5, -0.1, 0.8]}>
        <cylinderGeometry args={[0.05, 0.03, 0.2]} />
        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Teddy Bear sitting on the sofa */}
      <Bear />
    </group>
  );
};