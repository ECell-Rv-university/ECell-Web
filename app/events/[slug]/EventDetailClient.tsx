"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { EventDetailData } from "@/src/data/eventsData";
import InfiniteSpiral from "@/src/components/InfiniteSpiral/InfiniteSpiral";
import spiralImg1 from "@/src/assets/Argonyx26/inaugration/ing1.webp";
import spiralImg2 from "@/src/assets/Argonyx26/inaugration/eventLeads.webp";
import spiralImg3 from "@/src/assets/Argonyx26/coding-session-1/image.webp";
import spiralImg4 from "@/src/assets/Argonyx26/MentorsSessions/apoorv1.webp";
import spiralImg5 from "@/src/assets/Argonyx26/judges/image.png";
import spiralImg6 from "@/src/assets/Argonyx26/roun2/image.webp";
import spiralImg7 from "@/src/assets/Argonyx26/round2Walk/image.webp";
import spiralImg8 from "@/src/assets/Argonyx26/lunch/lunch1.webp";
import spiralImg9 from "@/src/assets/Argonyx26/opening/image.png";
import spiralImg10 from "@/src/assets/Argonyx26/inaugration/alok1.webp";
import spiralImg11 from "@/src/assets/Argonyx26/dinner/mingos1.webp";
import spiralImg12 from "@/src/assets/Argonyx26/judges/image copy.png";
import spiralImg13 from "@/src/assets/Argonyx26/opening/image copy.png";
import "./EventDetail.css";

const SPIRAL_GALLERY_IMAGES = [
  { src: spiralImg9, alt: "Registration & Opening Arrival" },
  { src: spiralImg1, alt: "Inauguration Keynote" },
  { src: spiralImg2, alt: "Event Leads on Stage" },
  { src: spiralImg3, alt: "Teams Coding Sprint" },
  { src: spiralImg4, alt: "Mentor Review Session" },
  { src: spiralImg5, alt: "Judging Panel & Evaluations" },
  { src: spiralImg12, alt: "Jury Discussion & Defense" },
  { src: spiralImg6, alt: "Round 2 Final Pitches" },
  { src: spiralImg7, alt: "Demo Walkthrough" },
  { src: spiralImg8, alt: "Lunch Break" },
  { src: spiralImg13, alt: "Welcome Desk & Participants" },
  { src: spiralImg10, alt: "Alok Murali Speaking" },
  { src: spiralImg11, alt: "Celebration Dinner" },
];

interface EventDetailClientProps {
  event: EventDetailData;
}

