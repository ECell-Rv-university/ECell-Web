"use client";

import { useState } from "react";
import { refreshScroll, resetScrollToTop } from "@/src/utils/lenis";
import { hasPendingSectionTarget } from "@/src/sections/Nav/navUtils";
import Loader from "@/src/sections/Loader/Loader";
import Nav from "@/src/sections/Nav/Nav";
import Hero from "@/src/sections/Hero/Hero";
import About from "@/src/sections/About/About";
import WhyJoin from "@/src/sections/WhyJoin/WhyJoin";
import Story from "@/src/sections/Story/Story";
import Events from "@/src/sections/Events/Events";
import Sponsors from "@/src/sections/Sponsors/Sponsors";
import HorizontalFlow from "@/src/components/HorizontalFlow/HorizontalFlow";
import Speakers from "@/src/sections/Speakers/components/Speakers";
import WhatsAppCommunity from "@/src/sections/WhatsAppCommunity/WhatsAppCommunity";
import { CinematicFooter } from "@/src/components/ui/motion-footer";
import FloatingLogo from "@/src/components/FloatingLogo/FloatingLogo";
import GameLauncher from "@/src/components/GameLauncher/GameLauncher";
import Team from "@/src/sections/Team/Team";

export default function Home() {
  const [loading, setLoading] = useState(true);

  // Scroll restoration and the reset-to-top on navigation are handled once, by
  // the inline script in app/layout.tsx and by RouteScrollManager. This page
  // used to repeat both and additionally killed every ScrollTrigger in the app
  // on unmount, which tore down triggers owned by other components.

  const handleLoaderComplete = () => {
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
      <WhyJoin />
      <Story />
      <Team />
      <Events />
      <Sponsors />
      <HorizontalFlow>
        <Speakers />
        <WhatsAppCommunity />
      </HorizontalFlow>
      <CinematicFooter />
    </main>
  );
}
