"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import "./Gallery.css";
import type Lenis from "lenis";
import DepthCarousel, { type DepthCarouselItem } from "./DepthCarousel";
import GalleryLightbox from "./_components/GalleryLightbox";
import { useGalleryFinaleAnimation } from "./_hooks/useGalleryFinaleAnimation";
import {
  ecellTeam1,
  ecellTeam2,
  GALLERY_SECTIONS,
  heroAudiencePhoto,
  heroHackingPhoto,
  heroStagePhoto,
  heroWelcomePhoto,
  teamArgonyx,
} from "./_data/galleryData";

/* ────────────────────────────── MAIN COMPONENT ────────────────────────────── */

export default function GalleryClient() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxSection, setLightboxSection] = useState<string | null>(null);

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const topbarRef = useRef<HTMLElement | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const finaleStageRef = useRef<HTMLDivElement | null>(null);
  const finalePinRef = useRef<HTMLDivElement | null>(null);
  const loveLayerRef = useRef<HTMLDivElement | null>(null);
  const teamLayerRef = useRef<HTMLDivElement | null>(null);
  const teamImgWrapRef = useRef<HTMLDivElement | null>(null);
  const teamOverlayRef = useRef<HTMLDivElement | null>(null);

  const filteredSections =
    activeFilter === "all"
      ? GALLERY_SECTIONS
      : GALLERY_SECTIONS.filter((s) => s.id === activeFilter);

  const openLightbox = useCallback((sectionId: string, idx: number) => {
    setLightboxSection(sectionId);
    setLightboxIndex(idx);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    setLightboxSection(null);
  }, []);

  const currentSection = GALLERY_SECTIONS.find((s) => s.id === lightboxSection);
  const currentPhotos =
    lightboxSection === "team-photo"
      ? [
          {
            src: teamArgonyx,
            alt: "Team Argonyx '26 — Organised by ECell, IEEE and VIKSHA Coding Club · RV University",
          },
        ]
      : lightboxSection === "ecell-team"
      ? [
          {
            src: ecellTeam1,
            alt: "ECell RVU Core Team — Argonyx '26 Organizers",
          },
          {
            src: ecellTeam2,
            alt: "ECell RVU Team — Argonyx '26",
          },
        ]
      : currentSection?.photos || [];

  const goLightboxPrev = useCallback(() => {
    if (lightboxIndex === null || currentPhotos.length === 0) return;
    setLightboxIndex((lightboxIndex - 1 + currentPhotos.length) % currentPhotos.length);
  }, [lightboxIndex, currentPhotos.length]);

  const goLightboxNext = useCallback(() => {
    if (lightboxIndex === null || currentPhotos.length === 0) return;
    setLightboxIndex((lightboxIndex + 1) % currentPhotos.length);
  }, [lightboxIndex, currentPhotos.length]);

  const scrollToSection = (sectionId: string) => {
    setActiveFilter(sectionId);
    if (sectionId === "team-photo") {
      if (finaleStageRef.current) {
        const stageTop =
          finaleStageRef.current.getBoundingClientRect().top + window.scrollY;
        const targetTop = stageTop + window.innerHeight * 2.1;
        if (lenisRef.current) {
          lenisRef.current.scrollTo(targetTop, { duration: 1.6 });
        } else {
          window.scrollTo({ top: targetTop, behavior: "smooth" });
        }
      }
      return;
    }

    if (sectionId === "ecell-team") {
      const el = sectionRefs.current["ecell-team"];
      if (el) {
        const targetTop = el.getBoundingClientRect().top + window.scrollY - 80;
        if (lenisRef.current) {
          lenisRef.current.scrollTo(targetTop, { duration: 1.2 });
        } else {
          window.scrollTo({ top: targetTop, behavior: "smooth" });
        }
      }
      return;
    }

    const el = sectionRefs.current[sectionId];
    if (el) {
      const targetTop = el.getBoundingClientRect().top + window.scrollY - 80;
      if (lenisRef.current) {
        lenisRef.current.scrollTo(targetTop, { duration: 1.2 });
      } else {
        window.scrollTo({ top: targetTop, behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    const html = document.documentElement;
    const orig = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    const t = setTimeout(() => {
      html.style.scrollBehavior = orig;
    }, 100);
    return () => clearTimeout(t);
  }, []);

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
      {/* ── TOP BAR ── */}
      <header className="gallery-topbar" ref={topbarRef}>
        <div className="gallery-topbar__inner">
          <Link className="gallery-topbar__back" href="/events/argonyx-26">
            <span className="arrow">←</span> ARGONYX &apos;26
          </Link>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="gallery-hero">
        <div className="gallery-hero__inner">
          <div className="gallery-hero__content">
            <p className="gallery-eyebrow">
              <span className="gallery-eyebrow__rule" />
              Photo Gallery · Argonyx &apos;26
            </p>
            <h1 className="gallery-hero__headline">
              Moments from
              <span className="gallery-hero__accent"> the floor.</span>
            </h1>
            <p className="gallery-hero__body">
              Highlights from the 24-hour national hackathon sprint at RV University — from opening
              arrival and keynote ceremonies to midnight coding, mentor reviews, live pitch defenses,
              and the podium finale.
            </p>
          </div>

          {/* ── HERO SHOWCASE COLLAGE (Photos from Argonyx folder only) ── */}
          <div className="gallery-hero__showcase" aria-label="Argonyx '26 photo collage">
            {/* Center / Main stage photo */}
            <div
              className="gallery-showcase__card gallery-showcase__card--main"
              onClick={() => openLightbox("opening", 2)}
              role="button"
              tabIndex={0}
              style={{ cursor: "zoom-in" }}
              aria-label="View photo full screen"
            >
              <Image
                src={heroStagePhoto}
                alt="Argonyx '26 Keynote Auditorium Stage"
                fill
                sizes="(max-width: 860px) 80vw, (max-width: 1200px) 44vw, 38vw"
                style={{ objectFit: "cover" }}
                preload
              />
              <div className="gallery-showcase__main-gradient" />
            </div>

            {/* Left tilted photo with 'IDEAS PEOPLE PROGRESS' accent */}
            <div className="gallery-showcase__left-wrap">
              <div className="gallery-showcase__tag gallery-showcase__tag--left">
                <span>IDEAS</span>
                <span>PEOPLE</span>
                <span>PROGRESS</span>
              </div>
              <div
                className="gallery-showcase__card gallery-showcase__card--left"
                onClick={() => openLightbox("opening", 3)}
                role="button"
                tabIndex={0}
                style={{ cursor: "zoom-in" }}
                aria-label="View photo full screen"
              >
                <Image
                  src={heroWelcomePhoto}
                  alt="Argonyx '26 Welcome Banner and Registration"
                  fill
                  sizes="(max-width: 1024px) 35vw, 18vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>

            {/* Top-right tilted photo */}
            <div
              className="gallery-showcase__card gallery-showcase__card--top-right"
              onClick={() => openLightbox("coding-sessions", 0)}
              role="button"
              tabIndex={0}
              style={{ cursor: "zoom-in" }}
              aria-label="View photo full screen"
            >
              <Image
                src={heroHackingPhoto}
                alt="Hackers sprinting at laptops"
                fill
                sizes="(max-width: 1024px) 35vw, 18vw"
                style={{ objectFit: "cover" }}
              />
            </div>

            {/* Bottom-right photo with 'MORE THAN A HACKATHON' accent */}
            <div className="gallery-showcase__right-wrap">
              <div className="gallery-showcase__tag gallery-showcase__tag--right">
                <span>MORE</span>
                <span>THAN A</span>
                <span className="gallery-showcase__tag-accent">HACKATHON</span>
                <svg
                  className="gallery-showcase__brush"
                  viewBox="0 0 140 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M3 10C40 3 95 4 137 8"
                    stroke="#f59e0b"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div
                className="gallery-showcase__card gallery-showcase__card--bottom-right"
                onClick={() => openLightbox("round2-walk", 1)}
                role="button"
                tabIndex={0}
                style={{ cursor: "zoom-in" }}
                aria-label="View photo full screen"
              >
                <Image
                  src={heroAudiencePhoto}
                  alt="Hackathon audience and demo showcase"
                  fill
                  sizes="(max-width: 1024px) 35vw, 18vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FILTER TABS ── */}
      <nav className="gallery-filters" aria-label="Gallery Categories">
        <div className="gallery-filters__inner">
          <button
            type="button"
            className={`gallery-filter-btn ${activeFilter === "all" ? "is-active" : ""}`}
            onClick={() => setActiveFilter("all")}
          >
            All
          </button>
          <button
            type="button"
            className={`gallery-filter-btn ${activeFilter === "ecell-team" ? "is-active" : ""}`}
            onClick={() => scrollToSection("ecell-team")}
          >
            ECell Team
          </button>
          {GALLERY_SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`gallery-filter-btn ${activeFilter === s.id ? "is-active" : ""}`}
              onClick={() => scrollToSection(s.id)}
            >
              {s.title}
            </button>
          ))}
          <button
            type="button"
            className={`gallery-filter-btn ${activeFilter === "team-photo" ? "is-active" : ""}`}
            onClick={() => scrollToSection("team-photo")}
          >
            Team Photo
          </button>
        </div>
      </nav>

      {/* ── CHRONOLOGICAL SECTIONS ── */}
      <main className="gallery-main">
        {/* ── E-CELL TEAM SPOTLIGHT (BEFORE DAY 1 ARRIVAL) ── */}
        {(activeFilter === "all" || activeFilter === "ecell-team") && (
          <section
            id="gallery-ecell-team"
            className="gallery-ecell-section"
            ref={(el) => {
              sectionRefs.current["ecell-team"] = el;
            }}
          >
            <div className="gallery-ecell-header">
              <div className="gallery-ecell-header__left">
                <p className="gallery-eyebrow">
                  <span className="gallery-eyebrow__rule" />
                  THE ARCHITECTS &amp; ORGANIZERS · E-CELL RVU
                </p>
                <div className="gallery-ecell-title-row">
                  <h2 className="gallery-ecell-title">
                    ECell Team
                    <span className="gallery-ecell-title__accent">
                      Behind Argonyx &apos;26
                    </span>
                  </h2>
                </div>
                <p className="gallery-ecell-desc">
                  The visionary student leaders, organizers, and creators from RV University&apos;s
                  Entrepreneurship Cell who conceptualized, planned, and brought Argonyx &apos;26
                  to life.
                </p>
              </div>
            </div>

            <div className="gallery-ecell-grid">
              {/* Card 1: Core Leadership */}
              <div
                className="gallery-ecell-card"
                onClick={() => openLightbox("ecell-team", 0)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openLightbox("ecell-team", 0);
                  }
                }}
                aria-label="View ECell Team photo 1 full screen"
              >
                <div className="gallery-ecell-card__image-wrap">
                  <Image
                    src={ecellTeam1}
                    alt="ECell RVU Core Team — Argonyx '26 Organizers"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="gallery-ecell-card__overlay">
                  <h3 className="gallery-ecell-card__title">ECell Core Team</h3>
                  <p className="gallery-ecell-card__subtitle">
                    The student leaders driving entrepreneurship &amp; innovation at RVU
                  </p>
                </div>
              </div>

              {/* Card 2: ECell Team Photo (clean, no Organizing Committee overlay) */}
              <div
                className="gallery-ecell-card"
                onClick={() => openLightbox("ecell-team", 1)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openLightbox("ecell-team", 1);
                  }
                }}
                aria-label="View ECell Team photo 2 full screen"
              >
                <div className="gallery-ecell-card__image-wrap">
                  <Image
                    src={ecellTeam2}
                    alt="ECell RVU Team — Argonyx '26"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
            </div>
          </section>
        )}

        {filteredSections.map((section, sIdx) => (
          <section
            key={section.id}
            id={`gallery-${section.id}`}
            className="gallery-section"
            ref={(el) => {
              sectionRefs.current[section.id] = el;
            }}
          >
            <div className="gallery-section__header">
              <p className="gallery-eyebrow">
                <span className="gallery-eyebrow__rule" />
                {section.eyebrow}
              </p>
              <div className="gallery-section__title-row">
                <h2 className="gallery-section__title">
                  <span className="gallery-section__index">
                    {String(sIdx + 1).padStart(2, "0")}.
                  </span>{" "}
                  {section.title}
                </h2>
              </div>
            </div>

            <DepthCarousel
              key={section.id}
              items={section.photos.map(
                (p): DepthCarouselItem => ({ image: p.src, alt: p.alt })
              )}
              depth={220}
              spread={90}
              tilt={22}
              tiltDirection="right"
              perspective={1400}
              visibleCards={4}
              falloff={0.2}
              blur={6}
              autoplay={false}
              loop
              onCardClick={(idx) => openLightbox(section.id, idx)}
            />
          </section>
        ))}
      </main>

      {/* ── FINALE: WITH LOVE + TEAM ARGONYX GSAP & LENIS TRANSITION ── */}
      <section
        id="team-photo"
        className="gallery-finale-stage"
        ref={finaleStageRef}
        aria-label="Argonyx '26 Team Finale"
      >
        <div className="gallery-finale-pin" ref={finalePinRef}>
          {/* 'With Love' Transition Layer */}
          <div className="gallery-love-layer" ref={loveLayerRef}>
            <div className="gallery-love-transition__inner">
              <div className="gallery-love-transition__sparkle" aria-hidden="true">✦</div>
              <p className="gallery-love-transition__text">
                with love,
              </p>
              <h2 className="gallery-love-transition__team">
                Argonyx Team
              </h2>
              <div className="gallery-love-transition__line" />
              <p className="gallery-love-transition__sub">
                Built by builders, for builders. RV University · 2026
              </p>
              <div className="gallery-love-transition__scroll-indicator">
                <span className="gallery-love-transition__scroll-text">Scroll to reveal</span>
                <span className="gallery-love-transition__scroll-arrow">↓</span>
              </div>
            </div>
          </div>

          {/* Team Photo Reveal Layer (rises from bottom to fullscreen) */}
          <div className="gallery-team-layer" ref={teamLayerRef}>
            <div
              className="gallery-team-photo__img-wrap"
              ref={teamImgWrapRef}
              onClick={() => openLightbox("team-photo", 0)}
              role="button"
              tabIndex={0}
              style={{ cursor: "zoom-in" }}
              aria-label="View Team Argonyx photo full screen"
            >
              <Image
                src={teamArgonyx}
                alt="Team Argonyx '26 — The team behind RV University's national hackathon"
                fill
                sizes="100vw"
                style={{ objectFit: "cover" }}
                quality={85}
              />
              <div className="gallery-team-photo__overlay" ref={teamOverlayRef}>
                <div className="gallery-team-photo__caption-wrap">
                  <h2 className="gallery-team-photo__title">
                    TEAM ARGONYX
                  </h2>
                  <p className="gallery-team-photo__sub">
                    Organised by ECell, IEEE and VIKSHA Coding Club
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LIGHTBOX ── */}
      {lightboxIndex !== null && currentPhotos[lightboxIndex] && (
        <GalleryLightbox
          photo={currentPhotos[lightboxIndex]}
          onClose={closeLightbox}
          onPrev={goLightboxPrev}
          onNext={goLightboxNext}
          currentIndex={lightboxIndex}
          totalCount={currentPhotos.length}
        />
      )}
    </div>
  );
}
