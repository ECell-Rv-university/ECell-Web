"use client";

import type { ReactElement } from "react";
import { CircularTestimonials } from "@/src/components/ui/circular-testimonials";
import { PREVIOUS_SPEAKERS } from "../data/speakers";
import "../styles/Speakers.css";

export type { Speaker } from "../data/speakers";

export default function Speakers(): ReactElement {
  return (
    <section className="speakers-section" id="speakers" aria-labelledby="speakers-heading">
      <div className="speakers-reveal-panel">
        <div className="wrap">
          <header className="speakers-header">
            <span className="speakers-kicker-text">Voices of Innovation</span>
            <h2 id="speakers-heading" className="speakers-headline">
              Previous Speakers
            </h2>
            <p className="speakers-subheading">
              Founders, tech leaders, and entrepreneurs who have shared hard-earned lessons with the
              next generation of builders.
            </p>
          </header>

          <CircularTestimonials
            testimonials={PREVIOUS_SPEAKERS}
            label="Previous speakers"
            itemNoun="speaker"
            autoplayMs={7000}
          />
        </div>
      </div>
    </section>
  );
}
