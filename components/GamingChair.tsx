import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const GamingChair: React.FC<any> = (props) => {
  const groupRef = useRef<THREE.Group>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  
  // Animation state to track rotation progress
  const rotationProgress = useRef(0);

  useFrame((state, delta) => {
    if (isSpinning && groupRef.current) {
      // Rotate 360 degrees (2 PI) over approx 0.8 second
      const speed = 8; 
      rotationProgress.current += speed * delta;
      
      if (rotationProgress.current >= Math.PI * 2) {
        // Reset
        groupRef.current.rotation.y = Math.PI; // Face forward relative to desk (180 deg)
        rotationProgress.current = 0;
        setIsSpinning(false);
      } else {
        // Start from Math.PI (facing desk) and add rotation
        groupRef.current.rotation.y = Math.PI + rotationProgress.current;
      }
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (!isSpinning) {
      setIsSpinning(true);
    }
  };

  const primaryColor = "#1a1a1a";
  const accentColor = "#d32f2f"; // Racing Red

  return (
    <group {...props} ref={groupRef} onClick={handleClick}>
       {/* Base (Star/Wheels) */}
       <group position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0, 0.35, 0.15, 5]} />
          <meshStandardMaterial color="#333" />
          {/* Wheels placeholder */}
          <mesh position={[0, -0.08, 0]}>
            <cylinderGeometry args={[0.35, 0.35, 0.05, 5]} />
             <meshStandardMaterial color="#111" />
          </mesh>
       </group>
       
       {/* Gas Lift */}
       <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.4]} />
          <meshStandardMaterial color="#555" metalness={0.8} />
       </mesh>

       {/* Seat Group - Pivot from center */}
       <group position={[0, 0, 0]}>
           {/* Seat Bottom */}
           <mesh position={[0, 0.55, 0]} castShadow>
             <boxGeometry args={[0.55, 0.1, 0.55]} />
             <meshStandardMaterial color={primaryColor} roughness={0.5} />
           </mesh>
           <mesh position={[0, 0.56, 0.23]}> 
             <boxGeometry args={[0.55, 0.02, 0.04]} />
             <meshStandardMaterial color={accentColor} />
           </mesh>

           {/* Backrest */}
           <group position={[0, 1.05, -0.2]}>
              <mesh castShadow rotation={[0.1, 0, 0]}>
                 <boxGeometry args={[0.5, 1, 0.1]} />
                 <meshStandardMaterial color={primaryColor} roughness={0.5} />
              </mesh>
              {/* Racing stripes */}
              <mesh position={[-0.18, 0, 0.051]} rotation={[0.1, 0, 0]}>
                 <planeGeometry args={[0.05, 0.9]} />
                 <meshBasicMaterial color={accentColor} />
              </mesh>
              <mesh position={[0.18, 0, 0.051]} rotation={[0.1, 0, 0]}>
                 <planeGeometry args={[0.05, 0.9]} />
                 <meshBasicMaterial color={accentColor} />
              </mesh>
              {/* Headrest Pillow */}
               <mesh position={[0, 0.35, 0.06]} rotation={[0.1, 0, 0]}>
                 <boxGeometry args={[0.3, 0.15, 0.05]} />
                 <meshStandardMaterial color={primaryColor} />
              </mesh>
           </group>

           {/* Armrests */}
           <mesh position={[-0.3, 0.75, 0]} rotation={[0, 0, 0.1]}>
              <boxGeometry args={[0.05, 0.4, 0.05]} />
              <meshStandardMaterial color="#333" />
           </mesh>
           <mesh position={[0.3, 0.75, 0]} rotation={[0, 0, -0.1]}>
              <boxGeometry args={[0.05, 0.4, 0.05]} />
              <meshStandardMaterial color="#333" />
           </mesh>
           <mesh position={[-0.3, 0.95, 0]}>
              <boxGeometry args={[0.08, 0.02, 0.35]} />
              <meshStandardMaterial color="#333" />
           </mesh>
           <mesh position={[0.3, 0.95, 0]}>
              <boxGeometry args={[0.08, 0.02, 0.35]} />
              <meshStandardMaterial color="#333" />
           </mesh>
       </group>
    </group>
  );
};