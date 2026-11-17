"use client";
import React from "react";
import Link from "next/link";
import "./ChaptersDropdown.css";

interface ChapterLink {
  id: string;
  label: string;
  sector: string;
  className: string;
}

const CHAPTER_LINKS: ChapterLink[] = [
  { id: "aboutSection", label: "ABOUT ECELL", sector: "SEC-02", className: "dropdown-about-link" },
  { id: "eventsSection", label: "EVENTS", sector: "SEC-03", className: "dropdown-events-link" },
  { id: "speakers", label: "PREVIOUS SPEAKERS", sector: "SEC-04", className: "dropdown-speakers-link" },
  { id: "sponsors", label: "PARTNERS & SPONSORS", sector: "SEC-05", className: "dropdown-sponsors-link" },
  { id: "why-join", label: "WHY JOIN ECELL", sector: "SEC-06", className: "dropdown-team-link" },
  { id: "teamSection", label: "THE TEAM", sector: "SEC-08", className: "dropdown-team-link" },
  { id: "community", label: "WHATSAPP COMMUNITY", sector: "SEC-09", className: "dropdown-footer-link" },
  { id: "footer", label: "FOOTER", sector: "SYSTEM", className: "dropdown-footer-link" },
];

interface ChaptersDropdownProps {
  isOpen: boolean;
  menuRef: React.Ref<HTMLDivElement>;
  onSelect: (id: string) => void;
  children?: React.ReactNode;
}

export default function ChaptersDropdown({
  isOpen,
  menuRef,
  onSelect,
  children,
}: ChaptersDropdownProps): React.ReactElement {
  return (
    <div
      ref={menuRef}
      id="chapters-menu"
      className={`chapters-dropdown ${isOpen ? "open" : ""}`}
      aria-hidden={!isOpen}
    >
      {children}
      {CHAPTER_LINKS.map(({ id, label, sector, className }) => (
        <Link
          key={id}
          href={`/#${id}`}
          onClick={(e) => {
            e.preventDefault();
            onSelect(id);
            (document.activeElement as HTMLElement | null)?.blur();
          }}
          className={className}
        >
          <span className="chapter-label">{label}</span>
          <span className="chapter-sector" aria-hidden="true">{sector}</span>
        </Link>
      ))}
    </div>
  );
}
