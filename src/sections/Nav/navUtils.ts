import { scrollToTarget } from "../../utils/lenis";

export const PENDING_SCROLL_KEY = "nav:pendingScrollTarget";

export function navigateToSection(id: string): void {
  const element = document.getElementById(id);
  if (!element) return;

  const navigationEvent = new CustomEvent<{ targetId: string }>("horizontal-flow:navigate", {
    detail: { targetId: id },
    cancelable: true,
  });
  window.dispatchEvent(navigationEvent);

  if (!navigationEvent.defaultPrevented && !element.closest(".horizontal-flow-panel")) {
    scrollToTarget(element);
  }
}

