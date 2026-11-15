"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/src/utils/gsapSetup";
import { refreshScroll } from "@/src/utils/lenis";

import storyBackground from "@/src/assets/home/story-background.webp";
import CosmicSectionBackdrop from "@/src/components/Cosmic/CosmicSectionBackdrop";
import "./Story.css";

export interface StoryProps {
  eyebrow?: string;
  headlineMain?: string;
  headlineAccent?: string;
}

export default function Story({
  eyebrow = "ECELL",
  headlineMain = "IT’S THE MIND",
  headlineAccent = "THAT MAKES THE DIFFERENCE",
}: StoryProps): React.ReactElement {
  const revealRef = useRef<HTMLElement | null>(null);
  const imagePanelRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const revealTextInnerRef = useRef<HTMLDivElement | null>(null);
  const storyRevealTextRef = useRef<HTMLDivElement | null>(null);
  const eyebrowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const reveal = revealRef.current;
    const imagePanel = imagePanelRef.current;
    const image = imageRef.current;
    const revealTextInner = revealTextInnerRef.current;
    const storyRevealText = storyRevealTextRef.current;
    const eyebrowEl = eyebrowRef.current;

    if (!reveal || !imagePanel || !revealTextInner) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      gsap.set(imagePanel, {
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0,
        borderRadius: "0px",
        boxShadow: "none",
        filter: "none",
      });
      if (image) gsap.set(image, { scale: 1, x: 0 });
      if (storyRevealText) gsap.set(storyRevealText, { opacity: 1 });
      return;
    }

    // Smooth scrolling is owned app-wide by SmoothScroll. This section
    // used to acquire Lenis itself, which tied the scroll feel to whether this
    // particular section happened to be mounted.
    let disposed = false;
    let tickerCallback: ((time: number, deltaTime: number) => void) | null = null;

    const mm = gsap.matchMedia();

    mm.add(
      { isDesktop: "(min-width: 768px)", isMobile: "(max-width: 767px)" },
      (context) => {
        const isMobileCond = context.conditions?.isMobile ?? false;
        const containerWidth = reveal.offsetWidth || window.innerWidth;
        const textWidth = revealTextInner.scrollWidth;
        // An animated box-shadow repaints the full-screen panel every frame; phones skip it.
        const panelShadow = isMobileCond ? "none" : "0 25px 70px rgba(0, 0, 0, 0.45)";

        gsap.set(revealTextInner, { x: containerWidth });
        if (storyRevealText) gsap.set(storyRevealText, { opacity: 0 });

        gsap.set(imagePanel, {
          x: isMobileCond ? "78%" : "72%",
          y: "0%",
          scale: isMobileCond ? 0.74 : 0.65,
          rotate: 0,
          rotateY: 0,
          borderRadius: isMobileCond ? "20px" : "28px",
          boxShadow: panelShadow,
          opacity: 0,
          transformOrigin: "center right",
        });

        if (image) {
          gsap.set(image, {
            scale: 1.15,
            x: "-5%",
          });
        }

        // Same as charlesleclerc.com's quote: skewX (deg) chases the line's own
        // movement in px per 60fps frame, clamped to ±15, eased with dt * 10.
        // Tracking the text (not the page scroll) keeps the lean in sync with the scrub lag.
        let skew = 0;
        let lastX = gsap.getProperty(revealTextInner, "x") as number;
        tickerCallback = (_time, deltaTime) => {
          if (disposed) return;
          const dt = Math.min(deltaTime / 1000, 1 / 30);
          const x = gsap.getProperty(revealTextInner, "x") as number;
          const dxPerFrame = dt > 0 ? ((x - lastX) / dt) / 60 : 0;
          lastX = x;
          const target = gsap.utils.clamp(-15, 15, dxPerFrame);
          skew += (target - skew) * dt * 10;
          gsap.set(revealTextInner, { skewX: skew });
        };

        gsap.ticker.add(tickerCallback);

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: reveal,
            start: "top top",
            end: isMobileCond ? "+=280%" : "+=340%",
            scrub: 0.8,
            pin: true,
            anticipatePin: 1,
          },
        });

        tl.to(
          imagePanel,
          {
            opacity: 1,
            duration: 0.25,
            ease: "power1.out",
          },
          0
        );

        tl.to(
          imagePanel,
          {
            x: "0%",
            y: "0%",
            scale: 1,
            borderRadius: "0px",
            boxShadow: isMobileCond ? "none" : "0 0 0 rgba(0, 0, 0, 0)",
            duration: 1.0,
            ease: "power2.out",
          },
          0
        );

        if (image) {
          tl.to(
            image,
            {
              scale: 1,
              x: "0%",
              duration: 1.0,
              ease: "power2.out",
            },
            0
          );
        }

        if (storyRevealText) {
          tl.to(
            storyRevealText,
            { opacity: 1, duration: 0.2, ease: "power1.out" },
            1.0
          );
        }

        tl.to(
          revealTextInner,
          {
            x: -(textWidth + 250),
            duration: 1.6,
            ease: "none",
          },
          1.0
        )
          .fromTo(
            eyebrowEl,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.2, ease: "power1.out" },
            1.05
          )
          .to(
            eyebrowEl,
            { opacity: 0, y: -10, duration: 0.2, ease: "power1.in" },
            2.38
          );

        if (storyRevealText) {
          tl.to(
            storyRevealText,
            { opacity: 0, duration: 0.2, ease: "power1.in" },
            2.5
          );
        }

        tl.to(
          imagePanel,
          {
            x: "-100%",
            y: "0%",
            scale: isMobileCond ? 0.8 : 0.85,
            borderRadius: isMobileCond ? "20px" : "28px",
            boxShadow: panelShadow,
            opacity: 0,
            duration: 0.5,
            ease: "power2.in",
          },
          2.52
        );

        // Hold the empty frame so the image has fully left (scrub lag included)
        // before the pin releases; otherwise Team scrolls in against its edge.
        tl.to({}, { duration: 0.3 });

        return () => {
          if (tickerCallback) gsap.ticker.remove(tickerCallback);
          if (tl.scrollTrigger) tl.scrollTrigger.kill();
        };
      }
    );

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (!disposed) refreshScroll();
      });
    }

    return () => {
      disposed = true;

      mm.revert();
    };
  }, [eyebrow, headlineMain, headlineAccent]);

  return (
    <section className="story-reveal" ref={revealRef} id="storyReveal">
      <CosmicSectionBackdrop
        planet="terran"
        planetPlacement={{ top: "16%", left: "4%", width: "clamp(95px, 9vw, 145px)" }}
        starsCount={24}
        seed={606}
        constellation="phoenix"
        constellationPlacement={{ top: "48%", right: "3%", width: "clamp(85px, 8vw, 120px)" }}
        sectionId="storyReveal"
      />
      <div className="story-image-panel" ref={imagePanelRef} id="imagePanel">
        <div ref={imageRef} className="story-image-inner" style={{ position: "relative", width: "100%", height: "100%" }}>
          <Image src={storyBackground} alt="Story background" fill sizes="100vw" quality={85} style={{ objectFit: "cover" }} />
        </div>
        <div className="grain"></div>
      </div>

      <div className="story-reveal-text" ref={storyRevealTextRef}>
        <div className="eyebrow" ref={eyebrowRef}>
          {eyebrow}
        </div>
        <div className="story-reveal-text-inner" ref={revealTextInnerRef}>
          <h2>
            {headlineMain} <em>{headlineAccent}</em>
          </h2>
        </div>
      </div>
    </section>
  );
}
