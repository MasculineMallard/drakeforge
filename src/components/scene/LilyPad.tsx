"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { Project } from "@/data/projects";

interface LilyPadProps {
  position: [number, number, number];
  project: Project;
  onClick: (project: Project) => void;
  index: number;
}

export default function LilyPad({ position, project, onClick, index }: LilyPadProps) {
  const padRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const textRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const baseY = position[1];
  const freq = 0.8 + index * 0.1;
  const phase = index * 0.5;

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    if (padRef.current) {
      padRef.current.position.y = baseY + Math.sin(time * freq + phase) * 0.03;
      padRef.current.rotation.z = Math.sin(time * 0.3 + phase) * 0.02;

      const targetScale = hovered ? 1.15 : 1.0;
      padRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }

    if (glowRef.current) {
      glowRef.current.position.y = padRef.current ? padRef.current.position.y : baseY;
      glowRef.current.rotation.z = padRef.current ? padRef.current.rotation.z : 0;

      const glowIntensity = hovered ? 1.5 : 1.0;
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity =
        (0.3 + Math.sin(time * 2.0 + phase) * 0.1) * glowIntensity;
    }

    if (textRef.current) {
      textRef.current.position.y =
        (padRef.current ? padRef.current.position.y : baseY) + 0.5;
    }
  });

  const projectColor = new THREE.Color(project.color);

  return (
    <group position={position}>
      {/* Glow halo */}
      <mesh
        ref={glowRef}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[0.7, 32]} />
        <meshBasicMaterial
          color={projectColor}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Main lily pad */}
      <mesh
        ref={padRef}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerOver={() => {
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
        onClick={() => onClick(project)}
      >
        <circleGeometry args={[0.5, 32]} />
        <meshStandardMaterial
          color="#1a4d2e"
          emissive={projectColor}
          emissiveIntensity={hovered ? 0.4 : 0.2}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Project name text */}
      <Text
        ref={textRef}
        fontSize={0.15}
        color={projectColor.getStyle()}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#000000"
      >
        {project.name}
      </Text>
    </group>
  );
}
