import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { PENDING_SCROLL_KEY, navigateToSection } from "./navUtils";

export function useHomeScroll(): void {
  const pathname = usePathname();

  // Browser back/forward between #hashes on the home page
  useEffect(() => {
    if (pathname !== "/") return;

    const handlePopState = () => {
      const targetId = window.location.hash.slice(1);
      if (targetId) navigateToSection(targetId);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [pathname]);

  // Land on the requested section after arriving from another page
  useEffect(() => {
    if (pathname !== "/") return;

    let pending: string | null = null;
    try {
      pending = sessionStorage.getItem(PENDING_SCROLL_KEY);
    } catch {
      pending = null;
    }

    const hashTarget = window.location.hash.slice(1);
    const targetId = hashTarget || pending;
    if (!targetId) return;

    // NOTE: the stored target is intentionally NOT removed here. StrictMode
    // remounts effects in development, so consuming the key on mount would
    // lose it on the second run. It is cleared only once the scroll settles.

    const clearPendingTarget = () => {
      try {
        sessionStorage.removeItem(PENDING_SCROLL_KEY);
      } catch {
        // ignore
      }
    };

    let ticks = 0;
    let scrollAttempts = 0;
    let ticksSinceScroll = 0;
    let settled = false;
    let navigationHandled = false;
    const maxTicks = 120; // ~12s at 100ms intervals — covers the entry loader plus late mounting
    const maxScrollAttempts = 4; // initial try + retries if something snaps the page back to the top

    const requestNavigation = (el: HTMLElement) => {
      scrollAttempts += 1;
      ticksSinceScroll = 0;

      const navigationEvent = new CustomEvent<{ targetId: string }>("horizontal-flow:navigate", {
        detail: { targetId },
        cancelable: true,
      });
      window.dispatchEvent(navigationEvent);

      // Sections inside the pinned horizontal flow claim the event and scroll
      // themselves; everything else uses standard anchor scrolling.
      if (!navigationEvent.defaultPrevented) {
        if (!el.closest(".horizontal-flow-panel")) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }

      navigationHandled = navigationEvent.defaultPrevented || !el.closest(".horizontal-flow-panel");
    };

    const intervalId = window.setInterval(() => {
      ticks += 1;

      if (settled) {
        window.clearInterval(intervalId);
        clearPendingTarget();
        return;
      }

      const el = document.getElementById(targetId);

      // Target not mounted yet — keep waiting briefly, then give up.
      if (!el) {
        if (ticks >= maxTicks) {
          window.clearInterval(intervalId);
          clearPendingTarget();
        }
        return;
      }

      // While the entry loader holds body overflow hidden the viewport cannot
      // scroll at all: any programmatic scroll is clamped straight back to the
      // top and silently lost, leaving the page parked above the requested
      // section. Wait for that lock to lift before moving anywhere.
      if (document.body.style.overflow === "hidden") {
        if (ticks >= maxTicks) {
          window.clearInterval(intervalId);
          clearPendingTarget();
        }
        return;
      }

      const reachedTarget = scrollAttempts > 0 && navigationHandled &&
        (window.scrollY > 40 || el.getBoundingClientRect().top < 160);

      if (reachedTarget) {
        // The scroll stuck — we are at/near the section or clearly en route.
        settled = true;
        return;
      }

      if (scrollAttempts === 0) {
        requestNavigation(el);
        return;
      }

      ticksSinceScroll += 1;

      // Something yanked the page back to the top after our scroll (e.g. the
      // homepage's post-loader reset). Re-issue the scroll a few times so the
      // user still lands on the requested section.
      if (ticksSinceScroll >= 3 && scrollAttempts < maxScrollAttempts) {
        requestNavigation(el);
        return;
      }

      if (scrollAttempts >= maxScrollAttempts || ticks >= maxTicks) {
        window.clearInterval(intervalId);
        // Last resort: snap instantly so the user still lands on the section.
        if (!el.closest(".horizontal-flow-panel")) {
          el.scrollIntoView();
        }
        clearPendingTarget();
      }
    }, 100);

    return () => window.clearInterval(intervalId);
  }, [pathname]);
}
