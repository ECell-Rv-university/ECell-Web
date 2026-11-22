import { describe, expect, it } from "vitest";
import nextConfig from "@/next.config";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { getAllEventSlugs } from "@/src/content/events";
import { buildBreadcrumbJsonLd } from "@/src/utils/seo";

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
        `${SITE_URL}/opportunities`,
        ...getAllEventSlugs().map((slug) => `${SITE_URL}/events/${slug}`),
      ]),
    );
    expect(urls).not.toContain(`${SITE_URL}/recruit`);
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

  it("permanently redirects removed /recruit and /pitch-e-thon routes", async () => {
    const redirects = await nextConfig.redirects!();
    const bySource = Object.fromEntries(redirects.map((r) => [r.source, r]));

    expect(bySource["/recruit"]).toMatchObject({ destination: "/", permanent: true });
    expect(bySource["/recruit/:path*"]).toMatchObject({ destination: "/", permanent: true });
    expect(bySource["/recuirt"]).toMatchObject({ destination: "/", permanent: true });
    expect(bySource["/join"]).toMatchObject({ destination: "/", permanent: true });
    expect(bySource["/recruitment"]).toMatchObject({ destination: "/", permanent: true });
    expect(bySource["/Pitch-e-thon"]).toMatchObject({ destination: "/events", permanent: true });
    expect(bySource["/events/pitch-e-thon"]).toMatchObject({ destination: "/events", permanent: true });
  });

  it("builds valid BreadcrumbList JSON-LD for subpages", () => {
    const ld = buildBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Events", path: "/events" },
    ]);
    expect(ld["@type"]).toBe("BreadcrumbList");
    expect(ld.itemListElement).toEqual([
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Events", item: `${SITE_URL}/events` },
    ]);
  });
});
