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
            <div className="nav__logo-icon-target">
              {pathname !== "/" && (
                <svg
                  className="nav__static-logo"
                  viewBox="0 0 806 920"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <g transform="translate(0,808) scale(0.1,-0.1)">
                    <path d="M4280 5974 c-41 -19 -110 -60 -154 -91 -97 -67 -473 -364 -606 -478 -200 -172 -391 -303 -500 -345 l-35 -13 -242 -5 -243 -4 0 -304 0 -305 358 3 357 3 63 26 c135 58 309 185 642 469 347 298 503 412 633 468 l62 27 548 3 547 3 0 289 0 290 -678 0 -678 0 -74 -36z" />
                    <path d="M4740 4821 c-142 -46 -296 -152 -684 -470 -133 -109 -311 -251 -396 -315 l-155 -117 -80 -40 c-44 -21 -104 -44 -134 -49 l-54 -10 -368 0 -369 0 0 -295 0 -295 518 0 517 0 46 14 c147 45 254 121 810 578 227 186 408 317 512 372 l79 41 364 3 364 3 0 299 0 300 -457 -1 -458 0 -55 -18z" />
                    <path d="M5064 3631 c-133 -48 -270 -148 -762 -554 -249 -205 -437 -346 -526 -394 l-71 -38 -600 -5 -600 -5 -3 -297 -2 -298 692 0 693 0 47 15 c142 43 311 156 627 420 452 377 559 458 703 530 l90 45 179 0 179 0 0 300 0 300 -297 0 -298 -1 -51 -18z" />
                  </g>
                </svg>
              )}
            </div>
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
