import React from 'react';
import { PC } from './PC';
import { CrystalBall } from './CrystalBall';
import { GamingChair } from './GamingChair';

interface OfficeAreaProps {
    isPCOn: boolean;
    togglePC: () => void;
    isCrystalBallOn: boolean;
    toggleCrystalBall: () => void;
}

export const OfficeArea: React.FC<OfficeAreaProps> = ({ isPCOn, togglePC, isCrystalBallOn, toggleCrystalBall }) => {
  return (
    <group>
      {/* Desk - Widened to 4.5 */}
      <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
         <boxGeometry args={[4.5, 0.1, 1.5]} />
         <meshStandardMaterial color="#5d4037" roughness={0.6} />
      </mesh>
      
      {/* Desk Legs - Adjusted for width */}
      <mesh position={[-2.1, 0.7, -0.6]} castShadow>
         <boxGeometry args={[0.1, 1.4, 0.1]} />
         <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[2.1, 0.7, -0.6]} castShadow>
         <boxGeometry args={[0.1, 1.4, 0.1]} />
         <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[-2.1, 0.7, 0.6]} castShadow>
         <boxGeometry args={[0.1, 1.4, 0.1]} />
         <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[2.1, 0.7, 0.6]} castShadow>
         <boxGeometry args={[0.1, 1.4, 0.1]} />
         <meshStandardMaterial color="#222" />
      </mesh>

      {/* Equipment */}
      {/* PC Setup */}
      <group position={[0, 0, 0]}> 
         <PC isOn={isPCOn} toggle={togglePC} />
      </group>

      {/* Crystal Ball (Left side of desk) */}
      <group position={[-1.5, 1.45, 0.3]} scale={0.5}>
         <CrystalBall isOn={isCrystalBallOn} toggle={toggleCrystalBall} />
      </group>

      {/* Keyboard Decoration */}
      <mesh position={[0, 1.46, 0.4]}>
          <boxGeometry args={[0.8, 0.02, 0.3]} />
          <meshStandardMaterial color="#222" />
      </mesh>
      
      {/* Mouse Decoration (Improved) */}
      <group position={[0.6, 1.46, 0.4]}>
          {/* Mouse Body */}
          <mesh castShadow>
             <capsuleGeometry args={[0.07, 0.12, 4, 8]} /> 
             <meshStandardMaterial color="#1a1a1a" roughness={0.3} />
          </mesh>
          {/* Mouse Wheel */}
          <mesh position={[0, 0.04, -0.05]} rotation={[0, 0, Math.PI/2]}>
              <cylinderGeometry args={[0.015, 0.015, 0.02, 16]} />
              <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.5} />
          </mesh>
      </group>

      {/* Gaming Chair - Placed in front of desk (Z+ direction relative to desk) */}
      {/* Rotated Math.PI to face the desk (which is at local 0,0,0 and PC is facing +Z) */}
      <group position={[0, 0, 1.2]} rotation={[0, Math.PI, 0]}>
          <GamingChair />
      </group>
    </group>
  );
};