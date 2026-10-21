"use client";

import { useState, type MouseEvent } from "react";
import { refreshScroll, resetScrollToTop } from "@/src/utils/lenis";
import { hasPendingSectionTarget, navigateToSection } from "@/src/sections/Nav/navUtils";
import { SITE_LINKS } from "@/src/content/site";
import Loader from "@/src/sections/Loader/Loader";
import Nav from "@/src/sections/Nav/Nav";
import Hero from "@/src/sections/Hero/Hero";
import About from "@/src/sections/About/About";
import WhyJoin from "@/src/sections/WhyJoin/WhyJoin";
import Story from "@/src/sections/Story/Story";
import Events from "@/src/sections/Events/Events";
import Sponsors from "@/src/sections/Sponsors/Sponsors";
import HorizontalFlow from "@/src/components/HorizontalFlow/HorizontalFlow";
import Speakers from "@/src/sections/Speakers/Speakers";
import WhatsAppCommunity from "@/src/sections/WhatsAppCommunity/WhatsAppCommunity";
import HalftoneWordmarkFooter, { type FooterColumn } from "@/src/components/HalftoneWordmarkFooter/HalftoneWordmarkFooter";
import FloatingLogo from "@/src/components/FloatingLogo/FloatingLogo";
import { CraftedWithLove } from "@/src/components/SiteCredit/SiteCredit";
import GameLauncher from "@/src/components/GameLauncher/GameLauncher";
import Team from "@/src/sections/Team";

// The entry loader is an intro, not a per-mount effect: once it has played,
// coming back to "/" from another page (client-side navigation keeps this
// module alive) skips it. A full reload starts fresh and plays it again.
// The server always renders the loader, which matches a first client render.
let introPlayed = false;

const sectionLink = (label: string, target: string) => ({
  label,
  href: `#${target}`,
  onClick: (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    navigateToSection(target);
  },
});

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Explore",
    links: [sectionLink("About", "aboutSection"), sectionLink("Events", "eventsSection"), sectionLink("Speakers", "speakers")],
  },
  {
    title: "Community",
    links: [
      { label: "WhatsApp", href: SITE_LINKS.whatsappGroup },
      { label: "Instagram", href: SITE_LINKS.instagram },
      { label: "LinkedIn", href: SITE_LINKS.linkedin },
    ],
  },
];

export default function Home() {
  const [loading, setLoading] = useState(() => !introPlayed);

  // Scroll restoration and the reset-to-top on navigation are handled once, by
  // the inline script in app/layout.tsx and by RouteScrollManager. This page
  // used to repeat both and additionally killed every ScrollTrigger in the app
  // on unmount, which tore down triggers owned by other components.

  const handleLoaderComplete = () => {
    introPlayed = true;
    setLoading(false);

    // Only snap to the top when the visitor did not ask for a specific section.
    // Resetting unconditionally is what used to cancel `/#speakers` style deep
    // links right after the loader lifted.
    if (!hasPendingSectionTarget()) {
      resetScrollToTop();
    }

    // The loader curtain leaving changes layout, so pinned triggers need to
    // re-measure once it is gone.
    window.setTimeout(refreshScroll, 50);
  };

  return (
    <main>
      {loading && <Loader onComplete={handleLoaderComplete} />}
      <Nav />
      <FloatingLogo />
      <GameLauncher />
      <Hero />
      <About />
      <Events />
      <Speakers />
      <Sponsors />
      <WhyJoin />
      <Story />
      <HorizontalFlow>
        <Team />
        <WhatsAppCommunity />
      </HorizontalFlow>
      {/* id="footer" is the nav Chapters → Footer target. */}
      <div id="footer">
        <HalftoneWordmarkFooter
          wordmark="ecell"
          label="Entrepreneurship Cell · RV University"
          headline="Build what's next."
          tagline="A community of student founders turning ideas into ventures, one event, mentor and late-night build at a time."
          cta={{ label: SITE_LINKS.email, href: `mailto:${SITE_LINKS.email}` }}
          meta={
            <>
              © 2026 ECell RVU · <CraftedWithLove />
            </>
          }
          columns={FOOTER_COLUMNS}
          // Same as --bg (src/styles/global.css); the canvas needs a literal colour, not a var.
          palette={{ background: "#1a1a1a", ink: "#f4f4f2", warm: "#8edcff" }}
          fontFamily="var(--font-archivo), sans-serif"
          fontWeight={900}
          crop={0.18}
          bodyFamily="var(--font-inter), sans-serif"
          height="100dvh"
        />
      </div>
    </main>
  );
}
