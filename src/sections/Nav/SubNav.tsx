"use client";
import React, { useState } from "react";
import LogoModal from "../../components/LogoModal/LogoModal";
import NavBar from "./NavBar";

/**
 * NAV FOR ALL OTHER PAGES (events, etc.).
 * Same bar, logo modal and chapters dropdown as the main nav,
 * but it never renders the "Click to explore" hint.
 */
export default function SubNav(): React.ReactElement {
  const [isLogoModalOpen, setIsLogoModalOpen] = useState<boolean>(false);

  return (
    <>
      <NavBar onLogoClick={() => setIsLogoModalOpen(true)} />
      <LogoModal isOpen={isLogoModalOpen} onClose={() => setIsLogoModalOpen(false)} />
    </>
  );
}
