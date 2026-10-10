/** Lays out and rasterises the big flat "ECELL RVU" title. */

// One line on landscape screens, stacked on portrait ones.
const LINES_WIDE = ["ECELL RVU"];
const LINES_NARROW = ["ECELL", "RVU"];

export interface Glyph {
  char: string;
  x: number; // left of the advance box, CSS px
  y: number; // baseline, CSS px
}

export interface Layout {
  size: number;
  font: string;
  glyphs: Glyph[];
}

export function layoutText(w: number, h: number, family: string): Layout {
  const ctx = document.createElement("canvas").getContext("2d")!;
  const lines = w / h < 1 ? LINES_NARROW : LINES_WIDE;
  const fontAt = (s: number) => `900 ${s}px ${family}, Archivo, "Arial Black", sans-serif`;
  const trackingEm = -0.035;

  const lineWidth = (line: string, s: number) => {
    ctx.font = fontAt(s);
    let total = 0;
    for (const ch of line) total += ctx.measureText(ch).width + trackingEm * s;
    return total - trackingEm * s;
  };

  const pad = Math.max(w * 0.0125, 12);
  const lineHeight = 0.86;
  const widest = Math.max(...lines.map((l) => lineWidth(l, 100)));
  let size = ((w - pad * 2) / widest) * 100;
  size = Math.min(size, (h * 0.62) / (lines.length * lineHeight));

  const font = fontAt(size);
  ctx.font = font;
  const capH = ctx.measureText("E").actualBoundingBoxAscent || size * 0.72;
  const step = size * lineHeight;
  const blockH = capH + step * (lines.length - 1);
  const tracking = trackingEm * size;

  const glyphs: Glyph[] = [];
  let y = (h - blockH) / 2 + capH;
  for (const line of lines) {
    let x = (w - lineWidth(line, size)) / 2;
    for (const ch of line) {
      glyphs.push({ char: ch, x, y });
      x += ctx.measureText(ch).width + tracking;
    }
    y += step;
  }
  return { size, font, glyphs };
}

export function drawFlatText(canvas: HTMLCanvasElement, layout: Layout, cssW: number, cssH: number, scale: number) {
  canvas.width = Math.max(2, Math.round(cssW * scale));
  canvas.height = Math.max(2, Math.round(cssH * scale));
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.scale(scale, scale);
  ctx.fillStyle = "#fff";
  ctx.font = layout.font;
  ctx.textBaseline = "alphabetic";
  for (const g of layout.glyphs) ctx.fillText(g.char, g.x, g.y);
}
