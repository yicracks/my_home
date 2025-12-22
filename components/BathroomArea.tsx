import React, { useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { MeshReflectorMaterial } from '@react-three/drei';

interface BathroomAreaProps {
  isSinkOn: boolean;
  toggleSink: () => void;
  isShowerOn: boolean;
  toggleShower: () => void;
  isFlushing: boolean;
  triggerFlush: () => void;
}

// --- Sub-Component: Shower Particles (Rain Effect) ---
const ShowerWater: React.FC<{ isOn: boolean }> = ({ isOn }) => {
  const count = 3000; // Dense rain
  const pointsRef = useRef<THREE.Points>(null);
  const headHeight = 2.25; // Just below the cone

  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Initialize all points hidden or at start
      temp[i * 3] = 0;
      temp[i * 3 + 1] = -10; // Hide initially
      temp[i * 3 + 2] = 0;
    }
    return temp;
  }, []);

  useFrame(() => {
    if (!isOn && pointsRef.current) {
        // Hide particles if off
        const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
        for(let i=0; i<count; i++) positions[i*3+1] = -10;
        pointsRef.current.geometry.attributes.position.needsUpdate = true;
        return;
    }
    
    if (pointsRef.current) {
        const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
        
        for (let i = 0; i < count; i++) {
            let y = positions[i * 3 + 1];
            
            // If particle is "dead" (below floor) or hidden, respawn it at the top
            if (y < 0) {
                 const r = 0.15 * Math.sqrt(Math.random()); // Even distribution in circle
                 const theta = Math.random() * 2 * Math.PI;
                 
                 positions[i * 3] = r * Math.cos(theta); // x relative to group
                 // Respawn exactly at nozzle height, spread slightly so they don't appear in sheets
                 positions[i * 3 + 1] = headHeight - (Math.random() * 0.2); 
                 positions[i * 3 + 2] = r * Math.sin(theta); // z relative to group
            } else {
                 // Move down fast
                 const speed = 0.15 + Math.random() * 0.05;
                 positions[i * 3 + 1] -= speed; 
            }
        }
        pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef} position={[0, 0, 0]}>
        <bufferGeometry>
            <bufferAttribute 
                attach="attributes-position" 
                count={count} 
                array={particles} 
                itemSize={3} 
            />
        </bufferGeometry>
        <pointsMaterial 
            size={0.015} 
            color="#aaddff" 
            transparent 
            opacity={0.8} 
            sizeAttenuation 
            depthWrite={false}
        />
    </points>
  );
};

// --- Sub-Component: Shower Door ---
const ShowerDoor: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const groupRef = useRef<THREE.Group>(null);
    
    // Smooth door animation
    useFrame((state, delta) => {
        if (groupRef.current) {
            const targetRotation = isOpen ? -Math.PI / 2.5 : 0; // Open outwards or slide
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotation, delta * 5);
        }
    });

    return (
        <group 
            position={[1.25, 0, 1.25]} // Pivot at the corner (Front-Right)
            ref={groupRef}
        >
             {/* The Door Panel (Front side) */}
             <mesh 
                position={[-1.25, 1.2, 0]} // Centered relative to pivot group
                rotation={[0, 0, 0]}
                onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
                onPointerOver={() => document.body.style.cursor = 'pointer'}
                onPointerOut={() => document.body.style.cursor = 'auto'}
             >
                <boxGeometry args={[2.5, 2.4, 0.05]} />
                <meshPhysicalMaterial 
                    color="#ccffff" 
                    transmission={0.9} 
                    opacity={0.3} 
                    transparent 
                    roughness={0} 
                    metalness={0.1}
                    side={THREE.DoubleSide}
                />
                {/* Handle */}
                <mesh position={[-1, 0, 0.05]}>
                    <cylinderGeometry args={[0.02, 0.02, 0.2]} />
                    <meshStandardMaterial color="silver" />
                </mesh>
             </mesh>
        </group>
    )
}

