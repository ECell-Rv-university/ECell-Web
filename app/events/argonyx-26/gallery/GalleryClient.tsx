"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import type Lenis from "lenis";
import "./Gallery.css";
import GalleryFilters from "./_components/GalleryFilters";
import GalleryFinale from "./_components/GalleryFinale";
import GalleryHero from "./_components/GalleryHero";
import GalleryLightbox from "./_components/GalleryLightbox";
import GalleryTimeline from "./_components/GalleryTimeline";
import {
  ecellTeam1,
  ecellTeam2,
  GALLERY_SECTIONS,
  teamArgonyx,
} from "./_data/galleryData";
import { useGalleryFinaleAnimation } from "./_hooks/useGalleryFinaleAnimation";
import { useGalleryNavigation } from "./_hooks/useGalleryNavigation";

export default function GalleryClient() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxSection, setLightboxSection] = useState<string | null>(null);
  const topbarRef = useRef<HTMLElement | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const finaleStageRef = useRef<HTMLDivElement | null>(null);
  const finalePinRef = useRef<HTMLDivElement | null>(null);
  const loveLayerRef = useRef<HTMLDivElement | null>(null);
  const teamLayerRef = useRef<HTMLDivElement | null>(null);
  const teamImgWrapRef = useRef<HTMLDivElement | null>(null);
  const teamOverlayRef = useRef<HTMLDivElement | null>(null);

  const { activeFilter, registerSection, selectFilter } = useGalleryNavigation({
    lenisRef,
    finaleStageRef,
  });
  const filteredSections = activeFilter === "all" || activeFilter === "team-photo"
    ? GALLERY_SECTIONS
    : GALLERY_SECTIONS.filter((section) => section.id === activeFilter);
  const currentSection = GALLERY_SECTIONS.find((section) => section.id === lightboxSection);
  const currentPhotos = lightboxSection === "team-photo"
    ? [{ src: teamArgonyx, alt: "Team Argonyx '26 — Organised by ECell, IEEE and VIKSHA Coding Club · RV University" }]
    : lightboxSection === "ecell-team"
      ? [
          { src: ecellTeam1, alt: "ECell RVU Core Team — Argonyx '26 Organizers" },
          { src: ecellTeam2, alt: "ECell RVU Team — Argonyx '26" },
        ]
      : currentSection?.photos ?? [];

  const openLightbox = useCallback((sectionId: string, index: number) => {
    setLightboxSection(sectionId);
    setLightboxIndex(index);
  }, []);
  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    setLightboxSection(null);
  }, []);
  const showPreviousPhoto = useCallback(() => {
    if (lightboxIndex === null || currentPhotos.length === 0) return;
    setLightboxIndex((lightboxIndex - 1 + currentPhotos.length) % currentPhotos.length);
  }, [currentPhotos.length, lightboxIndex]);
  const showNextPhoto = useCallback(() => {
    if (lightboxIndex === null || currentPhotos.length === 0) return;
    setLightboxIndex((lightboxIndex + 1) % currentPhotos.length);
  }, [currentPhotos.length, lightboxIndex]);

  useGalleryFinaleAnimation({
    topbarRef,
    lenisRef,
    finaleStageRef,
    finalePinRef,
    loveLayerRef,
    teamLayerRef,
    teamImgWrapRef,
    teamOverlayRef,
  });

  return (
    <div className="gallery-page">
      <header className="gallery-topbar" ref={topbarRef}>
        <div className="gallery-topbar__inner">
          <Link className="gallery-topbar__back" href="/events/argonyx-26">
            <span className="arrow">←</span> ARGONYX &apos;26
          </Link>
        </div>
      </header>
      <GalleryHero onPhotoOpen={openLightbox} />
      <GalleryFilters activeFilter={activeFilter} onSelect={selectFilter} />
      <GalleryTimeline activeFilter={activeFilter} sections={filteredSections} registerSection={registerSection} onPhotoOpen={openLightbox} />
      <GalleryFinale finaleStageRef={finaleStageRef} finalePinRef={finalePinRef} loveLayerRef={loveLayerRef} teamLayerRef={teamLayerRef} teamImgWrapRef={teamImgWrapRef} teamOverlayRef={teamOverlayRef} onPhotoOpen={() => openLightbox("team-photo", 0)} />
      {lightboxIndex !== null && currentPhotos[lightboxIndex] && (
        <GalleryLightbox photo={currentPhotos[lightboxIndex]} onClose={closeLightbox} onPrev={showPreviousPhoto} onNext={showNextPhoto} currentIndex={lightboxIndex} totalCount={currentPhotos.length} />
      )}
    </div>
  );
}
