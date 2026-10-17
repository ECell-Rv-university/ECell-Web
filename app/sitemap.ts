import type { MetadataRoute } from "next";
import type { StaticImageData } from "next/image";
import { EVENTS_DATA } from "@/src/data/eventsData";
import { SITE_URL } from "@/src/utils/constants";

// The sitemap is generated at build time, so this is the deploy date.
const lastModified = new Date();

// Static imports resolve to hashed /_next/static/media paths. Image sitemaps
// need absolute, URL-encoded locations (several asset filenames have spaces).
function imageUrl(image: StaticImageData | string): string {
  const path = typeof image === "string" ? image : image.src;
  return new URL(encodeURI(path), SITE_URL).href;
}

function imageUrls(images: (StaticImageData | string)[]): string[] {
  return [...new Set(images.map(imageUrl))];
}

export default function sitemap(): MetadataRoute.Sitemap {
  const events = Object.values(EVENTS_DATA);

  const eventEntries: MetadataRoute.Sitemap = events.map((event) => ({
    url: `${SITE_URL}/events/${event.slug}`,
    lastModified,
    // Upcoming events change (dates, rounds, registration); completed ones settle.
    changeFrequency: event.isCompleted ? "monthly" : "weekly",
    priority: event.isCompleted ? 0.7 : 0.8,
    images: imageUrls([
      event.image,
      ...(event.winners ?? []).flatMap((winner) =>
        winner.photo ? [winner.photo] : [],
      ),
    ]),
  }));

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
      images: [`${SITE_URL}/og-image.webp`, `${SITE_URL}/logo-512.webp`],
    },
    {
      url: `${SITE_URL}/events`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
      images: imageUrls(events.map((event) => event.image)),
    },
    ...eventEntries,
    {
      url: `${SITE_URL}/recruit`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
      images: [`${SITE_URL}/og-image.webp`],
    },
  ];
}
