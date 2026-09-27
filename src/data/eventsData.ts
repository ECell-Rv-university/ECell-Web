import type { StaticImageData } from "next/image";
import cta from "../assets/events/events_photo/cta.webp";
import argonyx from "../assets/events/events_photo/argonyx.webp";

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
}

export interface GallerySpace {
  id: string;
  title: string;
  category: string;
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
}

export const EVENTS_DATA: Record<string, EventDetailData> = {
  "argonyx-26": {
    slug: "argonyx-26",
    title: "ARGONYX '26",
    isCompleted: true,
    eyebrow: "24-Hour National Hackathon · Concluded",
    heroHeadline: "Build something",
    heroAccent: " that ships.",
    heroBody:
      "One venue, one clock, twenty-four hours. Pick a problem worth solving, build a real working solution, and pitch it to judges who care about execution — not just slides. Run by The Entrepreneurship Cell, VIKSHA, and IEEE at RV University.",
    aboutEyebrow: "What is Argonyx",
    aboutHeadline: "Not another",
    aboutHeadlineAccent: " idea deck.",
    aboutDescription:
      "ARGONYX was a 24-hour national hackathon hosted at RV University, Bengaluru — one continuous build, start to finish. Teams showed up, built real products, and defended what they shipped in front of a panel of active builders and jury members.",
    aboutNote:
      "This edition of Argonyx has successfully concluded. Stay tuned for future editions and upcoming founder conclaves.",
    format: "24-hour national hackathon — build, then pitch",
    date: "25–26 September 2026",
    dateBadge: "COMPLETED · 25–26 SEP 2026 · RV UNIVERSITY, BENGALURU",
    venue: "RV University, Bengaluru",
    prizePool: "Upto ₹30,000",
    registrationUrl:
      "https://unstop.com/hackathons/argonyx26-rv-university-1748836",
    registrationCtaText: "View on Unstop ↗",
    registrationHeadline: "Argonyx '26 has",
    registrationAccent: "successfully concluded.",
    registrationHint: "Official hackathon archive on Unstop.",
    image: cta,
    ledger: [
      {
        number: "01",
        label: "Format",
        value: "24-hour national hackathon — build, then pitch",
      },
      {
        number: "02",
        label: "Dates",
        value: "25–26 September 2026",
      },
      {
        number: "03",
        label: "Venue",
        value: "RV University, Bengaluru",
      },
      {
        number: "04",
        label: "Prize pool",
        value: "Upto ₹30,000",
      },
    ],
    organizers: [
      "RV University",
      "The Entrepreneurship Cell, RV University",
      "VIKSHA",
      "IEEE RV University",
    ],
    contacts: [
      {
        name: "Alok Murali",
        phone: "+91 96110 83196",
      },
      {
        name: "Ayush S Kulkarni",
        phone: "+91 86606 97430",
      },
      {
        name: "Kushal Kuladeepa S N",
        phone: "+91 80732 88190",
      },
    ],
    winnersHeadline: "Champions of",
    winnersAccent: " Argonyx '26.",
    winnersSubhead:
      "Honoring the builders and visionary teams who shipped real working solutions in 24 continuous hours.",
    winners: [
      {
        place: "1ST PLACE",
        badge: "Grand Champion",
        prize: "₹15,000 Cash Prize + Incubation",
        teamName: "Team NeuralShift",
        projectTitle: "Autonomous Edge Diagnostics",
        description:
          "Engineered a sub-second, on-device diagnostic pipeline designed for offline rural healthcare stations.",
        photoCaption: "Grand Winners Team Photo",
      },
      {
        place: "2ND PLACE",
        badge: "First Runner-Up",
        prize: "₹10,000 Cash Prize",
        teamName: "Team HyperPulse",
        projectTitle: "Decentralized Microgrid Arbitrage",
        description:
          "Built a peer-to-peer renewable energy sharing platform with real-time hardware telemetry and smart settlements.",
        photoCaption: "Runner-Up Team Photo",
      },
      {
        place: "3RD PLACE",
        badge: "Second Runner-Up",
        prize: "₹5,000 Cash Prize",
        teamName: "Team ZeroTrace",
        projectTitle: "Verifiable Privacy Vault",
        description:
          "Implemented a zero-knowledge credential verification framework safeguarding sensitive student identities.",
        photoCaption: "Second Runner-Up Team Photo",
      },
    ],
    galleryHeadline: "View Images",
    galleryAccent: " Moments from the floor.",
    gallerySubhead:
      "Highlights from the 24-hour sprint — from opening keynotes and midnight builds to jury defenses and the podium ceremony.",
    gallerySpaces: [
      {
        id: "opening",
        title: "Opening Ceremony & Keynote",
        category: "KICKOFF · DAY 1",
      },
      {
        id: "midnight",
        title: "24-Hour Midnight Sprint",
        category: "HACKING FLOOR · 02:00 AM",
      },
      {
        id: "mentorship",
        title: "Mentorship & Architecture Reviews",
        category: "JURY ROUND 1",
      },
      {
        id: "pitching",
        title: "Final Stage Pitching & Demos",
        category: "DEMO DAY · DAY 2",
      },
      {
        id: "podium",
        title: "Winners Podium & Trophy Distribution",
        category: "AWARDS CEREMONY",
      },
      {
        id: "group",
        title: "All Hackers & Organizing Crew",
        category: "CLOSING CEREMONY",
      },
    ],
    metaTitle: "Argonyx '26 Hackathon | ECell RV University",
    metaDescription:
      "Argonyx '26 — 24-hour national hackathon hosted at RV University, Bengaluru. Winners announced, event concluded.",
  },
  "pitch-e-thon": {
    slug: "pitch-e-thon",
    title: "Pitch-e-thon '26",
    eyebrow: "Flagship Startup Pitch Competition",
    heroHeadline: "Pitch your vision.",
    heroAccent: " Back your bold.",
    heroBody:
      "Pitch your startup idea, receive candid feedback from angel investors, venture capitalists, and serial operators, and secure the mentorship and backing you need to build what's next.",
    aboutEyebrow: "About Pitch-e-thon",
    aboutHeadline: "Where ideas meet",
    aboutHeadlineAccent: " real venture backing.",
    aboutDescription:
      "Pitch-e-thon is RV University's premier competitive pitch platform. Teams pitch directly to active investors, defense leaders, and startup operators. Skip the theory and test your market thesis against experienced builders who look for real traction and vision.",
    aboutNote:
      "Eligibility guidelines, pitch deck submission formats, and preliminary screening stages will be announced through the ECell community.",
    format: "Multi-stage pitch competition — deck evaluation, live pitching & founder Q&A",
    date: "Coming 2026 (Dates TBA)",
    dateBadge: "DATE TBA · RV UNIVERSITY, BENGALURU",
    venue: "RV University, Bengaluru",
    prizePool: "Cash grants, incubation opportunities & credits",
    registrationUrl: "https://chat.whatsapp.com/G4YxR5Q7u2n2QeY18b0kHh",
    registrationCtaText: "Join WhatsApp for Updates ↗",
    registrationHeadline: "Got an ambitious idea?",
    registrationAccent: "Pitch it to the ecosystem.",
    registrationHint:
      "Join the official WhatsApp community for registration drops, rules, and track announcements.",
    image: argonyx,
    ledger: [
      {
        number: "01",
        label: "Format",
        value: "Pitch presentation, live jury Q&A and investor scoring",
      },
      {
        number: "02",
        label: "Dates",
        value: "2026 Edition · Dates TBA",
      },
      {
        number: "03",
        label: "Venue",
        value: "RV University, Bengaluru",
      },
      {
        number: "04",
        label: "Perks",
        value: "Investor access, incubation support & cash prizes",
      },
    ],
    organizers: [
      "RV University",
      "The Entrepreneurship Cell, RV University",
    ],
    contacts: [
      {
        name: "ECell RV University",
        phone: "+91 96110 83196",
      },
      {
        name: "Community Desk",
        phone: "+91 86606 97430",
      },
    ],
    metaTitle: "Pitch-e-thon '26 | ECell RV University",
    metaDescription:
      "Pitch-e-thon at RV University — pitch your startup idea to active venture capitalists, founders, and angel investors in Bengaluru.",
  },
  "e-summit": {
    slug: "e-summit",
    title: "E-Summit '26",
    eyebrow: "Flagship Entrepreneurship Conclave",
    heroHeadline: "The summit for",
    heroAccent: " future founders.",
    heroBody:
      "A flagship gathering of founders, investors, product thinkers, and ambitious builders. Two packed days of masterclasses, venture showcases, keynote talks, and networking right in the heart of Bengaluru's startup capital.",
    aboutEyebrow: "About E-Summit",
    aboutHeadline: "Inspiring what",
    aboutHeadlineAccent: " comes next.",
    aboutDescription:
      "E-Summit brings together India's top founders, venture capitalists, and student leaders under one roof. From problem discovery and venture scaling to deep-tech breakthroughs, experience high-signal conversations and connect with fellow creators.",
    aboutNote:
      "Speaker schedules, pass registration, and track details will be announced progressively.",
    format: "Keynote talks, fireside chats, startup expo & networking sessions",
    date: "Coming 2026 (Dates TBA)",
    dateBadge: "DATE TBA · RV UNIVERSITY, BENGALURU",
    venue: "RV University, Bengaluru",
    prizePool: "Mentorship, grants & networking opportunities",
    registrationUrl: "https://chat.whatsapp.com/G4YxR5Q7u2n2QeY18b0kHh",
    registrationCtaText: "Join WhatsApp for Passes ↗",
    registrationHeadline: "Be in the room.",
    registrationAccent: "Where ideas take flight.",
    registrationHint:
      "Join the official WhatsApp community for early pass access and speaker announcements.",
    image: argonyx,
    ledger: [
      {
        number: "01",
        label: "Format",
        value: "Keynotes, firesides, startup exhibitions and workshops",
      },
      {
        number: "02",
        label: "Dates",
        value: "2026 Edition · Dates TBA",
      },
      {
        number: "03",
        label: "Venue",
        value: "RV University, Bengaluru",
      },
      {
        number: "04",
        label: "Community",
        value: "1000+ attendees, 20+ founders & investors",
      },
    ],
    organizers: [
      "RV University",
      "The Entrepreneurship Cell, RV University",
    ],
    contacts: [
      {
        name: "ECell RV University",
        phone: "+91 96110 83196",
      },
      {
        name: "Summit Coordinator",
        phone: "+91 80732 88190",
      },
    ],
    metaTitle: "E-Summit '26 | ECell RV University",
    metaDescription:
      "E-Summit at RV University — Bengaluru's flagship campus entrepreneurship summit featuring top founders, keynotes, investor panels, and startup expos.",
  },
};

export function getEventBySlug(slug: string): EventDetailData | undefined {
  const normalized = slug.toLowerCase();
  if (normalized === "argonyx-26" || normalized === "argonyx" || normalized === "argonyx26") {
    return EVENTS_DATA["argonyx-26"];
  }
  return EVENTS_DATA[normalized];
}

export function getAllEventSlugs(): string[] {
  return Object.keys(EVENTS_DATA);
}
