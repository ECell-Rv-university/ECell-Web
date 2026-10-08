"use client";
import React from "react";
import NavBar from "./NavBar";

/**
 * NAV FOR THE EVENTS SECTION.
 * Same bar and chapters dropdown as the main nav, but with a plain
 * "← Home" link in place of the logo: no logo modal, no hint.
 */
export default function SubNav(): React.ReactElement {
  return <NavBar />;
}
