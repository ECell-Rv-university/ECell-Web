"use client";
import React, { useEffect, useRef, useId } from "react";
import CosmicPlanet, { type CosmicPlanetType, PLANET_DEPTH } from "./CosmicPlanets";
import { gsap } from "@/src/utils/gsapSetup";
import "./CosmicTheme.css";

// Deterministic PRNG to ensure server and client markup match identically
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export type ConstellationFigureType =
  | "cassiopeia"
  | "cygnus"
  | "pegasus"
  | "phoenix"
  | "vortex"
  | "navigator";

interface ConstellationData {
  id: string;
  points: Array<[number, number]>;
  edges: Array<[number, number]>;
}

const CONSTELLATION_FIGURES: Record<ConstellationFigureType, ConstellationData> = {
  navigator: {
    id: "nav",
    points: [[14, 10], [22, 34], [12, 58], [46, 46], [70, 62]],
    edges: [[0, 1], [1, 2], [1, 3], [3, 4]],
  },
  cassiopeia: {
    id: "cas",
    points: [[10, 48], [28, 22], [50, 38], [72, 14], [90, 36]],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4]],
  },
  cygnus: {
    id: "cyg",
    points: [[50, 10], [50, 35], [50, 60], [20, 35], [80, 35]],
    edges: [[0, 1], [1, 2], [3, 1], [1, 4]],
  },
  pegasus: {
    id: "peg",
    points: [[20, 20], [70, 20], [75, 55], [25, 55], [88, 38]],
    edges: [[0, 1], [1, 2], [2, 3], [3, 0], [1, 4]],
  },
  phoenix: {
    id: "phx",
    points: [[50, 58], [50, 34], [22, 18], [78, 18], [50, 12]],
    edges: [[0, 1], [1, 2], [1, 3], [1, 4]],
  },
  vortex: {
    id: "vtx",
    points: [[20, 56], [38, 36], [62, 40], [80, 16], [90, 52]],
    edges: [[0, 1], [1, 2], [2, 3], [2, 4]],
  },
};

type WordmarkLetter = {
  points: Array<[number, number]>;
  edges: Array<[number, number]>;
};

const WORDMARKS: Record<"ecell" | "rvu", { width: number; letters: WordmarkLetter[] }> = {
  ecell: {
    width: 100,
    letters: [
      { points: [[2.5, 4], [14, 4.6], [2, 15], [11, 15.6], [2.6, 26], [14.4, 25.4]], edges: [[1, 0], [0, 2], [2, 3], [2, 4], [4, 5]] },
      { points: [[35, 6.4], [27, 4], [23, 10.6], [23.2, 19.6], [27.2, 26], [35.4, 24]], edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]] },
      { points: [[44, 4.2], [56.4, 5], [44.4, 15.4], [52.6, 15], [44, 26.4], [56, 26]], edges: [[1, 0], [0, 2], [2, 3], [2, 4], [4, 5]] },
      { points: [[65.4, 4], [65, 26], [76, 25.6]], edges: [[0, 1], [1, 2]] },
      { points: [[84.4, 4.4], [84, 26.2], [95.6, 26.6]], edges: [[0, 1], [1, 2]] },
    ],
  },
  rvu: {
    width: 60,
    letters: [
      { points: [[2.4, 4], [11, 4.6], [14.2, 9.6], [11.2, 14.8], [2, 15], [2.6, 26], [14.4, 26]], edges: [[0, 1], [1, 2], [2, 3], [3, 4], [0, 4], [4, 5], [3, 6]] },
      { points: [[23, 4.4], [26.2, 15.4], [29.2, 26], [32.4, 15], [35.4, 4]], edges: [[0, 1], [1, 2], [2, 3], [3, 4]] },
      { points: [[44.2, 4], [44, 19], [47.6, 26], [52.8, 26.2], [56.4, 19.4], [56, 4.4]], edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]] },
    ],
  },
};

export interface CosmicSectionBackdropProps {
  planet?: CosmicPlanetType;
  planetPlacement?: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
    width?: string;
  };
  starsCount?: number;
  seed?: number;
  constellation?: ConstellationFigureType;
  constellationPlacement?: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
    width?: string;
  };
  wordmark?: "ecell" | "rvu";
  wordmarkPlacement?: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  sectionId?: string;
  scrollParallax?: boolean;
}

