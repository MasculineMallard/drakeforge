"use client";

import { useState, useEffect, useRef } from "react";
import { renderGlyph } from "@/lib/glyphDrawers";

// Module-level cache: render each glyph exactly once per size
const glyphCache = new Map<string, string>();

interface RuneGlyphProps {
  projectId: string;
  color: string;
  size?: number;
  className?: string;
}

export default function RuneGlyph({
  projectId,
  color,
  size = 300,
  className = "",
}: RuneGlyphProps) {
  const key = `${projectId}-${color}-${size}`;
  const [dataUrl, setDataUrl] = useState<string | null>(() => {
    return glyphCache.get(key) ?? null;
  });
  const rendered = useRef(false);

  useEffect(() => {
    if (glyphCache.has(key)) {
      setDataUrl(glyphCache.get(key)!);
      return;
    }
    if (rendered.current) return;
    rendered.current = true;

    const offscreen = document.createElement("canvas");
    renderGlyph(offscreen, projectId, color, size);
    const url = offscreen.toDataURL("image/png");
    glyphCache.set(key, url);
    setDataUrl(url);
  }, [projectId, color, size, key]);

  if (!dataUrl) return null;

  return (
    <img
      src={dataUrl}
      alt=""
      className={`pointer-events-none ${className}`}
      style={{
        width: size * 0.7,
        height: size * 0.7,
      }}
    />
  );
}
