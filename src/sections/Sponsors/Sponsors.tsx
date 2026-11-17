"use client";
import React, { useState, useEffect, useRef } from "react";
import { SPONSORS } from "@/src/content/sponsors";
import { gsap } from "@/src/utils/gsapSetup";
import { setupSponsorsAnimations } from "./animations/SponsorsAnimations";
import ConstellationNetwork from "./components/ConstellationNetwork";
import SponsorCard from "./components/SponsorCard";
import StarField from "./components/StarField";
import "./Sponsors.css";

const SPONSOR_ROWS = [
  SPONSORS.slice(0, 3),
  SPONSORS.slice(3, 8),
  SPONSORS.slice(8, 15),
  SPONSORS.slice(15, 20),
  SPONSORS.slice(20, 23),
];

export default function Sponsors(): React.ReactElement {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const sponsorsSectionRef = useRef<HTMLElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const constellationRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  // Decorative CSS loops (twinkling stars, planet drift, sun rays) pause
  // whenever the section is off screen, so they cost nothing elsewhere.
  useEffect(() => {
    const section = sponsorsSectionRef.current;
    if (!section) return;
    const io = new IntersectionObserver(
      ([entry]) => section.classList.toggle("is-offscreen", !entry.isIntersecting),
      { rootMargin: "100px 0px" }
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const section = sponsorsSectionRef.current;
    if (!section) return;
    return setupSponsorsAnimations({
      section,
      header: headerRef.current,
      constellation: constellationRef.current,
      glow: glowRef.current,
    });
  }, []);

  // Starlight sweep: one light follows the pointer across the whole grid and
  // catches the border of every card it passes, so neighbouring partners glow
  // together. Fine pointers above tablet only; writes run on the GSAP ticker.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || typeof window.matchMedia !== "function") return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 769px)").matches) return;

    const cards = Array.from(grid.querySelectorAll<HTMLElement>(".sponsor-card-inner"));
    let offsets: Array<{ x: number; y: number }> = [];
    let px = 0;
    let py = 0;
    let dirty = false;

    const measure = () => {
      const g = grid.getBoundingClientRect();
      offsets = cards.map((card) => {
        const r = card.getBoundingClientRect();
        return { x: r.left - g.left, y: r.top - g.top };
      });
    };

    const tick = () => {
      if (!dirty) return;
      dirty = false;
      cards.forEach((card, i) => {
        const o = offsets[i];
        if (!o) return;
        card.style.setProperty("--mx", `${(px - o.x).toFixed(1)}px`);
        card.style.setProperty("--my", `${(py - o.y).toFixed(1)}px`);
      });
    };

    const onEnter = () => {
      measure();
      grid.classList.add("is-lit");
      gsap.ticker.add(tick);
    };
    const onMove = (event: PointerEvent) => {
      const g = grid.getBoundingClientRect();
      px = event.clientX - g.left;
      py = event.clientY - g.top;
      dirty = true;
    };
    const onLeave = () => {
      grid.classList.remove("is-lit");
      gsap.ticker.remove(tick);
    };

    grid.addEventListener("pointerenter", onEnter);
    grid.addEventListener("pointermove", onMove, { passive: true });
    grid.addEventListener("pointerleave", onLeave);
    return () => {
      grid.removeEventListener("pointerenter", onEnter);
      grid.removeEventListener("pointermove", onMove);
      grid.removeEventListener("pointerleave", onLeave);
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <section ref={sponsorsSectionRef} className="sponsors-section" id="sponsors">
      <div ref={glowRef} className="sponsors-glow" />

      {/* Heliocentric Solar System Orrery revolving around the partner constellation */}
      <StarField hoveredNode={hoveredNode} />

      <div ref={headerRef} className="wrap sponsors-header">
        <h2 className="sponsors-headline" aria-label="Partners &amp; Sponsors">
          <span className="sponsors-headline-word sponsors-word-left">Partners</span>
          <span className="sponsors-headline-amp" aria-hidden="true">&amp;</span>
          <span className="sponsors-headline-word sponsors-word-right">Sponsors</span>
        </h2>
        <p className="sponsors-intro">
          The organisations helping us turn ideas into action.
        </p>
      </div>

      <div ref={constellationRef} className="wrap constellation-container">
        {/* Constellation Vector Network mapped across the grid */}
        <ConstellationNetwork hoveredNode={hoveredNode} />

        {/* Sponsor rows: 3 / 5 / 6 / 5 / 3 logos */}
        <div ref={gridRef} className="constellation-grid">
          {SPONSOR_ROWS.map((row, rowIndex) => (
            <div className={`constellation-row row-${rowIndex + 1}`} key={rowIndex}>
              {row.map((item) => (
                <div className="constellation-col" key={item.id}>
                  <div className={`constellation-node ${item.id}`}>
                    <SponsorCard
                      item={item}
                      isHovered={hoveredNode === item.id}
                      onMouseEnter={() => setHoveredNode(item.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
