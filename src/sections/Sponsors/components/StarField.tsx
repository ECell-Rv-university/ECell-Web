"use client";
import React from "react";
import CosmicSectionBackdrop from "@/src/components/Cosmic/CosmicSectionBackdrop";

/**
 * Sponsors Section Celestial Backdrop:
 * Houses the Helios solar ensemble (Sun, Cryo Exoplanet, Ringed Planet, Moon,
 * and Black Hole) with light-travel physics and interactive devouring behind
 * the partner constellation network.
 */
export default function StarField(): React.ReactElement {
  return (
    <CosmicSectionBackdrop
      planet="sun"
      planetPlacement={{
        top: "7%",
        left: "18%",
        width: "clamp(90px, 8vw, 136px)",
      }}
      secondaryPlanets={[
        {
          type: "ice",
          placement: {
            top: "10%",
            right: "8%",
            width: "clamp(95px, 8.5vw, 140px)",
          },
        },
        {
          type: "ringed",
          placement: {
            top: "30%",
            right: "5%",
            width: "clamp(105px, 9.5vw, 155px)",
          },
        },
        {
          type: "moon",
          placement: {
            top: "26%",
            left: "9%",
            width: "clamp(38px, 3.4vw, 52px)",
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