export default function CosmicSectionBackdrop({
  planet,
  planetPlacement = { top: "15%", right: "8%" },
  starsCount = 24,
  seed = 42,
  constellation,
  constellationPlacement = { top: "45%", left: "2%" },
  wordmark,
  wordmarkPlacement = { top: "12%", left: "3%" },
  sectionId,
  scrollParallax = true,
}: CosmicSectionBackdropProps): React.ReactElement {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const reactId = useId().replace(/:/g, "");
  const rand = seededRandom(seed);

  // Deterministic starfield generation
  const stars = Array.from({ length: starsCount }, (_, i) => ({
    id: i,
    top: (rand() * 96 + 2).toFixed(2),
    left: (rand() * 96 + 2).toFixed(2),
    size: (1.1 + rand() * 1.6).toFixed(2),
    delay: (rand() * 6).toFixed(2),
    duration: (3.2 + rand() * 4.5).toFixed(2),
    dim: rand() < 0.45,
  }));

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const cleanups: Array<() => void> = [];

    // 1. Offscreen optimization: pause CSS keyframes when offscreen
    const parentSection = root.closest("section") || root.parentElement;
    if (parentSection) {
      const io = new IntersectionObserver(
        ([entry]) => parentSection.classList.toggle("is-offscreen", !entry.isIntersecting),
        { rootMargin: "150px 0px" }
      );
      io.observe(parentSection);
      cleanups.push(() => io.disconnect());
    }

    // 2. Cursor Parallax (Only when section is visible, eased via requestAnimationFrame)
    if (!reduceMotion && !coarse) {
      const layers = Array.from(root.querySelectorAll<HTMLElement>("[data-depth]"));
      if (layers.length > 0) {
        const target = { x: 0, y: 0 };
        const current = { x: 0, y: 0 };
        let raf = 0;
        let isVisible = false;

        const tick = () => {
          raf = 0;
          current.x += (target.x - current.x) * 0.08;
          current.y += (target.y - current.y) * 0.08;
          for (const layer of layers) {
            const depth = Number(layer.dataset.depth || 10);
            layer.style.transform = `translate3d(${(-current.x * depth).toFixed(2)}px, ${(-current.y * depth).toFixed(2)}px, 0)`;
          }
          if (Math.abs(target.x - current.x) > 0.0005 || Math.abs(target.y - current.y) > 0.0005) {
            raf = requestAnimationFrame(tick);
          }
        };

        const onMove = (e: PointerEvent) => {
          if (!isVisible) return;
          const rect = root.getBoundingClientRect();
          target.x = (e.clientX - rect.left) / rect.width - 0.5;
          target.y = (e.clientY - rect.top) / rect.height - 0.5;
          if (!raf) raf = requestAnimationFrame(tick);
        };

        const visIo = new IntersectionObserver(([entry]) => {
          isVisible = entry.isIntersecting;
        });
        visIo.observe(root);

        window.addEventListener("pointermove", onMove, { passive: true });
        cleanups.push(() => {
          window.removeEventListener("pointermove", onMove);
          visIo.disconnect();
          cancelAnimationFrame(raf);
        });
      }
    }

    // 3. Scroll-Driven Parallax on Planet using GSAP ScrollTrigger
    if (!reduceMotion && scrollParallax && planet && parentSection) {
      const planetEl = root.querySelector<HTMLElement>(".bg-planet");
      if (planetEl) {
        const depth = PLANET_DEPTH[planet] || 15;
        const ctx = gsap.context(() => {
          gsap.fromTo(
            planetEl,
            { y: -depth * 1.5, rotation: -3 },
            {
              y: depth * 2.2,
              rotation: 4,
              ease: "none",
              scrollTrigger: {
                trigger: parentSection,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.6,
              },
            }
          );
        }, root);
        cleanups.push(() => ctx.revert());
      }
    }

    // 4. Planet Interactive Events
    const planetBody = root.querySelector<HTMLElement>(".bg-planet__body");
    const sunWave = root.querySelector<HTMLElement>(".bg-sun-wave");
    const holeWave = root.querySelector<HTMLElement>(".bg-bh-wave");

    if (planetBody) {
      const artOf = (body: HTMLElement) => body.querySelector<SVGSVGElement>(".bg-planet__art");

      // Click to spin (any planet)
      const onPlanetClick = (e: Event) => {
        if (reduceMotion) return;
        gsap.to(e.currentTarget as HTMLElement, {
          rotation: "+=360",
          duration: 1.4,
          ease: "power3.inOut",
        });
      };

      // Sun Click: Send solar wave & toggle light transmission
      let sunOn = true;
      const onSunClick = () => {
        sunOn = !sunOn;
        document.documentElement.classList.toggle("is-sun-off", !sunOn);

        const sunArt = artOf(planetBody);
        if (sunOn && sunArt) {
          gsap.fromTo(
            sunArt,
            { filter: "brightness(1)" },
            {
              filter: "brightness(1.6) drop-shadow(0 0 24px rgba(255, 241, 214, 0.65))",
              duration: 0.45,
              yoyo: true,
              repeat: 1,
              ease: "power2.out",
              clearProps: "filter",
            }
          );
        }
        if (sunOn && sunWave && !reduceMotion) {
          gsap.fromTo(
            sunWave,
            { scale: 0.3, opacity: 0.9 },
            { scale: 28, opacity: 0, duration: 2.2, ease: "power2.out" }
          );
        }
      };

      // Black Hole Click: Devour stars & constellations in this field
      let devoured = false;
      let prey: Array<{ el: Element; opacity: number; twinkles: boolean }> = [];
      const onHoleClick = () => {
        const holeArt = artOf(planetBody);
        if (!holeArt) return;
        devoured = !devoured;
        root.classList.toggle("is-devouring", devoured);

        const a = holeArt.getBoundingClientRect();
        const hx = a.left + a.width * 0.5;
        const hy = a.top + a.height * 0.55;

        if (devoured) {
          prey = Array.from(
            root.querySelectorAll(
              ".backdrop-star, .bg-constellation, .bg-wordmark, .bg-planet:not(.bg-planet--blackhole)"
            )
          ).map((el) => ({
            el,
            opacity: Number(gsap.getProperty(el, "opacity")) || 1,
            twinkles: el.classList.contains("backdrop-star"),
          }));

          for (const p of prey) {
            if (p.twinkles) (p.el as HTMLElement).style.animation = "none";
            if (reduceMotion) {
              gsap.to(p.el, { opacity: 0, duration: 0.4, overwrite: "auto" });
              continue;
            }
            const r = p.el.getBoundingClientRect();
            const dx = hx - (r.left + r.width / 2);
            const dy = hy - (r.top + r.height / 2);
            const dist = Math.hypot(dx, dy);
            const duration = 0.9 + dist / 1200;
            const delay = dist / 2400 + Math.random() * 0.15;
            gsap.to(p.el, { x: `+=${dx}`, duration, delay, ease: "power2.in", overwrite: "auto" });
            gsap.to(p.el, { y: `+=${dy}`, duration, delay, ease: "power4.in", overwrite: "auto" });
            gsap.to(p.el, {
              scale: 0,
              rotation: `+=${dx < 0 ? -540 : 540}`,
              opacity: 0,
              duration,
              delay,
              ease: "power3.in",
              overwrite: "auto",
            });
          }

          // Satisfied gulp
          gsap.fromTo(
            holeArt,
            { scale: 1 },
            {
              scale: 1.12,
              duration: 0.35,
              delay: reduceMotion ? 0 : 1.2,
              yoyo: true,
              repeat: 1,
              ease: "power2.out",
              transformOrigin: "50% 55%",
            }
          );
        } else {
          if (holeWave && !reduceMotion) {
            gsap.fromTo(
              holeWave,
              { scale: 0.3, opacity: 0.9 },
              { scale: 26, opacity: 0, duration: 1.8, ease: "power2.out" }
            );
          }
          for (const p of prey) {
            const restoreTwinkle = () => {
              if (p.twinkles) (p.el as HTMLElement).style.animation = "";
            };
            if (reduceMotion) {
              gsap.to(p.el, { opacity: p.opacity, duration: 0.4, overwrite: "auto", onComplete: restoreTwinkle });
              continue;
            }
            gsap.to(p.el, {
              x: 0,
              y: 0,
              scale: 1,
              rotation: 0,
              opacity: p.opacity,
              duration: 1.1 + Math.random() * 0.6,
              delay: Math.random() * 0.15,
              ease: "expo.out",
              overwrite: "auto",
              onComplete: restoreTwinkle,
            });
          }
          prey = [];
        }
      };

      const handler = planet === "sun" ? onSunClick : planet === "blackhole" ? onHoleClick : onPlanetClick;
      planetBody.addEventListener("click", handler);
      cleanups.push(() => planetBody.removeEventListener("click", handler));
    }

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, [planet, scrollParallax]);

  return (
    <div
      ref={rootRef}
      className="cosmic-star-field"
      aria-hidden="true"
      data-section-id={sectionId}
    >
      {/* 1. Backdrop Stars */}
      {stars.map((star) => (
        <span
          key={star.id}
          className={`backdrop-star${star.dim ? " is-dim" : ""}`}
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}

      {/* 2. Geometric Constellation Figures */}
      {constellation && CONSTELLATION_FIGURES[constellation] && (
        <svg
          className={`bg-constellation bg-constellation--${constellation}`}
          style={{
            top: constellationPlacement.top,
            bottom: constellationPlacement.bottom,
            left: constellationPlacement.left,
            right: constellationPlacement.right,
            width: constellationPlacement.width || "clamp(90px, 9vw, 130px)",
          }}
          viewBox="0 0 100 70"
          fill="none"
        >
          {CONSTELLATION_FIGURES[constellation].edges.map(([from, to]) => {
            const p1 = CONSTELLATION_FIGURES[constellation].points[from];
            const p2 = CONSTELLATION_FIGURES[constellation].points[to];
            return (
              <path
                key={`${from}-${to}`}
                className="bg-constellation-line"
                d={`M ${p1[0]} ${p1[1]} L ${p2[0]} ${p2[1]}`}
              />
            );
          })}
          {CONSTELLATION_FIGURES[constellation].points.map(([cx, cy], i) => (
            <circle
              key={i}
              className="bg-constellation-star"
              cx={cx}
              cy={cy}
              r={i === 0 ? 1.8 : 1.2}
            />
          ))}
        </svg>
      )}

      {/* 3. Wordmarks in Constellation Stars ("ECELL", "RVU") */}
      {wordmark && WORDMARKS[wordmark] && (
        <svg
          className={`bg-constellation bg-wordmark bg-wordmark--${wordmark}`}
          style={{
            top: wordmarkPlacement.top,
            bottom: wordmarkPlacement.bottom,
            left: wordmarkPlacement.left,
            right: wordmarkPlacement.right,
            width: `clamp(${WORDMARKS[wordmark].width * 0.8}px, 12vw, ${WORDMARKS[wordmark].width * 1.3}px)`,
          }}
          viewBox={`0 0 ${WORDMARKS[wordmark].width} 31`}
          fill="none"
        >
          {WORDMARKS[wordmark].letters.map((letter, li) => (
            <g key={li} className="bg-wordmark-letter">
              {letter.edges.map(([from, to]) => (
                <path
                  key={`${from}-${to}`}
                  className="bg-wordmark-line"
                  d={`M ${letter.points[from][0]} ${letter.points[from][1]} L ${letter.points[to][0]} ${letter.points[to][1]}`}
                />
              ))}
              {letter.points.map(([cx, cy], i) => (
                <circle
                  key={i}
                  className="bg-wordmark-star"
                  cx={cx}
                  cy={cy}
                  r={i === 0 ? 1.1 : 0.7}
                />
              ))}
            </g>
          ))}
        </svg>
      )}

      {/* 4. Planet in its Designated Section Placement */}
      {planet && (
        <div
          className="bg-planets"
          style={{
            top: planetPlacement.top,
            bottom: planetPlacement.bottom,
            left: planetPlacement.left,
            right: planetPlacement.right,
            width: planetPlacement.width,
          }}
        >
          <CosmicPlanet type={planet} idPrefix={`p-${reactId}`} />
        </div>
      )}
    </div>
  );
}

