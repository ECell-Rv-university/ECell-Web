import Lenis, { type LenisOptions, type VirtualScrollData } from "lenis";
import { gsap, ScrollTrigger } from "./gsapSetup";

// Touchpads emit a dense stream of small wheel deltas and already apply their
// own momentum, so layering Lenis' lerp on top makes scrolling feel laggy and
// floaty, and hijacking diagonal swipes blocks horizontal scrolling. Mouse
// wheels send coarse notches (>= ~50px, or line/page deltaMode), which is what
// the smoothing is meant for.
const TRACKPAD_MAX_DELTA = 40;
// Keep a gesture classified as touchpad through its momentum tail, which can
// contain larger deltas during a fast fling.
const TRACKPAD_STICKY_MS = 300;
let lastTrackpadWheelAt = -Infinity;

function isTrackpadWheel(event: WheelEvent): boolean {
  if (event.deltaMode !== WheelEvent.DOM_DELTA_PIXEL) return false;

  const now = performance.now();
  const looksLikeTrackpad =
    event.deltaX !== 0 || Math.abs(event.deltaY) < TRACKPAD_MAX_DELTA;

  if (looksLikeTrackpad || now - lastTrackpadWheelAt < TRACKPAD_STICKY_MS) {
    lastTrackpadWheelAt = now;
    return true;
  }
  return false;
}

const lenisOptions: LenisOptions = {
  lerp: 0.08,
  wheelMultiplier: 0.75,
  smoothWheel: true,
  syncTouch: false,
  // Let scrollable children (modals, horizontal carousels) consume the wheel
  // instead of Lenis scrolling the page underneath them.
  allowNestedScroll: true,
  virtualScroll: ({ event }: VirtualScrollData) => {
    if (sharedLenis && event.type === "wheel") {
      // With smoothWheel off Lenis hands the event back to native scrolling
      // (and stops any in-flight smooth animation), so touchpads scroll 1:1.
      sharedLenis.options.smoothWheel = !isTrackpadWheel(event as WheelEvent);
    }
    return true;
  },
};

let sharedLenis: Lenis | null = null;
let tickerCallback: ((time: number) => void) | null = null;
let scrollCallback: (() => void) | null = null;
let consumerCount = 0;

/**
 * Acquire the app-wide Lenis instance. The instance and its GSAP ticker loop
 * are shared so mounting multiple smooth-scroll consumers can never create
 * competing Lenis instances or desynchronized animation loops.
 */
export function acquireLenis(): {
  instance: Lenis;
  release: () => void;
} {
  if (!sharedLenis) {
    sharedLenis = new Lenis(lenisOptions);

    // Keep GSAP ScrollTrigger in lockstep with Lenis smooth scroll
    scrollCallback = () => {
      ScrollTrigger.update();
    };
    sharedLenis.on("scroll", scrollCallback);

    // Drive Lenis RAF loop from GSAP's unified ticker
    tickerCallback = (time: number) => {
      sharedLenis?.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);
  }

  consumerCount += 1;

  let released = false;

  return {
    instance: sharedLenis,
    release: () => {
      if (released) return;
      released = true;
      consumerCount = Math.max(0, consumerCount - 1);

      if (consumerCount === 0) {
        if (tickerCallback) {
          gsap.ticker.remove(tickerCallback);
          tickerCallback = null;
        }

        if (sharedLenis) {
          if (scrollCallback) {
            sharedLenis.off("scroll", scrollCallback);
            scrollCallback = null;
          }
          sharedLenis.destroy();
          sharedLenis = null;
        }
      }
    },
  };
}

