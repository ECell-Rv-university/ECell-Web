import { pauseSmoothScroll, refreshScroll, resumeSmoothScroll } from "./lenis";

/**
 * Reference-counted page scroll lock for overlays (entry loader, modals,
 * lightbox, arcade window).
 *
 * Every caller gets its own idempotent release function. The body style is only
 * restored once the last lock is released, so closing one overlay can no longer
 * unlock the page while another is still open — the previous code assigned
 * `document.body.style.overflow = ""` directly from several components and they
 * clobbered each other.
 */

let lockCount = 0;
let savedOverflow: string | null = null;
let savedOverscroll: string | null = null;

export function lockPageScroll(): () => void {
  if (typeof document === "undefined") {
    return () => {};
  }

  lockCount += 1;

  if (lockCount === 1) {
    savedOverflow = document.body.style.overflow;
    savedOverscroll = document.body.style.overscrollBehavior;
    document.body.style.overflow = "hidden";
    // Stops scroll chaining / iOS rubber-banding bleeding through the overlay.
    document.body.style.overscrollBehavior = "none";
    pauseSmoothScroll();
  }

  let released = false;

  return () => {
    if (released) return;
    released = true;
    lockCount = Math.max(0, lockCount - 1);

    if (lockCount === 0) {
      document.body.style.overflow = savedOverflow ?? "";
      document.body.style.overscrollBehavior = savedOverscroll ?? "";
      savedOverflow = null;
      savedOverscroll = null;
      resumeSmoothScroll();

      // `overflow: hidden` on <body> collapses the scrollable height, so both
      // Lenis and ScrollTrigger have stale measurements until the style is back.
      // Re-measure on the next frame, once the browser has applied it.
      if (typeof window !== "undefined") {
        window.requestAnimationFrame(refreshScroll);
      }
    }
  };
}

export function isPageScrollLocked(): boolean {
  return lockCount > 0;
}
