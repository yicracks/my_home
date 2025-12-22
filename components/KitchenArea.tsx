import React, { useState, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// --- Sub-component: Stove Fire Effect ---
const StoveFire = () => (
  <group>
    {[0, 1, 2, 3].map(i => (
      <mesh key={i} position={[Math.random()*0.1 - 0.05, 0.05 + Math.random()*0.05, Math.random()*0.1 - 0.05]} rotation={[0, Math.random(), 0]}>
         <coneGeometry args={[0.04, 0.15, 8]} />
         <meshBasicMaterial color="#ff5500" transparent opacity={0.8} />
      </mesh>
    ))}
    <pointLight color="#ffaa00" intensity={0.8} distance={0.5} />
  </group>
);

// --- Sub-component: Fridge Door with Hinge Logic ---
const FridgeDoor = ({ isOpen, onClick, children, hingePosition, openRotation }: any) => {
    const ref = useRef<THREE.Group>(null);
    useFrame((state, delta) => {
        if (ref.current) {
            const target = isOpen ? openRotation : 0;
            ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, target, delta * 5);
        }
    });
    return (
        <group position={hingePosition} ref={ref}>
            <group onClick={(e) => { e.stopPropagation(); onClick(); }} onPointerOver={() => document.body.style.cursor = 'pointer'} onPointerOut={() => document.body.style.cursor = 'auto'}>
                {children}
            </group>
        </group>
    );
};

