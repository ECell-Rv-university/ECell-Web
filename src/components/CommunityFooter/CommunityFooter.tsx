"use client";

import React from "react";
import Link from "next/link";
import { scrollToY } from "@/src/utils/lenis";
import { PLANET_TELEMETRY } from "@/src/components/Cosmic/CosmicPlanets";
import "./CommunityFooter.css";

export interface CommunityFooterLink {
  label: string;
  href?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

export interface CommunityFooterColumn {
  title: string;
  links: CommunityFooterLink[];
}

export interface CommunityFooterProps {
  label: string;
  headlinePrimary: string;
  headlineAccent?: string;
  tagline?: string;
  cta?: CommunityFooterLink;
  copyright?: string;
  meta?: React.ReactNode;
  columns: CommunityFooterColumn[];
  backToTop?: boolean;
}

function FooterLinkItem({ link }: { link: CommunityFooterLink }): React.ReactElement {
  const href = link.href || "#";
  if (href.startsWith("/") && !link.onClick) {
    return <Link href={href}>{link.label}</Link>;
  }
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      onClick={link.onClick}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {link.label}
    </a>
  );
}

export default function CommunityFooter({
  label,
  headlinePrimary,
  headlineAccent,
  tagline,
  cta,
  copyright = "© 2026 ECell RVU",
  meta,
  columns,
  backToTop = true,
}: CommunityFooterProps): React.ReactElement {
  const handleBackToTop = () => {
    scrollToY(0, { duration: 1.2 });
  };

  return (
    <footer className="community-footer">
      <div className="community-footer__surface">
        <div className="wrap community-footer__inner">
          <div className="community-footer__main">
            <div className="community-footer__brand">
              <p className="community-footer__eyebrow">{label}</p>
              <h2 className="community-footer__headline">
                {headlinePrimary}{" "}
                {headlineAccent ? <em>{headlineAccent}</em> : null}
              </h2>
              {tagline ? <p className="community-footer__tagline">{tagline}</p> : null}
              {cta ? (
                <div className="community-footer__actions">
                  <a className="community-footer__cta" href={cta.href || "#"} onClick={cta.onClick}>
                    {cta.label} <span aria-hidden="true">↗</span>
                  </a>
                </div>
              ) : null}
            </div>

            <div className="community-footer__cols">
              {columns.map((col) => (
                <nav className="community-footer__col" key={col.title} aria-label={col.title}>
                  <h3>{col.title}</h3>
                  <ul>
                    {col.links.map((link) => (
                      <li key={link.label}>
                        <FooterLinkItem link={link} />
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
            </div>
          </div>

          <div className="community-footer__rule">
            <span className="community-footer__copy">{copyright}</span>
            {meta ? <span className="community-footer__meta">{meta}</span> : null}
            {backToTop ? (
              <button type="button" className="community-footer__up" onClick={handleBackToTop}>
                Back to top ↑
              </button>
            ) : null}
          </div>
        </div>
        <aside className="bg-sector-watermark community-footer__sector" aria-hidden="true">
          <span className="bg-sector-watermark__num">{PLANET_TELEMETRY.m87.sector}</span>
          <span className="bg-sector-watermark__title">{PLANET_TELEMETRY.m87.name}</span>
          <span className="bg-sector-watermark__coords">
            {PLANET_TELEMETRY.m87.ra} · {PLANET_TELEMETRY.m87.dec}
          </span>
        </aside>
      </div>
    </footer>
  );
}
