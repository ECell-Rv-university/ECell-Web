"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import Image, { type StaticImageData } from "next/image";

export interface GalleryPhoto {
  src: StaticImageData;
  alt: string;
}

interface GalleryLightboxProps {
  photo: GalleryPhoto;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  currentIndex: number;
  totalCount: number;
}

export default function GalleryLightbox({
  photo,
  onClose,
  onPrev,
  onNext,
  currentIndex,
  totalCount,
}: GalleryLightboxProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onPrev();
      if (event.key === "ArrowRight") onNext();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose, onNext, onPrev]);

  const handleOverlayClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest(".lightbox-bottom-bar") ||
      target.tagName === "IMG"
    ) {
      return;
    }
    onClose();
  };

  return (
    <div
      ref={overlayRef}
      className="lightbox-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label="Photo lightbox"
    >
      <div className="lightbox-image-wrap">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="100vw"
          style={{ objectFit: "contain" }}
          quality={85}
          loading="eager"
        />
      </div>

      <button className="lightbox-close" onClick={onClose} aria-label="Close lightbox">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <button className="lightbox-nav lightbox-nav--prev" onClick={onPrev} aria-label="Previous photo">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <button className="lightbox-nav lightbox-nav--next" onClick={onNext} aria-label="Next photo">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      <div className="lightbox-bottom-bar">
        <p className="lightbox-caption">{photo.alt}</p>
        <span className="lightbox-counter">
          {String(currentIndex + 1).padStart(2, "0")} / {String(totalCount).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
