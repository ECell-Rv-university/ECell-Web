"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { EventDetailData } from "@/src/data/eventsData";
import "./EventDetail.css";

interface EventDetailClientProps {
  event: EventDetailData;
}

export default function EventDetailClient({ event }: EventDetailClientProps): React.ReactElement {
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
            <a href="#contact">Contact</a>
            <a className="topbar__cta" href="#register">
              Register
            </a>
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
                <a className="btn btn--solid" href="#register">
                  Register now
                </a>

                <a className="btn btn--ghost" href="#about">
                  What to expect ↓
                </a>
              </div>
            </div>

            <a className="event-card" href="#register" aria-label={`Register for ${event.title}`}>
              <div className="event-card__media">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  priority
                  sizes="(max-width: 860px) 100vw, 40vw"
                />
              </div>

              <div className="event-card__foot">
                <div>
                  <p className="event-card__title">{event.title}</p>
                  <p className="event-card__meta">{event.dateBadge}</p>
                </div>

                <span className="event-card__arrow" aria-hidden="true">
                  ↗
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

        <section className="contact" id="contact">
          <p className="eyebrow">
            <span className="eyebrow__rule" />
            For further queries, contact
          </p>

          <ul className="contact__list">
            {event.contacts.map((contact) => (
              <li key={contact.name}>
                <span className="contact__name">{contact.name}</span>
                <a className="contact__phone" href={`tel:${contact.phone.replace(/\s+/g, "")}`}>
                  {contact.phone}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="footer">
        <span>{event.title} · RV University, Bengaluru</span>
        <a href="#register">Register →</a>
      </footer>
    </div>
  );
}
