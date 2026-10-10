/** Inflated "balloon" meshes for each glyph of the title. */
import * as THREE from "three";
import type { Glyph, Layout } from "./text";

export interface Letter {
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshPhysicalMaterial>;
  alphaTexture: THREE.CanvasTexture;
  baseX: number;
  baseY: number;
  cx: number; // centre in CSS px, for cursor proximity
  cy: number;
  phase: number;
  inflate: number;
  inflateVel: number;
  heat: number;
}

function boxBlur(src: Float32Array, w: number, h: number, r: number): Float32Array {
  if (r < 1) return src;
  const tmp = new Float32Array(src.length);
  const a = src;
  const b = tmp;
  const inv = 1 / (2 * r + 1);
  for (let pass = 0; pass < 3; pass++) {
    for (let y = 0; y < h; y++) {
      const row = y * w;
      let sum = 0;
      for (let x = -r; x <= r; x++) sum += a[row + Math.min(w - 1, Math.max(0, x))];
      for (let x = 0; x < w; x++) {
        b[row + x] = sum * inv;
        sum += a[row + Math.min(w - 1, x + r + 1)] - a[row + Math.max(0, x - r)];
      }
    }
    for (let x = 0; x < w; x++) {
      let sum = 0;
      for (let y = -r; y <= r; y++) sum += b[Math.min(h - 1, Math.max(0, y)) * w + x];
      for (let y = 0; y < h; y++) {
        a[y * w + x] = sum * inv;
        sum += b[Math.min(h - 1, y + r + 1) * w + x] - b[Math.max(0, y - r) * w + x];
      }
    }
  }
  return a;
}

// Felzenszwalb & Huttenlocher exact squared distance transform (1D pass).
function edt1d(f: Float64Array, n: number, d: Float64Array, v: Int32Array, z: Float64Array) {
  let k = 0;
  v[0] = 0;
  z[0] = -Infinity;
  z[1] = Infinity;
  for (let q = 1; q < n; q++) {
    let s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    while (s <= z[k]) {
      k--;
      s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    }
    k++;
    v[k] = q;
    z[k] = s;
    z[k + 1] = Infinity;
  }
  k = 0;
  for (let q = 0; q < n; q++) {
    while (z[k + 1] < q) k++;
    d[q] = (q - v[k]) * (q - v[k]) + f[v[k]];
  }
}

/** Distance (in samples) from every inside pixel to the nearest outside pixel. */
function insideDistance(mask: Float32Array, w: number, h: number): Float32Array {
  const INF = 1e20;
  const grid = new Float64Array(w * h);
  for (let i = 0; i < grid.length; i++) grid[i] = mask[i] >= 0.5 ? INF : 0;
  const n = Math.max(w, h);
  const f = new Float64Array(n);
  const d = new Float64Array(n);
  const v = new Int32Array(n);
  const z = new Float64Array(n + 1);
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) f[y] = grid[y * w + x];
    edt1d(f, h, d, v, z);
    for (let y = 0; y < h; y++) grid[y * w + x] = d[y];
  }
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) f[x] = grid[y * w + x];
    edt1d(f, w, d, v, z);
    for (let x = 0; x < w; x++) grid[y * w + x] = d[x];
  }
  const out = new Float32Array(w * h);
  for (let i = 0; i < out.length; i++) out[i] = Math.sqrt(grid[i]);
  return out;
}

/**
 * Builds an inflated "balloon" mesh for one glyph: a grid displaced by the
 * square root of the distance to the glyph outline, cut out with an alpha map.
 */
export function buildLetter(
  glyph: Glyph,
  layout: Layout,
  cssW: number,
  cssH: number,
  material: THREE.MeshPhysicalMaterial,
  index: number,
  rows = 150,
): Letter | null {
  const measure = document.createElement("canvas").getContext("2d")!;
  measure.font = layout.font;
  const m = measure.measureText(glyph.char);
  const size = layout.size;
  const pad = size * 0.06;

  const x0 = glyph.x - m.actualBoundingBoxLeft - pad;
  const x1 = glyph.x + m.actualBoundingBoxRight + pad;
  const y0 = glyph.y - m.actualBoundingBoxAscent - pad;
  const y1 = glyph.y + m.actualBoundingBoxDescent + pad;
  if (!(x1 > x0 && y1 > y0)) return null;

  // Sample spacing in CSS px: `rows` samples per letter height keeps the
  // surface smooth; phones pass fewer to cut build time and vertex count.
  const step = Math.max(1, (y1 - y0) / rows);
  const gw = Math.ceil((x1 - x0) / step) + 1;
  const gh = Math.ceil((y1 - y0) / step) + 1;

  const canvas = document.createElement("canvas");
  canvas.width = gw;
  canvas.height = gh;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, gw, gh);
  ctx.scale(1 / step, 1 / step);
  ctx.translate(-x0, -y0);
  ctx.fillStyle = "#fff";
  ctx.font = layout.font;
  ctx.textBaseline = "alphabetic";
  ctx.fillText(glyph.char, glyph.x, glyph.y);
  const pixels = ctx.getImageData(0, 0, gw, gh).data;

  const mask = new Float32Array(gw * gh);
  for (let i = 0; i < mask.length; i++) mask[i] = pixels[i * 4] / 255;

  const dist = insideDistance(mask, gw, gh);
  const puff = size * 0.14;
  const heights = new Float32Array(gw * gh);
  for (let i = 0; i < heights.length; i++) heights[i] = Math.sqrt(dist[i] * step * puff);
  const smoothR = Math.max(1, Math.round((size * 0.012) / step));
  boxBlur(heights, gw, gh, smoothR);
  const softMask = boxBlur(Float32Array.from(mask), gw, gh, smoothR);

  const geometry = new THREE.PlaneGeometry((gw - 1) * step, (gh - 1) * step, gw - 1, gh - 1);
  const pos = geometry.attributes.position as THREE.BufferAttribute;
  // PlaneGeometry rows run top to bottom, matching canvas rows.
  for (let i = 0; i < pos.count; i++) pos.setZ(i, heights[i]);
  geometry.computeVertexNormals();

  // Alpha map trims the grid to a slightly puffed glyph outline.
  const alphaCanvas = document.createElement("canvas");
  alphaCanvas.width = gw;
  alphaCanvas.height = gh;
  const actx = alphaCanvas.getContext("2d")!;
  const img = actx.createImageData(gw, gh);
  for (let i = 0; i < softMask.length; i++) {
    const a = Math.min(255, Math.round(softMask[i] * 1.5 * 255));
    img.data[i * 4] = a;
    img.data[i * 4 + 1] = a;
    img.data[i * 4 + 2] = a;
    img.data[i * 4 + 3] = 255;
  }
  actx.putImageData(img, 0, 0);
  const alphaTexture = new THREE.CanvasTexture(alphaCanvas);

  const mat = material.clone();
  mat.alphaMap = alphaTexture;
  const mesh = new THREE.Mesh(geometry, mat);

  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  const baseX = cx - cssW / 2;
  const baseY = cssH / 2 - cy;
  mesh.position.set(baseX, baseY, 0);

  return {
    mesh,
    alphaTexture,
    baseX,
    baseY,
    cx,
    cy,
    phase: index * 1.37,
    inflate: 0.55,
    inflateVel: 0,
    heat: 0,
  };
}
