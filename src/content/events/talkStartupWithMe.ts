import type { EventDetailData } from "./types";
import talkStartupPoster from "@/src/assets/events/talk-startup-with-me/TechStartUpToMe.jpg";

export const talkStartupWithMeEvent: EventDetailData = {
  slug: "talk-startup-with-me",
  title: "TALK START-UP TO ME",
  isCompleted: true,
  hero: {
    eyebrow: "Founder Talk · Concluded",
    headline: "From problem discovery",
    accent: " to your first pitch.",
    body:
      "An interactive session hosted by The Entrepreneurship Cell at RV University in collaboration with EDOCK and Fit Muscle, bringing practical startup insights and real-world perspectives to aspiring student builders.",
  },
  about: {
    eyebrow: "About the Session",
    headline: "Practical lessons",
    accent: " in building early.",
    description:
      "Talk Start-Up To Me explored how early-stage ideas take shape — from spotting real problems and validating concepts to pitching and building momentum as a student founder.",
    note:
      "This session has successfully concluded. Follow ECell RV University for upcoming founder talks, workshops, and community sessions.",
  },
  format: "Founder talk & interactive startup session",
  date: "17 October 2025",
  dateBadge: "COMPLETED · 17 OCT 2025 · 2:00 PM – 6:00 PM",
  venue: "3rd Floor, Homi J Bhabha Hall, RV University",
  image: talkStartupPoster,
  imageIsPoster: true,
  ledger: [
    {
      number: "01",
      label: "Format",
      value: "Founder talk & interactive startup session",
    },
    {
      number: "02",
      label: "Date & Time",
      value: "17 October 2025 · 2:00 PM – 6:00 PM",
    },
    {
      number: "03",
      label: "Venue",
      value: "3rd Floor, Homi J Bhabha Hall, RV University",
    },
    {
      number: "04",
      label: "In-Kind Sponsor",
      value: "Fit Muscle",
    },
  ],
  sponsors: {
    headline: "Event",
    accent: " Sponsors.",
    subhead:
      "Supporting Talk Start-Up To Me at RV University.",
    list: [
      {
        name: "EDOCK",
      },
      {
        name: "Fit Muscle",
        tag: "In-Kind Sponsor",
      },
    ],
  },
  organizers: [
    "The Entrepreneurship Cell, RV University",
    "EDOCK",
    "Fit Muscle (In-Kind Sponsor)",
  ],
  contacts: [
    {
      name: "ECell RV University",
      phone: "club_ecell@rvu.edu.in",
    },
  ],
  gallery: {
    eyebrow: "Captured Moments · Talk Start-Up To Me",
    headline: "Session Highlights",
    accent: " & moments.",
    subhead:
      "Key moments and takeaways from the session at Homi J Bhabha Hall, RV University.",
    spaces: [
      {
        id: "opening-talk",
        title: "Session Kickoff & Startup Insights",
        category: "TALK SESSION",
      },
      {
        id: "founder-qa",
        title: "Practical Venture Building & Q&A",
        category: "DISCUSSION",
      },
      {
        id: "pitch-takeaways",
        title: "From Idea to First Pitch",
        category: "KEY TAKEAWAYS",
      },
      {
        id: "community-meetup",
        title: "Student Builders & Community Networking",
        category: "COMMUNITY",
      },
    ],
  },
  meta: {
    title: "Talk Startup With Me | ECell RV University",
    description:
      "Talk Start-Up To Me — founder talk and startup session hosted by The Entrepreneurship Cell at RV University on 17 October 2025.",
  },
};