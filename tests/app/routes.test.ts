import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { getAllEventSlugs } from "@/src/data/eventsData";

const SITE_URL = "https://ecell-rvu.vercel.app";

describe("SEO routes", () => {
  it("allows crawlers and exposes the canonical sitemap", () => {
    const result = robots();
    expect(result.rules).toEqual([{ userAgent: "*", allow: "/" }]);
    expect(result.sitemap).toBe(`${SITE_URL}/sitemap.xml`);
    expect(result.host).toBe(SITE_URL);
  });

  it("lists every public page once, homepage first", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls[0]).toBe(SITE_URL);
    expect(urls).toEqual(
      expect.arrayContaining([
        `${SITE_URL}/events`,
        `${SITE_URL}/recruit`,
        ...getAllEventSlugs().map((slug) => `${SITE_URL}/events/${slug}`),
      ]),
    );
    expect(new Set(urls).size).toBe(urls.length);
    expect(entries[0]).toMatchObject({ changeFrequency: "weekly", priority: 1 });

    for (const entry of entries) {
      expect(entry.lastModified).toBeInstanceOf(Date);
      for (const image of entry.images ?? []) {
        expect(image.startsWith(`${SITE_URL}/`)).toBe(true);
        expect(image).not.toMatch(/\s/);
      }
      expect(new Set(entry.images).size).toBe(entry.images?.length ?? 0);
    }
  });
});
