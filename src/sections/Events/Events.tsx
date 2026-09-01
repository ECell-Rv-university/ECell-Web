"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "../../utils/gsapSetup";
import talkStartupWithMe from "../../assets/events/events_photo/TalkStartupWithMe.webp";
import winterTechTalk from "../../assets/events/events_photo/WinterTechTalk.webp";
import argonyx from "../../assets/events/events_photo/argonyx.webp";
import argonyx2 from "../../assets/events/events_photo/argoynx2.webp";
import desktopTeamBg from "../../assets/events/background/pcTeam.webp";
import mobileTeamBg from "../../assets/events/background/phone.webp";
import "./Events.css";
import Image, { StaticImageData } from "next/image";

export interface GalleryItem {
  number: string;
  category: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  src: StaticImageData | string;
  alt: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    number: "01",
    category: "EVENT",
    title: "ARGONYX HACKATHON",
    description: "A technical hackathon bringing students and builders together to explore, build, and deploy ambitious solutions.",
    date: "18 SEP 2025",
    venue: "RV UNIVERSITY",
    src: argonyx,
    alt: "Argonyx Hackathon",
  },
  {
    number: "02",
    category: "EVENT",
    title: "WINTER TECH TALK",
    description: "A technical session bringing students together to explore emerging technologies and frameworks shaping the future.",
    date: "12 DEC 2025",
    venue: "RV UNIVERSITY",
    src: winterTechTalk,
    alt: "Winter Tech Talk",
  },
  {
    number: "03",
    category: "EVENT",
    title: "TALK STARTUP WITH ME",
    description: "From problem discovery to your first pitch — learn practical venture building directly from experienced founders.",
    date: "24 MAR 2026",
    venue: "RV UNIVERSITY",
    src: talkStartupWithMe,
    alt: "Talk Startup With Me",
  },
  {
    number: "04",
    category: "EVENT",
    title: "ARGONYX 2.0",
    description: "Build, break and reimagine. A 36-hour sprint for visionary student creators, engineers, and designers.",
    date: "18 SEP 2026",
    venue: "RV UNIVERSITY",
    src: argonyx2,
    alt: "Argonyx 2.0",
  },
];

