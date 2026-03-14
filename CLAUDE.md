# DrakeForge — Claude Code Context

## What This Is
Interactive 3D portfolio site. Next.js 16, React Three Fiber, GLSL shaders, Framer Motion.

## Architecture
- Layered rendering: Starfield (z0-2) -> 3D Lake Scene (z3) -> Fog overlay (z4) -> UI (z5) -> Modal (z6)
- All 3D components are client-only (`"use client"`, dynamic import with `ssr: false`)
- Postprocessing: bloom, depth of field

## File Layout
| Path | What |
|------|------|
| `src/app/page.tsx` | Main scene composition |
| `src/components/scene/` | 3D scene (LakeScene.tsx) |
| `src/components/ui/` | 2D overlays (Starfield, Fog, Controls, ProjectModal) |
| `src/components/hooks/` | useAudio.ts |
| `src/data/projects.ts` | Portfolio project data |

## Running
- Dev: `npm run dev --turbopack`
- Deploy: Railway (Nixpacks)
