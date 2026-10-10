// src/utils/math.ts

/**
 * Clamps a number between min and max.
 */
export function clamp(value: number, min = 0, max = 1): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation.
 * Example:
 * lerp(0, 100, 0.5) -> 50
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Makes a per-frame lerp amount frame-rate independent.
 *
 * `lerp(a, b, 0.1)` once per frame converges 2.4x faster on a 144Hz display
 * than on a 60Hz one. Pass the amount tuned at 60fps plus how many 60fps
 * frames actually elapsed (e.g. `gsap.ticker.deltaRatio(60)`) and the motion
 * takes the same time on every refresh rate.
 *
 * frameLerp(0.1, 1)   -> 0.1     (exactly one 60fps frame)
 * frameLerp(0.1, 0.5) -> ~0.0513 (half a frame, e.g. 120Hz)
 */
export function frameLerp(t: number, deltaRatio: number): number {
  return 1 - Math.pow(1 - clamp(t), Math.max(0, deltaRatio));
}

/**
 * Smoothstep interpolation.
 * Produces a smooth ease-in/ease-out transition.
 */
export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

/**
 * Maps a value from one range to another.
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return (
    outMin +
    ((value - inMin) * (outMax - outMin)) /
      (inMax - inMin)
  );
}

/**
 * Normalize a value to 0-1.
 */
export function normalize(value: number, min: number, max: number): number {
  return (value - min) / (max - min);
}

/**
 * Degrees → Radians.
 */
export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Radians → Degrees.
 */
export function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}
