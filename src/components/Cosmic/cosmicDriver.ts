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
  farStratum: HTMLElement | null;
  nearStratum: HTMLElement | null;
  isVisible: boolean;
}

const sections = new Map<HTMLElement, RegisteredSection>();
let sharedObserver: IntersectionObserver | null = null;
let tickerActive = false;
let pointerActive = false;

const pointerAim = { x: 0, y: 0 };
const pointerCurrent = { x: 0, y: 0 };
let lastScrollY = 0;
let scrollWarp = 0;
let idleClock = 0;

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

function tickCosmic(_time: number, deltaTime: number): void {
  const dt = Math.min(deltaTime / 1000, 0.05);
  const ratio = gsap.ticker?.deltaRatio ? gsap.ticker.deltaRatio(60) : 1;
  const easeFactor = 1 - Math.pow(0.92, ratio);

  pointerCurrent.x += (pointerAim.x - pointerCurrent.x) * easeFactor;
  pointerCurrent.y += (pointerAim.y - pointerCurrent.y) * easeFactor;

  const currentScrollY = window.scrollY || 0;
  const scrollDelta = Math.abs(currentScrollY - lastScrollY);
  lastScrollY = currentScrollY;

  const targetWarp = Math.min(1, scrollDelta / 72);
  const warpEase = targetWarp > scrollWarp ? 0.28 : 0.1;
  scrollWarp += (targetWarp - scrollWarp) * Math.min(1, warpEase * ratio);
  if (scrollWarp < 0.001) scrollWarp = 0;

  idleClock += dt * 0.45;
  const idleX = Math.sin(idleClock) * 0.085;
  const idleY = Math.cos(idleClock * 0.78) * 0.065;

  const combinedX = pointerCurrent.x + idleX;
  const combinedY = pointerCurrent.y + idleY;

  const farScaleY = (1 + scrollWarp * 0.85).toFixed(3);
  const nearScaleY = (1 + scrollWarp * 1.6).toFixed(3);

  sections.forEach((sec) => {
    if (!sec.isVisible) return;

    for (const layer of sec.layers) {
      const tx = (-combinedX * layer.depth).toFixed(2);
      const ty = (-combinedY * layer.depth).toFixed(2);
      layer.el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    }

    if (sec.farStratum) {
      const fx = (-combinedX * 4).toFixed(2);
      const fy = (-combinedY * 4).toFixed(2);
      sec.farStratum.style.transform =
        scrollWarp > 0
          ? `translate3d(${fx}px, ${fy}px, 0) scale3d(1, ${farScaleY}, 1)`
          : `translate3d(${fx}px, ${fy}px, 0)`;
    }

    if (sec.nearStratum) {
      const nx = (-combinedX * 10).toFixed(2);
      const ny = (-combinedY * 10).toFixed(2);
      sec.nearStratum.style.transform =
        scrollWarp > 0
          ? `translate3d(${nx}px, ${ny}px, 0) scale3d(1, ${nearScaleY}, 1)`
          : `translate3d(${nx}px, ${ny}px, 0)`;
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
    lastScrollY = window.scrollY || 0;
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
 * Handles offscreen animation pausing, unified cursor parallax, scroll-velocity warp,
 * and subtle idle orbital drift with zero per-instance RAF loops.
 */
export function registerCosmicSection(root: HTMLElement): () => void {
  const parentSection = root.closest("section") || root.parentElement;
  const layers = Array.from(root.querySelectorAll<HTMLElement>("[data-depth]")).map((el) => ({
    el,
    depth: Number(el.dataset.depth || 10),
  }));
  const farStratum = root.querySelector<HTMLElement>(".cosmic-star-stratum--far");
  const nearStratum = root.querySelector<HTMLElement>(".cosmic-star-stratum--near");

  const observer = ensureObserver();
  const observedEl = parentSection ?? root;

  const entry: RegisteredSection = {
    root,
    parentSection,
    layers,
    farStratum,
    nearStratum,
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
