"use client";
import React from "react";
import CosmicSectionBackdrop from "@/src/components/Cosmic/CosmicSectionBackdrop";

/**
 * Sponsors Section Celestial Backdrop:
 * Houses the Golden Stellar Nexus anchoring the partner constellation network,
 * with surrounding backdrop stars and geometric constellation figures.
 */
export default function StarField(): React.ReactElement {
  return (
    <CosmicSectionBackdrop
      planet="nexus"
      planetPlacement={{
        top: "8%",
        left: "18%",
        width: "clamp(85px, 8vw, 130px)",
      }}
      starsCount={36}
      seed={20260611}
      constellation="navigator"
      constellationPlacement={{
        top: "45%",
        left: "1%",
        width: "clamp(80px, 8vw, 120px)",
      }}
      sectionId="sponsors"
    />
  );
}
