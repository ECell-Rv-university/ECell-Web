"use client";
import React, { useState } from "react";

export type CosmicPlanetType =
  | "sun"
  | "sirius"
  | "ringed"
  | "moon"
  | "giant"
  | "nexus"
  | "ice"
  | "dyson"
  | "terran"
  | "cluster"
  | "blackhole"
  | "m87";

export const PLANET_DEPTH: Record<CosmicPlanetType, number> = {
  sun: 12,
  sirius: 12,
  ringed: 24,
  moon: 32,
  giant: 14,
  nexus: 18,
  ice: 20,
  dyson: 18,
  terran: 16,
  cluster: 22,
  blackhole: 10,
  m87: 10,
};

export interface PlanetTelemetry {
  sector: string;
  name: string;
  classification: string;
  description: string;
  ra: string;
  dec: string;
  magnitude: string;
  distance: string;
}

export const PLANET_TELEMETRY: Record<CosmicPlanetType, PlanetTelemetry> = {
  sun: {
    sector: "SEC-05",
    name: "HELIOS SOL",
    classification: "Class G2V · Yellow Dwarf",
    description: "Solar ignition & light-delay anchor",
    ra: "00h 00m 00s",
    dec: "+00° 00' 00\"",
    magnitude: "-26.74 MAG",
    distance: "1.00 AU",
  },
  sirius: {
    sector: "SEC-01",
    name: "SIRIUS AB",
    classification: "Class A1V + DA2 · Binary Star",
    description: "Brightest beacon in the night sky",
    ra: "06h 45m 09s",
    dec: "-16° 42' 58\"",
    magnitude: "-1.46 MAG",
    distance: "8.60 ly",
  },
  ringed: {
    sector: "SEC-02",
    name: "ORBITALIS CHRONO",
    classification: "Cassini Resonance · 9.5 AU",
    description: "Accretion disk & venture foundations",
    ra: "02h 42m 18s",
    dec: "+14° 12' 09\"",
    magnitude: "+0.46 MAG",
    distance: "9.58 AU",
  },
  giant: {
    sector: "SEC-03",
    name: "JOVIAN KINETIC",
    classification: "Atmospheric Vortex · 2.5G",
    description: "Gravitational slingshot & hackathons",
    ra: "05h 18m 44s",
    dec: "+22° 31' 50\"",
    magnitude: "-2.94 MAG",
    distance: "5.20 AU",
  },
  nexus: {
    sector: "SEC-04",
    name: "PULSAR BEACON",
    classification: "Pulsar Array · Period 1.337s",
    description: "Founder navigation lighthouse",
    ra: "08h 35m 20s",
    dec: "-45° 10' 35\"",
    magnitude: "-4.12 MAG",
    distance: "0.28 kpc",
  },
  ice: {
    sector: "SEC-05",
    name: "KRYOS CAPITAL",
    classification: "Cryo-Ring Matrix · 40K",
    description: "Institutional reserves & warp fuel",
    ra: "11h 09m 51s",
    dec: "+06° 44' 12\"",
    magnitude: "+5.38 MAG",
    distance: "19.2 AU",
  },
  dyson: {
    sector: "SEC-05",
    name: "HELIOS DYSON SWARM",
    classification: "Type-II Megastructure · 1.00 AU",
    description: "Captured stellar core & syndicate power grid",
    ra: "11h 09m 51s",
    dec: "+06° 44' 12\"",
    magnitude: "-4.80 MAG",
    distance: "1.42 AU",
  },
  terran: {
    sector: "SEC-06",
    name: "TERRA FIRMA",
    classification: "Atmosphere 1.0 ATM · 1.0G",
    description: "Product grounding & market soil",
    ra: "14h 29m 42s",
    dec: "-62° 40' 46\"",
    magnitude: "-1.45 MAG",
    distance: "1.30 pc",
  },
  moon: {
    sector: "SEC-07",
    name: "SELENA ARCHIVE",
    classification: "Lunar Monolith · 27.3d",
    description: "Milestone annals & indelible history",
    ra: "17h 55m 10s",
    dec: "-19° 08' 22\"",
    magnitude: "-12.74 MAG",
    distance: "384,400 km",
  },
  cluster: {
    sector: "SEC-08",
    name: "PLEIADES SYNDICATE",
    classification: "Open Cluster · 128 Nodes",
    description: "Coalescing founder constellation",
    ra: "03h 47m 24s",
    dec: "+24° 07' 00\"",
    magnitude: "+1.60 MAG",
    distance: "136.2 pc",
  },
  blackhole: {
    sector: "SEC-05",
    name: "SAGITTARIUS A*",
    classification: "Galactic Core · 4.1M M☉",
    description: "Gravitational anchor of the constellation",
    ra: "17h 45m 40s",
    dec: "-29° 00' 28\"",
    magnitude: "4.1M M☉",
    distance: "8.18 kpc",
  },
  m87: {
    sector: "SEC-09",
    name: "M87* POWEHI",
    classification: "Supermassive BH · Relativistic Jet",
    description: "Infinite community gravitational pull",
    ra: "12h 30m 49s",
    dec: "+12° 23' 28\"",
    magnitude: "6.5B M☉",
    distance: "53.5 Mly",
  },
};

