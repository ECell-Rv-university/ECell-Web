import Lenis, { type LenisOptions, type VirtualScrollData } from "lenis";
import { gsap, ScrollTrigger } from "./gsapSetup";
import {
  createWheelClassifier,
  MAX_WHEEL_DELTA_PX,
  normalizeWheelDelta,
} from "./wheel";

/**
 * Single source of truth for page scrolling.
 *
 * Every programmatic scroll in the app must go through the helpers exported
 * here. Mixing `window.scrollTo`/`scrollIntoView` with Lenis makes the two
 * disagree about where the page is: Lenis keeps interpolating toward its own
 * `targetScroll` and drags the viewport back, which is what produces the
 * "it jumps then drifts" and "sometimes smooth, sometimes not" behaviour.
 */

let sharedLenis: Lenis | null = null;
let tickerCallback: ((time: number) => void) | null = null;
let scrollCallback: (() => void) | null = null;
let refreshInitCallback: (() => void) | null = null;
let consumerCount = 0;

const classifyWheel = createWheelClassifier();

let windowsPlatform: boolean | null = null;
/** Windows (any browser). Memoised; false during SSR. */
function isWindows(): boolean {
  if (windowsPlatform === null) {
    if (typeof navigator === "undefined") return false;
    const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
    const platform = nav.userAgentData?.platform || nav.platform || nav.userAgent;
    windowsPlatform = /win/i.test(platform);
  }
  return windowsPlatform;
}

const lenisOptions: LenisOptions = {
  // 0.1 provides responsive, natural damping that tracks touchpad swipes 1:1
  // without sluggish floaty lag, while keeping mouse wheel notches buttery smooth.
  lerp: 0.1,
  wheelMultiplier: 1,
  smoothWheel: true,
  // Touch devices keep their native momentum scrolling — emulating it feels
  // worse than the real thing and fights the browser's overscroll gestures.
  syncTouch: false,
  // The GSAP ticker drives the loop (see acquireLenis), so Lenis must not run
  // its own RAF as well.
  autoRaf: false,
  // Let scrollable children (chat transcript, team strip, modals, horizontal
  // carousels) consume the wheel instead of Lenis scrolling the page under them.
  allowNestedScroll: true,
  stopInertiaOnNavigate: true,
  // `respectReducedMotion` defaults to true: Lenis disables smoothing and makes
  // programmatic scrolls instant when the user asks for reduced motion.
  virtualScroll: (data: VirtualScrollData) => {
    const { event } = data;
    if (event.type !== "wheel") return true;

    // Body scroll lock (entry loader, modals, lightbox): the page must stay
    // put. Lenis scrolls the window programmatically, which ignores
    // `overflow: hidden`, so bail out and let the browser do nothing.
    if (document.body.style.overflow === "hidden") return false;

    const wheelEvent = event as WheelEvent;
    const inputType = classifyWheel(wheelEvent, performance.now());

    // Windows precision touchpads already deliver smooth, momentum-scrolled
    // deltas. Smoothing them a second time with Lenis made scrolling feel
    // floaty and inconsistent (worse on high-refresh displays), so hand
    // touchpad gestures to the browser's native scrolling. Lenis follows
    // native scroll and keeps ScrollTrigger in sync. Mouse wheels, and
    // touchpads on other platforms, keep the Lenis smoothing.
    if (inputType === "touchpad" && isWindows()) {
      // If a mouse-wheel glide is still running, stop it at the current
      // position so it doesn't fight the native scroll.
      if (sharedLenis?.isScrolling === "smooth") {
        sharedLenis.scrollTo(window.scrollY, { immediate: true, force: true });
      }
      return false;
    }

    // Only yield to horizontal scrolling if it's genuinely a horizontal gesture,
    // not accidental diagonal wobble at the start of a vertical swipe.
    const isHorizontalDominant =
      Math.abs(data.deltaX) > Math.abs(data.deltaY) * 1.5 &&
      Math.abs(data.deltaX) > 12;
    if (isHorizontalDominant) return false;

    if (inputType === "notch") {
      // Discrete wheels report very different distances across browsers and
      // operating systems, so collapse each physical notch to one stable step.
      data.deltaY = normalizeWheelDelta(wheelEvent, data.deltaY);
    } else if (Math.abs(data.deltaY) > MAX_WHEEL_DELTA_PX) {
      // Precision touchpads already provide high-resolution pixel deltas. Keep
      // them 1:1 and only guard against a genuinely runaway single-frame spike.
      data.deltaY = Math.sign(data.deltaY) * MAX_WHEEL_DELTA_PX;
    }

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

/**
 * Acquire the app-wide Lenis instance. The instance and its GSAP ticker loop
 * are shared so mounting multiple smooth-scroll consumers can never create
 * competing Lenis instances or desynchronized animation loops.
 *
 * `SmoothScroll` holds a handle for the whole session, so the instance exists
 * on every route rather than only on the ones that animate.
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
 * Scroll to an absolute document offset. Uses Lenis when it is active so
 * programmatic scrolls share the wheel's easing on every OS (native
 * `behavior: "smooth"` has a different duration and curve per browser, and
 * fights Lenis' internal position); falls back to the browser otherwise.
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
}
