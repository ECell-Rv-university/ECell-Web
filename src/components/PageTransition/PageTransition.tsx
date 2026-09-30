"use client";
import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "@/src/utils/gsapSetup";
import "./PageTransition.css";

const TARGET_PATH = "/events";
const COLUMN_COUNT = 5;
// Keep the cover up at least this long so the title always finishes its
// entrance, even when the events route is already prefetched.
const MIN_COVER_MS = 1300;
// If navigation stalls, never leave the site stuck behind the curtain.
const MAX_COVER_MS = 8000;

export const TRANSITION_REVEAL_EVENT = "ecell:transition-reveal";

// The same three strokes the entry loader draws, so the transition reads as
// part of the brand rather than a generic wipe.
const LOGO_PATHS = [
  "M4280 5974 c-41 -19 -110 -60 -154 -91 -97 -67 -473 -364 -606 -478 -200 -172 -391 -303 -500 -345 l-35 -13 -242 -5 -243 -4 0 -304 0 -305 358 3 357 3 63 26 c135 58 309 185 642 469 347 298 503 412 633 468 l62 27 548 3 547 3 0 289 0 290 -678 0 -678 0 -74 -36z",
  "M4740 4821 c-142 -46 -296 -152 -684 -470 -133 -109 -311 -251 -396 -315 l-155 -117 -80 -40 c-44 -21 -104 -44 -134 -49 l-54 -10 -368 0 -369 0 0 -295 0 -295 518 0 517 0 46 14 c147 45 254 121 810 578 227 186 408 317 512 372 l79 41 364 3 364 3 0 299 0 300 -457 -1 -458 0 -55 -18z",
  "M5064 3631 c-133 -48 -270 -148 -762 -554 -249 -205 -437 -346 -526 -394 l-71 -38 -600 -5 -600 -5 -3 -297 -2 -298 692 0 693 0 47 15 c142 43 311 156 627 420 452 377 559 458 703 530 l90 45 179 0 179 0 0 300 0 300 -297 0 -298 -1 -51 -18z",
];

type TransitionPhase = "idle" | "entering" | "covered" | "revealing";

