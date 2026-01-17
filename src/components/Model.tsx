"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import { useGestureStore } from "@/store";

export default function Model() {
  const meshRef = useRef<Mesh>(null);
  const { isHandDetected, handPosition, gesture } = useGestureStore();

  useFrame((state, delta) => {
    if (meshRef.current) {
      if (isHandDetected) {
        // Map hand position to rotation
        // handPosition.x is approx -1 to 1
        // handPosition.y is approx -1 to 1
        
        const targetRotX = handPosition.y * 2; 
        const targetRotY = handPosition.x * 2;

        // Smooth interpolation
        meshRef.current.rotation.x += (targetRotX - meshRef.current.rotation.x) * 0.1;
        meshRef.current.rotation.y += (targetRotY - meshRef.current.rotation.y) * 0.1;
        
        // Gesture specific actions
        if (gesture === 'Closed_Fist') {
             meshRef.current.scale.lerp({ x: 0.5, y: 0.5, z: 0.5 }, 0.1);
        } else {
             meshRef.current.scale.lerp({ x: 1.5, y: 1.5, z: 1.5 }, 0.1);
        }

      } else {
        // Idle animation
        meshRef.current.rotation.x += delta * 0.2;
        meshRef.current.rotation.y += delta * 0.3;
        meshRef.current.scale.lerp({ x: 1, y: 1, z: 1 }, 0.1);
      }
    }
  });

  return (
    <mesh
      ref={meshRef}
    >
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial
        color={isHandDetected ? (gesture === 'Closed_Fist' ? "hotpink" : "#4ade80") : "orange"}
        wireframe={true}
      />
    </mesh>
  );
}
