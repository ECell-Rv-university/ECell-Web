"use client";

import Image from "next/image";
import DepthCarousel, { type DepthCarouselItem } from "../DepthCarousel";
import { ecellTeam1, ecellTeam2, type GallerySection } from "../_data/galleryData";

interface GalleryTimelineProps {
  activeFilter: string;
  sections: GallerySection[];
  registerSection: (sectionId: string, element: HTMLElement | null) => void;
  onPhotoOpen: (sectionId: string, index: number) => void;
}

function ECellTeamSpotlight({ onPhotoOpen }: Pick<GalleryTimelineProps, "onPhotoOpen">) {
  const teamPhotos = [
    {
      image: ecellTeam1,
      alt: "ECell RVU Core Team — Argonyx '26 Organizers",
      title: "ECell Core Team",
      subtitle: "The student leaders driving entrepreneurship & innovation at RVU",
    },
    { image: ecellTeam2, alt: "ECell RVU Team — Argonyx '26" },
  ];

  return (
    <section id="gallery-ecell-team" className="gallery-ecell-section">
      <div className="gallery-ecell-header"><div className="gallery-ecell-header__left">
        <p className="gallery-eyebrow"><span className="gallery-eyebrow__rule" />THE ARCHITECTS &amp; ORGANIZERS · E-CELL RVU</p>
        <div className="gallery-ecell-title-row"><h2 className="gallery-ecell-title">ECell Team<span className="gallery-ecell-title__accent">Behind Argonyx &apos;26</span></h2></div>
        <p className="gallery-ecell-desc">The visionary student leaders, organizers, and creators from RV University&apos;s Entrepreneurship Cell who conceptualized, planned, and brought Argonyx &apos;26 to life.</p>
      </div></div>
      <div className="gallery-ecell-grid">
        {teamPhotos.map(({ image, alt, title, subtitle }, index) => (
          <button key={alt} type="button" className="gallery-ecell-card" onClick={() => onPhotoOpen("ecell-team", index)} aria-label={`View ${alt} full screen`}>
            <span className="gallery-ecell-card__image-wrap"><Image src={image} alt={alt} fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: "cover" }} /></span>
            {title && <div className="gallery-ecell-card__overlay"><h3 className="gallery-ecell-card__title">{title}</h3><p className="gallery-ecell-card__subtitle">{subtitle}</p></div>}
          </button>
        ))}
      </div>
    </section>
  );
}

export default function GalleryTimeline({ activeFilter, sections, registerSection, onPhotoOpen }: GalleryTimelineProps) {
  const showTeam = activeFilter === "all" || activeFilter === "ecell-team";

  return (
    <main className="gallery-main">
      {showTeam && <div ref={(element) => registerSection("ecell-team", element)}><ECellTeamSpotlight onPhotoOpen={onPhotoOpen} /></div>}
      {sections.map((section, index) => (
        <section key={section.id} id={`gallery-${section.id}`} className="gallery-section" ref={(element) => registerSection(section.id, element)}>
          <div className="gallery-section__header">
            <p className="gallery-eyebrow"><span className="gallery-eyebrow__rule" />{section.eyebrow}</p>
            <div className="gallery-section__title-row"><h2 className="gallery-section__title"><span className="gallery-section__index">{String(index + 1).padStart(2, "0")}.</span> {section.title}</h2></div>
          </div>
          <DepthCarousel
            items={section.photos.map((photo): DepthCarouselItem => ({ image: photo.src, alt: photo.alt }))}
            depth={220} spread={90} tilt={22} tiltDirection="right" perspective={1400}
            visibleCards={4} falloff={0.2} blur={6} autoplay={false} loop
            onCardClick={(photoIndex) => onPhotoOpen(section.id, photoIndex)}
          />
        </section>
      ))}
    </main>
  );
}
