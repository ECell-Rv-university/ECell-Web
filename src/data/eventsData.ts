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

export interface EventDetailData {
  slug: string;
  title: string;
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
}

export const EVENTS_DATA: Record<string, EventDetailData> = {
  "argonyx-26": {
    slug: "argonyx-26",
    title: "ARGONYX '26",
    eyebrow: "24-Hour National Hackathon",
    heroHeadline: "Build something",
    heroAccent: " that ships.",
    heroBody:
      "One venue, one clock, twenty-four hours. Pick a problem worth solving, build a real working solution, and pitch it to judges who care about execution — not just slides. Run by  The Entrepreneurship Cell, VIKSHA, and IEEE at RV University.",
    aboutEyebrow: "What is Argonyx",
    aboutHeadline: "Not another",
    aboutHeadlineAccent: " idea deck.",
    aboutDescription:
      "ARGONYX is a 24-hour national hackathon hosted at RV University, Bengaluru — one continuous build, start to finish. No slow-burn rounds spread across weeks; you show up, you build, and a day later you're defending what you shipped in front of a panel.",
    aboutNote:
      "Track details, eligibility, and team size are confirmed on the official registration page — check there before you lock your team.",
    format: "24-hour national hackathon — build, then pitch",
    date: "25–26 September 2026",
    dateBadge: "25–26 SEP · RV UNIVERSITY, BENGALURU",
    venue: "RV University, Bengaluru",
    prizePool: "Upto ₹30,000",
    registrationUrl:
      "https://unstop.com/hackathons/argonyx26-rv-university-1748836",
    registrationCtaText: "Register on Unstop ↗",
    registrationHeadline: "Bring a team.",
    registrationAccent: "Leave with a build.",
    registrationHint: "Opens the official registration page in a new tab.",
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
    metaTitle: "Argonyx '26 Hackathon | ECell RV University",
    metaDescription:
      "Argonyx '26 — 24-hour national hackathon hosted at RV University, Bengaluru. Build real working solutions, compete for ₹30,000 prize pool, and pitch to top founders.",
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
