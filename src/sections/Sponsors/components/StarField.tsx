"use client";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "@/src/utils/gsapSetup";

interface StarFieldProps {
  /** Currently hovered sponsor node ID; subtly brightens the orbital tracks. */
  hoveredNode?: string | null;
}

interface MinimalOrbitBody {
  id: string;
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
const CENTER_Y = 505;

/**
 * Three quiet, architectural Keplerian orbits framing the sponsor constellation.
 * Monochromatic starlight & warm ivory palette matching --bg / --fg / --line.
 */
const ORBITING_BODIES: MinimalOrbitBody[] = [
  {
    id: "inner",
    rx: 560,
    ry: 248,
    tiltDeg: -3,
    initialAngle: 0.65,
    angularSpeed: 0.095,
  },
  {
    id: "mid",
    rx: 690,
    ry: 318,
    tiltDeg: 3.5,
    initialAngle: 2.65,
    angularSpeed: -0.062,
  },
  {
    id: "outer",
    rx: 815,
    ry: 382,
    tiltDeg: -4.5,
    initialAngle: 4.85,
    angularSpeed: 0.042,
    hasMoon: true,
    moonRadius: 18,
    moonSpeed: 0.9,
  },
];

export default function StarField({ hoveredNode = null }: StarFieldProps): React.ReactElement | null {
  const [isMobile, setIsMobile] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const planeRef = useRef<SVGGElement | null>(null);
  const bodyRefs = useRef<Record<string, SVGGElement | null>>({});
  const moonRef = useRef<SVGGElement | null>(null);
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
    if (!root) return;

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

    const onPointerMove = (e: PointerEvent) => {
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      pointerAim.x = e.clientX / w - 0.5;
      pointerAim.y = e.clientY / h - 0.5;
    };

    const renderPositions = (t: number) => {
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

        const depthScale = 0.88 + 0.16 * ((sinT + 1) * 0.5);
        const depthOpacity = 0.45 + 0.45 * ((sinT + 1) * 0.5);

        el.setAttribute(
          "transform",
          `translate(${x.toFixed(2)}, ${y.toFixed(2)}) scale(${depthScale.toFixed(3)})`
        );
        el.style.opacity = depthOpacity.toFixed(2);

        if (body.hasMoon && body.moonRadius && body.moonSpeed && moonRef.current) {
          const mAngle = t * body.moonSpeed;
          const mx = Math.cos(mAngle) * body.moonRadius;
          const my = Math.sin(mAngle) * (body.moonRadius * 0.55);
          moonRef.current.setAttribute("transform", `translate(${mx.toFixed(2)}, ${my.toFixed(2)})`);
        }
      }

      if (planeRef.current) {
        const px = (-pointerCur.x * 12).toFixed(2);
        const py = (-pointerCur.y * 8).toFixed(2);
        planeRef.current.setAttribute("transform", `translate(${px}, ${py})`);
      }
    };

    renderPositions(0);

    if (reduceMotion) return;

    const tick = () => {
      const ratio = gsap.ticker?.deltaRatio ? gsap.ticker.deltaRatio(60) : 1;
      const dt = (1 / 60) * ratio;

      const targetSpeed = hoveredRef.current ? 1.65 : 1.0;
      speedMultiplier += (targetSpeed - speedMultiplier) * 0.05;
      elapsed += dt * speedMultiplier;

      pointerCur.x += (pointerAim.x - pointerCur.x) * 0.05;
      pointerCur.y += (pointerAim.y - pointerCur.y) * 0.05;

      renderPositions(elapsed);
    };

    const syncTicker = () => {
      if (isVisible && !tickerAttached && gsap.ticker?.add) {
        gsap.ticker.add(tick);
        tickerAttached = true;
      } else if (!isVisible && tickerAttached) {
        gsap.ticker?.remove?.(tick);
        tickerAttached = false;
      }
    };

    const parentSection = root.closest("section") || root;
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

    return () => {
      observer?.disconnect();
      if (tickerAttached) {
        gsap.ticker?.remove?.(tick);
      }
      window.removeEventListener("pointermove", onPointerMove);
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

          <linearGradient id="orrery-ring-stroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f4f4f2" stopOpacity="0.08" />
            <stop offset="50%" stopColor="#fff1d6" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#f4f4f2" stopOpacity="0.08" />
          </linearGradient>
        </defs>

        <g ref={planeRef} className="sponsors-orrery__plane">
          {/* Subtle Ambient Core Halo */}
          <circle
            cx={CENTER_X}
            cy={CENTER_Y}
            r="420"
            fill="url(#orrery-core-mist)"
            className="orrery-barycenter"
          />

          {/* 3 Minimalist Architectural Orbital Rings */}
          <g className="orrery-tracks">
            <ellipse
              cx={CENTER_X}
              cy={CENTER_Y}
              rx={560}
              ry={248}
              transform={`rotate(-3 ${CENTER_X} ${CENTER_Y})`}
              className="orrery-track orrery-track--inner"
            />
            <ellipse
              cx={CENTER_X}
              cy={CENTER_Y}
              rx={690}
              ry={318}
              transform={`rotate(3.5 ${CENTER_X} ${CENTER_Y})`}
              className="orrery-track orrery-track--dashed"
            />
            <ellipse
              cx={CENTER_X}
              cy={CENTER_Y}
              rx={815}
              ry={382}
              transform={`rotate(-4.5 ${CENTER_X} ${CENTER_Y})`}
              className="orrery-track orrery-track--outer"
            />
          </g>

          {/* 3 Minimalist Monochromatic Celestial Bodies */}
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

            {/* 3. Outer Orbital Body: Sphere with Orbiting Lunar Satellite */}
            <g
              ref={(el) => {
                bodyRefs.current.outer = el;
              }}
              className="solar-planet-node"
            >
              <ellipse
                cx="0"
                cy="0"
                rx="18"
                ry="10"
                stroke="rgba(244, 244, 242, 0.14)"
                strokeWidth="0.65"
                strokeDasharray="2 3"
              />
              <circle cx="0" cy="0" r="6.5" fill="url(#orrery-sphere-light)" />
              <g ref={moonRef}>
                <circle cx="0" cy="0" r="2" fill="#f4f4f2" />
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
