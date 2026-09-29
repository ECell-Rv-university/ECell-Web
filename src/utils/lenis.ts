import Lenis, { type LenisOptions, type VirtualScrollData } from "lenis";
import { gsap, ScrollTrigger } from "./gsapSetup";
import { createWheelClassifier, normalizeWheelDelta } from "./wheel";

const classifyWheel = createWheelClassifier();

const lenisOptions: LenisOptions = {
  lerp: 0.08,
  wheelMultiplier: 1,
  // Mouse-wheel notches are smoothed by Lenis with a platform-independent
  // distance. Touchpads already ship their own momentum, so layering Lenis on
  // top feels laggy and floaty: they are handed to native scrolling (see
  // virtualScroll below), which is 1:1 with the fingers on every OS.
  smoothWheel: true,
  syncTouch: false,
  // Let scrollable children (modals, horizontal carousels) consume the wheel
  // instead of Lenis scrolling the page underneath them.
  allowNestedScroll: true,
  virtualScroll: (data: VirtualScrollData) => {
    const { event } = data;
    if (event.type !== "wheel") return true;

    // Body scroll lock (entry loader, modals, lightbox): the page must stay
    // put. Lenis scrolls the window programmatically, which ignores
    // `overflow: hidden`, so bail out and let the browser do nothing.
    if (document.body.style.overflow === "hidden") return false;

    // Horizontal-dominant gestures (sideways touchpad swipes, shift+wheel
    // carousels) belong to the browser; don't hijack them.
    if (Math.abs(data.deltaX) > Math.abs(data.deltaY)) return false;

    // With smoothWheel off Lenis hands the event back to native scrolling (and
    // stops any in-flight smooth animation). The classifier is sticky per
    // gesture so this never flips mid-swipe.
    const kind = classifyWheel(event as WheelEvent, performance.now());
    if (sharedLenis) sharedLenis.options.smoothWheel = kind === "notch";
    if (kind === "touchpad") return true;

    data.deltaY = normalizeWheelDelta(event as WheelEvent, data.deltaY);
    data.deltaX = 0;
    return true;
  },
};

let sharedLenis: Lenis | null = null;
let tickerCallback: ((time: number) => void) | null = null;
let scrollCallback: (() => void) | null = null;
let consumerCount = 0;

/** The live shared Lenis instance, or null when smooth scroll is inactive. */
export function getLenis(): Lenis | null {
  return sharedLenis;
}

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

interface ProgrammaticScrollOptions {
  /** Jump instantly instead of animating. */
  immediate?: boolean;
  /** Extra pixels between the target and the top of the viewport. */
  offset?: number;
}

/**
 * Scroll the page to a Y position or element. Uses Lenis when it is active so
 * programmatic scrolls share the wheel's easing on every OS (native
 * `behavior: "smooth"` has a different duration/curve per browser and fights
 * Lenis' internal position), and falls back to the browser otherwise.
 */
export function scrollPageTo(
  target: number | HTMLElement,
  { immediate = false, offset = 0 }: ProgrammaticScrollOptions = {}
): void {
  if (sharedLenis) {
    sharedLenis.scrollTo(target, { immediate, offset });
    return;
  }

  const top =
    typeof target === "number"
      ? target
      : target.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: top + offset, behavior: immediate ? "instant" : "smooth" });
}
