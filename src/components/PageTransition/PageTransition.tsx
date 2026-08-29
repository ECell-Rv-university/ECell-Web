"use client";
import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import "./PageTransition.css";

type TransitionPhase = "idle" | "entering" | "covered" | "revealing";

export default function PageTransition(): React.ReactElement | null {
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const phaseRef = useRef<TransitionPhase>("idle");
  const timerRef = useRef<number | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const startTransition = () => {
      if (phaseRef.current !== "idle") return;

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reducedMotion) {
        router.push("/events");
        return;
      }

      phaseRef.current = "entering";
      setPhase("entering");
      timerRef.current = window.setTimeout(() => {
        phaseRef.current = "covered";
        setPhase("covered");
        router.push("/events");
      }, 280);
    };

    window.addEventListener("ecell:events-transition", startTransition);
    return () => {
      window.removeEventListener("ecell:events-transition", startTransition);
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, [router]);

  useEffect(() => {
    if (pathname !== "/events" || phaseRef.current !== "covered") return;

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
      <span className="transition-title">EVENTS</span>
    </div>
  );
}
