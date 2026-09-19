"use client";
import React from "react";
import ChaptersDropdown from "./ChaptersDropdown";
import { useChaptersMenu } from "./useChaptersMenu";
import { useSectionNavigation } from "./useSectionNavigation";
import { useHomeScroll } from "./useHomeScroll";
import "./Nav.css";

interface NavBarProps {
  onLogoClick: () => void;
  /**
   * Optional slot rendered right next to the logo.
   * Only the main (home) nav passes the "Click to explore" hint here.
   */
  logoHint?: React.ReactNode;
}

export default function NavBar({ onLogoClick, logoHint }: NavBarProps): React.ReactElement {
  const { isOpen, toggleRef, dropdownRef, toggle, close } = useChaptersMenu();
  const { pathname, openEvents, openHome, scrollToSection } = useSectionNavigation({
    closeMenu: close,
  });

  useHomeScroll();

  return (
    <>
      <nav className="site-nav">
        <div className="nav__logo-group">
          <button
            className="logo nav__logo-container nav__logo-button"
            onClick={onLogoClick}
            type="button"
            aria-label="View our logo symbolism"
            title="Click to view our logo story"
          >
            <div className="nav__logo-icon-target" />
          </button>
          {pathname === "/events" && (
            <button
              className="nav-events-link nav-home-link"
              onClick={openHome}
              type="button"
            >
              ← Home
            </button>
          )}
          {logoHint}
        </div>

        <div className="nav-right">
          <button
            className={`nav-events-link ${pathname === "/events" ? "is-active" : ""}`}
            onClick={openEvents}
            type="button"
            aria-current={pathname === "/events" ? "page" : undefined}
          >
            Events
          </button>
          <button
            ref={toggleRef}
            className="chapters-toggle"
            onClick={toggle}
            aria-expanded={isOpen}
            aria-controls="chapters-menu"
            type="button"
          >
            Chapters
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
          <button
            className="menu-icon"
            onClick={toggle}
            aria-label={isOpen ? "Close chapters menu" : "Open chapters menu"}
            aria-expanded={isOpen}
            aria-controls="chapters-menu"
            type="button"
          >
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      <ChaptersDropdown isOpen={isOpen} menuRef={dropdownRef} onSelect={scrollToSection} />
    </>
  );
}
