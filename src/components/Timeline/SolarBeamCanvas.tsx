"use client";

import { type MutableRefObject, useEffect, useRef } from "react";

export interface SolarBeamCanvasProps {
  /** Normalized beam reach [0..1] synchronized with milestone ignition. */
  progressRef: MutableRefObject<number>;
  /** Horizontal offset (in CSS px) from the left edge of the canvas to the Sun's center. */
  originOffsetPx?: number;
  className?: string;
}

const VERTEX = `#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const FRAGMENT = `#version 300 es
precision highp float;
out vec4 outColor;

uniform vec2 uResolution;
uniform vec2 uCanvasSize;
uniform float uTime;
uniform float uProgress;
uniform float uOriginX;
uniform vec3 uLens;

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

float sq(float x) {
  return x * x;
}

void main() {
  vec2 uv = gl_FragCoord.xy / max(uCanvasSize, vec2(1.0));
  vec2 frag = vec2(uv.x, 1.0 - uv.y) * uResolution;

  // Hard guarantee against any rectangular canvas boundary clipping
  float borderY = smoothstep(0.0, 0.34, uv.y) * smoothstep(1.0, 0.66, uv.y);
  float borderX = smoothstep(0.0, 0.05, uv.x) * smoothstep(1.0, 0.96, uv.x);
  float canvasMask = borderX * borderY;
  if (canvasMask <= 0.0001) {
    outColor = vec4(0.0);
    return;
  }

  float progress = clamp(uProgress, 0.0, 1.0);
  float beamOn = smoothstep(0.0, 0.008, progress);
  if (beamOn <= 0.0001) {
    outColor = vec4(0.0);
    return;
  }

  float t = uTime;
  // x is distance in CSS px from the Sun's center
  float x = frag.x - uOriginX;
  float y = frag.y - 0.5 * uResolution.y;
  float ay = abs(y);

  float maxReach = max(1.0, uResolution.x - uOriginX - 40.0);
  float tipX = progress * maxReach;

  // Smoothly emerge from the Sun's core (x = 0) and terminate at tipX
  float startMask = smoothstep(-8.0, 22.0, x);
  float dropMask = smoothstep(tipX + 8.0, tipX - 72.0, x);
  float activeMask = startMask * dropMask * beamOn;

  // LaserFlow-inspired tight exponential beam profile (zero muddy wide fog)
  float bw = 1.25;
  float breathe = 1.0 + 0.08 * sin(t * 2.1) + 0.06 * (noise(vec2(t * 0.7, 2.0)) - 0.5);

  // Travelling solar energy waves along the beam core
  float waveFast = noise(vec2(x * 0.024 - t * 4.2, y * 0.18));
  float waveSlow = noise(vec2(x * 0.011 - t * 2.1, y * 0.09 + 5.1));
  float energyFlow = 0.78 + 0.38 * waveFast + 0.24 * waveSlow;

  float beamCore = 18.0 * exp(-ay / (1.5 * bw));
  float beamWall = 4.2 * exp(-ay / (3.8 * bw)) * energyFlow * breathe;
  float beamHalo = 1.15 * exp(-ay / (9.5 * bw)) * (0.85 + 0.3 * waveSlow)
                 + 0.22 * exp(-ay / (20.0 * bw));

  // Sleek travelling laser filaments hugging the beam
  float threadOffset = y + 3.2 * sin(x * 0.018 - t * 3.4) * smoothstep(0.0, 90.0, x);
  float threadA = exp(-sq(threadOffset / 1.35)) * smoothstep(0.35, 0.85, waveFast) * 2.4;
  float threadOffsetB = y - 2.6 * cos(x * 0.022 - t * 2.8 + 1.7) * smoothstep(0.0, 90.0, x);
  float threadB = exp(-sq(threadOffsetB / 1.2)) * smoothstep(0.4, 0.88, waveSlow) * 1.8;

  // LaserFlow-style crisp twinkling photon glitter drifting rightward along the ray
  vec2 driftPos = vec2(x - t * 68.0, y);
  vec2 glitterCell = vec2(driftPos.x / 16.0, driftPos.y / 5.0);
  vec2 glitterId = floor(glitterCell);
  vec2 glitterJitter = vec2(hash(glitterId + 4.4), hash(glitterId + 2.9));
  vec2 glitterCenter = (glitterId + 0.18 + glitterJitter * 0.64) * vec2(16.0, 5.0);
  float glitterDist = length(driftPos - glitterCenter);
  float glitterOn = step(0.72, hash(glitterId + 6.6));
  float glitterTwinkle = 0.5 + 0.5 * sin(t * 6.5 + hash(glitterId + 1.1) * 6.283);
  float glitterZone = exp(-ay / (11.0 * bw)) * smoothstep(1.2, 3.8, ay / bw) * activeMask;
  float glitter = exp(-sq(glitterDist / 0.85)) * glitterOn * glitterTwinkle * glitterZone * 3.2;

  // Leading laser head flare at tipX
  float headActive = beamOn * smoothstep(0.005, 0.035, progress);
  float headAxial = exp(-sq((x - tipX) / 22.0)) * headActive;
  float headGlow = headAxial * (6.5 * exp(-ay / (2.4 * bw)) + 0.95 * exp(-ay / (11.0 * bw)));
  float headPoint = exp(-sq(length(vec2(x - tipX, y)) / 6.5)) * 4.5 * headActive;

  // Subtle Sun-rim ignition glow at x = 0 (tightly confined so it stays inside the Sun's corona)
  float originDist = length(vec2(x, y));
  float originGlow = exp(-sq(originDist / 26.0)) * 1.6 * beamOn;

  // Cursor lens boost
  float lensDist = length(frag - uLens.xy);
  float lensBoost = 1.0 + 0.35 * uLens.z * exp(-sq(lensDist / 72.0));

  // Clean solar-laser palette (pure white core -> warm gold plasma -> crisp amber)
  vec3 WHITE = vec3(1.0, 0.995, 0.96);
  vec3 BEAM = vec3(1.0, 0.78, 0.28);
  vec3 AMBER = vec3(0.98, 0.48, 0.10);

  vec3 col = vec3(0.0);
  col += (WHITE * beamCore + mix(BEAM, WHITE, 0.45) * (beamWall + threadA + threadB) + mix(AMBER, BEAM, 0.55) * beamHalo) * activeMask;
  col += mix(WHITE, BEAM, 0.3) * glitter;
  col += mix(WHITE, BEAM, 0.35) * headGlow + WHITE * headPoint;
  col += mix(BEAM, WHITE, 0.5) * originGlow;

  col *= lensBoost * canvasMask;

  // LaserFlow exponential tone mapping + clean alpha
  vec3 emit = 1.0 - exp(-col * 0.85);
  float alpha = clamp(max(emit.r, max(emit.g, emit.b)), 0.0, 1.0) * canvasMask;
  outColor = vec4(emit * alpha, alpha);
}
`;

const MAX_RENDER_DIM = 2048;

function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function SolarBeamCanvas({
  progressRef,
  originOffsetPx = 140,
  className = "",
}: SolarBeamCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: true,
      powerPreference: "high-performance",
    });
    if (!gl) return;

    const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      return;
    }

    const posLoc = gl.getAttribLocation(program, "aPosition");
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, "uResolution");
    const uCanvasSize = gl.getUniformLocation(program, "uCanvasSize");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uProgress = gl.getUniformLocation(program, "uProgress");
    const uOriginX = gl.getUniformLocation(program, "uOriginX");
    const uLens = gl.getUniformLocation(program, "uLens");

    let width = 1;
    let height = 1;
    let isVisible = true;
    let rafId = 0;
    let lastNow = performance.now();
    let elapsed = 0;
    const lens = { x: 0, y: 0, target: 0, current: 0 };

    const resize = () => {
      width = Math.max(1, container.clientWidth);
      height = Math.max(1, container.clientHeight);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const longest = Math.max(width, height) * dpr;
      const ratio =
        longest > MAX_RENDER_DIM ? (dpr * MAX_RENDER_DIM) / longest : dpr;
      const pw = Math.max(1, Math.round(width * ratio));
      const ph = Math.max(1, Math.round(height * ratio));
      if (canvas.width !== pw || canvas.height !== ph) {
        canvas.width = pw;
        canvas.height = ph;
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (
        e.clientY >= rect.top - 60 &&
        e.clientY <= rect.bottom + 60 &&
        e.clientX >= rect.left &&
        e.clientX <= rect.right
      ) {
        lens.x = e.clientX - rect.left;
        lens.y = e.clientY - rect.top;
        lens.target = 1;
      } else {
        lens.target = 0;
      }
    };

    const draw = (now: number) => {
      rafId = 0;
      const dt = Math.min((now - lastNow) / 1000, 0.05);
      lastNow = now;
      elapsed += dt;
      lens.current += (lens.target - lens.current) * Math.min(1, dt * 8);

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.bindVertexArray(vao);
      gl.uniform2f(uResolution, width, height);
      gl.uniform2f(uCanvasSize, canvas.width, canvas.height);
      gl.uniform1f(uTime, elapsed);
      gl.uniform1f(uProgress, progressRef.current);
      gl.uniform1f(uOriginX, originOffsetPx);
      gl.uniform3f(uLens, lens.x, lens.y, lens.current);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      if (isVisible && !document.hidden) {
        rafId = window.requestAnimationFrame(draw);
      }
    };

    const startLoop = () => {
      if (!rafId && isVisible && !document.hidden) {
        lastNow = performance.now();
        rafId = window.requestAnimationFrame(draw);
      }
    };

    const stopLoop = () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
        if (isVisible) startLoop();
        else stopLoop();
      },
      { threshold: 0.01 },
    );
    observer.observe(container);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const onVisibilityChange = () => {
      if (document.hidden) stopLoop();
      else startLoop();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    resize();
    startLoop();

    return () => {
      stopLoop();
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pointermove", onPointerMove);
      gl.deleteBuffer(buffer);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [originOffsetPx, progressRef]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none ${className}`.trim()}
    >
      <canvas
        ref={canvasRef}
        className="block size-full"
        style={{ mixBlendMode: "screen" }}
      />
    </div>
  );
}
