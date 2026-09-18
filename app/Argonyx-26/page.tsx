"use client";

import { useEffect } from "react";
import Image from "next/image";
import argonyx2 from "../../src/assets/events/events_photo/argonyx.webp";

const PAGE_STYLES = String.raw`
:root {
  --black: #111110;
  --panel: #1a1a19;
  --panel-2: #232322;
  --white: #f4f3ef;
  --gray: #9c9b96;
  --gray-dim: #6f6e6a;
  --line: rgba(244,243,239,.14);
  --font-sans: "Archivo", system-ui, sans-serif;
  --font-serif-italic: "Newsreader", Georgia, serif;
  --measure: 62ch;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: var(--black);
  color: var(--white);
  font-family: var(--font-sans);
  font-size: 17px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

a {
  color: inherit;
}

.eyebrow {
  display: flex;
  align-items: center;
  gap: .7rem;
  text-transform: uppercase;
  letter-spacing: .14em;
  font-size: .78rem;
  font-weight: 600;
  color: var(--gray);
  margin: 0 0 1.6rem;
}

.eyebrow__rule {
  width: 1.6rem;
  height: 1px;
  background: var(--gray);
  display: inline-block;
}

.eyebrow--onwhite {
  color: rgba(17,17,16,.6);
}

.eyebrow--onwhite .eyebrow__rule {
  background: rgba(17,17,16,.6);
}

.hero__accent {
  font-family: var(--font-serif-italic);
  font-style: italic;
  font-weight: 400;
  color: var(--gray);
}

.hero__accent--onwhite {
  color: rgba(17,17,16,.55);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  text-decoration: none;
  font-weight: 600;
  font-size: .95rem;
  padding: .9rem 1.7rem;
  border-radius: 2px;
  transition:
    transform .15s ease,
    background .15s ease,
    color .15s ease,
    border-color .15s ease;
}

.btn--solid {
  background: var(--white);
  color: var(--black);
}

.btn--solid:hover,
.btn--solid:focus-visible,
.btn--invert:hover,
.btn--invert:focus-visible {
  transform: translateY(-2px);
}

.btn--ghost {
  color: var(--white);
  border: 1px solid var(--line);
}

.btn--ghost:hover,
.btn--ghost:focus-visible {
  border-color: var(--white);
}

.btn--invert {
  background: var(--black);
  color: var(--white);
  border: 1px solid var(--black);
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 20;
  background: rgba(17,17,16,.86);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--line);
}

.topbar__inner {
  max-width: 1180px;
  margin: 0 auto;
  padding: 1.1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.topbar__mark {
  text-decoration: none;
  font-weight: 800;
  letter-spacing: -.01em;
  font-size: .98rem;
  display: inline-flex;
  align-items: center;
  gap: .5rem;
}

.topbar__mark .arrow,
.topbar__mark em {
  color: var(--gray);
}

.topbar__mark .arrow {
  font-weight: 400;
}

.topbar__mark em {
  font-style: normal;
}

.topbar__nav {
  display: flex;
  align-items: center;
  gap: 1.8rem;
  font-size: .88rem;
  font-weight: 500;
}

.topbar__nav a {
  color: var(--gray);
  text-decoration: none;
  transition: color .15s ease;
}

.topbar__nav a:hover,
.topbar__nav a:focus-visible {
  color: var(--white);
}

.topbar__cta {
  color: var(--white) !important;
  border: 1px solid var(--line);
  padding: .5rem 1.1rem;
  border-radius: 2px;
}

.topbar__cta:hover,
.topbar__cta:focus-visible {
  border-color: var(--white);
}

.hero {
  padding: 5.5rem 1.5rem 6rem;
}

.hero__grid {
  max-width: 1180px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.15fr .85fr;
  gap: 4.5rem;
  align-items: center;
}

.hero__headline {
  margin: 0 0 1.8rem;
  font-weight: 800;
  letter-spacing: -.02em;
  line-height: .98;
  font-size: clamp(2.6rem,1.6rem + 4.5vw,4.6rem);
}

.hero__body {
  max-width: 40rem;
  color: var(--gray);
  font-size: 1.05rem;
  margin: 0 0 2.4rem;
}

.hero__actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.event-card {
  display: block;
  text-decoration: none;
  color: inherit;
  border: 1px solid var(--line);
  border-radius: 4px;
  overflow: hidden;
  background: var(--panel);
  transition: border-color .15s ease, transform .15s ease;
}

.event-card:hover,
.event-card:focus-visible {
  border-color: var(--gray);
  transform: translateY(-3px);
}

.event-card__media {
  position: relative;
  aspect-ratio: 4 / 3;
  background: var(--panel-2);
  overflow: hidden;
}

.event-card__media img {
  object-fit: cover;
}

.event-card__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.2rem 1.3rem;
  border-top: 1px solid var(--line);
}

.event-card__title {
  margin: 0 0 .25rem;
  font-weight: 700;
  font-size: 1.05rem;
}

.event-card__meta {
  margin: 0;
  font-size: .76rem;
  letter-spacing: .06em;
  color: var(--gray-dim);
  text-transform: uppercase;
}

.event-card__arrow {
  font-size: 1.2rem;
  color: var(--gray);
  transition: transform .15s ease, color .15s ease;
}

.event-card:hover .event-card__arrow,
.event-card:focus-visible .event-card__arrow {
  transform: translate(2px,-2px);
  color: var(--white);
}

.about {
  padding: 6rem 1.5rem;
  border-top: 1px solid var(--line);
  max-width: 1180px;
  margin: 0 auto;
}

.about__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

.about__headline {
  margin: 0;
  font-weight: 800;
  letter-spacing: -.02em;
  line-height: 1.05;
  font-size: clamp(1.9rem,1.4rem + 2vw,2.8rem);
}

.about__text p {
  margin: 0 0 1.1rem;
  max-width: var(--measure);
}

.about__text .muted {
  color: var(--gray);
  font-size: .92rem;
  border-left: 2px solid var(--line);
  padding-left: .9rem;
}

.ledger {
  background: var(--panel);
  padding: 6rem 1.5rem;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}

.ledger__list {
  max-width: 860px;
  margin: 0 auto;
}

.ledger__row {
  display: grid;
  grid-template-columns: 2.5rem 9rem 1fr;
  align-items: baseline;
  gap: 1.5rem;
  padding: 1.3rem 0;
  border-bottom: 1px solid var(--line);
}

.ledger__row:last-child {
  border-bottom: none;
}

.ledger__row dt {
  margin: 0;
  font-size: .8rem;
  color: var(--gray-dim);
  font-variant-numeric: tabular-nums;
}

.ledger__label {
  margin: 0;
  color: var(--gray);
  font-size: .92rem;
}

.ledger__value {
  margin: 0;
  font-weight: 600;
  font-size: 1.15rem;
  text-align: right;
}

.organizers {
  padding: 6rem 1.5rem;
  max-width: 1180px;
  margin: 0 auto;
}

.organizers__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: .9rem 1.1rem;
}

.organizers__list li {
  border: 1px solid var(--line);
  border-radius: 2px;
  padding: .7rem 1.2rem;
  font-size: .95rem;
  color: var(--white);
}

.register {
  background: var(--white);
  color: var(--black);
  padding: 7rem 1.5rem;
  text-align: center;
}

.register__headline {
  margin: 0 auto 2.4rem;
  max-width: 34rem;
  font-weight: 800;
  letter-spacing: -.02em;
  line-height: 1.05;
  font-size: clamp(2.1rem,1.6rem + 2.4vw,3.2rem);
}

.register .eyebrow {
  justify-content: center;
}

.register__hint {
  margin-top: 1.1rem;
  font-size: .82rem;
  color: rgba(17,17,16,.55);
  min-height: 1.2em;
}

.contact {
  padding: 6rem 1.5rem 7rem;
  max-width: 760px;
  margin: 0 auto;
}

.contact__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 1px;
  background: var(--line);
  border: 1px solid var(--line);
}

.contact__list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1.1rem 1.4rem;
  background: var(--panel);
  flex-wrap: wrap;
}

.contact__name {
  color: var(--white);
  font-weight: 500;
}

.contact__phone {
  color: var(--gray);
  text-decoration: none;
  font-weight: 600;
  transition: color .15s ease;
}

.contact__phone:hover,
.contact__phone:focus-visible {
  color: var(--white);
}

.footer {
  border-top: 1px solid var(--line);
  padding: 1.7rem 1.5rem;
  max-width: 1180px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: .6rem;
  color: var(--gray);
  font-size: .88rem;
}

.footer a {
  color: var(--white);
  text-decoration: none;
  font-weight: 600;
}

a:focus-visible,
button:focus-visible {
  outline: 2px solid var(--white);
  outline-offset: 2px;
}

@media (max-width: 860px) {
  .hero__grid,
  .about__grid {
    grid-template-columns: 1fr;
  }

  .event-card {
    max-width: 26rem;
  }
}

@media (max-width: 640px) {
  .topbar__nav {
    gap: 1rem;
  }

  .topbar__nav a:not(.topbar__cta) {
    display: none;
  }

  .ledger__row {
    grid-template-columns: 2rem 1fr;
    row-gap: .2rem;
  }

  .ledger__value {
    grid-column: 2 / 3;
    text-align: left;
  }

  .contact__list li {
    justify-content: flex-start;
  }
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  * {
    animation-duration: .01ms !important;
    transition-duration: .01ms !important;
  }
}
`;

