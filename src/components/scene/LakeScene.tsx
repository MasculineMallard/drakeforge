"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import WaterSurface from "./WaterSurface";
import TabletGroup from "./TabletGroup";
import Particles from "./Particles";
import RainSystem from "./RainSystem";
import PostProcessing from "./PostProcessing";
import { Project } from "@/data/projects";

interface LakeSceneProps {
  onProjectClick: (project: Project) => void;
  rainActive?: boolean;
}

export default function LakeScene({ onProjectClick, rainActive = false }: LakeSceneProps) {
  return (
    <Canvas
      camera={{
        position: [0, 7, 10],
        fov: 55,
        near: 0.1,
        far: 200,
      }}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: false,
        toneMapping: 4, // ACESFilmicToneMapping
        toneMappingExposure: 0.8,
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1,
      }}
    >
      <Suspense fallback={null}>
        {/* Dark ambient + subtle moonlight */}
        <ambientLight intensity={0.15} color="#1a2a4a" />
        <directionalLight
          position={[3, 8, 4]}
          intensity={0.4}
          color="#6688aa"
        />
        <pointLight
          position={[0, 5, 0]}
          intensity={0.3}
          color="#334466"
          distance={20}
        />

        {/* Night sky environment for reflections */}
        <Environment
          files="/textures/night-sky.hdr"
          background
          backgroundIntensity={0.3}
          environmentIntensity={0.2}
        />

        {/* Camera controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2.3}
          minPolarAngle={Math.PI / 5}
          autoRotate
          autoRotateSpeed={0.08}
          target={[0, 0, 0]}
        />

        {/* Scene */}
        <WaterSurface />
        <TabletGroup onProjectClick={onProjectClick} />
        <Particles />
        <RainSystem active={rainActive} />

        {/* Post-processing */}
        <PostProcessing />
      </Suspense>
    </Canvas>
  );
}
