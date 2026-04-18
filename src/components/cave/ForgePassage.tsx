"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-setup";
import RuneTablet from "./RuneTablet";
import CaveParticles from "./CaveParticles";
import { projects } from "@/data/projects";

type Variation = "bloom" | "wipe" | "sweep";

const VARIATIONS: Variation[] = [
  "bloom", "wipe", "sweep", "bloom", "wipe", "sweep", "bloom", "wipe",
];

export default function ForgePassage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const fgLeftRef = useRef<HTMLDivElement>(null);
  const fgRightRef = useRef<HTMLDivElement>(null);

  const computeEmitters = useCallback(() => {
    if (typeof window === "undefined") return [];
    const cols = 4;
    const w = window.innerWidth;
    const h = window.innerHeight;
    return projects.map((p, i) => ({
      x: (((i % cols) + 0.5) / cols) * w,
      y: (Math.floor(i / cols) + 0.5) / 2 * h * 0.6 + h * 0.2,
      color: p.color,
      active: true,
    }));
  }, []);

  const [emitters, setEmitters] = useState(computeEmitters);

  useEffect(() => {
    const onResize = () => setEmitters(computeEmitters());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [computeEmitters]);

  // Foreground rock parallax: scrolls slightly faster than content for depth
  useEffect(() => {
    if (!containerRef.current) return;
    const triggers: ScrollTrigger[] = [];
    const fgElements = [fgLeftRef.current, fgRightRef.current].filter(Boolean) as HTMLDivElement[];
    for (const el of fgElements) {
      const tween = gsap.to(el, {
        y: "-8%",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5,
        },
      });
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
    }
    return () => triggers.forEach(t => t.kill());
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full"
      style={{
        minHeight: "400vh",
        background: "linear-gradient(to bottom, #050810 0%, #080808 10%, #0a0806 30%, #0d0a08 55%, #080604 75%, #050403 100%)",
      }}
    >
      {/* Cave wall art: CSS background tiled vertically instead of stretched img */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url(/images/parallax/cave-layers/cave-back.png)",
          backgroundSize: "100% auto",
          backgroundRepeat: "repeat-y",
          backgroundPosition: "center top",
        }}
      />

      {/* Side shadow gradients for depth */}
      <div className="absolute top-0 left-0 w-[12%] h-full pointer-events-none" style={{
        background: "linear-gradient(to right, rgba(5,4,3,0.95) 0%, transparent 100%)",
      }} />
      <div className="absolute top-0 right-0 w-[12%] h-full pointer-events-none" style={{
        background: "linear-gradient(to left, rgba(5,4,3,0.95) 0%, transparent 100%)",
      }} />

      {/* Warm ambient glows: top entry + scattered warm spots for forge atmosphere */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 50% 5%, rgba(255,96,32,0.18) 0%, transparent 35%),
            radial-gradient(ellipse at 20% 25%, rgba(255,80,30,0.07) 0%, transparent 20%),
            radial-gradient(ellipse at 80% 20%, rgba(255,70,20,0.06) 0%, transparent 18%),
            radial-gradient(ellipse at 50% 45%, rgba(255,80,30,0.08) 0%, transparent 30%),
            radial-gradient(ellipse at 30% 65%, rgba(255,90,40,0.05) 0%, transparent 15%),
            radial-gradient(ellipse at 70% 75%, rgba(255,70,20,0.06) 0%, transparent 18%)
          `,
        }}
      />

      {/* Foreground rock silhouettes: left side */}
      <div
        ref={fgLeftRef}
        className="absolute top-0 left-0 w-[18%] pointer-events-none"
        style={{ height: "110%", zIndex: 4 }}
      >
        <svg className="w-full h-full" viewBox="0 0 200 1200" preserveAspectRatio="none">
          <path fill="#030302" d="M0,0 L0,1200 L30,1200 Q35,1100 25,1000 Q15,900 35,800 Q50,720 30,650 Q10,580 40,500 Q55,440 25,370 Q5,300 30,220 Q45,160 20,100 Q10,50 30,0 Z" />
          <path fill="#050504" d="M0,0 L0,1200 L15,1200 Q20,1050 10,950 Q5,850 18,750 Q25,680 12,600 Q3,520 20,430 Q28,360 10,280 Q0,200 15,120 Q22,60 10,0 Z" />
        </svg>
      </div>

      {/* Foreground rock silhouettes: right side */}
      <div
        ref={fgRightRef}
        className="absolute top-0 right-0 w-[18%] pointer-events-none"
        style={{ height: "110%", zIndex: 4 }}
      >
        <svg className="w-full h-full" viewBox="0 0 200 1200" preserveAspectRatio="none">
          <path fill="#030302" d="M200,0 L200,1200 L170,1200 Q165,1100 175,1000 Q185,900 165,800 Q150,720 170,650 Q190,580 160,500 Q145,440 175,370 Q195,300 170,220 Q155,160 180,100 Q190,50 170,0 Z" />
          <path fill="#050504" d="M200,0 L200,1200 L185,1200 Q180,1050 190,950 Q195,850 182,750 Q175,680 188,600 Q197,520 180,430 Q172,360 190,280 Q200,200 185,120 Q178,60 190,0 Z" />
        </svg>
      </div>

      {/* Rune tablets in a grid with generous spacing */}
      <div className="relative z-[2] grid grid-cols-2 md:grid-cols-4 gap-y-40 md:gap-y-56 gap-x-8 md:gap-x-12 px-8 md:px-14 lg:px-24 py-48 md:py-72 max-w-[1400px] mx-auto overflow-visible">
        {projects.map((project, i) => (
          <RuneTablet
            key={project.id}
            project={project}
            index={i}
            variation={VARIATIONS[i % VARIATIONS.length]}
          />
        ))}
      </div>

      {/* Hint text */}
      <div className="relative z-[2] text-center pt-2 pb-2 pointer-events-none">
        <p className="text-[10px] text-white/15 font-serif italic tracking-wider">
          Click a rune to inspect
        </p>
      </div>

      {/* Cave particles */}
      <CaveParticles emitters={emitters} />

      {/* Darkening toward bottom: cave dims as forge fades */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[20%] pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(2,3,4,0.85))",
        }}
      />

      {/* Seamless blend from transition section at top */}
      <div
        className="absolute top-0 left-0 right-0 h-[8%] pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, rgba(5,6,8,0.85) 0%, rgba(8,7,6,0.4) 50%, transparent)",
          zIndex: 5,
        }}
      />

      {/* Footer: the forge's last ember */}
      <div className="relative z-[3] pt-16 pb-16 text-center">
        {/* Warm glow behind footer */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 40%, rgba(255,80,30,0.06) 0%, transparent 50%)",
          }}
        />

        {/* Ember cluster */}
        <div className="flex justify-center gap-3 mb-5">
          <div style={{
            width: 2, height: 2, borderRadius: "50%",
            background: "#ff6020", opacity: 0.3,
            boxShadow: "0 0 4px 1px rgba(255,96,32,0.4)",
          }} />
          <div style={{
            width: 5, height: 5, borderRadius: "50%",
            background: "radial-gradient(circle, #ff8040 0%, #ff5010 60%, transparent 100%)",
            boxShadow: "0 0 10px 3px rgba(255,96,32,0.5)",
            animation: "pulse 3s ease-in-out infinite",
          }} />
          <div style={{
            width: 2, height: 2, borderRadius: "50%",
            background: "#ff6020", opacity: 0.3,
            boxShadow: "0 0 4px 1px rgba(255,96,32,0.4)",
          }} />
        </div>

        {/* Divider line */}
        <div className="mx-auto mb-5" style={{
          width: 60, height: 1,
          background: "linear-gradient(to right, transparent, rgba(255,96,32,0.15), transparent)",
        }} />

        <p
          style={{
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
            fontSize: "0.75rem",
            color: "rgba(255,255,255,0.3)",
            letterSpacing: "0.2em",
          }}
        >
          Forged by Drake
        </p>
        <p
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "0.6rem",
            color: "rgba(255,255,255,0.12)",
            letterSpacing: "0.3em",
            marginTop: "0.5rem",
          }}
        >
          2026
        </p>
      </div>
    </section>
  );
}
