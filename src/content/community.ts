// Canned answers for the WhatsApp community chat demo. The first rule that
// matches a visitor's message wins; rules 2-6 also appear as suggestion chips.

export interface QAEntry {
  id: string;
  chipLabel: string;
  pattern: RegExp;
  reply: string;
}

export const COMMUNITY_QA_RULES: QAEntry[] = [
  {
    id: "greetings",
    chipLabel: "Say Hello",
    pattern: /\b(hi|hello|hey|yo|sup|greetings)\b/i,
    reply: "Hey there! 👋 Type any question about ECell, events, joining, or building your idea, and I'll be happy to help!",
  },
  {
    id: "about",
    chipLabel: "What is ECell?",
    pattern: /\b(what is|tell me about)\b.*\b(ecell|entrepreneurship cell)\b|\babout ecell\b/i,
    reply: "ECell RV University is the campus entrepreneurship community. We help students explore ideas, learn from founders, meet collaborators, and take their first steps towards building something impactful.",
  },
  {
    id: "join",
    chipLabel: "How to join?",
    pattern: /\b(join|register|registration|membership|how to join|where to register|sign up|volunteer)\b/i,
    reply: "Tap 'Join the community' above to join our official WhatsApp group! We share event registrations, core team recruitments, and collaboration opportunities directly in the community.",
  },
  {
    id: "events",
    chipLabel: "Upcoming events",
    pattern: /\b(event|events|workshop|workshops|talk|talks|session|sessions)\b/i,
    reply: "We're the driving force behind top entrepreneurial events at RVU! This year's lineup includes Kalpavikas, Pitch-e-thon, founder sessions, and workshops. Join our WhatsApp community to lock in your spot and never miss an update!",
  },
    {
    id: "eligibility",
    chipLabel: "Who can join?",
    pattern: /\b(who can|eligible|eligibility|can i|for who|who is it for|requirements)\b/i,
    reply: "Anyone at RV University curious about entrepreneurship can join! You don't need a startup or prior experience — just curiosity and a willingness to learn and build.",
  },
  {
    id: "benefits",
    chipLabel: "Why join?",
    pattern: /\b(what do|offer|benefits|why join|why ecell|why ecell|opportunity|opportunities)\b/i,
    reply: "ECell brings you founder talks, hands-on workshops, hackathons, pitch competitions, mentorship, and a vibrant builder community. It is the ultimate launchpad to turn your ideas into action.",
  },
  {
    id: "startup",
    chipLabel: "Have an idea?",
    pattern: /\b(idea|ideas|startup|startups|build|building|founder|founders|mentor|mentors|collaborate|co-founder|cofounder)\b/i,
    reply: "Have an idea or looking to start something? You don't need to have everything figured out yet. Share your idea in our community to find co-founders, access mentors, and start building!",
  },
  {
    id: "kalpavikas_dates",
    chipLabel: "Kalpavikas & Pitch-e-thon dates",
    pattern: /\b(when|date|dates|schedule|timing)\b.*\b(kalpavikas|pitch[-\s]?e[-\s]?thon)\b|\b(kalpavikas|pitch[-\s]?e[-\s]?thon)\b.*\b(when|date|dates|schedule|timing)\b/i,
    reply: "Event dates haven't been announced yet. Join our WhatsApp community for the latest dates and updates!",
  },
  {
  id: "kalpavikas_details",
  chipLabel: "About Kalpavikas",
  pattern: /\b(what is|about|tell me about)\b.*\bkalpavikas\b|\bkalpavikas\b.*\b(summit|event|fest)\b/i,
  reply: "Kalpavikas is RV University's flagship tech fest. It runs for two days and features events such as hackathons, founder talks, and much more. ECell hosts several of the events!",
  },
  {
  id: "pitchethon_details",
  chipLabel: "About Pitch-e-thon",
  pattern: /\b(what is pitch[-\s]?e[-\s]?thon|pitch competition|pitch contest|pitch event)\b/i,
  reply: "Pitch-e-thon is our high-energy startup pitch competition! Students pitch their ideas to a panel of founders and investors. It's a great way to test your idea, win prizes, and get real feedback. Exact dates will be announced in our WhatsApp community!",
  },
  {
    id: "cost",
    chipLabel: "Is it free?",
    pattern: /\b(cost|fee|fees|free|paid|payment|price|money|charge)\b/i,
    reply: "Joining the ECell WhatsApp community is 100% free! Core team membership is also free, while select flagship events may have a small registration fee.",
  },
  {
    id: "team",
    chipLabel: "Core Team",
    pattern: /\b(team|members|member|who runs|core team|lead|leaders|board)\b/i,
    reply: "ECell is student-led by a passionate team of builders and organizers at RV University. The core team has eight members: the Advisory Head, Advisor, President, Vice President, and team leads. You can meet them in the Team section.",
  },
  {
    id: "interested",
    chipLabel: "Get Involved",
    pattern: /\b(interested|get involved|want to participate)\b/i,
    reply: "Awesome! We'd love to have you onboard. Tap 'Join the community' above to hop into our official WhatsApp group and get involved right away.",
  },
  {
    id: "contact",
    chipLabel: "Contact & Socials",
    pattern: /\b(contact|reach|instagram|email|social|socials|handle|link|connect)\b/i,
    reply: "The fastest way to stay connected is by joining our WhatsApp group! You can also follow ECell RV University on Instagram and social channels for regular updates.",
  },
  {
    id: "ecell_general",
    chipLabel: "ECell Info",
    pattern: /\b(ecell|ecell)\b/i,
    reply: "ECell RV University is the campus entrepreneurship hub. Tap 'Join the community' to connect with fellow builders and stay updated on all upcoming opportunities!",
  },
];

export const COMMUNITY_DEFAULT_REPLY = "I can help with questions about ECell, joining the community, events, or building your startup idea. Type a question or tap one of the suggested topics below!";
