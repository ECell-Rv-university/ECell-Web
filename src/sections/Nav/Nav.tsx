"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import LogoModal from "../../components/LogoModal/LogoModal";
import NavBar from "./NavBar";
import LogoHint from "./LogoHint";
export default function Nav(): React.ReactElement {
  const pathname = usePathname();
  const [isLogoModalOpen, setIsLogoModalOpen] = useState<boolean>(false);
  const [isLogoInNavOnHome, setIsLogoInNavOnHome] = useState<boolean>(false);
  const [isAboutVisible, setIsAboutVisible] = useState<boolean>(false);
  const [hasDismissedHint, setHasDismissedHint] = useState<boolean>(false);

  const handleLogoClick = () => {
    setIsLogoModalOpen(true);
    setHasDismissedHint(true);
  };

  useEffect(() => {
    if (pathname !== "/") return;

    const handleLogoInNav = (event: Event) => {
      const customEvent = event as CustomEvent<{ inNav?: boolean }>;
      setIsLogoInNavOnHome(Boolean(customEvent.detail?.inNav));
    };

    window.addEventListener("ecell:logo-in-nav", handleLogoInNav);

    return () => {
      window.removeEventListener("ecell:logo-in-nav", handleLogoInNav);
    };
  }, [pathname]);

  // Track the About section. The hint should ONLY appear during the About section
  // where the logo docks, and must NEVER bleed into subsequent sections like Events.
  useEffect(() => {
    if (pathname !== "/") return;

    const aboutEl = document.getElementById("aboutSection");
    if (!aboutEl || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsAboutVisible(entry.isIntersecting);
        // If user scrolls past the About section downward, permanently dismiss hint
        if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
          setHasDismissedHint(true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(aboutEl);
    return () => observer.disconnect();
  }, [pathname]);

  // Hint is home-only, visible ONLY while in the About section where the logo enters the nav.
  const showHint =
    pathname === "/" &&
    isLogoInNavOnHome &&
    isAboutVisible &&
    !hasDismissedHint &&
    !isLogoModalOpen;

  // Auto-dismiss after 4.5 seconds so it doesn't linger
  useEffect(() => {
    if (!showHint) return;

    const timer = window.setTimeout(() => {
      setHasDismissedHint(true);
    }, 4500);

    return () => window.clearTimeout(timer);
  }, [showHint]);

  return (
    <>
      <NavBar
        onLogoClick={handleLogoClick}
        logoHint={pathname === "/" ? <LogoHint visible={showHint} onClick={handleLogoClick} /> : undefined}
      />
      <LogoModal isOpen={isLogoModalOpen} onClose={() => setIsLogoModalOpen(false)} />
    </>
  );
}
