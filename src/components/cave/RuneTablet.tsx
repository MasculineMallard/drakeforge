"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-setup";
import RuneGlyph from "./RuneGlyph";
import { useSite } from "@/context/SiteContext";
import type { Project } from "@/data/projects";

type RevealVariation = "bloom" | "wipe" | "sweep";

interface RuneTabletProps {
  project: Project;
  index: number;
  variation: RevealVariation;
}

export default function RuneTablet({
  project,
  index,
  variation,
}: RuneTabletProps) {
  const tabletRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const { state, focusProject, hoverProject } = useSite();

  const isFocused = state.activeProject?.id === project.id;
  const isDimmed = state.activeProject !== null && !isFocused;

  const onClick = useCallback(() => {
    focusProject(project);
  }, [project, focusProject]);

  const onMouseEnter = useCallback(() => {
    setHovered(true);
    hoverProject(project.id);
  }, [project.id, hoverProject]);

  const onMouseLeave = useCallback(() => {
    setHovered(false);
    hoverProject(null);
  }, [hoverProject]);

  // Scroll-triggered reveal
  useEffect(() => {
    if (!tabletRef.current) return;
    const el = tabletRef.current;

    if (variation === "bloom") {
      gsap.set(el, { opacity: 0, scale: 0.8 });
    } else if (variation === "wipe") {
      gsap.set(el, { clipPath: "inset(0 100% 0 0)", opacity: 1 });
    } else {
      gsap.set(el, { opacity: 0, y: 30 });
    }

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      onEnter: () => {
        const delay = index * 0.1;
        const onRevealComplete = () => {
          gsap.set(el, { clearProps: "opacity,transform,clipPath" });
          setRevealed(true);
        };

        if (variation === "bloom") {
          gsap.to(el, { opacity: 1, scale: 1, duration: 0.8, delay, ease: "power2.out", onComplete: onRevealComplete });
        } else if (variation === "wipe") {
          gsap.to(el, { clipPath: "inset(0 0% 0 0%)", duration: 0.8, delay, ease: "power2.inOut", onComplete: onRevealComplete });
        } else {
          gsap.to(el, { opacity: 1, y: 0, duration: 0.6, delay, ease: "power2.out", onComplete: onRevealComplete });
        }
      },
      once: true,
    });

    return () => trigger.kill();
  }, [variation, index]);

  return (
    <div
      ref={tabletRef}
      className="relative w-full max-w-[340px] mx-auto cursor-pointer"
      style={{
        opacity: revealed ? (isDimmed ? 0.25 : undefined) : undefined,
        transition: revealed ? "opacity 0.4s" : undefined,
        aspectRatio: "3/4",
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* No visible container: just a soft radial darkening behind the glyph so it reads against the wall */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 42%, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 35%, transparent 65%)",
        }}
      />

      {/* Glyph: sits inside the recessed surface */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          paddingBottom: "12%",
          opacity: hovered ? 1.0 : 0.85,
          transform: hovered ? "scale(1.05)" : "scale(1)",
          transition: "opacity 0.5s, transform 0.4s ease-out",
        }}
      >
        <RuneGlyph
          projectId={project.id}
          color={project.color}
          size={300}
        />
      </div>

      {/* Project name: carved into the bottom of the alcove */}
      <p
        className="absolute left-0 right-0 text-center font-serif tracking-[0.2em] px-2"
        style={{
          bottom: "6%",
          fontSize: "0.7rem",
          color: project.color,
          opacity: hovered ? 0.6 : 0.25,
          textShadow: `0 1px 2px rgba(0,0,0,0.8), 0 0 8px ${project.color}15`,
          transition: "opacity 0.4s",
        }}
      >
        {project.name}
      </p>
    </div>
  );
}
