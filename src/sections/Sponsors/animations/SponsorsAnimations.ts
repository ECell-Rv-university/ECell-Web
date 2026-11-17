import { gsap } from "@/src/utils/gsapSetup";

interface SponsorsAnimationTargets {
  section: HTMLElement;
  header: HTMLElement | null;
  constellation: HTMLElement | null;
  glow: HTMLElement | null;
}

/**
 * Scroll-driven entrance, story and exit timelines for the Sponsors section.
 * Returns a cleanup that reverts every timeline, or nothing when reduced
 * motion is on (the content is simply shown).
 */
export function setupSponsorsAnimations({
  section,
  header,
  constellation,
  glow,
}: SponsorsAnimationTargets): (() => void) | undefined {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    if (header) gsap.set(header, { opacity: 1, y: 0 });
    if (constellation) gsap.set(constellation, { opacity: 1, y: 0 });
    if (glow) gsap.set(glow, { opacity: 0.35, scale: 1 });
    return;
  }

  const headerCtx = gsap.context(() => {
    // ── Kinetic Typography: Partners slides from left, & stays center, Sponsors from right ──
    const headerTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 88%",
        end: "top 35%",
        scrub: 0.8,
      },
    });

    // "Partners" slides in with momentum from the left
    headerTl.fromTo(
      ".sponsors-word-left",
      { x: -110, opacity: 0, filter: "blur(10px)", letterSpacing: "0.08em" },
      { x: 0, opacity: 1, filter: "blur(0px)", letterSpacing: "-0.03em", ease: "power3.out" },
      0.05
    );

    // "&" stays anchored in center, scaling from a luminous focal spark
    headerTl.fromTo(
      ".sponsors-headline-amp",
      { scale: 0, opacity: 0, filter: "blur(8px)" },
      { scale: 1, opacity: 0.65, filter: "blur(0px)", ease: "back.out(2.2)" },
      0.1
    );

    // "Sponsors" slides in with momentum from the right
    headerTl.fromTo(
      ".sponsors-word-right",
      { x: 110, opacity: 0, filter: "blur(10px)", letterSpacing: "0.08em" },
      { x: 0, opacity: 1, filter: "blur(0px)", letterSpacing: "-0.03em", ease: "power3.out" },
      0.05
    );

    // Subtitle unmasks as the headline locks together
    headerTl.fromTo(
      ".sponsors-intro",
      { y: 22, opacity: 0, filter: "blur(6px)" },
      { y: 0, opacity: 1, filter: "blur(0px)", ease: "power3.out" },
      0.2
    );
  }, section);

  const glowCtx = gsap.context(() => {
    // ── Ambient Radial Glow Expansion ──
    if (glow) {
      gsap.fromTo(
        glow,
        { scale: 0.3, opacity: 0 },
        {
          scale: 1.25,
          opacity: 0.4,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 92%",
            end: "top 20%",
            scrub: 0.8,
          },
        }
      );
    }
  }, section);

  const storyCtx = gsap.context(() => {
    // ══════════════════════════════════════════════════════════════
    // ── AWWWARDS STORYTELLING TIMELINE: NODES → PATHS → CARDS → LOGOS ──
    // ══════════════════════════════════════════════════════════════
    const storyTl = gsap.timeline({
      scrollTrigger: {
        trigger: constellation,
        start: "top 78%",
        toggleActions: "play none none reverse",
      },
    });

    // Prepare SVG path lengths for clean line-drawing
    const pathElements = gsap.utils.toArray<SVGPathElement>(".constellation-line-path");
    pathElements.forEach((path) => {
      const length = path.getTotalLength ? path.getTotalLength() : 300;
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 0,
      });
    });

    // ── PHASE 1: NODES & ORRERY IGNITION (Barycenter, Orbits & Constellation Seed) ──
    const anchorNodes = gsap.utils.toArray<SVGElement>(".constellation-anchor-node");
    const junctionDots = gsap.utils.toArray<SVGElement>(".constellation-junction-dot");
    const pingRings = gsap.utils.toArray<SVGElement>(".node-ping-ring");
    const barycenter = gsap.utils.toArray<SVGElement>(".orrery-barycenter");
    const orreryTracks = gsap.utils.toArray<SVGElement>(".orrery-track");
    const solarPlanets = gsap.utils.toArray<SVGElement>(".solar-planet-node");

    if (barycenter.length > 0) {
      storyTl.fromTo(
        barycenter,
        { opacity: 0, scale: 0.72, transformOrigin: "50% 50%" },
        { opacity: 1, scale: 1, duration: 0.75, ease: "power3.out" },
        0
      );
    }

    if (orreryTracks.length > 0) {
      storyTl.fromTo(
        orreryTracks,
        { opacity: 0, scale: 0.88, transformOrigin: "50% 50%" },
        {
          opacity: 0.48,
          scale: 1,
          duration: 0.85,
          stagger: 0.07,
          ease: "power3.out",
          clearProps: "opacity,transform",
        },
        0.06
      );
    }

    if (solarPlanets.length > 0) {
      storyTl.fromTo(
        solarPlanets,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: "power2.out",
        },
        0.18
      );
    }

    // Top anchor nodes & central hub ignite first
    if (anchorNodes.length > 0) {
      storyTl.fromTo(
        anchorNodes,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 0.9,
          duration: 0.45,
          stagger: {
            each: 0.05,
            from: "start",
          },
          ease: "back.out(2.4)",
        },
        0.05
      );
    }

    // Radar ping rings expand out from origin nodes
    if (pingRings.length > 0) {
      storyTl.fromTo(
        pingRings,
        { r: 2, opacity: 0.9, strokeWidth: 1.5 },
        {
          r: 18,
          opacity: 0,
          strokeWidth: 0.2,
          duration: 0.7,
          stagger: 0.06,
          ease: "power2.out",
        },
        0.1
      );
    }

    // Junction points appear
    if (junctionDots.length > 0) {
      storyTl.fromTo(
        junctionDots,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 0.65,
          duration: 0.35,
          stagger: 0.04,
          ease: "back.out(2)",
        },
        0.2
      );
    }

    // ── PHASE 2: PATHS (Vector Circuit Propagation) ──
    // The paths draw in organized cascading waves down the network tree
    const branchTier1 = gsap.utils.toArray<SVGPathElement>(".path-tier-1");
    const branchTier2 = gsap.utils.toArray<SVGPathElement>(".path-tier-2");
    const branchTier3 = gsap.utils.toArray<SVGPathElement>(".path-tier-3");
    const branchTier4 = gsap.utils.toArray<SVGPathElement>(".path-tier-4");

    // Tier 1 branches (North anchors down/up: Nokia->Waffle, Herody->RedBull)
    if (branchTier1.length > 0) {
      storyTl.to(
        branchTier1,
        {
          strokeDashoffset: 0,
          opacity: 0.45,
          duration: 0.55,
          stagger: 0.08,
          ease: "power2.inOut",
        },
        0.3
      );
    }

    // Tier 2 branches (Horizontal bridge: Waffle->TVS, Herody->Mercedes)
    if (branchTier2.length > 0) {
      storyTl.to(
        branchTier2,
        {
          strokeDashoffset: 0,
          opacity: 0.45,
          duration: 0.4,
          stagger: 0.06,
          ease: "power2.inOut",
        },
        0.5
      );
    }

    // Tier 3 branches (Mid down to Core: TVS->Attys, Herody->Cube, Merc->Justvend)
    if (branchTier3.length > 0) {
      storyTl.to(
        branchTier3,
        {
          strokeDashoffset: 0,
          opacity: 0.45,
          duration: 0.5,
          stagger: 0.06,
          ease: "power2.inOut",
        },
        0.68
      );
    }

    // Tier 4 branches (Core down to Base: Attys->EasyBites, Justvend->Mile)
    if (branchTier4.length > 0) {
      storyTl.to(
        branchTier4,
        {
          strokeDashoffset: 0,
          opacity: 0.45,
          duration: 0.45,
          stagger: 0.06,
          ease: "power2.inOut",
        },
        0.88
      );
    }

    // ── PHASE 3: CARDS (Materializing Along The Network) ──
    // Rows dock in sequence, outside-in, on transform + opacity only (no
    // per-card blur, so 23 glass cards stay cheap to composite).
    [".row-1", ".row-2", ".row-3", ".row-4", ".row-5"].forEach((row, i) => {
      const cards = gsap.utils.toArray<HTMLElement>(`${row} .sponsor-card-inner`);
      if (cards.length === 0) return;
      storyTl.fromTo(
        cards,
        { opacity: 0, scale: 0.9, y: 18 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.55,
          stagger: { each: 0.06, from: "center" },
          ease: "power3.out",
          clearProps: "transform",
        },
        0.55 + i * 0.2
      );
    });

    // ══════════════════════════════════════════════════════════════
    // ── PHASE 4: LOGOS (Living Signal Lock-In) ──
    // Logos surge with exposure/contrast before settling into crisp clarity
    const logos = gsap.utils.toArray<HTMLElement>(".sponsor-logo");
    if (logos.length > 0) {
      storyTl.fromTo(
        logos,
        {
          opacity: 0,
          filter: "brightness(2) contrast(1.2)",
          scale: 0.94,
        },
        {
          opacity: 1,
          filter: "brightness(1) contrast(1.02)",
          scale: 1,
          duration: 0.5,
          stagger: 0.04,
          ease: "power2.out",
        },
        0.9
      );
    }
  }, section);

  const exitCtx = gsap.context(() => {
    // ═══════════════════════════════════════════════════════════════
    // ── MORPHIC TRANSITION: FIRES ON SECTION EXIT ──
    // ══════════════════════════════════════════════════════════════
    const exitTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "bottom 85%",
        end: "bottom 10%",
        scrub: 0.8,
        invalidateOnRefresh: true,
      },
    });

    // 1. Left and right cards collapse towards the center axis
    exitTl.to(
      ".constellation-col:nth-child(odd)",
      {
        x: 140,
        scale: 0.2,
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
      },
      0
    );

    exitTl.to(
      ".constellation-col:nth-child(even)",
      {
        x: -140,
        scale: 0.2,
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
      },
      0
    );

    // 2. Nodes, dots and solar orrery implode/fade to center
    exitTl.to(
      ".constellation-anchor-node, .constellation-junction-dot, .node-ping-ring, .sponsors-orrery",
      {
        opacity: 0,
        duration: 0.35,
        ease: "power2.in",
      },
      0
    );

    // 3. Constellation network lines stretch and collapse into center vertical conduit
    exitTl.to(
      ".constellation-line-path",
      {
        scaleX: 0.02,
        transformOrigin: "50% 50%",
        opacity: 0.7,
        duration: 0.45,
        ease: "power2.inOut",
      },
      0.05
    );
  }, section);

  return () => {
    headerCtx.revert();
    glowCtx.revert();
    storyCtx.revert();
    exitCtx.revert();
  };
}
