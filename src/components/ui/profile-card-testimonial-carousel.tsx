// Adapted from the 21st.dev "profile card testimonial carousel".
// Rebuilt on the site's stack: GSAP instead of framer-motion, the site's dark
// palette and type instead of light/dark gray tokens, and data passed in as props.
//
// Spacing utilities carry Tailwind's `!` suffix on purpose: src/styles/global.css
// ships an unlayered `* { margin: 0; padding: 0 }` reset, and unlayered rules
// beat Tailwind v4's layered utilities regardless of specificity.

"use client";

import {
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
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { gsap } from "@/src/utils/gsapSetup";

export interface Testimonial {
  id: string | number;
  name: string;
  /** Role or job title, shown under the name. */
  title: string;
  company?: string;
  /** The quote or short description shown in the card body. */
  description: string;
  image: StaticImageData | string;
  /** CSS object-position that keeps the face in frame, e.g. "89% 25%". */
  imagePosition?: string;
  githubUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;
  linkedinUrl?: string;
}

export interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  className?: string;
  /** Accessible name for the carousel region. */
  label?: string;
  /** Noun used in control labels, e.g. "Next speaker". */
  itemNoun?: string;
  /** Milliseconds each slide stays up before auto-advancing. 0 disables it. */
  autoplayMs?: number;
}

const SWIPE_THRESHOLD_PX = 40;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const EASE = "ease-[cubic-bezier(0.32,0.72,0,1)]";

// Keyframes for the autoplay progress line. Kept local so the component stays
// drop-in, the same way motion-footer ships its own styles.
const STYLES = `
@keyframes ecell-carousel-progress {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
`;

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

const pad2 = (value: number) => String(value).padStart(2, "0");

// lucide-react 1.x no longer ships brand icons, so the outline marks from its
// earlier releases are inlined here to keep the same look.
const ICON_PATHS = {
  GitHub: (
    <>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </>
  ),
  Twitter: (
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  ),
  YouTube: (
    <>
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </>
  ),
  LinkedIn: (
    <path
      fill="currentColor"
      stroke="none"
      d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z"
    />
  ),
} as const;

type SocialLabel = keyof typeof ICON_PATHS;

// Brand colours make each network recognisable at a glance.
const SOCIAL_STYLES: Record<SocialLabel, string> = {
  GitHub: "bg-[#24292f] hover:bg-[#32383f]",
  Twitter: "bg-[#1d9bf0] hover:bg-[#1a8cd8]",
  YouTube: "bg-[#ff0033] hover:bg-[#e6002e]",
  LinkedIn: "bg-[#0a66c2] hover:bg-[#0b74dc]",
};

function SocialIcon({ label, className }: { label: SocialLabel; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {ICON_PATHS[label]}
    </svg>
  );
}

