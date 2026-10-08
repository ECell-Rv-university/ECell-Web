import type { EventDetailData } from "./types";
import argonyx from "../../assets/events/events_photo/argonyx.webp";
import winnerPhoto from "../../assets/Argonyx26/winningTeams/winner.webp";
import runnerUpPhoto from "../../assets/Argonyx26/winningTeams/runnerups.webp";
import secondRunnerUpPhoto from "../../assets/Argonyx26/winningTeams/secondrunnerup.webp";

export const argonyx26Event: EventDetailData = {
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
};
