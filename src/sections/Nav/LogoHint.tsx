"use client";
import React from "react";
import "./LogoHint.css";

interface LogoHintProps {
  visible: boolean;
  onClick: () => void;
}

export default function LogoHint({ visible, onClick }: LogoHintProps): React.ReactElement {
  return (
    <button
      type="button"
      className={`nav__logo-hint ${visible ? "is-visible" : ""}`}
      onClick={onClick}
      aria-label="Click to explore our logo story"
    >
      <svg
        className="nav__logo-hint-arrow"
        viewBox="0 0 20 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18 6H2M2 6L6 2M2 6L6 10"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <span className="nav__logo-hint-text">Click to explore</span>
    </button>
  );
}
