"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "@/src/utils/gsapSetup";

/**
 * RouteScrollManager ensures that whenever the route changes (e.g. from `/` to `/events`
 * or `/events` to `/events/[slug]`), the viewport instantly resets to (0, 0).
 *
 * It temporarily overrides CSS `scroll-behavior: smooth` on <html> to prevent
 * the browser from initiating a sluggish or clamped smooth-scroll animation
 * that leaves the new page rendered at the previous page's scroll offset.
 */
export default function RouteScrollManager(): null {
  const pathname = usePathname();
  const prevPathnameRef = useRef<string | null>(null);

  useEffect(() => {
    // If the pathname hasn't changed (e.g. purely hash changes), do not interrupt anchor scrolling
    if (prevPathnameRef.current === pathname) {
      return;
    }
    prevPathnameRef.current = pathname;

    // Check if the URL has an anchor hash
    const hash = window.location.hash;
    if (hash && hash.length > 1) {
      return;
    }

    const htmlEl = document.documentElement;
    const originalScrollBehavior = htmlEl.style.scrollBehavior;

    // 1. Force instant scroll behavior
    htmlEl.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    htmlEl.scrollTop = 0;

    // 2. Perform a second check on next frame to counter any late browser layout shifts
    const frameId = requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      htmlEl.scrollTop = 0;

      // 3. Restore original smooth scroll setting
      htmlEl.style.scrollBehavior = originalScrollBehavior;

      // 4. Update GSAP ScrollTrigger to match the fresh viewport metrics
      try {
        ScrollTrigger.refresh();
      } catch {
        // Ignore if ScrollTrigger is unavailable
      }
    });

    return () => {
      cancelAnimationFrame(frameId);
      htmlEl.style.scrollBehavior = originalScrollBehavior;
    };
  }, [pathname]);

  return null;
}
