import { describe, expect, it } from "vitest";
import {
  MAX_WHEEL_DELTA_PX,
  WHEEL_NOTCH_PX,
  isWheelNotch,
  normalizeWheelDelta,
} from "@/src/utils/wheel";

const wheel = (overrides: Partial<Parameters<typeof normalizeWheelDelta>[0]>) => ({
  deltaX: 0,
  deltaY: 0,
  deltaMode: 0,
  ...overrides,
});

describe("normalizeWheelDelta", () => {
  it("maps a Windows Chrome notch (100px) to one notch", () => {
    const e = wheel({ deltaY: 100, wheelDeltaY: -120 });
    expect(normalizeWheelDelta(e, 100)).toBe(WHEEL_NOTCH_PX);
  });

  it("maps a Linux Chrome notch (53px) to the same distance as Windows", () => {
    const e = wheel({ deltaY: 53, wheelDeltaY: -120 });
    expect(normalizeWheelDelta(e, 53)).toBe(WHEEL_NOTCH_PX);
  });

  it("maps a Firefox line-mode notch (3 lines = 50px) to the same distance", () => {
    const e = wheel({ deltaY: 3, deltaMode: 1 });
    expect(normalizeWheelDelta(e, 50)).toBe(WHEEL_NOTCH_PX);
  });

  it("keeps scroll direction", () => {
    const e = wheel({ deltaY: -100, wheelDeltaY: 120 });
    expect(normalizeWheelDelta(e, -100)).toBe(-WHEEL_NOTCH_PX);
  });

  it("scales multi-notch events proportionally", () => {
    const e = wheel({ deltaY: 200, wheelDeltaY: -240 });
    expect(normalizeWheelDelta(e, 200)).toBe(WHEEL_NOTCH_PX * 2);
  });

  it("passes small touchpad deltas through untouched", () => {
    const e = wheel({ deltaY: 7.5, wheelDeltaY: -22 });
    expect(isWheelNotch(e)).toBe(false);
    expect(normalizeWheelDelta(e, 7.5)).toBe(7.5);
  });

  it("does not treat diagonal touchpad swipes as notches", () => {
    const e = wheel({ deltaX: 4, deltaY: 120, wheelDeltaY: -360 });
    expect(isWheelNotch(e)).toBe(false);
  });

  it("caps runaway single-event deltas", () => {
    const e = wheel({ deltaY: 900 });
    expect(normalizeWheelDelta(e, 900)).toBe(MAX_WHEEL_DELTA_PX);
  });

  it("returns 0 for no movement", () => {
    expect(normalizeWheelDelta(wheel({}), 0)).toBe(0);
  });
});