export default function EventDetailClient({ event }: EventDetailClientProps): React.ReactElement {
  const [activeWinnerIndex, setActiveWinnerIndex] = useState<number>(0);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const winnersList = event.winners || [];
  const safeWinnerIndex = activeWinnerIndex >= winnersList.length ? 0 : activeWinnerIndex;
  const currentWinner = winnersList[safeWinnerIndex] || winnersList[0];

  const handlePrevWinner = useCallback(() => {
    if (winnersList.length === 0) return;
    setActiveWinnerIndex((prev) => (prev - 1 + winnersList.length) % winnersList.length);
  }, [winnersList.length]);

  const handleNextWinner = useCallback(() => {
    if (winnersList.length === 0) return;
    setActiveWinnerIndex((prev) => (prev + 1) % winnersList.length);
  }, [winnersList.length]);

  // Keyboard navigation for winners spotlight
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target;
      const isTyping =
        target instanceof HTMLElement &&
        (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
      if (isTyping) return;
      if (e.key === "ArrowLeft") handlePrevWinner();
      if (e.key === "ArrowRight") handleNextWinner();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrevWinner, handleNextWinner]);

  // Touch swipe support on winner card
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const diffX = touchStartXRef.current - e.changedTouches[0].clientX;
    const diffY = touchStartYRef.current - e.changedTouches[0].clientY;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX > 0) {
        handleNextWinner();
      } else {
        handlePrevWinner();
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  useEffect(() => {
    // Kill any lingering ScrollTriggers from previous routes to prevent layout clamping
    try {
      if (typeof window !== "undefined") {
        // @ts-expect-error ScrollTrigger may be on window or imported
        if (window.ScrollTrigger) window.ScrollTrigger.getAll().forEach((t: { kill: () => void }) => t.kill());
      }
    } catch {
      // ignore
    }

    // Force immediate instant scroll to top on navigation to ensure hero section is displayed
    const htmlEl = document.documentElement;
    const origScrollBehavior = htmlEl.style.scrollBehavior;
    htmlEl.style.scrollBehavior = "auto";
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    document.body.scrollTop = 0;
    htmlEl.scrollTop = 0;

    const frameId = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      document.body.scrollTop = 0;
      htmlEl.scrollTop = 0;
    });

    const timerId = window.setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      document.body.scrollTop = 0;
      htmlEl.scrollTop = 0;
      htmlEl.style.scrollBehavior = origScrollBehavior;
    }, 120);

    const handleAnchorClick = (e: MouseEvent) => {
      const link = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      const href = link?.getAttribute("href");

      if (!href || href === "#") return;

      const target = document.querySelector<HTMLElement>(href);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      target.tabIndex = -1;
      target.focus({ preventScroll: true });
    };

    document.addEventListener("click", handleAnchorClick);
    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(timerId);
      htmlEl.style.scrollBehavior = origScrollBehavior;
      document.removeEventListener("click", handleAnchorClick);
    };
  }, [event.slug]);

  return (
    <div className="event-detail-page">
      <header className="topbar">
        <div className="topbar__inner">
          <Link className="topbar__mark" href="/events">
            <span className="arrow">←</span> BACK
          </Link>
          <nav className="topbar__nav">
            <a href="#about">About</a>
            <a href="#details">Details</a>
            {event.isCompleted ? (
              <>
                <a href="#winners">Winners</a>
                <a href="#gallery">View Images</a>
              </>
            ) : (
              <>
                <a href="#contact">Contact</a>
                <a className="topbar__cta" href="#register">
                  Register
                </a>
              </>
            )}
          </nav>
        </div>
      </header>

      <main>
        <section className="hero" id="top">
          <div className="hero__grid">
            <div className="hero__copy">
              <p className="eyebrow">
                <span className="eyebrow__rule" />
                {event.eyebrow}
              </p>

              <h1 className="hero__headline">
                {event.heroHeadline}
                <span className="hero__accent">{event.heroAccent}</span>
              </h1>

              <p className="hero__body">{event.heroBody}</p>

              <div className="hero__actions">
                {event.isCompleted ? (
                  <>
                    <a className="btn btn--solid" href="#gallery">
                      View Images
                    </a>
                    <a className="btn btn--ghost" href="#winners">
                      View Winners
                    </a>
                  </>
                ) : (
                  <>
                    <a className="btn btn--solid" href="#register">
                      Register now
                    </a>
                    <a className="btn btn--ghost" href="#about">
                      What to expect ↓
                    </a>
                  </>
                )}
              </div>
            </div>

            <a
              className={`event-card ${event.isCompleted ? "event-card--completed" : ""}`}
              href={event.isCompleted ? "#winners" : "#register"}
              aria-label={
                event.isCompleted
                  ? `View winners for ${event.title}`
                  : `Register for ${event.title}`
              }
            >
              <div className="event-card__media">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  priority
                  sizes="(max-width: 860px) 100vw, 40vw"
                />
                {event.isCompleted && (
                  <span className="event-card__badge-completed">
                    CLOSED / COMPLETED
                  </span>
                )}
              </div>

              <div className="event-card__foot">
                <div>
                  <p className="event-card__title">{event.title}</p>
                  <p className="event-card__meta">{event.dateBadge}</p>
                </div>

                <span className="event-card__arrow" aria-hidden="true">
                  {event.isCompleted ? "↓" : "↗"}
                </span>
              </div>
            </a>
          </div>
        </section>

        <section className="about" id="about">
          <div className="about__inner">
            <p className="eyebrow">
              <span className="eyebrow__rule" />
              {event.aboutEyebrow}
            </p>

            <div className="about__grid">
              <h2 className="about__headline">
                {event.aboutHeadline}
                <span className="hero__accent">{event.aboutHeadlineAccent}</span>
              </h2>

              <div className="about__text">
                <p>{event.aboutDescription}</p>

                {event.aboutNote && <p className="muted">{event.aboutNote}</p>}
              </div>
            </div>
          </div>
        </section>

        <section className="ledger" id="details">
          <p className="eyebrow">
            <span className="eyebrow__rule" />
            The details
          </p>

          <dl className="ledger__list">
            {event.ledger.map((item) => (
              <div className="ledger__row" key={item.number}>
                <dt>{item.number}</dt>
                <dd className="ledger__label">{item.label}</dd>
                <dd className="ledger__value">{item.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="organizers" id="organizers">
          <p className="eyebrow">
            <span className="eyebrow__rule" />
            Hosted by
          </p>

          <ul className="organizers__list">
            {event.organizers.map((org) => (
              <li key={org}>{org}</li>
            ))}
          </ul>
        </section>

        {event.isCompleted ? (
          <section className="winners-section" id="winners">
            <div className="winners-section__inner">
              <div className="winners-section__top">
                <div className="winners-section__head">
                  <p className="eyebrow eyebrow--gold">
                    <span className="eyebrow__rule eyebrow__rule--gold" />
                    Results &amp; Hall of Fame
                  </p>

                  <h2 className="winners-section__headline">
                    {event.winnersHeadline || "Champions of"}
                    <span className="hero__accent">
                      {event.winnersAccent || " Argonyx '26."}
                    </span>
                  </h2>
                  <p className="winners-section__subhead">
                    {event.winnersSubhead ||
                      "Honoring the builders and visionary teams who shipped real working solutions in 24 continuous hours."}
                  </p>
                </div>

                {/* Nav controls: Counter, Tabs, Arrows (like Previous Speakers) */}
                {winnersList.length > 0 && (
                  <div className="winners-nav-controls">
                    <div className="winners-counter">
                      <strong>{String(safeWinnerIndex + 1).padStart(2, "0")}</strong>
                      <span>/</span>
                      <span>{String(winnersList.length).padStart(2, "0")}</span>
                    </div>

                    <div className="winners-tabs" role="tablist" aria-label="Winner navigation">
                      {winnersList.map((winner, idx) => (
                        <button
                          key={winner.place}
                          type="button"
                          role="tab"
                          aria-selected={idx === safeWinnerIndex}
                          className={`winners-tab-btn ${idx === safeWinnerIndex ? "is-active" : ""}`}
                          onClick={() => setActiveWinnerIndex(idx)}
                        >
                          {winner.place}
                        </button>
                      ))}
                    </div>

                    <div className="winners-arrows">
                      <button
                        type="button"
                        className="winners-arrow-btn"
                        onClick={handlePrevWinner}
                        aria-label="Previous winner"
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        className="winners-arrow-btn"
                        onClick={handleNextWinner}
                        aria-label="Next winner"
                      >
                        →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Single Rectangular Spotlight Box (One at a time) */}
              {currentWinner && (
                <div
                  className="winner-spotlight-shell"
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  <article
                    className={`winner-spotlight-box winner-spotlight-box--${
                      safeWinnerIndex === 0
                        ? "first"
                        : safeWinnerIndex === 1
                        ? "second"
                        : "third"
                    }`}
                    key={currentWinner.place}
                  >
                    {/* Left Side: Rectangular Photo Space */}
                    <div className="winner-spotlight__photo-space">
                      {currentWinner.photo ? (
                        <Image
                          src={currentWinner.photo}
                          alt={currentWinner.photoCaption || `${currentWinner.teamName} Team Photo`}
                          fill
                          sizes="(max-width: 860px) 100vw, 55vw"
                          className="winner-photo-slot__image"
                        />
                      ) : (
                      <div className="winner-photo-slot">
                        <div
                          className="winner-photo-slot__icon"
                          aria-hidden="true"
                        >
                          <svg
                            width="36"
                            height="36"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect
                              x="3"
                              y="3"
                              width="18"
                              height="18"
                              rx="2"
                              ry="2"
                            />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                          </svg>
                        </div>
                        <span className="winner-photo-slot__label">
                          {currentWinner.photoCaption || "Team Photo Space"}
                        </span>
                        <span className="winner-photo-slot__tag">
                          PHOTO SPACE RESERVED
                        </span>
                      </div>
                      )}
                    </div>

                    {/* Right Side: Winner Information */}
                    <div className="winner-spotlight__details">
                      <div className="winner-spotlight__meta-row">
                        {currentWinner.badge && (
                          <span className="winner-spotlight__badge-title">
                            {currentWinner.badge}
                          </span>
                        )}
                      </div>

                      <h3 className="winner-spotlight__team-name">
                        {currentWinner.teamName}
                      </h3>

                      <p className="winner-spotlight__project-name">
                        {currentWinner.projectTitle}
                      </p>

                      {currentWinner.description && (
                        <p className="winner-spotlight__desc">
                          {currentWinner.description}
                        </p>
                      )}

                      <div className="winner-spotlight__footer-badges">
                        <span className="winner-spotlight__foot-pill">
                          ARGONYX '26
                        </span>
                        <span className="winner-spotlight__foot-pill">
                          24-HR NATIONAL HACKATHON
                        </span>
                      </div>
                    </div>
                  </article>
                </div>
              )}
            </div>
          </section>
        ) : (
          <section className="register" id="register">
            <p className="eyebrow eyebrow--onwhite">
              <span className="eyebrow__rule" />
              Ready to participate
            </p>

            <h2 className="register__headline">
              {event.registrationHeadline}
              <br />
              <span className="hero__accent hero__accent--onwhite">
                {event.registrationAccent}
              </span>
            </h2>

            <a
              className="btn btn--invert"
              href={event.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {event.registrationCtaText}
            </a>

            <p className="register__hint">{event.registrationHint}</p>
          </section>
        )}

        {event.isCompleted ? (
          <section className="event-gallery" id="gallery">
            <div className="event-gallery__inner">
              <div className="event-gallery__header">
                <div className="event-gallery__title-wrap">
                  <p className="eyebrow">
                    <span className="eyebrow__rule" />
                    Captured Moments · Argonyx '26
                  </p>
                  <h2 className="event-gallery__headline">
                    {event.galleryHeadline || "View Images"}
                    <span className="hero__accent">
                      {event.galleryAccent || " Moments from the floor."}
                    </span>
                  </h2>
                  <p className="event-gallery__subhead">
                    {event.gallerySubhead ||
                      "Highlights from the 24-hour sprint — from opening keynotes and midnight builds to jury defenses and the podium ceremony."}
                  </p>
                </div>
              </div>

              {/* 3D InfiniteSpiral Gallery Stage with centered View Images button */}
              <div className="spiral-gallery-wrapper">
                <InfiniteSpiral
                  items={SPIRAL_GALLERY_IMAGES}
                  animationMode="all"
                  speed={0.55}
                  radius={220}
                  cardWidth={160}
                  cardHeight={120}
                  verticalSpacing={70}
                  perspective={1000}
                  cardRadius={8}
                  centerScale={1.25}
                  edgeBlur={5}
                  cardsPerTurn={8}
                  pauseOnHover
                />

                {/* View Images button at the middle of this section */}
                <div className="spiral-center-action">
                  <Link
                    href={`/events/${event.slug}/gallery`}
                    className="btn btn--solid spiral-view-btn"
                    aria-label="View Images Gallery"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"
                      />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <span>View Images</span>
                    <span className="spiral-view-btn__arrow">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="contact" id="contact">
            <p className="eyebrow">
              <span className="eyebrow__rule" />
              For further queries, contact
            </p>

            <ul className="contact__list">
              {event.contacts.map((contact) => (
                <li key={contact.name}>
                  <span className="contact__name">{contact.name}</span>
                  <a
                    className="contact__phone"
                    href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                  >
                    {contact.phone}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      <footer className="footer">
        <span>{event.title} · RV University, Bengaluru</span>
        {event.isCompleted ? (
          <a href="#gallery">View Images →</a>
        ) : (
          <a href="#register">Register →</a>
        )}
      </footer>
    </div>
  );
}
