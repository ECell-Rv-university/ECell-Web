import type { CircularTestimonial } from "@/src/components/ui/circular-testimonials";
import ambikaPhoto from "@/src/assets/prevSpeakers/ambika.webp";
import arshdeepPhoto from "@/src/assets/prevSpeakers/arshdeep.webp";
import guhaPhoto from "@/src/assets/prevSpeakers/guha.webp";
import harpreetPhoto from "@/src/assets/prevSpeakers/harpreet.webp";
import shariffPhoto from "@/src/assets/prevSpeakers/shariff.webp";

export type Speaker = CircularTestimonial;

export const PREVIOUS_SPEAKERS: Speaker[] = [
  {
    name: "Harpreet Sohan",
    designation: "Creative Designer · Wand",
    quote:
      "Building enduring tech products requires obsessing over the user's unarticulated needs before writing a single line of code.",
    linkedinUrl: "https://www.linkedin.com/in/harpsquatch/",
    src: harpreetPhoto,
    imagePosition: "100% 28%",
  },
  {
    name: "Mustafa Shariff",
    designation: "Founder · Bengaluru Health Community",
    quote:
      "True entrepreneurship in healthcare isn't about disruption—it's about creating compassionate systems that scale.",
    linkedinUrl: "https://www.linkedin.com/in/mustafa-shariff-0a0577162/?skipRedirect=true",
    src: shariffPhoto,
    imagePosition: "40% 20%",
  },
  {
    name: "Arshdeep Singh",
    designation: "Founder & CEO · Edock, Decodes",
    quote:
      "Leadership in early-stage ventures is measured by how fast your team turns ambiguity into executable clarity.",
    linkedinUrl: "https://www.linkedin.com/in/065rsh/?skipRedirect=true",
    src: arshdeepPhoto,
    imagePosition: "100% 25%",
  },
  {
    name: "Ambika J",
    designation: "Director of Artificial Intelligence & IEEE Senior Member · Finastra",
    quote:
      "Scalable enterprise architecture is the foundation upon which global financial innovation is securely built.",
    linkedinUrl: "https://www.linkedin.com/in/ambikaj/",
    src: ambikaPhoto,
    imagePosition: "50% 30%",
  },
  {
    name: "Biplab Guha",
    designation: "Venture Architect & Entrepreneur · Stealth Mode",
    quote:
      "The quiet phase of stealth mode is where your core competitive moat is built away from market noise.",
    linkedinUrl: "https://www.linkedin.com/in/biplab-guha/?skipRedirect=true",
    src: guhaPhoto,
    imagePosition: "56% 24%",
  },
];
