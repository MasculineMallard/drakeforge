# DrakeForge -- Claude Code Context

## What This Is
Interactive 2D parallax portfolio site. Scroll through a moonlit mountain pass into a glowing cave forge where rune tablets reveal projects. Next.js 16, GSAP ScrollTrigger, Lenis smooth scroll, Canvas 2D, Tailwind CSS.

## Architecture
- **State**: SiteContext (activeProject, hoveredProject, focusProject, hoverProject)
- **Scroll journey**: HeroSection (parallax mountain scene) -> TransitionSection (clip-path cave entrance) -> ForgePassage (rune tablets + particles + footer)
- **Animation**: GSAP ScrollTrigger for scroll-driven (scrub), CSS transitions for hover, RAF loops for particles
- **GSAP setup**: Single registration in `src/lib/gsap-setup.ts`. All components import from there.
- **Rendering**: CSS parallax layers with pre-upscaled pixel art PNGs, Canvas 2D for glyph rendering (offscreen -> dataURL -> static img), Canvas 2D for particle systems
- **Smooth scroll**: Lenis (lerp 0.1, duration 1.2) connected to GSAP ticker in SmoothScroll.tsx

## File Layout
| Path | What |
|------|------|
| `src/app/page.tsx` | Root: SiteProvider + SmoothScroll + section composition |
| `src/app/layout.tsx` | Root layout with metadata |
| `src/context/SiteContext.tsx` | Shared state (activeProject, hoveredProject) |
| `src/lib/gsap-setup.ts` | GSAP + ScrollTrigger registration (single source) |
| `src/lib/glyphDrawers.ts` | 8 glyph draw functions + renderGlyph 3-pass technique |
| `src/components/layout/SmoothScroll.tsx` | Lenis wrapper connected to GSAP ticker |
| `src/components/sections/HeroSection.tsx` | Zone 1: 8-layer parallax, mouse parallax, title overlay |
| `src/components/sections/TransitionSection.tsx` | Zone 2: clip-path cave mouth expansion, color shift |
| `src/components/cave/ForgePassage.tsx` | Zone 3: cave wall layers, 8 rune tablets grid, particles, footer |
| `src/components/cave/RuneTablet.tsx` | Single project: circular well, glyph, name, scroll reveal |
| `src/components/cave/RuneGlyph.tsx` | Offscreen canvas -> dataURL -> static img with CSS mask |
| `src/components/cave/CaveParticles.tsx` | Ember particle canvas (IntersectionObserver gated) |
| `src/components/particles/SnowCanvas.tsx` | Snow particle canvas (scroll-fade, IntersectionObserver gated) |
| `src/components/ui/ProjectPanel.tsx` | Slide-in project detail panel |
| `src/components/ui/FogOverlay.tsx` | CSS fog gradient overlay |
| `src/components/ui/LoadingScreen.tsx` | Loading overlay |
| `src/hooks/useMousePosition.ts` | Lerp-smoothed mouse position for hero parallax |
| `src/data/projects.ts` | 8 portfolio projects (static data) |

## Assets
- Hero parallax PNGs: `public/images/parallax/hero/` (sky, far-clouds, far-mountains, mountains, near-clouds, trees)
- Cave interior PNGs: `public/images/parallax/interior/` (seamless-cave-full, seamless-cave-far)
- Cave rock PNGs: `public/images/parallax/cave/` (RockCombinations1, BigRocks1)
- Moodboard reference: `reference/mood.jpg`

## Running
- Dev: `npm run dev --turbopack`
- Deploy: Railway (Nixpacks), auto-deploy from GitHub
- Live: drakeforge.quest

## Dev Scripts
- `screenshot.mjs` / `screenshot-scroll.mjs`: Playwright-based screenshots
- `perf-audit.mjs`: Performance profiling (FPS, canvas count, filter audit)
- `upscale-hero.mjs`: Sharp nearest-neighbor pixel art upscaling
