"use client";

import { useCallback, useRef, useState } from "react";
import { scrollToElement, scrollToY } from "@/src/utils/lenis";

interface GalleryNavigationOptions {
  finaleStageRef: React.RefObject<HTMLDivElement | null>;
}

export function useGalleryNavigation({ finaleStageRef }: GalleryNavigationOptions) {
  const [activeFilter, setActiveFilter] = useState("all");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const registerSection = useCallback((sectionId: string, element: HTMLElement | null) => {
    sectionRefs.current[sectionId] = element;
  }, []);

  const selectFilter = (sectionId: string) => {
    setActiveFilter(sectionId);

    if (sectionId === "all") {
      scrollToY(0, { duration: 1.2 });
      return;
    }

    if (sectionId === "team-photo" && finaleStageRef.current) {
      const top = finaleStageRef.current.getBoundingClientRect().top + window.scrollY;
      scrollToY(top + window.innerHeight * 2.1, { duration: 1.6 });
      return;
    }

    const section = sectionRefs.current[sectionId];
    if (section) {
      scrollToElement(section, { offset: -80, duration: 1.2 });
    }
  };

  // No scroll reset on mount: RouteScrollManager handles it for every route.

  return { activeFilter, registerSection, selectFilter };
}
