// src/data/recruitment.ts
//
// Everything the /recruit page shows lives here. The teams, team questions,
// dates, steps and FAQ below are PLACEHOLDER copy: replace them with the real
// drive details before announcing recruitment. Flip `isOpen` to close
// applications without touching any page code.

import type { StaticImageData } from "next/image";
import hiringPoster from "../assets/joinus/hiring_poster.webp";

export interface RecruitmentQuestion {
  /** Part of the form field name; keep it unique within its team. */
  id: string;
  /** Also the column header in the team's sheet tab. */
  label: string;
  type: "text" | "textarea" | "url" | "select" | "checkboxes" | "rating";
  required: boolean;
  placeholder?: string;
  /** Shown under the label, for guidance the label is too short to give. */
  description?: string;
  /** Choices for select, checkboxes, and rating fields. */
  options?: string[];
}

export interface RecruitmentTeam {
  /** Used in form field names; keep it stable once applications start arriving. */
  id: string;
  /** Also the name of the team's tab in the sheet. */
  name: string;
  /** One-liner from the recruitment announcement. */
  tagline: string;
  description: string;
  /** Shown as a bullet list on the team's card. */
  responsibilities: string[];
  skills: string[];
  /** Asked on step 2 to applicants who pick this team. */
  questions: RecruitmentQuestion[];
}

export interface RecruitmentSection {
  title: string;
  questions: RecruitmentQuestion[];
}

export interface RecruitmentStep {
  title: string;
  description: string;
}

export interface RecruitmentFaq {
  question: string;
  answer: string;
}

export const RECRUITMENT = {
  isOpen: true,
  season: "Recruitment 2026",
  /** Shown as-is on the page. */
  deadline: "24 October 2026",
  contactEmail: "club_ecell@rvu.edu.in",
  /** Hero poster, imported from src/assets. */
  poster: hiringPoster as StaticImageData,
} as const;

/**
 * Asked of every applicant on the last step, after their team's questions.
 * Answers are saved with the team's other answers, so question ids here must
 * not clash with any team's own question ids.
 */
export const RECRUITMENT_FINAL_SECTIONS: RecruitmentSection[] = [
  {
    title: "Commitment & availability",
    questions: [
      {
        id: "weekly_hours",
        label: "How many hours per week can you commit to ECell?",
        type: "select",
        required: true,
        options: ["1–2 hours", "3–5 hours", "6+ hours"],
      },
      {
        id: "availability",
        label: "Are you available for regular team meetings and on-ground events?",
        type: "select",
        required: true,
        options: ["Yes", "No", "Sometimes"],
      },
      {
        id: "clashes",
        label: "Do you have any known clashes coming up (exams, other commitments)? (If none, write \"Nil\")",
        type: "text",
        required: true,
      },
      {
        id: "anything_else",
        label: "Anything else you would like us to know?",
        type: "textarea",
        required: false,
      },
    ],
  },
  {
    title: "Acknowledgement",
    questions: [
      {
        id: "confirm_accurate",
        label: "I confirm that the above information is true to the best of my knowledge, and I have carefully read and filled out this form.",
        type: "checkboxes",
        required: true,
        options: ["Yes, I agree"],
      },
      {
        id: "confirm_mismatch",
        label: "I understand that any mismatch in the information provided will result in strict action.",
        type: "checkboxes",
        required: true,
        options: ["Yes, I agree"],
      },
    ],
  },
];

