import React, { useState, useEffect } from 'react';
import * as THREE from 'three';
import { useVideoTexture } from '@react-three/drei';
import { VIDEO_URL, COLORS } from '../constants';

interface TVProps {
  isOn: boolean;
  toggle: () => void;
  // allow passing group props for positioning
}

export const TV: React.FC<TVProps & any> = ({ isOn, toggle, ...props }) => {
  const [video] = useState(() => {
    const vid = document.createElement('video');
    vid.src = VIDEO_URL;
    vid.crossOrigin = "Anonymous";
    vid.loop = true;
    vid.muted = false; 
    return vid;
  });

  useEffect(() => {
    if (isOn) {
      video.play().catch(e => console.error("Video play failed", e));
    } else {
      video.pause();
    }
  }, [isOn, video]);

  return (
    <group {...props}>
      {/* Stand Base (starts at y=0) */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[1.5, 0.2, 0.8]} />
        <meshStandardMaterial color="#111" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.8, 32]} />
        <meshStandardMaterial color="#111" roughness={0.5} />
      </mesh>

      {/* Screen Frame - Bigger (5.5 wide, 3.2 high) - DARK GOLD */}
      <group position={[0, 2.2, 0]}>
        <mesh castShadow receiveShadow>
            <boxGeometry args={[5.5, 3.2, 0.2]} />
            <meshStandardMaterial 
                color={COLORS.darkGold} 
                roughness={0.3} 
                metalness={0.7} 
            />
        </mesh>
        
        {/* The Screen */}
        <mesh position={[0, 0, 0.11]} rotation={[0, 0, 0]}>
            <planeGeometry args={[5.2, 2.9]} />
            {isOn ? (
                <meshBasicMaterial>
                    <videoTexture attach="map" args={[video]} />
                </meshBasicMaterial>
            ) : (
                <meshStandardMaterial color="#000" roughness={0.1} metalness={0.2} />
            )}
        </mesh>

        {/* Power Button on TV Frame (Bezel) */}
        {/* Position adjusted to sit cleanly on the frame */}
        <mesh 
            onClick={(e) => { e.stopPropagation(); toggle(); }} 
            position={[2.5, -1.4, 0.11]} 
            rotation={[Math.PI/2, 0, 0]}
            onPointerOver={() => document.body.style.cursor = 'pointer'}
            onPointerOut={() => document.body.style.cursor = 'auto'}
        >
            <cylinderGeometry args={[0.06, 0.06, 0.04, 32]} />
            <meshStandardMaterial 
                color={isOn ? "#00ff00" : "#222"} 
                emissive={isOn ? "#00ff00" : "#000"} 
                emissiveIntensity={0.8}
                metalness={0.5}
                roughness={0.2}
            />
        </mesh>
        
        {/* Small Red LED indicator when off, next to button */}
        {!isOn && (
             <mesh position={[2.35, -1.4, 0.11]} rotation={[Math.PI/2, 0, 0]}>
                <circleGeometry args={[0.02, 16]} />
                <meshBasicMaterial color="red" />
             </mesh>
        )}
      </group>
    </group>
  );
};