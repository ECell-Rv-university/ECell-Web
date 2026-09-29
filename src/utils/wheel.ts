// Wheel input differs wildly between platforms and devices:
//   - Chrome/Edge on Windows: ~100px per mouse-wheel notch (pixel mode)
//   - Chrome on Linux: 53px or 100px per notch depending on version
//   - Firefox on Windows/Linux: 3 "lines" per notch (line mode)
//   - macOS mice/trackpads: many small, acceleration-scaled pixel deltas
// Feeding those raw numbers to a smooth-scroll engine makes the same physical
// gesture travel a different distance on every OS. These helpers collapse them
// into one consistent scale before Lenis sees them.

/** Distance one discrete mouse-wheel notch scrolls, on every platform. */
export const WHEEL_NOTCH_PX = 75;
/** How long a gesture stays "touchpad" after its last non-notch event. */
export const TOUCHPAD_STICKY_MS = 350;

/**
 * Stateful mouse-vs-touchpad classifier. A touchpad gesture is a dense stream
 * of events whose deltas are arbitrary, and its momentum tail can contain
 * values that look like notches, so once any event looks like a touchpad the
 * whole gesture (and its tail) stays touchpad. This stops the classification
 * flipping mid-gesture, which made Windows precision touchpads feel erratic.
 */
export function createWheelClassifier() {
  let lastTouchpadAt = -Infinity;
  return function classify(event: WheelLike, now: number): "notch" | "touchpad" {
    if (!isWheelNotch(event)) {
      lastTouchpadAt = now;
      return "touchpad";
    }
    return now - lastTouchpadAt < TOUCHPAD_STICKY_MS ? "touchpad" : "notch";
  };
}

/** Ceiling for a single wheel event so fast flings can't jump the page. */
export const MAX_WHEEL_DELTA_PX = 240;

const DOM_DELTA_PIXEL = 0;
// Chromium/Safari expose the legacy wheelDelta in units of 120 per notch.
const LEGACY_NOTCH = 120;

export interface WheelLike {
  deltaX: number;
  deltaY: number;
  deltaMode: number;
  wheelDeltaY?: number;
}

/**
 * True when the event is one discrete notch of a physical mouse wheel rather
 * than a slice of a touchpad / high-resolution scroll stream.
 */
export function isWheelNotch(event: WheelLike): boolean {
  // Line/page mode is only ever produced by discrete wheels (Firefox).
  if (event.deltaMode !== DOM_DELTA_PIXEL) return true;
  if (event.deltaX !== 0) return false;

  const legacy = event.wheelDeltaY;
  if (typeof legacy !== "number" || legacy === 0) return false;
  return Math.abs(legacy) % LEGACY_NOTCH === 0 && Math.abs(event.deltaY) >= 50;
}

/**
 * Converts a wheel event's vertical delta (already expressed in pixels by
 * Lenis) into the platform-independent delta the smooth scroller should use.
 */
export function normalizeWheelDelta(event: WheelLike, pixelDeltaY: number): number {
  if (pixelDeltaY === 0) return 0;
  const sign = Math.sign(pixelDeltaY);

  if (isWheelNotch(event)) {
    // Keep multi-notch events (wheelDelta 240, 360, ...) proportional.
    const legacy = event.wheelDeltaY;
    const notches =
      event.deltaMode === DOM_DELTA_PIXEL && typeof legacy === "number"
        ? Math.max(1, Math.round(Math.abs(legacy) / LEGACY_NOTCH))
        : 1;
    return sign * Math.min(WHEEL_NOTCH_PX * notches, MAX_WHEEL_DELTA_PX);
  }

  return sign * Math.min(Math.abs(pixelDeltaY), MAX_WHEEL_DELTA_PX);
}
