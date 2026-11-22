import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEventBySlug, getAllEventSlugs } from "@/src/content/events";
import { SITE_URL } from "@/src/utils/constants";
import { buildBreadcrumbJsonLd } from "@/src/utils/seo";
import EventDetailClient from "./EventDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllEventSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);

  if (!event) {
    return {
      title: "Event Not Found",
    };
  }

  return {
    // meta.title already ends with the site name, so skip the layout template.
    title: { absolute: event.meta.title },
    description: event.meta.description,
    openGraph: {
      title: event.meta.title,
      description: event.meta.description,
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
      title: event.meta.title,
      description: event.meta.description,
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

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Events", path: "/events" },
    { name: event.title, path: `/events/${event.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <EventDetailClient event={event} />
    </>
  );
}
