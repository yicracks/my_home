import React, { useRef, useState, useEffect, Suspense } from 'react';
import * as THREE from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { DESKTOP_URL } from '../constants';

interface PCProps {
  isOn: boolean;
  toggle: () => void;
}

export const PC: React.FC<PCProps> = ({ isOn, toggle }) => {
  const desktopTexture = useLoader(THREE.TextureLoader, DESKTOP_URL);
  const lightsRef = useRef<THREE.Group>(null);
  const [bootState, setBootState] = useState<'off' | 'booting' | 'on'>('off');
  const [bootLines, setBootLines] = useState<string[]>([]);

  useEffect(() => {
    let timer: any;
    let lineTimers: any[] = [];

    if (isOn) {
      setBootState('booting');
      setBootLines(["_"]); // Show cursor immediately so screen isn't empty
      
      // Simulate DOS boot sequence text appearing line by line
      const lines = [
        "BIOS DATE 01/01/24 15:22:00 VER 1.0.2",
        "CPU: ARMv8 Processor @ 3.2GHz",
        "Memory Test: 32768K OK",
        "Detecting Primary Master ... M.2 SSD 2TB",
        "Detecting Primary Slave ... None",
        "Booting from Drive C:...",
        "Loading OS..."
      ];

      lines.forEach((line, index) => {
        const t = setTimeout(() => {
          setBootLines(prev => {
             // Remove cursor from previous line if exists
             const cleanPrev = prev.filter(l => l !== "_");
             return [...cleanPrev, line];
          });
        }, index * 400 + 100); 
        lineTimers.push(t);
      });

      // Finish boot after 3.5 seconds
      timer = setTimeout(() => {
        setBootState('on');
      }, 3500);
    } else {
      setBootState('off');
      setBootLines([]);
      lineTimers.forEach(clearTimeout);
    }

    return () => {
      clearTimeout(timer);
      lineTimers.forEach(clearTimeout);
    };
  }, [isOn]);

  useFrame((state) => {
    if (isOn && lightsRef.current) {
        // RGB Cycle
        const time = state.clock.getElapsedTime();
        const r = Math.sin(time) * 0.5 + 0.5;
        const g = Math.sin(time + 2) * 0.5 + 0.5;
        const b = Math.sin(time + 4) * 0.5 + 0.5;
        
        lightsRef.current.children.forEach((light) => {
           if (light instanceof THREE.PointLight) {
               light.color.setRGB(r, g, b);
           }
        });
    }
  });

  return (
    <group>
      {/* MONITOR (On Desk) */}
      <group position={[0, 1.5, 0]}> 
         {/* Stand */}
         <mesh position={[0, 0.05, -0.1]}>
            <boxGeometry args={[0.4, 0.02, 0.3]} />
            <meshStandardMaterial color="#111" />
         </mesh>
         <mesh position={[0, 0.2, -0.15]} rotation={[-0.1, 0, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.4]} />
            <meshStandardMaterial color="#111" />
         </mesh>

         {/* Screen Frame */}
         <mesh position={[0, 0.5, 0]} rotation={[-0.05, 0, 0]}>
             {/* Bezel */}
             <boxGeometry args={[1.6, 0.9, 0.05]} />
             <meshStandardMaterial color="#111" />
         </mesh>

         {/* Display Area */}
         <group position={[0, 0.5, 0.026]} rotation={[-0.05, 0, 0]}>
             {/* Screen Content */}
             <mesh>
                 <planeGeometry args={[1.5, 0.8]} />
                 {bootState === 'on' ? (
                    // Lit screen with wallpaper
                    <meshBasicMaterial map={desktopTexture} color="white" toneMapped={false} />
                 ) : bootState === 'booting' ? (
                    // Booting: Dark Blue BIOS screen, Unlit (Basic) to ensure visibility
                    <meshBasicMaterial color="#000022" />
                 ) : (
                    // Off: Glossy dark grey (Standard) reacting to environment
                    <meshStandardMaterial 
                        color="#1a1a1a" 
                        roughness={0.2} 
                        metalness={0.6} 
                    />
                 )}
             </mesh>
             
             {/* DOS Text Content */}
             {bootState === 'booting' && (
               <group position={[-0.7, 0.35, 0.05]}> 
                 <Suspense fallback={null}>
                   <Text 
                      fontSize={0.05} 
                      color="#00ff00" 
                      anchorX="left" 
                      anchorY="top"
                      maxWidth={1.4}
                      lineHeight={1.2}
                      font="https://fonts.gstatic.com/s/sharetechmono/v15/J7aHnp1uDWRCCytM_MHgkIxE.woff" // Monospace font
                      characters="abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{};':,./<>?ABCDEFGHIJKLMNOPQRSTUVWXYZ "
                   >
                     {bootLines.join('\n')}
                   </Text>
                 </Suspense>
               </group>
             )}

             {/* UI Overlay (Taskbar & Icons) - Only visible when ON */}
             {bootState === 'on' && (
               <group position={[0, 0, 0.01]}>
                    {/* Taskbar */}
                    <mesh position={[0, -0.35, 0]}>
                        <planeGeometry args={[1.5, 0.1]} />
                        <meshBasicMaterial color="#1a1a1a" opacity={0.9} transparent />
                    </mesh>
                    {/* Start Button */}
                    <mesh position={[-0.7, -0.35, 0.01]}>
                        <planeGeometry args={[0.06, 0.06]} />
                        <meshBasicMaterial color="#00d2ff" />
                    </mesh>

                    {/* Desktop Icons */}
                    <group position={[-0.65, 0.25, 0]}>
                        {[0, 1, 2].map((i) => (
                             <group key={i} position={[0, -i * 0.18, 0]}>
                                 <mesh>
                                    <planeGeometry args={[0.08, 0.1]} />
                                    <meshBasicMaterial color="#ffffff" opacity={0.3} transparent />
                                 </mesh>
                                 <mesh position={[0, -0.04, 0.001]}>
                                     <planeGeometry args={[0.06, 0.01]} />
                                     <meshBasicMaterial color="#fff" />
                                 </mesh>
                             </group>
                        ))}
                    </group>
               </group>
             )}
         </group>
      </group>

      {/* PC TOWER (Under Desk) */}
      <group position={[1.2, 0.4, 0]}>
          {/* Case Body */}
          <mesh castShadow receiveShadow>
              <boxGeometry args={[0.4, 0.8, 0.8]} />
              <meshStandardMaterial color="#111" roughness={0.3} metalness={0.6} />
          </mesh>
          
          {/* Side Glass Panel */}
          <mesh position={[-0.21, 0, 0]} rotation={[0, -Math.PI/2, 0]}>
              <planeGeometry args={[0.7, 0.7]} />
              <meshPhysicalMaterial 
                 color="white" 
                 transmission={0.8} 
                 opacity={0.3} 
                 roughness={0.1} 
                 metalness={0} 
                 transparent
              />
          </mesh>

          {/* Internal Lights */}
          <group ref={lightsRef}>
             {isOn && (
                <>
                  <pointLight position={[0, 0.2, 0]} intensity={2} distance={1} decay={2} />
                  <pointLight position={[0, -0.2, 0]} intensity={2} distance={1} decay={2} />
                  <mesh position={[0, 0, 0]}>
                     <boxGeometry args={[0.3, 0.7, 0.7]} />
                     <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.1} />
                  </mesh>
                </>
             )}
          </group>

          {/* Power Button */}
          <mesh 
             position={[0.1, 0.35, 0.4]} 
             rotation={[Math.PI/2, 0, 0]} 
             onClick={(e) => { e.stopPropagation(); toggle(); }}
             onPointerOver={() => document.body.style.cursor = 'pointer'}
             onPointerOut={() => document.body.style.cursor = 'auto'}
          >
              <cylinderGeometry args={[0.03, 0.03, 0.02]} />
              <meshStandardMaterial color={isOn ? "#00ff00" : "#555"} emissive={isOn ? "#00ff00" : "#000"} />
          </mesh>
      </group>
    </group>
  );
};