"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-setup";

export default function TransitionSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const lightLeakRef = useRef<HTMLDivElement>(null);
  const stepTextRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!containerRef.current || !panelRef.current) return;

    const triggers: ScrollTrigger[] = [];

    // Master pin: hold the section in place while cave mouth opens
    // The container is 200vh tall but the panel is 100vh (viewport-sized).
    // ScrollTrigger pins the panel for the extra 100vh of scroll distance,
    // so the cave fully opens before we scroll into the cave section.
    const pinTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      pin: panelRef.current,
      pinSpacing: false,
    });
    triggers.push(pinTrigger);

    // Cave mouth clip-path expansion
    if (clipRef.current) {
      const tween = gsap.fromTo(
        clipRef.current,
        {
          clipPath: "polygon(44% 52%, 47% 44%, 50% 42%, 53% 44%, 56% 52%, 53% 58%, 50% 60%, 47% 58%)",
        },
        {
          clipPath: "polygon(-5% 50%, 0% -5%, 50% -5%, 100% -5%, 105% 50%, 100% 105%, 50% 105%, 0% 105%)",
          ease: "power2.inOut",
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

    // Warm glow intensification
    if (glowRef.current) {
      const tween = gsap.fromTo(
        glowRef.current,
        { opacity: 0.1 },
        {
          opacity: 0.6,
          ease: "power1.in",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "80% bottom",
            scrub: 0.5,
          },
        }
      );
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
    }

    // Color temperature overlay shift
    if (overlayRef.current) {
      const tween = gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "30% top",
            end: "bottom bottom",
            scrub: 0.5,
          },
        }
      );
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
    }

    // Light leak flash at mid-transition
    if (lightLeakRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "30% top",
          end: "70% top",
          scrub: 0.5,
        },
      });
      tl.fromTo(lightLeakRef.current, { opacity: 0 }, { opacity: 0.3, duration: 0.5 });
      tl.to(lightLeakRef.current, { opacity: 0, duration: 0.5 });
      if (tl.scrollTrigger) triggers.push(tl.scrollTrigger);
    }

    // "Step inside" text fade in/out
    const stepText = stepTextRef.current;
    if (stepText) {
      const textTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "20% top",
          end: "60% top",
          scrub: 0.5,
        },
      });
      textTl.fromTo(stepText, { opacity: 0, y: 10 }, { opacity: 0.7, y: 0, duration: 0.5 });
      textTl.to(stepText, { opacity: 0, y: -10, duration: 0.5 });
      if (textTl.scrollTrigger) triggers.push(textTl.scrollTrigger);
    }

    return () => triggers.forEach((t) => t.kill());
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full"
      style={{ height: "200vh" }}
    >
      {/* Pinned panel: stays viewport-sized while scroll drives the animation */}
      <div
        ref={panelRef}
        className="relative w-full overflow-hidden"
        style={{ height: "100vh" }}
      >
        {/* Background: exterior scene continuation (dark) */}
        <div className="absolute inset-0" style={{ background: "#050810" }}>
          {/* Continued mountain silhouettes fading away */}
          <svg className="absolute bottom-0 w-full h-full opacity-20" viewBox="0 0 1440 800" preserveAspectRatio="none">
            <polygon fill="#0d1828" points="0,800 0,400 200,350 400,450 600,280 800,420 1000,320 1200,400 1440,300 1440,800" />
          </svg>

          {/* Cave entrance cliff wall - irregular, craggy opening */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 800" preserveAspectRatio="none">
            <defs>
              <radialGradient id="transGlow" cx="50%" cy="45%" r="30%">
                <stop offset="0%" stopColor="#ff6020" stopOpacity="0.5" />
                <stop offset="60%" stopColor="#ff6020" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#ff6020" stopOpacity="0" />
              </radialGradient>
            </defs>
            <ellipse cx="720" cy="380" rx="350" ry="250" fill="url(#transGlow)" />
            {/* Irregular cave mouth: jagged rocky edges */}
            <path fill="#050810" d="M0,800 L0,0 L480,0 Q510,60 530,140 Q545,200 560,280 Q570,330 585,380 Q595,420 610,460 Q625,500 640,540 Q650,570 665,600 Q675,625 690,645 Q705,660 720,665 Q735,660 750,645 Q765,625 775,600 Q790,570 800,540 Q815,500 830,460 Q845,420 855,380 Q870,330 880,280 Q895,200 910,140 Q930,60 960,0 L1440,0 L1440,800 Z" />
            {/* Rocky protrusions on the left edge */}
            <path fill="#050810" d="M560,280 Q555,265 565,250 Q575,260 570,275 Z" />
            <path fill="#050810" d="M610,460 Q600,445 612,435 Q622,450 615,460 Z" />
            {/* Rocky protrusions on the right edge */}
            <path fill="#050810" d="M880,280 Q885,265 875,250 Q865,260 870,275 Z" />
            <path fill="#050810" d="M830,460 Q840,445 828,435 Q818,450 825,460 Z" />
          </svg>
        </div>

        {/* Interior cave (revealed via clip-path) */}
        <div
          ref={clipRef}
          className="absolute inset-0"
          style={{
            clipPath: "polygon(44% 52%, 47% 44%, 50% 42%, 53% 44%, 56% 52%, 53% 58%, 50% 60%, 47% 58%)",
            zIndex: 2,
            willChange: "clip-path",
          }}
        >
          <div className="absolute inset-0">
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(to bottom, #050810 0%, #080808 10%, #0a0806 30%, #0d0a08 55%, #080604 75%, #050403 100%)",
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: "url(/images/parallax/cave-layers/cave-back.png)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div
              className="absolute bottom-0 left-1/4 right-1/4 h-2/3"
              style={{
                background: "radial-gradient(ellipse at 50% 100%, rgba(255,96,32,0.15) 0%, transparent 70%)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: "radial-gradient(ellipse at 50% 60%, rgba(255,96,32,0.08) 0%, transparent 50%)",
              }}
            />
          </div>
        </div>

        {/* Stone arch frame around cave entrance */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 1440 800"
          preserveAspectRatio="none"
          style={{ zIndex: 2 }}
        >
          {/* Carved stone rim: slightly lighter than the surrounding rock */}
          <path fill="none" stroke="rgba(80,70,55,0.12)" strokeWidth="8"
            d="M540,280 Q545,200 560,280 Q570,330 585,380 Q595,420 610,460 Q625,500 640,540 Q650,570 665,600 Q675,625 690,645 Q705,660 720,665 Q735,660 750,645 Q765,625 775,600 Q790,570 800,540 Q815,500 830,460 Q845,420 855,380 Q870,330 880,280 Q895,200 900,280"
          />
          {/* Inner edge highlight: suggests chiseled rim catching light */}
          <path fill="none" stroke="rgba(120,100,70,0.06)" strokeWidth="3"
            d="M555,280 Q560,220 570,290 Q578,340 592,390 Q602,430 616,470 Q630,510 644,548 Q654,575 668,603 Q678,628 692,648 Q705,660 720,663 Q735,660 748,648 Q762,628 772,603 Q786,575 796,548 Q810,510 824,470 Q838,430 848,390 Q862,340 870,290 Q880,220 885,280"
          />
        </svg>

        {/* Warm glow radial */}
        <div
          ref={glowRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 45%, rgba(255,96,32,0.25) 0%, rgba(255,96,32,0.06) 30%, transparent 60%)",
            zIndex: 3,
            opacity: 0.1,
          }}
        />

        {/* Color temperature overlay */}
        <div
          ref={overlayRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, rgba(255,104,32,0.08) 0%, rgba(255,128,64,0.12) 50%, rgba(255,96,32,0.06) 100%)",
            zIndex: 4,
            opacity: 0,
          }}
        />

        {/* Light leak at transition midpoint (no blend mode for GPU perf) */}
        <div
          ref={lightLeakRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 45%, rgba(255,220,150,0.25) 0%, transparent 45%)",
            zIndex: 5,
            opacity: 0,
          }}
        />

        {/* "Step inside" text */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ zIndex: 10 }}
        >
          <p ref={stepTextRef} className="text-amber-100/0 text-lg font-serif italic tracking-[0.2em]" style={{ textShadow: "0 0 20px rgba(255,160,80,0.4)" }}>
            Step inside
          </p>
        </div>
      </div>
    </section>
  );
}
