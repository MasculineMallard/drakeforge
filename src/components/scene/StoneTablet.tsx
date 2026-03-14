"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { Project } from "@/data/projects";

interface StoneTabletProps {
  position: [number, number, number];
  project: Project;
  onClick: (project: Project) => void;
  index: number;
}

// Generate a unique geometric sigil pattern for each project
function generateSigilPoints(seed: number): [number, number][] {
  const points: [number, number][] = [];
  const sides = 5 + (seed % 4); // 5-8 sides
  const layers = 2 + (seed % 2);

  for (let layer = 0; layer < layers; layer++) {
    const radius = 0.25 - layer * 0.08;
    const offset = (layer * Math.PI) / sides;
    for (let i = 0; i < sides; i++) {
      const angle = (i / sides) * Math.PI * 2 + offset;
      points.push([Math.cos(angle) * radius, Math.sin(angle) * radius]);
    }
  }
  return points;
}

function SigilLines({
  color,
  seed,
  intensity,
}: {
  color: THREE.Color;
  seed: number;
  intensity: number;
}) {
  const points = useMemo(() => generateSigilPoints(seed), [seed]);
  const lineGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const vertices: number[] = [];

    // Connect outer ring
    const sides = 5 + (seed % 4);
    for (let i = 0; i < sides; i++) {
      const next = (i + 1) % sides;
      vertices.push(points[i][0], points[i][1], 0.01);
      vertices.push(points[next][0], points[next][1], 0.01);
    }

    // Connect inner to outer (star pattern)
    const innerStart = sides;
    const innerSides = Math.min(points.length - sides, sides);
    for (let i = 0; i < innerSides; i++) {
      const outerIdx = i;
      const innerIdx = innerStart + (i % innerSides);
      if (innerIdx < points.length) {
        vertices.push(points[outerIdx][0], points[outerIdx][1], 0.01);
        vertices.push(points[innerIdx][0], points[innerIdx][1], 0.01);
      }
    }

    // Inner ring
    for (let i = 0; i < innerSides; i++) {
      const idx = innerStart + i;
      const nextIdx = innerStart + ((i + 1) % innerSides);
      if (idx < points.length && nextIdx < points.length) {
        vertices.push(points[idx][0], points[idx][1], 0.01);
        vertices.push(points[nextIdx][0], points[nextIdx][1], 0.01);
      }
    }

    // Center point connections
    for (let i = 0; i < Math.min(3, innerSides); i++) {
      const idx = innerStart + i * 2;
      if (idx < points.length) {
        vertices.push(0, 0, 0.01);
        vertices.push(points[idx][0], points[idx][1], 0.01);
      }
    }

    geom.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );
    return geom;
  }, [points, seed]);

  return (
    <lineSegments geometry={lineGeometry}>
      <lineBasicMaterial
        color={color}
        transparent
        opacity={intensity}
        linewidth={1}
      />
    </lineSegments>
  );
}

function GlowRing({
  color,
  intensity,
}: {
  color: THREE.Color;
  intensity: number;
}) {
  return (
    <mesh position={[0, 0, 0.005]}>
      <ringGeometry args={[0.3, 0.32, 32]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={intensity * 0.6}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function StoneTablet({
  position,
  project,
  onClick,
  index,
}: StoneTabletProps) {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const baseY = position[1];
  const freq = 0.5 + index * 0.07;
  const phase = index * 0.8;
  const projectColor = useMemo(() => new THREE.Color(project.color), [project.color]);
  const seed = useMemo(
    () => project.id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0),
    [project.id]
  );

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    if (groupRef.current) {
      // Gentle bob
      groupRef.current.position.y =
        baseY + Math.sin(time * freq + phase) * 0.04;
      // Very subtle tilt
      groupRef.current.rotation.x =
        -Math.PI / 2 + Math.sin(time * 0.3 + phase) * 0.015;
      groupRef.current.rotation.z = Math.sin(time * 0.2 + phase * 2) * 0.01;
    }

    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      const pulse = Math.sin(time * 1.5 + phase) * 0.15 + 0.5;
      mat.opacity = hovered ? 0.4 : pulse * 0.2;
    }
  });

  const glowIntensity = hovered ? 1.0 : 0.5;

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={hovered ? 1.08 : 1.0}
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
      {/* Underwater glow halo */}
      <mesh ref={glowRef} position={[0, 0, -0.05]}>
        <circleGeometry args={[0.6, 32]} />
        <meshBasicMaterial
          color={projectColor}
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Stone tablet body */}
      <RoundedBox
        args={[0.8, 0.8, 0.06]}
        radius={0.04}
        smoothness={4}
        castShadow
      >
        <meshStandardMaterial
          color="#1a1a24"
          roughness={0.85}
          metalness={0.15}
          emissive={projectColor}
          emissiveIntensity={hovered ? 0.15 : 0.05}
        />
      </RoundedBox>

      {/* Edge glow */}
      <mesh position={[0, 0, 0.031]}>
        <planeGeometry args={[0.82, 0.82]} />
        <meshBasicMaterial
          color={projectColor}
          transparent
          opacity={hovered ? 0.15 : 0.05}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Sigil pattern */}
      <group position={[0, 0.05, 0.031]}>
        <SigilLines color={projectColor} seed={seed} intensity={glowIntensity} />
        <GlowRing color={projectColor} intensity={glowIntensity} />
      </group>

      {/* Project name */}
      <Text
        position={[0, -0.28, 0.035]}
        fontSize={0.065}
        color={project.color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.003}
        outlineColor="#000000"
      >
        {project.name}
      </Text>

      {/* Tagline */}
      <Text
        position={[0, -0.35, 0.035]}
        fontSize={0.032}
        color={project.color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.002}
        outlineColor="#000000"
        fillOpacity={0.6}
      >
        {project.tagline}
      </Text>
    </group>
  );
}
