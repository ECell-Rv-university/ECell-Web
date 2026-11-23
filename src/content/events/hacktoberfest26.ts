import type { EventDetailData } from "./types";
import hacktoberPoster from "@/src/assets/events/hacktoberfest-26/poster.png";
import winnerPhoto from "@/src/assets/events/hacktoberfest-26/winners/2nd_runner_up.jpeg";
import runnerUpPhoto from "@/src/assets/events/hacktoberfest-26/winners/1st_runner_up.jpeg";
import secondRunnerUpPhoto from "@/src/assets/events/hacktoberfest-26/winners/winner.jpeg";


export const hacktoberfest26Event: EventDetailData = {
  slug: "hacktoberfest-26",
  title: "Hacktoberfest '26 Hack Day",
  isCompleted: true,
  hero: {
    eyebrow: "Global Open Source Celebration · Concluded",
    headline: "Learn & build with",
    accent: " open-source AI.",
    body:
      "Hacktoberfest Hack Days are hands-on mini-hackathons based on Major League Hacking (MLH)'s Hack Days program. Organized by ECell and AWS SBG at RV University, 25 offline teams of 4 assembled on 31 October 2026 to build real solutions with open-source AI tools and open-weight models.",
  },
  about: {
    eyebrow: "About Hacktoberfest Hack Day",
    headline: "A month-long celebration of",
    accent: " open source.",
    description:
      "Hacktoberfest is a month-long celebration of open source throughout October. In 2026, the focus was on learning and building with open-source AI and open-weight models, both through in-person and online activities. MLH and DEV managed the event this year in partnership with our friends at DigitalOcean.\n\nThe event was open to students from all universities. Participants worked in small teams on projects involving open-source AI tools, open-weight AI models, AI-assisted developer tools, and practical applications of open-source technologies. Key themes included: Generative AI, AI agents, developer productivity, and other practical applications of open-source AI.",
    note:
      "This edition of Hacktoberfest Hack Day has successfully concluded. Organized by The Entrepreneurship Cell (ECell) and AWS SBG at RV University with 25 participating teams of 4 members each on 31 October 2026.",
  },
  format: "Two rounds — Online PPT Submission followed by Offline Presentation & Judging (25 teams of 4, 100 participants)",
  date: "31 October 2026",
  dateBadge: "COMPLETED · 31 OCT 2026 · RV UNIVERSITY, BENGALURU",
  venue: "RV University, Bengaluru",
  prizePool: "Swag, Prizes & Open Source Recognition",
  image: hacktoberPoster,
  imageIsPoster: true,
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
      label: "Dates",
      value: "31 October 2026",
    },
    {
      number: "05",
      label: "Venue",
      value: "RV University, Bengaluru (Offline Round 2)",
    },
    {
      number: "06",
      label: "Best UI/UX Award",
      value: "Hop Sync",
    },
  ],
  rounds: {
    headline: "Event Progression &",
    accent: " Format.",
    subhead:
      "Hacktoberfest Hack Day was conducted in two focused rounds designed to take ideas from concept to live defense.",
    items: [
      {
        number: "ROUND 01",
        badge: "Virtual Screening",
        title: "Online PPT Submission",
        type: "Online Submission",
        description:
          "Participants/teams submitted their project ideas and proposed solutions in the prescribed PPT format through the designated online submission platform. The submissions were evaluated by the organizing and judging team, and shortlisted teams advanced to the next round.",
      },
      {
        number: "ROUND 02",
        badge: "In-Person Hack & Pitch",
        title: "Offline Presentation & Judging",
        type: "Offline at RV University",
        description:
          "Shortlisted teams reported to RV University to build and present their projects in person before the judging panel. Teams demonstrated their solutions and explained their implementation, approach, impact, and scalability.",
      },
    ],
    expectedOutcomes: [
      "Practical experience in building with open-source AI technologies and open-weight models.",
      "Developing skills in GitHub, collaborative software development, rapid prototyping, and technical problem-solving.",
      "Encouraging students to contribute to and engage with the open-source ecosystem while building demonstrable projects.",
      "Interacting with peers and mentors, and fostering a stronger local developer community around open-source AI.",
    ],
    logisticsNotice:
      "Participants followed the RV University Code of Conduct and applicable event guidelines. Complimentary lunch was provided to all registered participants.",
  },
  winners: {
    headline: "Champions of",
    accent: " Hacktoberfest '26.",
    subhead:
      "Honoring the builders and teams who shipped standout open-source AI solutions at RV University.",
    items: [
      {
        place: "1ST PLACE",
        badge: "Grand Champion",
        teamName: "Pixel Forge",
        projectTitle: "Hacktoberfest '26 Grand Winners",
        description:
          "Secured first place with a standout open-source AI build — demoed and defended in front of the judging panel.",
        photoCaption: "Pixel Forge — 1st Place",
        photo: winnerPhoto,
      },
      {
        place: "2ND PLACE",
        badge: "First Runner-Up",
        teamName: "Niviko",
        projectTitle: "Hacktoberfest '26 First Runner-Up",
        description:
          "Delivered an impressive working solution during Hack Day, earning second place from the jury panel.",
        photoCaption: "Niviko — 2nd Place",
        photo: runnerUpPhoto,
      },
      {
        place: "3RD PLACE",
        badge: "Second Runner-Up",
        teamName: "Clover Dynamics",
        projectTitle: "Hacktoberfest '26 Second Runner-Up",
        description:
          "Secured third place with a strong open-source AI prototype built and presented at RV University.",
        photoCaption: "Clover Dynamics — 3rd Place",
        photo: secondRunnerUpPhoto,
      },
    ],
    badges: ["HACKTOBERFEST '26", "OPEN-SOURCE AI HACK DAY"],
  },
  sponsors: {
    headline: "Global Ecosystem &",
    accent: " Partners.",
    subhead:
      "Hacktoberfest was presented in partnership with industry leaders advancing open-source software and open-weight AI.",
    poweredBy: [
      {
        name: "MLH",
        tag: "Major League Hacking",
        logo: "https://cdn.simpleicons.org/majorleaguehacking/white",
      },
      {
        name: "DEV",
        tag: "dev.to Community",
        logo: "https://cdn.simpleicons.org/devdotto/white",
      },
    ],
    presenting: {
      name: "DigitalOcean",
      tag: "Presenting Partner",
      logo: "https://cdn.simpleicons.org/digitalocean/white",
    },
    list: [
      { name: "Tiger Data", logo: "https://cdn.simpleicons.org/databricks/white" },
      { name: "Snowflake", logo: "https://cdn.simpleicons.org/snowflake/white" },
      { name: "MongoDB", logo: "https://cdn.simpleicons.org/mongodb/white" },
      {
        name: "Gauge",
        logo: "https://bookface-images.s3.amazonaws.com/small_logos/8a1b74adcd6bfd4193d3eb1b786fb19988505e78.png",
      },
      { name: "Solana", logo: "https://cdn.simpleicons.org/solana/white" },
      { name: "Render", logo: "https://cdn.simpleicons.org/render/white" },
      { name: "GitHub", logo: "https://cdn.simpleicons.org/github/white" },
      { name: "Sentry", logo: "https://cdn.simpleicons.org/sentry/white" },
      { name: "backboard.io" },
      {
        name: "IBM",
        logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
      },
      { name: "ElevenLabs", logo: "https://cdn.simpleicons.org/elevenlabs/white" },
      { name: "paper compute co." },
      { name: "Entire" },
      { name: "PRIOR" },
      { name: "Google Cloud", logo: "https://cdn.simpleicons.org/googlecloud/white" },
      { name: "Gemma", logo: "https://cdn.simpleicons.org/google/white" },
      { name: "Qualcomm", logo: "https://cdn.simpleicons.org/qualcomm/white" },
      { name: "Arduino", logo: "https://cdn.simpleicons.org/arduino/white" },
      { name: "mastra", logo: "https://cdn.simpleicons.org/matrix/white" },
      { name: "Temporal", logo: "https://cdn.simpleicons.org/temporal/white" },
      { name: "TLDR" },
      { name: "THINKING MACHINES" },
    ],
  },
  organizers: [
    "RV University",
    "The Entrepreneurship Cell, RV University",
    "AWS SBG, RV University",
    "Major League Hacking (MLH)",
    "DEV",
    "DigitalOcean",
  ],
  contacts: [
    {
      name: "Nishit",
      phone: "+91 878 057 7400",
    },
    {
      name: "Pranav",
      phone: "+91 7645846602",
    },
  ],
  meta: {
    title: "Hacktoberfest '26 Hack Day | ECell RV University",
    description:
      "Hacktoberfest '26 Hack Day at RV University — hands-on mini-hackathon with open-source AI and open-weight models. Winners announced, event concluded.",
  },
};