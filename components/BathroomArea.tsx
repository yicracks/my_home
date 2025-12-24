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

const ShowerWater: React.FC<{ isOn: boolean }> = ({ isOn }) => {
  const count = 3000; 
  const pointsRef = useRef<THREE.Points>(null);
  const headHeight = 2.25; 

  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      temp[i * 3] = 0;
      temp[i * 3 + 1] = -10; 
      temp[i * 3 + 2] = 0;
    }
    return temp;
  }, []);

  useFrame(() => {
    if (!isOn && pointsRef.current) {
        const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
        for(let i=0; i<count; i++) positions[i*3+1] = -10;
        pointsRef.current.geometry.attributes.position.needsUpdate = true;
        return;
    }
    
    if (pointsRef.current) {
        const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < count; i++) {
            let y = positions[i * 3 + 1];
            if (y < 0) {
                 const r = 0.15 * Math.sqrt(Math.random());
                 const theta = Math.random() * 2 * Math.PI;
                 positions[i * 3] = r * Math.cos(theta); 
                 positions[i * 3 + 1] = headHeight - (Math.random() * 0.2); 
                 positions[i * 3 + 2] = r * Math.sin(theta); 
            } else {
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

const ShowerDoor: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const groupRef = useRef<THREE.Group>(null);
    useFrame((state, delta) => {
        if (groupRef.current) {
            const targetRotation = isOpen ? -Math.PI / 2.5 : 0; 
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotation, delta * 5);
        }
    });

    return (
        <group 
            position={[1.25, 0, 1.25]} 
            ref={groupRef}
        >
             <mesh 
                position={[-1.25, 1.2, 0]} 
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
              const progress = flushTime / 1.5;
              scale = 1 - progress; 
              rotationSpeed = 10 + progress * 20; 
          } else if (flushTime < 2.0) {
              scale = 0.01;
              rotationSpeed = 0;
          } else if (flushTime < 3.0) {
              const progress = (flushTime - 2.0) / 1.0;
              scale = progress; 
              rotationSpeed = 1; 
          } else {
              scale = 1;
              rotationSpeed = 0;
          }
          toiletWaterRef.current.scale.set(scale, scale, 1);
          toiletWaterRef.current.rotation.z -= rotationSpeed * delta;
      }
  });

  // Reverting/Adjusting positions for 0.9 scale (pushing outwards)
  return (
    <group>
      {/* ================= ZONE 1: VANITY (Sink) ================= */}
      <group position={[4.0, 0, -7.5]}> 
        <mesh position={[0, 0.4, 0]} castShadow>
            <boxGeometry args={[2.5, 0.8, 1.2]} />
            <meshStandardMaterial color="#212121" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.82, 0]}>
            <boxGeometry args={[2.6, 0.05, 1.3]} />
            <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.1} />
        </mesh>
        
        <mesh position={[0, 0.83, 0.1]}>
            <boxGeometry args={[1.2, 0.02, 0.8]} />
            <meshStandardMaterial color="#eeeeee" roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.84, 0.1]} rotation={[-Math.PI/2, 0, 0]}>
            <ringGeometry args={[0.05, 0.08, 16]} />
            <meshStandardMaterial color="#aaa" metalness={0.8} />
        </mesh>

        <mesh position={[0, 0.841, 0.1]} rotation={[-Math.PI/2, 0, 0]}>
            <circleGeometry args={[0.04]} />
            <meshStandardMaterial color="#111" />
        </mesh>

        <group position={[0, 0.85, -0.2]}>
             <mesh position={[0, 0.1, 0]}>
                 <cylinderGeometry args={[0.04, 0.05, 0.2]} />
                 <meshStandardMaterial color="silver" metalness={0.8} roughness={0.2} />
             </mesh>
             <mesh position={[0, 0.2, 0.1]} rotation={[0.5, 0, 0]}>
                 <cylinderGeometry args={[0.03, 0.03, 0.3]} />
                 <meshStandardMaterial color="silver" metalness={0.8} roughness={0.2} />
             </mesh>
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

        {isSinkOn && (
            <mesh position={[0, 0.5, 0.1]}>
                <cylinderGeometry args={[0.015, 0.015, 0.6]} />
                <meshPhysicalMaterial color="#aaddff" transmission={0.9} transparent opacity={0.6} roughness={0.1} />
            </mesh>
        )}

        <group position={[-0.8, 0.9, -0.2]}>
            <mesh>
                <cylinderGeometry args={[0.06, 0.05, 0.15]} />
                <meshPhysicalMaterial color="white" transmission={0.5} opacity={0.8} />
            </mesh>
            <mesh position={[0.02, 0.1, 0]} rotation={[0.2, 0, 0]}>
                <cylinderGeometry args={[0.008, 0.008, 0.25]} />
                <meshStandardMaterial color="red" />
            </mesh>
            <mesh position={[-0.02, 0.05, 0]} rotation={[-0.1, 0, 0]}>
                <boxGeometry args={[0.06, 0.18, 0.02]} />
                <meshStandardMaterial color="white" />
            </mesh>
        </group>
        
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
      <group position={[-2.0, 0, -7.5]}>
         <mesh position={[0, 0.15, 0]} castShadow>
             <cylinderGeometry args={[0.25, 0.3, 0.3]} />
             <meshStandardMaterial color="white" roughness={0.1} />
         </mesh>
         
         <group position={[0, 0.5, 0.1]}>
             <mesh castShadow>
                 <cylinderGeometry args={[0.35, 0.25, 0.4, 32, 1, true]} />
                 <meshStandardMaterial color="white" roughness={0.1} side={THREE.DoubleSide} />
             </mesh>
             <mesh position={[0, 0.2, 0]} rotation={[-Math.PI/2, 0, 0]}>
                 <ringGeometry args={[0.25, 0.35, 32]} />
                 <meshStandardMaterial color="white" roughness={0.1} />
             </mesh>
             <mesh position={[0, -0.2, 0]} rotation={[-Math.PI/2, 0, 0]}>
                 <circleGeometry args={[0.25]} />
                 <meshStandardMaterial color="white" roughness={0.1} />
             </mesh>

             <mesh 
                ref={toiletWaterRef}
                position={[0, 0.05, 0]} 
                rotation={[-Math.PI/2, 0, 0]}
             >
                 <circleGeometry args={[0.28]} />
                 <meshBasicMaterial color={isFlushing ? "#0088ff" : "#00bbff"} opacity={0.8} transparent />
             </mesh>
         </group>

         <mesh position={[0, 0.9, -0.35]}>
             <boxGeometry args={[0.6, 0.5, 0.25]} />
             <meshStandardMaterial color="white" roughness={0.1} />
         </mesh>
         
         <group position={[0, 0.72, -0.15]} rotation={[-1.8, 0, 0]}> 
             <mesh position={[0, 0, 0.25]}>
                <cylinderGeometry args={[0.36, 0.36, 0.04]} />
                <meshStandardMaterial color="white" />
             </mesh>
         </group>
         
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


      {/* ================= ZONE 3: SHOWER & SEWER ================= */}
      <group position={[-7.0, 0, -6.75]}>
          <mesh position={[0, 0.02, 0]} receiveShadow>
              <boxGeometry args={[2.5, 0.05, 2.5]} />
              <meshStandardMaterial color="#eee" roughness={0.5} />
          </mesh>

          {/* Improved Sewer Drain (Grating look) */}
          <group position={[0, 0.03, 0]}>
              <mesh rotation={[-Math.PI/2, 0, 0]}>
                  <circleGeometry args={[0.15, 16]} />
                  <meshStandardMaterial color="#555" metalness={0.6} />
              </mesh>
              {/* Grate Lines */}
              <group position={[0, 0.005, 0]} rotation={[-Math.PI/2, 0, 0]}>
                  <mesh position={[0, 0, 0.01]}>
                       <ringGeometry args={[0.12, 0.15, 16]} />
                       <meshStandardMaterial color="#333" />
                  </mesh>
                  <mesh position={[0.05, 0, 0]}>
                       <boxGeometry args={[0.01, 0.2, 0.01]} />
                       <meshStandardMaterial color="#333" />
                  </mesh>
                  <mesh position={[-0.05, 0, 0]}>
                       <boxGeometry args={[0.01, 0.2, 0.01]} />
                       <meshStandardMaterial color="#333" />
                  </mesh>
                   <mesh position={[0, 0, 0]}>
                       <boxGeometry args={[0.01, 0.24, 0.01]} />
                       <meshStandardMaterial color="#333" />
                  </mesh>
                  <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI/2]}>
                       <boxGeometry args={[0.01, 0.24, 0.01]} />
                       <meshStandardMaterial color="#333" />
                  </mesh>
              </group>
          </group>
          
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
          
          <ShowerDoor />

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

          <group position={[0, 0, -0.5]}>
            <ShowerWater isOn={isShowerOn} />
          </group>

      </group>

    </group>
  );
};