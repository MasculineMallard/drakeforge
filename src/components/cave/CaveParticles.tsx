"use client";

import { useRef, useEffect, useCallback } from "react";
import { gsap } from "@/lib/gsap-setup";

interface Emitter {
  x: number;
  y: number;
  color: string;
  active: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
  color: string;
  glow: boolean;
}

interface CaveParticlesProps {
  emitters: Emitter[];
  className?: string;
}

export default function CaveParticles({ emitters, className = "" }: CaveParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const scrollVelocityRef = useRef(0);
  const lastScrollRef = useRef(0);
  const visibleRef = useRef(false);
  const frameCountRef = useRef(0);

  const spawnEmber = useCallback((emitter: Emitter): Particle => {
    return {
      x: emitter.x + (Math.random() - 0.5) * 80,
      y: emitter.y + (Math.random() - 0.5) * 50,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(0.4 + Math.random() * 0.8),
      size: 1.5 + Math.random() * 3,
      opacity: 0.5 + Math.random() * 0.5,
      life: 0,
      maxLife: 80 + Math.random() * 140,
      color: emitter.color,
      glow: Math.random() < 0.3,
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let w = window.innerWidth;
    let h = window.innerHeight;

    const scale = 0.5;
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * scale);
      canvas.height = Math.round(h * scale);
    };
    resize();
    window.addEventListener("resize", resize);

    const onScroll = () => {
      const current = window.scrollY;
      scrollVelocityRef.current = Math.abs(current - lastScrollRef.current);
      lastScrollRef.current = current;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const tickFn = () => {
      if (!visibleRef.current) return;

      frameCountRef.current++;
      const cw = canvas.width, ch = canvas.height;
      ctx.clearRect(0, 0, cw, ch);

      scrollVelocityRef.current *= 0.95;
      const velocityBoost = 1 + Math.min(scrollVelocityRef.current * 0.015, 2);

      // Emitter-based embers: spawn every 15 frames (was 45)
      if (frameCountRef.current % 15 === 0 && particlesRef.current.length < 150) {
        for (const emitter of emitters) {
          if (!emitter.active) continue;
          particlesRef.current.push(spawnEmber(emitter));
        }
      }

      // Ambient rising embers from bottom: spawn every 8 frames (was 60)
      if (frameCountRef.current % 8 === 0 && particlesRef.current.length < 150) {
        const isWarm = Math.random() < 0.7;
        particlesRef.current.push({
          x: Math.random() * w,
          y: h + 10,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -(0.3 + Math.random() * 0.6),
          size: isWarm ? (1.5 + Math.random() * 3) : (4 + Math.random() * 8),
          opacity: isWarm ? (0.4 + Math.random() * 0.5) : (0.06 + Math.random() * 0.08),
          life: 0,
          maxLife: isWarm ? (100 + Math.random() * 180) : (200 + Math.random() * 300),
          color: isWarm ? "#ff6020" : "#ff9050",
          glow: isWarm && Math.random() < 0.25,
        });
      }

      let writeIdx = 0;
      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];
        p.life++;
        if (p.life > p.maxLife) continue;

        p.x += p.vx * velocityBoost;
        p.y += p.vy * velocityBoost;
        p.vx += (Math.random() - 0.5) * 0.03;

        const lifeRatio = p.life / p.maxLife;
        const fadeIn = Math.min(p.life / 15, 1);
        const fadeOut = 1 - lifeRatio * lifeRatio;
        const alpha = p.opacity * fadeIn * fadeOut;

        if (alpha < 0.01) { particlesRef.current[writeIdx++] = p; continue; }

        const sx = p.x * scale, sy = p.y * scale, ss = p.size * scale;

        // Glow pass for bright embers
        if (p.glow && ss > 1) {
          ctx.globalAlpha = alpha * 0.4;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(sx, sy, ss * 3, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        if (ss <= 1.5) {
          const s = Math.max(1, Math.round(ss));
          ctx.fillRect(sx, sy, s, s);
        } else {
          ctx.beginPath();
          ctx.arc(sx, sy, ss, 0, Math.PI * 2);
          ctx.fill();
        }

        particlesRef.current[writeIdx++] = p;
      }
      particlesRef.current.length = writeIdx;
    };

    gsap.ticker.add(tickFn);

    const observer = new IntersectionObserver(
      ([entry]) => { visibleRef.current = entry.isIntersecting; },
      { threshold: 0 }
    );
    observer.observe(canvas);

    return () => {
      gsap.ticker.remove(tickFn);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, [emitters, spawnEmber]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 5 }}
    />
  );
}
