// Built using Hyperiux Vault: https://vault.hyperiux.com

"use client";

import {
  type CSSProperties,
  type ReactNode,
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
} from "react";
import { gsap, ScrollTrigger } from "@/src/utils/gsapSetup";

type JourneyItem = {
  id: string;
  order: number;
  dateLabel: string;
  title: string;
  content: string;
};

export type TimelineProps = {
  /** Existing About copy that opens the horizontal journey. */
  intro: ReactNode;
  textColor?: string;
  mutedTextColor?: string;
  activeColor?: string;
  backgroundColor?: string;
  /** Reveal animation duration, in seconds. */
  duration?: number;
  /** Fallback reveal duration when `duration` is omitted, in seconds. */
  scrollDuration?: number;
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const MOBILE_QUERY = "(max-width: 768px)";

function subscribeToReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mediaQueryList = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQueryList.addEventListener("change", callback);
  return () => mediaQueryList.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    () => false,
  );
}

const journeyItems: JourneyItem[] = [
  {
    id: "ecell-created",
    order: 1,
    dateLabel: "2023",
    title: "ECell RVU is created",
    content:
      "A student-led home for founders, builders, and ambitious ideas begins at RV University.",
  },
  {
    id: "argonyx-hackathon",
    order: 2,
    dateLabel: "18 Sep 2025",
    title: "Argonyx Hackathon",
    content:
      "Students and builders gather to explore, build, and deploy ambitious technical solutions.",
  },
  {
    id: "winter-tech-talk",
    order: 3,
    dateLabel: "12 Dec 2025",
    title: "Winter Tech Talk",
    content:
      "Students come together to explore emerging technologies and the frameworks shaping what comes next.",
  },
  {
    id: "talk-startup-with-me",
    order: 4,
    dateLabel: "24 Mar 2026",
    title: "Talk Startup With Me",
    content:
      "Experienced founders share practical lessons from problem discovery through the first pitch.",
  },
  {
    id: "pitch-e-thon-26",
    order: 5,
    dateLabel: "2026 · Upcoming",
    title: "Pitch-e-thon ’26",
    content:
      "Ideas move from problem discovery to the stage through pitching, feedback, and founder-focused competition.",
  },
  {
    id: "e-summit-26",
    order: 6,
    dateLabel: "2026 · Upcoming",
    title: "E-Summit ’26",
    content:
      "The campus entrepreneurship community comes together for conversations, connections, and new ventures.",
  },
  {
    id: "argonyx-26",
    order: 7,
    dateLabel: "Sep 2026",
    title: "Argonyx ’26",
    content:
      "The flagship hackathon returns for another high-energy build sprint for student creators and engineers.",
  },
];

