import { describe, expect, it } from "vitest";
import { clamp, degToRad, frameLerp, lerp, mapRange, normalize, radToDeg, smoothstep } from "@/src/utils/math";

describe("math utilities", () => {
  it("clamps values below, within, and above the range", () => {
    expect(clamp(-1)).toBe(0);
    expect(clamp(0.5)).toBe(0.5);
    expect(clamp(2)).toBe(1);
    expect(clamp(12, 10, 20)).toBe(12);
  });

  it("interpolates and maps ranges", () => {
    expect(lerp(0, 100, 0.25)).toBe(25);
    expect(mapRange(5, 0, 10, 100, 200)).toBe(150);
    expect(normalize(25, 0, 100)).toBe(0.25);
    expect(smoothstep(0, 10, 0)).toBe(0);
    expect(smoothstep(0, 10, 5)).toBe(0.5);
    expect(smoothstep(0, 10, 10)).toBe(1);
  });

  it("converts between degrees and radians", () => {
    expect(degToRad(180)).toBeCloseTo(Math.PI);
    expect(radToDeg(Math.PI / 2)).toBeCloseTo(90);
  });

  it("preserves the documented edge behavior for invalid ranges", () => {
    expect(normalize(1, 1, 1)).toBeNaN();
    expect(mapRange(1, 1, 1, 0, 10)).toBeNaN();
  });

  it("frameLerp matches a plain lerp for one 60fps frame", () => {
    expect(frameLerp(0.1, 1)).toBeCloseTo(0.1);
    expect(frameLerp(0.1, 0)).toBe(0);
  });

  it("frameLerp converges at the same speed at 60Hz and 144Hz", () => {
    // Smooth toward 1 for one second at each refresh rate.
    const run = (hz: number) => {
      let v = 0;
      for (let i = 0; i < hz; i++) v = lerp(v, 1, frameLerp(0.1, 60 / hz));
      return v;
    };
    expect(run(144)).toBeCloseTo(run(60), 6);
  });
});
