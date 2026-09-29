"use client";

import Image from "next/image";
import type { RefObject } from "react";
import { teamArgonyx } from "../_data/galleryData";

interface GalleryFinaleProps {
  finaleStageRef: RefObject<HTMLDivElement | null>;
  finalePinRef: RefObject<HTMLDivElement | null>;
  loveLayerRef: RefObject<HTMLDivElement | null>;
  teamLayerRef: RefObject<HTMLDivElement | null>;
  teamImgWrapRef: RefObject<HTMLDivElement | null>;
  teamOverlayRef: RefObject<HTMLDivElement | null>;
  onPhotoOpen: () => void;
}

export default function GalleryFinale({ finaleStageRef, finalePinRef, loveLayerRef, teamLayerRef, teamImgWrapRef, teamOverlayRef, onPhotoOpen }: GalleryFinaleProps) {
  return (
    <section id="team-photo" className="gallery-finale-stage" ref={finaleStageRef} aria-label="Argonyx '26 Team Finale">
      <div className="gallery-finale-pin" ref={finalePinRef}>
        <div className="gallery-love-layer" ref={loveLayerRef}><div className="gallery-love-transition__inner"><div className="gallery-love-transition__sparkle" aria-hidden="true">✦</div><p className="gallery-love-transition__text">with love,</p><h2 className="gallery-love-transition__team">Argonyx Team</h2><div className="gallery-love-transition__line" /><p className="gallery-love-transition__sub">Built by builders, for builders. RV University · 2026</p><div className="gallery-love-transition__scroll-indicator"><span className="gallery-love-transition__scroll-text">Scroll to reveal</span><span className="gallery-love-transition__scroll-arrow">↓</span></div></div></div>
        <div className="gallery-team-layer" ref={teamLayerRef}>
          <div className="gallery-team-photo__img-wrap" ref={teamImgWrapRef} onClick={onPhotoOpen} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onPhotoOpen(); } }} aria-label="View Team Argonyx photo full screen">
            <Image src={teamArgonyx} alt="Team Argonyx '26 — The team behind RV University's national hackathon" fill sizes="100vw" style={{ objectFit: "cover" }} quality={85} />
            <div className="gallery-team-photo__overlay" ref={teamOverlayRef}><div className="gallery-team-photo__caption-wrap"><h2 className="gallery-team-photo__title">TEAM ARGONYX</h2><p className="gallery-team-photo__sub">Organised by ECell, IEEE and VIKSHA Coding Club</p></div></div>
          </div>
        </div>
      </div>
    </section>
  );
}
