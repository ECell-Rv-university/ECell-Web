"use client";

import { useEffect } from "react";
import { acquireLenis } from "@/src/utils/lenis";

/**
 * Keeps the shared Lenis instance alive for the whole session.
 *
 * Before this existed, Lenis was acquired by individual sections (`Story`,
 * `WhyJoin`, the gallery finale) and destroyed as soon as they unmounted. Scroll
 * therefore felt smooth on `/` but raw on `/events`, and changed mid-session on
 * navigation. Owning the instance at the layout level makes every route behave
 * the same.
 */
export default function SmoothScrollProvider(): null {
  useEffect(() => {
    const handle = acquireLenis();
    return () => handle.release();
  }, []);

  return null;
}
