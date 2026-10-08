"use client";
import React from "react";
import Link from "next/link";
import ChaptersDropdown from "./ChaptersDropdown";
import { useChaptersMenu } from "./useChaptersMenu";
import { useSectionNavigation } from "./useSectionNavigation";
import { useHomeScroll } from "./useHomeScroll";
import "./Nav.css";

interface NavBarProps {
  /**
   * Home nav only: opens the logo modal from the logo button.
   * When omitted, the bar renders as the events sub-nav with a plain
   * "← Home" link instead of the logo button (no modal, no hint).
   */
  onLogoClick?: () => void;
  /**
   * Home nav's logo hint slot, rendered right next to the logo button.
   * Ignored in sub-nav mode (no onLogoClick).
   */
  logoHint?: React.ReactNode;
}

export default function NavBar({ onLogoClick, logoHint }: NavBarProps): React.ReactElement {
  const { isOpen, toggleRef, dropdownRef, toggle, close } = useChaptersMenu();
  const { pathname, openEvents, scrollToSection } = useSectionNavigation({
    closeMenu: close,
  });
  const isSubNav = onLogoClick === undefined;

  useHomeScroll();

  return (
    <>
      <nav className={`site-nav${isSubNav ? " site-nav--sub" : ""}`}>
        <div className="nav__logo-group">
          {isSubNav ? (
            <Link href="/" className="nav-events-link nav-home-link">
              ← Home
            </Link>
          ) : (
            <>
              <button
                className="logo nav__logo-container nav__logo-button"
                onClick={onLogoClick}
                type="button"
                aria-label="View our logo symbolism"
                title="Click to view our logo story"
              >
                <div className="nav__logo-icon-target" />
              </button>
              {logoHint}
            </>
          )}
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
