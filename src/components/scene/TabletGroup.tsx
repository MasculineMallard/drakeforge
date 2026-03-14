"use client";

import StoneTablet from "./StoneTablet";
import { projects, Project } from "@/data/projects";

interface TabletGroupProps {
  onProjectClick: (project: Project) => void;
}

// Organic scattered positions - closer together than before
const positions: [number, number, number][] = [
  [-3.0, 0.08, -2.0],
  [1.5, 0.08, -3.0],
  [-4.5, 0.08, 1.0],
  [3.5, 0.08, 1.5],
  [-0.5, 0.08, -4.5],
  [-1.5, 0.08, 3.0],
  [4.0, 0.08, -1.0],
  [-3.5, 0.08, -4.0],
];

export default function TabletGroup({ onProjectClick }: TabletGroupProps) {
  return (
    <group>
      {projects.map((project, index) => (
        <StoneTablet
          key={project.id}
          position={positions[index] || [0, 0.08, 0]}
          project={project}
          onClick={onProjectClick}
          index={index}
        />
      ))}
    </group>
  );
}
