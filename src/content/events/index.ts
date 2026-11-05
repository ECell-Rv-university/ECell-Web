import argonyxPhoto from "@/src/assets/events/argonyx-hackathon/photo.webp";
import argonyx26Photo from "@/src/assets/events/argonyx-26/photo.webp";
import argonyx26Poster from "@/src/assets/events/argonyx-26/poster.webp";
import hacktoberPoster from "@/src/assets/events/hacktoberfest-26/poster.png";
import talkStartupWithMePhoto from "@/src/assets/events/talk-startup-with-me/photo.webp";
import winterTechTalkPhoto from "@/src/assets/events/winter-tech-talk/photo.webp";
import { argonyx26Event } from "./argonyx26";
import { pitchEThonEvent } from "./pitchEThon";
import { eSummitEvent } from "./eSummit";
import { hacktoberfest26Event } from "./hacktoberfest26";
import type { EventDetailData, EventSummary } from "./types";

export * from "./types";

/**
 * Every ECell event, upcoming first, in the order the /events page lists them.
 * To add an event, add an entry here; give it `detail` (its own file in this
 * folder) when it should have a page of its own.
 */
export const EVENTS: EventSummary[] = [
  {
    slug: "hacktoberfest-26",
    title: "Hacktoberfest '26",
    category: "Hackathons",
    status: "past",
    startDate: "2026-10-31",
    summary:
      "A hands-on mini-hackathon celebrating open source with open-source AI and open-weight models, hosted by ECell and AWS SBG RVU.",
    image: hacktoberPoster,
    poster: hacktoberPoster,
    aliases: ["hacktoberfest", "hacktoberfest26", "hackobterfest-26", "hackobterfest26", "hackobterfest"],
    detail: hacktoberfest26Event,
  },
  {
    slug: "pitch-e-thon",
    title: "Pitch-e-thon",
    category: "Competitions",
    status: "upcoming",
    summary: "Pitch your idea, get real feedback, and take your next step as a builder.",
    image: argonyxPhoto,
    detail: pitchEThonEvent,
  },
  {
    slug: "e-summit",
    title: "E-Summit",
    category: "Talks",
    status: "upcoming",
    summary:
      "A flagship gathering for ideas, founders, and the people building what comes next.",
    image: argonyxPhoto,
    detail: eSummitEvent,
  },
  {
    slug: "argonyx-26",
    title: "Argonyx '26",
    category: "Hackathons",
    status: "past",
    startDate: "2026-09-25",
    endDate: "2026-09-26",
    summary:
      "A 24-hour national hackathon for ambitious builders. Build, break and ship.",
    image: argonyx26Photo,
    poster: argonyx26Poster,
    aliases: ["argonyx", "argonyx26"],
    detail: argonyx26Event,
  },
  {
    slug: "argonyx-hackathon",
    title: "Argonyx Hackathon",
    category: "Hackathons",
    status: "past",
    startDate: "2025-09-18",
    summary:
      "A technical hackathon bringing students and builders together to explore, build, and deploy ambitious solutions.",
    image: argonyxPhoto,
  },
  {
    slug: "winter-tech-talk",
    title: "Winter Tech Talk",
    category: "Talks",
    status: "past",
    startDate: "2025-12-12",
    summary:
      "A technical session bringing students together to explore emerging technologies and frameworks shaping the future.",
    image: winterTechTalkPhoto,
  },
  {
    slug: "talk-startup-with-me",
    title: "Talk Startup With Me",
    category: "Talks",
    status: "past",
    startDate: "2026-03-24",
    summary:
      "From problem discovery to your first pitch — learn practical venture building directly from experienced founders.",
    image: talkStartupWithMePhoto,
  },
];

/** Events that have a page, keyed by slug. */
export const EVENTS_DATA: Record<string, EventDetailData> = Object.fromEntries(
  EVENTS.flatMap((event) => (event.detail ? [[event.slug, event.detail]] : [])),
);

/** Link to an event's page, or undefined when it has none. */
export function getEventHref(event: EventSummary): string | undefined {
  return event.detail ? `/events/${event.slug}` : undefined;
}

export function getEventBySlug(slug: string): EventDetailData | undefined {
  const normalized = slug.toLowerCase();
  const event = EVENTS.find(
    (item) => item.slug === normalized || item.aliases?.includes(normalized),
  );
  return event?.detail;
}

export function getAllEventSlugs(): string[] {
  return Object.keys(EVENTS_DATA);
}

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

function dateParts(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return { year, month: MONTHS[month - 1], day };
}

/** Day or day range, e.g. "31" or "25–26". Undefined while the date is TBA. */
export function formatEventDays(event: EventSummary): string | undefined {
  if (!event.startDate) return undefined;
  const start = dateParts(event.startDate).day;
  if (!event.endDate) return String(start);
  return `${start}–${dateParts(event.endDate).day}`;
}

/** Month and year, e.g. "OCT 2026", or "DATE TBA". */
export function formatEventMonth(event: EventSummary): string {
  if (!event.startDate) return "DATE TBA";
  const { month, year } = dateParts(event.startDate);
  return `${month} ${year}`;
}
