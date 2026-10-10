"use client";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import "./HeroReveal.css";

const LINES_WIDE = ["ECELL RVU"];
const LINES_NARROW = ["ECELL", "RVU"];

const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const NOISE = /* glsl */ `
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p *= 2.03;
    a *= 0.5;
  }
  return v;
}
`;

// Ping-pong ink pass. R holds ink density, GB a velocity field. The pointer
// pushes ink along its direction of travel, so fast strokes fling streaks
// ahead of the cursor; curl noise drags the edges into fingers and drips.
const SIM_FRAG = /* glsl */ `
uniform sampler2D uPrev;
uniform vec2 uMouse;
uniform vec2 uPrevMouse;
uniform vec2 uMouseVel;
uniform vec2 uTexel;
uniform float uAspect;
uniform float uRadius;
uniform float uStrength;
uniform float uDecay;
uniform float uVelDecay;
uniform float uDt;
uniform float uTime;
varying vec2 vUv;
${NOISE}
float segDist(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0);
  return length(pa - ba * h);
}
void main() {
  vec2 asp = vec2(uAspect, 1.0);

  vec2 q = vUv * asp * 3.5 + vec2(uTime * 0.12, -uTime * 0.09);
  float e = 0.02;
  float n0 = noise(q);
  vec2 curl = vec2(noise(q + vec2(0.0, e)) - n0, -(noise(q + vec2(e, 0.0)) - n0)) / e;

  vec2 vel = texture2D(uPrev, vUv).gb;
  vec2 back = vUv - (vel + curl * 0.06) * uDt;
  vec4 s = texture2D(uPrev, back);
  float spread = 0.25 * (
    texture2D(uPrev, back + vec2(uTexel.x, 0.0)).r +
    texture2D(uPrev, back - vec2(uTexel.x, 0.0)).r +
    texture2D(uPrev, back + vec2(0.0, uTexel.y)).r +
    texture2D(uPrev, back - vec2(0.0, uTexel.y)).r
  );
  float ink = mix(s.r, max(s.r, spread), 0.5) * uDecay;
  vec2 v = s.gb * uVelDecay;

  float d = segDist(vUv * asp, uPrevMouse * asp, uMouse * asp);
  float wob = noise(vUv * asp * 5.0 + uTime * 0.6);
  float r = uRadius * (0.6 + 0.8 * wob);
  float stamp = exp(-pow(d / r, 2.0) * 2.0);

  ink = clamp(ink + stamp * uStrength * (1.0 - ink), 0.0, 1.0);
  v = mix(v, uMouseVel, clamp(stamp * 0.6, 0.0, 1.0));

  gl_FragColor = vec4(ink, v, 1.0);
}
`;

// Flat text everywhere, the rendered 3D scene inside the liquid mask.
const FINAL_FRAG = /* glsl */ `
uniform sampler2D uText;
uniform sampler2D uScene;
uniform sampler2D uMask;
uniform float uTime;
uniform float uAspect;
varying vec2 vUv;
${NOISE}

vec3 aces(vec3 x) {
  return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}
vec3 toSRGB(vec3 c) {
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
}

void main() {
  float textA = texture2D(uText, vUv).r;
  vec3 base = vec3(1.0 - textA);

  float m = texture2D(uMask, vUv).r;
  // Domain-warped noise breaks the ink edge into fingers and stray droplets.
  vec2 p = vec2(vUv.x * uAspect, vUv.y);
  vec2 warp = vec2(fbm(p * 3.0 + uTime * 0.035), fbm(p * 3.0 + 5.2 - uTime * 0.03));
  float n = fbm(p * 4.0 + warp * 1.6);
  float fine = noise(p * 18.0 + warp * 3.0);
  float field = m + (n - 0.5) * 0.5 + (fine - 0.5) * 0.05;
  float aa = fwidth(field) * 0.75 + 1e-4;
  float reveal = smoothstep(0.42 - aa, 0.42 + aa, field);

  // Treat the ink as a thick liquid: it bulges up from its edge, so the rim
  // tilts outward, catches a highlight and bends the letters seen through it.
  float depth = smoothstep(0.42, 0.62, field);
  float steep = 1.0 - depth;
  vec2 g = vec2(dFdx(depth), dFdy(depth));
  vec2 dir = g / (length(g) + 1e-5);
  vec3 nrm = normalize(vec3(-dir * steep * 1.6, 1.0));
  vec3 light = normalize(vec3(-0.45, 0.6, 0.65));
  vec3 halfV = normalize(light + vec3(0.0, 0.0, 1.0));
  float spec = pow(max(dot(nrm, halfV), 0.0), 70.0) * steep;
  float rim = pow(steep, 3.0) * 0.06;

  vec2 refractUv = vUv + nrm.xy * 0.018 * steep;
  vec3 inner = toSRGB(aces(texture2D(uScene, refractUv).rgb));
  inner += vec3(spec * 0.85 + rim);
  gl_FragColor = vec4(mix(base, inner, reveal), 1.0);
}
`;

