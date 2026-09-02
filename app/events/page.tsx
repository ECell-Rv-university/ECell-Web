import type { Metadata } from "next";
import Nav from "@/src/sections/Nav/Nav";
import EventsArchive from "@/src/components/EventsArchive";
import PageTransition from "@/src/components/PageTransition/PageTransition";

const SITE_URL = "https://ecell-rvu.vercel.app";

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

export default function EventsPage() {
  return (
    <>
      <Nav />
      <EventsArchive />
      <PageTransition />
    </>
  );
}
