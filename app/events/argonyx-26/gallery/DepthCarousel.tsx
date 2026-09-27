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
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const total = items.length;

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

  /* keyboard */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next]);

  /* drag / swipe */
  const dragStartX = useRef<number | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    const dx = e.clientX - dragStartX.current;
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
    dragStartX.current = null;
  };

  const dirMult = tiltDirection === "right" ? 1 : -1;
  const visCount = Math.min(visibleCards, total);
  const cardIndices = Array.from({ length: visCount }, (_, i) => mod(active + i, total));

  const handleCardClick = (itemIdx: number, stackPos: number, e: MouseEvent) => {
    e.stopPropagation();
    if (stackPos === 0) {
      onCardClick?.(itemIdx);
    } else {
      setActive(itemIdx);
    }
  };

  return (
    <div
      className="dc-root"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="dc-scene"
        style={{ perspective: `${perspective}px` }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        {[...cardIndices].reverse().map((itemIdx, revPos) => {
          const stackPos = cardIndices.length - 1 - revPos;
          const item = items[itemIdx];
          const xOff = stackPos * spread * dirMult;
          const zOff = -stackPos * depth;
          const rot = stackPos * tilt * dirMult;
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
              onClick={(e) => handleCardClick(itemIdx, stackPos, e)}
              aria-label={stackPos === 0 ? `View full photo: ${item.alt}` : `Go to: ${item.alt}`}
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
