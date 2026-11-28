import type { EventDetailData } from "./types";
import argonyx from "@/src/assets/events/argonyx-hackathon/Esummit.webp";

export const eSummitEvent: EventDetailData = {
  slug: "e-summit",
  title: "E-Summit '26",
  hero: {
    eyebrow: "Flagship Entrepreneurship Conclave",
    headline: "The summit for",
    accent: " future founders.",
    body:
      "A flagship gathering of founders, investors, product thinkers, and ambitious builders. Two packed days of masterclasses, venture showcases, keynote talks, and networking right in the heart of Bengaluru's startup capital.",
  },
  about: {
    eyebrow: "About E-Summit",
    headline: "Inspiring what",
    accent: " comes next.",
    description:
      "E-Summit brings together India's top founders, venture capitalists, and student leaders under one roof. From problem discovery and venture scaling to deep-tech breakthroughs, experience high-signal conversations and connect with fellow creators.",
    note:
      "Speaker schedules, pass registration, and track details will be announced progressively.",
  },
  format: "Keynote talks, fireside chats, startup expo & networking sessions",
  date: "Coming 2026 (Dates TBA)",
  dateBadge: "DATE TBA · RV UNIVERSITY, BENGALURU",
  venue: "RV University, Bengaluru",
  prizePool: "Mentorship, grants & networking opportunities",
  registration: {
    url: "https://chat.whatsapp.com/G4YxR5Q7u2n2QeY18b0kHh",
    ctaText: "Join WhatsApp for Passes ↗",
    headline: "Be in the room.",
    accent: "Where ideas take flight.",
    hint:
      "Join the official WhatsApp community for early pass access and speaker announcements.",
  },
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
  meta: {
    title: "E-Summit '26 | ECell RV University",
    description:
      "E-Summit at RV University — Bengaluru's flagship campus entrepreneurship summit featuring top founders, keynotes, investor panels, and startup expos.",
  },
};
