import Lenis, { type LenisOptions, type VirtualScrollData } from "lenis";
import { gsap, ScrollTrigger } from "./gsapSetup";
import { createWheelClassifier, normalizeWheelDelta } from "./wheel";

/**
 * Single source of truth for page scrolling.
 *
 * Every programmatic scroll in the app must go through the helpers exported
 * here. Mixing `window.scrollTo`/`scrollIntoView` with Lenis makes the two
 * disagree about where the page is: Lenis keeps interpolating toward its own
 * `targetScroll` and drags the viewport back, which is what produces the
 * "it jumps then drifts" and "sometimes smooth, sometimes not" behaviour.
 */

const lenisOptions = {
  lerp: 0.09,
  wheelMultiplier: 0.9,
const classifyWheel = createWheelClassifier();

const lenisOptions: LenisOptions = {
  lerp: 0.08,
  wheelMultiplier: 1,
  // Mouse-wheel notches are smoothed by Lenis with a platform-independent
  // distance. Touchpads already ship their own momentum, so layering Lenis on
  // top feels laggy and floaty: they are handed to native scrolling (see
  // virtualScroll below), which is 1:1 with the fingers on every OS.
  smoothWheel: true,
  // Touch devices keep their native momentum scrolling — emulating it feels
  // worse than the real thing and fights the browser's overscroll gestures.
  syncTouch: false,
  // The GSAP ticker drives the loop (see below), so Lenis must not run its own.
  autoRaf: false,
  // Inner scrollers (chat transcript, team strip, dropdowns) keep working.
  allowNestedScroll: true,
  stopInertiaOnNavigate: true,
  // `respectReducedMotion` defaults to true: Lenis disables smoothing and makes
  // programmatic scrolls instant when the user asks for reduced motion.
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

export interface ScrollToOptions {
  /** Jump instead of animating. */
  immediate?: boolean;
  /** Animation length in seconds. */
  duration?: number;
  /** Pixels added to the resolved target. */
  offset?: number;
  /** Scroll even while smooth scrolling is paused by a scroll lock. */
  force?: boolean;
}

let sharedLenis: Lenis | null = null;
let tickerCallback: ((time: number) => void) | null = null;
let scrollCallback: (() => void) | null = null;
let refreshInitCallback: (() => void) | null = null;
let consumerCount = 0;

/** The live shared Lenis instance, or null when smooth scroll is inactive. */
export function getLenis(): Lenis | null {
  return sharedLenis;
}

/**
 * Acquire the app-wide Lenis instance. The instance and its GSAP ticker loop
 * are shared so mounting multiple smooth-scroll consumers can never create
 * competing Lenis instances or desynchronized animation loops.
 *
 * `SmoothScrollProvider` holds a handle for the whole session, so the instance
 * exists on every route rather than only on the ones that animate.
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

    // Pinned triggers change document height, so Lenis has to re-measure
    // before ScrollTrigger recalculates start/end positions from it.
    refreshInitCallback = () => {
      sharedLenis?.resize();
    };
    ScrollTrigger.addEventListener("refreshInit", refreshInitCallback);

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

        if (refreshInitCallback) {
          ScrollTrigger.removeEventListener("refreshInit", refreshInitCallback);
          refreshInitCallback = null;
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

/** The live instance, or `null` before the provider mounts / after teardown. */
export function getLenis(): Lenis | null {
  return sharedLenis;
}

/**
 * Scroll to an absolute document offset. Falls back to native scrolling when
 * Lenis is not mounted yet (server render, very early effects, tests).
 */
export function scrollToY(top: number, options: ScrollToOptions = {}): void {
  if (typeof window === "undefined") return;

  const { immediate = false, duration, offset = 0, force = false } = options;
  const target = Math.max(0, top + offset);

  if (sharedLenis) {
    sharedLenis.scrollTo(target, { immediate, duration, force });
    return;
  }

  window.scrollTo({
    top: target,
    left: 0,
    behavior: (immediate ? "instant" : "smooth") as ScrollBehavior,
  });
}

/**
 * Scroll an element into view from the top of the viewport. Accepts an element
 * or a CSS selector (e.g. `"#events"`).
 */
export function scrollToElement(
  target: HTMLElement | string,
  options: ScrollToOptions = {},
): void {
  if (typeof window === "undefined") return;

  const element =
    typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (!element) return;

  const { immediate = false, duration, offset = 0, force = false } = options;

  if (sharedLenis) {
    sharedLenis.scrollTo(element, { immediate, duration, offset, force });
    return;
  }

  const top = element.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({
    top: Math.max(0, top),
    left: 0,
    behavior: (immediate ? "instant" : "smooth") as ScrollBehavior,
  });
}

/**
 * Hard reset to the top of the document, used on route changes. `force` is set
 * so the reset still lands while an entry loader holds a scroll lock.
 */
export function resetScrollToTop(): void {
  if (typeof window === "undefined") return;

  window.scrollTo(0, 0);
  // Also clears Lenis' `targetScroll`, otherwise it animates straight back to
  // the offset the previous route left behind.
  sharedLenis?.scrollTo(0, { immediate: true, force: true });
}

/**
 * Re-measure both Lenis and ScrollTrigger after a layout change. Does not move
 * the viewport.
 */
export function refreshScroll(): void {
  if (typeof window === "undefined") return;

  sharedLenis?.resize();
  try {
    ScrollTrigger.refresh();
  } catch {
    // ScrollTrigger may not have any triggers registered yet — nothing to do.
  }
}

/** Pause wheel-driven smooth scrolling (used by `scrollLock`). */
export function pauseSmoothScroll(): void {
  sharedLenis?.stop();
}

/** Resume wheel-driven smooth scrolling (used by `scrollLock`). */
export function resumeSmoothScroll(): void {
  sharedLenis?.start();
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
