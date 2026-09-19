"use client";
import React from "react";
import Link from "next/link";
import "./ChaptersDropdown.css";

interface ChapterLink {
  id: string;
  label: string;
  className: string;
}

const CHAPTER_LINKS: ChapterLink[] = [
  { id: "aboutSection", label: "ABOUT ECELL", className: "dropdown-about-link" },
  { id: "why-join", label: "WHY JOIN ECELL", className: "dropdown-team-link" },
  { id: "teamSection", label: "THE TEAM", className: "dropdown-team-link" },
  { id: "eventsSection", label: "EVENTS", className: "dropdown-events-link" },
  { id: "sponsors", label: "PARTNERS & SPONSORS", className: "dropdown-sponsors-link" },
  { id: "speakers", label: "PREVIOUS SPEAKERS", className: "dropdown-speakers-link" },
  { id: "community", label: "WHATSAPP COMMUNITY", className: "dropdown-footer-link" },
  { id: "footer", label: "FOOTER", className: "dropdown-footer-link" },
];

interface ChaptersDropdownProps {
  isOpen: boolean;
  menuRef: React.Ref<HTMLDivElement>;
  onSelect: (id: string) => void;
}

export default function ChaptersDropdown({
  isOpen,
  menuRef,
  onSelect,
}: ChaptersDropdownProps): React.ReactElement {
  return (
    <div
      ref={menuRef}
      id="chapters-menu"
      className={`chapters-dropdown ${isOpen ? "open" : ""}`}
      aria-hidden={!isOpen}
    >
      {CHAPTER_LINKS.map(({ id, label, className }) => (
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
          {label}
        </Link>
      ))}
    </div>
  );
}
