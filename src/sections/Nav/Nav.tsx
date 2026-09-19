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

  // Hint is home-only: never shown on any other route, even if this Nav is imported there.
  const showHint =
    pathname === "/" && isLogoInNavOnHome && !hasDismissedHint && !isLogoModalOpen;

  return (
    <>
      <NavBar
        onLogoClick={handleLogoClick}
        logoHint={<LogoHint visible={showHint} onClick={handleLogoClick} />}
      />
      <LogoModal isOpen={isLogoModalOpen} onClose={() => setIsLogoModalOpen(false)} />
    </>
  );
}
