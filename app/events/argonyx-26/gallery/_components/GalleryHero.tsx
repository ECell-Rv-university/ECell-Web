"use client";

import Image from "next/image";
import {
  heroAudiencePhoto,
  heroHackingPhoto,
  heroStagePhoto,
  heroWelcomePhoto,
} from "../_data/galleryData";

interface GalleryHeroProps {
  onPhotoOpen: (sectionId: string, index: number) => void;
}

function openOnKeyboard(
  event: React.KeyboardEvent<HTMLButtonElement>,
  onOpen: () => void
) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    onOpen();
  }
}

export default function GalleryHero({ onPhotoOpen }: GalleryHeroProps) {
  return (
    <section className="gallery-hero">
      <div className="gallery-hero__inner">
        <div className="gallery-hero__content">
          <p className="gallery-eyebrow">
            <span className="gallery-eyebrow__rule" />
            Photo Gallery · Argonyx &apos;26
          </p>
          <h1 className="gallery-hero__headline">
            Moments from<span className="gallery-hero__accent"> the floor.</span>
          </h1>
          <p className="gallery-hero__body">
            Highlights from the 24-hour national hackathon sprint at RV University — from opening
            arrival and keynote ceremonies to midnight coding, mentor reviews, live pitch defenses,
            and the podium finale.
          </p>
        </div>

        <div className="gallery-hero__showcase" aria-label="Argonyx '26 photo collage">
          <button
            type="button"
            className="gallery-showcase__card gallery-showcase__card--main"
            onClick={() => onPhotoOpen("opening", 2)}
            onKeyDown={(event) => openOnKeyboard(event, () => onPhotoOpen("opening", 2))}
            aria-label="View keynote auditorium photo full screen"
          >
            <Image src={heroStagePhoto} alt="Argonyx '26 Keynote Auditorium Stage" fill sizes="(max-width: 860px) 80vw, (max-width: 1200px) 44vw, 38vw" style={{ objectFit: "cover" }} preload />
            <div className="gallery-showcase__main-gradient" />
          </button>

          <div className="gallery-showcase__left-wrap">
            <div className="gallery-showcase__tag gallery-showcase__tag--left"><span>IDEAS</span><span>PEOPLE</span><span>PROGRESS</span></div>
            <button type="button" className="gallery-showcase__card gallery-showcase__card--left" onClick={() => onPhotoOpen("opening", 3)} onKeyDown={(event) => openOnKeyboard(event, () => onPhotoOpen("opening", 3))} aria-label="View welcome photo full screen">
              <Image src={heroWelcomePhoto} alt="Argonyx '26 Welcome Banner and Registration" fill sizes="(max-width: 1024px) 35vw, 18vw" style={{ objectFit: "cover" }} />
            </button>
          </div>

          <button type="button" className="gallery-showcase__card gallery-showcase__card--top-right" onClick={() => onPhotoOpen("coding-sessions", 0)} onKeyDown={(event) => openOnKeyboard(event, () => onPhotoOpen("coding-sessions", 0))} aria-label="View coding photo full screen">
            <Image src={heroHackingPhoto} alt="Hackers sprinting at laptops" fill sizes="(max-width: 1024px) 35vw, 18vw" style={{ objectFit: "cover" }} />
          </button>

          <div className="gallery-showcase__right-wrap">
            <div className="gallery-showcase__tag gallery-showcase__tag--right"><span>MORE</span><span>THAN A</span><span className="gallery-showcase__tag-accent">HACKATHON</span><svg className="gallery-showcase__brush" viewBox="0 0 140 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M3 10C40 3 95 4 137 8" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" /></svg></div>
            <button type="button" className="gallery-showcase__card gallery-showcase__card--bottom-right" onClick={() => onPhotoOpen("round2-walk", 1)} onKeyDown={(event) => openOnKeyboard(event, () => onPhotoOpen("round2-walk", 1))} aria-label="View audience photo full screen">
              <Image src={heroAudiencePhoto} alt="Hackathon audience and demo showcase" fill sizes="(max-width: 1024px) 35vw, 18vw" style={{ objectFit: "cover" }} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