export const KitchenArea = () => {
    // 4 Independent Stove Burners: [FrontLeft, FrontRight, BackLeft, BackRight]
    const [stoveState, setStoveState] = useState([false, false, false, false]);

    const toggleBurner = (index: number) => {
        setStoveState(prev => {
            const next = [...prev];
            next[index] = !next[index];
            return next;
        });
    };

    const [leftDoorOpen, setLeftDoorOpen] = useState(false); // Freezer
    const [rightDoorOpen, setRightDoorOpen] = useState(false); // Fridge

    // Adjusted positions for scaled room
    // Original Cabinet Z=-7, Fridge Z=-7. Scaled pushes them to -11.9.
    // Adjusted Z=-4.5 keeps them around -7.65 in scaled units (close to back wall divider).
    return (
        <group>
            {/* ================= CABINET UNIT ================= */}
            {/* Positioned against the back wall (local Z approx -4.5) */}
            <group position={[1.5, 0, -4.5]}> 
                {/* Countertop & Base */}
                <mesh position={[0, 0.45, 0]} castShadow>
                    <boxGeometry args={[5, 0.9, 1]} />
                    <meshStandardMaterial color="#f5f5f5" roughness={0.5} />
                </mesh>
                {/* Dark Trim/Kickplate */}
                <mesh position={[0, 0.05, 0.51]}>
                    <planeGeometry args={[5, 0.1]} />
                    <meshStandardMaterial color="#222" />
                </mesh>

                {/* --- COOKING SECTION (Left) --- */}
                <group position={[-1.5, 0.95, 0]}>
                    {/* Stove Top */}
                    <mesh position={[0, 0, 0.1]}>
                        <boxGeometry args={[1.2, 0.05, 0.8]} />
                        <meshStandardMaterial color="#111" metalness={0.6} roughness={0.4} />
                    </mesh>
                    
                    {/* Burners */}
                    {/* Front Left (-0.3, 0.2) -> Index 0 */}
                    <group position={[-0.3, 0.03, 0.2]}>
                         <mesh>
                             <cylinderGeometry args={[0.15, 0.15, 0.02]} />
                             <meshStandardMaterial color="#333" />
                         </mesh>
                         <mesh position={[0, 0.015, 0]}>
                             <ringGeometry args={[0.1, 0.14, 16]} rotation={[-Math.PI/2, 0, 0]} />
                             <meshStandardMaterial color="#111" />
                         </mesh>
                         {stoveState[0] && <StoveFire />}
                    </group>
                    
                    {/* Front Right (0.3, 0.2) -> Index 1 */}
                    <group position={[0.3, 0.03, 0.2]}>
                         <mesh>
                             <cylinderGeometry args={[0.15, 0.15, 0.02]} />
                             <meshStandardMaterial color="#333" />
                         </mesh>
                         <mesh position={[0, 0.015, 0]}>
                             <ringGeometry args={[0.1, 0.14, 16]} rotation={[-Math.PI/2, 0, 0]} />
                             <meshStandardMaterial color="#111" />
                         </mesh>
                         {stoveState[1] && <StoveFire />}
                    </group>

                    {/* Back Left (-0.3, -0.2) -> Index 2 */}
                    <group position={[-0.3, 0.03, -0.2]}>
                         <mesh>
                             <cylinderGeometry args={[0.1, 0.1, 0.02]} />
                             <meshStandardMaterial color="#333" />
                         </mesh>
                         {stoveState[2] && <StoveFire />}
                    </group>

                    {/* Back Right (0.3, -0.2) -> Index 3 */}
                    <group position={[0.3, 0.03, -0.2]}>
                         <mesh>
                             <cylinderGeometry args={[0.1, 0.1, 0.02]} />
                             <meshStandardMaterial color="#333" />
                         </mesh>
                         {stoveState[3] && <StoveFire />}
                    </group>

                    {/* Knobs (On the front face of cabinet) */}
                    <group position={[0, -0.1, 0.51]}>
                         <mesh position={[0, 0, 0]}>
                             <boxGeometry args={[1.0, 0.15, 0.02]} />
                             <meshStandardMaterial color="#ddd" />
                         </mesh>
                         {/* Knob 1: Controls Front Left (Index 0) */}
                         <mesh 
                            position={[-0.3, 0, 0.02]} 
                            rotation={[Math.PI/2, 0, 0]}
                            onClick={(e) => {e.stopPropagation(); toggleBurner(0)}}
                            onPointerOver={() => document.body.style.cursor = 'pointer'}
                            onPointerOut={() => document.body.style.cursor = 'auto'}
                         >
                             <cylinderGeometry args={[0.03, 0.03, 0.04]} />
                             <meshStandardMaterial color={stoveState[0] ? "#ff4400" : "#333"} />
                         </mesh>

                         {/* Knob 2: Controls Back Left (Index 2) */}
                         <mesh 
                            position={[-0.1, 0, 0.02]} 
                            rotation={[Math.PI/2, 0, 0]}
                            onClick={(e) => {e.stopPropagation(); toggleBurner(2)}}
                            onPointerOver={() => document.body.style.cursor = 'pointer'}
                            onPointerOut={() => document.body.style.cursor = 'auto'}
                         >
                             <cylinderGeometry args={[0.03, 0.03, 0.04]} />
                             <meshStandardMaterial color={stoveState[2] ? "#ff4400" : "#333"} />
                         </mesh>

                         {/* Knob 3: Controls Back Right (Index 3) */}
                         <mesh 
                            position={[0.1, 0, 0.02]} 
                            rotation={[Math.PI/2, 0, 0]}
                            onClick={(e) => {e.stopPropagation(); toggleBurner(3)}}
                            onPointerOver={() => document.body.style.cursor = 'pointer'}
                            onPointerOut={() => document.body.style.cursor = 'auto'}
                         >
                             <cylinderGeometry args={[0.03, 0.03, 0.04]} />
                             <meshStandardMaterial color={stoveState[3] ? "#ff4400" : "#333"} />
                         </mesh>

                         {/* Knob 4: Controls Front Right (Index 1) */}
                         <mesh 
                            position={[0.3, 0, 0.02]} 
                            rotation={[Math.PI/2, 0, 0]}
                            onClick={(e) => {e.stopPropagation(); toggleBurner(1)}}
                            onPointerOver={() => document.body.style.cursor = 'pointer'}
                            onPointerOut={() => document.body.style.cursor = 'auto'}
                         >
                             <cylinderGeometry args={[0.03, 0.03, 0.04]} />
                             <meshStandardMaterial color={stoveState[1] ? "#ff4400" : "#333"} />
                         </mesh>
                    </group>

                    {/* Range Hood */}
                    <group position={[0, 1.5, 0]}>
                        <mesh position={[0, 0.4, -0.2]}>
                            <boxGeometry args={[0.4, 0.8, 0.4]} />
                             <meshStandardMaterial color="#ddd" />
                        </mesh>
                        <mesh position={[0, -0.1, 0]}>
                            <boxGeometry args={[1.2, 0.1, 0.8]} />
                             <meshStandardMaterial color="#ccc" metalness={0.5} />
                        </mesh>
                    </group>
                </group>

                {/* --- PREP SECTION (Middle) --- */}
                <group position={[0.5, 0.95, 0]}>
                    {/* Cutting Board */}
                    <mesh position={[0, 0.01, 0.2]}>
                        <boxGeometry args={[0.6, 0.02, 0.4]} />
                        <meshStandardMaterial color="#8d6e63" />
                    </mesh>
                    
                    {/* Knife */}
                    <group position={[0.2, 0.03, 0.2]} rotation={[0, 0.5, Math.PI/2]}>
                        <mesh position={[0, 0.1, 0]}>
                             <boxGeometry args={[0.03, 0.2, 0.005]} />
                             <meshStandardMaterial color="silver" metalness={0.8} />
                        </mesh>
                        <mesh position={[0, -0.05, 0]}>
                             <boxGeometry args={[0.04, 0.1, 0.02]} />
                             <meshStandardMaterial color="black" />
                        </mesh>
                    </group>
                    
                    {/* Ingredients */}
                    <mesh position={[-0.15, 0.04, 0.25]} castShadow> {/* Tomato */}
                        <sphereGeometry args={[0.05, 16, 16]} />
                        <meshStandardMaterial color="#d32f2f" />
                    </mesh>
                     <mesh position={[-0.3, 0.05, 0.2]} castShadow> {/* Orange */}
                        <sphereGeometry args={[0.06, 16, 16]} />
                        <meshStandardMaterial color="#fb8c00" />
                    </mesh>
                    <group position={[-0.4, 0.05, -0.1]} rotation={[0, 0, 1.4]}> {/* Chinese Cabbage */}
                        <mesh position={[0, 0.1, 0]}>
                           <cylinderGeometry args={[0.07, 0.06, 0.25]} />
                           <meshStandardMaterial color="#c8e6c9" />
                        </mesh>
                         <mesh position={[0, 0.25, 0]}>
                           <sphereGeometry args={[0.07]} />
                           <meshStandardMaterial color="#81c784" roughness={0.8} />
                        </mesh>
                    </group>
                </group>

                {/* --- PANTRY SECTION (Right) --- */}
                <group position={[2.0, 0.95, 0]}>
                    {/* Rice Bucket */}
                    <group position={[-0.4, 0.15, -0.15]}>
                        <mesh>
                             {/* Transparent container */}
                             <cylinderGeometry args={[0.15, 0.13, 0.3]} />
                             <meshPhysicalMaterial color="#fff" transmission={0.6} opacity={0.5} transparent roughness={0.1} />
                        </mesh>
                        <mesh position={[0, -0.05, 0]}>
                             {/* Rice Inside */}
                             <cylinderGeometry args={[0.135, 0.12, 0.18]} />
                             <meshStandardMaterial color="#fafafa" roughness={0.9} /> 
                        </mesh>
                    </group>
                    
                    {/* Condiments */}
                    {[0, 1, 2].map(i => (
                        <group key={i} position={[0 + i*0.15, 0.1, -0.35]}>
                            <mesh>
                                <cylinderGeometry args={[0.04, 0.04, 0.2]} />
                                <meshStandardMaterial color="#fff" transparent opacity={0.6} />
                            </mesh>
                            <mesh position={[0, -0.05, 0]}>
                                <cylinderGeometry args={[0.03, 0.03, 0.1]} />
                                <meshStandardMaterial color={['#5d4037', '#e64a19', '#fbc02d'][i]} />
                            </mesh>
                             <mesh position={[0, 0.11, 0]}>
                                <cylinderGeometry args={[0.042, 0.042, 0.02]} />
                                <meshStandardMaterial color="#333" />
                            </mesh>
                        </group>
                    ))}

                    {/* Cutlery Holder */}
                    <group position={[0.4, 0.1, -0.2]}>
                        <mesh>
                            <cylinderGeometry args={[0.07, 0.07, 0.2, 16, 1, true]} />
                            <meshStandardMaterial color="#795548" side={THREE.DoubleSide} />
                        </mesh>
                        {/* Spoons/Forks stick out */}
                        <mesh position={[0.02, 0.1, 0]} rotation={[0.2, 0, 0]}>
                             <boxGeometry args={[0.015, 0.25, 0.005]} />
                             <meshStandardMaterial color="silver" />
                        </mesh>
                         <mesh position={[-0.02, 0.1, 0]} rotation={[-0.2, 0.5, 0]}>
                             <boxGeometry args={[0.015, 0.25, 0.005]} />
                             <meshStandardMaterial color="silver" />
                        </mesh>
                    </group>
                </group>
            </group>

            {/* ================= REFRIGERATOR ================= */}
            {/* Placed to the Left of the cabinets, also moved to Z=-4.5 */}
            <group position={[-2.5, 0, -4.5]}>
                 {/* Replaced Solid Box with Hollow Structure (Panels) to hide contents */}
                 <group position={[0, 1.1, 0]} castShadow>
                     {/* Back Panel */}
                     <mesh position={[0, 0, -0.475]}>
                        <boxGeometry args={[1.7, 2.2, 0.05]} />
                        <meshStandardMaterial color="#eceff1" metalness={0.6} roughness={0.3} />
                     </mesh>
                     {/* Left Panel */}
                     <mesh position={[-0.875, 0, 0]}>
                        <boxGeometry args={[0.05, 2.2, 1]} />
                        <meshStandardMaterial color="#eceff1" metalness={0.6} roughness={0.3} />
                     </mesh>
                     {/* Right Panel */}
                     <mesh position={[0.875, 0, 0]}>
                        <boxGeometry args={[0.05, 2.2, 1]} />
                        <meshStandardMaterial color="#eceff1" metalness={0.6} roughness={0.3} />
                     </mesh>
                     {/* Top Panel */}
                     <mesh position={[0, 1.075, 0]}>
                        <boxGeometry args={[1.8, 0.05, 1]} />
                        <meshStandardMaterial color="#eceff1" metalness={0.6} roughness={0.3} />
                     </mesh>
                     {/* Bottom Panel */}
                     <mesh position={[0, -1.075, 0]}>
                        <boxGeometry args={[1.8, 0.05, 1]} />
                        <meshStandardMaterial color="#eceff1" metalness={0.6} roughness={0.3} />
                     </mesh>
                 </group>
                 
                 {/* Interior: Shelves & Content */}
                 {/* Now effectively physically hidden by the panels if doors are closed */}
                 <group position={[0, 1.1, 0.45]}>
                      {/* Divider */}
                      <mesh>
                          <boxGeometry args={[0.05, 2.1, 0.1]} />
                          <meshStandardMaterial color="#fff" />
                      </mesh>
                      
                      {/* --- Left (Freezer) Content --- */}
                      <group position={[-0.45, 0, 0]}>
                          <mesh position={[0, 0.5, 0]}>
                              <boxGeometry args={[0.8, 0.02, 0.5]} />
                              <meshStandardMaterial color="#fff" transparent opacity={0.5} />
                          </mesh>
                          {/* Frozen Meat */}
                          <mesh position={[0, 0.6, 0]}>
                               <boxGeometry args={[0.3, 0.08, 0.3]} />
                               <meshStandardMaterial color="#b71c1c" roughness={0.9} />
                          </mesh>
                           <mesh position={[0.2, 0.6, 0.1]}>
                               <boxGeometry args={[0.3, 0.08, 0.3]} />
                               <meshStandardMaterial color="#880e4f" roughness={0.9} />
                          </mesh>
                      </group>

                      {/* --- Right (Fridge) Content --- */}
                      <group position={[0.45, 0, 0]}>
                          <mesh position={[0, 0.5, 0]}>
                              <boxGeometry args={[0.8, 0.02, 0.5]} />
                              <meshStandardMaterial color="#fff" transparent opacity={0.5} />
                          </mesh>
                          {/* Apples */}
                          <mesh position={[-0.2, 0.6, 0.1]}>
                              <sphereGeometry args={[0.07]} />
                              <meshStandardMaterial color="#c62828" />
                          </mesh>
                           <mesh position={[-0.05, 0.6, 0.15]}>
                              <sphereGeometry args={[0.07]} />
                              <meshStandardMaterial color="#c62828" />
                          </mesh>
                          {/* Cabbage */}
                           <mesh position={[0.2, 0.62, 0]}>
                               <sphereGeometry args={[0.13]} />
                               <meshStandardMaterial color="#a5d6a7" roughness={0.8} />
                          </mesh>
                      </group>
                 </group>
                 
                 {/* Left Door (Freezer) */}
                 <FridgeDoor 
                    isOpen={leftDoorOpen} 
                    onClick={() => setLeftDoorOpen(!leftDoorOpen)}
                    hingePosition={[-0.9, 1.1, 0.51]}
                    openRotation={-Math.PI / 2.5}
                 >
                     <mesh position={[0.44, 0, 0]} castShadow> 
                         <boxGeometry args={[0.88, 2.15, 0.05]} />
                         <meshStandardMaterial color="#cfcfcf" metalness={0.5} roughness={0.2} />
                     </mesh>
                     {/* Handle */}
                     <mesh position={[0.75, 0, 0.06]}>
                         <cylinderGeometry args={[0.02, 0.02, 0.5]} />
                         <meshStandardMaterial color="#111" />
                     </mesh>
                 </FridgeDoor>

                 {/* Right Door (Fridge) */}
                 <FridgeDoor 
                    isOpen={rightDoorOpen} 
                    onClick={() => setRightDoorOpen(!rightDoorOpen)}
                    hingePosition={[0.9, 1.1, 0.51]}
                    openRotation={Math.PI / 2.5}
                 >
                     <mesh position={[-0.44, 0, 0]} castShadow>
                         <boxGeometry args={[0.88, 2.15, 0.05]} />
                         <meshStandardMaterial color="#cfcfcf" metalness={0.5} roughness={0.2} />
                     </mesh>
                      {/* Handle */}
                     <mesh position={[-0.75, 0, 0.06]}>
                         <cylinderGeometry args={[0.02, 0.02, 0.5]} />
                         <meshStandardMaterial color="#111" />
                     </mesh>
                 </FridgeDoor>

            </group>
        </group>
    );
};