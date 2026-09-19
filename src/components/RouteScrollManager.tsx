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

    // Check if the URL has an anchor hash or a stored pending scroll target
    const hash = window.location.hash;
    if (hash && hash.length > 1) {
      return;
    }

    try {
      if (sessionStorage.getItem("nav:pendingScrollTarget")) {
        return;
      }
    } catch {
      // ignore
    }

    const htmlEl = document.documentElement;
    const originalScrollBehavior = htmlEl.style.scrollBehavior;

    // 1. Force instant scroll behavior
    htmlEl.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    document.body.scrollTop = 0;
    htmlEl.scrollTop = 0;

    // 2. Perform checks on animation frames to counter any late browser layout shifts
    const frameId = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      document.body.scrollTop = 0;
      htmlEl.scrollTop = 0;

      try {
        ScrollTrigger.refresh();
      } catch {
        // Ignore if ScrollTrigger is unavailable
      }
    });

    const timerId = window.setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      document.body.scrollTop = 0;
      htmlEl.scrollTop = 0;
      htmlEl.style.scrollBehavior = originalScrollBehavior;
    }, 150);

    return () => {
      cancelAnimationFrame(frameId);
      window.clearTimeout(timerId);
      htmlEl.style.scrollBehavior = originalScrollBehavior;
    };
  }, [pathname]);

  return null;
}
