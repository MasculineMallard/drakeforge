"use client";

import { useRef, useEffect, useCallback } from "react";
import { gsap } from "@/lib/gsap-setup";

interface Snowflake {
  x: number;
  y: number;
  size: number;
  speed: number;
  wobbleAmp: number;
  wobblePhase: number;
  opacity: number;
  depthSpeed: number;
}

interface SnowCanvasProps {
  count?: number;
  opacity?: number;
  className?: string;
}

export default function SnowCanvas({
  count = 150,
  opacity = 1,
  className = "",
}: SnowCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snowRef = useRef<Snowflake[]>([]);
  const scrollVelocityRef = useRef(0);
  const lastScrollRef = useRef(0);
  const scrollFadeRef = useRef(1);
  const lastTimeRef = useRef(0);

  const initSnow = useCallback((w: number, h: number) => {
    const flakes: Snowflake[] = [];
    for (let i = 0; i < count; i++) {
      const rand = Math.random();
      let depthSpeed: number, sizeRange: [number, number], speedRange: [number, number], opacityRange: [number, number];

      if (rand < 0.3) {
        // Far, small, slow
        depthSpeed = 0.3;
        sizeRange = [1.5, 3];
        speedRange = [0.3, 0.6];
        opacityRange = [0.3, 0.5];
      } else if (rand < 0.75) {
        // Mid depth
        depthSpeed = 0.6;
        sizeRange = [2.5, 5];
        speedRange = [0.5, 1.0];
        opacityRange = [0.4, 0.7];
      } else {
        // Near, large, fast
        depthSpeed = 1.0;
        sizeRange = [4, 8];
        speedRange = [0.8, 1.5];
        opacityRange = [0.6, 0.9];
      }

      flakes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        size: sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]),
        speed: speedRange[0] + Math.random() * (speedRange[1] - speedRange[0]),
        wobbleAmp: 20 + Math.random() * 40,
        wobblePhase: Math.random() * Math.PI * 2,
        opacity: opacityRange[0] + Math.random() * (opacityRange[1] - opacityRange[0]),
        depthSpeed,
      });
    }
    snowRef.current = flakes;
  }, [count]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let w = window.innerWidth;
    let h = window.innerHeight;

    // Half-resolution canvas (snow particles don't need full res)
    const scale = 0.5;
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * scale);
      canvas.height = Math.round(h * scale);
      if (snowRef.current.length === 0) initSnow(w, h);
    };
    resize();
    window.addEventListener("resize", resize);

    const onScroll = () => {
      const current = window.scrollY;
      scrollVelocityRef.current = Math.abs(current - lastScrollRef.current);
      lastScrollRef.current = current;
      const fadeStart = h * 1.0;
      const fadeEnd = h * 1.4;
      scrollFadeRef.current = current < fadeStart ? 1 : current > fadeEnd ? 0 : 1 - (current - fadeStart) / (fadeEnd - fadeStart);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    lastTimeRef.current = performance.now();

    // Use GSAP ticker instead of separate RAF loop
    const tickFn = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTimeRef.current) / 16.67, 3);
      lastTimeRef.current = now;

      const cw = canvas.width, ch = canvas.height;

      // Skip rendering when invisible and hide canvas from compositor
      if (scrollFadeRef.current < 0.01) {
        if (canvas.style.visibility !== "hidden") {
          ctx.clearRect(0, 0, cw, ch);
          canvas.style.visibility = "hidden";
        }
        return;
      }
      if (canvas.style.visibility === "hidden") {
        canvas.style.visibility = "visible";
      }

      ctx.clearRect(0, 0, cw, ch);
      scrollVelocityRef.current *= 0.95;
      const velocityBoost = 1 + Math.min(scrollVelocityRef.current * 0.02, 2);

      const flakes = snowRef.current;
      for (let i = 0; i < flakes.length; i++) {
        const f = flakes[i];
        f.y += f.speed * dt * velocityBoost;
        f.wobblePhase += 0.01 * dt;
        f.x += Math.sin(f.wobblePhase) * f.wobbleAmp * 0.01 * dt;

        if (f.y > h + f.size) { f.y = -f.size; f.x = Math.random() * w; }
        if (f.x > w + f.wobbleAmp) f.x = -f.wobbleAmp;
        if (f.x < -f.wobbleAmp) f.x = w + f.wobbleAmp;

        ctx.globalAlpha = f.opacity * opacity * scrollFadeRef.current;
        if (ctx.globalAlpha < 0.01) continue;
        ctx.fillStyle = "#d0d4e0";
        const sx = f.x * scale, sy = f.y * scale, ss = f.size * scale;
        if (ss <= 1.5) {
          const s = Math.max(1, Math.round(ss));
          ctx.fillRect(sx, sy, s, s);
        } else {
          ctx.beginPath();
          ctx.arc(sx, sy, ss, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    gsap.ticker.add(tickFn);

    return () => {
      gsap.ticker.remove(tickFn);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, [initSnow, opacity]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${className}`}
      style={{ position: "fixed", inset: 0, zIndex: 5 }}
    />
  );
}
