"use client";
import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import "./PageTransition.css";

type TransitionPhase = "idle" | "entering" | "covered" | "revealing";

export interface PageTransitionDetail {
  url?: string;
  title?: string;
}

export default function PageTransition(): React.ReactElement | null {
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const [title, setTitle] = useState<string>("EVENTS");
  const phaseRef = useRef<TransitionPhase>("idle");
  const timerRef = useRef<number | null>(null);
  const safetyTimerRef = useRef<number | null>(null);
  const targetUrlRef = useRef<string>("/events");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleTransition = (event: Event) => {
      if (phaseRef.current !== "idle") return;

      const customEvent = event as CustomEvent<PageTransitionDetail>;
      const targetUrl = customEvent.detail?.url || "/events";
      const transitionTitle =
        customEvent.detail?.title ||
        (targetUrl === "/" || targetUrl.startsWith("/#") ? "HOME" : "EVENTS");

      targetUrlRef.current = targetUrl;
      setTitle(transitionTitle);

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reducedMotion) {
        router.push(targetUrl);
        return;
      }

      phaseRef.current = "entering";
      setPhase("entering");
      timerRef.current = window.setTimeout(() => {
        phaseRef.current = "covered";
        setPhase("covered");
        router.push(targetUrl);

        // Safety fallback in case route change doesn't trigger pathname change
        if (safetyTimerRef.current !== null) window.clearTimeout(safetyTimerRef.current);
        safetyTimerRef.current = window.setTimeout(() => {
          if (phaseRef.current === "covered") {
            phaseRef.current = "revealing";
            setPhase("revealing");
            window.setTimeout(() => {
              phaseRef.current = "idle";
              setPhase("idle");
            }, 280);
          }
        }, 400);
      }, 280);
    };

    window.addEventListener("ecell:page-transition", handleTransition);
    window.addEventListener("ecell:events-transition", handleTransition);

    return () => {
      window.removeEventListener("ecell:page-transition", handleTransition);
      window.removeEventListener("ecell:events-transition", handleTransition);
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      if (safetyTimerRef.current !== null) window.clearTimeout(safetyTimerRef.current);
    };
  }, [router]);

  useEffect(() => {
    if (phaseRef.current !== "covered") return;

    if (safetyTimerRef.current !== null) {
      window.clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = null;
    }

    phaseRef.current = "revealing";
    setPhase("revealing");
    timerRef.current = window.setTimeout(() => {
      phaseRef.current = "idle";
      setPhase("idle");
    }, 280);
  }, [pathname]);

  if (phase === "idle") return null;

  return (
    <div className={`page-transition-overlay transition-${phase}`} role="status" aria-live="polite">
      <span className="transition-title">{title}</span>
    </div>
  );
}