export default function Timeline({
  intro,
  textColor = "var(--fg, #f4f4f2)",
  mutedTextColor = "rgba(244, 244, 242, 0.64)",
  activeColor = "#8bce5d",
  backgroundColor = "var(--bg, #1a1a1a)",
  duration,
  scrollDuration = 1.2,
}: TimelineProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const normalizedDuration = Math.max(0.2, duration ?? scrollDuration);

  const sectionStyle: CSSProperties = {
    color: textColor,
    backgroundColor,
  };
  const activeStyle: CSSProperties = { backgroundColor: activeColor };
  const mutedTextStyle: CSSProperties = { color: mutedTextColor };

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track || reducedMotion) return;

    const setSectionHeight = () => {
      const horizontalDistance = Math.max(
        0,
        track.scrollWidth - window.innerWidth,
      );
      const scrollRatio = window.matchMedia(MOBILE_QUERY).matches ? 1 : 0.55;
      section.style.height = `${window.innerHeight + horizontalDistance * scrollRatio}px`;
    };

    setSectionHeight();
    ScrollTrigger.addEventListener("refreshInit", setSectionHeight);

    const context = gsap.context(() => {
      const progressLine = section.querySelector<HTMLElement>(
        "[data-timeline-line]",
      );
      if (!progressLine) return;

      const scrollConfig = {
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        invalidateOnRefresh: true,
      } as const;

      const horizontalTween = gsap.to(track, {
        x: () => Math.min(0, window.innerWidth - track.scrollWidth),
        ease: "none",
        scrollTrigger: scrollConfig,
      });

      gsap.fromTo(
        progressLine,
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: scrollConfig,
        },
      );

      journeyItems.forEach((item) => {
        const stem = section.querySelector<HTMLElement>(
          `[data-timeline-stem="${item.id}"]`,
        );
        const dot = section.querySelector<HTMLElement>(
          `[data-timeline-dot="${item.id}"]`,
        );
        const copy = section.querySelector<HTMLElement>(
          `[data-timeline-copy="${item.id}"]`,
        );
        if (!stem || !dot || !copy) return;

        gsap
          .timeline({
            scrollTrigger: {
              trigger: stem,
              containerAnimation: horizontalTween,
              start: "left 72%",
              end: "left 56%",
              scrub: true,
            },
          })
          .fromTo(
            stem,
            { scaleY: 0 },
            {
              scaleY: 1,
              duration: normalizedDuration * 0.4,
              transformOrigin:
                item.order % 2 === 1 ? "bottom center" : "top center",
            },
          )
          .fromTo(
            dot,
            { scale: 0 },
            { scale: 1, duration: normalizedDuration * 0.4 },
            "<",
          )
          .fromTo(
            copy,
            { y: 45, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: normalizedDuration,
              ease: "power3.out",
            },
            "-=0.15",
          );
      });
    }, section);

    const refreshFrame = window.requestAnimationFrame(() =>
      ScrollTrigger.refresh(),
    );

    return () => {
      window.cancelAnimationFrame(refreshFrame);
      ScrollTrigger.removeEventListener("refreshInit", setSectionHeight);
      context.revert();
      section.style.removeProperty("height");
    };
  }, [normalizedDuration, reducedMotion]);

  if (reducedMotion) {
    return (
      <section
        ref={sectionRef}
        id="journey"
        aria-label="ECell RV University journey from 2023 to 2026"
        className="relative w-full px-6 py-20 text-left"
        style={sectionStyle}
      >
        <div className="mx-auto mb-24 max-w-6xl text-center">{intro}</div>
        <ol
          className="relative mx-auto max-w-4xl list-none border-l pl-8"
          style={{ borderColor: activeColor }}
        >
          {journeyItems.map((item) => (
            <li key={item.id} className="relative pb-14 last:pb-0">
              <span
                aria-hidden="true"
                className="absolute left-[-2.05rem] top-1.5 size-3 -translate-x-1/2 rounded-full"
                style={activeStyle}
              />
              <p
                className="font-mono text-xs uppercase tracking-[0.16em]"
                style={mutedTextStyle}
              >
                {item.dateLabel}
              </p>
              <h3 className="mt-2 text-[clamp(1.75rem,5vw,2.75rem)] leading-none">
                {item.title}
              </h3>
              <p
                className="mt-3 max-w-2xl text-base leading-relaxed"
                style={mutedTextStyle}
              >
                {item.content}
              </p>
            </li>
          ))}
        </ol>
      </section>
    );
  }

  const renderJourneyItem = (item: JourneyItem) => {
    const isTop = item.order % 2 === 1;

    return (
      <li
        key={item.id}
        className="relative h-full w-[34vw] shrink-0 max-[768px]:w-[72vw]"
      >
        <span
          data-timeline-stem={item.id}
          aria-hidden="true"
          className={`absolute left-0 h-[24%] w-px rounded-full ${
            isTop ? "bottom-1/2" : "top-1/2"
          }`}
          style={activeStyle}
        />
        <span
          data-timeline-dot={item.id}
          aria-hidden="true"
          className="absolute left-0 top-1/2 size-[clamp(0.65rem,1vw,0.9rem)] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={activeStyle}
        />
        <article
          data-timeline-copy={item.id}
          className={`absolute inset-x-0 flex h-[46%] flex-col gap-[0.8vw] px-[3vw] max-[768px]:gap-3 max-[768px]:px-[6vw] ${
            isTop ? "top-0 justify-start" : "bottom-0 justify-end"
          }`}
        >
          <p
            className="font-mono text-[clamp(0.7rem,1vw,0.9rem)] uppercase tracking-[0.16em] max-[768px]:text-xs"
            style={mutedTextStyle}
          >
            {item.dateLabel}
          </p>
          <h3 className="text-[clamp(1.75rem,2.4vw,2.8rem)] leading-[0.95] max-[768px]:text-[clamp(1.9rem,6.8vw,2.8rem)]">
            {item.title}
          </h3>
          <p
            className="max-w-[30vw] text-[clamp(0.9rem,1.25vw,1.15rem)] leading-[1.35] max-[768px]:max-w-[62vw] max-[768px]:text-[clamp(0.95rem,4vw,1.2rem)]"
            style={mutedTextStyle}
          >
            {item.content}
          </p>
        </article>
      </li>
    );
  };

  return (
    <section
      ref={sectionRef}
      id="journey"
      aria-label="ECell RV University journey from 2023 to 2026"
      className="relative w-full text-left"
      style={sectionStyle}
    >
      <div className="sticky top-0 flex h-svh w-screen items-center overflow-hidden">
        <div
          ref={trackRef}
          className="flex h-[72svh] w-max shrink-0 items-center pr-[44vw] will-change-transform max-[768px]:h-[76svh]"
        >
          <div className="flex h-full w-screen shrink-0 items-center justify-center px-6 text-center">
            {intro}
          </div>

          <div className="relative h-full w-max shrink-0">
            <span
              data-timeline-line
              aria-hidden="true"
              className="absolute inset-x-0 top-1/2 h-px rounded-full"
              style={activeStyle}
            />
            <ol className="m-0 flex h-full w-max list-none gap-[4vw] p-0 max-[768px]:gap-[8vw]">
              {journeyItems.map(renderJourneyItem)}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
