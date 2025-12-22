import React from 'react';
import { SpeakerDome } from './SpeakerDome';
import { InternalStructure } from './InternalStructure';
import { Base } from './Base';
import { SpeakerProps } from '../types';

interface IntegratedSpeakerProps extends SpeakerProps {
  onToggle: () => void;
}

export const Speaker: React.FC<IntegratedSpeakerProps & any> = ({ isPlaying, onToggle, ...props }) => {
  return (
    <group {...props}>
      {/* 
         Original Speaker components were built around [0,0,0] being slightly messy.
         Base extends from -0.6 to +0.6. 
         We want "y=0" to be the bottom of the base.
         The Base component's bottom cap is at -0.05 relative to its group at -0.6. 
         Actually, let's just shift the internal group up so the visual bottom hits y=0.
         The original base was at y=-0.6. Total height ~1.2. Bottom was roughly -1.2.
         Let's just visually vertically center it then shift up by scale.
      */}
      <group scale={0.4} position={[0, 0.48, 0]}> 
        <SpeakerDome />
        <InternalStructure isPlaying={isPlaying} />
        <Base />
        
        {/* Interactive Power Button Area */}
        <mesh 
            position={[0, 0.6, 1.55]} 
            rotation={[Math.PI / 2, 0, 0]}
            onClick={(e) => {
                e.stopPropagation();
                onToggle();
            }}
            onPointerOver={() => document.body.style.cursor = 'pointer'}
            onPointerOut={() => document.body.style.cursor = 'auto'}
        >
            <cylinderGeometry args={[0.15, 0.15, 0.05, 32]} />
            <meshStandardMaterial 
                color={isPlaying ? "#ffffff" : "#333333"} 
                emissive={isPlaying ? "#ffffff" : "#000000"}
                emissiveIntensity={0.5}
            />
        </mesh>
        
        <group position={[0, 0.6, 1.58]} scale={0.08}>
             <mesh position={[0, 0, 0]}>
                <ringGeometry args={[0.6, 0.8, 32, 1, Math.PI * 0.7, Math.PI * 1.6]} />
                <meshBasicMaterial color={isPlaying ? "#00d2ff" : "#555"} />
             </mesh>
             <mesh position={[0, 0.5, 0]}>
                <planeGeometry args={[0.2, 0.6]} />
                <meshBasicMaterial color={isPlaying ? "#00d2ff" : "#555"} />
             </mesh>
        </group>
      </group>
    </group>
  );
};