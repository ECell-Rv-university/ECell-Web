"use client";

import React, { useEffect, useRef, useState } from "react";
import "./SiteCredit.css";

/** Taps on the heart before the credit gives up its secret. */
const SECRET_AT = 2;

/**
 * "Crafted with ♥ by ECell Tech Team". Easter egg: every tap on the heart
 * sends a small heart floating up, and the second rewrites the line. A hint
 * over the heart ("tap me", then a countdown) pops up by itself once the line
 * is on screen, so it's findable without hovering.
 * Shared by the home footer and the SiteCredit line on other pages.
 */
export function CraftedWithLove(): React.ReactElement {
  const [taps, setTaps] = useState(0);
  const [hearts, setHearts] = useState<{ id: number; dx: number }[]>([]);
  const [seen, setSeen] = useState(false);
  const heartRef = useRef<HTMLButtonElement>(null);
  const found = taps >= SECRET_AT;
  const hint = found ? "you found it" : taps === 0 ? "tap me" : `${SECRET_AT - taps} more`;

  useEffect(() => {
    const heart = heartRef.current;
    if (!heart || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      setSeen(true);
      io.disconnect();
    }, { threshold: 1 });
    io.observe(heart);
    return () => io.disconnect();
  }, []);

  const love = () => {
    setTaps((t) => t + 1);
    setHearts((h) => [...h, { id: Date.now() + Math.random(), dx: (Math.random() - 0.5) * 36 }]);
  };

  return (
    <span className="site-credit__line">
      Crafted with{" "}
      <button
        type="button"
        ref={heartRef}
        className={"site-credit__heart" + (seen || taps > 0 ? " is-hinting" : "") + (found ? " is-found" : "")}
        data-hint={hint}
        onClick={love}
        aria-label={found ? "Send more love" : "Send love"}
      >
        <span className="site-credit__glyph" aria-hidden="true">
          ♥
        </span>
        {hearts.map(({ id, dx }) => (
          <span
            key={id}
            className="site-credit__float"
            aria-hidden="true"
            style={{ "--dx": `${dx}px` } as React.CSSProperties}
            onAnimationEnd={() => setHearts((h) => h.filter((x) => x.id !== id))}
          >
            ♥
          </span>
        ))}
      </button>{" "}
      <span key={String(found)} className={found ? "site-credit__secret" : undefined} aria-live="polite">
        {found ? "by the GOAT tech team of ECell" : "by ECell Tech Team"}
      </span>
    </span>
  );
}

/** The last line of every page. The home page carries it inside its footer; other pages render this. */
export default function SiteCredit(): React.ReactElement {
  return (
    <p className="site-credit">
      <CraftedWithLove />
    </p>
  );
}
