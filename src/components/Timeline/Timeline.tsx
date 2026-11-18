// Built using Hyperiux Vault: https://vault.hyperiux.com

"use client";

import {
  type CSSProperties,
  type ReactNode,
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
} from "react";
import dynamic from "next/dynamic";
import { gsap, ScrollTrigger } from "@/src/utils/gsapSetup";
import { TIMELINE, type TimelineItem } from "@/src/content/timeline";
import CosmicPlanet from "@/src/components/Cosmic/CosmicPlanets";

const SolarBeamCanvas = dynamic(() => import("./SolarBeamCanvas"), {
  ssr: false,
});

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

export default function Timeline({
  intro,
  textColor = "var(--fg, #f4f4f2)",
  mutedTextColor = "rgba(244, 244, 242, 0.64)",
  activeColor = "#f6b94e",
  backgroundColor = "var(--bg, #1a1a1a)",
  duration,
  scrollDuration = 1.2,
}: TimelineProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const beamProgressRef = useRef(0);
  const reducedMotion = usePrefersReducedMotion();
  const normalizedDuration = Math.max(0.2, duration ?? scrollDuration);

  const sectionStyle: CSSProperties = {
    color: textColor,
    backgroundColor,
  };
  const dotStyle: CSSProperties = {
    background: "radial-gradient(circle, #fffaf0 0%, #ffd27d 52%, #f59e0b 100%)",
    boxShadow: `0 0 14px ${activeColor}`,
  };
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
      const sunEmitter = section.querySelector<HTMLElement>(
        "[data-timeline-sun]",
      );
      if (!progressLine) return;

      const scrollConfig = {
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        invalidateOnRefresh: true,
      } as const;

      gsap.set(progressLine, { scaleX: 0, transformOrigin: "left center" });

      const updateBeamProgress = (scrollProgress: number) => {
        const vw = window.innerWidth;
        const lineW = Math.max(1, progressLine.offsetWidth);
        const totalShift = Math.max(0, track.scrollWidth - vw);
        const containerScreenLeft = vw - scrollProgress * totalShift;
        const focalScreenX = vw * (0.72 - 0.16 * scrollProgress);
        const localTipX = Math.min(
          lineW,
          Math.max(0, focalScreenX - containerScreenLeft),
        );
        const synced = scrollProgress >= 0.995 ? 1 : localTipX / lineW;
        beamProgressRef.current = synced;
        gsap.set(progressLine, {
          scaleX: synced,
          transformOrigin: "left center",
        });
      };

      const horizontalTween = gsap.to(track, {
        x: () => Math.min(0, window.innerWidth - track.scrollWidth),
        ease: "none",
        scrollTrigger: {
          ...scrollConfig,
          onUpdate: (self) => {
            updateBeamProgress(self.progress);
          },
        },
      });

      if (sunEmitter) {
        gsap.fromTo(
          sunEmitter,
          { xPercent: -50, yPercent: -50, scale: 0.88, rotation: -12 },
          {
            xPercent: -50,
            yPercent: -50,
            scale: 1.06,
            rotation: 42,
            ease: "none",
            scrollTrigger: scrollConfig,
          },
        );
      }

      TIMELINE.forEach((item) => {
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
            { xPercent: -50, yPercent: -50, scale: 0 },
            {
              xPercent: -50,
              yPercent: -50,
              scale: 1,
              duration: normalizedDuration * 0.4,
              ease: "back.out(2.2)",
            },
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
        <div className="mx-auto mb-16 max-w-6xl text-center">{intro}</div>
        <div
          aria-hidden="true"
          className="mx-auto mb-10 flex max-w-4xl items-center gap-4"
        >
          <div className="relative size-16 shrink-0">
            <CosmicPlanet
              type="sun"
              idPrefix="timeline-rm"
              style={{ top: "0%", left: "0%", width: "100%" }}
              showTelemetry={false}
            />
          </div>
          <span
            className="h-px flex-1 rounded-full opacity-60"
            style={{
              background:
                "linear-gradient(90deg, #fff7dc 0%, #f6b94e 55%, transparent 100%)",
            }}
          />
        </div>
        <ol
          className="relative mx-auto max-w-4xl list-none border-l pl-8"
          style={{ borderColor: activeColor }}
        >
          {TIMELINE.map((item) => (
            <li key={item.id} className="relative pb-14 last:pb-0">
              <span
                aria-hidden="true"
                className="absolute left-[-2.05rem] top-1.5 size-3 -translate-x-1/2 rounded-full"
                style={dotStyle}
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

  const renderTimelineItem = (item: TimelineItem) => {
    const isTop = item.order % 2 === 1;
    const stemStyle: CSSProperties = {
      transform: "scaleY(0)",
      transformOrigin: isTop ? "bottom center" : "top center",
      background: isTop
        ? "linear-gradient(to top, #fff7dc 0%, rgba(246, 185, 78, 0.85) 35%, rgba(246, 185, 78, 0.14) 100%)"
        : "linear-gradient(to bottom, #fff7dc 0%, rgba(246, 185, 78, 0.85) 35%, rgba(246, 185, 78, 0.14) 100%)",
    };

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
          style={stemStyle}
        />
        <span
          data-timeline-dot={item.id}
          aria-hidden="true"
          className="absolute left-0 top-1/2 z-[2] size-[clamp(0.65rem,1vw,0.9rem)] rounded-full"
          style={{
            ...dotStyle,
            transform: "translate(-50%, -50%) scale(0)",
          }}
        />
        <article
          data-timeline-copy={item.id}
          className={`absolute inset-x-0 flex h-[46%] flex-col gap-[0.8vw] max-[768px]:gap-3 ${
            isTop ? "top-0 justify-start" : "bottom-0 justify-end"
          }`}
          style={{ paddingInline: "clamp(1.25rem, 3vw, 2.75rem)" }}
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
          className="flex h-[72svh] w-max shrink-0 items-center will-change-transform max-[768px]:h-[76svh]"
          style={{ paddingRight: "44vw" }}
        >
          <div
            className="flex h-full w-screen shrink-0 items-center justify-center text-center"
            style={{ paddingInline: "1.5rem" }}
          >
            {intro}
          </div>

          <div className="relative h-full w-max shrink-0">
            <div
              data-timeline-sun
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-1/2 z-10 size-[clamp(120px,13vw,190px)]"
              style={{
                transform: "translate(-50%, -50%) scale(0.88) rotate(-12deg)",
              }}
            >
              <CosmicPlanet
                type="sun"
                idPrefix="timeline"
                style={{ top: "0%", left: "0%", width: "100%" }}
                showTelemetry={false}
              />
            </div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 z-[1]"
              style={{
                left: "-140px",
                right: "-40px",
                height: "320px",
                marginTop: "-160px",
              }}
            >
              <SolarBeamCanvas
                progressRef={beamProgressRef}
                originOffsetPx={140}
                className="size-full"
              />
            </div>
            <span
              data-timeline-line
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-1/2 h-px rounded-full opacity-65"
              style={{
                marginTop: "-0.5px",
                transform: "scaleX(0)",
                transformOrigin: "left center",
                background:
                  "linear-gradient(90deg, #ffffff 0%, #fff4cc 60%, #f6b94e 100%)",
              }}
            />
            <ol
              className="m-0 flex h-full w-max list-none gap-[4vw] max-[768px]:gap-[8vw]"
              style={{ paddingLeft: "clamp(7rem, 11vw, 10.5rem)" }}
            >
              {TIMELINE.map(renderTimelineItem)}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
