import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface ChristmasTreeProps {
  isOn: boolean;
  toggle: () => void;
}

export const ChristmasTree: React.FC<ChristmasTreeProps> = ({ isOn, toggle }) => {
  // --- Create Layers for "Branch" Effect ---
  // Instead of 3 big cones, we make ~8 stacked cones decreasing in size
  const layers = useMemo(() => {
    const items = [];
    const count = 7;
    for (let i = 0; i < count; i++) {
        // Base width gets smaller as we go up
        // i=0 (bottom): width ~0.8
        // i=count (top): width ~0.2
        const progress = i / count;
        const radius = 0.6 - (progress * 0.45); 
        const height = 0.4;
        const y = 0.4 + (i * 0.25); // Overlap layers
        items.push({ position: [0, y, 0], radius, height });
    }
    return items;
  }, []);

  // --- Generate Lights on the Tree Surface ---
  const lightCount = 40;
  const lightData = useMemo(() => {
    const data = [];
    for (let i = 0; i < lightCount; i++) {
        // Distribute lights vertically along the tree
        // Tree foliage goes from y=0.4 to y ~2.2
        const y = 0.5 + Math.random() * 1.5;
        
        // Approximate radius at this height (linear interpolation of tree shape)
        // Bottom r=0.6 at y=0.4, Top r=0 at y=2.2
        const shapeRatio = (2.2 - y) / 1.8; 
        const maxR = shapeRatio * 0.6;
        const r = maxR + 0.02; // Sit slightly outside

        const theta = Math.random() * Math.PI * 2;
        
        data.push({
            position: [r * Math.cos(theta), y, r * Math.sin(theta)] as [number, number, number],
            color: new THREE.Color().setHSL(Math.random(), 1, 0.5),
            speed: 2 + Math.random() * 3, 
            offset: Math.random() * Math.PI * 2
        });
    }
    return data;
  }, []);

  const lightsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
      if (isOn && lightsRef.current) {
          lightsRef.current.children.forEach((mesh, i) => {
              const data = lightData[i];
              // Blinking effect
              const intensity = (Math.sin(state.clock.elapsedTime * data.speed + data.offset) + 1) / 2;
              
              const mat = (mesh as THREE.Mesh).material as THREE.MeshStandardMaterial;
              if (intensity > 0.5) {
                  mat.emissive = data.color;
                  mat.emissiveIntensity = 3; 
              } else {
                  mat.emissive = new THREE.Color(0x000000);
                  mat.emissiveIntensity = 0;
              }
          });
      }
  });

  return (
    <group onClick={(e) => { e.stopPropagation(); toggle(); }}>
      {/* Tree Base / Pot */}
      <mesh position={[0, 0.15, 0]}>
         <cylinderGeometry args={[0.2, 0.15, 0.3, 8]} />
         <meshStandardMaterial color="#8d6e63" />
      </mesh>
      
      {/* Trunk (Central) */}
      <mesh position={[0, 1.0, 0]}>
         <cylinderGeometry args={[0.08, 0.08, 1.5]} />
         <meshStandardMaterial color="#3e2723" />
      </mesh>

      {/* Foliage Layers (Branches) */}
      {layers.map((layer, idx) => (
          <mesh key={idx} position={[0, layer.position[1], 0]} castShadow>
             <coneGeometry args={[layer.radius, layer.height, 16]} />
             <meshStandardMaterial color="#1b5e20" roughness={0.9} />
          </mesh>
      ))}
      
      {/* Star */}
      <mesh position={[0, 2.2, 0]} rotation={[0, 0, 0.2]}>
          <octahedronGeometry args={[0.12]} />
          <meshStandardMaterial color="gold" emissive="gold" emissiveIntensity={isOn ? 2 : 0} />
      </mesh>

      {/* Lights Group */}
      <group ref={lightsRef}>
          {lightData.map((d, i) => (
             <mesh key={i} position={d.position}>
                 {/* Bulb Shape: Capsule or elongated sphere */}
                 <capsuleGeometry args={[0.02, 0.05, 4, 8]} />
                 <meshStandardMaterial 
                    color={d.color} 
                    roughness={0.2}
                    emissive={isOn ? d.color : new THREE.Color(0,0,0)}
                    emissiveIntensity={isOn ? 3 : 0}
                 />
             </mesh>
          ))}
      </group>
      
      {/* Area Glow */}
      {isOn && <pointLight position={[0, 1.0, 0]} intensity={2.0} distance={5} color="#ffaa00" decay={2} />}
    </group>
  );
};