"use client";
import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import PageTransition from "../../components/PageTransition/PageTransition";
import "./Nav.css";

export default function Nav(): React.ReactElement {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionTarget, setTransitionTarget] = useState<"events" | "home">("events");
  const pathname = usePathname();
  const router = useRouter();
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const transitionTimeoutRef = useRef<number | null>(null);
  const PENDING_SCROLL_KEY = "nav:pendingScrollTarget";

  const openEvents = () => {
    if (pathname === "/events" || isTransitioning) return;

    setIsOpen(false);
    setTransitionTarget("events");
    setIsTransitioning(true);
    transitionTimeoutRef.current = window.setTimeout(() => {
      router.push("/events");
    }, 720);
  };

  const openHome = () => {
    if (pathname === "/" || isTransitioning) return;

    setTransitionTarget("home");
    setIsTransitioning(true);
    transitionTimeoutRef.current = window.setTimeout(() => {
      router.push("/");
    }, 720);
  };

  useEffect(() => {
    if (!isTransitioning) return;
    const expectedPath = transitionTarget === "home" ? "/" : "/events";
    if (pathname === expectedPath) {
      setIsTransitioning(false);
    }
  }, [pathname, isTransitioning, transitionTarget]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node | null;
      if (
        toggleRef.current &&
        target &&
        !toggleRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      if (transitionTimeoutRef.current !== null) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  const scrollToSection = (id: string) => {
    setIsOpen(false);

  
    if (pathname !== "/") {
      if (isTransitioning) return;
      try {
        sessionStorage.setItem(PENDING_SCROLL_KEY, id);
      } catch {
        // sessionStorage unavailable (e.g. private browsing) — proceed anyway,
        // scroll just won't be resolved after navigation in that edge case.
      }
      setTransitionTarget("home");
      setIsTransitioning(true);
      transitionTimeoutRef.current = window.setTimeout(() => {
        router.push("/");
      }, 720);
      return;
    }

    const el = document.getElementById(id);
    if (el) {
      const navigationEvent = new CustomEvent<{ targetId: string }>("horizontal-flow:navigate", {
        detail: { targetId: id },
        cancelable: true,
      });
      window.dispatchEvent(navigationEvent);

      // Sections outside the pinned horizontal flow still use standard anchor scrolling.
      if (!navigationEvent.defaultPrevented) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    if (pathname !== "/") return;

    let pending: string | null = null;
    try {
      pending = sessionStorage.getItem(PENDING_SCROLL_KEY);
    } catch {
      pending = null;
    }
    if (!pending) return;

    // NOTE: the stored target is intentionally NOT removed here. StrictMode
    // remounts effects in development, so consuming the key on mount would
    // lose it on the second run. It is cleared only once the scroll settles.

    const targetId = pending;

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
        el.scrollIntoView({ behavior: "smooth" });
      }
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

      const reachedTarget = scrollAttempts > 0 && (window.scrollY > 40 || el.getBoundingClientRect().top < 160);

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
        el.scrollIntoView();
        clearPendingTarget();
      }
    }, 100);

    return () => window.clearInterval(intervalId);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;
    const handleScroll = () => setIsOpen(false);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen]);

  return (
    <>
      <nav>
        <button
          className="logo nav__logo-container nav__logo-button"
          onClick={pathname === "/" ? () => window.location.reload() : openHome}
          type="button"
          aria-label={pathname === "/" ? "Reload homepage" : "Return to homepage"}
        >
          <div className="nav__logo-icon-target" />
        </button>
        <div className="nav-right">
          <button
            className={`nav-events-link ${pathname === "/events" ? "is-active" : ""}`}
            onClick={openEvents}
            type="button"
            aria-current={pathname === "/events" ? "page" : undefined}
          >
            Events
          </button>
          <button
            ref={toggleRef}
            className="chapters-toggle"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls="chapters-menu"
            type="button"
          >
            Chapters
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
          <button
            className="menu-icon"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close chapters menu" : "Open chapters menu"}
            aria-expanded={isOpen}
            aria-controls="chapters-menu"
            type="button"
          >
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      <PageTransition active={isTransitioning} targetView={transitionTarget} />

      <div
        ref={dropdownRef}
        id="chapters-menu"
        className={`chapters-dropdown ${isOpen ? "open" : ""}`}
        aria-hidden={!isOpen}
      >
        <a
          href="#aboutSection"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("aboutSection");
            (document.activeElement as HTMLElement | null)?.blur();
            setIsOpen(false);
          }}
          className="dropdown-about-link"
        >
          ABOUT ECELL
        </a>
        <a
          href="#why-join"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("why-join");
            (document.activeElement as HTMLElement | null)?.blur();
            setIsOpen(false);
          }}
          className="dropdown-team-link"
        >
          WHY JOIN ECELL
        </a>
        <a
          href="#teamSection"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("teamSection");
            (document.activeElement as HTMLElement | null)?.blur();
            setIsOpen(false);
          }}
          className="dropdown-team-link"
        >
          THE TEAM
        </a>
        <a
          href="#eventsSection"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("eventsSection");
            (document.activeElement as HTMLElement | null)?.blur();
            setIsOpen(false);
          }}
          className="dropdown-events-link"
        >
          EVENTS
        </a>
        <a
          href="#sponsors"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("sponsors");
            (document.activeElement as HTMLElement | null)?.blur();
            setIsOpen(false);
          }}
          className="dropdown-sponsors-link"
        >
          PARTNERS & SPONSORS
        </a>
        <a
          href="#speakers"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("speakers");
            (document.activeElement as HTMLElement | null)?.blur();
            setIsOpen(false);
          }}
          className="dropdown-speakers-link"
        >
          PREVIOUS SPEAKERS
        </a>
        <a
          href="#community"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("community");
            (document.activeElement as HTMLElement | null)?.blur();
            setIsOpen(false);
          }}
          className="dropdown-footer-link"
        >
          WHATSAPP COMMUNITY
        </a>
        <a
          href="#footer"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("footer");
            (document.activeElement as HTMLElement | null)?.blur();
            setIsOpen(false);
          }}
          className="dropdown-footer-link"
        >
          FOOTER
        </a>
      </div>
    </>
  );
}
