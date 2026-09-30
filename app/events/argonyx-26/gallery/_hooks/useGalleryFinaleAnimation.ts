"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "@/src/utils/gsapSetup";
import { refreshScroll } from "@/src/utils/lenis";

interface GalleryFinaleRefs {
  topbarRef: RefObject<HTMLElement | null>;
  finaleStageRef: RefObject<HTMLDivElement | null>;
  finalePinRef: RefObject<HTMLDivElement | null>;
  loveLayerRef: RefObject<HTMLDivElement | null>;
  teamLayerRef: RefObject<HTMLDivElement | null>;
  teamImgWrapRef: RefObject<HTMLDivElement | null>;
  teamOverlayRef: RefObject<HTMLDivElement | null>;
}

export function useGalleryFinaleAnimation({
  topbarRef,
  finaleStageRef,
  finalePinRef,
  loveLayerRef,
  teamLayerRef,
  teamImgWrapRef,
  teamOverlayRef,
}: GalleryFinaleRefs) {
  useEffect(() => {
    // Lenis is owned app-wide by SmoothScrollProvider; this hook no longer
    // acquires it. Acquiring here meant smooth scroll only existed on the
    // routes that happened to run an animation, and only on desktop.
    const context = gsap.context(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        if (teamLayerRef.current) {
          gsap.set(teamLayerRef.current, { yPercent: 0, scale: 1, borderRadius: 0 });
        }
        return;
      }

      if (!finaleStageRef.current || !finalePinRef.current || !teamLayerRef.current) return;

      gsap.set(loveLayerRef.current, { opacity: 1, scale: 1, y: 0 });
      gsap.set(teamLayerRef.current, {
        yPercent: 100,
        scale: 0.86,
        borderRadius: "28px",
        boxShadow: "0 35px 90px rgba(0, 0, 0, 0.9), 0 0 50px rgba(245, 158, 11, 0.12)",
        transformOrigin: "center bottom",
      });

      const image = teamImgWrapRef.current?.querySelector("img");
      if (image) gsap.set(image, { scale: 1.18, transformOrigin: "center center" });
      if (teamOverlayRef.current) gsap.set(teamOverlayRef.current, { opacity: 0, y: 35 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: finaleStageRef.current,
          start: "top top",
          end: "+=160%",
          pin: finalePinRef.current,
          scrub: 0.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      if (topbarRef.current) {
        timeline.to(topbarRef.current, {
          yPercent: -100,
          opacity: 0,
          duration: 0.25,
          ease: "power2.inOut",
        }, 0);
      }
      if (loveLayerRef.current) {
        timeline.to(loveLayerRef.current, {
          opacity: 0,
          y: -60,
          scale: 0.94,
          duration: 0.35,
          ease: "power2.inOut",
        }, 0);
      }
      timeline.to(teamLayerRef.current, {
        yPercent: 0,
        scale: 1,
        borderRadius: "0px",
        boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
        duration: 0.75,
        ease: "power2.out",
      }, 0.15);
      if (image) {
        timeline.to(image, { scale: 1, duration: 0.75, ease: "power2.out" }, 0.15);
      }
      if (teamOverlayRef.current) {
        timeline.to(teamOverlayRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.35,
          ease: "power3.out",
        }, 0.65);
      }
    }, finaleStageRef);

    const refreshTimer = window.setTimeout(refreshScroll, 400);
    return () => {
      window.clearTimeout(refreshTimer);
      context.revert();
    };
  }, [finalePinRef, finaleStageRef, loveLayerRef, teamImgWrapRef, teamLayerRef, teamOverlayRef, topbarRef]);
}
