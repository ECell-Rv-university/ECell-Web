import React from "react";
import type { EventDetailData } from "@/src/content/events";

interface EventRegisterProps {
  registration: EventDetailData["registration"];
}

export default function EventRegister({ registration }: EventRegisterProps): React.ReactElement | null {
  if (!registration) {
    return null;
  }

  return (
    <section className="register" id="register">
      <p className="eyebrow eyebrow--onwhite">
        <span className="eyebrow__rule" />
        Ready to participate
      </p>

      <h2 className="register__headline">
        {registration.headline}
        <br />
        <span className="hero__accent hero__accent--onwhite">
          {registration.accent}
        </span>
      </h2>

      <a
        className="btn btn--invert"
        href={registration.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {registration.ctaText}
      </a>

      <p className="register__hint">{registration.hint}</p>
    </section>
  );
} 