interface CosmicPlanetProps {
  type: CosmicPlanetType;
  className?: string;
  style?: React.CSSProperties;
  idPrefix?: string;
  showTelemetry?: boolean;
  telemetryAlign?: "left" | "right";
}

export default function CosmicPlanet({
  type,
  className = "",
  style,
  idPrefix = "csm",
  showTelemetry = true,
  telemetryAlign = "left",
}: CosmicPlanetProps): React.ReactElement {
  const depth = PLANET_DEPTH[type];
  const telemetry = PLANET_TELEMETRY[type];
  const [isActive, setIsActive] = useState(false);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.currentTarget.click();
    }
  };

  const actionHint =
    type === "sun"
      ? "Toggle solar illumination"
      : type === "sirius"
        ? "Pulse Sirius binary flare"
        : type === "blackhole" || type === "m87"
          ? "Toggle gravitational singularity"
          : "Spin celestial body";

  return (
    <div
      className={`bg-planet bg-planet--${type} ${className}`.trim()}
      style={style}
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
    >
      <div className="bg-planet__parallax" data-depth={depth}>
        {(type === "sun" || type === "sirius") && <span className="bg-sun-wave" aria-hidden="true" />}
        {(type === "blackhole" || type === "m87") && <span className="bg-bh-wave" aria-hidden="true" />}

        {/* Ambient Atmospheric Halo */}
        <div className="bg-planet__halo" aria-hidden="true" />

        {/* Orbital Target-Lock Astrometric Reticle */}
        <svg
          className={`bg-planet__reticle ${isActive ? "is-locked" : ""}`}
          viewBox="0 0 120 120"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="60"
            cy="60"
            r="56"
            stroke="currentColor"
            strokeWidth="0.75"
            strokeDasharray="6 6 2 6"
            opacity="0.45"
          />
          <circle
            cx="60"
            cy="60"
            r="50"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeDasharray="18 32"
            opacity="0.65"
          />
          <path d="M60 1 V8 M60 112 V119 M1 60 H8 M112 60 H119" stroke="currentColor" strokeWidth="1" opacity="0.85" />
          <path d="M16 26 L16 16 L26 16" stroke="currentColor" strokeWidth="1.2" />
          <path d="M94 16 L104 16 L104 26" stroke="currentColor" strokeWidth="1.2" />
          <path d="M16 94 L16 104 L26 104" stroke="currentColor" strokeWidth="1.2" />
          <path d="M94 104 L104 104 L104 94" stroke="currentColor" strokeWidth="1.2" />
        </svg>

        <div
          className="bg-planet__body"
          role="button"
          tabIndex={0}
          aria-label={`${telemetry.name} (${telemetry.sector}): ${actionHint}`}
          onFocus={() => setIsActive(true)}
          onBlur={() => setIsActive(false)}
          onKeyDown={handleKeyDown}
        >
          {renderPlanetArtwork(type, idPrefix)}
        </div>

        {/* Interactive Astrometric Telemetry HUD Badge */}
        {showTelemetry && (
          <aside
            className={`bg-planet__telemetry bg-planet__telemetry--${telemetryAlign} ${isActive ? "is-active" : ""}`}
            aria-hidden="true"
          >
            <div className="bg-planet__telemetry-line" />
            <div className="bg-planet__telemetry-card">
              <div className="bg-planet__telemetry-header">
                <span className="bg-planet__telemetry-sector">{telemetry.sector}</span>
                <span className="bg-planet__telemetry-status">ORBIT LOCKED</span>
              </div>
              <p className="bg-planet__telemetry-name">{telemetry.name}</p>
              <p className="bg-planet__telemetry-spec">{telemetry.classification}</p>
              <div className="bg-planet__telemetry-grid">
                <div>
                  <span>RA</span>
                  <b>{telemetry.ra}</b>
                </div>
                <div>
                  <span>DEC</span>
                  <b>{telemetry.dec}</b>
                </div>
                <div>
                  <span>MAG</span>
                  <b>{telemetry.magnitude}</b>
                </div>
                <div>
                  <span>DIST</span>
                  <b>{telemetry.distance}</b>
                </div>
              </div>
              <p className="bg-planet__telemetry-desc">{telemetry.description}</p>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

function renderPlanetArtwork(type: CosmicPlanetType, p: string): React.ReactElement {
  switch (type) {
    case "sun":
      return (
        <svg className="bg-planet__art" viewBox="0 0 220 220" fill="none">
          <defs>
            <radialGradient id={`${p}-sun-core`} cx="45%" cy="42%" r="60%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="32%" stopColor="#fffaf0" />
              <stop offset="68%" stopColor="#fff1d6" />
              <stop offset="90%" stopColor="#ffd285" />
              <stop offset="100%" stopColor="#ff9a3c" />
            </radialGradient>
            <radialGradient id={`${p}-sun-glow`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff1d6" stopOpacity="0.62" />
              <stop offset="36%" stopColor="#ffd700" stopOpacity="0.28" />
              <stop offset="68%" stopColor="#ff5722" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#ff001a" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* Corona Bloom */}
          <circle className="bg-sun__glow" cx="110" cy="110" r="105" fill={`url(#${p}-sun-glow)`} />

          {/* Heliospheric Astrolabe Orbit Ring */}
          <circle
            cx="110"
            cy="110"
            r="84"
            stroke="#fff1d6"
            strokeOpacity="0.2"
            strokeWidth="0.7"
            strokeDasharray="2 7"
          />

          {/* Coronal Loops & Flares */}
          <g className="bg-sun__flares" stroke="#ffd700" strokeWidth="1.2" strokeLinecap="round" opacity="0.65">
            <path d="M 85 58 Q 72 42 90 38 Q 102 38 100 52" fill="none" />
            <path d="M 145 68 Q 165 52 170 70 Q 166 84 152 82" fill="none" />
            <path d="M 158 135 Q 178 145 168 162 Q 150 168 144 148" fill="none" />
            <path d="M 68 142 Q 50 152 54 130 Q 60 118 72 125" fill="none" />
          </g>

          {/* Kinetic Solar Spikes & Astrolabe Ticks */}
          <g className="bg-sun__rays" stroke="#fff1d6" strokeOpacity="0.52" strokeWidth="1.2" strokeLinecap="round">
            {Array.from({ length: 24 }, (_, i) => {
              const a = (i / 24) * Math.PI * 2;
              const inner = i % 3 === 0 ? 48 : 53;
              const outer = i % 6 === 0 ? 78 : i % 3 === 0 ? 66 : 58;
              return (
                <line
                  key={i}
                  x1={(110 + Math.cos(a) * inner).toFixed(2)}
                  y1={(110 + Math.sin(a) * inner).toFixed(2)}
                  x2={(110 + Math.cos(a) * outer).toFixed(2)}
                  y2={(110 + Math.sin(a) * outer).toFixed(2)}
                  strokeOpacity={i % 3 === 0 ? 0.65 : 0.35}
                />
              );
            })}
          </g>
          {/* Photosphere Core */}
          <circle cx="110" cy="110" r="46" fill={`url(#${p}-sun-core)`} />
          {/* High Energy Chromosphere Rim (last circle element for direct core hit-testing) */}
          <circle cx="110" cy="110" r="46" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.82" />
        </svg>
      );

    case "sirius":
      return (
        <svg className="bg-planet__art" viewBox="0 0 220 220" fill="none">
          <defs>
            <radialGradient id={`${p}-sirius-core`} cx="48%" cy="46%" r="55%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="28%" stopColor="#f0f9ff" />
              <stop offset="65%" stopColor="#bae6fd" />
              <stop offset="92%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </radialGradient>
            <radialGradient id={`${p}-sirius-glow`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.65" />
              <stop offset="35%" stopColor="#38bdf8" stopOpacity="0.28" />
              <stop offset="68%" stopColor="#2563eb" stopOpacity="0.09" />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* Sapphire Corona Halo */}
          <circle className="bg-sirius__glow" cx="110" cy="110" r="105" fill={`url(#${p}-sirius-glow)`} />

          {/* Binary Companion Orbit Track */}
          <ellipse
            cx="110"
            cy="110"
            rx="78"
            ry="38"
            transform="rotate(-24 110 110)"
            stroke="#bae6fd"
            strokeOpacity="0.24"
            strokeWidth="0.7"
            strokeDasharray="3 5"
          />

          {/* Razor-Sharp 8-Point Astrometric Diffraction Spikes */}
          <g className="bg-sirius__spikes" stroke="#e0f2fe" strokeLinecap="round">
            <line x1="110" y1="10" x2="110" y2="210" strokeWidth="1.3" strokeOpacity="0.78" />
            <line x1="10" y1="110" x2="210" y2="110" strokeWidth="1.3" strokeOpacity="0.78" />
            <line x1="48" y1="48" x2="172" y2="172" strokeWidth="0.8" strokeOpacity="0.48" />
            <line x1="172" y1="48" x2="48" y2="172" strokeWidth="0.8" strokeOpacity="0.48" />
          </g>

          {/* Sirius A Photosphere */}
          <circle cx="110" cy="110" r="34" fill={`url(#${p}-sirius-core)`} />
          <circle cx="110" cy="110" r="34" stroke="#ffffff" strokeWidth="1.4" strokeOpacity="0.9" />

          {/* Sirius B White Dwarf Companion */}
          <g className="bg-sirius__companion">
            <circle cx="176" cy="82" r="9" fill="#bae6fd" opacity="0.25" />
            <circle cx="176" cy="82" r="3.4" fill="#ffffff" />
          </g>
        </svg>
      );

    case "ringed":
      return (
        <svg className="bg-planet__art" viewBox="0 0 240 160" fill="none">
          <defs>
            <radialGradient id={`${p}-ringed-body`} cx="36%" cy="28%" r="76%">
              <stop offset="0%" stopColor="#fff8eb" />
              <stop offset="38%" stopColor="#cbb399" />
              <stop offset="74%" stopColor="#78614d" />
              <stop offset="100%" stopColor="#140e09" />
            </radialGradient>
            <linearGradient id={`${p}-ring-grad`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f4f4f2" stopOpacity="0" />
              <stop offset="22%" stopColor="#ecd2b0" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="78%" stopColor="#ecd2b0" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#f4f4f2" stopOpacity="0" />
            </linearGradient>
            <clipPath id={`${p}-ring-front`}>
              <rect x="0" y="80" width="240" height="80" />
            </clipPath>
            <clipPath id={`${p}-ringed-clip`}>
              <circle cx="120" cy="80" r="44" />
            </clipPath>
          </defs>
          {/* Rear Rings */}
          <g transform="rotate(-18 120 80)">
            <ellipse cx="120" cy="80" rx="112" ry="25" stroke={`url(#${p}-ring-grad)`} strokeWidth="1.1" opacity="0.45" />
            <ellipse cx="120" cy="80" rx="104" ry="23" stroke={`url(#${p}-ring-grad)`} strokeWidth="2.4" opacity="0.65" />
            <ellipse cx="120" cy="80" rx="90" ry="19.5" stroke={`url(#${p}-ring-grad)`} strokeWidth="1.2" opacity="0.4" />
            <ellipse cx="120" cy="80" rx="78" ry="16" stroke={`url(#${p}-ring-grad)`} strokeWidth="3.2" opacity="0.8" />
          </g>
          {/* Planet Sphere */}
          <circle cx="120" cy="80" r="44" fill={`url(#${p}-ringed-body)`} />
          {/* Atmospheric Banding & Ring Shadow */}
          <g clipPath={`url(#${p}-ringed-clip)`}>
            <g opacity="0.28">
              <ellipse cx="120" cy="65" rx="55" ry="5" fill="#fff1d6" />
              <ellipse cx="120" cy="79" rx="55" ry="3.5" fill="#1c140d" />
              <ellipse cx="120" cy="93" rx="55" ry="4" fill="#fff1d6" />
              <ellipse cx="120" cy="106" rx="55" ry="3" fill="#1c140d" />
            </g>
            <path d="M 74 90 Q 120 108 166 78" stroke="#090706" strokeWidth="6" opacity="0.35" />
          </g>
          {/* Foreground Rings Passing in Front */}
          <g transform="rotate(-18 120 80)" clipPath={`url(#${p}-ring-front)`}>
            <ellipse cx="120" cy="80" rx="112" ry="25" stroke={`url(#${p}-ring-grad)`} strokeWidth="1.2" opacity="0.6" />
            <ellipse cx="120" cy="80" rx="104" ry="23" stroke={`url(#${p}-ring-grad)`} strokeWidth="2.8" />
            <ellipse cx="120" cy="80" rx="90" ry="19.5" stroke={`url(#${p}-ring-grad)`} strokeWidth="1.4" opacity="0.85" />
            <ellipse cx="120" cy="80" rx="78" ry="16" stroke={`url(#${p}-ring-grad)`} strokeWidth="3.6" opacity="0.95" />
          </g>
        </svg>
      );

    case "moon":
      return (
        <svg className="bg-planet__art" viewBox="0 0 70 70" fill="none">
          <defs>
            <radialGradient id={`${p}-moon`} cx="66%" cy="28%" r="82%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="42%" stopColor="#c4c4c8" />
              <stop offset="78%" stopColor="#56565c" />
              <stop offset="100%" stopColor="#141416" />
            </radialGradient>
          </defs>
          <circle cx="35" cy="35" r="28" fill={`url(#${p}-moon)`} />
          {/* Crater topography & basaltic maria */}
          <g fill="#141416" opacity="0.38">
            <circle cx="28" cy="27" r="4.8" />
            <circle cx="42" cy="41" r="6.2" />
            <circle cx="43" cy="22" r="2.8" />
            <circle cx="23" cy="44" r="2.5" />
            <circle cx="37" cy="31" r="1.8" />
            <circle cx="20" cy="28" r="1.5" />
          </g>
          {/* Tycho ejecta ray contours */}
          <g stroke="#ffffff" strokeOpacity="0.22" strokeWidth="0.6">
            <line x1="42" y1="41" x2="54" y2="34" />
            <line x1="42" y1="41" x2="34" y2="56" />
            <line x1="42" y1="41" x2="52" y2="52" />
          </g>
          {/* Orbiting Telemetry Satellite */}
          <g className="bg-moon__satellite">
            <circle cx="35" cy="4" r="1.8" fill="#ffffff" />
            <circle cx="35" cy="4" r="4" stroke="#67e8f9" strokeWidth="0.6" opacity="0.78" />
            <line x1="35" y1="4" x2="35" y2="12" stroke="#67e8f9" strokeWidth="0.5" strokeDasharray="1 1" opacity="0.55" />
          </g>
        </svg>
      );

    case "giant":
      return (
        <svg className="bg-planet__art" viewBox="0 0 220 220" fill="none">
          <defs>
            <radialGradient id={`${p}-giant`} cx="64%" cy="32%" r="82%">
              <stop offset="0%" stopColor="#b5c6ff" />
              <stop offset="35%" stopColor="#4361ee" />
              <stop offset="72%" stopColor="#1e2985" />
              <stop offset="100%" stopColor="#05081c" />
            </radialGradient>
            <clipPath id={`${p}-giant-clip`}>
              <circle cx="110" cy="110" r="90" />
            </clipPath>
          </defs>
          {/* Magnetosphere Flux Arc */}
          <path d="M 30 58 Q 110 -8 190 58" stroke="#7d8cff" strokeOpacity="0.28" strokeWidth="1" strokeDasharray="4 4" fill="none" />
          <path d="M 30 162 Q 110 228 190 162" stroke="#7d8cff" strokeOpacity="0.22" strokeWidth="1" strokeDasharray="4 4" fill="none" />
          {/* Atmospheric Halo */}
          <circle cx="110" cy="110" r="96" stroke="#7d8cff" strokeOpacity="0.35" strokeWidth="4.5" />
          <circle cx="110" cy="110" r="90" fill={`url(#${p}-giant)`} />
          {/* Turbulent Storm Belts */}
          <g clipPath={`url(#${p}-giant-clip)`} opacity="0.34">
            <path d="M 10 82 C 70 72, 150 96, 210 84" stroke="#c9d0ff" strokeWidth="7" />
            <path d="M 10 100 C 65 92, 145 110, 210 100" stroke="#7d8cff" strokeWidth="3.2" />
            <path d="M 10 120 C 80 110, 140 134, 210 118" stroke="#ffffff" strokeWidth="4.5" />
            <path d="M 10 152 C 70 144, 150 162, 210 148" stroke="#c9d0ff" strokeWidth="6" />
            {/* Great Storm Vortex */}
            <ellipse cx="148" cy="132" rx="18" ry="9" fill="#2f45ff" stroke="#b5c6ff" strokeWidth="1.5" opacity="0.75" />
            <ellipse cx="148" cy="132" rx="9" ry="4" fill="#05081c" opacity="0.55" />
          </g>
        </svg>
      );

    case "nexus":
      return (
        <svg className="bg-planet__art" viewBox="0 0 220 220" fill="none">
          <defs>
            <radialGradient id={`${p}-nexus-core`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="30%" stopColor="#fff1d6" />
              <stop offset="65%" stopColor="#ffd700" />
              <stop offset="100%" stopColor="#ff8800" stopOpacity="0.3" />
            </radialGradient>
            <radialGradient id={`${p}-nexus-halo`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffd700" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#ffd700" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#ff001a" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* Sweeping Pulsar Beacon Beams */}
          <g className="bg-nexus__beams">
            <path d="M 110 110 L 10 40 L 40 10 Z" fill="#ffd700" opacity="0.16" />
            <path d="M 110 110 L 210 180 L 180 210 Z" fill="#ffd700" opacity="0.16" />
          </g>
          <circle cx="110" cy="110" r="105" fill={`url(#${p}-nexus-halo)`} />
          {/* Orbital Calipers & Resonators */}
          <g className="bg-nexus__ring">
            <circle cx="110" cy="110" r="68" stroke="#fff1d6" strokeWidth="1" strokeDasharray="8 5" opacity="0.7" />
            <circle cx="110" cy="110" r="88" stroke="#ffd700" strokeWidth="0.8" strokeDasharray="4 8" opacity="0.48" />
            <circle cx="110" cy="110" r="46" stroke="#ffffff" strokeWidth="0.6" strokeDasharray="2 4" opacity="0.45" />
          </g>
          {/* Diamond Starlight Diffraction Spikes */}
          <g className="bg-nexus__spikes" stroke="#ffffff" strokeOpacity="0.92" strokeWidth="1.4">
            <line x1="110" y1="18" x2="110" y2="202" />
            <line x1="18" y1="110" x2="202" y2="110" />
            <line x1="46" y1="46" x2="174" y2="174" strokeWidth="0.8" strokeOpacity="0.68" />
            <line x1="174" y1="46" x2="46" y2="174" strokeWidth="0.8" strokeOpacity="0.68" />
          </g>
          <circle cx="110" cy="110" r="32" fill={`url(#${p}-nexus-core)`} />
          <circle cx="110" cy="110" r="16" fill="#ffffff" />
        </svg>
      );

    case "ice":
      return (
        <svg className="bg-planet__art" viewBox="0 0 220 180" fill="none">
          <defs>
            <radialGradient id={`${p}-ice-core`} cx="38%" cy="30%" r="76%">
              <stop offset="0%" stopColor="#ecfeff" />
              <stop offset="38%" stopColor="#22d3ee" />
              <stop offset="78%" stopColor="#0891b2" />
              <stop offset="100%" stopColor="#082f49" />
            </radialGradient>
            <linearGradient id={`${p}-ice-ring`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#a5f3fc" stopOpacity="0" />
              <stop offset="50%" stopColor="#cffafe" stopOpacity="0.92" />
              <stop offset="100%" stopColor="#a5f3fc" stopOpacity="0" />
            </linearGradient>
            <clipPath id={`${p}-ice-front`}>
              <rect x="0" y="90" width="220" height="90" />
            </clipPath>
            <clipPath id={`${p}-ice-clip`}>
              <circle cx="110" cy="90" r="44" />
            </clipPath>
          </defs>
          {/* Rear Cryo Ring */}
          <g transform="rotate(24 110 90)">
            <ellipse cx="110" cy="90" rx="98" ry="18" stroke={`url(#${p}-ice-ring)`} strokeWidth="2" opacity="0.65" />
          </g>
          {/* Polar Auroral Crown */}
          <g className="bg-ice__aurora" opacity="0.85">
            <ellipse cx="104" cy="58" rx="38" ry="12" stroke="#67e8f9" strokeWidth="3" fill="none" opacity="0.5" />
            <ellipse cx="104" cy="58" rx="28" ry="8" stroke="#a5f3fc" strokeWidth="1.5" fill="none" opacity="0.82" />
          </g>
          <circle cx="110" cy="90" r="44" fill={`url(#${p}-ice-core)`} />
          {/* Crystalline Glacier Ridges */}
          <g clipPath={`url(#${p}-ice-clip)`} stroke="#ecfeff" strokeWidth="0.9" opacity="0.32">
            <path d="M 74 72 L 98 84 L 122 68 L 146 86" />
            <path d="M 70 104 L 104 94 L 130 112 L 152 96" />
          </g>
          {/* Front Cryo Ring */}
          <g transform="rotate(24 110 90)" clipPath={`url(#${p}-ice-front)`}>
            <ellipse cx="110" cy="90" rx="98" ry="18" stroke={`url(#${p}-ice-ring)`} strokeWidth="2.5" opacity="0.95" />
            <ellipse cx="110" cy="90" rx="82" ry="14" stroke="#a5f3fc" strokeWidth="1.2" opacity="0.75" />
          </g>
        </svg>
      );

    case "dyson":
      return (
        <svg className="bg-planet__art" viewBox="0 0 240 240" fill="none">
          <defs>
            <radialGradient id={`${p}-dyson-glow`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff7ed" stopOpacity="0.58" />
              <stop offset="32%" stopColor="#67e8f9" stopOpacity="0.26" />
              <stop offset="68%" stopColor="#0891b2" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#082f49" stopOpacity="0" />
            </radialGradient>
            <radialGradient id={`${p}-dyson-core`} cx="46%" cy="44%" r="55%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="38%" stopColor="#e0f2fe" />
              <stop offset="76%" stopColor="#ffd285" />
              <stop offset="100%" stopColor="#06b6d4" />
            </radialGradient>
            <linearGradient id={`${p}-dyson-ring-a`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.88" />
              <stop offset="50%" stopColor="#fff1d6" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.65" />
            </linearGradient>
            <linearGradient id={`${p}-dyson-ring-b`} x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffd285" stopOpacity="0.82" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.55" />
            </linearGradient>
          </defs>

          {/* Ambient Photonic Harvest Halo */}
          <circle cx="120" cy="120" r="112" fill={`url(#${p}-dyson-glow)`} />

          {/* Outer Geodesic Collector Ring */}
          <g className="bg-dyson__ring-outer">
            <circle
              cx="120"
              cy="120"
              r="98"
              stroke={`url(#${p}-dyson-ring-a)`}
              strokeWidth="1.2"
              strokeDasharray="14 6 3 6"
              opacity="0.72"
            />
            <ellipse
              cx="120"
              cy="120"
              rx="106"
              ry="42"
              transform="rotate(-28 120 120)"
              stroke={`url(#${p}-dyson-ring-b)`}
              strokeWidth="2.2"
              strokeDasharray="18 7 6 7"
              opacity="0.82"
            />
            <circle cx="28" cy="120" r="2.6" fill="#fff1d6" />
            <circle cx="212" cy="120" r="2.6" fill="#67e8f9" />
            <circle cx="120" cy="22" r="2.2" fill="#ffffff" />
            <circle cx="120" cy="218" r="2.2" fill="#ffd285" />
          </g>

          {/* Middle Inclined Collector Swarm */}
          <g className="bg-dyson__ring-mid">
            <ellipse
              cx="120"
              cy="120"
              rx="86"
              ry="34"
              transform="rotate(34 120 120)"
              stroke={`url(#${p}-dyson-ring-a)`}
              strokeWidth="1.8"
              strokeDasharray="10 5"
              opacity="0.78"
            />
            <circle
              cx="120"
              cy="120"
              r="70"
              stroke="#ffd285"
              strokeOpacity="0.34"
              strokeWidth="0.9"
              strokeDasharray="2 6"
            />
          </g>

          {/* Inner Counter-Rotating Harvester Cage */}
          <g className="bg-dyson__ring-inner">
            <ellipse
              cx="120"
              cy="120"
              rx="58"
              ry="24"
              transform="rotate(14 120 120)"
              stroke="#ffffff"
              strokeOpacity="0.8"
              strokeWidth="1.4"
              strokeDasharray="12 4"
            />
            <ellipse
              cx="120"
              cy="120"
              rx="54"
              ry="22"
              transform="rotate(-76 120 120)"
              stroke="#67e8f9"
              strokeOpacity="0.68"
              strokeWidth="1.1"
              strokeDasharray="8 5"
            />
          </g>

          {/* Axial Energy Transfer Conduits */}
          <g stroke="#fff1d6" strokeOpacity="0.38" strokeWidth="0.9" strokeDasharray="3 4">
            <line x1="120" y1="26" x2="120" y2="94" />
            <line x1="120" y1="146" x2="120" y2="214" />
            <line x1="26" y1="120" x2="94" y2="120" />
            <line x1="146" y1="120" x2="214" y2="120" />
          </g>

          {/* Captured High-Energy Star Core */}
          <circle cx="120" cy="120" r="24" fill={`url(#${p}-dyson-core)`} />
          <circle cx="120" cy="120" r="24" stroke="#ffffff" strokeWidth="1.4" strokeOpacity="0.92" />
          <circle cx="120" cy="120" r="10" fill="#ffffff" opacity="0.95" />
        </svg>
      );

    case "terran":
      return (
        <svg className="bg-planet__art" viewBox="0 0 220 220" fill="none">
          <defs>
            <radialGradient id={`${p}-terran-core`} cx="36%" cy="32%" r="78%">
              <stop offset="0%" stopColor="#ffedd5" />
              <stop offset="38%" stopColor="#f97316" />
              <stop offset="78%" stopColor="#9a3412" />
              <stop offset="100%" stopColor="#431407" />
            </radialGradient>
            <clipPath id={`${p}-terran-clip`}>
              <circle cx="110" cy="110" r="54" />
            </clipPath>
          </defs>
          {/* Atmospheric Ozone Glow */}
          <circle cx="110" cy="110" r="58" stroke="#38bdf8" strokeOpacity="0.4" strokeWidth="3.5" />
          <circle cx="110" cy="110" r="54" fill={`url(#${p}-terran-core)`} />
          {/* Swirling Continental Cloud Formations & Night-Side Founder Lights */}
          <g clipPath={`url(#${p}-terran-clip)`}>
            <g opacity="0.42" stroke="#ffffff" strokeWidth="3.5" fill="none" strokeLinecap="round">
              <path d="M 74 92 Q 95 72 126 80 T 154 105" />
              <path d="M 66 122 Q 98 138 138 128" />
              <path d="M 94 146 Q 116 158 142 150" strokeWidth="2.4" />
            </g>
            <g fill="#fff1d6" opacity="0.72">
              <circle cx="136" cy="124" r="1.2" />
              <circle cx="141" cy="128" r="0.9" />
              <circle cx="132" cy="132" r="1" />
              <circle cx="122" cy="140" r="1.1" />
            </g>
          </g>
        </svg>
      );

    case "cluster":
      return (
        <svg className="bg-planet__art" viewBox="0 0 240 220" fill="none">
          <defs>
            <radialGradient id={`${p}-nebula-core`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0.45" />
              <stop offset="45%" stopColor="#38bdf8" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* Interstellar Nebular Haze */}
          <circle cx="120" cy="110" r="95" fill={`url(#${p}-nebula-core)`} />
          {/* Filament Web Binding Stars */}
          <g stroke="rgba(244, 244, 242, 0.38)" strokeWidth="0.8" strokeDasharray="3 3">
            <line x1="60" y1="80" x2="110" y2="60" />
            <line x1="110" y1="60" x2="165" y2="75" />
            <line x1="165" y1="75" x2="185" y2="125" />
            <line x1="185" y1="125" x2="135" y2="155" />
            <line x1="135" y1="155" x2="80" y2="140" />
            <line x1="80" y1="140" x2="60" y2="80" />
            <line x1="110" y1="60" x2="125" y2="105" />
            <line x1="125" y1="105" x2="135" y2="155" />
            <line x1="60" y1="80" x2="125" y2="105" />
          </g>
          {/* Star Nodes in Pleiades Geometry */}
          {[
            { cx: 60, cy: 80, r: 3.5, color: "#ffffff" },
            { cx: 110, cy: 60, r: 4.5, color: "#93c5fd" },
            { cx: 165, cy: 75, r: 3.8, color: "#ffffff" },
            { cx: 185, cy: 125, r: 4, color: "#a5b4fc" },
            { cx: 135, cy: 155, r: 3.2, color: "#ffffff" },
            { cx: 80, cy: 140, r: 3.5, color: "#93c5fd" },
            { cx: 125, cy: 105, r: 6, color: "#ffffff" },
          ].map((star, i) => (
            <g key={i} className="bg-cluster__star">
              <circle cx={star.cx} cy={star.cy} r={star.r * 2.2} fill={star.color} opacity="0.25" />
              <line
                x1={star.cx - star.r * 2}
                y1={star.cy}
                x2={star.cx + star.r * 2}
                y2={star.cy}
                stroke={star.color}
                strokeWidth="0.6"
                opacity="0.7"
              />
              <line
                x1={star.cx}
                y1={star.cy - star.r * 2}
                x2={star.cx}
                y2={star.cy + star.r * 2}
                stroke={star.color}
                strokeWidth="0.6"
                opacity="0.7"
              />
              <circle cx={star.cx} cy={star.cy} r={star.r} fill={star.color} />
            </g>
          ))}
        </svg>
      );

    case "blackhole":
      return (
        <svg className="bg-planet__art" viewBox="0 0 340 220" fill="none">
          <defs>
            <radialGradient id={`${p}-bh-glow`} cx="50%" cy="55%" r="50%">
              <stop offset="0%" stopColor="#fff1d6" stopOpacity="0.34" />
              <stop offset="45%" stopColor="#fff1d6" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#fff1d6" stopOpacity="0" />
            </radialGradient>
            <linearGradient id={`${p}-bh-disk`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ecd2b0" stopOpacity="0" />
              <stop offset="20%" stopColor="#ecd2b0" stopOpacity="0.62" />
              <stop offset="48%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="78%" stopColor="#ecd2b0" stopOpacity="0.62" />
              <stop offset="100%" stopColor="#ecd2b0" stopOpacity="0" />
            </linearGradient>
            <clipPath id={`${p}-bh-back`}>
              <rect x="0" y="0" width="340" height="120" />
            </clipPath>
            <clipPath id={`${p}-bh-front`}>
              <rect x="0" y="120" width="340" height="100" />
            </clipPath>
          </defs>
          <g transform="rotate(-18 170 120)">
            {/* Lensing Glow */}
            <ellipse cx="170" cy="120" rx="165" ry="100" fill={`url(#${p}-bh-glow)`} />
            {/* Rear Accretion Swirl */}
            <ellipse
              className="bg-bh__disk"
              cx="170"
              cy="120"
              rx="142"
              ry="25"
              stroke={`url(#${p}-bh-disk)`}
              strokeWidth="8"
              opacity="0.65"
              clipPath={`url(#${p}-bh-back)`}
            />
            {/* Gravitational Photon Sphere */}
            <circle cx="170" cy="120" r="64" stroke={`url(#${p}-bh-disk)`} strokeWidth="3.5" opacity="0.78" clipPath={`url(#${p}-bh-back)`} />
            {/* Relativistic Lensing Ticks */}
            <circle cx="170" cy="120" r="72" stroke="#fff1d6" strokeOpacity="0.22" strokeWidth="0.7" strokeDasharray="3 11" />
            {/* Absolute Event Horizon Void */}
            <circle cx="170" cy="120" r="52" fill="#000000" stroke="#fff1d6" strokeOpacity="0.85" strokeWidth="1.5" />
            {/* Front Accretion Swirl (Relativistic Doppler Beaming) */}
            <ellipse
              className="bg-bh__disk"
              cx="170"
              cy="120"
              rx="142"
              ry="25"
              stroke={`url(#${p}-bh-disk)`}
              strokeWidth="11"
              clipPath={`url(#${p}-bh-front)`}
            />
            <ellipse cx="170" cy="120" rx="112" ry="18" stroke="#ffffff" strokeOpacity="0.52" strokeWidth="1.5" clipPath={`url(#${p}-bh-front)`} />
          </g>
        </svg>
      );

    case "m87":
      return (
        <svg className="bg-planet__art" viewBox="0 0 340 240" fill="none">
          <defs>
            <radialGradient id={`${p}-m87-glow`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fb923c" stopOpacity="0.34" />
              <stop offset="42%" stopColor="#dc2626" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0" />
            </radialGradient>
            <linearGradient id={`${p}-m87-ring`} x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#ea580c" stopOpacity="0.55" />
              <stop offset="45%" stopColor="#fb923c" stopOpacity="0.95" />
              <stop offset="85%" stopColor="#fff7ed" stopOpacity="1" />
              <stop offset="100%" stopColor="#fdba74" stopOpacity="0.75" />
            </linearGradient>
            <linearGradient id={`${p}-m87-jet`} x1="0.5" y1="1" x2="0.5" y2="0">
              <stop offset="0%" stopColor="#fff7ed" stopOpacity="0.85" />
              <stop offset="35%" stopColor="#60a5fa" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
            <clipPath id={`${p}-m87-back`}>
              <rect x="0" y="0" width="340" height="120" />
            </clipPath>
            <clipPath id={`${p}-m87-front`}>
              <rect x="0" y="120" width="340" height="120" />
            </clipPath>
          </defs>
          <g transform="rotate(24 170 120)">
            {/* Relativistic Polar Plasma Jet */}
            <g className="bg-m87__jet">
              <polygon points="170,120 156,10 184,10" fill={`url(#${p}-m87-jet)`} opacity="0.65" />
              <line x1="170" y1="120" x2="170" y2="12" stroke="#e0f2fe" strokeWidth="1.2" strokeDasharray="6 5" opacity="0.7" />
              <polygon points="170,120 162,215 178,215" fill={`url(#${p}-m87-jet)`} opacity="0.32" />
            </g>

            {/* Crimson-Amber Lensing Aura */}
            <ellipse cx="170" cy="120" rx="160" ry="105" fill={`url(#${p}-m87-glow)`} />

            {/* Rear Accretion Torus */}
            <ellipse
              className="bg-m87__disk"
              cx="170"
              cy="120"
              rx="136"
              ry="26"
              stroke={`url(#${p}-m87-ring)`}
              strokeWidth="7.5"
              opacity="0.6"
              clipPath={`url(#${p}-m87-back)`}
            />

            {/* Asymmetric EHT-Inspired Photon Ring */}
            <circle cx="170" cy="120" r="62" stroke={`url(#${p}-m87-ring)`} strokeWidth="6" opacity="0.88" />
            <circle cx="170" cy="120" r="70" stroke="#fb923c" strokeOpacity="0.28" strokeWidth="0.8" strokeDasharray="4 9" />

            {/* Event Horizon Shadow */}
            <circle cx="170" cy="120" r="48" fill="#000000" stroke="#fdba74" strokeOpacity="0.72" strokeWidth="1.4" />

            {/* Front Relativistic Doppler-Beamed Disk */}
            <ellipse
              className="bg-m87__disk"
              cx="170"
              cy="120"
              rx="136"
              ry="26"
              stroke={`url(#${p}-m87-ring)`}
              strokeWidth="10.5"
              clipPath={`url(#${p}-m87-front)`}
            />
          </g>
        </svg>
      );
  }
}
