"use client";
import React, { useEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";
import HeroSocials from "./HeroSocials";
import "../styles/HeroScrollHint.css";

interface HeroScrollHintProps {
  ref?: React.Ref<HTMLDivElement>;
  onExplore: () => void;
}

/** Bottom bar: who we are, a spinning "scroll to explore" badge, socials and local time. */
export default function HeroScrollHint({ ref, onExplore }: HeroScrollHintProps): React.ReactElement {
  const clockRef = useRef<HTMLSpanElement | null>(null);

  // Live Bengaluru time. Written straight to the DOM so the server render (no
  // time) and the client never disagree during hydration.
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

  return (
    <div ref={ref} className="hero__scroll-hint">
      <span className="hero__scroll-meta">
        Entrepreneurship Cell
        <br />
        RV University
      </span>

      <button type="button" className="hero__scroll-badge" onClick={onExplore}>
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

      <div className="hero__scroll-end">
        <HeroSocials />
        <span className="hero__scroll-meta hero__scroll-meta--right">
          Bengaluru, IN
          <br />
          <span ref={clockRef}>--:--</span> IST
        </span>
      </div>
    </div>
  );
}
