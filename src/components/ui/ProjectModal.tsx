"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/data/projects";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  return (
    <AnimatePresence>
      {project && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="modal-backdrop fixed inset-0 z-50"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl max-h-[85vh] pointer-events-auto"
              style={{
                background: "rgba(5, 15, 30, 0.95)",
                borderRadius: "1rem",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: `0 0 40px ${project.color}40, 0 0 80px ${project.color}20`,
              }}
            >
              <div className="modal-scroll overflow-y-auto max-h-[85vh] p-8">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                  aria-label="Close modal"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>

                <h2
                  className="text-4xl font-serif font-bold mb-2"
                  style={{ color: project.color }}
                >
                  {project.name}
                </h2>

                <p className="text-lg italic text-cyan-200/60 mb-6">
                  {project.tagline}
                </p>

                <div
                  className="h-px mb-6"
                  style={{
                    background: `linear-gradient(90deg, ${project.color}00, ${project.color}, ${project.color}00)`,
                  }}
                />

                <p className="text-slate-200 leading-relaxed mb-6">
                  {project.description}
                </p>

                <div className="mb-6">
                  <h3 className="text-sm uppercase tracking-wider text-cyan-300/70 mb-3">
                    Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded-full text-sm"
                        style={{
                          border: `1px solid ${project.color}60`,
                          color: project.color,
                          background: `${project.color}10`,
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm uppercase tracking-wider text-cyan-300/70 mb-3">
                    Key Features
                  </h3>
                  <ul className="space-y-2">
                    {project.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span
                          className="block w-2 h-2 rounded-full mt-2 flex-shrink-0"
                          style={{
                            background: project.color,
                            boxShadow: `0 0 8px ${project.color}`,
                          }}
                        />
                        <span className="text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  className="mb-6 rounded-lg flex items-center justify-center"
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    minHeight: "200px",
                  }}
                >
                  <span className="text-slate-500 text-sm uppercase tracking-wider">
                    Screenshot
                  </span>
                </div>

                <div className="flex gap-3">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-6 py-3 rounded-lg text-center font-medium transition-all"
                      style={{
                        border: `1px solid ${project.color}`,
                        color: project.color,
                        background: "transparent",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = `${project.color}20`;
                        e.currentTarget.style.boxShadow = `0 0 20px ${project.color}40`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      View on GitHub
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-6 py-3 rounded-lg text-center font-medium transition-all text-slate-900"
                      style={{
                        background: project.color,
                        boxShadow: `0 0 20px ${project.color}60`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = `0 0 30px ${project.color}80`;
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = `0 0 20px ${project.color}60`;
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      Visit Live Site
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
