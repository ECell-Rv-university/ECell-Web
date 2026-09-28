"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  type MouseEvent,
} from "react";
import Image, { type StaticImageData } from "next/image";
import "./DepthCarousel.css";

/* ────────────────────────────── TYPES ────────────────────────────── */

export interface DepthCarouselItem {
  image: string | StaticImageData;
  alt: string;
}

interface DepthCarouselProps {
  items: DepthCarouselItem[];
  depth?: number;
  spread?: number;
  tilt?: number;
  tiltDirection?: "left" | "right";
  perspective?: number;
  visibleCards?: number;
  falloff?: number;
  blur?: number;
  autoplay?: boolean;
  loop?: boolean;
  onCardClick?: (index: number) => void;
  autoplayInterval?: number;
}

/* ────────────────────────────── HELPERS ────────────────────────────── */

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

/* ────────────────────────────── COMPONENT ────────────────────────────── */

export default function DepthCarousel({
  items,
  depth = 220,
  spread = 90,
  tilt = 22,
  tiltDirection = "right",
  perspective = 1400,
  visibleCards = 4,
  falloff = 0.2,
  blur = 6,
  autoplay = false,
  loop = true,
  onCardClick,
  autoplayInterval = 3500,
}: DepthCarouselProps) {
  const [active, setActive] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const total = items.length;

  useEffect(() => {
    const updateViewportWidth = () => setViewportWidth(window.innerWidth);
    updateViewportWidth();
    window.addEventListener("resize", updateViewportWidth);
    return () => window.removeEventListener("resize", updateViewportWidth);
  }, []);

  // Keep the fan usable on touch screens. Desktop keeps the full visual
  // treatment, while smaller screens use a tighter stack around the active
  // photo instead of pushing the page wider than the viewport.
  const isPhone = viewportWidth > 0 && viewportWidth <= 640;
  const isTablet = viewportWidth > 640 && viewportWidth <= 860;
  const effectiveDepth = isPhone ? Math.min(depth, 90) : isTablet ? Math.min(depth, 140) : depth;
  const effectiveSpread = isPhone ? Math.min(spread, 28) : isTablet ? Math.min(spread, 48) : spread;
  const effectiveTilt = isPhone ? Math.min(tilt, 9) : isTablet ? Math.min(tilt, 14) : tilt;
  const effectivePerspective = isPhone ? Math.min(perspective, 800) : perspective;
  const effectiveVisibleCards = isPhone ? Math.min(visibleCards, 2) : isTablet ? Math.min(visibleCards, 3) : visibleCards;

  const prev = useCallback(() => {
    setActive((a) => (loop ? mod(a - 1, total) : Math.max(a - 1, 0)));
  }, [loop, total]);

  const next = useCallback(() => {
    setActive((a) => (loop ? mod(a + 1, total) : Math.min(a + 1, total - 1)));
  }, [loop, total]);

  /* autoplay */
  useEffect(() => {
    if (!autoplay || isHovered) return;
    timerRef.current = setTimeout(next, autoplayInterval);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [autoplay, isHovered, active, next, autoplayInterval]);

  /* keyboard: only applies to this carousel when hovered, and never when lightbox is open */
  useEffect(() => {
    if (!isHovered) return;
    const handler = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (document.querySelector(".lightbox-overlay")) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isHovered, prev, next]);

  /* drag / swipe tracking without breaking click */
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const isDraggingRef = useRef(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
    isDraggingRef.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!pointerStartRef.current) return;
    const dx = e.clientX - pointerStartRef.current.x;
    const dy = e.clientY - pointerStartRef.current.y;
    if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
      isDraggingRef.current = true;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!pointerStartRef.current) return;
    const dx = e.clientX - pointerStartRef.current.x;
    if (isDraggingRef.current && Math.abs(dx) > 40) {
      if (dx < 0) next();
      else prev();
    }
    pointerStartRef.current = null;
    window.setTimeout(() => {
      isDraggingRef.current = false;
    }, 50);
  };

  const handlePointerCancel = () => {
    pointerStartRef.current = null;
    isDraggingRef.current = false;
  };

  const dirMult = tiltDirection === "right" ? 1 : -1;
  const visCount = Math.min(effectiveVisibleCards, total);
  const cardIndices = Array.from({ length: visCount }, (_, i) => mod(active + i, total));

  const handleCardClick = (itemIdx: number, stackPos: number, e: MouseEvent) => {
    e.stopPropagation();
    if (isDraggingRef.current) return;
    setActive(itemIdx);
    onCardClick?.(itemIdx);
  };

  return (
    <div
      className="dc-root"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="dc-scene"
        style={{ perspective: `${effectivePerspective}px` }}
      >
        {[...cardIndices].reverse().map((itemIdx, revPos) => {
          const stackPos = cardIndices.length - 1 - revPos;
          const item = items[itemIdx];
          const xOff = stackPos * effectiveSpread * dirMult;
          const zOff = -stackPos * effectiveDepth;
          const rot = stackPos * effectiveTilt * dirMult;
          const opacity = Math.max(0, 1 - stackPos * falloff);
          const blurPx = stackPos === 0 ? 0 : stackPos * blur;
          const scale = 1 - stackPos * 0.04;
          const transform = `translateX(${xOff}px) translateZ(${zOff}px) rotateY(${rot}deg) scale(${scale})`;

          return (
            <button
              key={`${itemIdx}-${stackPos}`}
              type="button"
              className={`dc-card${stackPos === 0 ? " dc-card--active" : ""}`}
              style={{
                transform,
                opacity,
                filter: blurPx > 0 ? `blur(${blurPx}px)` : undefined,
                zIndex: cardIndices.length - stackPos,
                cursor: stackPos === 0 ? "zoom-in" : "pointer",
              }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerCancel}
              onClick={(e) => handleCardClick(itemIdx, stackPos, e)}
              aria-label={`View full photo: ${item.alt}`}
            >
              <div className="dc-card__inner">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 32vw"
                  style={{ objectFit: "cover" }}
                  quality={75}
                  loading="lazy"
                />
                {stackPos === 0 && <div className="dc-card__shine" aria-hidden />}
              </div>
            </button>
          );
        })}
      </div>

      <div className="dc-controls">
        <button
          type="button"
          className="dc-btn dc-btn--prev"
          onClick={prev}
          disabled={!loop && active === 0}
          aria-label="Previous photo"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className="dc-dots">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to photo ${i + 1}`}
              className={`dc-dot${i === active ? " dc-dot--active" : ""}`}
              onClick={() => setActive(i)}
            />
          ))}
        </div>

        <button
          type="button"
          className="dc-btn dc-btn--next"
          onClick={next}
          disabled={!loop && active === total - 1}
          aria-label="Next photo"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <p className="dc-counter">
        <span className="dc-counter__current">{String(active + 1).padStart(2, "0")}</span>
        <span className="dc-counter__sep"> / </span>
        <span className="dc-counter__total">{String(total).padStart(2, "0")}</span>
      </p>
    </div>
  );
}
