"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import "./Gallery.css";

/* ── Photo imports: Opening & Registration ── */
import op1 from "@/src/assets/Argonyx26/opening/op1.png";
import op2 from "@/src/assets/Argonyx26/opening/op2.png";
import reg from "@/src/assets/Argonyx26/opening/reg.png";
import reg2 from "@/src/assets/Argonyx26/opening/reg2.png";
import reg3 from "@/src/assets/Argonyx26/opening/reg3.png";
import reg4 from "@/src/assets/Argonyx26/opening/reg4.png";
import reg5 from "@/src/assets/Argonyx26/opening/reg5.png";

/* ── Inauguration ── */
import alok1 from "@/src/assets/Argonyx26/inaugration/alok1.png";
import alok2 from "@/src/assets/Argonyx26/inaugration/alok2.png";
import ayush1 from "@/src/assets/Argonyx26/inaugration/ayush1.png";
import ayush2 from "@/src/assets/Argonyx26/inaugration/ayush2.png";
import eventLeads from "@/src/assets/Argonyx26/inaugration/eventLeads.png";
import ing1 from "@/src/assets/Argonyx26/inaugration/ing1.png";
import ing2 from "@/src/assets/Argonyx26/inaugration/ing2.png";
import ing3 from "@/src/assets/Argonyx26/inaugration/ing3.png";
import ing4 from "@/src/assets/Argonyx26/inaugration/ing4.png";
import ing5 from "@/src/assets/Argonyx26/inaugration/ing5.png";
import me1 from "@/src/assets/Argonyx26/inaugration/me1.png";
import me2 from "@/src/assets/Argonyx26/inaugration/me2.png";

/* ── Coding Session ── */
import codingSession1 from "@/src/assets/Argonyx26/coding-session-1/image.png";
import codingSession2 from "@/src/assets/Argonyx26/coding-session-1/image copy.png";

/* ── Mentor Sessions ── */
import apoorv1 from "@/src/assets/Argonyx26/MentorsSessions/apoorv1.png";
import apoorv2 from "@/src/assets/Argonyx26/MentorsSessions/apoorv2.png";
import apoorv3 from "@/src/assets/Argonyx26/MentorsSessions/apoorv3.png";
import apoorv4 from "@/src/assets/Argonyx26/MentorsSessions/apoorv4.png";
import apoorv5 from "@/src/assets/Argonyx26/MentorsSessions/apoorv5.png";
import apoorv6 from "@/src/assets/Argonyx26/MentorsSessions/apoorv6.png";
import apoorv7 from "@/src/assets/Argonyx26/MentorsSessions/apoorv7.png";
import apoorv8 from "@/src/assets/Argonyx26/MentorsSessions/apoorv8.png";
import jaineesh1 from "@/src/assets/Argonyx26/MentorsSessions/jaineesh1.png";
import jaineesh2 from "@/src/assets/Argonyx26/MentorsSessions/jaineesh2.png";
import jaineesh3 from "@/src/assets/Argonyx26/MentorsSessions/jaineesh3.png";
import jaineesh4 from "@/src/assets/Argonyx26/MentorsSessions/jaineesh4.png";
import jaineesh5 from "@/src/assets/Argonyx26/MentorsSessions/jaineesh5.png";
import longHairMen from "@/src/assets/Argonyx26/MentorsSessions/longHairMen.png";
import longHairMen2 from "@/src/assets/Argonyx26/MentorsSessions/longHairMen2.png";
import longHairMen3 from "@/src/assets/Argonyx26/MentorsSessions/longHairMen3.png";
import longHairMen4 from "@/src/assets/Argonyx26/MentorsSessions/longHairMen4.png";
import tallMen from "@/src/assets/Argonyx26/MentorsSessions/TallMen.png";
import tallMen2 from "@/src/assets/Argonyx26/MentorsSessions/TallMen2.png";
import tallMen3 from "@/src/assets/Argonyx26/MentorsSessions/TallMen3.png";
import tallMen4 from "@/src/assets/Argonyx26/MentorsSessions/TallMen4.png";
import viksha1 from "@/src/assets/Argonyx26/MentorsSessions/viksha1.png";
import viksha2 from "@/src/assets/Argonyx26/MentorsSessions/viksha2.png";
import viksha3 from "@/src/assets/Argonyx26/MentorsSessions/viksha3.png";
import viksha4 from "@/src/assets/Argonyx26/MentorsSessions/viksha4.png";
import viksha5 from "@/src/assets/Argonyx26/MentorsSessions/viksha5.png";
import viksha6 from "@/src/assets/Argonyx26/MentorsSessions/viksha6.png";
import viksha7 from "@/src/assets/Argonyx26/MentorsSessions/viksha7.png";

