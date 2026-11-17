"use client";
import React, { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/src/utils/gsapSetup";

interface StarFieldProps {
  /** Currently hovered sponsor node ID; subtly brightens the orbital tracks. */
  hoveredNode?: string | null;
}

interface MinimalOrbitBody {
  id: "inner" | "mid" | "earth";
  rx: number;
  ry: number;
  tiltDeg: number;
  initialAngle: number;
  angularSpeed: number; // radians per second
  hasMoon?: boolean;
  moonRadius?: number;
  moonSpeed?: number;
}

const CENTER_X = 800;
const CENTER_Y = 465;
const IMPACT_PROGRESS = 0.78;

const SPARK_ANGLES = [0, 40, 85, 135, 180, 225, 270, 315];

/**
 * Three minimalist Keplerian orbits framing the sponsor constellation.
 * Outer orbit carries an Earth-type (Terran) world. When the section pins on
 * scroll, a rocket launches from the Earth planet, accelerates along a curved
 * trajectory, crashes directly into the bottom CTA button, and disappears in
 * a kinetic shockwave burst.
 */
const ORBITING_BODIES: MinimalOrbitBody[] = [
  {
    id: "inner",
    rx: 520,
    ry: 215,
    tiltDeg: -2.5,
    initialAngle: 2.35,
    angularSpeed: 0.085,
  },
  {
    id: "mid",
    rx: 635,
    ry: 275,
    tiltDeg: 3,
    initialAngle: 3.65,
    angularSpeed: -0.055,
  },
  {
    id: "earth",
    rx: 735,
    ry: 332,
    tiltDeg: -3.5,
    initialAngle: 0.22,
    angularSpeed: 0.015,
    hasMoon: true,
    moonRadius: 24,
    moonSpeed: 0.85,
  },
];

export default function StarField({ hoveredNode = null }: StarFieldProps): React.ReactElement | null {
  const [isMobile, setIsMobile] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const planeRef = useRef<SVGGElement | null>(null);
  const bodyRefs = useRef<Record<string, SVGGElement | null>>({});
  const moonRef = useRef<SVGGElement | null>(null);
  const transferTrackRef = useRef<SVGPathElement | null>(null);
  const transferActiveRef = useRef<SVGPathElement | null>(null);
  const shipRef = useRef<SVGGElement | null>(null);
  const plumeRef = useRef<SVGGElement | null>(null);
  const crashGroupRef = useRef<SVGGElement | null>(null);
  const crashRingRef = useRef<SVGCircleElement | null>(null);
  const crashFlashRef = useRef<SVGCircleElement | null>(null);
  const sparkRefs = useRef<Array<SVGLineElement | null>>([]);
  const hoveredRef = useRef<boolean>(false);

  useEffect(() => {
    hoveredRef.current = Boolean(hoveredNode);
  }, [hoveredNode]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mql = window.matchMedia("(max-width: 768px)");
    const updateMobile = () => setIsMobile(mql.matches);
    updateMobile();
    mql.addEventListener("change", updateMobile);
    return () => mql.removeEventListener("change", updateMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const root = rootRef.current;
    const svg = svgRef.current;
    if (!root || !svg) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let elapsed = 0;
    let speedMultiplier = 1;
    let isVisible = true;
    let tickerAttached = false;

    const pointerAim = { x: 0, y: 0 };
    const pointerCur = { x: 0, y: 0 };

    // Pinned scroll progress (0 = launch on Earth, IMPACT_PROGRESS = crash at CTA, 1 = post-crash hold)
    let flightAim = 0;
    let flightCur = 0;
    let wasCrashed = false;

    // Exact CTA button center in SVG coordinate space (measured from DOM)
    const targetSvgPos = { x: 800, y: 635 };
    const earthPos = { x: 1480, y: 515 };

    const measureDockTarget = () => {
      const parentSection = root.closest("section");
      const ctaEl = parentSection?.querySelector<HTMLElement>(".sponsors-cta");
      if (!ctaEl || !svg.getScreenCTM) return;
      const ctm = svg.getScreenCTM();
      if (!ctm) return;
      const rect = ctaEl.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) return;
      const pt = svg.createSVGPoint();
      // Aim directly at the right-center impact zone of the CTA button
      pt.x = rect.left + rect.width * 0.58;
      pt.y = rect.top + rect.height * 0.5;
      const svgPt = pt.matrixTransform(ctm.inverse());
      if (Number.isFinite(svgPt.x) && Number.isFinite(svgPt.y)) {
        targetSvgPos.x = svgPt.x;
        targetSvgPos.y = svgPt.y;
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      pointerAim.x = e.clientX / w - 0.5;
      pointerAim.y = e.clientY / h - 0.5;
    };

    const renderScene = (t: number, rawP: number) => {
      for (const body of ORBITING_BODIES) {
        const el = bodyRefs.current[body.id];
        if (!el) continue;

        const theta = body.initialAngle + t * body.angularSpeed;
        const cosT = Math.cos(theta);
        const sinT = Math.sin(theta);

        const tiltRad = (body.tiltDeg * Math.PI) / 180;
        const cosTilt = Math.cos(tiltRad);
        const sinTilt = Math.sin(tiltRad);

        const localX = body.rx * cosT;
        const localY = body.ry * sinT;

        const x = CENTER_X + localX * cosTilt - localY * sinTilt;
        const y = CENTER_Y + localX * sinTilt + localY * cosTilt;

        if (body.id === "earth") {
          earthPos.x = x;
          earthPos.y = y;
        }

        const depthScale = 0.88 + 0.16 * ((sinT + 1) * 0.5);
        const depthOpacity = 0.52 + 0.46 * ((sinT + 1) * 0.5);

        el.setAttribute(
          "transform",
          `translate(${x.toFixed(2)}, ${y.toFixed(2)}) scale(${depthScale.toFixed(3)})`
        );
        el.style.opacity = depthOpacity.toFixed(2);

        if (body.hasMoon && body.moonRadius && body.moonSpeed && moonRef.current) {
          const mAngle = t * body.moonSpeed;
          const mx = Math.cos(mAngle) * body.moonRadius;
          const my = Math.sin(mAngle) * (body.moonRadius * 0.54);
          moonRef.current.setAttribute("transform", `translate(${mx.toFixed(2)}, ${my.toFixed(2)})`);
        }
      }

      const px = -pointerCur.x * 10;
      const py = -pointerCur.y * 6;
      if (planeRef.current) {
        planeRef.current.setAttribute("transform", `translate(${px.toFixed(2)}, ${py.toFixed(2)})`);
      }

      // Compute curved trajectory from Earth's live position to the CTA button impact point
      const p0x = earthPos.x + px;
      const p0y = earthPos.y + py;
      const p3x = targetSvgPos.x;
      const p3y = targetSvgPos.y;

      // Sweeping arc that dips below the constellation and curves directly into the CTA button
      const arcDrop = Math.max(95, (p3y - p0y) * 0.85 + 75);
      const p1x = p0x - (p0x - p3x) * 0.18;
      const p1y = p0y + arcDrop;
      const p2x = p3x + (p0x - p3x) * 0.38;
      const p2y = p3y + 42;

      const pathD = `M ${p0x.toFixed(1)} ${p0y.toFixed(1)} C ${p1x.toFixed(1)} ${p1y.toFixed(1)}, ${p2x.toFixed(1)} ${p2y.toFixed(1)}, ${p3x.toFixed(1)} ${p3y.toFixed(1)}`;

      // Normalized flight phase u in [0, 1] before impact at IMPACT_PROGRESS
      const preImpact = Math.max(0, Math.min(1, rawP / IMPACT_PROGRESS));
      // Accelerating ease-in curve so the rocket picks up speed and slams into the button
      const u = 0.55 * preImpact + 0.45 * preImpact * preImpact;

      // Post-impactfade progress k in [0, 1]
      const crashProgress =
        rawP >= IMPACT_PROGRESS
          ? Math.min(1, (rawP - IMPACT_PROGRESS) / (1 - IMPACT_PROGRESS))
          : 0;

      const trailOpacity =
        rawP < 0.01
          ? 0
          : rawP < IMPACT_PROGRESS
            ? 0.58
            : Math.max(0, 0.58 * (1 - crashProgress * 2.2));

      if (transferTrackRef.current) {
        transferTrackRef.current.setAttribute("d", pathD);
        transferTrackRef.current.style.opacity =
          rawP < IMPACT_PROGRESS ? "0.1" : `${Math.max(0, 0.1 * (1 - crashProgress * 2)).toFixed(2)}`;
      }
      if (transferActiveRef.current) {
        transferActiveRef.current.setAttribute("d", pathD);
        transferActiveRef.current.style.strokeDashoffset = `${(1 - u).toFixed(3)}`;
        transferActiveRef.current.style.opacity = trailOpacity.toFixed(2);
      }

      // Evaluate Cubic Bezier position & tangent angle at u
      const inv = 1 - u;
      const b0 = inv * inv * inv;
      const b1 = 3 * inv * inv * u;
      const b2 = 3 * inv * u * u;
      const b3 = u * u * u;

      const sx = b0 * p0x + b1 * p1x + b2 * p2x + b3 * p3x;
      const sy = b0 * p0y + b1 * p1y + b2 * p2y + b3 * p3y;

      const d0 = 3 * inv * inv;
      const d1 = 6 * inv * u;
      const d2 = 3 * u * u;
      const tx = d0 * (p1x - p0x) + d1 * (p2x - p1x) + d2 * (p3x - p2x);
      const ty = d0 * (p1y - p0y) + d1 * (p2y - p1y) + d2 * (p3y - p2y);
      const angleDeg = (Math.atan2(ty, tx) * 180) / Math.PI;

      if (shipRef.current) {
        if (rawP >= IMPACT_PROGRESS) {
          // Crunch and disappear rapidly upon crashing into the button
          const crush = Math.min(1, (rawP - IMPACT_PROGRESS) / 0.045);
          const crushScale = Math.max(0, (1 - crush) * 1.15);
          shipRef.current.setAttribute(
            "transform",
            `translate(${p3x.toFixed(2)}, ${p3y.toFixed(2)}) rotate(${angleDeg.toFixed(1)}) scale(${crushScale.toFixed(3)})`
          );
          shipRef.current.style.opacity = (1 - crush).toFixed(2);
        } else {
          // Ignition scale-in at launch, full size during flight
          const launchIn = Math.min(1, rawP / 0.04);
          const shipScale = 0.35 + 0.75 * launchIn;
          shipRef.current.setAttribute(
            "transform",
            `translate(${sx.toFixed(2)}, ${sy.toFixed(2)}) rotate(${angleDeg.toFixed(1)}) scale(${shipScale.toFixed(3)})`
          );
          shipRef.current.style.opacity = rawP > 0.002 ? "1" : "0.75";
        }
      }

      if (plumeRef.current) {
        const thrust = rawP < IMPACT_PROGRESS ? Math.min(1, rawP * 4.5) : 0;
        plumeRef.current.setAttribute(
          "transform",
          `scale(${(0.35 + thrust * 1.15).toFixed(2)}, ${(0.8 + thrust * 0.3).toFixed(2)})`
        );
        plumeRef.current.style.opacity = (0.15 + thrust * 0.85).toFixed(2);
      }

      // Crash Explosion / Shockwave at CTA impact point (p >= IMPACT_PROGRESS)
      if (crashGroupRef.current) {
        crashGroupRef.current.setAttribute("transform", `translate(${p3x.toFixed(1)}, ${p3y.toFixed(1)})`);
        if (rawP >= IMPACT_PROGRESS && crashProgress < 1) {
          crashGroupRef.current.style.opacity = "1";
          const burstEase = 1 - Math.pow(1 - crashProgress, 2.4);
          const fadeOut = Math.max(0, 1 - crashProgress * 1.15);

          if (crashRingRef.current) {
            crashRingRef.current.setAttribute("r", (6 + burstEase * 58).toFixed(1));
            crashRingRef.current.style.opacity = fadeOut.toFixed(2);
          }
          if (crashFlashRef.current) {
            const flashFade = Math.max(0, 1 - crashProgress * 2.8);
            crashFlashRef.current.setAttribute("r", (4 + burstEase * 24).toFixed(1));
            crashFlashRef.current.style.opacity = flashFade.toFixed(2);
          }
          SPARK_ANGLES.forEach((deg, idx) => {
            const line = sparkRefs.current[idx];
            if (!line) return;
            const rad = (deg * Math.PI) / 180;
            const innerR = 6 + burstEase * 32;
            const outerR = 14 + burstEase * 52;
            line.setAttribute("x1", (Math.cos(rad) * innerR).toFixed(1));
            line.setAttribute("y1", (Math.sin(rad) * innerR).toFixed(1));
            line.setAttribute("x2", (Math.cos(rad) * outerR).toFixed(1));
            line.setAttribute("y2", (Math.sin(rad) * outerR).toFixed(1));
            line.style.opacity = fadeOut.toFixed(2);
          });
        } else {
          crashGroupRef.current.style.opacity = "0";
        }
      }

      const isCrashedNow = rawP >= IMPACT_PROGRESS;
      if (isCrashedNow !== wasCrashed) {
        wasCrashed = isCrashedNow;
        const parentSection = root.closest("section");
        const ctaEl = parentSection?.querySelector<HTMLElement>(".sponsors-cta");
        ctaEl?.classList.toggle("is-docked", isCrashedNow);
        ctaEl?.classList.toggle("is-crashed", isCrashedNow);
      }
    };

    const parentSection = root.closest("section") || root;

    // Pin the Sponsors section when it reaches top of viewport; scrolling then drives
    // the rocket from the Earth planet into the CTA button crash before unpinning.
    let st: ScrollTrigger | null = null;
    if (!reduceMotion && typeof ScrollTrigger?.create === "function") {
      st = ScrollTrigger.create({
        trigger: parentSection,
        start: "top top",
        end: "+=105%",
        pin: true,
        scrub: 0.35,
        invalidateOnRefresh: true,
        onRefresh: measureDockTarget,
        onEnter: measureDockTarget,
        onUpdate: (self) => {
          measureDockTarget();
          flightAim = self.progress;
        },
      });
    }

    measureDockTarget();
    renderScene(0, flightCur);

    if (reduceMotion) return;

    const tick = () => {
      const ratio = gsap.ticker?.deltaRatio ? gsap.ticker.deltaRatio(60) : 1;
      const dt = (1 / 60) * ratio;

      const targetSpeed = hoveredRef.current ? 1.55 : 1.0;
      speedMultiplier += (targetSpeed - speedMultiplier) * 0.05;
      elapsed += dt * speedMultiplier;

      pointerCur.x += (pointerAim.x - pointerCur.x) * 0.06;
      pointerCur.y += (pointerAim.y - pointerCur.y) * 0.06;
      flightCur += (flightAim - flightCur) * 0.14;

      renderScene(elapsed, flightCur);
    };

    const syncTicker = () => {
      if (isVisible && !tickerAttached && gsap.ticker?.add) {
        measureDockTarget();
        gsap.ticker.add(tick);
        tickerAttached = true;
      } else if (!isVisible && tickerAttached) {
        gsap.ticker?.remove?.(tick);
        tickerAttached = false;
      }
    };

    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        ([entry]) => {
          isVisible = entry.isIntersecting;
          syncTicker();
        },
        { rootMargin: "150px 0px" }
      );
      observer.observe(parentSection);
    }

    syncTicker();
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("resize", measureDockTarget, { passive: true });

    return () => {
      st?.kill();
      observer?.disconnect();
      if (tickerAttached) {
        gsap.ticker?.remove?.(tick);
      }
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", measureDockTarget);
    };
  }, [isMobile]);

  if (isMobile) {
    return null;
  }

  return (
    <div
      ref={rootRef}
      className={`sponsors-orrery${hoveredNode ? " is-resonating" : ""}`}
      aria-hidden="true"
    >
      <svg
        ref={svgRef}
        className="sponsors-orrery__svg"
        viewBox="0 0 1600 960"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <radialGradient id="orrery-core-mist" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f4f4f2" stopOpacity="0.045" />
            <stop offset="55%" stopColor="#fff1d6" stopOpacity="0.015" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="orrery-sphere-light" cx="34%" cy="30%" r="72%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="48%" stopColor="#d6d6d2" />
            <stop offset="85%" stopColor="#525250" />
            <stop offset="100%" stopColor="#1a1a1a" />
          </radialGradient>

          <radialGradient id="orrery-sphere-warm" cx="34%" cy="30%" r="72%">
            <stop offset="0%" stopColor="#fffaf0" />
            <stop offset="46%" stopColor="#d8cbb8" />
            <stop offset="84%" stopColor="#5c5346" />
            <stop offset="100%" stopColor="#181512" />
          </radialGradient>

          {/* Earth (Terran) Oceanic & Atmospheric Gradient */}
          <radialGradient id="orrery-earth-ocean" cx="34%" cy="28%" r="76%">
            <stop offset="0%" stopColor="#e0f2fe" />
            <stop offset="32%" stopColor="#38bdf8" />
            <stop offset="68%" stopColor="#0369a1" />
            <stop offset="100%" stopColor="#07192b" />
          </radialGradient>

          <clipPath id="orrery-earth-clip">
            <circle cx="0" cy="0" r="13.5" />
          </clipPath>

          <linearGradient id="orrery-ring-stroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f4f4f2" stopOpacity="0.08" />
            <stop offset="50%" stopColor="#fff1d6" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#f4f4f2" stopOpacity="0.08" />
          </linearGradient>

          {/* Rocket Hull Metallic Gradient */}
          <linearGradient id="orrery-rocket-body" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="52%" stopColor="#e4e4e0" />
            <stop offset="100%" stopColor="#71717a" />
          </linearGradient>

          {/* Rocket Exhaust Flame Gradient */}
          <linearGradient id="orrery-rocket-flame" x1="100%" y1="50%" x2="0%" y2="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98" />
            <stop offset="32%" stopColor="#fde047" stopOpacity="0.9" />
            <stop offset="68%" stopColor="#f97316" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </linearGradient>

          {/* Crash Impact Flash Gradient */}
          <radialGradient id="orrery-crash-flash" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#fff1d6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g ref={planeRef} className="sponsors-orrery__plane">
          {/* Subtle Ambient Core Halo */}
          <circle
            cx={CENTER_X}
            cy={CENTER_Y}
            r="410"
            fill="url(#orrery-core-mist)"
            className="orrery-barycenter"
          />

          {/* 3 Minimalist Architectural Orbital Rings */}
          <g className="orrery-tracks">
            <ellipse
              cx={CENTER_X}
              cy={CENTER_Y}
              rx={520}
              ry={215}
              transform={`rotate(-2.5 ${CENTER_X} ${CENTER_Y})`}
              className="orrery-track orrery-track--inner"
            />
            <ellipse
              cx={CENTER_X}
              cy={CENTER_Y}
              rx={635}
              ry={275}
              transform={`rotate(3 ${CENTER_X} ${CENTER_Y})`}
              className="orrery-track orrery-track--dashed"
            />
            <ellipse
              cx={CENTER_X}
              cy={CENTER_Y}
              rx={735}
              ry={332}
              transform={`rotate(-3.5 ${CENTER_X} ${CENTER_Y})`}
              className="orrery-track orrery-track--outer"
            />
          </g>

          {/* 3 Celestial Bodies (Outer Orbit = Earth-Type Planet) */}
          <g className="orrery-bodies">
            {/* 1. Inner Orbital Node: Sculpted Monochromatic Sphere */}
            <g
              ref={(el) => {
                bodyRefs.current.inner = el;
              }}
              className="solar-planet-node"
            >
              <circle
                cx="0"
                cy="0"
                r="10"
                stroke="rgba(244, 244, 242, 0.16)"
                strokeWidth="0.7"
              />
              <circle cx="0" cy="0" r="4.5" fill="url(#orrery-sphere-light)" />
            </g>

            {/* 2. Mid Orbital Body: Minimalist Ringed Planet */}
            <g
              ref={(el) => {
                bodyRefs.current.mid = el;
              }}
              className="solar-planet-node"
            >
              <g transform="rotate(-18)">
                <ellipse
                  cx="0"
                  cy="0"
                  rx="21"
                  ry="5.8"
                  stroke="url(#orrery-ring-stroke)"
                  strokeWidth="1.4"
                />
              </g>
              <circle cx="0" cy="0" r="8.5" fill="url(#orrery-sphere-warm)" />
              <g transform="rotate(-18)">
                <path
                  d="M -21 0 A 21 5.8 0 0 0 21 0"
                  stroke="url(#orrery-ring-stroke)"
                  strokeWidth="1.6"
                  fill="none"
                />
              </g>
            </g>

            {/* 3. Outer Orbital Body: Earth-Type (Terran) Planet + Lunar Satellite */}
            <g
              ref={(el) => {
                bodyRefs.current.earth = el;
              }}
              className="solar-planet-node solar-planet-node--earth"
            >
              {/* Lunar Orbit Ring */}
              <ellipse
                cx="0"
                cy="0"
                rx="24"
                ry="13"
                stroke="rgba(244, 244, 242, 0.18)"
                strokeWidth="0.65"
                strokeDasharray="2 3"
              />
              {/* Atmospheric Ozone Halo */}
              <circle cx="0" cy="0" r="19" fill="rgba(56, 189, 248, 0.12)" />
              {/* Oceanic Sphere */}
              <circle cx="0" cy="0" r="13.5" fill="url(#orrery-earth-ocean)" />
              {/* Sculpted Continental Landmasses & Cloud Bands */}
              <g clipPath="url(#orrery-earth-clip)">
                <path
                  d="M -9 -8 C -4 -9, -1 -5, 2 -6 C 5 -7, 8 -3, 6 1 C 3 4, -2 2, -5 5 C -8 7, -11 2, -9 -8 Z"
                  fill="#a7f3d0"
                  opacity="0.42"
                />
                <path
                  d="M 3 4 C 7 3, 11 6, 10 10 C 8 12, 4 11, 2 8 Z"
                  fill="#d6d3d1"
                  opacity="0.38"
                />
                <path
                  d="M -10 -2 Q -2 -6 8 -1 M -8 5 Q 1 9 10 4"
                  stroke="#ffffff"
                  strokeOpacity="0.55"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  fill="none"
                />
              </g>
              {/* Atmospheric Ozone Rim */}
              <circle
                cx="0"
                cy="0"
                r="14.2"
                stroke="#7dd3fc"
                strokeOpacity="0.52"
                strokeWidth="0.9"
              />
              {/* Orbiting Moon (Luna) */}
              <g ref={moonRef}>
                <circle cx="0" cy="0" r="2.3" fill="#f4f4f2" />
              </g>
            </g>
          </g>
        </g>

        {/* ── Pinned Scroll Rocket Launch, Trajectory & Button Crash Burst ── */}
        <g className="orrery-transfer-layer">
          {/* Faint Dashed Guide Trajectory */}
          <path
            ref={transferTrackRef}
            className="orrery-transfer-track"
            stroke="rgba(244, 244, 242, 0.08)"
            strokeWidth="1"
            strokeDasharray="3 6"
            fill="none"
          />
          {/* Active Illuminated Rocket Trail */}
          <path
            ref={transferActiveRef}
            pathLength={1}
            className="orrery-transfer-active"
            stroke="rgba(255, 241, 214, 0.42)"
            strokeWidth="1.2"
            strokeDasharray="1"
            strokeDashoffset="1"
            fill="none"
          />

          {/* Crash Impact Shockwave & Spark Burst at CTA Button */}
          <g ref={crashGroupRef} className="orrery-crash-burst" style={{ opacity: 0 }}>
            <circle ref={crashFlashRef} cx="0" cy="0" r="12" fill="url(#orrery-crash-flash)" />
            <circle
              ref={crashRingRef}
              cx="0"
              cy="0"
              r="10"
              stroke="#fff1d6"
              strokeWidth="1.3"
              fill="none"
            />
            {SPARK_ANGLES.map((deg, idx) => (
              <line
                key={deg}
                ref={(el) => {
                  sparkRefs.current[idx] = el;
                }}
                x1="0"
                y1="0"
                x2="0"
                y2="0"
                stroke={idx % 2 === 0 ? "#ffffff" : "#7dd3fc"}
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            ))}
          </g>

          {/* Sculpted Rocket SVG (oriented along +X axis) */}
          <g ref={shipRef} className="orrery-rocket">
            {/* Multi-Stage Booster Exhaust Flame */}
            <g ref={plumeRef} transform="scale(0.5, 1)">
              <path
                d="M -11 0 L -38 -5.5 L -29 0 L -38 5.5 Z"
                fill="url(#orrery-rocket-flame)"
              />
              <path
                d="M -10 0 L -24 -2.4 L -24 2.4 Z"
                fill="#ffffff"
                opacity="0.92"
              />
            </g>

            {/* Swept Booster Fins */}
            <path
              d="M -3 -3.8 L -11 -10.5 L -14.5 -10.5 L -10 -3.2 Z"
              fill="#a1a1aa"
              stroke="#e4e4e7"
              strokeWidth="0.5"
              strokeLinejoin="round"
            />
            <path
              d="M -3 3.8 L -11 10.5 L -14.5 10.5 L -10 3.2 Z"
              fill="#a1a1aa"
              stroke="#e4e4e7"
              strokeWidth="0.5"
              strokeLinejoin="round"
            />

            {/* Thruster Engine Nozzle Bell */}
            <path
              d="M -9.5 -2.8 L -13 -4 L -13 4 L -9.5 2.8 Z"
              fill="#3f3f46"
              stroke="#a1a1aa"
              strokeWidth="0.5"
            />

            {/* Main Cylindrical & Ogive Rocket Fuselage */}
            <path
              d="M 17 0 C 11.5 -5, 3 -5.4, -9.5 -3.8 L -9.5 3.8 C 3 5.4, 11.5 5, 17 0 Z"
              fill="url(#orrery-rocket-body)"
              stroke="#ffffff"
              strokeWidth="0.6"
            />

            {/* Nose Cone Accent Cap */}
            <path
              d="M 17 0 C 13.5 -3, 10 -4, 7.2 -4.4 L 7.2 4.4 C 10 4, 13.5 3, 17 0 Z"
              fill="#27272a"
            />

            {/* Circular Quartz Porthole Window */}
            <circle
              cx="1.2"
              cy="0"
              r="2.2"
              fill="#38bdf8"
              stroke="#ffffff"
              strokeWidth="0.7"
            />
            <circle cx="0.6" cy="-0.6" r="0.7" fill="#ffffff" opacity="0.85" />
          </g>
        </g>
      </svg>
    </div>
  );
}
