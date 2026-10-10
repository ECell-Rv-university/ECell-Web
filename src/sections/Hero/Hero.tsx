"use client";
import React, { useEffect, useRef } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { scrollToY } from "../../utils/lenis";
import { setupHeroAnimations } from "./HeroAnimations";
import "./Hero.css";
import "./HeroLayout.css";
import "./HeroVideo.css";
import HeroReveal from "./HeroReveal";
import "./HeroMarquee.css";
import "./HeroTypography.css";
import "./HeroResponsive.css";
import "./HeroScrollHint.css";

const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/J0MfKUwIZ6J8WfemIBbdlJ";

export default function Hero(): React.ReactElement {
  const heroRef = useRef<HTMLElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const videoWrapRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLDivElement | null>(null);
  const marqueeRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLDivElement | null>(null);
  const scrollHintRef = useRef<HTMLDivElement | null>(null);
  const clockRef = useRef<HTMLSpanElement | null>(null);

  // Live Bengaluru time in the bottom bar. Written straight to the DOM so the
  // server render (no time) and the client never disagree during hydration.
  useEffect(() => {
    const clock = clockRef.current;
    if (!clock) return;
    const format = new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Kolkata",
    });
    const update = () => {
      clock.textContent = format.format(new Date());
    };
    update();
    const id = window.setInterval(update, 15000);
    return () => window.clearInterval(id);
  }, []);

  // Glide through the hero's scroll animation to the first section.
  const scrollPastHero = () => {
    const hero = heroRef.current;
    if (!hero) return;
    scrollToY(hero.offsetTop + hero.offsetHeight, { duration: 2.2 });
  };

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

        <div ref={scrollHintRef} className="hero__scroll-hint">
          <span className="hero__scroll-meta">
            Entrepreneurship Cell
            <br />
            RV University
          </span>

          <button type="button" className="hero__scroll-badge" onClick={scrollPastHero}>
            <svg className="hero__scroll-ring" viewBox="0 0 120 120" aria-hidden="true">
              <defs>
                <path id="hero-scroll-circle" d="M60,60 m-47,0 a47,47 0 1,1 94,0 a47,47 0 1,1 -94,0" />
              </defs>
              <text>
                <textPath href="#hero-scroll-circle" textLength="292" lengthAdjust="spacing">
                  Scroll to explore • Scroll to explore •
                </textPath>
              </text>
            </svg>
            <span className="hero__scroll-core">
              <span className="hero__scroll-arrow">
                <ArrowDown aria-hidden="true" size={20} strokeWidth={1.75} />
              </span>
            </span>
            <span className="sr-only">Scroll to explore</span>
          </button>

          <span className="hero__scroll-meta hero__scroll-meta--right">
            Bengaluru, IN
            <br />
            <span ref={clockRef}>--:--</span> IST
          </span>
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
