"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Starfield from "@/components/ui/Starfield";
import FogOverlay from "@/components/ui/FogOverlay";
import SiteHeader from "@/components/ui/SiteHeader";
import Controls from "@/components/ui/Controls";
import ProjectModal from "@/components/ui/ProjectModal";
import { useAudio } from "@/components/hooks/useAudio";
import type { Project } from "@/data/projects";

const LakeScene = dynamic(
  () => import("@/components/scene/LakeScene"),
  {
    ssr: false,
    loading: () => (
      <div className="loading-screen">
        <div className="loading-orb" />
      </div>
    ),
  }
);

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [rainActive, setRainActive] = useState(false);
  const { playing: audioPlaying, toggle: toggleAudio } = useAudio("/audio/ambient-water.mp3");

  const handleProjectClick = useCallback((project: Project) => {
    setSelectedProject(project);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProject(null);
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      {/* Layer 0-2: Background layers */}
      <Starfield />

      {/* Layer 3: 3D Lake Scene */}
      <LakeScene
        onProjectClick={handleProjectClick}
        rainActive={rainActive}
      />

      {/* Layer 4: Fog */}
      <FogOverlay />

      {/* Layer 5: UI */}
      <SiteHeader />
      <Controls
        rainActive={rainActive}
        onToggleRain={() => setRainActive((r) => !r)}
        audioPlaying={audioPlaying}
        onToggleAudio={toggleAudio}
      />

      {/* Layer 6: Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={handleCloseModal}
      />
    </main>
  );
}
