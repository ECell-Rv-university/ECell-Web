import type { Metadata } from "next";
import SubNav from "@/src/sections/Nav/SubNav";
import EventsArchive from "@/src/components/EventsArchive/EventsArchive";
import { SITE_URL } from "@/src/utils/constants";
import { buildBreadcrumbJsonLd } from "@/src/utils/seo";

export const metadata: Metadata = {
  title: "Events & Workshops",
  description:
    "Explore upcoming and past events hosted by ECell RV University — hackathons, tech talks, pitch competitions, and founder sessions in Bengaluru.",
  openGraph: {
    title: "Events & Workshops | ECell RV University",
    description:
      "Hackathons, tech talks, pitch competitions, and founder sessions for builders at RV University.",
    url: `${SITE_URL}/events`,
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "ECell RV University Events",
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Events & Workshops | ECell RV University",
    description:
      "Hackathons, tech talks, pitch competitions, and founder sessions for builders at RV University.",
  },
  alternates: {
    canonical: `${SITE_URL}/events`,
  },
};

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Home", path: "/" },
  { name: "Events & Workshops", path: "/events" },
]);

export default function EventsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <SubNav />
      <EventsArchive />
    </>
  );
}
