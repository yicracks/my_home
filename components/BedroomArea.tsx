import React from 'react';
import { ParticleLamp } from './ParticleLamp';
import { RoundedBox } from '@react-three/drei';

interface BedroomAreaProps {
  isLampOn: boolean;
  toggleLamp: () => void;
}

export const BedroomArea: React.FC<BedroomAreaProps> = ({ isLampOn, toggleLamp }) => {
  const leatherMaterial = (
      <meshStandardMaterial 
          color="#1a1a1a" 
          roughness={0.4} 
          metalness={0.2} 
      />
  );

  return (
    <group>
      {/* --- Luxury Bed --- */}
      <group position={[0, 0, 0]}>
         {/* Low Profile Bed Base (Black Leather) */}
         {/* Wider than mattress, low to ground */}
         <RoundedBox 
            args={[3.4, 0.4, 3.5]} 
            radius={0.1} 
            smoothness={4} 
            position={[0, 0.2, 0]} 
            castShadow
         >
            {leatherMaterial}
         </RoundedBox>
         
         {/* Split Headboard (Black Leather) */}
         {/* Slightly Angled back */}
         <group position={[0, 0.8, -1.6]} rotation={[-0.1, 0, 0]}>
             <RoundedBox 
                args={[1.5, 1.2, 0.3]} 
                radius={0.1} 
                smoothness={4} 
                position={[-0.8, 0, 0]} 
                castShadow
             >
                {leatherMaterial}
             </RoundedBox>
             <RoundedBox 
                args={[1.5, 1.2, 0.3]} 
                radius={0.1} 
                smoothness={4} 
                position={[0.8, 0, 0]} 
                castShadow
             >
                {leatherMaterial}
             </RoundedBox>
         </group>

         {/* Mattress (Grey Sheets) */}
         <mesh position={[0, 0.45, 0.1]}>
            <boxGeometry args={[3.0, 0.25, 3.1]} />
            <meshStandardMaterial color="#e0e0e0" roughness={0.8} />
         </mesh>
         
         {/* Messy Duvet (Darker Grey) */}
         {/* Draped over lower part */}
         <RoundedBox 
            args={[3.1, 0.3, 2.2]} 
            radius={0.15} 
            smoothness={8} 
            position={[0, 0.55, 0.6]} 
            castShadow
         >
            <meshStandardMaterial color="#9e9e9e" roughness={1} /> 
         </RoundedBox>

         {/* Textured Throw Blanket at foot of bed */}
         <RoundedBox 
            args={[3.2, 0.15, 1.0]} 
            radius={0.1} 
            smoothness={4} 
            position={[0, 0.65, 1.2]} 
            rotation={[0.05, 0, 0]}
            castShadow
         >
             <meshStandardMaterial color="#424242" roughness={1} />
         </RoundedBox>

         {/* Pillows (Grey) */}
         <group position={[0, 0.65, -1.1]} rotation={[0.2, 0, 0]}>
             <RoundedBox 
                args={[1.0, 0.25, 0.5]} 
                radius={0.1} 
                smoothness={8} 
                position={[-0.65, 0, 0]}
             >
                 <meshStandardMaterial color="#bdbdbd" roughness={0.9} />
             </RoundedBox>
             <RoundedBox 
                args={[1.0, 0.25, 0.5]} 
                radius={0.1} 
                smoothness={8} 
                position={[0.65, 0, 0]}
             >
                 <meshStandardMaterial color="#bdbdbd" roughness={0.9} />
             </RoundedBox>
         </group>
      </group>

      {/* --- Nightstand (Left of bed) --- */}
      <group position={[-2.4, 0, -1.2]}> {/* Moved left due to wider bed */}
          <mesh position={[0, 0.25, 0]} castShadow>
              <boxGeometry args={[0.8, 0.5, 0.8]} />
              <meshStandardMaterial color="#212121" roughness={0.5} />
          </mesh>
          
          {/* Particle Lamp on top */}
          <group position={[0, 0.5, 0]}>
              <ParticleLamp isOn={isLampOn} toggle={toggleLamp} />
          </group>
      </group>

    </group>
  );
};