"use client";

import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "@/src/utils/gsapSetup";
import talkStartupWithMe from "../assets/events/events_photo/TalkStartupWithMe.webp";
import winterTechTalk from "../assets/events/events_photo/WinterTechTalk.webp";
import argonyx from "../assets/events/events_photo/argonyx.webp";
import argonyx2 from "../assets/events/events_photo/argoynx2.webp";
import "./EventsArchive.css";

/* =====================================================
   DATA
===================================================== */

type EventType = "Hackathons" | "Talks" | "Competitions";

interface EventItem {
  date: string;
  month: string;
  type: EventType;
  title: string;
  description: string;
  image: StaticImageData;
  status: "UPCOMING" | "ARCHIVE";
}

const EVENTS: EventItem[] = [
  {
    date: "18",
    month: "SEP 2026",
    type: "Hackathons",
    title: "Argonyx 2.0",
    description:
      "Build, break and reimagine. A hands-on challenge for ambitious builders.",
    image: argonyx2,
    status: "UPCOMING",
  },
  {
    date: "TBA",
    month: "DATE TBA",
    type: "Competitions",
    title: "Pitch-e-thon",
    description:
      "Pitch your idea, get real feedback, and take your next step as a builder.",
    image: argonyx,
    status: "UPCOMING",
  },
  {
    date: "TBA",
    month: "DATE TBA",
    type: "Talks",
    title: "E-Summit",
    description:
      "A flagship gathering for ideas, founders, and the people building what comes next.",
    image: argonyx,
    status: "UPCOMING",
  },
  {
    date: "TBA",
    month: "SEP 2025",
    type: "Hackathons",
    title: "Argonyx Hackathon",
    description:
      "A hands-on hackathon for ambitious builders and bold ideas.",
    image: argonyx,
    status: "ARCHIVE",
  },
  {
    date: "TBA",
    month: "WINTER 2025",
    type: "Talks",
    title: "Winter Tech Talk",
    description:
      "Builders and operators unpack the technologies shaping what comes next.",
    image: winterTechTalk,
    status: "ARCHIVE",
  },
  {
    date: "TBA",
    month: "SPRING 2026",
    type: "Talks",
    title: "Talk Startup With Me",
    description:
      "From problem discovery to your first pitch — learn by building with people who have done it.",
    image: talkStartupWithMe,
    status: "ARCHIVE",
  },
];

const FILTERS = ["All", "Hackathons", "Talks", "Competitions"] as const;

/* =====================================================
   HELPERS
===================================================== */

function formatEventDate(event: EventItem): string {
  if (event.date === "TBA") return "DATE TBA";
  const month = event.month.replace(/\s*\d{4}$/, "");
  return `${event.date} ${month}`;
}

function formatCardDate(event: EventItem): { day: string; month: string } {
  if (event.date === "TBA") {
    return { day: "TBA", month: "" };
  }
  const month = event.month.replace(/\s*\d{4}$/, "");
  return { day: event.date, month };
}

/* =====================================================
   STRUCTURED DATA (JSON-LD)
===================================================== */

function buildStructuredData(upcoming: EventItem[]) {
  return {
    "@context": "https://schema.org",
    "@graph": upcoming.map((event) => ({
      "@type": "Event",
      name: event.title,
      description: event.description,
      eventStatus:
        event.status === "UPCOMING"
          ? "https://schema.org/EventScheduled"
          : "https://schema.org/EventArchived",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      organizer: {
        "@type": "Organization",
        name: "ECell RV University",
        url: "https://ecell-rvu.vercel.app",
      },
      location: {
        "@type": "Place",
        name: "RV University",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Bengaluru",
          addressRegion: "Karnataka",
          addressCountry: "IN",
        },
      },
      ...(event.date !== "TBA"
        ? {
            startDate: `2026-${event.month.includes("SEP") ? "09" : "01"}-${String(event.date).padStart(2, "0")}`,
          }
        : {}),
    })),
  };
}

/* =====================================================
   COMPONENT
===================================================== */

