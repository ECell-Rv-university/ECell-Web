"use client";
import React from "react";

export type CosmicPlanetType =
  | "sun"
  | "ringed"
  | "moon"
  | "giant"
  | "nexus"
  | "ice"
  | "terran"
  | "blackhole";

export const PLANET_DEPTH: Record<CosmicPlanetType, number> = {
  sun: 12,
  ringed: 24,
  moon: 32,
  giant: 14,
  nexus: 18,
  ice: 20,
  terran: 16,
  blackhole: 10,
};

interface CosmicPlanetProps {
  type: CosmicPlanetType;
  className?: string;
  idPrefix?: string;
}

export default function CosmicPlanet({
  type,
  className = "",
  idPrefix = "csm",
}: CosmicPlanetProps): React.ReactElement {
  const depth = PLANET_DEPTH[type];

  return (
    <div className={`bg-planet bg-planet--${type} ${className}`}>
      <div className="bg-planet__parallax" data-depth={depth}>
        {type === "sun" && <span className="bg-sun-wave" />}
        {type === "blackhole" && <span className="bg-bh-wave" />}

        <div className="bg-planet__body" role="img" aria-label={`Cosmic planet: ${type}`}>
          {renderPlanetArtwork(type, idPrefix)}
        </div>
      </div>
    </div>
  );
}

