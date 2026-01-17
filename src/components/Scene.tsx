"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Model from "./Model";
import { OrbitControls, Environment } from "@react-three/drei";

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      dpr={[1, 2]} // Handle high DPI screens
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Model />
        <Environment preset="city" />
        <OrbitControls makeDefault enableZoom={false} />
      </Suspense>
    </Canvas>
  );
}
