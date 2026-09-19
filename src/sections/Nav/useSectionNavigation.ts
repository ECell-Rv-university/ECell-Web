import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PENDING_SCROLL_KEY, navigateToSection } from "./navUtils";

interface UseSectionNavigationOptions {
  closeMenu: () => void;
}

export function useSectionNavigation({ closeMenu }: UseSectionNavigationOptions) {
  const pathname = usePathname();
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimeoutRef = useRef<number | null>(null);

  // Clear any pending route-change timer on unmount
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current !== null) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isTransitioning) return;

    const timeoutId = window.setTimeout(() => {
      setIsTransitioning(false);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [pathname, isTransitioning]);

  const openEvents = () => {
    if (pathname === "/events" || isTransitioning) return;

    closeMenu();
    setIsTransitioning(true);
    window.dispatchEvent(
      new CustomEvent("ecell:page-transition", {
        detail: { url: "/events", title: "EVENTS" },
      })
    );
  };

  const openHome = () => {
    if (pathname === "/" || isTransitioning) return;

    closeMenu();
    setIsTransitioning(true);
    window.dispatchEvent(
      new CustomEvent("ecell:page-transition", {
        detail: { url: "/", title: "HOME" },
      })
    );
  };

  const scrollToSection = (id: string) => {
    closeMenu();

    if (pathname !== "/") {
      if (isTransitioning) return;
      try {
        sessionStorage.setItem(PENDING_SCROLL_KEY, id);
      } catch {
        // sessionStorage unavailable (e.g. private browsing) — proceed anyway,
        // scroll just won't be resolved after navigation in that edge case.
      }
      setIsTransitioning(true);
      window.dispatchEvent(
        new CustomEvent("ecell:page-transition", {
          detail: { url: `/#${id}`, title: "E-CELL" },
        })
      );
      return;
    }

    if (window.location.hash !== `#${id}`) {
      window.history.pushState(null, "", `/#${id}`);
    }
    navigateToSection(id);
  };

  return { pathname, isTransitioning, openEvents, openHome, scrollToSection };
}
