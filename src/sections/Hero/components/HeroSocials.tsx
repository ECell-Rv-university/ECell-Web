import React from "react";
import { SITE_LINKS } from "@/src/content/site";

const SOCIALS = [
  {
    label: "LinkedIn",
    href: SITE_LINKS.linkedin,
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13Zm1.78 13.02H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
      </svg>
    ),
  },
  {
    label: "Events",
    href: "/events",
    external: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: SITE_LINKS.instagram,
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

/** Social links and events, styled like a studio footer line. */
export default function HeroSocials(): React.ReactElement {
  return (
    <nav className="hero__socials" aria-label="ECell links">
      {SOCIALS.map((social, i) => (
        <React.Fragment key={social.label}>
          {i > 0 && (
            <span className="hero__social-sep" aria-hidden="true">
              /
            </span>
          )}
          <a
            className="hero__social"
            href={social.href}
            target={social.external ? "_blank" : undefined}
            rel={social.external ? "noopener noreferrer" : undefined}
            aria-label={social.label}
          >
            <span className="hero__social-icon">{social.icon}</span>
            <span className="hero__social-label">{social.label}</span>
          </a>
        </React.Fragment>
      ))}
    </nav>
  );
}
