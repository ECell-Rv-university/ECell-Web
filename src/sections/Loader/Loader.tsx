"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { lockPageScroll } from "@/src/utils/scrollLock";
import "./Loader.css";

export interface LoaderProps {
  onComplete?: () => void;
}

export default function Loader({ onComplete }: LoaderProps): React.ReactElement {
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const squiggleSvgRef = useRef<SVGSVGElement | null>(null);

  const wave1Ref = useRef<SVGPathElement | null>(null);
  const wave2Ref = useRef<SVGPathElement | null>(null);
  const wave3Ref = useRef<SVGPathElement | null>(null);

  const wordmarkTitleRef = useRef<SVGTextElement | null>(null);
  const wordmarkSubRef = useRef<SVGTextElement | null>(null);

  useEffect(() => {
    // Refcounted so releasing this lock cannot unlock the page while a modal
    // opened during the intro is still holding its own lock.
    const releaseScrollLock = lockPageScroll();

    const loader = loaderRef.current;
    const squiggleSvg = squiggleSvgRef.current;

    const wave1 = wave1Ref.current;
    const wave2 = wave2Ref.current;
    const wave3 = wave3Ref.current;

    const title = wordmarkTitleRef.current;
    const subtitle = wordmarkSubRef.current;

    const waves = [wave1, wave2, wave3].filter((path): path is SVGPathElement => Boolean(path));

    // Prepare SVG paths stroke & fill states
    waves.forEach((path) => {
      const length = path.getTotalLength();

      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
        fillOpacity: 0,
        strokeOpacity: 1,
      });
    });

    gsap.set(squiggleSvg, {
      opacity: 1,
      scale: 0.96,
    });

    gsap.set([title, subtitle], {
      opacity: 0,
      y: 16,
    });

    const tl = gsap.timeline({
      onComplete: () => {
        releaseScrollLock();
        onComplete?.();
      },
    });

    // 1. The three main strokes draw in with a light stagger
    tl.to(
      waves,
      {
        strokeDashoffset: 0,
        duration: 1.1,
        stagger: 0.18,
        ease: "power2.inOut",
      },
      0.15
    );

    // 2. Crossfade from stroke outline to solid white fill
    tl.to(
      waves,
      {
        fillOpacity: 1,
        duration: 0.5,
        ease: "power2.out",
      },
      "-=0.15"
    );

    tl.to(
      waves,
      {
        strokeOpacity: 0,
        duration: 0.5,
        ease: "power2.out",
      },
      "<"
    );

    // 3. Settle scale & reveal wordmark
    tl.to(
      squiggleSvg,
      {
        scale: 1,
        duration: 0.6,
        ease: "back.out(1.6)",
      },
      "-=0.5"
    );

    tl.to(
      [title, subtitle],
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.12,
        ease: "power3.out",
      },
      "-=0.3"
    );

    // 4. Small ambient breathe
    tl.to(squiggleSvg, {
      scale: 1.02,
      duration: 0.35,
      ease: "sine.inOut",
      repeat: 1,
      yoyo: true,
    });

    // 5. Exit curtain upward
    tl.to(loader, {
      yPercent: -100,
      skewY: -2,
      transformOrigin: "bottom center",
      duration: 0.8,
      ease: "power4.inOut",
    });

    return () => {
      // Idempotent: a no-op when the timeline already released the lock.
      releaseScrollLock();
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div ref={loaderRef} className="loader-wrap">
      <svg
        ref={squiggleSvgRef}
        className="loader-squiggle"
        viewBox="0 0 806 920"
      >
        <g transform="translate(0,808) scale(0.1,-0.1)">
          <path
            ref={wave1Ref}
            className="logo-stroke logo-big"
            d="M4280 5974 c-41 -19 -110 -60 -154 -91 -97 -67 -473 -364 -606 -478 -200 -172 -391 -303 -500 -345 l-35 -13 -242 -5 -243 -4 0 -304 0 -305 358 3 357 3 63 26 c135 58 309 185 642 469 347 298 503 412 633 468 l62 27 548 3 547 3 0 289 0 290 -678 0 -678 0 -74 -36z"
          />
          <path
            ref={wave2Ref}
            className="logo-stroke logo-big"
            d="M4740 4821 c-142 -46 -296 -152 -684 -470 -133 -109 -311 -251 -396 -315 l-155 -117 -80 -40 c-44 -21 -104 -44 -134 -49 l-54 -10 -368 0 -369 0 0 -295 0 -295 518 0 517 0 46 14 c147 45 254 121 810 578 227 186 408 317 512 372 l79 41 364 3 364 3 0 299 0 300 -457 -1 -458 0 -55 -18z"
          />
          <path
            ref={wave3Ref}
            className="logo-stroke logo-big"
            d="M5064 3631 c-133 -48 -270 -148 -762 -554 -249 -205 -437 -346 -526 -394 l-71 -38 -600 -5 -600 -5 -3 -297 -2 -298 692 0 693 0 47 15 c142 43 311 156 627 420 452 377 559 458 703 530 l90 45 179 0 179 0 0 300 0 300 -297 0 -298 -1 -51 -18z"
          />
        </g>

        <text
          ref={wordmarkTitleRef}
          className="wordmark-title"
          x="403"
          y="720"
          textAnchor="middle"
        >
          Entrepreneurship Cell
        </text>

        <text
          ref={wordmarkSubRef}
          className="wordmark-sub"
          x="403"
          y="770"
          textAnchor="middle"
        >
          RV University
        </text>
      </svg>
    </div>
  );
}
