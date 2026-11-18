import { RefObject } from "react";
import { gsap, ScrollTrigger } from "@/src/utils/gsapSetup";
import { frameLerp, lerp, smoothstep } from "@/src/utils/math";

export interface SetupHeroAnimationsOptions {
  heroRef: RefObject<HTMLElement | null>;
  stageRef: RefObject<HTMLElement | null>;
  introRef: RefObject<HTMLElement | null>;
  marqueeRef: RefObject<HTMLElement | null>;
  labelRef: RefObject<HTMLElement | null>;
  scrollHintRef?: RefObject<HTMLElement | null>;
}

export function setupHeroAnimations({
  heroRef,
  stageRef,
  introRef,
  marqueeRef,
  labelRef,
  scrollHintRef,
}: SetupHeroAnimationsOptions): () => void {
  const marqueeMaxOpacity = 0.96;
  const stage = stageRef.current;
  const marquee = marqueeRef.current;
  const label = labelRef.current;
  const intro = introRef.current;
  const scrollHint = scrollHintRef?.current;
  const hero = heroRef.current;
  // The bottom marquee sits behind the full-size stage and is invisible until
  // the card shrinks; its CSS animation only runs while `hero--card` is set.
  let cardShown = false;
  const setCardShown = (shown: boolean) => {
    if (shown === cardShown || !hero) return;
    cardShown = shown;
    hero.classList.toggle("hero--card", shown);
  };
  // The tagline flips colour over the ink with a difference blend.
  // Blending inside the scaling stage makes the shrink stutter, so it is only
  // on while that text is still visible near the top of the hero.
  let inkBlend = false;
  const setInkBlend = (on: boolean) => {
    if (on === inkBlend || !hero) return;
    inkBlend = on;
    hero.classList.toggle("hero--ink-blend", on);
  };
  // Fade the intro's children, not the intro itself: an intro with opacity
  // becomes its own group and the heading could no longer blend with the ink.
  const introParts = intro ? Array.from(intro.children) : [];
  const reduceMotion = typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false;
  const isMobile = typeof window !== "undefined" ? window.matchMedia("(max-width: 768px)").matches : false;

  if (reduceMotion) {
    gsap.set([stage, label, intro, scrollHint].filter(Boolean), {
      clearProps: "all",
      opacity: 1,
    });
    gsap.set(marquee, { clearProps: "all", opacity: marqueeMaxOpacity });
    setCardShown(true);
    setInkBlend(true);
    return () => {
      setCardShown(false);
      setInkBlend(false);
    };
  }

  if (isMobile) {
    gsap.set(stage, {
      scale: 1,
      opacity: 1,
      borderRadius: 0,
      boxShadow: "none",
      transformOrigin: "center center",
    });
    gsap.set([marquee, label], { opacity: 0 });
    gsap.set(introParts, { opacity: 1 });
    if (scrollHint) gsap.set(scrollHint, { opacity: 1 });
    // The trigger's onUpdate only fires once the page scrolls, so turn the
    // blend on now or the tagline stays black under the ink at the top.
    setInkBlend(true);

    const mobileTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          setCardShown(self.progress > 0.04);
          setInkBlend(self.progress < 0.4);
        },
      },
    });

    mobileTimeline
      .to(
        stage,
        {
          scale: 0.38,
          borderRadius: "16px",
          boxShadow: "0 16px 40px rgba(0, 0, 0, 0.5)",
          opacity: 0.4,
          ease: "none",
          duration: 1,
        },
        0,
      )
      .to(marquee, { opacity: marqueeMaxOpacity, ease: "none", duration: 0.3 }, 0.08)
      .to(label, { opacity: 1, ease: "none", duration: 0.28 }, 0.12)
      .to(introParts, { autoAlpha: 0, ease: "none", duration: 0.18 }, 0.02);

    if (scrollHint) {
      mobileTimeline.to(scrollHint, { autoAlpha: 0, ease: "none", duration: 0.15 }, 0);
    }

    return () => {
      if (mobileTimeline.scrollTrigger) mobileTimeline.scrollTrigger.kill();
      mobileTimeline.kill();
      setCardShown(false);
      setInkBlend(false);
    };
  }

  const marqueeOpacity = marquee ? gsap.quickSetter(marquee, "opacity") : () => {};
  const labelOpacity = label ? gsap.quickSetter(label, "opacity") : () => {};
  const introOpacity = introParts.length ? gsap.quickSetter(introParts, "opacity") : () => {};
  const scrollHintOpacity = scrollHint
    ? gsap.quickSetter(scrollHint, "opacity")
    : null;

  gsap.set(stage, {
    scale: 1,
    opacity: 1,
    borderRadius: 0,
    boxShadow: "0 0 0 rgba(0,0,0,0)",
    transformOrigin: "center center",
  });
  gsap.set([marquee, label], { opacity: 0 });
  gsap.set(introParts, { opacity: 1 });
  if (scrollHint) gsap.set(scrollHint, { opacity: 1 });
  setInkBlend(true);

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
      // Same smoothing feel at 60Hz, 144Hz or anything else.
      heroSmoothed = lerp(heroSmoothed, targetProgress, frameLerp(0.1, gsap.ticker.deltaRatio(60)));
    }
    lastAppliedProgress = heroSmoothed;

    const progress = heroSmoothed;
    const endSqueeze = smoothstep(0.72, 1, progress) * 0.05;
    const scale = 1 - progress * 0.62 - endSqueeze;
    const opacity = 1 - progress * 0.6;
    const reveal = smoothstep(0.08, 0.35, progress);
    const cardP = smoothstep(0.18, 0.5, progress);

    gsap.set(stage, {
      scale,
      opacity,
      borderRadius: `${cardP * 20}px`,
      boxShadow: `0 ${cardP * 24}px ${cardP * 60}px rgba(0,0,0,${cardP * 0.5})`,
    });
    marqueeOpacity(reveal * marqueeMaxOpacity);
    setCardShown(progress > 0.04);
    // The tagline has finished fading well before ~0.4 of the hero scroll.
    setInkBlend(progress < 0.4);
    labelOpacity(reveal);
    const introAlpha = 1 - smoothstep(0.05, 0.25, progress);
    introOpacity(introAlpha);
    // Once faded, the "Join now" link must not catch clicks.
    if (intro) intro.style.visibility = introAlpha < 0.02 ? "hidden" : "visible";
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
    setCardShown(false);
    setInkBlend(false);
  };
}
