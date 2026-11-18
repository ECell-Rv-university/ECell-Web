// Milestones shown in the About section's horizontal journey, oldest first.

export type TimelineItem = {
  id: string;
  order: number;
  dateLabel: string;
  title: string;
  content: string;
};

export const TIMELINE: TimelineItem[] = [
  {
    id: "ecell-created",
    order: 1,
    dateLabel: "2023",
    title: "ECell RVU is created",
    content:
      "A student-led home for founders, builders, and ambitious ideas begins at RV University.",
  },
  {
    id: "hack-to-hackathon",
    order: 2,
    dateLabel: "30 Aug 2023",
    title: "Hack to Hackathon",
    content:
      "Our first campus hackathon sparks hands-on building, rapid prototyping, and peer collaboration at RVU.",
  },
  {
    id: "argonyx-hackathon",
    order: 3,
    dateLabel: "10 Oct 2025",
    title: "Argonyx ’25",
    content:
      "Students and builders gather to explore, build, and deploy ambitious technical solutions.",
  },
  {
    id: "talk-startup-with-me",
    order: 4,
    dateLabel: "17 Oct 2025",
    title: "Talk Startup With Me",
    content:
      "Experienced founders share practical lessons from problem discovery through the first pitch.",
  },
  {
    id: "winter-tech-talk",
    order: 5,
    dateLabel: "20 Feb 2026",
    title: "Winter Tech Talk",
    content:
      "Students come together to explore emerging technologies and the frameworks shaping what comes next.",
  },
  {
    id: "argonyx-26",
    order: 6,
    dateLabel: "25 Sep 2026",
    title: "Argonyx ’26",
    content:
      "The flagship hackathon returns for another high-energy build sprint for student creators and engineers.",
  },
  {
    id: "hacktoberfest-26",
    order: 7,
    dateLabel: "31 Oct 2026",
    title: "Hacktoberfest Hack Day",
    content:
      "25 teams gather with ECell and AWS SBG RVU to build real solutions with open-source AI tools and open-weight models.",
  },
  {
    id: "e-summit-26",
    order: 8,
    dateLabel: "2026 · Upcoming",
    title: "E-Summit ’26",
    content:
      "The campus entrepreneurship community comes together for conversations, connections, and new ventures.",
  },
];
