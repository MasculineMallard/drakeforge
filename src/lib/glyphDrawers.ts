// Glyph drawing functions for each project rune symbol.
// Extracted from RunePillar.tsx for reuse in 2D canvas rendering.

export type GlyphDrawer = (ctx: CanvasRenderingContext2D, w: number, h: number) => void;

export const glyphDrawers: Record<string, GlyphDrawer> = {
  brain: (ctx, w, h) => {
    const cx = w / 2, cy = h / 2;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(cx, cy, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy, 50, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, 90, 0, Math.PI * 2);
    ctx.stroke();
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const cos = Math.cos(a), sin = Math.sin(a);
      ctx.beginPath();
      ctx.moveTo(cx + cos * 20, cy + sin * 20);
      ctx.lineTo(cx + cos * 100, cy + sin * 100);
      ctx.stroke();
      const mx = cx + cos * 70, my = cy + sin * 70;
      ctx.beginPath();
      ctx.moveTo(mx - sin * 12, my + cos * 12);
      ctx.lineTo(mx + sin * 12, my - cos * 12);
      ctx.stroke();
    }
  },
  "mmolb-stats": (ctx, w, h) => {
    const cx = w / 2, cy = h / 2;
    ctx.lineWidth = 6;
    const d = 80;
    ctx.beginPath();
    ctx.moveTo(cx, cy - d);
    ctx.lineTo(cx + d, cy);
    ctx.lineTo(cx, cy + d);
    ctx.lineTo(cx - d, cy);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, cy - d * 0.5);
    ctx.lineTo(cx + d * 0.5, cy);
    ctx.lineTo(cx, cy + d * 0.5);
    ctx.lineTo(cx - d * 0.5, cy);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - d, cy);
    ctx.lineTo(cx + d, cy);
    ctx.moveTo(cx, cy - d);
    ctx.lineTo(cx, cy + d);
    ctx.stroke();
  },
  "castle-td": (ctx, w, h) => {
    const cx = w / 2, cy = h / 2;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(cx, cy + 90);
    ctx.lineTo(cx, cy - 80);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, cy - 30);
    ctx.lineTo(cx - 50, cy - 80);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, cy - 30);
    ctx.lineTo(cx + 50, cy - 80);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, cy + 10);
    ctx.lineTo(cx - 36, cy - 24);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, cy + 10);
    ctx.lineTo(cx + 36, cy - 24);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - 30, cy + 90);
    ctx.lineTo(cx + 30, cy + 90);
    ctx.stroke();
  },
  "legal-brief-drafter": (ctx, w, h) => {
    const cx = w / 2, cy = h / 2;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 90);
    ctx.lineTo(cx, cy + 90);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, cy - 90);
    ctx.lineTo(cx - 50, cy - 30);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, cy - 90);
    ctx.lineTo(cx + 50, cy - 30);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - 70, cy + 10);
    ctx.lineTo(cx + 70, cy + 10);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - 60, cy + 10);
    ctx.lineTo(cx - 60, cy + 50);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + 60, cy + 10);
    ctx.lineTo(cx + 60, cy + 50);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx - 60, cy + 60, 16, 0, Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + 60, cy + 60, 16, 0, Math.PI);
    ctx.stroke();
  },
  "what-to-play": (ctx, w, h) => {
    const cx = w / 2, cy = h / 2;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(cx - 40, cy - 80);
    ctx.lineTo(cx - 40, cy + 80);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - 40, cy - 40);
    ctx.lineTo(cx + 40, cy - 10);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + 40, cy - 10);
    ctx.lineTo(cx - 40, cy + 20);
    ctx.stroke();
    for (const [dx, dy] of [[30, -60], [50, -60], [30, 50], [50, 50], [40, -6]] as [number, number][]) {
      ctx.beginPath();
      ctx.arc(cx + dx, cy + dy, 6, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  "soccer-planner": (ctx, w, h) => {
    const cx = w / 2, cy = h / 2;
    ctx.lineWidth = 6;
    const d = 70;
    ctx.beginPath();
    ctx.moveTo(cx, cy - d);
    ctx.lineTo(cx + d, cy);
    ctx.lineTo(cx, cy + d);
    ctx.lineTo(cx - d, cy);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - d, cy);
    ctx.lineTo(cx + d, cy);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, cy - d);
    ctx.lineTo(cx, cy + d);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy - d, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy + d, 8, 0, Math.PI * 2);
    ctx.fill();
  },
  drakeforge: (ctx, w, h) => {
    const cx = w / 2, cy = h / 2;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(cx, cy + 90);
    ctx.lineTo(cx, cy - 60);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - 40, cy - 60);
    ctx.lineTo(cx + 40, cy - 60);
    ctx.lineTo(cx + 40, cy - 84);
    ctx.lineTo(cx - 40, cy - 84);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - 50, cy + 30);
    ctx.lineTo(cx + 50, cy + 30);
    ctx.lineTo(cx + 36, cy + 60);
    ctx.lineTo(cx - 36, cy + 60);
    ctx.closePath();
    ctx.stroke();
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI - Math.PI * 0.75;
      const dist = 40 + i * 12;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * dist, cy - 50 + Math.sin(a) * dist, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  "tabs-betting": (ctx, w, h) => {
    const cx = w / 2, cy = h / 2;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(cx - 20, cy + 90);
    ctx.lineTo(cx - 20, cy - 90);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - 20, cy - 90);
    ctx.lineTo(cx + 60, cy - 50);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - 20, cy - 30);
    ctx.lineTo(cx + 50, cy + 4);
    ctx.stroke();
    for (const [dx, dy] of [[40, 30], [50, 60], [30, 70]] as [number, number][]) {
      ctx.beginPath();
      ctx.arc(cx + dx, cy + dy, 8, 0, Math.PI * 2);
      ctx.stroke();
    }
  },
};

