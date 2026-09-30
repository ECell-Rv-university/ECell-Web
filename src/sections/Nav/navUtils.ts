import { scrollToElement } from "@/src/utils/lenis";

export const PENDING_SCROLL_KEY = "nav:pendingScrollTarget";

/**
 * True when the visitor arrived asking for a specific section, either through a
 * `#hash` or through a target stashed before a client-side navigation. Callers
 * use this to avoid resetting scroll out from under a pending section scroll.
 */
export function hasPendingSectionTarget(): boolean {
  if (typeof window === "undefined") return false;

  if (window.location.hash.length > 1) return true;

  try {
    return Boolean(sessionStorage.getItem(PENDING_SCROLL_KEY));
  } catch {
    return false;
  }
}

export function navigateToSection(id: string): void {
  const element = document.getElementById(id);
  if (!element) return;

  const navigationEvent = new CustomEvent<{ targetId: string }>("horizontal-flow:navigate", {
    detail: { targetId: id },
    cancelable: true,
  });
  window.dispatchEvent(navigationEvent);

  if (!navigationEvent.defaultPrevented && !element.closest(".horizontal-flow-panel")) {
    // Goes through Lenis rather than scrollIntoView so the smooth animation and
    // Lenis' internal target stay in agreement.
    scrollToElement(element);
  }
}