export const BathroomArea: React.FC<BathroomAreaProps> = ({ 
    isSinkOn, toggleSink, 
    isShowerOn, toggleShower, 
    isFlushing, triggerFlush 
}) => {
  
  // Toilet Water Animation Logic
  const toiletWaterRef = useRef<THREE.Mesh>(null);
  const [flushTime, setFlushTime] = useState(0);

  useEffect(() => {
      if(isFlushing) {
          setFlushTime(0);
      }
  }, [isFlushing]);

  useFrame((state, delta) => {
      if (isFlushing && toiletWaterRef.current) {
          setFlushTime(prev => prev + delta);
          
          let scale = 1;
          let rotationSpeed = 0;

          if (flushTime < 1.5) {
              // Draining
              const progress = flushTime / 1.5;
              scale = 1 - progress; // 1 -> 0
              rotationSpeed = 10 + progress * 20; 
          } else if (flushTime < 2.0) {
              // Empty
              scale = 0.01;
              rotationSpeed = 0;
          } else if (flushTime < 3.0) {
              // Refilling
              const progress = (flushTime - 2.0) / 1.0;
              scale = progress; // 0 -> 1
              rotationSpeed = 1; 
          } else {
              scale = 1;
              rotationSpeed = 0;
          }

          toiletWaterRef.current.scale.set(scale, scale, 1);
          toiletWaterRef.current.rotation.z -= rotationSpeed * delta;
      }
  });

  // Adjusted positions for scaled furniture
  // Old: Vanity[4, 0, -7.5], Toilet[-2, 0, -7.5], Shower[-7, 0, -6.75]
  // New: Pull closer to 0 (center) to account for scale=1.7
  return (
    <group>
      {/* ================= ZONE 1: VANITY (Sink) ================= */}
      <group position={[2.3, 0, -4.4]}> 
        {/* Cabinet Base */}
        <mesh position={[0, 0.4, 0]} castShadow>
            <boxGeometry args={[2.5, 0.8, 1.2]} />
            <meshStandardMaterial color="#212121" roughness={0.3} />
        </mesh>
        {/* Countertop */}
        <mesh position={[0, 0.82, 0]}>
            <boxGeometry args={[2.6, 0.05, 1.3]} />
            <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.1} />
        </mesh>
        
        {/* Sink Basin (Simulated) */}
        <mesh position={[0, 0.83, 0.1]}>
            <boxGeometry args={[1.2, 0.02, 0.8]} />
            <meshStandardMaterial color="#eeeeee" roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.84, 0.1]} rotation={[-Math.PI/2, 0, 0]}>
            <ringGeometry args={[0.05, 0.08, 16]} />
            <meshStandardMaterial color="#aaa" metalness={0.8} />
        </mesh>

        {/* Drain Hole */}
        <mesh position={[0, 0.841, 0.1]} rotation={[-Math.PI/2, 0, 0]}>
            <circleGeometry args={[0.04]} />
            <meshStandardMaterial color="#111" />
        </mesh>

        {/* Faucet */}
        <group position={[0, 0.85, -0.2]}>
             <mesh position={[0, 0.1, 0]}>
                 <cylinderGeometry args={[0.04, 0.05, 0.2]} />
                 <meshStandardMaterial color="silver" metalness={0.8} roughness={0.2} />
             </mesh>
             <mesh position={[0, 0.2, 0.1]} rotation={[0.5, 0, 0]}>
                 <cylinderGeometry args={[0.03, 0.03, 0.3]} />
                 <meshStandardMaterial color="silver" metalness={0.8} roughness={0.2} />
             </mesh>
             {/* Handle - Clickable */}
             <mesh 
                position={[0.15, 0.05, 0]} 
                rotation={[0, 0, Math.PI/2]} 
                onClick={(e) => { e.stopPropagation(); toggleSink(); }}
                onPointerOver={() => document.body.style.cursor = 'pointer'}
                onPointerOut={() => document.body.style.cursor = 'auto'}
             >
                 <cylinderGeometry args={[0.02, 0.02, 0.15]} />
                 <meshStandardMaterial color={isSinkOn ? "#00aaff" : "silver"} metalness={0.8} />
             </mesh>
        </group>

        {/* Sink Water Stream */}
        {isSinkOn && (
            <mesh position={[0, 0.5, 0.1]}>
                <cylinderGeometry args={[0.015, 0.015, 0.6]} />
                <meshPhysicalMaterial color="#aaddff" transmission={0.9} transparent opacity={0.6} roughness={0.1} />
            </mesh>
        )}

        {/* Toiletries */}
        {/* Toothbrush Cup */}
        <group position={[-0.8, 0.9, -0.2]}>
            <mesh>
                <cylinderGeometry args={[0.06, 0.05, 0.15]} />
                <meshPhysicalMaterial color="white" transmission={0.5} opacity={0.8} />
            </mesh>
            {/* Toothbrush */}
            <mesh position={[0.02, 0.1, 0]} rotation={[0.2, 0, 0]}>
                <cylinderGeometry args={[0.008, 0.008, 0.25]} />
                <meshStandardMaterial color="red" />
            </mesh>
            {/* Toothpaste */}
            <mesh position={[-0.02, 0.05, 0]} rotation={[-0.1, 0, 0]}>
                <boxGeometry args={[0.06, 0.18, 0.02]} />
                <meshStandardMaterial color="white" />
            </mesh>
        </group>
        
        {/* Lotion Bottle */}
        <group position={[0.8, 0.95, -0.2]}>
             <mesh>
                 <cylinderGeometry args={[0.07, 0.07, 0.25]} />
                 <meshStandardMaterial color="#fce4ec" />
             </mesh>
             <mesh position={[0, 0.15, 0]}>
                 <cylinderGeometry args={[0.02, 0.02, 0.05]} />
                 <meshStandardMaterial color="white" />
             </mesh>
        </group>
      </group>


      {/* ================= ZONE 2: TOILET ================= */}
      <group position={[-1.2, 0, -4.4]}>
         {/* Base */}
         <mesh position={[0, 0.15, 0]} castShadow>
             <cylinderGeometry args={[0.25, 0.3, 0.3]} />
             <meshStandardMaterial color="white" roughness={0.1} />
         </mesh>
         
         {/* Hollow Bowl Structure */}
         <group position={[0, 0.5, 0.1]}>
             {/* Outer/Inner Wall (Tube) */}
             <mesh castShadow>
                 <cylinderGeometry args={[0.35, 0.25, 0.4, 32, 1, true]} />
                 <meshStandardMaterial color="white" roughness={0.1} side={THREE.DoubleSide} />
             </mesh>
             {/* Rim (Top Ring) */}
             <mesh position={[0, 0.2, 0]} rotation={[-Math.PI/2, 0, 0]}>
                 <ringGeometry args={[0.25, 0.35, 32]} />
                 <meshStandardMaterial color="white" roughness={0.1} />
             </mesh>
             {/* Bottom Cap */}
             <mesh position={[0, -0.2, 0]} rotation={[-Math.PI/2, 0, 0]}>
                 <circleGeometry args={[0.25]} />
                 <meshStandardMaterial color="white" roughness={0.1} />
             </mesh>

             {/* Water (Recessed) */}
             <mesh 
                ref={toiletWaterRef}
                position={[0, 0.05, 0]} // Deep inside
                rotation={[-Math.PI/2, 0, 0]}
             >
                 <circleGeometry args={[0.28]} />
                 <meshBasicMaterial color={isFlushing ? "#0088ff" : "#00bbff"} opacity={0.8} transparent />
             </mesh>
         </group>

         {/* Tank */}
         <mesh position={[0, 0.9, -0.35]}>
             <boxGeometry args={[0.6, 0.5, 0.25]} />
             <meshStandardMaterial color="white" roughness={0.1} />
         </mesh>
         
         {/* Lid (OPEN) */}
         <group position={[0, 0.72, -0.15]} rotation={[-1.8, 0, 0]}> 
             <mesh position={[0, 0, 0.25]}>
                <cylinderGeometry args={[0.36, 0.36, 0.04]} />
                <meshStandardMaterial color="white" />
             </mesh>
         </group>
         
         {/* Flush Button */}
         <mesh 
            position={[0.2, 1.15, -0.35]} 
            onClick={(e) => { e.stopPropagation(); triggerFlush(); }}
            onPointerOver={() => document.body.style.cursor = 'pointer'}
            onPointerOut={() => document.body.style.cursor = 'auto'}
         >
             <cylinderGeometry args={[0.04, 0.04, 0.05]} />
             <meshStandardMaterial color="silver" metalness={0.8} />
         </mesh>
      </group>


      {/* ================= ZONE 3: SHOWER ================= */}
      <group position={[-4.7, 0, -4.0]}>
          {/* Shower Pan */}
          <mesh position={[0, 0.02, 0]} receiveShadow>
              <boxGeometry args={[2.5, 0.05, 2.5]} />
              <meshStandardMaterial color="#eee" roughness={0.5} />
          </mesh>

          {/* Shower Drain */}
          <mesh position={[0, 0.03, 0]} rotation={[-Math.PI/2, 0, 0]}>
              <circleGeometry args={[0.15, 16]} />
              <meshStandardMaterial color="#888" metalness={0.5} />
          </mesh>
          <mesh position={[0, 0.031, 0]} rotation={[-Math.PI/2, 0, 0]}>
              <ringGeometry args={[0.0, 0.12, 8]} />
              <meshBasicMaterial color="#333" wireframe />
          </mesh>
          
          {/* Side Glass Partition */}
          <mesh position={[1.25, 1.2, 0]} rotation={[0, 0, 0]}>
              <boxGeometry args={[0.05, 2.4, 2.5]} />
              <meshPhysicalMaterial 
                color="#ccffff" 
                transmission={0.9} 
                opacity={0.3} 
                transparent 
                roughness={0} 
                metalness={0.1}
                side={THREE.DoubleSide}
              />
          </mesh>
          
          {/* Shower Door */}
          <ShowerDoor />

          {/* Shower Head */}
          <group position={[0, 2.4, -0.5]}>
              <mesh position={[0, 0, -0.2]}>
                  <cylinderGeometry args={[0.05, 0.05, 0.3]} rotation={[Math.PI/2, 0, 0]} />
                  <meshStandardMaterial color="silver" metalness={0.9} />
              </mesh>
              <mesh position={[0, -0.1, 0]}>
                  <coneGeometry args={[0.15, 0.1, 32]} />
                  <meshStandardMaterial color="silver" metalness={0.9} />
              </mesh>
          </group>

          {/* Controls */}
          <group position={[-1.2, 1.4, 0]}> 
             <mesh 
                rotation={[0, 0, Math.PI/2]} 
                onClick={(e) => { e.stopPropagation(); toggleShower(); }}
                onPointerOver={() => document.body.style.cursor = 'pointer'}
                onPointerOut={() => document.body.style.cursor = 'auto'}
             >
                 <cylinderGeometry args={[0.06, 0.06, 0.1]} />
                 <meshStandardMaterial color={isShowerOn ? "#00aaff" : "silver"} metalness={0.8} />
             </mesh>
          </group>

          {/* Falling Water */}
          <group position={[0, 0, -0.5]}>
            <ShowerWater isOn={isShowerOn} />
          </group>

      </group>

    </group>
  );
};