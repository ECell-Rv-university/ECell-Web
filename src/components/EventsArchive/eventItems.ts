import type { StaticImageData } from "next/image";
import { SITE_URL } from "@/src/utils/constants";
import {
  EVENTS,
  formatEventDays,
  formatEventMonth,
  getEventHref,
  type EventCategory,
} from "@/src/content/events";

/* =====================================================
   DATA
===================================================== */

export interface EventItem {
  date: string;
  month: string;
  /** ISO start date, for structured data. */
  startDate?: string;
  type: EventCategory;
  title: string;
  description: string;
  image: StaticImageData;
  /** Portrait poster: shown whole inside the box over a blurred copy of itself, never cropped. */
  imageIsPoster?: boolean;
  status: "UPCOMING" | "ARCHIVE";
  link?: string;
}

export const EVENT_ITEMS: EventItem[] = EVENTS.map((event) => ({
  date: formatEventDays(event) ?? "TBA",
  month: formatEventMonth(event),
  startDate: event.startDate,
  type: event.category,
  title: event.title,
  description: event.summary,
  image: event.poster ?? event.image,
  imageIsPoster: Boolean(event.poster),
  status: event.status === "upcoming" ? "UPCOMING" : "ARCHIVE",
  link: getEventHref(event),
}));

export const FILTERS = ["All", "Hackathons", "Talks"] as const;

/* =====================================================
   HELPERS
===================================================== */

export function formatEventDate(event: EventItem): string {
  if (event.date === "TBA") return "DATE TBA";

  const month = event.month.replace(/\s*\d{4}$/, "");
  return `${event.date} ${month}`;
}

export function formatCardDate(event: EventItem): {
  day: string;
  month: string;
} {
  if (event.date === "TBA") {
    return {
      day: "TBA",
      month: "",
    };
  }

  const month = event.month.replace(/\s*\d{4}$/, "");

  return {
    day: event.date,
    month,
  };
}

/* =====================================================
   STRUCTURED DATA
===================================================== */

export function buildStructuredData(upcoming: EventItem[]) {
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

      eventAttendanceMode:
        "https://schema.org/OfflineEventAttendanceMode",

      organizer: {
        "@type": "Organization",
        name: "ECell RV University",
        url: SITE_URL,
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

      ...(event.startDate ? { startDate: event.startDate } : {}),
    })),
  };
}
