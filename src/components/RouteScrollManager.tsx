"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { refreshScroll, resetScrollToTop } from "@/src/utils/lenis";

/**
 * The only place that resets scroll on navigation.
 *
 * Route changes (e.g. `/` to `/events`, or `/events` to `/events/[slug]`) land
 * at the top of the new page. The reset goes through the shared scroll helpers
 * so Lenis' internal target is cleared too — a bare `window.scrollTo(0, 0)`
 * leaves Lenis animating back toward the previous route's offset.
 *
 * Individual pages must not add their own reset effects: several used to, each
 * on its own timer, and they raced each other over `html.style.scrollBehavior`.
 */
export default function RouteScrollManager(): null {
  const pathname = usePathname();
  const prevPathnameRef = useRef<string | null>(null);

  useEffect(() => {
    // Purely hash changes keep the same pathname — never interrupt anchor scrolling.
    if (prevPathnameRef.current === pathname) {
      return;
    }
    prevPathnameRef.current = pathname;

    // Deep link to a section: let the anchor handler own the scroll position.
    if (window.location.hash.length > 1) {
      return;
    }

    resetScrollToTop();

    // One more pass after the new route has painted, to absorb layout shifts
    // that happen between the effect and the first frame.
    const frameId = requestAnimationFrame(() => {
      resetScrollToTop();
      refreshScroll();
    });

    // Late-loading images and fonts change document height. Re-measure only —
    // deliberately no second reset here, so a user who has already started
    // scrolling is not yanked back to the top.
    const timerId = window.setTimeout(refreshScroll, 200);

    return () => {
      cancelAnimationFrame(frameId);
      window.clearTimeout(timerId);
    };
  }, [pathname]);

  return null;
}
