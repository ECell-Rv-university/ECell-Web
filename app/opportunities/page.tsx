import type { Metadata } from "next";
import SubNav from "@/src/sections/Nav/SubNav";
import SiteCredit from "@/src/components/SiteCredit/SiteCredit";
import { SITE_URL } from "@/src/utils/constants";
import { buildBreadcrumbJsonLd } from "@/src/utils/seo";
import Globe, { type GlobeMarker } from "./_components/Globe";
import "./Opportunities.css";

// We point students to hackathons.fun rather than copying it: a short note on
// what it is, a link out, and credit to the people behind it.
const HACKATHONS_FUN = "https://hackathons.fun/";
const FIRECRAWL = "https://firecrawl.dev/";

// One red dot on home; tapping it goes to the same place as the main link.
const MARKERS: GlobeMarker[] = [
  { id: "bengaluru", title: "Bengaluru · find your next hackathon ↗", url: HACKATHONS_FUN, lat: 12.97, lng: 77.59 },
];

const description =
  "Looking for a hackathon? hackathons.fun lists open hackathons from many platforms in one place. ECell recommends it to every student who wants to build.";

export const metadata: Metadata = {
  title: "Opportunities",
  description,
  openGraph: {
    title: "Opportunities | ECell RV University",
    description,
    url: `${SITE_URL}/opportunities`,
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "ECell RV University Opportunities",
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Opportunities | ECell RV University",
    description,
  },
  alternates: {
    canonical: `${SITE_URL}/opportunities`,
  },
};

const POINTS = [
  { label: "Many sources", text: "Hackathons from platforms like Devpost, MLH and ETHGlobal, side by side." },
  { label: "No repeats", text: "An event posted on several platforms shows up once." },
  { label: "Honest prizes", text: "Prize money is shown only when the organisers publish it." },
];

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "Opportunities", path: "/opportunities" },
]);

export default function OpportunitiesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <SubNav />
      <main className="op-page">
        <section className="op-hero">
          <div className="op-hero-copy">
            <p className="op-eyebrow">
              <span />
              OPPORTUNITIES
            </p>
            <h1>
              Go build
              <br />
              <em>somewhere.</em>
            </h1>
            <p className="op-hero-intro">
              A hackathon is the fastest way to find a team, learn by shipping and get noticed. When
              you&apos;re looking for your next one, this is where we send you.
            </p>
          </div>
          <Globe markers={MARKERS} />
        </section>

        <div className="op-content">
          <section className="op-section" aria-labelledby="op-pick-title">
            <div className="op-section-head">
              <h2 id="op-pick-title">OUR PICK</h2>
              <span>EXTERNAL SITE</span>
            </div>

            <a className="op-feature" href={HACKATHONS_FUN} target="_blank" rel="noopener noreferrer">
              <span className="op-feature__name">
                hackathons<em>.fun</em>
                <span className="op-feature__arrow" aria-hidden="true">↗</span>
              </span>
              <span className="op-feature__text">
                One list of hackathons from across the web, so you don&apos;t have to check every
                platform yourself. Filter by what you like, open the event and register on its own
                page.
              </span>
              <span className="op-feature__cta">Browse hackathons</span>
            </a>

            <ul className="op-points">
              {POINTS.map((point) => (
                <li key={point.label}>
                  <h3>{point.label}</h3>
                  <p>{point.text}</p>
                </li>
              ))}
            </ul>
          </section>

          <p className="op-source">
            Credit: <a href={HACKATHONS_FUN} target="_blank" rel="noopener noreferrer">hackathons.fun</a>{" "}
            and everything on it belong to its makers, and it is powered by{" "}
            <a href={FIRECRAWL} target="_blank" rel="noopener noreferrer">Firecrawl</a>. ECell RV
            University is not affiliated with it; we link to it because it&apos;s useful. Always check
            dates and rules on each hackathon&apos;s own page.
          </p>
        </div>

        <SiteCredit />
      </main>
    </>
  );
}
