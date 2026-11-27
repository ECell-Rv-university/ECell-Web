import type { StaticImageData } from "next/image";

export interface LedgerItem {
  number: string;
  label: string;
  value: string;
}

export interface ContactItem {
  name: string;
  phone: string;
  role?: string;
}

export interface WinnerItem {
  place: string;
  badge?: string;
  prize?: string;
  teamName: string;
  projectTitle: string;
  description?: string;
  photoCaption?: string;
  photo?: StaticImageData;
}

export interface GallerySpace {
  id: string;
  title: string;
  category: string;
}

export interface EventRoundItem {
  number: string;
  badge: string;
  title: string;
  type: string;
  description: string;
}

export interface EventSponsor {
  name: string;
  tag?: string;
  url?: string;
  logo?: string;
}

/** A section heading: `headline` runs straight into the highlighted `accent`,
 *  so the accent usually starts with a space. */
interface SectionHeading {
  headline: string;
  accent?: string;
  subhead?: string;
}

export interface EventDetailData {
  slug: string;
  title: string;
  isCompleted?: boolean;
  image: StaticImageData;
  /** The image is a designed poster: show it whole at its own proportions
   *  instead of cropping it to the photo frame. */
  imageIsPoster?: boolean;
  format: string;
  dateBadge: string;
  date: string;
  venue: string;
  prizePool?: string;
  meta: {
    title: string;
    description: string;
  };
  hero: {
    eyebrow: string;
    headline: string;
    accent: string;
    body: string;
  };
  about: {
    eyebrow: string;
    headline: string;
    accent: string;
    description: string;
    note?: string;
  };
  ledger: LedgerItem[];
  organizers: string[];
  contacts: ContactItem[];
  /** Shown while the event is upcoming. */
  registration?: {
    url: string;
    ctaText: string;
    headline: string;
    accent: string;
    hint: string;
  };
  rounds?: SectionHeading & {
    items: EventRoundItem[];
    expectedOutcomes?: string[];
    logisticsNotice?: string;
  };
  /** Shown once the event is completed. */
  winners?: SectionHeading & {
    items: WinnerItem[];
    /** Small pills under each winner, e.g. the edition and format. */
    badges?: string[];
  };
  /** Shown once the event is completed. */
  gallery?: SectionHeading & {
    /** Line above the headline. Defaults to "Captured Moments". */
    eyebrow?: string;
    spaces?: GallerySpace[];
    driveUrl?: string;
  };
  sponsors?: SectionHeading & {
    poweredBy?: EventSponsor[];
    presenting?: EventSponsor;
    list: EventSponsor[];
  };
}

export type EventCategory = "Hackathons" | "Talks" | "Competitions";

/** One entry in the events list. Drives the /events archive and the homepage
 *  cards; entries with `detail` also get a page at /events/<slug>. */
export interface EventSummary {
  slug: string;
  title: string;
  category: EventCategory;
  status: "upcoming" | "past";
  /** ISO date (YYYY-MM-DD). Leave out while the date is TBA. */
  startDate?: string;
  /** ISO date of the last day, for events that run over several days. */
  endDate?: string;
  /** One or two sentences for event cards. */
  summary: string;
  /** Photo used on cards and in previews. */
  image: StaticImageData;
  /** Designed poster, shown whole (never cropped) where cards support it. */
  poster?: StaticImageData;
  /** Other slugs that should resolve to this event, e.g. common misspellings. */
  aliases?: string[];
  detail?: EventDetailData;
}
