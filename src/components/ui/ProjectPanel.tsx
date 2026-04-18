"use client";

import { useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSite } from "@/context/SiteContext";
import { renderGlyph } from "@/lib/glyphDrawers";

function InscriptionGlyph({ projectId, color }: { projectId: string; color: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    renderGlyph(canvasRef.current, projectId, color, 192);
  }, [projectId, color]);

  return (
    <canvas
      ref={canvasRef}
      width={192}
      height={192}
      className="pointer-events-none"
      style={{ width: 96, height: 96 }}
    />
  );
}

export default function ProjectPanel() {
  const { state, focusProject } = useSite();
  const project = state.activeProject;

  const close = useCallback(() => focusProject(null), [focusProject]);

  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [project, close]);

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Cave darkens */}
          <motion.div
            className="fixed inset-0 z-[45] cursor-pointer"
            style={{ background: "rgba(2,3,5,0.75)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
          />

          {/* Stone inscription: centered, emerges from darkness */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="pointer-events-auto relative w-full max-w-[520px] overflow-y-auto"
              style={{
                maxHeight: "85vh",
                background: "linear-gradient(175deg, #100c0a 0%, #0a0807 35%, #070605 65%, #0b0908 100%)",
                border: `1px solid ${project.color}10`,
                boxShadow: `0 0 60px 10px ${project.color}08, 0 0 120px 20px rgba(0,0,0,0.5)`,
              }}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top glow edge */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background: `linear-gradient(to right, transparent 10%, ${project.color}25 50%, transparent 90%)`,
                }}
              />

              {/* Close */}
              <button
                onClick={close}
                className="absolute top-4 right-5 text-white/15 hover:text-white/40 transition-colors z-10"
                aria-label="Close"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                </svg>
              </button>

              <div className="px-8 py-10 md:px-12 md:py-12">
                {/* Glyph: large, centered, the activated rune */}
                <div className="flex justify-center mb-6">
                  <InscriptionGlyph projectId={project.id} color={project.color} />
                </div>

                {/* Name + tagline centered beneath glyph */}
                <div className="text-center mb-8">
                  <h2
                    className="text-2xl font-serif tracking-[0.15em]"
                    style={{
                      color: project.color,
                      textShadow: `0 0 30px ${project.color}20`,
                    }}
                  >
                    {project.name}
                  </h2>
                  <p className="text-[11px] text-white/20 mt-2 font-serif italic tracking-wider">
                    {project.tagline}
                  </p>
                </div>

                {/* Carved divider */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex-1 h-px" style={{ background: `${project.color}10` }} />
                  <div
                    className="w-1 h-1 rounded-full"
                    style={{ background: project.color, opacity: 0.3 }}
                  />
                  <div className="flex-1 h-px" style={{ background: `${project.color}10` }} />
                </div>

                {/* Description */}
                <p className="text-[13px] leading-[1.9] text-white/35 font-serif text-center mb-10 max-w-[400px] mx-auto">
                  {project.description}
                </p>

                {/* Two columns: tech + features side by side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  {/* Tech */}
                  <div>
                    <p
                      className="text-[9px] uppercase tracking-[0.35em] font-serif mb-4 text-center md:text-left"
                      style={{ color: `${project.color}40` }}
                    >
                      Built with
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-1.5">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="text-[10px] font-serif tracking-wider px-2.5 py-1"
                          style={{
                            color: `${project.color}70`,
                            border: `1px solid ${project.color}0c`,
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <p
                      className="text-[9px] uppercase tracking-[0.35em] font-serif mb-4 text-center md:text-left"
                      style={{ color: `${project.color}40` }}
                    >
                      Features
                    </p>
                    <ul className="space-y-2">
                      {project.features.map((feature) => (
                        <li
                          key={feature}
                          className="text-[11px] text-white/30 font-serif flex items-start gap-2"
                        >
                          <span
                            className="mt-[6px] w-[3px] h-[3px] flex-shrink-0"
                            style={{ background: project.color, opacity: 0.35 }}
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Links centered at bottom */}
                {(project.githubUrl || project.liveUrl) && (
                  <>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex-1 h-px" style={{ background: `${project.color}08` }} />
                      <div className="flex-1 h-px" style={{ background: `${project.color}08` }} />
                    </div>
                    <div className="flex justify-center gap-4">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-serif tracking-[0.2em] uppercase px-5 py-2 transition-colors hover:bg-white/[0.02]"
                          style={{
                            color: `${project.color}50`,
                            border: `1px solid ${project.color}0c`,
                          }}
                        >
                          Source
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-serif tracking-[0.2em] uppercase px-5 py-2 transition-colors"
                          style={{
                            color: `${project.color}80`,
                            background: `${project.color}08`,
                            border: `1px solid ${project.color}12`,
                          }}
                        >
                          Visit
                        </a>
                      )}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
