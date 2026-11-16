"use client";
import React from "react";
import CosmicSectionBackdrop from "@/src/components/Cosmic/CosmicSectionBackdrop";

/**
 * Sponsors Section Celestial Backdrop:
 * Houses a clean, corner-balanced celestial ensemble (Sun, Cryo Exoplanet,
 * and Black Hole) with light-travel physics and interactive devouring behind
 * the partner constellation network.
 */
export default function StarField(): React.ReactElement {
  return (
    <CosmicSectionBackdrop
      planet="sun"
      planetPlacement={{
        top: "7%",
        left: "16%",
        width: "clamp(90px, 8vw, 136px)",
      }}
      secondaryPlanets={[
        {
          type: "ice",
          placement: {
            top: "10%",
            right: "7%",
            width: "clamp(95px, 8.5vw, 140px)",
          },
        },
        {
          type: "blackhole",
          placement: {
            bottom: "6%",
            right: "calc(var(--bh-w, 240px) * -0.32)",
            width: "clamp(220px, 20vw, 320px)",
          },
        },
      ]}
      starsCount={32}
      shootingStarsCount={2}
      nebula="cyan"
      sectorLabel="SEC-05 KRYOS CAPITAL"
      seed={20260611}
      constellation="navigator"
      constellationPlacement={{
        top: "45%",
        left: "1%",
        width: "clamp(80px, 8vw, 120px)",
      }}
      sectionId="sponsors"
      scrollParallax={false}
    />
  );
}
