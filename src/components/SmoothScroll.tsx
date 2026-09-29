"use client";

import { useEffect } from "react";
import { acquireLenis } from "@/src/utils/lenis";

/**
 * Mounts the shared Lenis instance for the whole app so every route scrolls
 * the same way on every OS. Previously it only existed while certain sections
 * were mounted, so /events and other pages fell back to raw native scrolling,
 * which differs between Windows, macOS and Linux.
 */
export default function SmoothScroll(): null {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (reduceMotion || isMobile) return;

    const handle = acquireLenis();
    return () => handle.release();
  }, []);

  return null;
}