// Draw subtle stone grain that fades to transparent at edges (no visible shape)
function drawStoneGrain(ctx: CanvasRenderingContext2D, size: number) {
  const half = size / 2;
  const seed = 42;
  ctx.globalAlpha = 1;

  for (let i = 0; i < 400; i++) {
    const t = Math.sin(seed + i * 127.1) * 43758.5453;
    const rx = (t - Math.floor(t));
    const t2 = Math.sin(seed + i * 269.5) * 43758.5453;
    const ry = (t2 - Math.floor(t2));
    const t3 = Math.sin(seed + i * 419.2) * 43758.5453;
    const rb = (t3 - Math.floor(t3));

    const px = rx * size;
    const py = ry * size;
    const dx = px - half, dy = py - half;
    const dist = Math.sqrt(dx * dx + dy * dy) / half;
    if (dist > 0.9) continue;
    const fade = Math.max(0, 1 - dist * 1.3);

    const brightness = 20 + rb * 15;
    ctx.fillStyle = `rgba(${brightness}, ${brightness - 2}, ${brightness - 5}, ${fade * (0.1 + rb * 0.15)})`;
    ctx.fillRect(px, py, 0.5 + rb * 1.2, 0.5 + rb * 1.2);
  }
  ctx.globalAlpha = 1;
}

// Render a project glyph onto a canvas: stone surface with carved glowing grooves
export function renderGlyph(
  canvas: HTMLCanvasElement,
  projectId: string,
  color: string,
  size = 256
): void {
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, size, size);

  const fn = glyphDrawers[projectId];
  if (!fn) {
    console.warn(`[RuneGlyph] No glyph drawer found for projectId: "${projectId}"`);
    return;
  }

  const half = size / 2;

  // Subtle stone grain around the glyph (no visible background shape)
  drawStoneGrain(ctx, size);

  const scale = size / 256 * 0.8;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Helper to draw the glyph at the correct transform
  const drawGlyph = () => {
    ctx.save();
    ctx.translate(half, half);
    ctx.scale(scale, scale);
    ctx.translate(-128, -256);
    fn(ctx, 256, 512);
    ctx.restore();
  };

  // Pass 1: wide dark groove (the physical channel cut into stone)
  // This is the most important pass: it IS the carving
  ctx.strokeStyle = "rgba(0, 0, 0, 0.95)";
  ctx.fillStyle = "rgba(0, 0, 0, 0.95)";
  ctx.shadowColor = "rgba(0, 0, 0, 1)";
  ctx.globalAlpha = 0.9;
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 3;
  ctx.lineWidth = 18;
  drawGlyph();
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // Pass 1b: rim highlight (light catching the top edge of the carved channel)
  ctx.strokeStyle = "rgba(180, 170, 155, 0.12)";
  ctx.fillStyle = "rgba(180, 170, 155, 0.12)";
  ctx.shadowColor = "transparent";
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
  ctx.lineWidth = 19;
  ctx.save();
  ctx.translate(half, half);
  ctx.scale(scale, scale);
  ctx.translate(-128 - 0.3, -256 - 1);
  fn(ctx, 256, 512);
  ctx.restore();

  // Pass 2: subtle colored glow bleeding from grooves (reduced, not dominant)
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.globalAlpha = 0.35;
  ctx.shadowBlur = 18;
  ctx.lineWidth = 5;
  drawGlyph();

  // Pass 3: thin bright center line (molten light inside the groove)
  ctx.globalAlpha = 0.7;
  ctx.shadowBlur = 8;
  ctx.shadowColor = color;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2;
  drawGlyph();

  // Pass 4: white-hot hairline at the deepest point
  ctx.globalAlpha = 0.3;
  ctx.shadowBlur = 2;
  ctx.shadowColor = "#ffffff";
  ctx.strokeStyle = "#ffffff";
  ctx.fillStyle = "#ffffff";
  ctx.lineWidth = 0.8;
  drawGlyph();

  ctx.globalAlpha = 1;
}
