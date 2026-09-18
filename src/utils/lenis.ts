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