interface Glyph {
  char: string;
  x: number; // left of the advance box, CSS px
  y: number; // baseline, CSS px
}

interface Layout {
  size: number;
  font: string;
  glyphs: Glyph[];
}

interface Letter {
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

function layoutText(w: number, h: number, family: string): Layout {
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

function drawFlatText(canvas: HTMLCanvasElement, layout: Layout, cssW: number, cssH: number, scale: number) {
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

/**
 * Builds an inflated "balloon" mesh for one glyph: a grid displaced by the
 * square root of the distance to the glyph outline, cut out with an alpha map.
 */
function buildLetter(
  glyph: Glyph,
  layout: Layout,
  cssW: number,
  cssH: number,
  material: THREE.MeshPhysicalMaterial,
  index: number,
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

  // Sample spacing in CSS px: ~200 rows per letter keeps the surface smooth.
  const step = Math.max(1, (y1 - y0) / 150);
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

export default function HeroReveal(): React.ReactElement {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: "high-performance" });
    } catch {
      host.classList.add("hero-reveal--fallback");
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(dpr);
    renderer.domElement.className = "hero-reveal__canvas";
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);

    const quadCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const quad = new THREE.PlaneGeometry(2, 2);

    // --- 3D balloon letters ---
    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const envTexture = pmrem.fromScene(room, 0.04).texture;
    room.dispose();
    pmrem.dispose();
    scene.environment = envTexture;
    scene.environmentIntensity = 1.1;

    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(-0.6, 0.9, 1);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xffffff, 1.2);
    rim.position.set(1, -0.4, 0.6);
    scene.add(rim);