export default function Events(): React.ReactElement {
  const sectionRef = useRef<HTMLElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);
  const galleryRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const transitionRef = useRef<HTMLDivElement | null>(null);
  const exitGlowRef = useRef<HTMLDivElement | null>(null);
  const bgPanelRef = useRef<HTMLDivElement | null>(null);
  const bgInnerRef = useRef<HTMLDivElement | null>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const items = itemsRef.current.filter((item): item is HTMLDivElement => Boolean(item));
    const section = sectionRef.current;
    const scene = sceneRef.current;
    const intro = introRef.current;
    const gallery = galleryRef.current;
    const transition = transitionRef.current;
    const exitGlow = exitGlowRef.current;
    const bgPanel = bgPanelRef.current;
    const bgInner = bgInnerRef.current;
    if (!section || !scene || !items.length) return undefined;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (bgPanel) gsap.set(bgPanel, { x: 0, y: 0, scale: 1, rotate: 0 });
      if (intro) gsap.set(intro, { autoAlpha: 1 });
      return undefined;
    }

    const zSpacing = 1500;
    const exitStart = 5;
    const exitDuration = 0.7;

    // Cache z-offsets as numbers — avoids parsing dataset.z on every frame
    const zValues: number[] = [];
    // Create quick setters — batches DOM writes, avoids style recalc per item
    const opacitySetters = items.map((item) => gsap.quickSetter(item, "opacity"));
    const sceneZSetter = gsap.quickSetter(scene, "z", "px");

    items.forEach((item, index) => {
      const zOffset = -(index * zSpacing);

      zValues[index] = zOffset;
      item.style.transform = `translate3d(0px, 0px, ${zOffset}px)`;
    });

    const camera = { z: 0 };
    const updateScene = () => {
      sceneZSetter(camera.z);

      for (let i = 0; i < items.length; i++) {
        const relativeZ = zValues[i] + camera.z;

        // Asymmetric alpha curve:
        // - Deep background (<-2200px): invisible (prevents clutter)
        // - Background stack approach (-2200px to -1400px): fades into subtle preview (0 -> 25%)
        // - Stack preview (-1400px to -700px): stays subtle at 25-30% opacity behind active card
        // - Focus transition (-700px to -200px): smooth ramp to full hero focus (30% -> 100%)
        // - Active hero view (-200px to 150px): 100% crisp solid opacity
        // - Passing camera (150px to 500px): smooth rapid fade out BEFORE hitting singularity
        // - Past viewer (>=500px): hidden
        let alpha = 0;
        if (relativeZ < -2200) {
          alpha = 0;
        } else if (relativeZ < -1400) {
          alpha = ((relativeZ + 2200) / 800) * 0.25;
        } else if (relativeZ < -700) {
          alpha = 0.25 + ((relativeZ + 1400) / 700) * 0.05;
        } else if (relativeZ < -200) {
          alpha = 0.3 + ((relativeZ + 700) / 500) * 0.7;
        } else if (relativeZ <= 150) {
          alpha = 1;
        } else if (relativeZ < 500) {
          alpha = 1 - (relativeZ - 150) / 350;
        } else {
          alpha = 0;
        }

        opacitySetters[i](alpha);
        items[i].style.visibility = alpha > 0.01 ? "visible" : "hidden";
      }
    };

    // Initialize items and scene position immediately
    updateScene();

    const ctx = gsap.context(() => {
      /* Phase 0: Transition wipe from previous section */
      const entrance = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 95%",
          end: "top 28%",
          scrub: 0.7,
        },
      });

      entrance.fromTo(
        transition,
        { autoAlpha: 1, scaleY: 1, transformOrigin: "top center" },
        { autoAlpha: 0, scaleY: 0, ease: "power4.inOut" },
        0
      );

      /* Main pinned timeline */
      const journey = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: isMobile ? "+=420%" : "+=520%",
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      /* Phase 1: Background image flies in from top-right to center */
      if (bgPanel) {
        gsap.set(bgPanel, {
          xPercent: 100,
          yPercent: -100,
          scale: 0.88,
          rotate: -8,
          borderRadius: "36px",
          opacity: 0,
        });

        if (bgInner) {
          gsap.set(bgInner, {
            scale: 1.12,
            x: "-4%",
            y: "4%",
          });
        }

        journey.to(
          bgPanel,
          {
            xPercent: 0,
            yPercent: 0,
            scale: 1,
            rotate: 0,
            borderRadius: "0px",
            opacity: 1,
            duration: 1.0,
            ease: "power3.out",
          },
          0
        );

        if (bgInner) {
          journey.to(
            bgInner,
            {
              scale: 1.02,
              x: "0%",
              y: "0%",
              duration: 1.0,
              ease: "power3.out",
            },
            0
          );
        }
      }

      /* Phase 2: Intro text reveals */
      if (intro) {
        journey.fromTo(
          intro,
          { autoAlpha: 0, y: 40 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
          },
          0.8
        );
      }

      /* Phase 2b: Gallery fades in */
      if (gallery) {
        journey.fromTo(
          gallery,
          { autoAlpha: 0, scale: 0.82, yPercent: 12 },
          { autoAlpha: 1, scale: 1, yPercent: 0, duration: 0.5, ease: "power2.out" },
          0.9
        );
      }

      /* Phase 3: 3D gallery camera flythrough */
      journey.to(camera, {
        z: (GALLERY_ITEMS.length - 1) * zSpacing + 800,
        duration: 4,
        ease: "none",
        onUpdate: updateScene,
      }, 1.4);

      /* Exit animations */
      journey.to(
        gallery,
        {
          autoAlpha: 0,
          scale: 0.92,
          yPercent: -8,
          duration: exitDuration,
          ease: "power2.inOut",
        },
        exitStart
      );

      journey.to(
        intro,
        {
          autoAlpha: 0,
          yPercent: -20,
          duration: 0.5,
          ease: "power2.inOut",
        },
        exitStart - 0.1
      );

      if (bgInner) {
        journey.to(
          bgInner,
          {
            scale: 1.06,
            duration: 1.0,
            ease: "power1.inOut",
          },
          exitStart - 0.15
        );
      }

      if (exitGlow) {
        journey.fromTo(
          exitGlow,
          { autoAlpha: 0, scaleX: 0.7 },
          { autoAlpha: 1, scaleX: 1.2, duration: 0.8, ease: "power1.out" },
          exitStart
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section className="events-section" ref={sectionRef} id="eventsSection">
      {/* Background image panel — flies in from top-right */}
      <div className="events-bg-panel" ref={bgPanelRef} style={{ position: "absolute" }}>
        <div className="events-bg-inner" ref={bgInnerRef} style={{ position: "relative", width: "100%", height: "100%" }}>
          <Image
            className="events-bg-desktop"
            src={desktopTeamBg}
            alt="ECell team background"
            fill
            sizes="(max-width: 768px) 0px, 100vw"
            quality={85}
            priority
          />
          <Image
            className="events-bg-mobile"
            src={mobileTeamBg}
            alt=""
            aria-hidden="true"
            fill
            sizes="(max-width: 768px) 100vw, 0px"
            quality={85}
            priority
          />
        </div>
        <div className="grain" />
      </div>

      <div className="events-transition-wipe" ref={transitionRef} aria-hidden="true" />
      <div className="events-intro" ref={introRef} aria-hidden="true">
        <span>ECELL</span>
        <h2>Our Legacy</h2>
      </div>
      <div className="events-3d-wrapper" ref={galleryRef}>
        <div className="events-scene" ref={sceneRef} id="scene">
          {GALLERY_ITEMS.map((item, idx) => {
            const isRightSide = idx % 2 === 0;
            return (
              <div
                key={idx}
                className={`events-gallery-item ${isRightSide ? "is-right" : "is-left"}`}
                style={{ position: "absolute" }}
                ref={(el) => {
                  itemsRef.current[idx] = el;
                }}
              >
                <div className="events-card-info">
                  <div className="events-card-tag">
                    {item.number} / {item.category}
                  </div>

                  <h3 className="events-card-title">{item.title}</h3>

                  <p className="events-card-desc">{item.description}</p>

                  <div className="events-card-meta">
                    <span className="events-card-date">{item.date}</span>
                    <span className="events-card-venue">{item.venue}</span>
                  </div>
                </div>

                <div className="events-card-media">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 768px) 85vw, 36vw"
                    quality={85}
                    priority
                    loading="eager"
                    draggable={false}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="events-exit-glow" ref={exitGlowRef} aria-hidden="true" />
    </section>
  );
}
