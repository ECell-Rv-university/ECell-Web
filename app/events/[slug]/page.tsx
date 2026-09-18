import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEventBySlug, getAllEventSlugs } from "@/src/data/eventsData";
import EventDetailClient from "./EventDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

const SITE_URL = "https://ecell-rvu.vercel.app";

export async function generateStaticParams() {
  const slugs = getAllEventSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  if (!event) {
    return {
      title: "Event Not Found | ECell RV University",
    };
  }

  return {
    title: event.metaTitle,
    description: event.metaDescription,
    openGraph: {
      title: event.metaTitle,
      description: event.metaDescription,
      url: `${SITE_URL}/events/${event.slug}`,
      images: [
        {
          url: "/og-image.webp",
          width: 1200,
          height: 630,
          alt: event.title,
          type: "image/webp",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: event.metaTitle,
      description: event.metaDescription,
    },
    alternates: {
      canonical: `${SITE_URL}/events/${event.slug}`,
    },
  };
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  return <EventDetailClient event={event} />;
}
