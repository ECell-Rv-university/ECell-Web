import type { StaticImageData } from "next/image";
import cta from "../assets/events/events_photo/cta.webp";
import argonyx from "../assets/events/events_photo/argonyx.webp";
import argonyxHeroPhoto from "../assets/Argonyx26/inaugration/ing1.webp";
import winnerPhoto from "../assets/Argonyx26/winningTeams/winner.webp";
import runnerUpPhoto from "../assets/Argonyx26/winningTeams/runnerups.webp";
import secondRunnerUpPhoto from "../assets/Argonyx26/winningTeams/secondrunnerup.webp";

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
  sponsorsPoweredBy?: { name: string; tag?: string }[];
  sponsorsPresenting?: { name: string; tag?: string };
  sponsorsList?: { name: string; tag?: string; url?: string }[];
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
    image: argonyx,
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
        teamName: "Lords of the Pings",
        projectTitle: "Argonyx '26 Grand Winners",
        description:
          "Dominated the 24-hour national hackathon with a real, shippable solution — built, demoed, and defended under pressure.",
        photoCaption: "Lords of the Pings — Grand Champions",
        photo: winnerPhoto,
      },
      {
        place: "2ND PLACE",
        badge: "First Runner-Up",
        teamName: "Zero Shift",
        projectTitle: "Argonyx '26 First Runner-Up",
        description:
          "Delivered an impressive working prototype in 24 continuous hours, earning recognition from the jury panel.",
        photoCaption: "Zero Shift — First Runner-Up",
        photo: runnerUpPhoto,
      },
      {
        place: "3RD PLACE",
        badge: "Second Runner-Up",
        teamName: "Team Acers",
        projectTitle: "Argonyx '26 Second Runner-Up",
        description:
          "Secured third place with an outstanding build during the 24-hour national hackathon sprint.",
        photoCaption: "Team Acers — Second Runner-Up",
        photo: secondRunnerUpPhoto,
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
  "hacktoberfest-26": {
    slug: "hacktoberfest-26",
    title: "Hacktoberfest '26 Hack Day",
    eyebrow: "Global Open Source Celebration · Mini-Hackathon",
    heroHeadline: "Learn & build with",
    heroAccent: " open-source AI.",
    heroBody:
      "Hacktoberfest Hack Days are hands-on mini-hackathons based on Major League Hacking (MLH)'s Hack Days program. 25 offline teams of 4 assemble at RV University to build real solutions with open-source AI tools and open-weight models during October.",
    aboutEyebrow: "About Hacktoberfest Hack Day",
    aboutHeadline: "A month-long celebration of",
    aboutHeadlineAccent: " open source.",
    aboutDescription:
      "Hacktoberfest is a month-long celebration of open source throughout October. In 2026, the focus is on learning and building with open-source AI and open-weight models, both through in-person and online activities. MLH and DEV are managing the event this year in partnership with our friends at DigitalOcean.\n\nThe event will be open to students from RV University and participating universities. Participants will work in small teams on projects involving open-source AI tools, open-weight AI models, AI-assisted developer tools, and practical applications of open-source technologies. Key themes may include: Generative AI, AI agents, developer productivity, and other practical applications of open-source AI.",
    aboutNote:
      "25 participating teams of 4 members each (100 participants in total). Problem Statement: TBD. Conducted in two rounds: Round 1 Online PPT Submission and Round 2 Offline Presentation & Judging at RV University. Free lunch provided to registered participants.",
    format: "Two rounds — Online PPT Submission followed by Offline Presentation & Judging (25 teams of 4, 100 participants)",
    date: "October 2026 (Dates TBA)",
    dateBadge: "OCTOBER 2026 · RV UNIVERSITY, BENGALURU",
    venue: "RV University, Bengaluru",
    prizePool: "Swag, Prizes & Open Source Recognition",
    registrationUrl: "https://share.google/4J3aOAZrHKNAcyaAF",
    registrationCtaText: "Register for Hack Day ↗",
    registrationHeadline: "Build the future with",
    registrationAccent: "open-source AI.",
    registrationHint:
      "Limited to 25 offline teams (4 members per team / 100 participants total). Free lunch provided to registered participants.",
    image: argonyx,
    ledger: [
      {
        number: "01",
        label: "Format",
        value: "Round 1 Online PPT Submission · Round 2 Offline Presentation & Judging",
      },
      {
        number: "02",
        label: "Capacity",
        value: "25 Teams of 4 Members (100 Participants Total)",
      },
      {
        number: "03",
        label: "Key Themes",
        value: "Generative AI, AI Agents, Dev Productivity & Open-Weight Models",
      },
      {
        number: "04",
        label: "Problem Statement",
        value: "PS: TBD (Announced prior to Round 1)",
      },
      {
        number: "05",
        label: "Dates",
        value: "October 2026 · Dates TBA",
      },
      {
        number: "06",
        label: "Venue",
        value: "RV University, Bengaluru (Offline Round 2)",
      },
      {
        number: "07",
        label: "Perks & Meals",
        value: "Complimentary lunch provided for registered participants",
      },
    ],
    roundsHeadline: "Event Progression &",
    roundsAccent: " Format.",
    roundsSubhead:
      "Hacktoberfest Hack Day is conducted in two focused rounds designed to take ideas from concept to live defense.",
    rounds: [
      {
        number: "ROUND 01",
        badge: "Virtual Screening",
        title: "Online PPT Submission",
        type: "Online Submission",
        description:
          "Participants/teams will submit their project ideas and proposed solutions in the prescribed PPT format through the designated online submission platform. The submissions will be evaluated by the organizing and judging team, and shortlisted teams will be selected for the next round.",
      },
      {
        number: "ROUND 02",
        badge: "In-Person Hack & Pitch",
        title: "Offline Presentation & Judging",
        type: "Offline at RV University",
        description:
          "Shortlisted teams will report to RV University build and present their projects in person before the judging panel. Teams will demonstrate their solutions and explain their implementation, approach, impact, and scalability.",
      },
    ],
    expectedOutcomes: [
      "Practical experience in building with open-source AI technologies and open-weight models.",
      "Developing skills in GitHub, collaborative software development, rapid prototyping, and technical problem-solving.",
      "Encouraging students to contribute to and engage with the open-source ecosystem while building demonstrable projects.",
      "Interacting with peers and mentors, and fostering a stronger local developer community around open-source AI.",
    ],
    logisticsNotice:
      "Participants are required to follow the RV University Code of Conduct and applicable event guidelines. Photography and videography will be conducted for event documentation. Complimentary lunch will be provided to all registered participants.",
    sponsorsHeadline: "Global Ecosystem &",
    sponsorsAccent: " Partners.",
    sponsorsSubhead:
      "Hacktoberfest is presented in partnership with industry leaders advancing open-source software and open-weight AI.",
    sponsorsPoweredBy: [
      { name: "MLH", tag: "Major League Hacking" },
      { name: "DEV", tag: "dev.to Community" },
    ],
    sponsorsPresenting: {
      name: "DigitalOcean",
      tag: "Presenting Partner",
    },
    sponsorsList: [
      { name: "Tiger Data" },
      { name: "Snowflake" },
      { name: "MongoDB" },
      { name: "Gauge" },
      { name: "Solana" },
      { name: "Render" },
      { name: "GitHub" },
      { name: "Sentry" },
      { name: "backboard.io" },
      { name: "IBM" },
      { name: "ElevenLabs" },
      { name: "paper compute co." },
      { name: "Entire" },
      { name: "PRIOR" },
      { name: "Google Cloud" },
      { name: "Gemma" },
      { name: "Qualcomm" },
      { name: "Arduino" },
      { name: "mastra" },
      { name: "Temporal" },
      { name: "TLDR" },
      { name: "THINKING MACHINES" },
    ],
    organizers: [
      "RV University",
      "The Entrepreneurship Cell, RV University",
      "Major League Hacking (MLH)",
      "DEV",
      "DigitalOcean",
    ],
    contacts: [
      {
        name: "ECell RV University",
        phone: "+91 96110 83196",
        role: "Event Desk",
      },
      {
        name: "Hack Day Operations",
        phone: "+91 86606 97430",
        role: "Team Coordination",
      },
      {
        name: "Community Support",
        phone: "+91 80732 88190",
        role: "Registration Queries",
      },
    ],
    metaTitle: "Hacktoberfest '26 Hack Day | ECell RV University",
    metaDescription:
      "Hacktoberfest '26 Hack Day at RV University — hands-on mini-hackathon with open-source AI and open-weight models, managed by MLH, DEV, and DigitalOcean.",
  },
};

export function getEventBySlug(slug: string): EventDetailData | undefined {
  const normalized = slug.toLowerCase();
  if (normalized === "argonyx-26" || normalized === "argonyx" || normalized === "argonyx26") {
    return EVENTS_DATA["argonyx-26"];
  }
  if (
    normalized === "hacktoberfest-26" ||
    normalized === "hacktoberfest" ||
    normalized === "hacktoberfest26" ||
    normalized === "hackobterfest-26" ||
    normalized === "hackobterfest26" ||
    normalized === "hackobterfest"
  ) {
    return EVENTS_DATA["hacktoberfest-26"];
  }
  return EVENTS_DATA[normalized];
}

export function getAllEventSlugs(): string[] {
  return Object.keys(EVENTS_DATA);
}
