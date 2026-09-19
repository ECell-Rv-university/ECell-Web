import Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsapSetup";

const lenisOptions = {
  lerp: 0.08,
  wheelMultiplier: 0.75,
  smoothWheel: true,
  syncTouch: false,
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

/**
 * Access the active shared Lenis instance if one is mounted.
 */
export function getSharedLenis(): Lenis | null {
  return sharedLenis;
}

export interface ScrollToTargetOptions {
  offset?: number;
  immediate?: boolean;
  duration?: number;
}

/**
 * Smoothly scrolls to a target (selector, HTMLElement, or numeric offset).
 * Uses Lenis if active to prevent competing scroll loops; otherwise falls back to native scroll.
 */
export function scrollToTarget(
  target: number | string | HTMLElement,
  options?: ScrollToTargetOptions
): void {
  if (typeof window === "undefined") return;

  if (sharedLenis) {
    sharedLenis.scrollTo(target, {
      offset: options?.offset ?? 0,
      immediate: options?.immediate ?? false,
      duration: options?.duration ?? 1.1,
    });
    return;
  }

  const behavior: ScrollBehavior = options?.immediate ? "auto" : "smooth";

  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior });
  } else {
    const el = typeof target === "string"
      ? (target.startsWith("#") ? document.getElementById(target.slice(1)) : document.querySelector<HTMLElement>(target))
      : target;
    if (el) {
      el.scrollIntoView({ behavior, block: "start" });
    }
  }
}

