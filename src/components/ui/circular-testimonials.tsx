// Adapted from the 21st.dev "circular testimonials" component.
// Rebuilt on the site's stack: GSAP instead of framer-motion, lucide instead of
// react-icons, Tailwind instead of styled-jsx, and next/image for the photos.
//
// Spacing utilities carry Tailwind's `!` suffix on purpose: src/styles/global.css
// ships an unlayered `* { margin: 0; padding: 0 }` reset, and unlayered rules
// beat Tailwind v4's layered utilities regardless of specificity.

"use client";

import {
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
  type TouchEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Image, { type StaticImageData } from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { gsap } from "@/src/utils/gsapSetup";

export interface CircularTestimonial {
  quote: string;
  name: string;
  designation: string;
  src: StaticImageData | string;
  /** CSS object-position that keeps the face in frame, e.g. "89% 25%". */
  imagePosition?: string;
  linkedinUrl?: string;
}

interface Colors {
  name?: string;
  designation?: string;
  testimony?: string;
  arrowBackground?: string;
  arrowForeground?: string;
  arrowHoverBackground?: string;
  arrowHoverForeground?: string;
}

interface FontSizes {
  name?: string;
  designation?: string;
  quote?: string;
}

export interface CircularTestimonialsProps {
  testimonials: CircularTestimonial[];
  /** Advance every `autoplayMs` until the visitor navigates manually. */
  autoplay?: boolean;
  autoplayMs?: number;
  colors?: Colors;
  fontSizes?: FontSizes;
  className?: string;
  /** Accessible name for the carousel region. */
  label?: string;
  /** Noun used in control labels, e.g. "Next speaker". */
  itemNoun?: string;
}

const SWIPE_THRESHOLD_PX = 40;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const STACK_TRANSITION = "transform 0.8s cubic-bezier(.4,2,.3,1), opacity 0.8s cubic-bezier(.4,2,.3,1)";

/** Horizontal offset of the side photos, scaled with the stage width. */
function calculateGap(width: number) {
  const minWidth = 1024;
  const maxWidth = 1456;
  const minGap = 60;
  const maxGap = 86;
  if (width <= minWidth) return minGap;
  if (width >= maxWidth) return Math.max(minGap, maxGap + 0.06018 * (width - maxWidth));
  return minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth));
}

function subscribeToReducedMotion(callback: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => true,
  );
}

function LinkedInGlyph({ className }: { className?: string }) {
  // lucide-react 1.x no longer ships brand icons, so the mark is inlined.
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  );
}

