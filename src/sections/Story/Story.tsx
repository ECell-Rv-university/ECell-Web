"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "../../utils/gsapSetup";
import { acquireLenis } from "../../utils/lenis";
import storyBackground from "../../assets/story/lib.webp";
import "./Story.css";

export interface StoryProps {
  eyebrow?: string;
  headlineMain?: string;
  headlineAccent?: string;
}

function renderJigglyText(text: string, keyPrefix: string): React.ReactNode {
  if (!text) return null;
  const words = text.split(" ");
  return words.map((word, wordIdx) => (
    <span
      key={`${keyPrefix}-w-${wordIdx}`}
      className="jiggle-word"
      style={{ display: "inline-block", whiteSpace: "nowrap" }}
    >
      {word.split("").map((char, charIdx) => (
        <span
          key={`${keyPrefix}-w-${wordIdx}-c-${charIdx}`}
          className="jiggle-char"
          style={{ display: "inline-block", willChange: "transform" }}
        >
          {char}
        </span>
      ))}
      {wordIdx < words.length - 1 && (
        <span className="jiggle-space" style={{ display: "inline-block" }}>
          &nbsp;
        </span>
      )}
    </span>
  ));
}

export default function Story({
  eyebrow = "ECELL",
  headlineMain = "IT'S THE MIND",
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

    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    // --- Shared Lenis smooth scroll (desktop only) ---
    const lenisHandle = isMobile ? null : acquireLenis();
    let disposed = false;
    let tickerCallback: ((time: number, deltaTime: number) => void) | null = null;

    const mm = gsap.matchMedia();

    mm.add(
      { isDesktop: "(min-width: 768px)", isMobile: "(max-width: 767px)" },
      (context) => {
        const isMobileCond = context.conditions?.isMobile ?? false;
        const containerWidth = reveal.offsetWidth || window.innerWidth;
        const textWidth = revealTextInner.scrollWidth;

        gsap.set(revealTextInner, { x: containerWidth });
        if (storyRevealText) gsap.set(storyRevealText, { opacity: 0 });

        gsap.set(imagePanel, {
          x: isMobileCond ? "78%" : "72%",
          y: "0%",
          scale: isMobileCond ? 0.74 : 0.65,
          rotate: 0,
          rotateY: 0,
          borderRadius: isMobileCond ? "20px" : "28px",
          boxShadow: "0 25px 70px rgba(0, 0, 0, 0.45)",
          opacity: 0,
          transformOrigin: "center right",
        });

        if (image) {
          gsap.set(image, {
            scale: 1.15,
            x: "-5%",
          });
        }

        // --- JIGGLY TEXT ANIMATION SETUP ---
        const chars = revealTextInner.querySelectorAll(".jiggle-char");
        const eyebrowChars = eyebrowEl ? eyebrowEl.querySelectorAll(".jiggle-char") : [];

        let targetVel = 0;
        let currentVel = 0;
        let wobbleTime = 0;

        tickerCallback = (time, deltaTime) => {
          if (disposed) return;

          const dtSec = Math.min(deltaTime / 1000, 0.05);
          const lerpFactor = 1 - Math.pow(0.0001, dtSec);
          currentVel += (targetVel - currentVel) * lerpFactor;

          targetVel *= Math.pow(0.90, dtSec * 60);

          const velMag = Math.abs(currentVel);
          const isMoving = velMag > 0.5;

          if (isMoving || Math.abs(targetVel) > 0.5) {
            wobbleTime += (0.016 + velMag * 0.00012) * (dtSec * 60);
          }

          const normVel = gsap.utils.clamp(-1400, 1400, currentVel) / 1400;
          const absNorm = Math.abs(normVel);

          if (absNorm > 0.0005 || isMoving) {
            chars.forEach((char, idx) => {
              const phase = idx * 0.42 + wobbleTime * 4.5;
              const sinWave = Math.sin(phase);
              const cosWave = Math.cos(phase);

              const yOffset = sinWave * absNorm * 8 + normVel * 5;
              const skewX = normVel * 6 + cosWave * absNorm * 4;
              const rotation = sinWave * absNorm * 3 + normVel * 2;
              const scaleY = 1 - absNorm * 0.05 + sinWave * absNorm * 0.04;
              const scaleX = 1 + absNorm * 0.05 - sinWave * absNorm * 0.04;

              gsap.set(char, {
                y: yOffset,
                skewX: skewX,
                rotation: rotation,
                scaleY: scaleY,
                scaleX: scaleX,
                transformOrigin: "50% 100%",
              });
            });

            eyebrowChars.forEach((char, idx) => {
              const phase = idx * 0.5 + wobbleTime * 5;
              const sinWave = Math.sin(phase);
              const yOffset = sinWave * absNorm * 3.5 + normVel * 2.2;
              const skewX = normVel * 3 + sinWave * absNorm * 2;
              const rotation = sinWave * absNorm * 1.2 + normVel * 1;

              gsap.set(char, {
                y: yOffset,
                skewX: skewX,
                rotation: rotation,
                transformOrigin: "50% 100%",
              });
            });
          } else {
            chars.forEach((char) => {
              gsap.set(char, {
                y: 0,
                skewX: 0,
                rotation: 0,
                scaleY: 1,
                scaleX: 1,
              });
            });
            eyebrowChars.forEach((char) => {
              gsap.set(char, {
                y: 0,
                skewX: 0,
                rotation: 0,
              });
            });
          }
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
            onUpdate: (self) => {
              targetVel = self.getVelocity();
            },
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
            boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
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
            boxShadow: "0 25px 70px rgba(0, 0, 0, 0.45)",
            opacity: 0,
            duration: 0.5,
            ease: "power2.in",
          },
          2.52
        );

        return () => {
          if (tickerCallback) gsap.ticker.remove(tickerCallback);
          if (tl.scrollTrigger) tl.scrollTrigger.kill();
        };
      }
    );

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (!disposed) ScrollTrigger.refresh();
      });
    }

    return () => {
      disposed = true;

      mm.revert();

      lenisHandle?.release();
    };
  }, [eyebrow, headlineMain, headlineAccent]);

  return (
    <section className="story-reveal" ref={revealRef} id="storyReveal">
      <div className="story-image-panel" ref={imagePanelRef} id="imagePanel">
        <div ref={imageRef} className="story-image-inner" style={{ position: "relative", width: "100%", height: "100%" }}>
          <Image src={storyBackground} alt="Story background" fill sizes="100vw" quality={100} style={{ objectFit: "cover" }} />
        </div>
        <div className="grain"></div>
      </div>

      <div className="story-reveal-text" ref={storyRevealTextRef}>
        <div className="eyebrow" ref={eyebrowRef}>
          {renderJigglyText(eyebrow, "eyebrow")}
        </div>
        <div className="story-reveal-text-inner" ref={revealTextInnerRef}>
          <h2>
            {renderJigglyText(headlineMain, "main")}{" "}
            <em>{renderJigglyText(headlineAccent, "accent")}</em>
          </h2>
        </div>
      </div>
    </section>
  );
}
