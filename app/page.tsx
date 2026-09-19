"use client";

import { useState, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/src/utils/gsapSetup";
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
import Footer from "@/src/sections/Footer/Footer";
import FloatingLogo from "@/src/components/FloatingLogo/FloatingLogo";
import GameLauncher from "@/src/components/GameLauncher/GameLauncher";
import Team from "@/src/sections/Team/Team";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);

      const handleBeforeUnload = () => {
        window.scrollTo(0, 0);
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        ScrollTrigger.getAll().forEach((st) => st.kill());
        gsap.globalTimeline.clear();
      };
    }
  }, []);

  const handleLoaderComplete = () => {
    setLoading(false);
    if (typeof window !== "undefined") {
      let hasPendingScroll = Boolean(window.location.hash && window.location.hash.length > 1);
      try {
        if (!hasPendingScroll && sessionStorage.getItem("nav:pendingScrollTarget")) {
          hasPendingScroll = true;
        }
      } catch {
        // sessionStorage unavailable
      }

      if (!hasPendingScroll) {
        window.scrollTo(0, 0);
      }
      setTimeout(() => {
        if (!hasPendingScroll) {
          window.scrollTo(0, 0);
        }
        ScrollTrigger.refresh();
      }, 50);
    }
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
        <Footer />
      </HorizontalFlow>
    </main>
  );
}