export const RECRUITMENT_TEAMS: RecruitmentTeam[] = [
  {
    id: "pr",
    name: "PR, Sponsorship & Engagement",
    tagline: "Be the voice of ECell.",
    description: "The voice of ECell to the outside world.",
    responsibilities: [
      "Reach out to startups, founders, companies and alumni for talks and workshops",
      "Handle sponsorships and partnerships (proposals, emails, follow-ups)",
      "Coordinate with other clubs and colleges for collaborations",
      "Represent ECell at events and networking sessions",
    ],
    skills: ["Communication", "Public speaking", "Networking"],
    questions: [
      {
        id: "experience",
        label: "Do you have prior experience in communications, outreach or collaborations? (Clubs, events, sponsorship outreach, etc.)",
        type: "textarea",
        required: true,
      },
      {
        id: "networkingComfort",
        label: "How comfortable are you with networking and communicating with external organizations?",
        type: "select",
        required: true,
        options: ["Very Comfortable", "Comfortable", "Somewhat Comfortable", "Not Comfortable"],
      },
      {
        id: "sponsorshipExperience",
        label: "Have you ever worked on sponsorship or partnership outreach before?",
        type: "select",
        required: true,
        options: ["Yes", "No"],
      },
      {
        id: "outreachTools",
        label: "What tools or platforms have you used for communication and outreach?",
        type: "checkboxes",
        required: true,
        options: ["Email", "LinkedIn", "WhatsApp", "Instagram", "Other"],
      },
      {
        id: "confidence",
        label: "Rate your communication & networking confidence",
        type: "rating",
        required: true,
        options: ["1", "2", "3", "4", "5"],
      },
    ],
  },
  {
    id: "social",
    name: "Social Media & Content Creation",
    tagline: "Make ECell impossible to scroll past.",
    description: "Runs ECell's online presence, from posting to the ideas behind every post.",
    responsibilities: [
      "Manage Instagram, LinkedIn and other pages",
      "Write captions, scripts and plan reels/content",
      "Track engagement and grow the audience",
      "Work with the Design Team to bring ideas to life",
    ],
    skills: ["Reels", "Copywriting", "Trends"],
    questions: [
      {
        id: "platforms",
        label: "Which social media platforms do you use frequently?",
        type: "checkboxes",
        required: true,
        options: ["Instagram", "LinkedIn", "Twitter/X", "YouTube", "Other"],
      },
      {
        id: "contentPreference",
        label: "What type of content do you enjoy creating the most?",
        type: "select",
        required: true,
        options: ["Blogs / Articles", "Event Promotions", "Video Scripts", "Reels / Short Content"],
      },
      {
        id: "managementExperience",
        label: "Do you have experience managing social media pages for clubs, businesses, or personal brands?",
        type: "select",
        required: true,
        options: ["Yes", "No"],
      },
      {
        id: "contentLinks",
        label: "Share links to any pages, posts, or content you have created. (If none, write \"Nil.\")",
        type: "textarea",
        required: false,
      },
      {
        id: "metricsComfort",
        label: "How comfortable are you with analyzing engagement metrics (reach, impressions, analytics)?",
        type: "select",
        required: true,
        options: ["Beginner", "Intermediate", "Advanced"],
      },
      {
        id: "studentContent",
        label: "What type of content do you think performs best for student communities?",
        type: "textarea",
        required: true,
      },
      {
        id: "brainstormingComfort",
        label: "How comfortable are you with brainstorming new content ideas?",
        type: "select",
        required: true,
        options: ["Very Comfortable", "Comfortable", "Somewhat Comfortable", "Not Comfortable"],
      },
      {
        id: "creativeIdeation",
        label: "Rate your creative ideation & brainstorming ability",
        type: "rating",
        required: true,
        options: ["1", "2", "3", "4", "5"],
      },
    ],
  },

  {
    id: "design",
    name: "Design",
    tagline: "Turn ideas into visuals.",
    description: "Gives ECell its look and feel.",
    responsibilities: [
      "Create posters, banners, social media creatives and event branding",
      "Keep colours, fonts and style consistent across everything ECell puts out",
      "Deliver designs on time before events and campaigns",
      "Work closely with the Social Media and Content teams",
    ],
    skills: ["Figma", "Branding", "Motion"],
    questions: [
      {
        id: "designCritique",
        label: "Pick a poster or social media post you like, from any brand, club or event. What makes it work?",
        description: "Add a link to it if you can.",
        type: "textarea",
        required: true,
      },
      {
        id: "designWork",
        label: "Portfolio",
        // description: "Share a Google Drive, Behance, Figma, Instagram, or portfolio link. Make sure it is viewable by anyone.",
        type: "url",
        required: true,
        placeholder: "https://",
      },
      {
        id: "tools",
        label: "Which design tools are you familiar with?",
        type: "checkboxes",
        required: true,
        options: [
          "Canva",
          "Figma",
          "Adobe Photoshop",
          "Adobe Illustrator",
          "Other",
        ],
      },
      {
        id: "experience",
        label: "Have you designed materials for events or organizations before?",
        type: "select",
        required: true,
        options: ["Yes", "No"],
      },
      {
        id: "deadline_comfort",
        label:
          "How comfortable are you with creating posters or promotional material under deadlines?",
        type: "select",
        required: true,
        options: [
          "Very Comfortable",
          "Comfortable",
          "Somewhat Comfortable",
          "Not Comfortable",
        ],
      },
      {
        id: "collaboration",
        label:
          "Are you comfortable collaborating with the Content Creation and Social Media teams for creative outputs?",
        type: "select",
        required: true,
        options: ["Yes", "No"],
      },
      {
        id: "deadline_rating",
        label: "Rate your ability to work under deadlines",
        type: "rating",
        required: true,
        options: ["1", "2", "3", "4", "5"],
      },
    ],
  },

  {
    id: "photography",
    name: "Photography",
    tagline: "Capture every moment that matters.",
    description: "Shoots everything ECell does, on stage and behind the scenes.",
    responsibilities: [
      "Cover events, talks, workshops and meetups with photos",
      "Shoot candid and behind-the-scenes moments for social media",
      "Select, edit and deliver photos soon after each event",
      "Keep ECell's photo archive organised and easy to find",
    ],
    skills: ["Photography", "Composition", "Lightroom"],
    questions: [
      {
        id: "equipment",
        label: "What do you shoot with?",
        type: "checkboxes",
        required: true,
        options: ["DSLR", "Mirrorless", "Smartphone", "Other"],
      },
      {
        id: "cameraAtEvents",
        label: "Do you have a camera (DSLR or mirrorless)? If yes, would you be able to bring it to RVU events?",
        type: "select",
        required: true,
        options: [
          "Yes, and I can bring it to events",
          "Yes, but I can't always bring it",
          "No, I don't have one",
        ],
      },
      {
        id: "experience",
        label: "Have you covered events before? (Fests, club events, weddings, etc.)",
        type: "select",
        required: true,
        options: ["Yes", "No"],
      },
      {
        id: "portfolio",
        label: "Link to your portfolio or photos you've taken",
        description: "A Google Drive folder, Instagram page or website. Make sure the link is viewable by anyone.",
        type: "url",
        required: true,
        placeholder: "https://",
      },
      {
        id: "editingTools",
        label: "Which tools do you use to edit your photos?",
        type: "checkboxes",
        required: true,
        options: ["Lightroom", "Photoshop", "Snapseed", "VSCO", "None", "Other"],
      },
      {
        id: "turnaround",
        label: "How quickly can you usually deliver edited photos after an event?",
        type: "select",
        required: true,
        options: ["Same day", "Within 2 days", "Within a week", "More than a week"],
      },
      {
        id: "photoRating",
        label: "Rate your photography skills",
        type: "rating",
        required: true,
        options: ["1", "2", "3", "4", "5"],
      },
    ],
  },

  {
    id: "editing",
    name: "Video Editing",
    tagline: "Cut raw footage into stories.",
    description: "Turns event footage into reels, aftermovies and promos.",
    responsibilities: [
      "Edit reels, event highlights and aftermovies",
      "Make promo videos and teasers ahead of events",
      "Add music, captions, transitions and motion graphics",
      "Work with the Social Media and Photography teams on what to post",
    ],
    skills: ["Premiere Pro", "Storytelling", "Reels"],
    questions: [
      {
        id: "tools",
        label: "Which editing tools are you familiar with?",
        type: "checkboxes",
        required: true,
        options: [
          "Adobe Premiere Pro",
          "DaVinci Resolve",
          "Final Cut Pro",
          "After Effects",
          "CapCut",
          "Other",
        ],
      },
      {
        id: "videoTypes",
        label: "What kind of videos do you enjoy editing the most?",
        type: "checkboxes",
        required: true,
        options: ["Reels / short-form", "Event aftermovies", "Promos and teasers", "Interviews and talks", "Motion graphics", "Other"],
      },
      {
        id: "portfolio",
        label: "Link to videos you've edited",
        description: "A Google Drive folder, YouTube channel or Instagram page. Make sure the link is viewable by anyone.",
        type: "url",
        required: true,
        placeholder: "https://",
      },
      {
        id: "deadline_comfort",
        label: "How comfortable are you with delivering edits under tight deadlines?",
        type: "select",
        required: true,
        options: ["Very Comfortable", "Comfortable", "Somewhat Comfortable", "Not Comfortable"],
      },
      {
        id: "editingRating",
        label: "Rate your video editing skills",
        type: "rating",
        required: true,
        options: ["1", "2", "3", "4", "5"],
      },
    ],
  },


  {
    id: "documentation",
    name: "Documentation",
    tagline: "Keep the story of ECell alive.",
    description: "Keeps the official record of everything ECell does.",
    responsibilities: [
      "Take notes and capture details during events and meetings",
      "Write post-event reports (attendance, highlights, outcomes, learnings)",
      "Maintain minutes of meetings, records and shared files",
      "Support the team with letters, proposals and paperwork when needed",
    ],
    skills: ["Writing", "Organisation", "Attention to detail"],
    questions: [
      {
        id: "summary",
        label: "Summarise a talk, lecture or event you attended recently in 3–4 lines.",
        type: "textarea",
        required: true,
      },
      {
        id: "experience",
        label: "Do you have experience in writing reports or maintaining documentation?",
        type: "select",
        required: true,
        options: ["Yes", "No"],
      },
      {
        id: "writingComfort",
        label: "How comfortable are you with writing structured reports and summaries?",
        type: "select",
        required: true,
        options: ["Very Comfortable", "Comfortable", "Somewhat Comfortable", "Not Comfortable"],
      },
      {
        id: "tools",
        label: "Which tools have you used for documentation?",
        type: "checkboxes",
        required: true,
        options: [
          "Notion",
          "Microsoft Word",
          "Google Docs",
          "Other",
        ],
      },
    ],
  },

  {
    id: "tech",
    name: "Tech",
    tagline: "Build the digital backbone.",
    description: "Builds and maintains ECell's digital side.",
    responsibilities: [
      "Develop and update the ECell website",
      "Build tools for event registrations, forms and automation",
      "Manage data and digital platforms",
      "Handle tech support at events",
    ],
    skills: ["Web dev", "Automation", "Problem solving"],
    questions: [
      {
        id: "built",
        label: "Tell us about something you've built or worked on: code, design, a club project, anything.",
        description:
          "Haven't built anything yet? Tell us about something technical you tried to learn, or what you want to build.",
        type: "textarea",
        required: true,
      },
      {
        id: "github",
        label: "GitHub profile",
        type: "url",
        required: true,
        placeholder: "https://github.com/…",
      },
      {
        id: "liveProject",
        label: "Link to a live project you've built",
        description: "A deployed site, app or bot we can try out.",
        type: "url",
        required: false,
        placeholder: "https://",
      },
      {
        id: "stack",
        label: "Which languages or frameworks are you comfortable with?",
        type: "checkboxes",
        required: true,
        options: [
          "HTML & CSS",
          "JavaScript / TypeScript",
          "React",
          "Next.js",
          "Node.js",
          "Python",
          "SQL / databases",
          "None yet",
          "Other",
        ],
      },
      {
        id: "interests",
        label: "What kind of tech work interests you most?",
        type: "checkboxes",
        required: true,
        options: [
          "Frontend and UI",
          "Backend and APIs",
          "Automation: forms, bots, sheets",
          "Data and dashboards",
          "Event tech support",
          "Other",
        ],
      },
      {
        id: "git",
        label: "How comfortable are you with Git and GitHub?",
        type: "select",
        required: true,
        options: [
          "Never used them",
          "Basic: clone, commit, push",
          "Comfortable: branches and pull requests",
          "Advanced: rebasing, resolving conflicts, reviewing code",
        ],
      },
      {
        id: "websiteLike",
        label: "What do you like about the current ECell website?",
        type: "textarea",
        required: true,
      },
      {
        id: "websiteImprovement",
        label: "What's one thing you'd improve on the current ECell website?",
        type: "text",
        required: true,
        placeholder: "A short suggestion",
      },
      {
        id: "webRating",
        label: "Rate your web development skills",
        type: "rating",
        required: true,
        options: ["1", "2", "3", "4", "5"],
      },
    ],
  },
];

