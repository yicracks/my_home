import React from 'react';
import * as THREE from 'three';
import { ChristmasTree } from './ChristmasTree';

interface DiningAreaProps {
  isTreeOn: boolean;
  toggleTree: () => void;
}

// Helper for Chair
const Chair: React.FC<{ position: [number, number, number], rotation: [number, number, number] }> = ({ position, rotation }) => (
  <group position={position} rotation={rotation}>
    {/* Legs */}
    <mesh position={[-0.2, 0.2, -0.2]}>
        <boxGeometry args={[0.05, 0.4, 0.05]} />
        <meshStandardMaterial color="#3e2723" />
    </mesh>
    <mesh position={[0.2, 0.2, -0.2]}>
        <boxGeometry args={[0.05, 0.4, 0.05]} />
        <meshStandardMaterial color="#3e2723" />
    </mesh>
    <mesh position={[-0.2, 0.2, 0.2]}>
        <boxGeometry args={[0.05, 0.4, 0.05]} />
        <meshStandardMaterial color="#3e2723" />
    </mesh>
    <mesh position={[0.2, 0.2, 0.2]}>
        <boxGeometry args={[0.05, 0.4, 0.05]} />
        <meshStandardMaterial color="#3e2723" />
    </mesh>
    {/* Seat */}
    <mesh position={[0, 0.42, 0]}>
        <boxGeometry args={[0.5, 0.05, 0.5]} />
        <meshStandardMaterial color="#5d4037" />
    </mesh>
    {/* Backrest */}
    <mesh position={[0, 0.9, -0.23]}>
        <boxGeometry args={[0.5, 0.5, 0.05]} />
        <meshStandardMaterial color="#5d4037" />
    </mesh>
    <mesh position={[-0.2, 0.65, -0.23]}>
        <boxGeometry args={[0.05, 0.5, 0.05]} />
        <meshStandardMaterial color="#3e2723" />
    </mesh>
    <mesh position={[0.2, 0.65, -0.23]}>
        <boxGeometry args={[0.05, 0.5, 0.05]} />
        <meshStandardMaterial color="#3e2723" />
    </mesh>
  </group>
);

// Helper for Vase
const Vase: React.FC<any> = (props) => (
  <group {...props}>
     {/* Body */}
     <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.15, 0.3, 16]} />
        <meshStandardMaterial color="white" roughness={0.2} />
     </mesh>
     {/* Neck */}
     <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.08, 0.1, 16]} />
        <meshStandardMaterial color="white" roughness={0.2} />
     </mesh>
     {/* White Flowers */}
     <group position={[0, 0.45, 0]}>
        {[0,1,2,3,4].map(i => (
            <group key={i} rotation={[Math.random() * 0.5, Math.random() * Math.PI, Math.random() * 0.5]}>
                 <mesh position={[0, 0.1, 0]}>
                    <cylinderGeometry args={[0.005, 0.005, 0.25]} />
                    <meshStandardMaterial color="green" />
                 </mesh>
                 <mesh position={[0, 0.22, 0]}>
                    <sphereGeometry args={[0.04, 8, 8]} />
                    <meshStandardMaterial color="#fff" />
                 </mesh>
            </group>
        ))}
     </group>
  </group>
)

// Helper for Vodka Bottle
const VodkaBottle: React.FC<any> = (props) => (
    <group {...props}>
        <mesh position={[0, 0.15, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.07, 0.3]} />
            <meshPhysicalMaterial color="#ccf" transmission={0.9} roughness={0.1} thickness={0.1} />
        </mesh>
        <mesh position={[0, 0.35, 0]} castShadow>
            <cylinderGeometry args={[0.025, 0.03, 0.1]} />
            <meshPhysicalMaterial color="#ccf" transmission={0.9} roughness={0.1} thickness={0.1} />
        </mesh>
        <mesh position={[0, 0.41, 0]}>
            <cylinderGeometry args={[0.026, 0.026, 0.02]} />
            <meshStandardMaterial color="silver" metalness={1} roughness={0.2} />
        </mesh>
    </group>
)

// Helper for Wine Glass
const WineGlass: React.FC<any> = (props) => (
    <group {...props}>
        {/* Base */}
        <mesh position={[0, 0.005, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.01]} />
            <meshPhysicalMaterial color="white" transmission={0.9} roughness={0.05} />
        </mesh>
        {/* Stem */}
        <mesh position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.005, 0.005, 0.15]} />
            <meshPhysicalMaterial color="white" transmission={0.9} roughness={0.05} />
        </mesh>
        {/* Bowl */}
        <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.05, 0.02, 0.12, 16, 1, true]} />
            <meshPhysicalMaterial color="white" transmission={0.9} thickness={0.02} side={THREE.DoubleSide} />
        </mesh>
    </group>
)


export const DiningArea: React.FC<DiningAreaProps> = ({ isTreeOn, toggleTree }) => {
    return (
        <group>
            {/* Round Table */}
            <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[1.6, 1.6, 0.05, 64]} />
                <meshStandardMaterial color="#3e2723" roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.35, 0]} castShadow>
                <cylinderGeometry args={[0.2, 0.4, 0.7]} />
                <meshStandardMaterial color="#3e2723" roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.02, 0]} castShadow>
                <cylinderGeometry args={[0.8, 1, 0.05]} />
                <meshStandardMaterial color="#2e1b15" roughness={0.4} />
            </mesh>

            {/* Chairs */}
            <Chair position={[0, 0, 2.0]} rotation={[0, Math.PI, 0]} />
            <Chair position={[0, 0, -2.0]} rotation={[0, 0, 0]} />
            <Chair position={[2.0, 0, 0]} rotation={[0, -Math.PI/2, 0]} />
            <Chair position={[-2.0, 0, 0]} rotation={[0, Math.PI/2, 0]} />

            {/* Table Items */}
            <Vase position={[0, 0.8, 0]} />
            <VodkaBottle position={[0.5, 0.8, 0.5]} />
            <WineGlass position={[0.8, 0.8, 0.2]} />

            {/* Christmas Tree (Back Corner) */}
            <group position={[7.5, 0, -7.5]} scale={1.8}>
                <ChristmasTree isOn={isTreeOn} toggle={toggleTree} />
            </group>
        </group>
    )
}