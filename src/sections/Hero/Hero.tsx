"use client";
import React, { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { setupHeroAnimations } from "./HeroAnimations";
import "./Hero.css";
import "./HeroLayout.css";
import "./HeroVideo.css";
import HeroReveal from "./HeroReveal";
import "./HeroMarquee.css";
import "./HeroTypography.css";
import "./HeroResponsive.css";

const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/J0MfKUwIZ6J8WfemIBbdlJ";

export default function Hero(): React.ReactElement {
  const heroRef = useRef<HTMLElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const videoWrapRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLDivElement | null>(null);
  const marqueeRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLDivElement | null>(null);
  const scrollHintRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const cleanupAnimations = setupHeroAnimations({
      heroRef,
      videoWrapRef,
      headingRef,
      marqueeRef,
      labelRef,
      scrollHintRef,
    });

    return () => {
      cleanupAnimations?.();
    };
  }, []);

  return (
    <section ref={heroRef} className="hero">
      <div ref={stickyRef} className="hero__sticky">
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

        <div ref={videoWrapRef} className="hero__video-wrapper">
          <HeroReveal />
          <div ref={headingRef} className="hero__intro">
            <h1 className="hero__heading">
              <span className="hero__heading-sub">It all starts from an idea.</span>
              <span className="hero__heading-main">ECell RV University.</span>
            </h1>
            <a
              className="hero__cta"
              href={WHATSAPP_GROUP_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Join now</span>
              <ArrowRight aria-hidden="true" size={18} strokeWidth={1.5} />
            </a>
          </div>
        </div>

        <div ref={scrollHintRef} className="hero__scroll-hint" aria-hidden="true">
          <div className="hero__scroll-mouse">
            <span className="hero__scroll-wheel" />
          </div>
          <div className="hero__scroll-chevrons">
            <span />
            <span />
          </div>
          <span className="hero__scroll-label">Scroll to explore</span>
        </div>

        <div className="hero__bottom-marquee" aria-hidden="true">
          <div className="hero__bottom-marquee-track">
            <span>
              WE&apos;RE HERE TO BUILD <b>—</b> TO TRY <b>—</b> TO FAIL <b>—</b> TO
              START AGAIN <b>—</b> WE&apos;RE HERE TO BUILD <b>—</b> TO TRY <b>—</b>
              TO FAIL <b>—</b> TO START AGAIN <b>—</b>
            </span>
            <span>
              WE&apos;RE HERE TO BUILD <b>—</b> TO TRY <b>—</b> TO FAIL <b>—</b> TO
              START AGAIN <b>—</b> WE&apos;RE HERE TO BUILD <b>—</b> TO TRY <b>—</b>
              TO FAIL <b>—</b> TO START AGAIN <b>—</b>
            </span>
            <span>
              WE&apos;RE HERE TO BUILD <b>—</b> TO TRY <b>—</b> TO FAIL <b>—</b> TO
              START AGAIN <b>—</b> WE&apos;RE HERE TO BUILD <b>—</b> TO TRY <b>—</b>
              TO FAIL <b>—</b> TO START AGAIN <b>—</b>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