function renderPlanetArtwork(type: CosmicPlanetType, p: string): React.ReactElement {
  switch (type) {
    case "sun":
      return (
        <svg className="bg-planet__art" viewBox="0 0 200 200" fill="none">
          <defs>
            <radialGradient id={`${p}-sun-core`} cx="44%" cy="40%" r="62%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="45%" stopColor="#fffaf0" />
              <stop offset="80%" stopColor="#fff1d6" />
              <stop offset="100%" stopColor="#ecd2b0" />
            </radialGradient>
            <radialGradient id={`${p}-sun-glow`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff1d6" stopOpacity="0.55" />
              <stop offset="45%" stopColor="#fff1d6" stopOpacity="0.16" />
              <stop offset="75%" stopColor="#ff001a" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#ff001a" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle className="bg-sun__glow" cx="100" cy="100" r="98" fill={`url(#${p}-sun-glow)`} />
          <g className="bg-sun__rays" stroke="#fff1d6" strokeOpacity="0.45" strokeWidth="1.2" strokeLinecap="round">
            {Array.from({ length: 12 }, (_, i) => {
              const a = (i / 12) * Math.PI * 2;
              const outer = i % 2 === 0 ? 66 : 55;
              return (
                <line
                  key={i}
                  x1={(100 + Math.cos(a) * 44).toFixed(2)}
                  y1={(100 + Math.sin(a) * 44).toFixed(2)}
                  x2={(100 + Math.cos(a) * outer).toFixed(2)}
                  y2={(100 + Math.sin(a) * outer).toFixed(2)}
                />
              );
            })}
          </g>
          <circle cx="100" cy="100" r="36" fill={`url(#${p}-sun-core)`} />
        </svg>
      );

    case "ringed":
      return (
        <svg className="bg-planet__art" viewBox="0 0 200 140" fill="none">
          <defs>
            <radialGradient id={`${p}-ringed-body`} cx="36%" cy="30%" r="78%">
              <stop offset="0%" stopColor="#fff1d6" />
              <stop offset="45%" stopColor="#b89f86" />
              <stop offset="100%" stopColor="#1a1716" />
            </radialGradient>
            <linearGradient id={`${p}-ring`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f4f4f2" stopOpacity="0" />
              <stop offset="50%" stopColor="#f4f4f2" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#f4f4f2" stopOpacity="0" />
            </linearGradient>
            <clipPath id={`${p}-ring-front`}>
              <rect x="0" y="70" width="200" height="70" />
            </clipPath>
            <clipPath id={`${p}-ringed-clip`}>
              <circle cx="100" cy="70" r="40" />
            </clipPath>
          </defs>
          <g transform="rotate(-16 100 70)">
            <ellipse cx="100" cy="70" rx="90" ry="19" stroke={`url(#${p}-ring)`} strokeWidth="1.6" opacity="0.55" />
            <ellipse cx="100" cy="70" rx="76" ry="15" stroke={`url(#${p}-ring)`} strokeWidth="0.8" opacity="0.4" />
          </g>
          <circle cx="100" cy="70" r="40" fill={`url(#${p}-ringed-body)`} />
          <g clipPath={`url(#${p}-ringed-clip)`} opacity="0.24">
            <ellipse cx="100" cy="56" rx="48" ry="4" fill="#fff1d6" />
            <ellipse cx="100" cy="72" rx="48" ry="2.5" fill="#1a1716" />
            <ellipse cx="100" cy="84" rx="48" ry="3.5" fill="#fff1d6" />
          </g>
          <g transform="rotate(-16 100 70)" clipPath={`url(#${p}-ring-front)`}>
            <ellipse cx="100" cy="70" rx="90" ry="19" stroke={`url(#${p}-ring)`} strokeWidth="2" />
            <ellipse cx="100" cy="70" rx="76" ry="15" stroke={`url(#${p}-ring)`} strokeWidth="1" opacity="0.75" />
          </g>
        </svg>
      );

    case "moon":
      return (
        <svg className="bg-planet__art" viewBox="0 0 60 60" fill="none">
          <defs>
            <radialGradient id={`${p}-moon`} cx="64%" cy="30%" r="80%">
              <stop offset="0%" stopColor="#f4f4f2" />
              <stop offset="55%" stopColor="#8a8a8e" />
              <stop offset="100%" stopColor="#151517" />
            </radialGradient>
          </defs>
          <circle cx="30" cy="30" r="24" fill={`url(#${p}-moon)`} />
          <g fill="#151517" opacity="0.32">
            <circle cx="24" cy="24" r="4" />
            <circle cx="36" cy="36" r="5.5" />
            <circle cx="37" cy="19" r="2.2" />
            <circle cx="20" cy="38" r="2" />
            <circle cx="32" cy="27" r="1.6" />
          </g>
          {/* Orbiting miniature satellite */}
          <g className="bg-moon__satellite">
            <circle cx="30" cy="3" r="1.5" fill="#f4f4f2" opacity="0.85" />
            <circle cx="30" cy="3" r="3.5" stroke="#f4f4f2" strokeWidth="0.5" opacity="0.35" />
          </g>
        </svg>
      );

    case "giant":
      return (
        <svg className="bg-planet__art" viewBox="0 0 200 200" fill="none">
          <defs>
            <radialGradient id={`${p}-giant`} cx="62%" cy="34%" r="80%">
              <stop offset="0%" stopColor="#7d8cff" />
              <stop offset="40%" stopColor="#2f45ff" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#07081a" />
            </radialGradient>
            <clipPath id={`${p}-giant-clip`}>
              <circle cx="100" cy="100" r="80" />
            </clipPath>
          </defs>
          <circle cx="100" cy="100" r="86" stroke="#7d8cff" strokeOpacity="0.22" strokeWidth="6" />
          <circle cx="100" cy="100" r="80" fill={`url(#${p}-giant)`} />
          <g clipPath={`url(#${p}-giant-clip)`} opacity="0.2">
            <path d="M10 78 C 60 70, 140 92, 190 80" stroke="#c9d0ff" strokeWidth="6" />
            <path d="M10 112 C 70 104, 130 124, 190 110" stroke="#c9d0ff" strokeWidth="4" />
            <path d="M10 140 C 60 134, 140 150, 190 138" stroke="#c9d0ff" strokeWidth="5" />
          </g>
        </svg>
      );

    case "nexus":
      return (
        <svg className="bg-planet__art" viewBox="0 0 200 200" fill="none">
          <defs>
            <radialGradient id={`${p}-nexus-core`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#fff1d6" />
              <stop offset="70%" stopColor="#ffd700" />
              <stop offset="100%" stopColor="#ffaa00" stopOpacity="0.2" />
            </radialGradient>
            <radialGradient id={`${p}-nexus-halo`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffd700" stopOpacity="0.5" />
              <stop offset="60%" stopColor="#ffd700" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#ff001a" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="100" cy="100" r="95" fill={`url(#${p}-nexus-halo)`} />
          <g className="bg-nexus__ring">
            <circle cx="100" cy="100" r="62" stroke="#fff1d6" strokeWidth="0.9" strokeDasharray="6 4" opacity="0.6" />
            <circle cx="100" cy="100" r="78" stroke="#ffd700" strokeWidth="0.6" strokeDasharray="3 6" opacity="0.4" />
          </g>
          {/* Diamond Starlight Spikes */}
          <g className="bg-nexus__spikes" stroke="#ffffff" strokeOpacity="0.85" strokeWidth="1.2">
            <line x1="100" y1="25" x2="100" y2="175" />
            <line x1="25" y1="100" x2="175" y2="100" />
            <line x1="48" y1="48" x2="152" y2="152" strokeWidth="0.8" strokeOpacity="0.6" />
            <line x1="152" y1="48" x2="48" y2="152" strokeWidth="0.8" strokeOpacity="0.6" />
          </g>
          <circle cx="100" cy="100" r="28" fill={`url(#${p}-nexus-core)`} />
        </svg>
      );

    case "ice":
      return (
        <svg className="bg-planet__art" viewBox="0 0 200 160" fill="none">
          <defs>
            <radialGradient id={`${p}-ice-core`} cx="38%" cy="32%" r="75%">
              <stop offset="0%" stopColor="#cffafe" />
              <stop offset="42%" stopColor="#06b6d4" />
              <stop offset="85%" stopColor="#0e7490" />
              <stop offset="100%" stopColor="#082f49" />
            </radialGradient>
            <linearGradient id={`${p}-ice-ring`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#a5f3fc" stopOpacity="0" />
              <stop offset="50%" stopColor="#a5f3fc" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#a5f3fc" stopOpacity="0" />
            </linearGradient>
            <clipPath id={`${p}-ice-front`}>
              <rect x="0" y="80" width="200" height="80" />
            </clipPath>
          </defs>
          {/* Back ring */}
          <g transform="rotate(22 100 80)">
            <ellipse cx="100" cy="80" rx="86" ry="16" stroke={`url(#${p}-ice-ring)`} strokeWidth="1.8" opacity="0.65" />
          </g>
          {/* Polar Aurora Crown */}
          <g className="bg-ice__aurora" opacity="0.75">
            <ellipse cx="94" cy="52" rx="34" ry="10" stroke="#67e8f9" strokeWidth="2.5" fill="none" opacity="0.4" />
          </g>
          <circle cx="100" cy="80" r="38" fill={`url(#${p}-ice-core)`} />
          {/* Front ring */}
          <g transform="rotate(22 100 80)" clipPath={`url(#${p}-ice-front)`}>
            <ellipse cx="100" cy="80" rx="86" ry="16" stroke={`url(#${p}-ice-ring)`} strokeWidth="2.2" opacity="0.9" />
          </g>
        </svg>
      );

    case "terran":
      return (
        <svg className="bg-planet__art" viewBox="0 0 200 200" fill="none">
          <defs>
            <radialGradient id={`${p}-terran-core`} cx="36%" cy="34%" r="76%">
              <stop offset="0%" stopColor="#fed7aa" />
              <stop offset="45%" stopColor="#ea580c" />
              <stop offset="85%" stopColor="#7c2d12" />
              <stop offset="100%" stopColor="#431407" />
            </radialGradient>
            <clipPath id={`${p}-terran-clip`}>
              <circle cx="100" cy="100" r="46" />
            </clipPath>
          </defs>
          <circle cx="100" cy="100" r="50" stroke="#fb923c" strokeOpacity="0.25" strokeWidth="4" />
          <circle cx="100" cy="100" r="46" fill={`url(#${p}-terran-core)`} />
          <g clipPath={`url(#${p}-terran-clip)`} opacity="0.32" stroke="#fff1d6" strokeWidth="3" fill="none" strokeLinecap="round">
            <path d="M 68 84 Q 86 68 114 74 T 138 96" />
            <path d="M 60 110 Q 90 125 125 115" />
            <path d="M 85 132 Q 105 142 128 135" strokeWidth="2" />
          </g>
        </svg>
      );

    case "blackhole":
      return (
        <svg className="bg-planet__art" viewBox="0 0 300 200" fill="none">
          <defs>
            <radialGradient id={`${p}-bh-glow`} cx="50%" cy="55%" r="50%">
              <stop offset="0%" stopColor="#fff1d6" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#fff1d6" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#fff1d6" stopOpacity="0" />
            </radialGradient>
            <linearGradient id={`${p}-bh-disk`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ecd2b0" stopOpacity="0" />
              <stop offset="22%" stopColor="#ecd2b0" stopOpacity="0.55" />
              <stop offset="50%" stopColor="#fffaf0" stopOpacity="0.95" />
              <stop offset="78%" stopColor="#ecd2b0" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#ecd2b0" stopOpacity="0" />
            </linearGradient>
            <clipPath id={`${p}-bh-back`}>
              <rect x="0" y="0" width="300" height="110" />
            </clipPath>
            <clipPath id={`${p}-bh-front`}>
              <rect x="0" y="110" width="300" height="90" />
            </clipPath>
          </defs>
          <g transform="rotate(-18 150 110)">
            <ellipse cx="150" cy="110" rx="150" ry="95" fill={`url(#${p}-bh-glow)`} />
            <ellipse
              className="bg-bh__disk"
              cx="150"
              cy="110"
              rx="128"
              ry="22"
              stroke={`url(#${p}-bh-disk)`}
              strokeWidth="7"
              opacity="0.6"
              clipPath={`url(#${p}-bh-back)`}
            />
            <circle cx="150" cy="110" r="57" stroke={`url(#${p}-bh-disk)`} strokeWidth="3" opacity="0.65" clipPath={`url(#${p}-bh-back)`} />
            <circle cx="150" cy="110" r="46" fill="#000000" stroke="#fff1d6" strokeOpacity="0.6" strokeWidth="1.2" />
            <ellipse
              className="bg-bh__disk"
              cx="150"
              cy="110"
              rx="128"
              ry="22"
              stroke={`url(#${p}-bh-disk)`}
              strokeWidth="9"
              clipPath={`url(#${p}-bh-front)`}
            />
            <ellipse cx="150" cy="110" rx="100" ry="15" stroke="#fffaf0" strokeOpacity="0.35" strokeWidth="1" clipPath={`url(#${p}-bh-front)`} />
          </g>
        </svg>
      );
  }
}