export function TestimonialCarousel({
  testimonials,
  className,
  label = "Testimonials",
  itemNoun = "testimonial",
  autoplayMs = 7000,
}: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocusWithin, setHasFocusWithin] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const rootRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const hasMountedRef = useRef(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const count = testimonials.length;
  const safeIndex = count === 0 ? 0 : Math.min(currentIndex, count - 1);
  const current = testimonials[safeIndex];

  const autoplayEnabled = autoplayMs > 0 && count > 1 && !prefersReducedMotion;
  const isPaused = isHovered || hasFocusWithin || !isInView;

  const goTo = useCallback(
    (index: number) => {
      if (count === 0) return;
      setCurrentIndex(((index % count) + count) % count);
    },
    [count],
  );
  const handleNext = useCallback(() => goTo(safeIndex + 1), [goTo, safeIndex]);
  const handlePrevious = useCallback(() => goTo(safeIndex - 1), [goTo, safeIndex]);

  // Only run the autoplay clock while the carousel is actually on screen. The
  // section lives in a horizontally pinned track, so it is off screen most of
  // the time.
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

  // Stagger the copy in whenever the slide changes. Runs before paint so the
  // new text never flashes at full opacity first.
  useLayoutEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    const content = contentRef.current;
    if (!content || window.matchMedia(REDUCED_MOTION_QUERY).matches) return;

    const tween = gsap.fromTo(
      content.querySelectorAll("[data-carousel-reveal]"),
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.06 },
    );
    return () => {
      tween.kill();
    };
  }, [safeIndex]);

  // Arrow keys work while focus is anywhere inside the carousel, rather than
  // hijacking the arrow keys for the whole page.
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      handleNext();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      handlePrevious();
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
    // Only treat clearly horizontal gestures as swipes so vertical scrolling
    // through the panel keeps working.
    if (Math.abs(deltaX) <= Math.abs(deltaY) || Math.abs(deltaX) <= SWIPE_THRESHOLD_PX) return;
    if (deltaX > 0) handleNext();
    else handlePrevious();
  };

  if (!current) return null;

  const subtitle = [current.title, current.company].filter(Boolean).join(" · ");
  const socialLinks = (
    [
      { label: "GitHub", url: current.githubUrl },
      { label: "Twitter", url: current.twitterUrl },
      { label: "YouTube", url: current.youtubeUrl },
      { label: "LinkedIn", url: current.linkedinUrl },
    ] satisfies { label: SocialLabel; url?: string }[]
  ).filter((link): link is { label: SocialLabel; url: string } => Boolean(link.url));

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
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* One split panel: photo on one side, story on the other. */}
      <div
        data-carousel-stage
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={cn(
          "relative flex flex-col overflow-hidden rounded-[28px] border border-white/8 md:flex-row",
          "bg-[linear-gradient(160deg,#1d1e21_0%,#151618_55%,#121315_100%)]",
          "shadow-[0_40px_100px_-20px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.06)]",
        )}
      >
        {/* Photo: every image stays mounted and cross-fades, so switching
            slides never waits on a network request. The active photo drifts
            in slowly for a little life. */}
        <div
          className={cn(
            "relative w-full shrink-0 overflow-hidden bg-[#181a1d]",
            "h-[clamp(210px,34dvh,300px)]",
            "md:h-auto md:min-h-[clamp(320px,52dvh,470px)] md:w-[clamp(300px,min(42vw,52dvh),460px)]",
          )}
        >
          {testimonials.map((item, index) => {
            const isActive = index === safeIndex;
            return (
              <Image
                key={item.id}
                src={item.image}
                alt={isActive ? item.name : ""}
                aria-hidden={!isActive}
                fill
                sizes="(max-width: 768px) 100vw, 460px"
                priority={index === 0}
                draggable={false}
                className="object-cover"
                style={{
                  objectPosition: item.imagePosition ?? "center 25%",
                  opacity: isActive ? 1 : 0,
                  transform: isActive && !prefersReducedMotion ? "scale(1.06)" : "scale(1)",
                  transition: isActive
                    ? "opacity 700ms cubic-bezier(0.32,0.72,0,1), transform 9s linear"
                    : "opacity 700ms cubic-bezier(0.32,0.72,0,1), transform 0s linear 700ms",
                }}
              />
            );
          })}
          {/* Soft fade into the panel so photo and copy read as one surface. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(18,19,21,0.85)_100%)] md:bg-[linear-gradient(90deg,transparent_70%,rgba(21,22,24,0.55)_100%)]"
          />
        </div>

        {/* Story */}
        <div
          aria-live={autoplayEnabled && !isPaused ? "off" : "polite"}
          className="relative flex min-w-0 flex-1 flex-col p-6! md:p-10!"
        >
          {/* Oversized quote mark as a quiet backdrop. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-2 right-6 font-(family-name:--font-archivo) text-[120px] leading-none font-black text-white/5 select-none md:top-4 md:right-10 md:text-[180px]"
          >
            &ldquo;
          </span>

          <div ref={contentRef} className="relative flex flex-1 flex-col gap-6 md:gap-8">
            <span
              data-carousel-reveal
              className="font-(family-name:--font-archivo) text-xs tracking-[0.22em] text-(--color-lightgrey) tabular-nums"
            >
              <span className="text-(--fg)">{pad2(safeIndex + 1)}</span>
              <span className="mx-2! opacity-50">/</span>
              {pad2(count)}
            </span>

            <blockquote
              data-carousel-reveal
              className="text-[17px] leading-[1.55] font-medium tracking-[-0.01em] text-(--fg) md:text-[clamp(19px,1.9vw,24px)] md:leading-[1.5]"
            >
              &ldquo;{current.description}&rdquo;
            </blockquote>

            <div
              data-carousel-reveal
              className="mt-auto! flex items-end justify-between gap-4 border-t border-white/8 pt-5! md:pt-6!"
            >
              <div className="flex min-w-0 flex-col gap-1.5">
                <h3 className="text-[clamp(20px,2.1vw,26px)] leading-tight font-bold tracking-[-0.02em] text-(--fg)">
                  {current.name}
                </h3>
                <p className="text-[13px] leading-snug font-medium text-(--color-lightgrey) md:text-sm">
                  {subtitle}
                </p>
              </div>

              {socialLinks.length > 0 && (
                <div className="flex shrink-0 gap-2.5">
                  {socialLinks.map(({ label: network, url }) => (
                    <a
                      key={network}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${current.name} on ${network}`}
                      className={cn(
                        "grid size-11 place-items-center rounded-full text-white shadow-[0_8px_20px_rgba(0,0,0,0.35)] md:size-12",
                        "transition-[transform,background-color] duration-400 hover:-translate-y-0.5 hover:scale-105 active:scale-95 motion-reduce:transition-none",
                        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--fg)",
                        SOCIAL_STYLES[network],
                        EASE,
                      )}
                    >
                      <SocialIcon label={network} className="size-5" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Autoplay progress: restarts per slide, pauses on hover, focus, or
            when scrolled away, and advances the slide when it fills. */}
        {autoplayEnabled && (
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 bg-white/6">
            <span
              key={safeIndex}
              data-carousel-progress
              onAnimationEnd={handleNext}
              className="block h-full origin-left bg-(--fg)/70"
              style={{
                animation: `ecell-carousel-progress ${autoplayMs}ms linear forwards`,
                animationPlayState: isPaused ? "paused" : "running",
              }}
            />
          </div>
        )}
      </div>

      {/* Navigation: arrows around a row of speaker thumbnails. */}
      <div className="mt-6! flex items-center justify-center gap-4 md:mt-8! md:gap-6">
        <NavButton label={`Previous ${itemNoun}`} onClick={handlePrevious}>
          <ChevronLeft className="size-5" aria-hidden="true" />
        </NavButton>

        <div className="flex items-center gap-2 md:gap-3">
          {testimonials.map((item, index) => {
            const isActive = index === safeIndex;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Go to ${itemNoun} ${index + 1}: ${item.name}`}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "relative size-9 cursor-pointer overflow-hidden rounded-full md:size-11",
                  "ring-offset-2 ring-offset-(--bg) transition-[transform,opacity,filter,box-shadow] duration-500 motion-reduce:transition-none",
                  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--fg)",
                  EASE,
                  isActive
                    ? "scale-110 opacity-100 ring-2 ring-(--fg)"
                    : "opacity-45 ring-1 ring-white/10 grayscale hover:opacity-80 hover:grayscale-0",
                )}
              >
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="44px"
                  className="object-cover"
                  style={{ objectPosition: item.imagePosition ?? "center 25%" }}
                />
              </button>
            );
          })}
        </div>

        <NavButton label={`Next ${itemNoun}`} onClick={handleNext}>
          <ChevronRight className="size-5" aria-hidden="true" />
        </NavButton>
      </div>
    </div>
  );
}

function NavButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "grid size-11 shrink-0 cursor-pointer place-items-center rounded-full border border-white/10 bg-[#1f2023] text-(--fg) md:size-12",
        "transition-[transform,background-color,color,border-color] duration-400 motion-reduce:transition-none",
        "hover:scale-105 hover:border-(--fg) hover:bg-(--fg) hover:text-[#08090a] active:scale-95",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--fg)",
        EASE,
      )}
    >
      {children}
    </button>
  );
}
