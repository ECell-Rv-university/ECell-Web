"use client";

import { gsap } from "@/src/utils/gsapSetup";

interface ParallaxLayer {
  el: HTMLElement;
  depth: number;
}

interface RegisteredSection {
  root: HTMLElement;
  parentSection: HTMLElement | null;
  layers: ParallaxLayer[];
  isVisible: boolean;
}

const sections = new Map<HTMLElement, RegisteredSection>();
let sharedObserver: IntersectionObserver | null = null;
let tickerActive = false;
let pointerActive = false;

const pointerAim = { x: 0, y: 0 };
const pointerCurrent = { x: 0, y: 0 };

function isReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isCoarsePointer(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(pointer: coarse)").matches;
}

function onPointerMove(event: PointerEvent): void {
  const width = window.innerWidth || 1;
  const height = window.innerHeight || 1;
  pointerAim.x = event.clientX / width - 0.5;
  pointerAim.y = event.clientY / height - 0.5;
}

function tickCosmic(): void {
  const ratio = gsap.ticker?.deltaRatio ? gsap.ticker.deltaRatio(60) : 1;
  const easeFactor = 1 - Math.pow(0.92, ratio);

  const dx = pointerAim.x - pointerCurrent.x;
  const dy = pointerAim.y - pointerCurrent.y;
  if (Math.abs(dx) < 0.0002 && Math.abs(dy) < 0.0002) {
    return;
  }

  pointerCurrent.x += dx * easeFactor;
  pointerCurrent.y += dy * easeFactor;

  sections.forEach((sec) => {
    if (!sec.isVisible) return;

    for (const layer of sec.layers) {
      const tx = (-pointerCurrent.x * layer.depth).toFixed(2);
      const ty = (-pointerCurrent.y * layer.depth).toFixed(2);
      layer.el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    }
  });
}

function hasVisibleSection(): boolean {
  for (const sec of sections.values()) {
    if (sec.isVisible) return true;
  }
  return false;
}

function syncActiveLoop(): void {
  if (typeof window === "undefined") return;

  const shouldRun = !isReducedMotion() && !isCoarsePointer() && hasVisibleSection();

  if (shouldRun && !tickerActive && gsap.ticker?.add) {
    gsap.ticker.add(tickCosmic);
    tickerActive = true;
  } else if (!shouldRun && tickerActive) {
    gsap.ticker?.remove?.(tickCosmic);
    tickerActive = false;
  }

  if (shouldRun && !pointerActive) {
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    pointerActive = true;
  } else if (!shouldRun && pointerActive) {
    window.removeEventListener("pointermove", onPointerMove);
    pointerActive = false;
  }
}

function ensureObserver(): IntersectionObserver | null {
  if (typeof IntersectionObserver === "undefined") return null;
  if (sharedObserver) return sharedObserver;

  sharedObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const target = entry.target as HTMLElement;
        for (const sec of sections.values()) {
          if ((sec.parentSection ?? sec.root) === target) {
            sec.isVisible = entry.isIntersecting;
            sec.parentSection?.classList.toggle("is-offscreen", !entry.isIntersecting);
          }
        }
      }
      syncActiveLoop();
    },
    { rootMargin: "150px 0px" }
  );

  return sharedObserver;
}

/**
 * Registers a CosmicSectionBackdrop instance with the single-clock cosmic driver.
 * Handles offscreen animation pausing and smooth pointer parallax on celestial
 * bodies while keeping background starfields static.
 */
export function registerCosmicSection(root: HTMLElement): () => void {
  const parentSection = root.closest("section") || root.parentElement;
  const layers = Array.from(root.querySelectorAll<HTMLElement>("[data-depth]")).map((el) => ({
    el,
    depth: Number(el.dataset.depth || 10),
  }));

  const observer = ensureObserver();
  const observedEl = parentSection ?? root;

  const entry: RegisteredSection = {
    root,
    parentSection,
    layers,
    isVisible: observer ? false : true,
  };

  sections.set(root, entry);
  observer?.observe(observedEl);
  syncActiveLoop();

  return () => {
    observer?.unobserve(observedEl);
    sections.delete(root);
    if (sections.size === 0 && sharedObserver) {
      sharedObserver.disconnect();
      sharedObserver = null;
    }
    syncActiveLoop();
  };
}
