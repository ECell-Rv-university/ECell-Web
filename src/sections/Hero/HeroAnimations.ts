import { RefObject } from "react";
import { gsap, ScrollTrigger } from "../../utils/gsapSetup";
import { lerp, smoothstep } from "../../utils/math";

export interface SetupHeroAnimationsOptions {
  heroRef: RefObject<HTMLElement | null>;
  videoWrapRef: RefObject<HTMLElement | null>;
  headingRef: RefObject<HTMLElement | null>;
  marqueeRef: RefObject<HTMLElement | null>;
  labelRef: RefObject<HTMLElement | null>;
  scrollHintRef?: RefObject<HTMLElement | null>;
}

export function setupHeroAnimations({
  heroRef,
  videoWrapRef,
  headingRef,
  marqueeRef,
  labelRef,
  scrollHintRef,
}: SetupHeroAnimationsOptions): () => void {
  const marqueeMaxOpacity = 0.96;
  const videoWrap = videoWrapRef.current;
  const marquee = marqueeRef.current;
  const label = labelRef.current;
  const heading = headingRef.current;
  const scrollHint = scrollHintRef?.current;
  const reduceMotion = typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false;
  const isMobile = typeof window !== "undefined" ? window.matchMedia("(max-width: 768px)").matches : false;

  if (reduceMotion) {
    gsap.set([videoWrap, label, heading, scrollHint].filter(Boolean), {
      clearProps: "all",
      opacity: 1,
    });
    gsap.set(marquee, { clearProps: "all", opacity: marqueeMaxOpacity });
    return () => {};
  }

  if (isMobile) {
    gsap.set(videoWrap, {
      scale: 1,
      opacity: 1,
      borderRadius: 0,
      boxShadow: "none",
      transformOrigin: "center center",
    });
    gsap.set([marquee, label], { opacity: 0 });
    gsap.set(heading, { opacity: 1 });
    if (scrollHint) gsap.set(scrollHint, { opacity: 1 });

    const mobileTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3,
        invalidateOnRefresh: true,
      },
    });

    mobileTimeline
      .to(
        videoWrap,
        {
          scale: 0.38,
          borderRadius: "16px",
          boxShadow: "0 16px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.12)",
          opacity: 0.4,
          ease: "none",
          duration: 1,
        },
        0,
      )
      .to(marquee, { opacity: marqueeMaxOpacity, ease: "none", duration: 0.3 }, 0.08)
      .to(label, { opacity: 1, ease: "none", duration: 0.28 }, 0.12)
      .to(heading, { opacity: 0, ease: "none", duration: 0.18 }, 0.02);

    if (scrollHint) {
      mobileTimeline.to(scrollHint, { autoAlpha: 0, ease: "none", duration: 0.15 }, 0);
    }

    return () => {
      if (mobileTimeline.scrollTrigger) mobileTimeline.scrollTrigger.kill();
      mobileTimeline.kill();
    };
  }

  const marqueeOpacity = marquee ? gsap.quickSetter(marquee, "opacity") : () => {};
  const labelOpacity = label ? gsap.quickSetter(label, "opacity") : () => {};
  const headingOpacity = heading ? gsap.quickSetter(heading, "opacity") : () => {};
  const scrollHintOpacity = scrollHint
    ? gsap.quickSetter(scrollHint, "opacity")
    : null;

  gsap.set(videoWrap, {
    scale: 1,
    opacity: 1,
    borderRadius: 0,
    boxShadow: "0 0 0 rgba(0,0,0,0)",
    transformOrigin: "center center",
  });
  gsap.set([marquee, label], { opacity: 0 });
  gsap.set(heading, { opacity: 1 });
  if (scrollHint) gsap.set(scrollHint, { opacity: 1 });

  let targetProgress = 0;
  let heroSmoothed = 0;
  let lastAppliedProgress = -1;
  let disposed = false;

  const trigger = ScrollTrigger.create({
    trigger: heroRef.current,
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      targetProgress = self.progress;
    },
  });

  const updateHero = () => {
    if (disposed) return;

    const diff = Math.abs(heroSmoothed - targetProgress);
    if (diff < 0.00005) {
      heroSmoothed = targetProgress;
      if (lastAppliedProgress === heroSmoothed) {
        return;
      }
    } else {
      heroSmoothed = lerp(heroSmoothed, targetProgress, 0.1);
    }
    lastAppliedProgress = heroSmoothed;

    const progress = heroSmoothed;
    const endSqueeze = smoothstep(0.72, 1, progress) * 0.05;
    const scale = 1 - progress * 0.62 - endSqueeze;
    const opacity = 1 - progress * 0.6;
    const reveal = smoothstep(0.08, 0.35, progress);
    const cardP = smoothstep(0.18, 0.5, progress);

    gsap.set(videoWrap, {
      scale,
      opacity,
      borderRadius: `${cardP * 20}px`,
      boxShadow: `0 ${cardP * 24}px ${cardP * 60}px rgba(0,0,0,${cardP * 0.5}), 0 0 0 1px rgba(255,255,255,${cardP * 0.12})`,
    });
    marqueeOpacity(reveal * marqueeMaxOpacity);
    labelOpacity(reveal);
    headingOpacity(1 - smoothstep(0.05, 0.25, progress));
    if (scrollHintOpacity && scrollHint) {
      const hintOpacity = 1 - smoothstep(0.02, 0.18, progress);
      scrollHintOpacity(hintOpacity);
      // Faded out, the clickable badge must not swallow clicks.
      scrollHint.style.visibility = hintOpacity < 0.02 ? "hidden" : "visible";
    }
  };

  gsap.ticker.add(updateHero);

  return () => {
    disposed = true;
    gsap.ticker.remove(updateHero);
    trigger.kill();
  };
}
