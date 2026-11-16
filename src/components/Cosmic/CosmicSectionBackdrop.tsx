"use client";
import React, { useEffect, useRef, useId } from "react";
import CosmicPlanet, {
  type CosmicPlanetType,
  PLANET_DEPTH,
  PLANET_TELEMETRY,
} from "./CosmicPlanets";
import { registerCosmicSection } from "./cosmicDriver";
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

export interface PlanetPlacement {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  width?: string;
}

export interface SecondaryPlanetConfig {
  type: CosmicPlanetType;
  placement: PlanetPlacement;
  showTelemetry?: boolean;
}

export interface CosmicSectionBackdropProps {
  planet?: CosmicPlanetType;
  planetPlacement?: PlanetPlacement;
  secondaryPlanets?: SecondaryPlanetConfig[];
  starsCount?: number;
  shootingStarsCount?: number;
  nebula?: "solar" | "azure" | "violet" | "cyan" | "singularity";
  showOrbitTrack?: boolean;
  sectorLabel?: string;
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

function resolveTelemetryAlign(placement: PlanetPlacement): "left" | "right" {
  if (placement.left && !placement.right) return "right";
  return "left";
}

export default function CosmicSectionBackdrop({
  planet,
  planetPlacement = { top: "15%", right: "8%" },
  secondaryPlanets = [],
  starsCount = 26,
  shootingStarsCount = 2,
  nebula,
  showOrbitTrack = true,
  sectorLabel,
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

  // Deterministic starfield generation partitioned into two GPU-grouped strata
  const allStars = Array.from({ length: starsCount }, (_, i) => {
    const dim = rand() < 0.45;
    const sizeVal = 1.1 + rand() * 1.6;
    const top = (rand() * 96 + 2).toFixed(2);
    const left = (rand() * 96 + 2).toFixed(2);
    const delay = (rand() * 6).toFixed(2);
    const duration = (3.2 + rand() * 4.5).toFixed(2);
    return {
      id: i,
      top,
      left,
      size: sizeVal.toFixed(2),
      delay,
      duration,
      dim,
      bright: !dim && sizeVal > 2.25,
    };
  });

  const farLimit = Math.ceil(allStars.length * 0.6);
  const farStars = allStars.slice(0, farLimit);
  let glintBudget = 0;
  const nearStars = allStars.slice(farLimit).map((star) => {
    const hasGlint = star.bright && glintBudget < 3;
    if (hasGlint) glintBudget += 1;
    return { ...star, glint: hasGlint };
  });

  // Deterministic shooting meteor streaks
  const meteors = Array.from({ length: shootingStarsCount }, (_, i) => ({
    id: i,
    top: (rand() * 45 + 5).toFixed(1),
    left: (rand() * 65 + 10).toFixed(1),
    delay: (rand() * 7 + i * 5).toFixed(2),
    duration: (1.2 + rand() * 0.8).toFixed(2),
  }));

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: Array<() => void> = [];

    // 1. Register with the single-clock cosmic driver (offscreen pause, parallax, warp, idle drift)
    cleanups.push(registerCosmicSection(root));

    const parentSection = root.closest("section") || root.parentElement;

    // 2. Scroll-Driven Parallax on Primary Planet using GSAP ScrollTrigger
    if (
      !reduceMotion &&
      scrollParallax &&
      planet &&
      parentSection &&
      typeof gsap.context === "function"
    ) {
      const planetEl = root.querySelector<HTMLElement>(".bg-planet--primary");
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

    // 3. Constellation Drawing Ingress on Scroll
    if (!reduceMotion && parentSection && typeof gsap.context === "function") {
      const constLines = root.querySelectorAll<SVGPathElement>(".bg-constellation-line, .bg-wordmark-line");
      const constStars = root.querySelectorAll<SVGCircleElement>(".bg-constellation-star, .bg-wordmark-star");

      if (constLines.length > 0) {
        const ctx = gsap.context(() => {
          gsap.fromTo(
            constLines,
            { strokeDashoffset: 100, opacity: 0.1 },
            {
              strokeDashoffset: 0,
              opacity: 0.45,
              duration: 1.4,
              stagger: 0.06,
              ease: "power2.out",
              scrollTrigger: {
                trigger: parentSection,
                start: "top 78%",
                toggleActions: "play none none reverse",
              },
            }
          );
          if (constStars.length > 0) {
            gsap.fromTo(
              constStars,
              { scale: 0, opacity: 0 },
              {
                scale: 1,
                opacity: 1,
                duration: 0.8,
                stagger: 0.04,
                ease: "back.out(2)",
                scrollTrigger: {
                  trigger: parentSection,
                  start: "top 78%",
                  toggleActions: "play none none reverse",
                },
              }
            );
          }
        }, root);
        cleanups.push(() => ctx.revert());
      }
    }

    // 4. Planet Interactive Events (supports single & multi-planet ensembles)
    const planetsContainer = root.querySelector<HTMLElement>(".bg-planets");
    const planetEls = Array.from(root.querySelectorAll<HTMLElement>(".bg-planet"));

    if (planetEls.length > 0) {
      const artOf = (body: HTMLElement) => body.querySelector<SVGSVGElement>(".bg-planet__art");

      const onPlanetClick = (event: Event) => {
        if (reduceMotion) return;
        gsap.to(event.currentTarget as HTMLElement, {
          rotation: "+=360",
          duration: 1.4,
          ease: "power3.inOut",
        });
      };

      const sunPlanet = root.querySelector<HTMLElement>(".bg-planet--sun");
      const sunBody = sunPlanet?.querySelector<HTMLElement>(".bg-planet__body") ?? null;
      const sunWave = sunPlanet?.querySelector<HTMLElement>(".bg-sun-wave") ?? null;

      let sunOn = !document.documentElement.classList.contains("is-sun-off");
      const onSunClick = () => {
        if (!sunBody) return;
        sunOn = !sunOn;
        planetsContainer?.classList.toggle("is-sun-off", !sunOn);
        document.documentElement.classList.toggle("is-sun-off", !sunOn);

        const sunRect = sunBody.getBoundingClientRect();
        const sx = sunRect.left + sunRect.width / 2;
        const sy = sunRect.top + sunRect.height / 2;

        const targetPlanets = Array.from(
          root.querySelectorAll<HTMLElement>(
            ".bg-planet:not(.bg-planet--sun):not(.bg-planet--blackhole):not(.bg-planet--m87)"
          )
        );

        for (const targetPlanet of targetPlanets) {
          const parallaxEl = targetPlanet.querySelector<HTMLElement>(".bg-planet__parallax");
          const targetBody = targetPlanet.querySelector<HTMLElement>(".bg-planet__body");
          if (!parallaxEl || !targetBody) continue;

          const r = targetBody.getBoundingClientRect();
          const dist = Math.hypot(r.left + r.width / 2 - sx, r.top + r.height / 2 - sy);
          const delay = reduceMotion ? 0 : dist / 900;
          parallaxEl.style.setProperty("--light-delay", `${delay.toFixed(2)}s`);

          const targetArt = artOf(targetBody);
          if (sunOn && targetArt && !reduceMotion) {
            gsap.fromTo(
              targetArt,
              { filter: "brightness(1)" },
              {
                filter: "brightness(1.45) drop-shadow(0 0 18px rgba(255, 241, 214, 0.5))",
                duration: 0.4,
                delay,
                yoyo: true,
                repeat: 1,
                ease: "power2.out",
                clearProps: "filter",
              }
            );
          }
        }

        const sunArt = artOf(sunBody);
        if (sunOn && sunArt && !reduceMotion) {
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

      const siriusPlanet = root.querySelector<HTMLElement>(".bg-planet--sirius");
      const siriusBody = siriusPlanet?.querySelector<HTMLElement>(".bg-planet__body") ?? null;
      const siriusWave = siriusPlanet?.querySelector<HTMLElement>(".bg-sun-wave") ?? null;
      const onSiriusClick = () => {
        if (!siriusBody || reduceMotion) return;
        const siriusArt = artOf(siriusBody);
        gsap.to(siriusBody, {
          rotation: "+=180",
          duration: 1.2,
          ease: "power3.inOut",
        });
        if (siriusArt) {
          gsap.fromTo(
            siriusArt,
            { filter: "brightness(1)" },
            {
              filter: "brightness(1.7) drop-shadow(0 0 26px rgba(186, 230, 253, 0.75))",
              duration: 0.45,
              yoyo: true,
              repeat: 1,
              ease: "power2.out",
              clearProps: "filter",
            }
          );
        }
        if (siriusWave) {
          gsap.fromTo(
            siriusWave,
            { scale: 0.3, opacity: 0.9 },
            { scale: 28, opacity: 0, duration: 2.0, ease: "power2.out" }
          );
        }
      };

      const holePlanet = root.querySelector<HTMLElement>(".bg-planet--blackhole, .bg-planet--m87");
      const holeBody = holePlanet?.querySelector<HTMLElement>(".bg-planet__body") ?? null;
      const holeWave = holePlanet?.querySelector<HTMLElement>(".bg-bh-wave") ?? null;

      let devoured = false;
      let prey: Array<{ el: Element; opacity: number; twinkles: boolean }> = [];
      const onHoleClick = () => {
        if (!holeBody) return;
        const holeArt = artOf(holeBody);
        if (!holeArt) return;

        devoured = !devoured;
        planetsContainer?.classList.toggle("is-devouring", devoured);
        root.classList.toggle("is-devouring", devoured);

        const a = holeArt.getBoundingClientRect();
        const hx = a.left + a.width * 0.5;
        const hy = a.top + a.height * 0.55;

        if (devoured) {
          prey = Array.from(
            root.querySelectorAll(
              ".backdrop-star, .bg-constellation, .bg-wordmark, .bg-planet:not(.bg-planet--blackhole):not(.bg-planet--m87)"
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

      for (const planetEl of planetEls) {
        const body = planetEl.querySelector<HTMLElement>(".bg-planet__body");
        if (!body) continue;

        const handler = planetEl.classList.contains("bg-planet--sun")
          ? onSunClick
          : planetEl.classList.contains("bg-planet--sirius")
            ? onSiriusClick
            : planetEl.classList.contains("bg-planet--blackhole") ||
                planetEl.classList.contains("bg-planet--m87")
              ? onHoleClick
              : onPlanetClick;

        body.addEventListener("click", handler);
        cleanups.push(() => body.removeEventListener("click", handler));
      }
    }

    return () => {
      cleanups.forEach((fn) => fn());
      if (!document.querySelector(".bg-planets.is-sun-off")) {
        document.documentElement.classList.remove("is-sun-off");
      }
    };
  }, [planet, scrollParallax]);

  const hasPlanets = Boolean(planet) || secondaryPlanets.length > 0;
  const sectorCode = sectorLabel ? sectorLabel.split(" ")[0] : "";
  const sectorTitle = sectorLabel ? sectorLabel.split(" ").slice(1).join(" ") : "";

  return (
    <div
      ref={rootRef}
      className="cosmic-star-field"
      data-section-id={sectionId}
    >
      {/* 1. Atmospheric Nebula Dust Glow (Zero-Blur Multi-Stop Radial Gradient) */}
      {nebula && <div className={`bg-nebula bg-nebula--${nebula}`} aria-hidden="true" />}

      {/* 2. Two-Stratum GPU Starfield (Far & Near with 4-Point Diffraction Glints) */}
      <div className="cosmic-star-stratum cosmic-star-stratum--far" aria-hidden="true">
        {farStars.map((star) => (
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
      </div>

      <div className="cosmic-star-stratum cosmic-star-stratum--near" aria-hidden="true">
        {nearStars.map((star) => (
          <span
            key={star.id}
            className={`backdrop-star${star.dim ? " is-dim" : ""}${star.bright ? " is-bright" : ""}${star.glint ? " is-glint" : ""}`}
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
      </div>

      {/* 3. Shooting Meteor Streaks */}
      {meteors.map((meteor) => (
        <span
          key={`m-${meteor.id}`}
          className="bg-meteor"
          aria-hidden="true"
          style={{
            top: `${meteor.top}%`,
            left: `${meteor.left}%`,
            animationDelay: `${meteor.delay}s`,
            animationDuration: `${meteor.duration}s`,
          }}
        />
      ))}

      {/* 4. Keplerian Orbital Guide Ellipses */}
      {showOrbitTrack && planet && (
        <div
          className="bg-kepler-orbit"
          style={{
            top: planetPlacement.top,
            bottom: planetPlacement.bottom,
            left: planetPlacement.left,
            right: planetPlacement.right,
          }}
          aria-hidden="true"
        >
          <svg className="bg-kepler-orbit__svg" viewBox="0 0 320 180" fill="none">
            <ellipse cx="160" cy="90" rx="150" ry="70" className="bg-kepler-orbit__track" />
            <ellipse cx="160" cy="90" rx="120" ry="54" className="bg-kepler-orbit__track-inner" />
            <circle cx="310" cy="90" r="1.8" className="bg-kepler-orbit__node" />
            <circle cx="10" cy="90" r="1.8" className="bg-kepler-orbit__node" />
            <circle cx="160" cy="20" r="1.4" className="bg-kepler-orbit__node" />
          </svg>
        </div>
      )}

      {/* 5. Geometric Constellation Figures */}
      {constellation && CONSTELLATION_FIGURES[constellation] && (
        <svg
          className={`bg-constellation bg-constellation--${constellation}`}
          aria-hidden="true"
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

      {/* 6. Wordmarks in Constellation Stars ("ECELL", "RVU") */}
      {wordmark && WORDMARKS[wordmark] && (
        <svg
          className={`bg-constellation bg-wordmark bg-wordmark--${wordmark}`}
          aria-hidden="true"
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

      {/* 7. Planetary Ensemble in Designated Section Placements */}
      {hasPlanets && (
        <div className="bg-planets">
          {planet && (
            <CosmicPlanet
              type={planet}
              className="bg-planet--primary"
              style={planetPlacement}
              idPrefix={`p-${reactId}`}
              telemetryAlign={resolveTelemetryAlign(planetPlacement)}
            />
          )}
          {secondaryPlanets.map((sec, idx) => (
            <CosmicPlanet
              key={`${sec.type}-${idx}`}
              type={sec.type}
              className="bg-planet--secondary"
              style={sec.placement}
              idPrefix={`p-${reactId}-s${idx}`}
              showTelemetry={sec.showTelemetry ?? true}
              telemetryAlign={resolveTelemetryAlign(sec.placement)}
            />
          ))}
        </div>
      )}

      {/* 8. Astrometric Sector Watermark Badge */}
      {sectorLabel && (
        <aside className="bg-sector-watermark" aria-hidden="true">
          <span className="bg-sector-watermark__num">{sectorCode}</span>
          <span className="bg-sector-watermark__title">{sectorTitle}</span>
          {planet && (
            <span className="bg-sector-watermark__coords">
              {PLANET_TELEMETRY[planet].ra} · {PLANET_TELEMETRY[planet].dec}
            </span>
          )}
        </aside>
      )}

      {/* 9. Mobile Minimal Atmosphere Glow & Astrometric Tag */}
      {planet && (
        <div
          className={`cosmic-mobile-glow cosmic-mobile-glow--${planet}`}
          aria-hidden="true"
        >
          <div className="cosmic-mobile-glow__core" />
          <div className="cosmic-mobile-glow__corona" />
          {(planet === "sun" || planet === "sirius") && (
            <div className="cosmic-mobile-glow__solar-flare" />
          )}
          {(planet === "blackhole" || planet === "m87") && (
            <div className="cosmic-mobile-glow__event-horizon" />
          )}
          {sectorLabel && (
            <div className="cosmic-mobile-glow__tag">
              <span className="cosmic-mobile-glow__dot" />
              <span className="cosmic-mobile-glow__code">{sectorCode}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
