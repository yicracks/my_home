import React from 'react';
import { ParticleLamp } from './ParticleLamp';
import { RoundedBox } from '@react-three/drei';

interface BedroomAreaProps {
  isLampOn: boolean;
  toggleLamp: () => void;
}

export const BedroomArea: React.FC<BedroomAreaProps> = ({ isLampOn, toggleLamp }) => {
  return (
    <group>
      {/* --- Bed --- */}
      <group position={[0, 0, 0]}>
         {/* Bed Frame (Wider King Size: 2.2 -> 3.0) */}
         <mesh position={[0, 0.25, 0]} castShadow>
            <boxGeometry args={[3.0, 0.5, 3.2]} />
            <meshStandardMaterial color="#5d4037" roughness={0.6} />
         </mesh>
         
         {/* Mattress (Wider) - White */}
         <mesh position={[0, 0.6, 0]}>
            <boxGeometry args={[2.8, 0.3, 3]} />
            <meshStandardMaterial color="#ffffff" />
         </mesh>
         
         {/* Fluffy Duvet / Quilt */}
         {/* Using RoundedBox with high radius/smoothness to mimic soft fabric draping */}
         {/* Size increased to be larger than bed frame [3.0, 3.2] -> [3.4, 3.5] */}
         <RoundedBox 
            args={[3.4, 0.6, 3.5]} 
            radius={0.3} // High radius for puffiness
            smoothness={8} 
            position={[0, 0.7, 0.2]} 
            castShadow
         >
            <meshStandardMaterial color="#ffffff" roughness={1} /> 
         </RoundedBox>

         {/* Headboard (Wider) */}
         <mesh position={[0, 1, -1.55]} castShadow>
             <boxGeometry args={[3.2, 1.5, 0.1]} />
             <meshStandardMaterial color="#5d4037" roughness={0.6} />
         </mesh>
         
         {/* Soft Pillows - White */}
         <group position={[0, 0.85, -1.1]} rotation={[0.1, 0, 0]}>
             <RoundedBox 
                args={[0.9, 0.3, 0.5]} 
                radius={0.15} 
                smoothness={8} 
                position={[-0.6, 0, 0]}
             >
                 <meshStandardMaterial color="#ffffff" roughness={0.9} />
             </RoundedBox>
             <RoundedBox 
                args={[0.9, 0.3, 0.5]} 
                radius={0.15} 
                smoothness={8} 
                position={[0.6, 0, 0]}
             >
                 <meshStandardMaterial color="#ffffff" roughness={0.9} />
             </RoundedBox>
         </group>
      </group>

      {/* --- Nightstand (Left of bed) --- */}
      <group position={[-2.2, 0, -1.2]}> {/* Moved left due to wider bed */}
          <mesh position={[0, 0.3, 0]} castShadow>
              <boxGeometry args={[0.8, 0.6, 0.8]} />
              <meshStandardMaterial color="#4e342e" roughness={0.5} />
          </mesh>
          {/* Drawer Handle */}
          <mesh position={[0, 0.4, 0.41]}>
              <boxGeometry args={[0.2, 0.05, 0.02]} />
              <meshStandardMaterial color="#aaa" metalness={0.8} />
          </mesh>
          
          {/* Particle Lamp on top */}
          <group position={[0, 0.6, 0]}>
              <ParticleLamp isOn={isLampOn} toggle={toggleLamp} />
          </group>
      </group>

    </group>
  );
};