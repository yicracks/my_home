import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { ContactShadows, Environment, OrbitControls, PerspectiveCamera, Text } from '@react-three/drei';
import { Cabinet } from './Cabinet';
import { TV } from './TV';
import { Speaker } from './Speaker';
import { Sofa } from './Sofa';
import { FloorLamp } from './FloorLamp';
import { OfficeArea } from './OfficeArea';
import { BedroomArea } from './BedroomArea';
import { DiningArea } from './DiningArea';
import { BathroomArea } from './BathroomArea';
import { KitchenArea } from './KitchenArea';

interface SceneProps {
  isSpeakerPlaying: boolean;
  toggleSpeaker: () => void;
  isTVOn: boolean;
  toggleTV: () => void;
  isLampOn: boolean;
  toggleLamp: () => void;
  isPCOn: boolean;
  togglePC: () => void;
  isCrystalBallOn: boolean;
  toggleCrystalBall: () => void;
  isBedroomLampOn: boolean;
  toggleBedroomLamp: () => void;
  isChristmasTreeOn: boolean;
  toggleChristmasTree: () => void;
  
  // Bathroom Props
  isSinkOn: boolean;
  toggleSink: () => void;
  isShowerOn: boolean;
  toggleShower: () => void;
  isFlushing: boolean;
  triggerFlush: () => void;
}

// Helper component for empty rooms
const RoomLabel: React.FC<{ name: string; position: [number, number, number] }> = ({ name, position }) => (
  <group position={position}>
    <Text 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0.1, 0]} 
        fontSize={2} 
        color="#333"
        fillOpacity={0.5}
    >
      {name}
    </Text>
    {/* Room center marker */}
    <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[0.5, 0.6, 32]} />
        <meshBasicMaterial color="#333" opacity={0.2} transparent />
    </mesh>
  </group>
);

// New Component: Wall with a door hole (implied by 3 segments)
// Orientation: 'x' (runs along X axis) or 'z' (runs along Z axis)
interface WallWithDoorProps {
    position: [number, number, number];
    orientation: 'x' | 'z';
    totalLength: number;
    doorWidth?: number; // If 0, it's a solid wall
    doorHeight?: number;
    wallHeight?: number;
    thickness?: number;
}

const WallWithDoor: React.FC<WallWithDoorProps> = ({ 
    position, 
    orientation, 
    totalLength, 
    doorWidth = 2.5, 
    doorHeight = 2.4, 
    wallHeight = 4.5, // Increased wall height
    thickness = 0.3 
}) => {
    const [x, y, z] = position;
    const centerY = -2 + wallHeight/2; // Floor is at -2

    // If doorWidth is effectively 0, render a solid wall
    if (doorWidth <= 0.1) {
        if (orientation === 'x') {
             return (
                 <mesh position={[x, centerY, z]} receiveShadow castShadow>
                     <boxGeometry args={[totalLength, wallHeight, thickness]} />
                     <meshStandardMaterial color="#ddd" roughness={0.8} />
                 </mesh>
             );
        } else {
             return (
                 <mesh position={[x, centerY, z]} receiveShadow castShadow>
                     <boxGeometry args={[thickness, wallHeight, totalLength]} />
                     <meshStandardMaterial color="#ddd" roughness={0.8} />
                 </mesh>
             );
        }
    }

    const sidePanelLen = (totalLength - doorWidth) / 2;
    const offset = sidePanelLen / 2 + doorWidth / 2;

    // Lintel (Piece above door)
    const lintelLen = doorWidth;
    const lintelHeight = wallHeight - doorHeight;
    const lintelY = -2 + doorHeight + lintelHeight/2;

    if (orientation === 'x') {
        return (
            <group position={[x, 0, z]}>
                {/* Left Panel */}
                <mesh position={[-offset, centerY, 0]} receiveShadow castShadow>
                    <boxGeometry args={[sidePanelLen, wallHeight, thickness]} />
                    <meshStandardMaterial color="#ddd" roughness={0.8} />
                </mesh>
                {/* Right Panel */}
                <mesh position={[offset, centerY, 0]} receiveShadow castShadow>
                    <boxGeometry args={[sidePanelLen, wallHeight, thickness]} />
                    <meshStandardMaterial color="#ddd" roughness={0.8} />
                </mesh>
                {/* Lintel (Top) */}
                <mesh position={[0, lintelY, 0]} receiveShadow castShadow>
                    <boxGeometry args={[lintelLen, lintelHeight, thickness]} />
                    <meshStandardMaterial color="#ddd" roughness={0.8} />
                </mesh>
            </group>
        );
    } else {
        return (
            <group position={[x, 0, z]}>
                {/* Back Panel (relative to rotation) */}
                <mesh position={[0, centerY, -offset]} receiveShadow castShadow>
                    <boxGeometry args={[thickness, wallHeight, sidePanelLen]} />
                    <meshStandardMaterial color="#ddd" roughness={0.8} />
                </mesh>
                {/* Front Panel */}
                <mesh position={[0, centerY, offset]} receiveShadow castShadow>
                    <boxGeometry args={[thickness, wallHeight, sidePanelLen]} />
                    <meshStandardMaterial color="#ddd" roughness={0.8} />
                </mesh>
                {/* Lintel */}
                <mesh position={[0, lintelY, 0]} receiveShadow castShadow>
                    <boxGeometry args={[thickness, lintelHeight, lintelLen]} />
                    <meshStandardMaterial color="#ddd" roughness={0.8} />
                </mesh>
            </group>
        );
    }
};

