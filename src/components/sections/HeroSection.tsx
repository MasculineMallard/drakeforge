"use client";

import { useRef, useEffect, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-setup";
import { useMousePosition } from "@/hooks/useMousePosition";

// Layer configuration with art assets and parallax speeds
const LAYERS = [
  { speed: 0.02, img: "/images/parallax/hero/sky.png", fit: "cover" as const },
  { speed: 0.03, img: "/images/parallax/hero/moon.png", fit: "cover" as const },
  { speed: 0.06, img: "/images/parallax/hero/far-clouds.png", fit: "cover" as const },
  { speed: 0.12, img: "/images/parallax/hero/far-mountains.png", fit: "cover" as const },
  { speed: 0.25, img: "/images/parallax/hero/mountains.png", fit: "cover" as const },
  { speed: 0.40, img: "/images/parallax/hero/near-clouds.png", fit: "cover" as const },
  { speed: 0.50, img: "/images/parallax/hero/trees-back.png", fit: "cover" as const },
  { speed: 0.60, img: "/images/parallax/hero/trees.png", fit: "cover" as const },
  { speed: 0.80, img: null }, // Cave entrance (SVG)
  { speed: 1.30, img: null }, // Corner vignettes
];

const MOUSE_PARALLAX = [1, 1.5, 2, 4, 7, 10, 12, 14, 18, 22];

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mouseRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mouseTarget = useMousePosition();
  const mouseSmooth = useRef({ x: 0, y: 0 });
  const [loaded, setLoaded] = useState(false);

  // Scroll-driven parallax via GSAP
  useEffect(() => {
    if (!containerRef.current) return;

    const triggers: ScrollTrigger[] = [];

    layerRefs.current.forEach((layer, i) => {
      if (!layer || !containerRef.current) return;

      const speed = LAYERS[i].speed;
      const scrollDistance = containerRef.current.offsetHeight;
      const moveAmount = (speed - 1) * scrollDistance;

      const tween = gsap.to(layer, {
        y: moveAmount,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });

      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
    });

    return () => triggers.forEach((t) => t.kill());
  }, []);

  // Mouse-reactive parallax via GSAP ticker (no separate RAF loop)
  useEffect(() => {
    if (!containerRef.current) return;
    let visible = false;

    const tickFn = () => {
      if (!visible) return;
      // Lerp mouse position
      mouseSmooth.current.x += (mouseTarget.current.x - mouseSmooth.current.x) * 0.06;
      mouseSmooth.current.y += (mouseTarget.current.y - mouseSmooth.current.y) * 0.06;

      // Only update layers 3+ (far layers have imperceptible mouse movement)
      for (let i = 3; i < mouseRefs.current.length; i++) {
        const inner = mouseRefs.current[i];
        if (!inner) continue;
        const intensity = MOUSE_PARALLAX[i];
        const mx = mouseSmooth.current.x * intensity;
        const my = mouseSmooth.current.y * intensity * 0.5;
        inner.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      }
    };

    gsap.ticker.add(tickFn);

    const observer = new IntersectionObserver(
      ([entry]) => { visible = entry.isIntersecting; },
      { threshold: 0 }
    );
    observer.observe(containerRef.current);

    return () => {
      gsap.ticker.remove(tickFn);
      observer.disconnect();
    };
  }, [mouseTarget]);

  // Page load reveal
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ height: "100vh" }}
    >
      {/* Parallax layers */}
      {LAYERS.map((layer, i) => {
        const isOverScroll = layer.speed > 1;

        return (
          <div
            key={i}
            ref={(el) => { layerRefs.current[i] = el; }}
            className="absolute left-0 right-0"
            style={{
              top: isOverScroll ? `-${(layer.speed - 1) * 100}%` : 0,
              bottom: !isOverScroll ? `-${(1 - layer.speed) * 100}%` : undefined,
              height: isOverScroll ? `${layer.speed * 100}%` : undefined,
              opacity: loaded ? 1 : 0,
              transition: loaded ? undefined : `opacity 1s ease ${i * 0.15}s`,
              zIndex: i,
              willChange: i >= 4 ? "transform" : undefined,
            }}
          >
            <div
              ref={(el) => { mouseRefs.current[i] = el; }}
              className="w-full h-full relative"
            >
              {/* Art image layers: CSS background for GPU-efficient compositing */}
              {layer.img && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: `url(${layer.img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center bottom",
                    backgroundRepeat: "no-repeat",
                    imageRendering: "pixelated",
                  }}
                />
              )}

              {/* Stars are baked into the sky.png image */}

              {/* Layer 8: Cave entrance with warm glow */}
              {i === 8 && (
                <svg className="absolute bottom-0 w-full" style={{ height: "65%" }} viewBox="0 0 1440 520" preserveAspectRatio="none">
                  <defs>
                    <radialGradient id="caveGlow" cx="50%" cy="35%" r="30%">
                      <stop offset="0%" stopColor="#ff9050" stopOpacity="0.35" />
                      <stop offset="50%" stopColor="#ff8040" stopOpacity="0.10" />
                      <stop offset="100%" stopColor="#ff8040" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <ellipse cx="720" cy="220" rx="200" ry="150" fill="url(#caveGlow)" />
                  {/* Wide cave mouth arch */}
                  <path fill="#050810" d="M0,520 L0,0 L340,0 Q400,10 460,50 Q530,110 580,200 Q620,280 650,350 Q670,400 690,430 Q710,450 720,455 Q730,450 750,430 Q770,400 790,350 Q820,280 860,200 Q910,110 980,50 Q1040,10 1100,0 L1440,0 L1440,520 Z" />
                </svg>
              )}

              {/* Layer 9: Corner vignettes + bottom blend */}
              {i === 9 && (
                <>
                  <div className="absolute bottom-0 left-0 w-1/3 h-1/3" style={{ background: "linear-gradient(to top right, #050810 40%, transparent)" }} />
                  <div className="absolute bottom-0 right-0 w-1/3 h-1/3" style={{ background: "linear-gradient(to top left, #050810 40%, transparent)" }} />
                  <div className="absolute top-0 left-0 w-1/4 h-1/4" style={{ background: "linear-gradient(to bottom right, #050810 20%, transparent)" }} />
                  <div className="absolute top-0 right-0 w-1/4 h-1/4" style={{ background: "linear-gradient(to bottom left, #050810 20%, transparent)" }} />
                  {/* Bottom edge blend into transition section */}
                  <div className="absolute bottom-0 left-0 right-0 h-[30%]" style={{ background: "linear-gradient(to bottom, transparent, #050810)" }} />
                </>
              )}
            </div>
          </div>
        );
      })}

      {/* Title overlay */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-1000"
        style={{ zIndex: 20, opacity: loaded ? 1 : 0, transitionDelay: "1.2s" }}
      >
        <h1 className="title-glow text-5xl md:text-6xl lg:text-7xl font-serif tracking-wide">
          DrakeForge
        </h1>
        <p className="mt-3 text-base md:text-lg text-amber-200/50 italic tracking-wider font-serif">
          Where ideas take form
        </p>
      </div>

      {/* Scroll hint */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none transition-opacity duration-1000"
        style={{ zIndex: 20, opacity: loaded ? 0.4 : 0, transitionDelay: "2s" }}
      >
        <p className="text-xs text-white/40 font-serif italic tracking-wider">
          Scroll to enter
        </p>
        <svg
          className="w-5 h-5 text-white/30 animate-bounce"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
