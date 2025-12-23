import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface ChristmasTreeProps {
  isOn: boolean;
  toggle: () => void;
}

export const ChristmasTree: React.FC<ChristmasTreeProps> = ({ isOn, toggle }) => {
  // --- Create Layers for "Branch" Effect ---
  // More layers for a dense, classic look
  const layers = useMemo(() => {
    const items = [];
    const count = 10; // Increased layer count
    for (let i = 0; i < count; i++) {
        const progress = i / count;
        // Base radius wider at bottom
        const radius = 0.8 - (progress * 0.65); 
        const height = 0.45;
        const y = 0.3 + (i * 0.22); // Overlap layers significantly
        items.push({ position: [0, y, 0], radius, height });
    }
    return items;
  }, []);

  // --- Ornaments (Balls) ---
  const ornamentCount = 50;
  const ornaments = useMemo(() => {
      const items = [];
      const colors = ["#d32f2f", "#ffb300", "#ff6f00"]; // Red, Gold, Amber
      for(let i=0; i<ornamentCount; i++) {
          const y = 0.4 + Math.random() * 2.0;
          // Radius roughly follows tree shape
          const layerR = 0.8 - ((y - 0.3) / 2.2) * 0.65;
          const r = layerR + 0.05; 
          const theta = Math.random() * Math.PI * 2;
          
          items.push({
              position: [r * Math.cos(theta), y, r * Math.sin(theta)] as [number, number, number],
              color: colors[Math.floor(Math.random() * colors.length)],
              scale: 0.04 + Math.random() * 0.03
          });
      }
      return items;
  }, []);

  // --- Lights ---
  const lightCount = 60;
  const lightData = useMemo(() => {
    const data = [];
    for (let i = 0; i < lightCount; i++) {
        const y = 0.5 + Math.random() * 2.0;
        const layerR = 0.8 - ((y - 0.3) / 2.2) * 0.65;
        const r = layerR + 0.02; 
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
      <mesh position={[0, 0.15, 0]} castShadow>
         <cylinderGeometry args={[0.2, 0.15, 0.3, 8]} />
         <meshStandardMaterial color="#5d4037" roughness={0.9} />
      </mesh>
      
      {/* Trunk (Central) */}
      <mesh position={[0, 1.0, 0]}>
         <cylinderGeometry args={[0.1, 0.1, 2.0]} />
         <meshStandardMaterial color="#3e2723" />
      </mesh>

      {/* Foliage Layers (Branches) */}
      {layers.map((layer, idx) => (
          <group key={idx} position={[0, layer.position[1], 0]}>
             {/* Main Green Part */}
             <mesh castShadow>
                <coneGeometry args={[layer.radius, layer.height, 16]} />
                <meshStandardMaterial color="#1b5e20" roughness={0.8} />
             </mesh>
             {/* Snow Tip (Slightly larger, wider, white cone at bottom or ring?) */}
             {/* Let's try a white torus at the base of the cone to simulate snow on tips */}
             <mesh position={[0, -layer.height/2 + 0.02, 0]} rotation={[Math.PI/2, 0, 0]}>
                 <torusGeometry args={[layer.radius - 0.02, 0.03, 8, 16]} />
                 <meshStandardMaterial color="#ffffff" roughness={1} />
             </mesh>
             {/* Random white blobs for snow on branches */}
             {[0,1,2].map(k => (
                 <mesh key={k} position={[
                     (Math.random()-0.5)*layer.radius, 
                     (Math.random()-0.5)*layer.height*0.5, 
                     (Math.random()-0.5)*layer.radius
                 ]}>
                     <sphereGeometry args={[0.04]} />
                     <meshStandardMaterial color="white" />
                 </mesh>
             ))}
          </group>
      ))}

      {/* Ornaments */}
      {ornaments.map((o, i) => (
          <mesh key={`ornament-${i}`} position={o.position} castShadow>
              <sphereGeometry args={[o.scale, 16, 16]} />
              <meshStandardMaterial color={o.color} metalness={0.7} roughness={0.2} />
          </mesh>
      ))}
      
      {/* Star - Larger, 5-pointed */}
      <group position={[0, 2.45, 0]} rotation={[0, 0, 0]}>
          <mesh scale={[1.5, 1.5, 0.5]}>
             {/* Simple star approximation using Dodecahedron or customized shape. Let's use a flat cylinder or sphere with specific material */}
             <cylinderGeometry args={[0.2, 0.05, 0.05, 5]} />
             <meshStandardMaterial color="#ffd700" emissive="#ffd700" emissiveIntensity={isOn ? 0.8 : 0} metalness={1} roughness={0.3} />
          </mesh>
          <pointLight intensity={isOn ? 1 : 0} distance={2} color="gold" />
      </group>

      {/* Lights Group */}
      <group ref={lightsRef}>
          {lightData.map((d, i) => (
             <mesh key={i} position={d.position}>
                 <sphereGeometry args={[0.02, 8, 8]} />
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
      {isOn && <pointLight position={[0, 1.2, 0]} intensity={1.5} distance={6} color="#ffaa00" decay={2} />}
    </group>
  );
};