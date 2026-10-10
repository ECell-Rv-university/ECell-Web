import { describe, expect, it } from "vitest";
import {
  TOUCHPAD_STICKY_MS,
  createWheelClassifier,
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

describe("createWheelClassifier", () => {
  const notch = wheel({ deltaY: 100, wheelDeltaY: -120 });
  const touchpad = wheel({ deltaY: 7.5, wheelDeltaY: -22 });

  it("classifies isolated mouse notches as notch", () => {
    const classify = createWheelClassifier();
    expect(classify(notch, 0)).toBe("notch");
    expect(classify(notch, 500)).toBe("notch");
  });

  it("classifies touchpad streams as touchpad", () => {
    const classify = createWheelClassifier();
    expect(classify(touchpad, 0)).toBe("touchpad");
  });

  it("keeps a notch-looking event inside a touchpad gesture as touchpad", () => {
    const classify = createWheelClassifier();
    classify(touchpad, 0);
    expect(classify(notch, 100)).toBe("touchpad");
  });

  it("returns to notch once the touchpad gesture has ended", () => {
    const classify = createWheelClassifier();
    classify(touchpad, 0);
    expect(classify(notch, TOUCHPAD_STICKY_MS + 1)).toBe("notch");
  });
});

describe("display scaling (Windows 125% / 150%)", () => {
  it("treats a 125%-scaled notch (wheelDelta 150) as one notch", () => {
    const e = wheel({ deltaY: 125, wheelDeltaY: -150 });
    expect(isWheelNotch(e, 1.25)).toBe(true);
    expect(normalizeWheelDelta(e, 125, 1.25)).toBe(WHEEL_NOTCH_PX);
  });

  it("scales multi-notch events at 125%", () => {
    const e = wheel({ deltaY: 250, wheelDeltaY: -300 });
    expect(normalizeWheelDelta(e, 250, 1.25)).toBe(WHEEL_NOTCH_PX * 2);
  });

  it("treats a 150%-scaled notch (wheelDelta 180) as one notch", () => {
    const e = wheel({ deltaY: 150, wheelDeltaY: -180 });
    expect(normalizeWheelDelta(e, 150, 1.5)).toBe(WHEEL_NOTCH_PX);
  });

  it("still passes scaled touchpad deltas through", () => {
    const e = wheel({ deltaY: 9.4, wheelDeltaY: -28 });
    expect(isWheelNotch(e, 1.25)).toBe(false);
    expect(normalizeWheelDelta(e, 9.4, 1.25)).toBe(9.4);
  });

  it("classifies scaled notches as notch", () => {
    const classify = createWheelClassifier();
    expect(classify(wheel({ deltaY: 125, wheelDeltaY: -150 }), 0, 1.25)).toBe("notch");
  });
});