export default function PageTransition(): React.ReactElement {
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const phaseRef = useRef<TransitionPhase>("idle");
  const coveredAtRef = useRef(0);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const revealTimerRef = useRef<number | null>(null);
  const failsafeTimerRef = useRef<number | null>(null);

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const columnsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const logoPathsRef = useRef<(SVGPathElement | null)[]>([]);
  const eyebrowRef = useRef<HTMLParagraphElement | null>(null);
  const ruleRef = useRef<HTMLSpanElement | null>(null);
  const linesRef = useRef<(HTMLSpanElement | null)[]>([]);
  const metaRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLSpanElement | null>(null);

  const pathname = usePathname();
  const router = useRouter();

  const setTransitionPhase = (next: TransitionPhase) => {
    phaseRef.current = next;
    setPhase(next);
    if (next === "idle") {
      delete document.documentElement.dataset.pageTransition;
    } else {
      document.documentElement.dataset.pageTransition = next;
    }
  };

  // Cover the screen, then navigate.
  useEffect(() => {
    const startTransition = () => {
      if (phaseRef.current !== "idle") return;

      const overlay = overlayRef.current;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reducedMotion || !overlay) {
        router.push(TARGET_PATH);
        return;
      }

      router.prefetch(TARGET_PATH);
      setTransitionPhase("entering");

      const columns = columnsRef.current.filter(Boolean);
      const logoPaths = logoPathsRef.current.filter(Boolean) as SVGPathElement[];
      const lines = linesRef.current.filter(Boolean);

      timelineRef.current?.kill();
      logoPaths.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length, fillOpacity: 0, strokeOpacity: 1 });
      });
      gsap.set(overlay, { autoAlpha: 1 });
      gsap.set(columns, { y: 0, yPercent: 100, skewY: 0 });
      gsap.set(lines, { y: 0, yPercent: 130, autoAlpha: 1 });
      gsap.set([eyebrowRef.current, metaRef.current], { autoAlpha: 0, y: 12 });
      gsap.set(ruleRef.current, { scaleX: 0 });
      gsap.set(progressRef.current, { scaleX: 0 });

      const tl = gsap.timeline();
      timelineRef.current = tl;

      // Staggered curtain rising from the bottom, echoing the loader's exit.
      tl.to(columns, {
        yPercent: 0,
        duration: 0.75,
        ease: "power4.inOut",
        stagger: { each: 0.06, from: "start" },
      });

      tl.call(() => {
        coveredAtRef.current = performance.now();
        setTransitionPhase("covered");
        router.push(TARGET_PATH);
        failsafeTimerRef.current = window.setTimeout(() => {
          if (phaseRef.current !== "covered") return;
          timelineRef.current?.kill();
          gsap.to(overlay, {
            autoAlpha: 0,
            duration: 0.3,
            onComplete: () => setTransitionPhase("idle"),
          });
        }, MAX_COVER_MS);
      });

      tl.to(logoPaths, { strokeDashoffset: 0, duration: 0.5, stagger: 0.08, ease: "power2.inOut" }, 0.4)
        .to(logoPaths, { fillOpacity: 1, strokeOpacity: 0, duration: 0.3, ease: "power2.out" }, 0.95)
        .to(ruleRef.current, { scaleX: 1, duration: 0.5, ease: "power3.inOut" }, 0.6)
        .to(eyebrowRef.current, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out" }, 0.62)
        .to(lines, { yPercent: 0, duration: 0.8, stagger: 0.1, ease: "power4.out" }, 0.66)
        .to(metaRef.current, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out" }, 0.8)
        .to(progressRef.current, { scaleX: 1, duration: MIN_COVER_MS / 1000, ease: "power1.inOut" }, 0.5);
    };

    window.addEventListener("ecell:events-transition", startTransition);
    return () => {
      window.removeEventListener("ecell:events-transition", startTransition);
    };
  }, [router]);

  // Once the events route has rendered, lift the curtain.
  useEffect(() => {
    if (pathname !== TARGET_PATH || phaseRef.current !== "covered") return;

    const reveal = () => {
      if (failsafeTimerRef.current !== null) window.clearTimeout(failsafeTimerRef.current);
      const overlay = overlayRef.current;
      if (!overlay) return;
      setTransitionPhase("revealing");

      const columns = columnsRef.current.filter(Boolean);
      const lines = linesRef.current.filter(Boolean);
      const logoPaths = logoPathsRef.current.filter(Boolean);

      timelineRef.current?.kill();
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(overlay, { autoAlpha: 0 });
          setTransitionPhase("idle");
        },
      });
      timelineRef.current = tl;

      tl.to(lines, { yPercent: -130, autoAlpha: 0, duration: 0.5, stagger: 0.06, ease: "power3.in" }, 0)
        .to([eyebrowRef.current, metaRef.current, ...logoPaths], { autoAlpha: 0, y: -10, duration: 0.35, ease: "power2.in" }, 0)
        .to(progressRef.current, { scaleX: 0, transformOrigin: "right center", duration: 0.4, ease: "power2.in" }, 0)
        .to(columns, {
          yPercent: -100,
          skewY: -2,
          duration: 0.85,
          ease: "power4.inOut",
          stagger: { each: 0.06, from: "start" },
        }, 0.3)
        // Let the events hero start its entrance as the curtain lifts.
        .call(() => {
          window.dispatchEvent(new CustomEvent(TRANSITION_REVEAL_EVENT));
        }, [], 0.55);
    };

    const remaining = Math.max(0, MIN_COVER_MS - (performance.now() - coveredAtRef.current));
    revealTimerRef.current = window.setTimeout(reveal, remaining);

    return () => {
      if (revealTimerRef.current !== null) window.clearTimeout(revealTimerRef.current);
    };
  }, [pathname]);

  // Block scrolling underneath while the curtain is up.
  useEffect(() => {
    if (phase === "idle") return;
    const block = (event: Event) => event.preventDefault();
    window.addEventListener("wheel", block, { passive: false });
    window.addEventListener("touchmove", block, { passive: false });
    return () => {
      window.removeEventListener("wheel", block);
      window.removeEventListener("touchmove", block);
    };
  }, [phase]);

  useEffect(() => {
    return () => {
      timelineRef.current?.kill();
      if (failsafeTimerRef.current !== null) window.clearTimeout(failsafeTimerRef.current);
      delete document.documentElement.dataset.pageTransition;
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      className={`page-transition-overlay transition-${phase}`}
      role="status"
      aria-live="polite"
      aria-hidden={phase === "idle"}
    >
      <div className="pt-columns" aria-hidden="true">
        {Array.from({ length: COLUMN_COUNT }, (_, index) => (
          <span
            key={index}
            className="pt-column"
            ref={(el) => {
              columnsRef.current[index] = el;
            }}
          />
        ))}
      </div>
      <div className="pt-grain" aria-hidden="true" />

      <div className="pt-content">
        <svg className="pt-logo" viewBox="170 190 440 440" aria-hidden="true">
          <g transform="translate(0,808) scale(0.1,-0.1)">
            {LOGO_PATHS.map((d, index) => (
              <path
                key={index}
                d={d}
                ref={(el) => {
                  logoPathsRef.current[index] = el;
                }}
              />
            ))}
          </g>
        </svg>

        <p className="pt-eyebrow" ref={eyebrowRef}>
          <span ref={ruleRef} />
          Events &amp; Workshops
        </p>

        <h2 className="pt-title">
          <span className="pt-line-mask">
            <span className="pt-line" ref={(el) => { linesRef.current[0] = el; }}>
              Where ideas
            </span>
          </span>
          <span className="pt-line-mask">
            <span className="pt-line" ref={(el) => { linesRef.current[1] = el; }}>
              <em>get moving.</em>
            </span>
          </span>
        </h2>
      </div>

      <div className="pt-meta" ref={metaRef} aria-hidden="true">
        <span>ECell · RV University</span>
        <span className="pt-progress">
          <span ref={progressRef} />
        </span>
        <span>Loading events</span>
      </div>
      <span className="pt-sr">{phase === "idle" ? "" : "Loading events"}</span>
    </div>
  );
}
