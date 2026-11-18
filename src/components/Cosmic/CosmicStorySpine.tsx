"use client";

import React, { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "@/src/utils/gsapSetup";
import { navigateToSection } from "@/src/sections/Nav/navUtils";
import { scrollToY } from "@/src/utils/lenis";

export interface CosmicChapter {
  index: number;
  code: string;
  act: string;
  body: string;
  au: string;
  story: string;
  selector: string;
  targetId: string;
  quiet?: boolean;
}

export const COSMIC_STORY_CHAPTERS: CosmicChapter[] = [
  {
    index: 0,
    code: "01",
    act: "IGNITION",
    body: "SIRIUS AB",
    au: "0.00 AU",
    story: "Every venture begins as a lone spark of conviction in the dark.",
    selector: ".hero",
    targetId: "hero",
  },
  {
    index: 1,
    code: "02",
    act: "ACCRETION",
    body: "ORBITALIS",
    au: "1.42 AU",
    story: "Curiosity draws builders together; raw ideas coalesce into rings of momentum.",
    selector: "#aboutSection",
    targetId: "aboutSection",
  },
  {
    index: 2,
    code: "03",
    act: "SLINGSHOT",
    body: "JOVIAN KINETIC",
    au: "3.80 AU",
    story: "Summits and hackathons act as gravity assists, accelerating teams into flight.",
    selector: "#eventsSection",
    targetId: "eventsSection",
    quiet: true,
  },
  {
    index: 3,
    code: "04",
    act: "TRANSMISSION",
    body: "PULSAR BEACON",
    au: "6.20 AU",
    story: "Founders who navigated the dark transmit their coordinates back to campus.",
    selector: "#speakers",
    targetId: "speakers",
  },
  {
    index: 4,
    code: "05",
    act: "CONSTELLATION",
    body: "HELIOS ORRERY",
    au: "9.50 AU",
    story: "A constellation of partners fuels the spacecraft from orbit to mission impact.",
    selector: "#sponsors",
    targetId: "sponsors",
  },
  {
    index: 5,
    code: "06",
    act: "TERRAFORM",
    body: "TERRA FIRMA",
    au: "14.8 AU",
    story: "Ambition touches down on living campus ground where builders ship for real.",
    selector: "#why-join",
    targetId: "why-join",
  },
  {
    index: 6,
    code: "07",
    act: "MONOLITH",
    body: "SELENA ARCHIVE",
    au: "18.2 AU",
    story: "Tools and capital orbit the builder, but it is the mind that alters the course.",
    selector: "#storyReveal",
    targetId: "storyReveal",
    quiet: true,
  },
  {
    index: 7,
    code: "08",
    act: "COMMAND",
    body: "PLEIADES CLUSTER",
    au: "22.6 AU",
    story: "Nine core operators hold the flight deck in tight gravitational lock.",
    selector: "#teamSection",
    targetId: "teamSection",
  },
  {
    index: 8,
    code: "09",
    act: "SINGULARITY",
    body: "M87* HORIZON",
    au: "30.0 AU",
    story: "700+ student builders converge at the horizon where the next mission launches.",
    selector: "#community",
    targetId: "community",
  },
];

export default function CosmicStorySpine(): React.ReactElement | null {
  const [isMobile, setIsMobile] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [chapterPulse, setChapterPulse] = useState(false);
  const [inFooter, setInFooter] = useState(false);
  const fillRef = useRef<HTMLSpanElement | null>(null);
  const shipDotRef = useRef<HTMLSpanElement | null>(null);
  const pulseTimerRef = useRef<number | null>(null);
  const lastChapterRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mql = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (isMobile || typeof window === "undefined") return;

    const reduceMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const updateFromScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const vh = window.innerHeight || 1;
      const docHeight = Math.max(
        document.documentElement.scrollHeight - vh,
        1
      );
      const globalProgress = Math.max(0, Math.min(1, scrollY / docHeight));

      if (fillRef.current) {
        fillRef.current.style.transform = `scaleY(${globalProgress.toFixed(3)})`;
      }
      if (shipDotRef.current) {
        shipDotRef.current.style.top = `${(globalProgress * 100).toFixed(1)}%`;
      }

      // Check footer overlap
      const footerEl = document.getElementById("footer");
      if (footerEl) {
        const fRect = footerEl.getBoundingClientRect();
        setInFooter(fRect.top < vh * 0.65);
      }

      // Determine active chapter from viewport center
      const midY = vh * 0.45;
      const midX = (window.innerWidth || 1) * 0.5;
      let foundIdx = lastChapterRef.current;

      for (let i = 0; i < COSMIC_STORY_CHAPTERS.length; i++) {
        const ch = COSMIC_STORY_CHAPTERS[i];
        const el = document.querySelector<HTMLElement>(ch.selector);
        if (!el) continue;
        const r = el.getBoundingClientRect();

        // For horizontal panels (Team / Community), also check horizontal bounds
        if (ch.targetId === "teamSection" || ch.targetId === "community") {
          if (r.top <= midY && r.bottom >= midY && r.left <= midX && r.right >= midX) {
            foundIdx = i;
            break;
          }
        } else if (r.top <= midY && r.bottom >= midY) {
          foundIdx = i;
          break;
        }
      }

      if (foundIdx !== lastChapterRef.current) {
        lastChapterRef.current = foundIdx;
        setActiveIdx(foundIdx);

        if (!reduceMotion) {
          setChapterPulse(true);
          if (pulseTimerRef.current) window.clearTimeout(pulseTimerRef.current);
          pulseTimerRef.current = window.setTimeout(() => {
            setChapterPulse(false);
          }, 2200);
        }
      }
    };

    updateFromScroll();

    let st: ScrollTrigger | null = null;
    if (typeof ScrollTrigger?.create === "function") {
      st = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: updateFromScroll,
      });
    } else {
      window.addEventListener("scroll", updateFromScroll, { passive: true });
    }

    return () => {
      st?.kill?.();
      window.removeEventListener("scroll", updateFromScroll);
      if (pulseTimerRef.current) window.clearTimeout(pulseTimerRef.current);
    };
  }, [isMobile]);

  if (isMobile) {
    return null;
  }

  const activeChapter = COSMIC_STORY_CHAPTERS[activeIdx] ?? COSMIC_STORY_CHAPTERS[0];
  const showReadout = isHovered || chapterPulse;

  const handleJump = (ch: CosmicChapter) => {
    if (ch.targetId === "hero") {
      scrollToY(0, { duration: 1.2 });
      return;
    }
    navigateToSection(ch.targetId);
  };

  return (
    <aside
      className={`cosmic-story-spine${activeChapter.quiet ? " is-quiet" : ""}${inFooter ? " is-hidden" : ""}${showReadout ? " is-expanded" : ""}`}
      aria-label="Cosmic story chapters"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Vertical Keplerian Trajectory Rail */}
      <div className="cosmic-story-spine__rail">
        <div className="cosmic-story-spine__track" aria-hidden="true">
          <span ref={fillRef} className="cosmic-story-spine__track-fill" />
          <span ref={shipDotRef} className="cosmic-story-spine__ship" />
        </div>

        <ol className="cosmic-story-spine__nodes">
          {COSMIC_STORY_CHAPTERS.map((ch) => {
            const isCurrent = ch.index === activeIdx;
            const isPassed = ch.index < activeIdx;
            return (
              <li key={ch.code} className="cosmic-story-spine__node-item">
                <button
                  type="button"
                  className={`cosmic-story-spine__node${isCurrent ? " is-active" : ""}${isPassed ? " is-passed" : ""}`}
                  onClick={() => handleJump(ch)}
                  onFocus={() => setIsHovered(true)}
                  onBlur={() => setIsHovered(false)}
                  aria-label={`Chapter ${ch.code}: ${ch.act} (${ch.body})`}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  <span className="cosmic-story-spine__dot" aria-hidden="true" />
                  <span className="cosmic-story-spine__code" aria-hidden="true">
                    {ch.code}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Architectural Story Readout Card (Reveals on chapter transition or rail hover) */}
      <div className="cosmic-story-spine__card" aria-live="polite">
        <div className="cosmic-story-spine__card-top">
          <span className="cosmic-story-spine__act">
            CH.{activeChapter.code} / 09 · {activeChapter.act}
          </span>
          <span className="cosmic-story-spine__au">{activeChapter.au}</span>
        </div>
        <p className="cosmic-story-spine__body">{activeChapter.body}</p>
        <p className="cosmic-story-spine__narrative">{activeChapter.story}</p>
      </div>
    </aside>
  );
}