export const RECRUITMENT_YEARS = ["1st year", "2nd year", "3rd year", "4th year"] as const;

export const RECRUITMENT_STEPS: RecruitmentStep[] = [
  {
    title: "Apply",
    description: "Fill in the form below. It takes about five minutes.",
  },
  {
    title: "Shortlisting",
    description: "The team reads every application and shortlists candidates. You'll hear from us by email.",
  },
  {
    title: "Interview",
    description: "Interview with the Core Team",
  },
  {
    title: "Onboarding",
    description: "Meet the cell, get your team and start working on the next event.",
  },
];

/** The steps after applying; the page counts these as rounds. */
export const RECRUITMENT_FAQ: RecruitmentFaq[] = [
  {
    question: "Who can apply?",
    answer:
      "Any RV University student from any school or year. You don't need a startup or prior experience.",
  },
  {
    question: "Can I apply to more than one team?",
    answer:
      "No, each application is for one team, so pick the one you most want to join.",
  },
  {
    question: "How much time should I give to ECell?",
    answer:
      "Around 4 to 6 hours a week on average, more in the weeks before a big event.",
  },
  {
    question: "When will I hear back?",
    answer:
      "Within a week of the deadline. Everyone who applies gets a reply, whatever the result.",
  },
];

/**
 * Painfully obvious "facts", shown one at a time in random order while an
 * application is saving.
 */
export const RECRUITMENT_LOADING_LINES: string[] = [
  "You can't see anything while your eyes are closed.",
  "You can't speak when your mouth is shut.",
  "You can't hum while holding your nose. Don't try it right now.",
  "If you're reading this, you can read.",
  "Every minute you spend waiting is exactly sixty seconds long.",
  "You have never been older than you are right now.",
  "Tomorrow is always one day away.",
  "You're breathing manually now. You're welcome.",
  "Your tongue is resting in your mouth. You can feel it now, can't you?",
  "You can't lick your own elbow. Go on, try.",
  "100% of people who drink water eventually die.",
  "You're blinking right now. You just noticed, didn't you?",
];

export function getTeamById(id: string): RecruitmentTeam | undefined {
  return RECRUITMENT_TEAMS.find((team) => team.id === id);
}

/** Every question a team asks, in form order, final sections included. */
export function teamQuestions(team: RecruitmentTeam): RecruitmentQuestion[] {
  return [...team.questions, ...RECRUITMENT_FINAL_SECTIONS.flatMap((section) => section.questions)];
}