/* ── Lunch ── */
import faculty from "@/src/assets/Argonyx26/lunch/Faculty.png";
import kushal from "@/src/assets/Argonyx26/lunch/kushal.png";
import lunch1 from "@/src/assets/Argonyx26/lunch/lunch1.png";
import lunch2 from "@/src/assets/Argonyx26/lunch/lunch2.png";

/* ── Judges ── */
import judgesImg from "@/src/assets/Argonyx26/judges/image.png";
import judgesCopy from "@/src/assets/Argonyx26/judges/image copy.png";
import judgesCopy2 from "@/src/assets/Argonyx26/judges/image copy 2.png";
import judgesCopy3 from "@/src/assets/Argonyx26/judges/image copy 3.png";
import judgesCopy4 from "@/src/assets/Argonyx26/judges/image copy 4.png";
import judgesCopy5 from "@/src/assets/Argonyx26/judges/image copy 5.png";
import judgesCopy6 from "@/src/assets/Argonyx26/judges/image copy 6.png";

/* ── Round 2 ── */
import round2Img from "@/src/assets/Argonyx26/roun2/image.png";
import round2Copy from "@/src/assets/Argonyx26/roun2/image copy.png";
import round2Copy2 from "@/src/assets/Argonyx26/roun2/image copy 2.png";
import round2Copy3 from "@/src/assets/Argonyx26/roun2/image copy 3.png";
import round2Copy4 from "@/src/assets/Argonyx26/roun2/image copy 4.png";

/* ── Round 2 Walk ── */
import round2WalkImg from "@/src/assets/Argonyx26/round2Walk/image.png";
import round2WalkCopy from "@/src/assets/Argonyx26/round2Walk/image copy.png";
import round2WalkCopy2 from "@/src/assets/Argonyx26/round2Walk/image copy 2.png";
import round2WalkCopy3 from "@/src/assets/Argonyx26/round2Walk/image copy 3.png";
import round2WalkCopy4 from "@/src/assets/Argonyx26/round2Walk/image copy 4.png";
import round2WalkCopy5 from "@/src/assets/Argonyx26/round2Walk/image copy 5.png";
import round2WalkCopy6 from "@/src/assets/Argonyx26/round2Walk/image copy 6.png";
import round2WalkCopy7 from "@/src/assets/Argonyx26/round2Walk/image copy 7.png";
import round2WalkCopy8 from "@/src/assets/Argonyx26/round2Walk/image copy 8.png";
import round2WalkCopy9 from "@/src/assets/Argonyx26/round2Walk/image copy 9.png";
import round2WalkCopy10 from "@/src/assets/Argonyx26/round2Walk/image copy 10.png";
import round2WalkCopy11 from "@/src/assets/Argonyx26/round2Walk/image copy 11.png";
import goat1 from "@/src/assets/Argonyx26/round2Walk/goat1.png";

/* ── Dinner ── */
import mingos1 from "@/src/assets/Argonyx26/dinner/mingos1.png";

/* ────────────────────────────── GALLERY DATA ────────────────────────────── */

interface GalleryPhoto {
  src: typeof op1;
  alt: string;
}

interface GallerySection {
  id: string;
  title: string;
  eyebrow: string;
  photos: GalleryPhoto[];
}

