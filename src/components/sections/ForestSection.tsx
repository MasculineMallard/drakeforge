"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-setup";

export default function ForestSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const canopyRef = useRef<HTMLDivElement>(null);
  const midForestRef = useRef<HTMLDivElement>(null);
  const nearForestRef = useRef<HTMLDivElement>(null);
  const darkenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !panelRef.current) return;

    const triggers: ScrollTrigger[] = [];

    // Pin the panel for the scroll duration
    const pinTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      pin: panelRef.current,
      pinSpacing: false,
    });
    triggers.push(pinTrigger);

    // Parallax layers: each scrolls up at different rates
    const layers = [
      { el: canopyRef.current, yEnd: "-5%" },
      { el: midForestRef.current, yEnd: "-14%" },
      { el: nearForestRef.current, yEnd: "-25%" },
    ];

    for (const { el, yEnd } of layers) {
      if (!el) continue;
      const tween = gsap.to(el, {
        y: yEnd,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
        },
      });
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
    }

    // Gradual darkening toward bottom (transitioning into the cave)
    // 170vh container, pin range = 70vh. "bottom bottom" = end of pin range.
    // power3.in keeps forest visible through most of scroll, accelerates to black at end.
    if (darkenRef.current) {
      const tween = gsap.fromTo(
        darkenRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          ease: "power3.in",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5,
          },
        }
      );
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
    }

    return () => triggers.forEach((t) => t.kill());
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full"
      style={{ height: "140vh", zIndex: 1, background: "#050810" }}
    >
      <div
        ref={panelRef}
        className="relative w-full overflow-hidden"
        style={{ height: "100vh" }}
      >
        {/* Sky background - continues from hero */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url(/images/parallax/hero/sky.png)",
            backgroundSize: "cover",
            backgroundPosition: "center bottom",
            backgroundRepeat: "no-repeat",
            imageRendering: "pixelated" as React.CSSProperties["imageRendering"],
          }}
        />

        {/* Layer 1: Distant canopy band (trees-back.png) — blue haze for atmospheric depth */}
        <div
          ref={canopyRef}
          className="absolute left-0 right-0"
          style={{
            top: "-20%",
            height: "120%",
            zIndex: 1,
            willChange: "transform",
            opacity: 0.5,
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url(/images/parallax/hero/trees-back.png)",
              backgroundSize: "cover",
              backgroundPosition: "center bottom",
              backgroundRepeat: "no-repeat",
              imageRendering: "pixelated" as React.CSSProperties["imageRendering"],
            }}
          />
          {/* Blue atmospheric haze overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: "rgba(40,65,110,0.55)",
            }}
          />
        </div>

        {/* Layer 2: Mid forest (near-clouds.png) — moderate haze */}
        <div
          ref={midForestRef}
          className="absolute left-0 right-0"
          style={{
            top: "-30%",
            height: "130%",
            zIndex: 2,
            willChange: "transform",
            opacity: 0.8,
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url(/images/parallax/hero/near-clouds.png)",
              backgroundSize: "cover",
              backgroundPosition: "center bottom",
              backgroundRepeat: "no-repeat",
              imageRendering: "pixelated" as React.CSSProperties["imageRendering"],
            }}
          />
          {/* Light blue-green haze: lighter than back layer's strong blue */}
          <div
            className="absolute inset-0"
            style={{
              background: "rgba(20,35,55,0.25)",
            }}
          />
        </div>

        {/* Fog band between mid and near layers */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 2,
            background: `
              linear-gradient(to bottom, transparent 20%, rgba(45,70,120,0.25) 40%, rgba(35,55,90,0.35) 55%, rgba(30,50,80,0.2) 65%, transparent 80%)
            `,
          }}
        />

        {/* Layer 3: Near forest (mountains.png) — full saturation, closest */}
        <div
          ref={nearForestRef}
          className="absolute left-0 right-0"
          style={{
            top: "-40%",
            height: "140%",
            zIndex: 3,
            willChange: "transform",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url(/images/parallax/hero/mountains.png)",
              backgroundSize: "cover",
              backgroundPosition: "center bottom",
              backgroundRepeat: "no-repeat",
              imageRendering: "pixelated" as React.CSSProperties["imageRendering"],
            }}
          />
        </div>

        {/* Ground plane: dark earth strip at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height: "8%",
            zIndex: 4,
            background: "linear-gradient(to bottom, transparent, rgba(8,10,14,0.7) 40%, #080a0e)",
          }}
        />

        {/* Darkening overlay */}
        <div
          ref={darkenRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "#050810",
            opacity: 0,
            zIndex: 6,
          }}
        />

        {/* Top blend from hero section */}
        <div
          className="absolute top-0 left-0 right-0 h-[30%] pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, #050810 5%, rgba(5,8,16,0.6) 40%, transparent)",
            zIndex: 7,
          }}
        />

        {/* Bottom blend toward cave transition */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[15%] pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, transparent, #050810)",
            zIndex: 7,
          }}
        />
      </div>

      {/* Distant cave glow: visible in the dark gap below the pinned panel */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: "80%",
          background: `
            radial-gradient(ellipse at 50% 100%, rgba(255,96,32,0.25) 0%, rgba(255,80,30,0.12) 20%, rgba(255,70,20,0.05) 40%, transparent 60%),
            radial-gradient(ellipse at 50% 85%, rgba(255,120,50,0.06) 0%, transparent 30%)
          `,
        }}
      />
    </section>
  );
}
