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
    id: "argonyx-hackathon",
    order: 2,
    dateLabel: "18 Sep 2025",
    title: "Argonyx Hackathon",
    content:
      "Students and builders gather to explore, build, and deploy ambitious technical solutions.",
  },
  {
    id: "winter-tech-talk",
    order: 3,
    dateLabel: "12 Dec 2025",
    title: "Winter Tech Talk",
    content:
      "Students come together to explore emerging technologies and the frameworks shaping what comes next.",
  },
  {
    id: "talk-startup-with-me",
    order: 4,
    dateLabel: "24 Mar 2026",
    title: "Talk Startup With Me",
    content:
      "Experienced founders share practical lessons from problem discovery through the first pitch.",
  },
  {
    id: "e-summit-26",
    order: 5,
    dateLabel: "2026 · Upcoming",
    title: "E-Summit ’26",
    content:
      "The campus entrepreneurship community comes together for conversations, connections, and new ventures.",
  },
  {
    id: "argonyx-26",
    order: 6,
    dateLabel: "Sep 2026",
    title: "Argonyx ’26",
    content:
      "The flagship hackathon returns for another high-energy build sprint for student creators and engineers.",
  },
];