const GALLERY_SECTIONS: GallerySection[] = [
  {
    id: "registration",
    title: "Registration & Opening",
    eyebrow: "DAY 1 · ARRIVAL",
    photos: [
      { src: reg, alt: "Registration desk" },
      { src: reg2, alt: "Participants registering" },
      { src: reg3, alt: "Check-in process" },
      { src: reg4, alt: "Welcome kits" },
      { src: reg5, alt: "Registration area" },
      { src: op1, alt: "Opening setup" },
      { src: op2, alt: "Opening ceremony" },
    ],
  },
  {
    id: "inauguration",
    title: "Inauguration Ceremony",
    eyebrow: "KEYNOTE · DAY 1",
    photos: [
      { src: ing1, alt: "Inauguration keynote" },
      { src: ing2, alt: "Stage address" },
      { src: ing3, alt: "Welcome speech" },
      { src: ing4, alt: "Inaugural moment" },
      { src: ing5, alt: "Ceremony proceedings" },
      { src: alok1, alt: "Alok Murali speaking" },
      { src: alok2, alt: "Alok Murali address" },
      { src: ayush1, alt: "Ayush S Kulkarni" },
      { src: ayush2, alt: "Ayush presenting" },
      { src: eventLeads, alt: "Event leads on stage" },
      { src: me1, alt: "Organizer moment" },
      { src: me2, alt: "Organizer address" },
    ],
  },
  {
    id: "coding-sessions",
    title: "Coding Sessions",
    eyebrow: "HACKING FLOOR · 24 HOURS",
    photos: [
      { src: codingSession1, alt: "Teams coding" },
      { src: codingSession2, alt: "Late-night hacking" },
    ],
  },
  {
    id: "mentors",
    title: "Mentor Sessions & Reviews",
    eyebrow: "MENTORSHIP · DAY 1 & 2",
    photos: [
      { src: apoorv1, alt: "Apoorv mentoring" },
      { src: apoorv2, alt: "Apoorv with team" },
      { src: apoorv3, alt: "Mentor review session" },
      { src: apoorv4, alt: "Architecture review" },
      { src: apoorv5, alt: "Apoorv feedback" },
      { src: apoorv6, alt: "Team discussion" },
      { src: apoorv7, alt: "Mentor guidance" },
      { src: apoorv8, alt: "Apoorv session" },
      { src: jaineesh1, alt: "Jaineesh mentoring" },
      { src: jaineesh2, alt: "Jaineesh with team" },
      { src: jaineesh3, alt: "Technical review" },
      { src: jaineesh4, alt: "Jaineesh feedback" },
      { src: jaineesh5, alt: "Jaineesh session" },
      { src: longHairMen, alt: "Mentor session" },
      { src: longHairMen2, alt: "Technical guidance" },
      { src: longHairMen3, alt: "Product review" },
      { src: longHairMen4, alt: "Mentor feedback" },
      { src: tallMen, alt: "Mentor evaluation" },
      { src: tallMen2, alt: "Review moment" },
      { src: tallMen3, alt: "Architecture discussion" },
      { src: tallMen4, alt: "Tech review" },
      { src: viksha1, alt: "Viksha team mentoring" },
      { src: viksha2, alt: "Viksha session" },
      { src: viksha3, alt: "Viksha feedback" },
      { src: viksha4, alt: "Viksha with participants" },
      { src: viksha5, alt: "Viksha review" },
      { src: viksha6, alt: "Viksha discussion" },
      { src: viksha7, alt: "Viksha mentoring" },
    ],
  },
  {
    id: "lunch",
    title: "Lunch & Breaks",
    eyebrow: "REFUEL · MID-DAY",
    photos: [
      { src: lunch1, alt: "Lunch break" },
      { src: lunch2, alt: "Participants at lunch" },
      { src: faculty, alt: "Faculty at lunch" },
      { src: kushal, alt: "Kushal at lunch" },
    ],
  },
  {
    id: "judges",
    title: "Judging Panel & Evaluations",
    eyebrow: "JURY ROUND · DAY 2",
    photos: [
      { src: judgesImg, alt: "Judging panel" },
      { src: judgesCopy, alt: "Judges evaluating" },
      { src: judgesCopy2, alt: "Jury deliberation" },
      { src: judgesCopy3, alt: "Evaluation round" },
      { src: judgesCopy4, alt: "Judges discussion" },
      { src: judgesCopy5, alt: "Final evaluation" },
      { src: judgesCopy6, alt: "Jury panel moment" },
    ],
  },
  {
    id: "round2",
    title: "Round 2 — Final Pitches",
    eyebrow: "DEMO DAY · DAY 2",
    photos: [
      { src: round2Img, alt: "Final pitch" },
      { src: round2Copy, alt: "Team presenting" },
      { src: round2Copy2, alt: "Demo in action" },
      { src: round2Copy3, alt: "Pitch deck moment" },
      { src: round2Copy4, alt: "Final round" },
    ],
  },
  {
    id: "round2-walk",
    title: "Round 2 — Walkthrough & Demos",
    eyebrow: "DEMO WALK · DAY 2",
    photos: [
      { src: round2WalkImg, alt: "Demo walkthrough" },
      { src: round2WalkCopy, alt: "Product demo" },
      { src: round2WalkCopy2, alt: "Team showcase" },
      { src: round2WalkCopy3, alt: "Live demo moment" },
      { src: round2WalkCopy4, alt: "Walkthrough session" },
      { src: round2WalkCopy5, alt: "Technical demo" },
      { src: round2WalkCopy6, alt: "Solution showcase" },
      { src: round2WalkCopy7, alt: "Prototype demo" },
      { src: round2WalkCopy8, alt: "Team presentation" },
      { src: round2WalkCopy9, alt: "Booth walkthrough" },
      { src: round2WalkCopy10, alt: "Product review" },
      { src: round2WalkCopy11, alt: "Final walkthrough" },
      { src: goat1, alt: "Hackathon moment" },
    ],
  },
  {
    id: "dinner",
    title: "Dinner & Celebrations",
    eyebrow: "CLOSING · EVENING",
    photos: [
      { src: mingos1, alt: "Celebration dinner" },
    ],
  },
];

