import React from "react";
import Image from "next/image";
import type { EventDetailData } from "@/src/content/events";

export default function EventHero({ event }: { event: EventDetailData }): React.ReactElement {
  const hasWinners = Boolean(event.winners);
  const completedTarget = hasWinners ? "#winners" : "#about";

  return (
    <section className="hero" id="top">
      <div className="hero__grid">
        <div className="hero__copy">
          <p className="eyebrow">
            <span className="eyebrow__rule" />
            {event.hero.eyebrow}
          </p>

          <h1 className="hero__headline">
            {event.hero.headline}
            <span className="hero__accent">{event.hero.accent}</span>
          </h1>

          <p className="hero__body">{event.hero.body}</p>

          <div className="hero__actions">
            {event.isCompleted ? (
              <>
                <a className="btn btn--solid" href="#gallery">
                  View Images
                </a>
                {hasWinners && (
                  <a className="btn btn--ghost" href="#winners">
                    View Winners
                  </a>
                )}
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
          href={event.isCompleted ? completedTarget : "#register"}
          aria-label={
            event.isCompleted
              ? hasWinners
                ? `View winners for ${event.title}`
                : `About ${event.title}`
              : `Register for ${event.title}`
          }
        >
          <div
            className="event-card__media"
            style={
              event.imageIsPoster
                ? { aspectRatio: `${event.image.width} / ${event.image.height}` }
                : undefined
            }
          >
            <Image
              src={event.image}
              alt={event.title}
              fill
              preload
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
  );
}