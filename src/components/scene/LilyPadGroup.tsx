"use client";

import LilyPad from "./LilyPad";
import { projects, Project } from "@/data/projects";

interface LilyPadGroupProps {
  onProjectClick: (project: Project) => void;
}

// Natural scattered positions for lily pads
const positions: [number, number, number][] = [
  [-4, 0.1, -3],
  [3, 0.1, -4],
  [-5, 0.1, 2],
  [4, 0.1, 3],
  [0, 0.1, -5],
  [-2, 0.1, 4],
  [6, 0.1, 0],
  [-6, 0.1, -1],
];

export default function LilyPadGroup({ onProjectClick }: LilyPadGroupProps) {
  return (
    <group>
      {projects.map((project, index) => (
        <LilyPad
          key={project.id}
          position={positions[index] || [0, 0.1, 0]}
          project={project}
          onClick={onProjectClick}
          index={index}
        />
      ))}
    </group>
  );
}