/* ────────────────────────────── LIGHTBOX ────────────────────────────── */

function Lightbox({
  photo,
  onClose,
  onPrev,
  onNext,
}: {
  photo: GalleryPhoto;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose, onPrev, onNext]);

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <button className="lightbox-nav lightbox-nav--prev" onClick={onPrev} aria-label="Previous">
          ←
        </button>
        <div className="lightbox-image-wrap">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="90vw"
            style={{ objectFit: "contain" }}
            quality={90}
            priority
          />
        </div>
        <button className="lightbox-nav lightbox-nav--next" onClick={onNext} aria-label="Next">
          →
        </button>
        <p className="lightbox-caption">{photo.alt}</p>
      </div>
    </div>
  );
}

/* ────────────────────────────── MAIN COMPONENT ────────────────────────────── */

export default function GalleryClient() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxSection, setLightboxSection] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const allPhotos = GALLERY_SECTIONS.flatMap((s) =>
    s.photos.map((p) => ({ ...p, sectionId: s.id }))
  );
  const totalCount = allPhotos.length;

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
  const currentPhotos = currentSection?.photos || [];

  const goLightboxPrev = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + currentPhotos.length) % currentPhotos.length);
  }, [lightboxIndex, currentPhotos.length]);

  const goLightboxNext = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % currentPhotos.length);
  }, [lightboxIndex, currentPhotos.length]);

  const scrollToSection = (sectionId: string) => {
    setActiveFilter(sectionId);
    const el = sectionRefs.current[sectionId];
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
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

  return (
    <div className="gallery-page">
      {/* ── TOP BAR ── */}
      <header className="gallery-topbar">
        <div className="gallery-topbar__inner">
          <Link className="gallery-topbar__back" href="/events/argonyx-26">
            <span className="arrow">←</span> ARGONYX &apos;26
          </Link>
          <span className="gallery-topbar__count">{totalCount} Photos</span>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="gallery-hero">
        <div className="gallery-hero__inner">
          <p className="gallery-eyebrow">
            <span className="gallery-eyebrow__rule" />
            Photo Gallery · Argonyx &apos;26
          </p>
          <h1 className="gallery-hero__headline">
            Moments from
            <span className="gallery-hero__accent"> the floor.</span>
          </h1>
          <p className="gallery-hero__body">
            Highlights from the 24-hour sprint — from opening keynotes and midnight builds to jury
            defenses and the podium ceremony. {totalCount} photos across {GALLERY_SECTIONS.length}{" "}
            categories.
          </p>
        </div>
      </section>

      {/* ── FILTER TABS ── */}
      <nav className="gallery-filters">
        <div className="gallery-filters__inner">
          <button
            className={`gallery-filter-btn ${activeFilter === "all" ? "is-active" : ""}`}
            onClick={() => setActiveFilter("all")}
          >
            All ({totalCount})
          </button>
          {GALLERY_SECTIONS.map((s) => (
            <button
              key={s.id}
              className={`gallery-filter-btn ${activeFilter === s.id ? "is-active" : ""}`}
              onClick={() => scrollToSection(s.id)}
            >
              {s.title} ({s.photos.length})
            </button>
          ))}
        </div>
      </nav>

      {/* ── SECTIONS ── */}
      <main className="gallery-main">
        {filteredSections.map((section) => (
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
              <h2 className="gallery-section__title">{section.title}</h2>
              <span className="gallery-section__count">{section.photos.length} photos</span>
            </div>

            <div className="gallery-grid">
              {section.photos.map((photo, idx) => (
                <button
                  key={`${section.id}-${idx}`}
                  className="gallery-card"
                  onClick={() => openLightbox(section.id, idx)}
                  aria-label={`View ${photo.alt}`}
                >
                  <div className="gallery-card__media">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      style={{ objectFit: "cover" }}
                      quality={75}
                    />
                    <div className="gallery-card__overlay">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        <line x1="11" y1="8" x2="11" y2="14" />
                        <line x1="8" y1="11" x2="14" y2="11" />
                      </svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* ── FOOTER ── */}
      <footer className="gallery-footer">
        <span>ARGONYX &apos;26 · {totalCount} Captured Moments</span>
        <Link href="/events/argonyx-26">← Back to Event</Link>
      </footer>

      {/* ── LIGHTBOX ── */}
      {lightboxIndex !== null && currentPhotos[lightboxIndex] && (
        <Lightbox
          photo={currentPhotos[lightboxIndex]}
          onClose={closeLightbox}
          onPrev={goLightboxPrev}
          onNext={goLightboxNext}
        />
      )}
    </div>
  );
}
