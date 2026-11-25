"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import type { EventDetailData } from "@/src/content/events";
import { scrollToElement } from "@/src/utils/lenis";
import EventAbout from "./_components/EventAbout";
import EventContacts from "./_components/EventContacts";
import EventDetails from "./_components/EventDetails";
import EventGallery from "./_components/EventGallery";
import EventHero from "./_components/EventHero";
import EventRegister from "./_components/EventRegister";
import EventRounds from "./_components/EventRounds";
import EventSponsors from "./_components/EventSponsors";
import EventWinners from "./_components/EventWinners";
import "./EventDetail.css";
import SiteCredit from "@/src/components/SiteCredit/SiteCredit";

interface EventDetailClientProps {
  event: EventDetailData;
}

export default function EventDetailClient({ event }: EventDetailClientProps): React.ReactElement {
  const { rounds, sponsors, winners } = event;
  const hasWinners = Boolean(winners && winners.items.length > 0);

  useEffect(() => {
    // Scroll reset on navigation is owned by RouteScrollManager. The three-wave
    // reset that used to live here (sync + rAF + a 120 ms timer, each also
    // toggling html.style.scrollBehavior) raced it and cancelled in-page anchor
    // scrolls that happened during the first 120 ms after mount.

    const handleAnchorClick = (e: MouseEvent) => {
      const link = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
      const href = link?.getAttribute("href");

      if (!href || href === "#") return;

      const target = document.querySelector<HTMLElement>(href);
      if (!target) return;

      e.preventDefault();
      scrollToElement(target);

      target.tabIndex = -1;
      target.focus({ preventScroll: true });
    };

    document.addEventListener("click", handleAnchorClick);
    return () => {
      document.removeEventListener("click", handleAnchorClick);
    };
  }, [event.slug]);

  return (
    <div className={`event-detail-page${event.isCompleted ? " event-detail-page--completed" : ""}`}>
      <header className="topbar">
        <div className="topbar__inner">
          <Link className="topbar__mark" href="/events">
            <span className="arrow">←</span> BACK
          </Link>
          <nav className="topbar__nav">
            <a href="#about">About</a>
            {rounds && <a href="#rounds">Rounds</a>}
            <a href="#details">Details</a>
            {sponsors && <a href="#sponsors">Sponsors</a>}
            {event.isCompleted ? (
              <>
                {hasWinners && <a href="#winners">Winners</a>}
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
        <EventHero event={event} />

        <EventAbout about={event.about} />

        {rounds && rounds.items.length > 0 && <EventRounds rounds={rounds} />}

        <EventDetails event={event} />

        {hasWinners ? (
          <EventWinners winners={winners} />
        ) : (
          !event.isCompleted && <EventRegister registration={event.registration} />
        )}

        {sponsors && sponsors.list.length > 0 && <EventSponsors sponsors={sponsors} />}

        {event.isCompleted ? (
          <EventGallery gallery={event.gallery} />
        ) : (
          <EventContacts contacts={event.contacts} />
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

      <SiteCredit />
    </div>
  );
}