"use client";
import React, { useRef } from "react";
import { scrollToY } from "@/src/utils/lenis";
import { scrollPageTo } from "@/src/utils/lenis";
import "./Footer.css";

export interface FooterLinkItem {
  num: string;
  label: string;
  href: string;
  isExternal?: boolean;
}

const FOOTER_EXPLORE_LINKS: FooterLinkItem[] = [
  { num: "01", label: "About", href: "#aboutSection" },
  { num: "02", label: "Events", href: "#eventsSection" },
  { num: "03", label: "Speakers", href: "#speakers" },
];

const FOOTER_SOCIAL_LINKS: FooterLinkItem[] = [
  { num: "01", label: "Instagram", href: "https://www.instagram.com/ecell_rvu/", isExternal: true },
  { num: "02", label: "LinkedIn", href: "https://www.linkedin.com/search/results/all/?keywords=ECell%2C%20RV%20University&origin=RICH_QUERY_SUGGESTION&heroEntityKey=urn%3Ali%3Aorganization%3A96671040&position=1", isExternal: true },
];

export default function Footer(): React.ReactElement {
  const footerRef = useRef<HTMLElement | null>(null);

  const scrollToTop = () => {
    scrollToY(0, { duration: 1.2 });
    if (typeof window !== "undefined") {
      scrollPageTo(0);
    }
  };

  const handleCardPointerMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--card-x", `${x}px`);
    card.style.setProperty("--card-y", `${y}px`);
  };

  return (
    <footer ref={footerRef} className="site-footer" id="footer">
      {/* Subtle E-Cell brand identity watermark (5-8% opacity) emerging from bottom-left */}
      <div className="footer-brand-backdrop" aria-hidden="true">
        <div className="footer-grid-mesh" />
        <div className="footer-corner-glow" />
        <svg
          className="footer-wave-emblem"
          viewBox="0 0 806 920"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="footerWaveGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8edcff" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#8edcff" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <g transform="translate(0,808) scale(0.1,-0.1)" fill="url(#footerWaveGrad)">
            <path d="M4280 5974 c-41 -19 -110 -60 -154 -91 -97 -67 -473 -364 -606 -478 -200 -172 -391 -303 -500 -345 l-35 -13 -242 -5 -243 -4 0 -304 0 -305 358 3 357 3 63 26 c135 58 309 185 642 469 347 298 503 412 633 468 l62 27 548 3 547 3 0 289 0 290 -678 0 -678 0 -74 -36z" />
            <path d="M4740 4821 c-142 -46 -296 -152 -684 -470 -133 -109 -311 -251 -396 -315 l-155 -117 -80 -40 c-44 -21 -104 -44 -134 -49 l-54 -10 -368 0 -369 0 0 -295 0 -295 518 0 517 0 46 14 c147 45 254 121 810 578 227 186 408 317 512 372 l79 41 364 3 364 3 0 299 0 300 -457 -1 -458 0 -55 -18z" />
            <path d="M5064 3631 c-133 -48 -270 -148 -762 -554 -249 -205 -437 -346 -526 -394 l-71 -38 -600 -5 -600 -5 -3 -297 -2 -298 692 0 693 0 47 15 c142 43 311 156 627 420 452 377 559 458 703 530 l90 45 179 0 179 0 0 300 0 300 -297 0 -298 -1 -51 -18z" />
          </g>
        </svg>
      </div>

      <div className="wrap footer-container">
        {/* Main Content Grid */}
        <div className="footer-main">
          {/* Left Column: Big typography & mission */}
          <div className="footer-intro">
            <div className="footer-eyebrow-row">
              <span className="footer-eyebrow">ENTREPRENEURSHIP CELL &bull; RV UNIVERSITY</span>
            </div>
            <h2 className="footer-heading">
              <span>Let&apos;s build</span>
              <span className="footer-heading-gradient">what&apos;s next.</span>
            </h2>
            <p className="footer-tagline">
              Empowering the next generation of builders, thinkers, and venture creators at RV University.
            </p>
          </div>

          {/* Nav Links Column: Interactive Row Objects */}
          <div className="footer-nav-col" aria-label="Footer navigation">
            <span className="footer-col-label">EXPLORE</span>
            <div className="footer-row-group">
              {FOOTER_EXPLORE_LINKS.map((link) => (
                <a key={link.href} href={link.href} className="footer-interactive-row">
                  <span className="row-glow" aria-hidden="true" />
                  <span className="row-num">{link.num}</span>
                  <span className="row-label">{link.label}</span>
                  <span className="row-arrow" aria-hidden="true">→</span>
                </a>
              ))}
            </div>
          </div>

          {/* Socials Column: Interactive Row Objects */}
          <div className="footer-nav-col footer-follow-col" aria-label="Social media links">
            <span className="footer-col-label">FOLLOW</span>
            <div className="footer-row-group">
              {FOOTER_SOCIAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="footer-interactive-row"
                >
                  <span className="row-glow" aria-hidden="true" />
                  <span className="row-num">{link.num}</span>
                  <span className="row-label">{link.label}</span>
                  <span className="row-arrow" aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </div>

          {/* Contact Card Column: Fully Clickable Hero Card */}
          <div className="footer-contact-col">
            <span className="footer-col-label">START A CONVERSATION</span>
            <a
              className="footer-contact-hero-card"
              href="mailto:club_ecell@rvu.edu.in"
              onPointerMove={handleCardPointerMove}
              aria-label="Send email to club_ecell@rvu.edu.in"
            >
              {/* Interactive cursor-following glow highlight */}
              <span className="contact-cursor-glow" aria-hidden="true" />
              <span className="contact-ambient-spark" aria-hidden="true" />

              <div className="contact-card-mid">
                <span className="contact-card-email">club_ecell@rvu.edu.in</span>
                <span className="contact-card-arrow" aria-hidden="true">↗</span>
              </div>

              <div className="contact-card-bottom">
                <p className="contact-card-sub">
                  Have questions or want to partner?<br />
                  We&apos;d love to hear from you.
                </p>
              </div>
            </a>
          </div>
        </div>

        {/* Final Cinematic Giant Marquee in between content and bottom bar */}
        <div className="footer-giant-marquee-wrap" aria-hidden="true">
          <div className="footer-giant-marquee-track">
            <span>BUILD &bull; FAIL &bull; LEARN &bull; REPEAT &bull; SEE YOU IN THE NEXT CHAPTER &rarr; &bull;&nbsp;</span>
            <span>BUILD &bull; FAIL &bull; LEARN &bull; REPEAT &bull; SEE YOU IN THE NEXT CHAPTER &rarr; &bull;&nbsp;</span>
          </div>
        </div>

        {/* Bottom Bar: Cleanly separated 3-part layout */}
        <div className="footer-bottom-bar">
          <div className="footer-bottom-left">
            <div className="footer-copyright-block">
              <span className="footer-cr-main">&copy; {new Date().getFullYear()} ECELL&trade; RV UNIVERSITY</span>
              <span className="footer-cr-sub">ALL RIGHTS RESERVED.</span>
            </div>
          </div>

          <div className="footer-bottom-center">
            <span>
              Crafted with <span className="footer-heart">&hearts;</span> by ECell Tech Team
            </span>
          </div>

          <div className="footer-bottom-right">
            <button className="footer-top-btn" onClick={scrollToTop} type="button" aria-label="Back to top">
              <span>BACK TO TOP</span>
              <span className="footer-top-icon" aria-hidden="true">&uarr;</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