export function CircularTestimonials({
  testimonials,
  autoplay = true,
  autoplayMs = 5000,
  colors = {},
  fontSizes = {},
  className,
  label = "Testimonials",
  itemNoun = "testimonial",
}: CircularTestimonialsProps) {
  // Defaults follow the site's dark palette (src/styles/global.css).
  const colorName = colors.name ?? "var(--fg)";
  const colorDesignation = colors.designation ?? "var(--color-lightgrey)";
  const colorTestimony = colors.testimony ?? "rgba(244, 244, 242, 0.82)";
  const colorArrowBg = colors.arrowBackground ?? "#1f2023";
  const colorArrowFg = colors.arrowForeground ?? "var(--fg)";
  const colorArrowHoverBg = colors.arrowHoverBackground ?? "var(--fg)";
  const colorArrowHoverFg = colors.arrowHoverForeground ?? "#08090a";
  const fontSizeName = fontSizes.name ?? "clamp(22px, 2.2vw, 28px)";
  const fontSizeDesignation = fontSizes.designation ?? "clamp(13px, 1.1vw, 15px)";
  const fontSizeQuote = fontSizes.quote ?? "clamp(15px, 1.45vw, 19px)";

  const [activeIndex, setActiveIndex] = useState(0);
  const [stageWidth, setStageWidth] = useState(1200);
  const [autoplayStopped, setAutoplayStopped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocusWithin, setHasFocusWithin] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const rootRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const hasMountedRef = useRef(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const count = testimonials.length;
  const safeIndex = count === 0 ? 0 : Math.min(activeIndex, count - 1);
  const active = testimonials[safeIndex];

  const advance = useCallback(
    (step: number) => {
      if (count === 0) return;
      setActiveIndex((prev) => (((prev + step) % count) + count) % count);
    },
    [count],
  );

  // Manual navigation stops autoplay for good, as in the original component.
  const handleNext = useCallback(() => {
    setAutoplayStopped(true);
    advance(1);
  }, [advance]);
  const handlePrev = useCallback(() => {
    setAutoplayStopped(true);
    advance(-1);
  }, [advance]);

  // The side-photo offset scales with the stage. A ResizeObserver also catches
  // layout changes that are not window resizes, such as the pinned track.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const measure = () => setStageWidth(stage.offsetWidth);
    measure();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  // Only autoplay while the carousel is on screen. The section lives in a
  // horizontally pinned track, so it is off screen most of the time.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting && entry.intersectionRatio >= 0.5),
      { threshold: [0, 0.5, 1] },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  const autoplayRunning =
    autoplay &&
    !autoplayStopped &&
    !prefersReducedMotion &&
    count > 1 &&
    isInView &&
    !isHovered &&
    !hasFocusWithin;

  useEffect(() => {
    if (!autoplayRunning) return;
    const interval = window.setInterval(() => advance(1), autoplayMs);
    return () => window.clearInterval(interval);
  }, [autoplayRunning, autoplayMs, advance]);

  // Name and designation slide up, then the quote resolves word by word out
  // of a blur. Runs before paint so the new copy never flashes in fully first.
  useLayoutEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    const content = contentRef.current;
    if (!content || window.matchMedia(REDUCED_MOTION_QUERY).matches) return;

    const timeline = gsap.timeline();
    timeline.fromTo(
      content.querySelectorAll("[data-reveal]"),
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.3, ease: "power1.inOut", stagger: 0.04 },
      0,
    );
    timeline.fromTo(
      content.querySelectorAll("[data-word]"),
      { opacity: 0, y: 5, filter: "blur(10px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.22, ease: "power1.inOut", stagger: 0.025 },
      0.1,
    );
    return () => {
      timeline.kill();
    };
  }, [safeIndex]);

  // Arrow keys work while focus is inside the carousel, rather than hijacking
  // the arrow keys for the whole page.
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      handleNext();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      handlePrev();
    }
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start) return;
    const touch = event.changedTouches[0];
    const deltaX = start.x - touch.clientX;
    const deltaY = start.y - touch.clientY;
    // Only clearly horizontal gestures count, so vertical scrolling still works.
    if (Math.abs(deltaX) <= Math.abs(deltaY) || Math.abs(deltaX) <= SWIPE_THRESHOLD_PX) return;
    if (deltaX > 0) handleNext();
    else handlePrev();
  };

  // Always show three photos: the active one in front, its neighbours tucked
  // behind on either side, everything else hidden.
  function getImageStyle(index: number): CSSProperties {
    const gap = calculateGap(stageWidth);
    const maxStickUp = gap * 0.8;
    const transition = prefersReducedMotion ? "none" : STACK_TRANSITION;
    const isActive = index === safeIndex;
    const isLeft = (safeIndex - 1 + count) % count === index;
    const isRight = (safeIndex + 1) % count === index;

    if (isActive) {
      return { zIndex: 3, opacity: 1, transform: "translateX(0) translateY(0) scale(1) rotateY(0deg)", transition };
    }
    if (isLeft && count > 1) {
      return {
        zIndex: 2,
        opacity: 1,
        transform: `translateX(-${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(15deg)`,
        transition,
      };
    }
    if (isRight && count > 2) {
      return {
        zIndex: 2,
        opacity: 1,
        transform: `translateX(${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(-15deg)`,
        transition,
      };
    }
    return { zIndex: 1, opacity: 0, transform: "scale(0.7)", transition };
  }

  if (!active) return null;

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setHasFocusWithin(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setHasFocusWithin(false);
        }
      }}
      className={cn("mx-auto! w-full max-w-5xl", className)}
    >
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-[clamp(48px,6vw,80px)]">
        {/* Photos */}
        <div
          ref={stageRef}
          data-carousel-stage
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative mt-12! h-[clamp(210px,32dvh,300px)] w-full perspective-[1000px] md:mt-10! md:h-[clamp(300px,46dvh,384px)]"
        >
          {testimonials.map((testimonial, index) => {
            const isActive = index === safeIndex;
            return (
              <div
                key={testimonial.name}
                aria-hidden={!isActive}
                className="absolute inset-0 overflow-hidden rounded-3xl bg-[#181a1d] shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
                style={{ ...getImageStyle(index), pointerEvents: "none" }}
              >
                <Image
                  src={testimonial.src}
                  alt={isActive ? testimonial.name : ""}
                  fill
                  sizes="(max-width: 768px) 90vw, 480px"
                  priority={index === 0}
                  draggable={false}
                  className="object-cover"
                  style={{ objectPosition: testimonial.imagePosition ?? "center 25%" }}
                />
              </div>
            );
          })}
        </div>

        {/* Copy */}
        <div className="flex flex-col justify-between gap-8 md:gap-12">
          <div ref={contentRef} aria-live={autoplayRunning ? "off" : "polite"}>
            <h3
              data-reveal
              className="mb-1! leading-tight font-bold tracking-[-0.02em]"
              style={{ color: colorName, fontSize: fontSizeName }}
            >
              {active.name}
            </h3>
            <p
              data-reveal
              className="mb-6! font-medium md:mb-8!"
              style={{ color: colorDesignation, fontSize: fontSizeDesignation }}
            >
              {active.designation}
            </p>
            <p className="leading-[1.75]" style={{ color: colorTestimony, fontSize: fontSizeQuote }}>
              {/* Screen readers get the sentence whole; the split words are visual only. */}
              <span className="sr-only">{active.quote}</span>
              <span aria-hidden="true">
                {active.quote.split(" ").map((word, i) => (
                  <span key={`${safeIndex}-${i}`} data-word className="inline-block">
                    {word}&nbsp;
                  </span>
                ))}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <ArrowButton
              label={`Previous ${itemNoun}`}
              onClick={handlePrev}
              background={colorArrowBg}
              foreground={colorArrowFg}
              hoverBackground={colorArrowHoverBg}
              hoverForeground={colorArrowHoverFg}
            >
              <ArrowLeft className="size-5" aria-hidden="true" />
            </ArrowButton>
            <ArrowButton
              label={`Next ${itemNoun}`}
              onClick={handleNext}
              background={colorArrowBg}
              foreground={colorArrowFg}
              hoverBackground={colorArrowHoverBg}
              hoverForeground={colorArrowHoverFg}
            >
              <ArrowRight className="size-5" aria-hidden="true" />
            </ArrowButton>

            {active.linkedinUrl && (
              <a
                href={active.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${active.name} on LinkedIn`}
                className={cn(
                  "ml-auto! grid size-11 place-items-center rounded-full bg-[#0a66c2] text-white shadow-[0_8px_20px_rgba(0,0,0,0.35)] md:size-12",
                  "transition-[transform,background-color] duration-300 hover:scale-105 hover:bg-[#0b74dc] active:scale-95 motion-reduce:transition-none",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--fg)",
                )}
              >
                <LinkedInGlyph className="size-5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ArrowButton({
  label,
  onClick,
  background,
  foreground,
  hoverBackground,
  hoverForeground,
  children,
}: {
  label: string;
  onClick: () => void;
  background: string;
  foreground: string;
  hoverBackground: string;
  hoverForeground: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "grid size-11 cursor-pointer place-items-center rounded-full border border-white/10 md:size-12",
        "bg-(--arrow-bg) text-(--arrow-fg) hover:bg-(--arrow-hover-bg) hover:text-(--arrow-hover-fg)",
        "transition-[background-color,color,transform] duration-300 active:scale-95 motion-reduce:transition-none",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--fg)",
      )}
      style={
        {
          "--arrow-bg": background,
          "--arrow-fg": foreground,
          "--arrow-hover-bg": hoverBackground,
          "--arrow-hover-fg": hoverForeground,
        } as CSSProperties
      }
    >
      {children}
    </button>
  );
}

export default CircularTestimonials;