export default function EventsArchive(): React.ReactElement {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [selectedDate, setSelectedDate] = useState(0);

  const heroRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const archiveRef = useRef<HTMLDivElement>(null);

  const upcomingEvents = useMemo(
    () => EVENTS.filter((e) => e.status === "UPCOMING"),
    [],
  );
  const archivedEvents = useMemo(
    () => EVENTS.filter((e) => e.status === "ARCHIVE"),
    [],
  );
  const featuredEvent = upcomingEvents[0];

  const visibleEvents = useMemo(() => {
    const base =
      filter === "All" ? upcomingEvents : upcomingEvents.filter((e) => e.type === filter);
    return base;
  }, [filter, upcomingEvents]);

  /* --- Scroll to events grid when "VIEW ALL" is clicked --- */
  const scrollToEvents = () => {
    const el = document.getElementById("events");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  /* --- GSAP entrance animations --- */
  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      /* Hero elements fade up */
      const heroEls = heroRef.current?.querySelectorAll(
        ".events-eyebrow, .events-hero h1, .events-hero-intro, .events-actions",
      );
      if (heroEls?.length) {
        gsap.fromTo(
          heroEls,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top 85%",
            },
          },
        );
      }

      /* Featured card fades in */
      const featureCard = heroRef.current?.querySelector(".events-feature");
      if (featureCard) {
        gsap.fromTo(
          featureCard,
          { opacity: 0, y: 40, rotate: 0 },
          {
            opacity: 1,
            y: 0,
            rotate: 1.5,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: featureCard,
              start: "top 88%",
            },
          },
        );
      }

      /* Calendar dates stagger in */
      const dateEls = calendarRef.current?.querySelectorAll(".events-date");
      if (dateEls?.length) {
        gsap.fromTo(
          dateEls,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: calendarRef.current,
              start: "top 80%",
            },
          },
        );
      }

      /* Event cards stagger in */
      const cardEls = cardsRef.current?.querySelectorAll(".events-card");
      if (cardEls?.length) {
        gsap.fromTo(
          cardEls,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 80%",
            },
          },
        );
      }

      /* Archive rows stagger in */
      const archiveEls = archiveRef.current?.querySelectorAll(
        ".events-archive-row",
      );
      if (archiveEls?.length) {
        gsap.fromTo(
          archiveEls,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.06,
            ease: "power2.out",
            scrollTrigger: {
              trigger: archiveRef.current,
              start: "top 82%",
            },
          },
        );
      }
    });

    return () => ctx.revert();
  }, []);

  const jsonLd = useMemo(() => buildStructuredData(upcomingEvents), [upcomingEvents]);

  return (
    <main className="events-page">
      {/* Structured data for Google rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ---- HERO ---- */}
      <section className="events-hero" ref={heroRef}>
        <div className="events-hero-copy">
          <p className="events-eyebrow">
            <span /> EVENTS &amp; WORKSHOPS
          </p>
          <h1>
            Where
            <br />
            ideas <em>get moving.</em>
          </h1>
          <p className="events-hero-intro">
            Talks, workshops, hackathons and founder sessions for people who
            want to build something real. Pick an event, bring a question, and
            leave with something started.
          </p>
          <div className="events-actions">
            <a className="events-button events-button--primary" href="#events">
              EXPLORE EVENTS <span>→</span>
            </a>
            <a className="events-button" href="#calendar">
              BROWSE CALENDAR <span>↓</span>
            </a>
          </div>
        </div>

        <div className="events-feature-wrap">
          <article className="events-feature">
            <div className="events-feature-art" style={{ position: "relative" }}>
              <Image
                src={featuredEvent.image}
                alt={featuredEvent.title}
                fill
                sizes="(max-width: 900px) 88vw, 40vw"
                quality={85}
                priority
                loading="eager"
              />
              <span>
                UPCOMING · {featuredEvent.type.toUpperCase()}
              </span>
              <strong>
                {featuredEvent.title.split(" ").slice(0, -1).join(" ") || featuredEvent.title}
                <br />
                <em>{featuredEvent.title.split(" ").slice(-1)}</em>
              </strong>
            </div>
            <div className="events-feature-bottom">
              <div>
                <h2>{featuredEvent.title}</h2>
                <p>{formatEventDate(featuredEvent)} · RV UNIVERSITY, BENGALURU</p>
              </div>
              <b>↗</b>
            </div>
          </article>
        </div>
      </section>

      {/* ---- CONTENT ---- */}
      <section className="events-content" id="calendar">
        {/* Calendar */}
        <div className="events-section-head">
          <span>THE CALENDAR</span>
          <span>
            {upcomingEvents.length.toString().padStart(2, "0")} EVENTS
          </span>
        </div>
        <div className="events-calendar" ref={calendarRef}>
          <div className="events-calendar-track">
            {upcomingEvents.map((event, index) => (
              <button
                className={`events-date ${selectedDate === index ? "is-active" : ""}`}
                key={event.title}
                onClick={() => {
                  setSelectedDate(index);
                  setFilter("All");
                }}
                type="button"
              >
                <strong>{event.date === "TBA" ? "—" : event.date}</strong>
                <span>{event.month}</span>
                <i />
                <b>{event.title}</b>
              </button>
            ))}
          </div>
        </div>

        {/* Upcoming Events Grid */}
        <div className="events-section-head" id="events">
          <span>UPCOMING EVENTS</span>
          <button
            className="events-view-all-btn"
            type="button"
            onClick={scrollToEvents}
          >
            VIEW ALL →
          </button>
        </div>
        <div className="events-filters" aria-label="Filter events">
          {FILTERS.map((item) => (
            <button
              className={filter === item ? "is-active" : ""}
              key={item}
              onClick={() => setFilter(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
        <div className="events-grid" ref={cardsRef}>
          {visibleEvents.map((event) => {
            const { day, month } = formatCardDate(event);
            return (
              <article className="events-card" key={event.title}>
                <div
                  className="events-card-image"
                  style={{ position: "relative" }}
                >
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    sizes="(max-width: 700px) 90vw, 45vw"
                  />
                  <span>{event.type}</span>
                </div>
                <div className="events-card-info">
                  <div>
                    <h2>{event.title}</h2>
                    <p>{event.description}</p>
                  </div>
                  <time>
                    {day}
                    <br />
                    {month}
                  </time>
                </div>
              </article>
            );
          })}
        </div>

        {/* Archive */}
        <div className="events-archive" ref={archiveRef}>
          <div className="events-section-head">
            <span>PREVIOUS EVENTS</span>
            <span>
              {archivedEvents.length.toString().padStart(2, "0")} MOMENTS
            </span>
          </div>
          {archivedEvents.map((event, index) => (
            <div className="events-archive-row" key={event.title}>
              <span>0{index + 1}</span>
              <strong>{event.title}</strong>
              <small>{event.type}</small>
              <b>↗</b>
            </div>
          ))}
        </div>
      </section>

      {/* ---- FOOTER ---- */}
      <footer className="events-footer">
        <span>ECELL RV UNIVERSITY</span>
        <span>BUILD / FAIL / LEARN / REPEAT</span>
        <Link className="events-footer-home" href="/" aria-label="Back to homepage">
          ← HOME
        </Link>
      </footer>
    </main>
  );
}
