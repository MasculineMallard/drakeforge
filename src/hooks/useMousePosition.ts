"use client";

import { useEffect, useRef } from "react";

interface MousePosition {
  x: number; // -1 to 1 (left to right)
  y: number; // -1 to 1 (top to bottom)
}

// Returns a ref to smoothed, normalized mouse position (-1 to 1).
// Lerp smoothing happens externally (caller reads and interpolates).
// Disabled on touch devices.
export function useMousePosition() {
  const target = useRef<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    const onMove = (e: MouseEvent) => {
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return target;
}
