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

export interface EventDetailData {
  slug: string;
  title: string;
  isCompleted?: boolean;
  heroHeadline: string;
  heroAccent: string;
  heroBody: string;
  eyebrow: string;
  aboutEyebrow: string;
  aboutHeadline: string;
  aboutHeadlineAccent: string;
  aboutDescription: string;
  aboutNote?: string;
  format: string;
  dateBadge: string;
  date: string;
  venue: string;
  prizePool?: string;
  registrationUrl: string;
  registrationCtaText: string;
  registrationHeadline: string;
  registrationAccent: string;
  registrationHint: string;
  image: StaticImageData;
  ledger: LedgerItem[];
  organizers: string[];
  contacts: ContactItem[];
  metaTitle: string;
  metaDescription: string;
  winnersHeadline?: string;
  winnersAccent?: string;
  winnersSubhead?: string;
  winners?: WinnerItem[];
  galleryHeadline?: string;
  galleryAccent?: string;
  gallerySubhead?: string;
  gallerySpaces?: GallerySpace[];
  galleryDriveUrl?: string;
  roundsHeadline?: string;
  roundsAccent?: string;
  roundsSubhead?: string;
  rounds?: EventRoundItem[];
  expectedOutcomes?: string[];
  logisticsNotice?: string;
  sponsorsHeadline?: string;
  sponsorsAccent?: string;
  sponsorsSubhead?: string;
  sponsorsPoweredBy?: { name: string; tag?: string; logo?: string }[];
  sponsorsPresenting?: { name: string; tag?: string; logo?: string };
  sponsorsList?: { name: string; tag?: string; url?: string; logo?: string }[];
}