    const letterMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x151515,
      metalness: 1,
      roughness: 0.22,
      alphaTest: 0.5,
      side: THREE.DoubleSide,
    });

    const camera = new THREE.PerspectiveCamera(30, 1, 1, 20000);
    const letterGroup = new THREE.Group();
    scene.add(letterGroup);
    let letters: Letter[] = [];
    let layoutSize = 100;

    const disposeLetters = () => {
      for (const l of letters) {
        letterGroup.remove(l.mesh);
        l.mesh.geometry.dispose();
        l.mesh.material.dispose();
        l.alphaTexture.dispose();
      }
      letters = [];
    };

    // --- Render targets ---
    const rtOpts = {
      type: THREE.HalfFloatType,
      format: THREE.RGBAFormat,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: false,
    };
    let simA = new THREE.WebGLRenderTarget(1, 1, rtOpts);
    let simB = new THREE.WebGLRenderTarget(1, 1, rtOpts);
    const sceneRT = new THREE.WebGLRenderTarget(1, 1, {
      type: THREE.HalfFloatType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: true,
      samples: 2,
    });

    const textCanvas = document.createElement("canvas");
    const textTexture = new THREE.CanvasTexture(textCanvas);
    textTexture.minFilter = THREE.LinearFilter;
    textTexture.generateMipmaps = false;

    const simMaterial = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: SIM_FRAG,
      uniforms: {
        uPrev: { value: null },
        uMouse: { value: new THREE.Vector2(-10, -10) },
        uPrevMouse: { value: new THREE.Vector2(-10, -10) },
        uAspect: { value: 1 },
        uMouseVel: { value: new THREE.Vector2() },
        uTexel: { value: new THREE.Vector2(1, 1) },
        uRadius: { value: 0.1 },
        uStrength: { value: 0 },
        uDecay: { value: 0.97 },
        uVelDecay: { value: 0.93 },
        uDt: { value: 1 / 60 },
        uTime: { value: 0 },
      },
    });
    const finalMaterial = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FINAL_FRAG,
      uniforms: {
        uText: { value: textTexture },
        uScene: { value: sceneRT.texture },
        uMask: { value: null },
        uTime: { value: 0 },
        uAspect: { value: 1 },
      },
    });
    const simScene = new THREE.Scene();
    simScene.add(new THREE.Mesh(quad, simMaterial));
    const finalScene = new THREE.Scene();
    finalScene.add(new THREE.Mesh(quad, finalMaterial));

    let fontFamily = getComputedStyle(host).getPropertyValue("--font-archivo").trim() || "Archivo";
    let cssW = 0;
    let cssH = 0;

    const buildText = () => {
      if (!cssW || !cssH) return;
      const layout = layoutText(cssW, cssH, fontFamily);
      layoutSize = layout.size;
      drawFlatText(textCanvas, layout, cssW, cssH, Math.min(dpr, 2560 / cssW));
      textTexture.needsUpdate = true;

      disposeLetters();
      layout.glyphs.forEach((g, i) => {
        if (g.char.trim() === "") return;
        const letter = buildLetter(g, layout, cssW, cssH, letterMaterial, i);
        if (letter) {
          letters.push(letter);
          letterGroup.add(letter.mesh);
        }
      });
    };

    const resize = () => {
      // offsetWidth ignores the scroll scale transform on the wrapper.
      const w = host.offsetWidth;
      const h = host.offsetHeight;
      if (!w || !h || (w === cssW && h === cssH)) return;
      cssW = w;
      cssH = h;
      renderer.setSize(w, h, false);
      sceneRT.setSize(Math.round(w * dpr), Math.round(h * dpr));
      const sw = Math.max(2, Math.round(w / 2));
      const sh = Math.max(2, Math.round(h / 2));
      simA.setSize(sw, sh);
      simB.setSize(sw, sh);
      simMaterial.uniforms.uTexel.value.set(1 / sw, 1 / sh);
      dirty = true;
      renderer.setClearColor(0x000000, 1);
      renderer.setRenderTarget(simA);
      renderer.clear();
      renderer.setRenderTarget(simB);
      renderer.clear();
      renderer.setRenderTarget(null);

      // World units are CSS pixels at z = 0, so meshes line up with the flat text.
      camera.aspect = w / h;
      camera.position.set(0, 0, h / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
      camera.near = camera.position.z * 0.1;
      camera.far = camera.position.z * 4;
      camera.updateProjectionMatrix();

      simMaterial.uniforms.uAspect.value = w / h;
      finalMaterial.uniforms.uAspect.value = w / h;
      buildText();
    };

    // Pointer state in UV space of the canvas (accounts for the scroll scale).
    const pointer = new THREE.Vector2(-10, -10);
    const smoothed = new THREE.Vector2(-10, -10);
    const lastStamp = new THREE.Vector2(-10, -10);
    const tilt = new THREE.Vector2();
    const tiltTarget = new THREE.Vector2();
    const wander = new THREE.Vector2();
    const rawVel = new THREE.Vector2();
    const vel = new THREE.Vector2();
    let hasPointer = false;
    // Once the ink has fully faded there is nothing to draw, so the loop idles.
    let quiet = 0;
    let dirty = true;

    const onPointerMove = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      pointer.set((e.clientX - rect.left) / rect.width, 1 - (e.clientY - rect.top) / rect.height);
      if (!hasPointer) {
        smoothed.copy(pointer);
        lastStamp.copy(pointer);
        hasPointer = true;
      }
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(host);

    let resizeTimer = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, cssW ? 150 : 0);
    });
    ro.observe(host);
    resize();

    let disposed = false;
    document.fonts?.load(`900 100px ${fontFamily}`).then(() => {
      if (disposed) return;
      fontFamily = getComputedStyle(host).getPropertyValue("--font-archivo").trim() || fontFamily;
      buildText();
      dirty = true;
    }).catch(() => {});

    const timer = new THREE.Timer();
    let raf = 0;
    const tick = (timestamp: number) => {
      raf = requestAnimationFrame(tick);
      timer.update(timestamp);
      if (!visible || document.hidden) return;
      const dt = Math.min(timer.getDelta(), 1 / 20);
      const t = timer.getElapsed();

      // Touch screens have no hover, so a blob wanders there instead.
      let target = pointer;
      if (coarse && !reduceMotion) {
        target = wander.set(
          0.5 + Math.sin(t * 0.43) * 0.32 + Math.sin(t * 0.17) * 0.08,
          0.5 + Math.sin(t * 0.61 + 1.3) * 0.22,
        );
        if (!hasPointer) {
          smoothed.copy(target);
          lastStamp.copy(target);
          hasPointer = true;
        }
      }

      smoothed.lerp(target, 1 - Math.pow(0.00001, dt));
      const aspect = simMaterial.uniforms.uAspect.value as number;
      // Ink only flows while the pointer moves: a resting cursor lets it fade.
      rawVel.copy(smoothed).sub(lastStamp).divideScalar(Math.max(dt, 1e-3)).clampLength(0, 8);
      vel.lerp(rawVel, 1 - Math.pow(0.0005, dt));
      const speed = Math.hypot(vel.x * aspect, vel.y);
      const flow = THREE.MathUtils.smoothstep(speed, 0.03, 1.0);
      const active = hasPointer;

      quiet = flow > 0.01 ? 0 : quiet + dt;
      if (quiet > 4 && !dirty) {
        lastStamp.copy(smoothed);
        return;
      }
      dirty = false;

      // Mask simulation
      simMaterial.uniforms.uPrev.value = simA.texture;
      simMaterial.uniforms.uPrevMouse.value.copy(lastStamp);
      simMaterial.uniforms.uMouse.value.copy(smoothed);
      simMaterial.uniforms.uMouseVel.value.copy(vel).multiplyScalar(0.45);
      simMaterial.uniforms.uRadius.value = 0.07 + Math.min(speed * 0.06, 0.15);
      simMaterial.uniforms.uStrength.value = active ? flow * Math.min(dt * 60, 1.5) * 0.5 : 0;
      simMaterial.uniforms.uDecay.value = Math.pow(0.982, dt * 60);
      simMaterial.uniforms.uVelDecay.value = Math.pow(0.93, dt * 60);
      simMaterial.uniforms.uDt.value = dt;
      simMaterial.uniforms.uTime.value = t;
      renderer.setRenderTarget(simB);
      renderer.render(simScene, quadCamera);
      [simA, simB] = [simB, simA];
      lastStamp.copy(smoothed);

      // Balloon letters: tilt toward the cursor, puff up as it passes.
      const motion = reduceMotion ? 0 : 1;
      tilt.lerp(tiltTarget.set(smoothed.x - 0.5, smoothed.y - 0.5), 1 - Math.pow(0.02, dt));
      letterGroup.rotation.y = tilt.x * 0.35 * motion;
      letterGroup.rotation.x = -tilt.y * 0.3 * motion;

      const px = smoothed.x * cssW;
      const py = (1 - smoothed.y) * cssH;
      for (const l of letters) {
        const near = flow > 0.05 && Math.hypot(px - l.cx, py - l.cy) < layoutSize * 0.85 ? 1 : 0;
        l.heat = Math.max(l.heat * Math.pow(0.975, dt * 60), near);
        const targetInflate = 0.55 + 0.45 * l.heat;
        // Under-damped spring so letters overshoot and wobble like balloons.
        l.inflateVel += ((targetInflate - l.inflate) * 90 - l.inflateVel * 9) * dt;
        l.inflate += l.inflateVel * dt;

        const p = l.phase;
        const swell = 1 + (l.inflate - 0.55) * 0.06;
        l.mesh.scale.set(swell, swell, Math.max(0.05, l.inflate));
        l.mesh.position.set(
          l.baseX,
          l.baseY + Math.sin(t * 1.1 + p) * layoutSize * 0.015 * motion,
          Math.sin(t * 0.8 + p) * layoutSize * 0.04 * motion,
        );
        l.mesh.rotation.set(
          Math.sin(t * 0.9 + p) * 0.08 * motion,
          Math.sin(t * 0.7 + p * 1.7) * 0.12 * motion,
          Math.sin(t * 0.6 + p * 0.6) * 0.04 * motion,
        );
      }

      renderer.setRenderTarget(sceneRT);
      renderer.setClearColor(0x000000, 1);
      renderer.clear();
      renderer.render(scene, camera);
      renderer.setRenderTarget(null);

      finalMaterial.uniforms.uMask.value = simA.texture;
      finalMaterial.uniforms.uTime.value = t;
      renderer.render(finalScene, quadCamera);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerMove);
      io.disconnect();
      ro.disconnect();
      disposeLetters();
      letterMaterial.dispose();
      envTexture.dispose();
      simA.dispose();
      simB.dispose();
      sceneRT.dispose();
      textTexture.dispose();
      simMaterial.dispose();
      finalMaterial.dispose();
      quad.dispose();
      renderer.dispose();
      timer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div ref={hostRef} className="hero-reveal">
      <span className="hero-reveal__fallback" aria-hidden="true">
        ECELL RVU
      </span>
    </div>
  );
}
