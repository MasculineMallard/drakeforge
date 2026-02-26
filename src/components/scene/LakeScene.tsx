"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import WaterSurface from "./WaterSurface";
import LilyPadGroup from "./LilyPadGroup";
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
        position: [0, 8, 12],
        fov: 60,
      }}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: false,
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1,
      }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={0.8}
        color="#b0c4de"
      />

      {/* Camera controls */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2.5}
        minPolarAngle={Math.PI / 4}
        autoRotate
        autoRotateSpeed={0.1}
      />

      {/* Scene components */}
      <WaterSurface />
      <LilyPadGroup onProjectClick={onProjectClick} />
      <Particles />
      <RainSystem active={rainActive} />

      {/* Post-processing */}
      <PostProcessing />
    </Canvas>
  );
}
