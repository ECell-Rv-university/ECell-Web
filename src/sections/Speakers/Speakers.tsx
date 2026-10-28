"use client";

import Image, { type StaticImageData } from "next/image";
import finastraLogo from "@/src/assets/speaker-logo/finstra.webp";
import healthCommunityLogo from "@/src/assets/speaker-logo/health.webp";
import googleLogo from "@/src/assets/speaker-logo/google-back.webp";
import jpMorganLogo from "@/src/assets/speaker-logo/jpmorgenchae.webp";
import magnaLogo from "@/src/assets/speaker-logo/magna.webp";
import morganStanleyLogo from "@/src/assets/speaker-logo/Morgan-Stanley.webp";
import nasscomLogo from "@/src/assets/speaker-logo/nasscom.webp";
import noidaLogo from "@/src/assets/speaker-logo/nokia.webp";
import oracleLogo from "@/src/assets/speaker-logo/oracle.webp";
import ratchLogo from "@/src/assets/speaker-logo/ratch-ai.webp";
import stealthLogo from "@/src/assets/speaker-logo/stealth-Photoroom.webp";
import edockLogo from "@/src/assets/speaker-logo/edock.webp";
import wandLogo from "@/src/assets/speaker-logo/wand.webp";
import { useEffect, useRef, type ReactElement } from "react";
import { PREVIOUS_SPEAKERS } from "@/src/content/speakers";
import { gsap, SplitText } from "@/src/utils/gsapSetup";
import "./styles/Speakers.css";

export type { Speaker } from "@/src/content/speakers";

const SPEAKER_LOGOS: Record<string, StaticImageData> = {
  "Aditya Goyal": googleLogo,
  "Akhila Nandakumar": jpMorganLogo,
  "Himangshu Shekhar Jha": morganStanleyLogo,
  "Major Ravin Rajan (Retd)": jpMorganLogo,
  "Sai Sunil": magnaLogo,
  "Adarsh U": oracleLogo,
  "Dr. Karthik Mahesh": nasscomLogo,
  "Abrar Ahmed": jpMorganLogo,
  "Neelam Godihal": jpMorganLogo,
  "Swaroop Ghosh": noidaLogo,
  "Bharath KH": ratchLogo,
  "Harpreet Sohan": wandLogo,
  "Mustafa Shariff": healthCommunityLogo,
  "Arshdeep Singh": edockLogo,
  "Ambika J": finastraLogo,
  "Biplab Guha": stealthLogo,
};

export default function Speakers(): ReactElement {
  const headerRef = useRef<HTMLElement>(null);

  // Header entrance: kicker letter-spacing settles, headline letters rise out
  // of a clip mask, subheading follows. Plays once; skipped for reduced motion.
  useEffect(() => {
    const header = headerRef.current;
    if (!header || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ctx: gsap.Context | undefined;
    let cancelled = false;

    // Split after the webfont lands, or the character boxes are measured on the fallback face.
    (document.fonts?.ready ?? Promise.resolve()).then(() => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        const split = SplitText.create(".speakers-headline", { type: "words,chars", mask: "chars" });

        gsap
          .timeline({
            scrollTrigger: { trigger: header, start: "top 82%", once: true },
            defaults: { ease: "expo.out" },
            // The masks would clip descenders at this tight line-height; unwrap once the letters are home.
            onComplete: () => split.revert(),
          })
          .from(".speakers-kicker-text", { autoAlpha: 0, letterSpacing: "0.6em", duration: 1.2 })
          .from(split.chars, { yPercent: 115, rotate: 6, duration: 1.1, stagger: 0.028 }, 0.1)
          .from(".speakers-subheading", { autoAlpha: 0, y: 18, duration: 1 }, 0.45);
      }, header);
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section className="speakers-section" id="speakers" aria-labelledby="speakers-heading">
      <div className="speakers-reveal-panel">
        <div className="wrap">
          <header ref={headerRef} className="speakers-header">
            <span className="speakers-kicker-text">Voices of Innovation</span>
            <h2 id="speakers-heading" className="speakers-headline">
              Previous Speakers
            </h2>
            <p className="speakers-subheading">The leaders and builders who have shared their experience with our community.</p>
          </header>
          <div className="speaker-card-grid" role="list" aria-label="Previous speakers">
            {PREVIOUS_SPEAKERS.map((speaker, index) => {
              const logo = SPEAKER_LOGOS[speaker.name];
              return (
              <article className="speaker-card" role="listitem" key={speaker.name}>
                <Image src={speaker.src} alt={speaker.name} fill priority={index < 3} sizes="(max-width: 700px) 100vw, (max-width: 1050px) 50vw, 33vw" className="speaker-card-image" style={{ objectPosition: speaker.imagePosition ?? "center 25%" }} />
                <div className="speaker-card-shade" aria-hidden="true" />
                <div className="speaker-card-content">
                  <h3>{speaker.name}</h3>
                  <div className="speaker-card-role">
                    {logo && <Image src={logo} alt="" width={44} height={44} className="speaker-company-logo" />}
                    <p>{speaker.designation}</p>
                  </div>
                </div>
              </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