const REGISTRATION_URL =
  "https://unstop.com/hackathons/argonyx26-rv-university-1748836";

export default function Argonyx26Page() {
  useEffect(() => {
    const handleAnchorClick = (event: MouseEvent) => {
      const link = (event.target as Element).closest<HTMLAnchorElement>(
        'a[href^="#"]',
      );

      const href = link?.getAttribute("href");

      if (!href || href === "#") return;

      const target = document.querySelector<HTMLElement>(href);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      target.tabIndex = -1;

      target.focus({
        preventScroll: true,
      });
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);

  return (
    <>
      <style>{PAGE_STYLES}</style>
      <header className="topbar">
        <div className="topbar__inner">
          <a className="topbar__mark" href="/events">
            <span className="arrow">←</span> BACK
          </a>

          <nav className="topbar__nav">
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
                24-Hour National Hackathon
              </p>

              <h1 className="hero__headline">
                Build
                <br />
                something
                <span className="hero__accent"> that ships.</span>
              </h1>

              <p className="hero__body">
                One venue, one clock, twenty-four hours. Pick a problem worth
                solving, build a real working solution, and pitch it to judges
                who care about execution — not just slides. Run by VIKSHA, The
                Entrepreneurship Cell, and IEEE at RV University.
              </p>

              <div className="hero__actions">
                <a className="btn btn--solid" href="#register">
                  Register your team
                </a>

                <a className="btn btn--ghost" href="#about">
                  What to expect ↓
                </a>
              </div>
            </div>

            <a
              className="event-card"
              href="#register"
              aria-label="Register for ARGONYX '26"
            >
              <div className="event-card__media">
                <Image
                  src={argonyx2}
                  alt="ARGONYX '26"
                  fill
                  priority
                  sizes="(max-width: 860px) 100vw, 40vw"
                />
              </div>

              <div className="event-card__foot">
                <div>
                  <p className="event-card__title">ARGONYX &apos;26</p>

                  <p className="event-card__meta">
                    25–26 SEP · RV UNIVERSITY, BENGALURU
                  </p>
                </div>

                <span className="event-card__arrow">↗</span>
              </div>
            </a>
          </div>
        </section>

        <section className="about" id="about">
          <p className="eyebrow">
            <span className="eyebrow__rule" />
            What is Argonyx
          </p>

          <div className="about__grid">
            <h2 className="about__headline">
              Not another
              <span className="hero__accent"> idea deck.</span>
            </h2>

            <div className="about__text">
              <p>
                ARGONYX is a 24-hour national hackathon hosted at RV University,
                Bengaluru — one continuous build, start to finish. No slow-burn
                rounds spread across weeks; you show up, you build, and a day
                later you&apos;re defending what you shipped in front of a panel.
              </p>

              <p className="muted">
                Track details, eligibility, and team size are confirmed on the
                official registration page — check there before you lock your
                team.
              </p>
            </div>
          </div>
        </section>

        <section className="ledger" id="details">
          <p className="eyebrow">
            <span className="eyebrow__rule" />
            The details
          </p>

          <dl className="ledger__list">
            <div className="ledger__row">
              <dt>01</dt>
              <dd className="ledger__label">Format</dd>
              <dd className="ledger__value">
                24-hour national hackathon — build, then pitch
              </dd>
            </div>

            <div className="ledger__row">
              <dt>02</dt>
              <dd className="ledger__label">Dates</dd>
              <dd className="ledger__value">25–26 September 2026</dd>
            </div>

            <div className="ledger__row">
              <dt>03</dt>
              <dd className="ledger__label">Venue</dd>
              <dd className="ledger__value">RV University, Bengaluru</dd>
            </div>

            <div className="ledger__row">
              <dt>04</dt>
              <dd className="ledger__label">Prize pool</dd>
              <dd className="ledger__value">Upto ₹30,000</dd>
            </div>
          </dl>
        </section>

        <section className="organizers" id="organizers">
          <p className="eyebrow">
            <span className="eyebrow__rule" />
            Hosted by
          </p>

          <ul className="organizers__list">
            <li>RV University</li>
            <li>VIKSHA</li>
            <li>The Entrepreneurship Cell, RV University</li>
            <li>IEEE RV University</li>
          </ul>
        </section>

        <section className="register" id="register">
          <p className="eyebrow eyebrow--onwhite">
            <span className="eyebrow__rule" />
            Ready to build
          </p>

          <h2 className="register__headline">
            Bring a team.
            <br />
            <span className="hero__accent hero__accent--onwhite">
              Leave with a build.
            </span>
          </h2>

          <a
            className="btn btn--invert"
            href={REGISTRATION_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Register on Unstop ↗
          </a>

          <p className="register__hint">
            Opens the official registration page in a new tab.
          </p>
        </section>

        <section className="contact" id="contact">
          <p className="eyebrow">
            <span className="eyebrow__rule" />
            For further queries, contact
          </p>

          <ul className="contact__list">
            <li>
              <span className="contact__name">Alok Murali</span>

              <a className="contact__phone" href="tel:+919611083196">
                +91 96110 83196
              </a>
            </li>

            <li>
              <span className="contact__name">Ayush S Kulkarni</span>

              <a className="contact__phone" href="tel:+918660697430">
                +91 86606 97430
              </a>
            </li>

            <li>
              <span className="contact__name">Kushal Kuladeepa S N</span>

              <a className="contact__phone" href="tel:+918073288190">
                +91 80732 88190
              </a>
            </li>
          </ul>
        </section>
      </main>

      <footer className="footer">
        <span>ARGONYX &apos;26 · RV University, Bengaluru</span>

        <a href="#register">Register →</a>
      </footer>
    </>
  );
}
