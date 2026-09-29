"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type Lenis from "lenis";

interface GalleryNavigationOptions {
  lenisRef: React.RefObject<Lenis | null>;
  finaleStageRef: React.RefObject<HTMLDivElement | null>;
}

export function useGalleryNavigation({ lenisRef, finaleStageRef }: GalleryNavigationOptions) {
  const [activeFilter, setActiveFilter] = useState("all");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const registerSection = useCallback((sectionId: string, element: HTMLElement | null) => {
    sectionRefs.current[sectionId] = element;
  }, []);

  const scrollTo = (top: number, duration: number) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(top, { duration });
    } else {
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const selectFilter = (sectionId: string) => {
    setActiveFilter(sectionId);
    if (sectionId === "all") {
      scrollTo(0, 1.2);
      return;
    }
    if (sectionId === "team-photo" && finaleStageRef.current) {
      const top = finaleStageRef.current.getBoundingClientRect().top + window.scrollY;
      scrollTo(top + window.innerHeight * 2.1, 1.6);
      return;
    }

    const section = sectionRefs.current[sectionId];
    if (section) {
      scrollTo(section.getBoundingClientRect().top + window.scrollY - 80, 1.2);
    }
  };

  useEffect(() => {
    const html = document.documentElement;
    const originalScrollBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    const timer = window.setTimeout(() => {
      html.style.scrollBehavior = originalScrollBehavior;
    }, 100);
    return () => window.clearTimeout(timer);
  }, []);

  return { activeFilter, registerSection, selectFilter };
}
