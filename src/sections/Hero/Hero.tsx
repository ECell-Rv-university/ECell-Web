"use client";
import React, { useEffect, useRef } from "react";
import { scrollToY } from "../../utils/lenis";
import { setupHeroAnimations } from "./HeroAnimations";
import HeroReveal from "./components/HeroReveal";
import HeroIntro from "./components/HeroIntro";
import HeroScrollHint from "./components/HeroScrollHint";
import "./styles/Hero.css";
import "./styles/HeroStage.css";
import "./styles/HeroMarquee.css";

const BOTTOM_MARQUEE_COPIES = 3;

export default function Hero(): React.ReactElement {
  const heroRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);
  const marqueeRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLDivElement | null>(null);
  const scrollHintRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const cleanupAnimations = setupHeroAnimations({
      heroRef,
      stageRef,
      introRef,
      marqueeRef,
      labelRef,
      scrollHintRef,
    });

    return () => {
      cleanupAnimations?.();
    };
  }, []);

  // Glide through the hero's scroll animation to the first section.
  const scrollPastHero = () => {
    const hero = heroRef.current;
    if (!hero) return;
    scrollToY(hero.offsetTop + hero.offsetHeight, { duration: 2.2 });
  };

  return (
    <section ref={heroRef} className="hero">
      <div className="hero__sticky">
        <div ref={marqueeRef} className="hero__marquee-group">
          <div className="hero__marquee-line hero__marquee-line--startups">
            <span>WHERE STARTUPS</span>
          </div>
          <div className="hero__marquee-line hero__marquee-line--shape">
            <span>TAKE SHAPE.</span>
          </div>
        </div>

        <div ref={labelRef} className="hero__label">
          <span className="hero__label-mark">ECell</span>
          <span className="hero__label-cap">A note from the team</span>
        </div>

        {/* The stage is what the scroll animation shrinks into a card. */}
        <div ref={stageRef} className="hero__stage">
          <HeroReveal />
          <HeroIntro ref={introRef} />
        </div>

        <HeroScrollHint ref={scrollHintRef} onExplore={scrollPastHero} />

        <div className="hero__bottom-marquee" aria-hidden="true">
          <div className="hero__bottom-marquee-track">
            {Array.from({ length: BOTTOM_MARQUEE_COPIES }, (_, i) => (
              <span key={i}>
                WE&apos;RE HERE TO BUILD <b>—</b> TO TRY <b>—</b> TO FAIL <b>—</b> TO
                START AGAIN <b>—</b> WE&apos;RE HERE TO BUILD <b>—</b> TO TRY <b>—</b>
                TO FAIL <b>—</b> TO START AGAIN <b>—</b>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
