import type { Metadata, Viewport } from "next";
import { Anton, Archivo, Bebas_Neue, Fraunces, Inter } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import PageTransition from "@/src/components/PageTransition/PageTransition";
import RouteScrollManager from "@/src/components/RouteScrollManager/RouteScrollManager";
import SmoothScroll from "@/src/components/SmoothScroll/SmoothScroll";
import { SITE_URL } from "@/src/utils/constants";
import { SITE_LINKS } from "@/src/content/site";
import "lenis/dist/lenis.css";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

// Closest free match to Coign 87 Bold used on charlesleclerc.com's quote.
const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas-neue",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#000000",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "ECell RV University | Entrepreneurship Cell & Startup Community",
    template: "%s | ECell RV University",
  },
  description:
    "ECell RV University is the official entrepreneurship cell at RV University, Bengaluru. We build a thriving campus community for founders, innovators, and future entrepreneurs through events, mentorship, and startup resources.",
  applicationName: "ECell RV University",
  keywords: [
    "ECell",
    "ecell",
    "Ecell",
    "ECell RV University",
    "ecell rv university",
    "Ecell RV University",
    "ECell RVU",
    "ecell rvu",
    "Ecell RVU",
    "ECell rvu",
    "ECell RV",
    "ecell rv",
    "Ecell RV",
    "ECell RVCE",
    "ecell rvce",
    "Ecell RVCE",
    "ECell rvce",
    "ecell RVCE",
    "entrepreneurship cell",
    "RV University",
    "RV University entrepreneurship",
    "startup community Bengaluru",
    "student entrepreneurs India",
    "innovation cell",
    "founders",
    "Bengaluru startups",
    "college entrepreneurship",
    "startup events Bengaluru",
    "student startup community",
  ],
  authors: [{ name: "ECell RV University", url: SITE_URL }],
  creator: "ECell RV University",
  publisher: "ECell RV University",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    siteName: "ECell RV University",
    title: "ECell RV University | Building What's Next",
    description:
      "Building ideas, backing founders, and growing a community of entrepreneurs at RV University, Bengaluru.",
    url: SITE_URL,
    locale: "en_IN",
    images: [
      {
        url: "/og-image.webp",
        width: 1200,
        height: 630,
        alt: "ECell RV University - Official Entrepreneurship Cell of RV University",
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ECell RV University | Building What's Next",
    description:
      "The official entrepreneurship cell at RV University — for founders, innovators, and future entrepreneurs.",
    images: ["/og-image.webp"],
    creator: "@ecell_rvu",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-16x16.webp", sizes: "16x16", type: "image/webp" },
      { url: "/favicon-32x32.webp", sizes: "32x32", type: "image/webp" },
      { url: "/favicon-48x48.webp", sizes: "48x48", type: "image/webp" },
      { url: "/favicon-96x96.webp", sizes: "96x96", type: "image/webp" },
    ],
    shortcut: "/favicon-48x48.webp",
    apple: [
      { url: "/apple-touch-icon.webp", sizes: "180x180", type: "image/webp" },
    ],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "ECell RVU",
    statusBarStyle: "black-translucent",
  },
  category: "education",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: "ECell RV University",
      alternateName: [
        "ECell",
        "ECell RVU",
        "ECell RV",
        "Entrepreneurship Cell RV University",
      ],
      description:
        "The official entrepreneurship cell at RV University, Bengaluru.",
      keywords:
        "ECell, ecell, Ecell, ECell RVU, ecell rvu, Ecell RVU, ECell RV University, ecell rv university, ECell RV, ecell rv, ECell RVCE, ecell rvce, Ecell RVCE, ECell rvce",
      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },
      inLanguage: "en-IN",
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "ECell RV University",
      alternateName: [
        "ECell",
        "ECell RVU",
        "ECell RV",
        "Entrepreneurship Cell RV University",
      ],
      url: `${SITE_URL}/`,
      logo: {
        "@type": "ImageObject",
        "@id": `${SITE_URL}/#logo`,
        url: `${SITE_URL}/logo-512.webp`,
        contentUrl: `${SITE_URL}/logo-512.webp`,
        caption: "ECell RV University Logo",
        width: 512,
        height: 512,
      },
      image: `${SITE_URL}/og-image.webp`,
      description:
        "The official entrepreneurship cell at RV University, Bengaluru — building a thriving campus community for founders, innovators, and future entrepreneurs.",
      email: SITE_LINKS.email,
      foundingDate: "2023",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bengaluru",
        addressRegion: "Karnataka",
        addressCountry: "IN",
      },
      parentOrganization: {
        "@type": "CollegeOrUniversity",
        name: "RV University",
        url: "https://www.rvu.edu.in",
      },
      sameAs: [
        SITE_LINKS.instagram,
        SITE_LINKS.linkedin,
      ],
    },
    {
      "@type": "SiteNavigationElement",
      "@id": `${SITE_URL}/#navigation`,
      name: "Primary Navigation",
      hasPart: [
        {
          "@type": "WebPage",
          name: "Events & Workshops",
          description: "Hackathons, tech talks, and founder sessions hosted by ECell RV University.",
          url: `${SITE_URL}/events`,
        },
        {
          "@type": "WebPage",
          name: "Opportunities",
          description: "Curated hackathons and builder opportunities recommended by ECell RV University.",
          url: `${SITE_URL}/opportunities`,
        },
        {
          "@type": "WebPage",
          name: "E-Summit",
          description: "ECell RV University's flagship entrepreneurship summit.",
          url: `${SITE_URL}/events/e-summit`,
        },
        {
          "@type": "WebPage",
          name: "Hacktoberfest '26",
          description: "Open-source AI mini-hackathon hosted by ECell and AWS SBG RVU.",
          url: `${SITE_URL}/events/hacktoberfest-26`,
        },
        {
          "@type": "WebPage",
          name: "Argonyx '26",
          description: "24-hour national hackathon by ECell RV University.",
          url: `${SITE_URL}/events/argonyx-26`,
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // NOTE: no `data-scroll-behavior="smooth"` on <html>. That attribute only
  // exists to let the router neutralise CSS `scroll-behavior: smooth`, and
  // smooth scrolling is owned by Lenis now (see src/utils/lenis.ts). Keeping it
  // would add the router as yet another writer of html.style.scrollBehavior.
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${anton.variable} ${archivo.variable} ${bebasNeue.variable} ${fraunces.variable} ${inter.variable}`}
        suppressHydrationWarning
      >
        <Script
          id="json-ld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Script
          id="scroll-restoration"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                if ('scrollRestoration' in history) {
                  history.scrollRestoration = 'manual';
                }
                // A reload should land on the hero, not jump back to the
                // section a nav link left in the URL (e.g. /#speakers). Fresh
                // visits to a #hash link still deep-link as before.
                try {
                  var nav = performance.getEntriesByType('navigation')[0];
                  if (nav && nav.type === 'reload') {
                    if (location.hash) {
                      history.replaceState(history.state, '', location.pathname + location.search);
                    }
                    sessionStorage.removeItem('nav:pendingScrollTarget');
                  }
                } catch (e) {}
                window.scrollTo(0, 0);
                window.addEventListener('beforeunload', function() {
                  window.scrollTo(0, 0);
                });
              }
            `,
          }}
        />
        <SmoothScroll />
        <RouteScrollManager />
        {children}
        <PageTransition />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
