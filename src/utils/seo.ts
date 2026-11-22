import { SITE_URL } from "./constants";

export interface BreadcrumbItem {
  name: string;
  path: string;
}

/**
 * Builds a schema.org BreadcrumbList JSON-LD object for subpages so search
 * engines can display breadcrumb trails and infer site hierarchy for sitelinks.
 */
export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.path === "/" ? `${SITE_URL}/` : `${SITE_URL}${item.path}`,
    })),
  };
}