export const Scene: React.FC<SceneProps> = ({ 
  isSpeakerPlaying, 
  toggleSpeaker, 
  isTVOn, 
  toggleTV,
  isLampOn, 
  toggleLamp,
  isPCOn,
  togglePC,
  isCrystalBallOn,
  toggleCrystalBall,
  isBedroomLampOn,
  toggleBedroomLamp,
  isChristmasTreeOn,
  toggleChristmasTree,
  isSinkOn,
  toggleSink,
  isShowerOn,
  toggleShower,
  isFlushing,
  triggerFlush
}) => {
  const controlsRef = useRef<any>(null);
  
  // State for camera movement
  const [targetCameraPos, setTargetCameraPos] = useState<THREE.Vector3 | null>(null);
  const [targetControlsTarget, setTargetControlsTarget] = useState<THREE.Vector3 | null>(null);

  // Handle Space key to reset view
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault(); // Prevent scrolling if page has scrollbars
        setTargetCameraPos(new THREE.Vector3(0, 15, 25));
        setTargetControlsTarget(new THREE.Vector3(0, 0, 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useFrame((state, delta) => {
    // Smoothly animate Camera position if target is set
    if (targetCameraPos) {
        state.camera.position.lerp(targetCameraPos, 3 * delta);
        if (state.camera.position.distanceTo(targetCameraPos) < 0.1) {
            setTargetCameraPos(null); // Stop animating when close
        }
    }

    // Smoothly animate Controls Target
    if (controlsRef.current) {
        if (targetControlsTarget) {
            controlsRef.current.target.lerp(targetControlsTarget, 3 * delta);
            if (controlsRef.current.target.distanceTo(targetControlsTarget) < 0.1) {
                setTargetControlsTarget(null);
            }
        }
        controlsRef.current.update();
    }
  });

  const handleFloorRightClick = (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      const clickPoint = new THREE.Vector3(e.point.x, e.point.y, e.point.z);
      
      const newCamPos = new THREE.Vector3(clickPoint.x, 1.7, clickPoint.z);

      const camera = e.camera;
      const currentDir = new THREE.Vector3();
      camera.getWorldDirection(currentDir);
      const newTarget = newCamPos.clone().add(currentDir.multiplyScalar(5));
      newTarget.y = 1.0; 

      setTargetCameraPos(newCamPos);
      setTargetControlsTarget(newTarget);
  };

  const FURNITURE_SCALE = 0.9;

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 15, 25]} fov={45} />
      <OrbitControls 
        ref={controlsRef}
        makeDefault
        enablePan={true} 
        minPolarAngle={0} 
        maxPolarAngle={Math.PI / 1.8} 
        minDistance={1}
        maxDistance={60}
      />

      <Environment preset="night" blur={0.8} background={false} />
      
      {/* Global Ambient */}
      <ambientLight intensity={isLampOn ? 0.8 : 0.5} />
      
      {/* Room Fill Lights */}
      <pointLight position={[0, 8, 0]} intensity={0.6} color="#ccdaff" />
      <pointLight position={[0, 8, -16]} intensity={0.6} color="#ccdaff" />
      <pointLight position={[18, 8, -16]} intensity={0.6} color="#ffccaa" /> 
      <pointLight position={[-18, 6, 0]} intensity={0.8} color="#ccffff" /> 

      {/* Dynamic Lights */}
      {isTVOn && <pointLight position={[-1, 1, -2]} intensity={3.5} color="#ffffff" distance={15} decay={2} />}
      {isPCOn && <pointLight position={[18, 2, 0]} intensity={2.5} color="#aaaaff" distance={10} decay={2} />}

      {/* FLOOR */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -2, -8]} 
        receiveShadow
        onContextMenu={handleFloorRightClick}
        onPointerOver={() => document.body.style.cursor = 'crosshair'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >
        <planeGeometry args={[60, 40]} />
        <meshStandardMaterial color="#222" roughness={0.8} /> 
      </mesh>

      {/* --- OUTER WALLS --- */}
      
      {/* FRONT WALLS (z=8) */}
      <WallWithDoor position={[-18, 0, 8]} orientation="x" totalLength={18} doorWidth={0} />
      <WallWithDoor position={[0, 0, 8]} orientation="x" totalLength={18} doorWidth={3.0} />
      <WallWithDoor position={[18, 0, 8]} orientation="x" totalLength={18} doorWidth={0} />

      {/* BACK WALLS (z=-24) */}
      <WallWithDoor position={[-18, 0, -24]} orientation="x" totalLength={18} doorWidth={0} />
      <WallWithDoor position={[0, 0, -24]} orientation="x" totalLength={18} doorWidth={0} />
      <WallWithDoor position={[18, 0, -24]} orientation="x" totalLength={18} doorWidth={0} />

      {/* SIDE OUTER WALLS */}
      <WallWithDoor position={[-27, 0, -8]} orientation="z" totalLength={32} doorWidth={0} />
      <WallWithDoor position={[27, 0, -8]} orientation="z" totalLength={32} doorWidth={0} />


      {/* --- INNER WALLS --- */}
      <WallWithDoor position={[-9, 0, 0]} orientation="z" totalLength={16} /> 
      <WallWithDoor position={[-9, 0, -16]} orientation="z" totalLength={16} /> 
      <WallWithDoor position={[9, 0, 0]} orientation="z" totalLength={16} /> 
      <WallWithDoor position={[9, 0, -16]} orientation="z" totalLength={16} /> 


      {/* --- ROOMS (SCALED FURNITURE) --- */}
      
      {/* Bathroom */}
      <group position={[-18, -2, 0]} scale={[FURNITURE_SCALE, FURNITURE_SCALE, FURNITURE_SCALE]}>
          <BathroomArea 
            isSinkOn={isSinkOn} toggleSink={toggleSink}
            isShowerOn={isShowerOn} toggleShower={toggleShower}
            isFlushing={isFlushing} triggerFlush={triggerFlush}
          />
      </group>

      {/* Living Room - Cabinet */}
      <group position={[0, -2, -4]} scale={[FURNITURE_SCALE, FURNITURE_SCALE, FURNITURE_SCALE]}>
        <Cabinet />
        <TV isOn={isTVOn} toggle={toggleTV} position={[-1.5, 1.5, 0]} />
        <Speaker isPlaying={isSpeakerPlaying} volume={0.5} onToggle={toggleSpeaker} position={[2, 1.5, 0]} />
      </group>
      
      {/* Living Room - Sofa */}
      <group position={[0, -2, 3.5]} rotation={[0, Math.PI, 0]} scale={[FURNITURE_SCALE, FURNITURE_SCALE, FURNITURE_SCALE]}>
         <Sofa />
         <group position={[2.5, 0, 0.5]}>
             <FloorLamp isOn={isLampOn} toggle={toggleLamp} />
         </group>
      </group>
      <RoomLabel name="Living Room" position={[0, -2, 0]} />

      {/* Office */}
      <group position={[18, -2, 0]} rotation={[0, -Math.PI / 2, 0]} scale={[FURNITURE_SCALE, FURNITURE_SCALE, FURNITURE_SCALE]}>
          <OfficeArea 
            isPCOn={isPCOn}
            togglePC={togglePC}
            isCrystalBallOn={isCrystalBallOn}
            toggleCrystalBall={toggleCrystalBall}
          />
      </group>
      <RoomLabel name="Study" position={[18, -2, 4]} />

      {/* Kitchen */}
      <group position={[-18, -2, -16]} scale={[FURNITURE_SCALE, FURNITURE_SCALE, FURNITURE_SCALE]}>
          <KitchenArea />
      </group>

      {/* Dining */}
      <group position={[0, -2, -16]} scale={[FURNITURE_SCALE, FURNITURE_SCALE, FURNITURE_SCALE]}>
        <DiningArea isTreeOn={isChristmasTreeOn} toggleTree={toggleChristmasTree} />
      </group>

      {/* Bedroom */}
      <group position={[18, -2, -16]} scale={[FURNITURE_SCALE, FURNITURE_SCALE, FURNITURE_SCALE]}>
         <BedroomArea 
            isLampOn={isBedroomLampOn} 
            toggleLamp={toggleBedroomLamp}
         />
      </group>

      <ContactShadows 
        position={[0, -1.99, -8]} 
        opacity={0.5} 
        scale={60} 
        blur={2} 
        far={2} 
      />
    </>
  );
};