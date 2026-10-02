"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { gsap } from "@/src/utils/gsapSetup";
import { scrollToY } from "@/src/utils/lenis";
import { navigateToSection } from "@/src/sections/Nav/navUtils";

const STYLES = `
.cinematic-footer-wrapper {
  --footer-accent: #8edcff;
  --footer-accent-soft: rgba(142, 220, 255, 0.14);
  --footer-surface: #0a0b0c;
  --footer-surface-raised: rgba(255, 255, 255, 0.045);
  --footer-ink: #f4f4f2;
  --footer-muted: rgba(244, 244, 242, 0.58);
  --footer-border: rgba(255, 255, 255, 0.1);
  font-family: var(--font-inter), sans-serif;
  -webkit-font-smoothing: antialiased;
}

@keyframes ecell-footer-breathe {
  from { transform: translate(-50%, -50%) scale(0.92); opacity: 0.48; }
  to { transform: translate(-50%, -50%) scale(1.08); opacity: 0.9; }
}

@keyframes ecell-footer-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@keyframes ecell-footer-heartbeat {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 4px rgba(255, 77, 109, 0.35)); }
  15%, 45% { transform: scale(1.2); filter: drop-shadow(0 0 9px rgba(255, 77, 109, 0.75)); }
  30% { transform: scale(1); }
}

.ecell-footer-aurora {
  background: radial-gradient(circle, rgba(142, 220, 255, 0.2) 0%, rgba(3, 4, 156, 0.1) 40%, transparent 70%);
  animation: ecell-footer-breathe 8s ease-in-out infinite alternate;
}

.ecell-footer-grid {
  background-size: 56px 56px;
  background-image:
    linear-gradient(to right, rgba(142, 220, 255, 0.045) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(142, 220, 255, 0.045) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 25%, black 75%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 25%, black 75%, transparent);
}

.ecell-footer-glass {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  transform-style: preserve-3d;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.075), rgba(255, 255, 255, 0.022));
  border: 1px solid var(--footer-border);
  box-shadow: 0 14px 34px -18px rgba(0, 0, 0, 0.9), inset 0 1px 1px rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: color 300ms ease, border-color 300ms ease, background 300ms ease, box-shadow 300ms ease;
}

.ecell-footer-glass:hover {
  color: var(--footer-ink);
  border-color: rgba(142, 220, 255, 0.48);
  background: linear-gradient(145deg, rgba(142, 220, 255, 0.13), rgba(255, 255, 255, 0.028));
  box-shadow: 0 20px 46px -18px rgba(0, 0, 0, 0.95), 0 0 34px rgba(142, 220, 255, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.16);
}

.ecell-footer-glass:focus-visible {
  outline: 2px solid var(--footer-accent);
  outline-offset: 4px;
}

.ecell-footer-primary {
  min-height: 58px;
  padding: 8px 10px 8px 24px;
  border-radius: 999px;
  font-family: var(--font-archivo), sans-serif;
  font-size: 0.95rem;
  font-weight: 750;
  letter-spacing: -0.01em;
}

.ecell-footer-primary::before {
  content: "";
  position: absolute;
  top: -120%;
  left: -35%;
  z-index: 0;
  width: 42%;
  height: 340%;
  transform: rotate(24deg);
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.48), transparent);
  opacity: 0;
  transition: left 700ms cubic-bezier(0.16, 1, 0.3, 1), opacity 250ms ease;
  pointer-events: none;
}

.ecell-footer-primary:hover::before {
  left: 108%;
  opacity: 0.65;
}

.ecell-footer-primary-accent {
  color: #071216;
  border-color: rgba(204, 242, 255, 0.8);
  background: linear-gradient(135deg, #e7f9ff 0%, #8edcff 58%, #5cc3ef 100%);
  box-shadow: 0 14px 38px -14px rgba(92, 195, 239, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.82), inset 0 -1px 0 rgba(5, 73, 103, 0.18);
}

.ecell-footer-primary-accent:hover {
  color: #03090c;
  border-color: #e7f9ff;
  background: linear-gradient(135deg, #ffffff 0%, #a9e8ff 55%, #70d2f7 100%);
  box-shadow: 0 18px 46px -14px rgba(92, 195, 239, 0.9), 0 0 32px rgba(142, 220, 255, 0.2), inset 0 1px 0 #ffffff;
}

.ecell-footer-primary-dark {
  color: rgba(244, 244, 242, 0.94);
  border-color: rgba(142, 220, 255, 0.24);
  background: linear-gradient(145deg, rgba(19, 29, 34, 0.94), rgba(8, 10, 12, 0.9));
  box-shadow: 0 16px 38px -16px rgba(0, 0, 0, 0.95), inset 0 1px 0 rgba(255, 255, 255, 0.09), inset 0 0 22px rgba(142, 220, 255, 0.035);
}

.ecell-footer-button-label,
.ecell-footer-button-icon {
  position: relative;
  z-index: 1;
}

.ecell-footer-button-icon {
  display: inline-flex;
  width: 40px;
  height: 40px;
  flex: 0 0 40px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #8edcff;
  border: 1px solid rgba(142, 220, 255, 0.2);
  background: rgba(142, 220, 255, 0.09);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12);
  transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1), background 300ms ease, color 300ms ease;
}

.ecell-footer-primary-accent .ecell-footer-button-icon {
  color: #dff7ff;
  border-color: rgba(0, 26, 38, 0.1);
  background: rgba(3, 20, 27, 0.84);
  box-shadow: 0 4px 12px rgba(3, 20, 27, 0.24), inset 0 1px 0 rgba(255, 255, 255, 0.14);
}

.ecell-footer-primary:hover .ecell-footer-button-icon {
  transform: rotate(-7deg) scale(1.06);
}

.ecell-footer-link {
  min-height: 40px;
  padding: 8px 13px 8px 11px;
  border-radius: 999px;
  font-size: 0.78rem;
  letter-spacing: 0.015em;
  color: rgba(244, 244, 242, 0.68);
  border-color: rgba(255, 255, 255, 0.09);
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.052), rgba(255, 255, 255, 0.015));
}

.ecell-footer-link::before {
  content: "";
  position: relative;
  z-index: 1;
  width: 6px;
  height: 6px;
  flex: 0 0 6px;
  border-radius: 50%;
  background: rgba(142, 220, 255, 0.55);
  box-shadow: 0 0 0 4px rgba(142, 220, 255, 0.06);
  transition: background 250ms ease, box-shadow 250ms ease, transform 250ms ease;
}

.ecell-footer-link:hover::before {
  background: #8edcff;
  box-shadow: 0 0 0 5px rgba(142, 220, 255, 0.1), 0 0 12px rgba(142, 220, 255, 0.5);
  transform: scale(1.1);
}

.ecell-footer-top-button {
  width: 46px;
  height: 46px;
  color: #071216;
  border-color: rgba(204, 242, 255, 0.75);
  background: linear-gradient(145deg, #c9efff, #70ccee);
  box-shadow: 0 10px 28px -10px rgba(92, 195, 239, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.ecell-footer-top-button:hover {
  color: #03090c;
  background: linear-gradient(145deg, #ecfbff, #8edcff);
}

.ecell-footer-giant-text {
  font-family: var(--font-archivo), sans-serif;
  font-size: clamp(9rem, 25vw, 26rem);
  line-height: 0.7;
  font-weight: 900;
  letter-spacing: -0.075em;
  color: transparent;
  -webkit-text-stroke: 1px rgba(142, 220, 255, 0.1);
  background: linear-gradient(180deg, rgba(142, 220, 255, 0.13), transparent 70%);
  -webkit-background-clip: text;
  background-clip: text;
}

.ecell-footer-heading {
  font-family: var(--font-archivo), sans-serif;
  background: linear-gradient(180deg, #ffffff 5%, #8edcff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 24px rgba(142, 220, 255, 0.12));
}

.ecell-footer-marquee-track {
  animation: ecell-footer-marquee 38s linear infinite;
}

.ecell-footer-heart {
  animation: ecell-footer-heartbeat 2s cubic-bezier(0.25, 1, 0.5, 1) infinite;
}

@media (max-width: 640px) {
  .ecell-footer-giant-text { font-size: 43vw; }
}

@media (prefers-reduced-motion: reduce) {
  .motion-footer-reveal {
    height: auto !important;
    min-height: 100dvh;
    clip-path: none !important;
  }

  .motion-footer-reveal .cinematic-footer-wrapper {
    position: relative !important;
    min-height: 100dvh;
  }

  .ecell-footer-aurora,
  .ecell-footer-marquee-track,
  .ecell-footer-heart {
    animation: none !important;
  }
}
`;

export type MagneticButtonProps =
  | ({ as: "a" } & React.AnchorHTMLAttributes<HTMLAnchorElement>)
  | ({ as?: "button" } & React.ButtonHTMLAttributes<HTMLButtonElement>);

export function MagneticButton(props: MagneticButtonProps): React.ReactElement {
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;

      gsap.to(element, {
        x: x * 0.35,
        y: y * 0.35,
        rotationX: -y * 0.12,
        rotationY: x * 0.12,
        scale: 1.04,
        ease: "power2.out",
        duration: 0.35,
        overwrite: "auto",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        rotationX: 0,
        rotationY: 0,
        scale: 1,
        ease: "elastic.out(1, 0.35)",
        duration: 1,
        overwrite: "auto",
      });
    };

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
      gsap.killTweensOf(element);
    };
  }, []);

  if (props.as === "a") {
    const { as: _as, className, children, ...anchorProps } = props;
    void _as;
    return (
      <a
        ref={(node) => { elementRef.current = node; }}
        className={cn("cursor-pointer", className)}
        {...anchorProps}
      >
        {children}
      </a>
    );
  }

  const { as: _as, className, children, type = "button", ...buttonProps } = props;
  void _as;
  return (
    <button
      ref={(node) => { elementRef.current = node; }}
      type={type}
      className={cn("cursor-pointer", className)}
      {...buttonProps}
    >
      {children}
    </button>
  );
}

const MarqueeItem = () => (
  <div className="flex items-center gap-10 px-5 md:gap-14 md:px-7">
    <span>Ideas into impact</span><span className="text-[#8edcff]">✦</span>
    <span>Build together</span><span className="text-[#8edcff]">✦</span>
    <span>Learn by doing</span><span className="text-[#8edcff]">✦</span>
    <span>Founders of tomorrow</span><span className="text-[#8edcff]">✦</span>
    <span>RV University</span><span className="text-[#8edcff]">✦</span>
  </div>
);

const FOOTER_LINKS = [
  { label: "About", target: "aboutSection" },
  { label: "Events", target: "eventsSection" },
  { label: "Speakers", target: "speakers" },
] as const;

const ArrowIcon = ({ external = false }: { external?: boolean }) => (
  <svg aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    {external ? (
      <path d="M7 17 17 7M8 7h9v9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    ) : (
      <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    )}
  </svg>
);

export function CinematicFooter(): React.ReactElement {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const giantTextRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const linksRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        giantTextRef.current,
        { y: "12vh", scale: 0.86, opacity: 0 },
        {
          y: "0vh",
          scale: 1,
          opacity: 1,
          ease: "power1.out",
          scrollTrigger: {
            trigger: wrapper,
            start: "top 90%",
            end: "bottom bottom",
            scrub: 1,
          },
        },
      );

      gsap.fromTo(
        [headingRef.current, linksRef.current],
        { y: 54, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.14,
          ease: "power3.out",
          scrollTrigger: {
            trigger: wrapper,
            start: "top 72%",
            end: "top 18%",
            scrub: 1,
          },
        },
      );
    }, wrapper);

    return () => ctx.revert();
  }, []);

  const handleSectionClick = (target: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    navigateToSection(target);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div
        ref={wrapperRef}
        className="motion-footer-reveal relative h-[100dvh] w-full"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
      >
        <footer
          id="footer"
          className="cinematic-footer-wrapper fixed bottom-0 left-0 flex h-[100dvh] w-full flex-col justify-between overflow-hidden bg-[#0a0b0c] text-[#f4f4f2]"
        >
          <div className="ecell-footer-aurora pointer-events-none absolute left-1/2 top-1/2 z-0 h-[62vh] w-[82vw] -translate-x-1/2 -translate-y-1/2 rounded-[50%] blur-[85px]" />
          <div className="ecell-footer-grid pointer-events-none absolute inset-0 z-0" />
          <div
            ref={giantTextRef}
            aria-hidden="true"
            className="ecell-footer-giant-text pointer-events-none absolute -bottom-[2vh] left-1/2 z-0 -translate-x-1/2 select-none whitespace-nowrap"
          >
            ECELL
          </div>

          <div className="absolute left-0 top-8 z-10 w-full -rotate-2 scale-105 overflow-hidden border-y border-white/10 bg-black/35 py-3 shadow-2xl backdrop-blur-md md:top-11 md:py-4">
            <div className="ecell-footer-marquee-track flex w-max text-[0.65rem] font-bold uppercase tracking-[0.3em] text-white/50 md:text-xs">
              <MarqueeItem />
              <MarqueeItem />
            </div>
          </div>

          <div className="relative z-10 mx-auto mt-20 flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-5 md:mt-24 md:px-8">
            <p className="mb-4 text-center text-[0.65rem] font-bold uppercase tracking-[0.28em] text-[#8edcff]/70 md:text-xs">
              Entrepreneurship Cell · RV University
            </p>
            <h2
              ref={headingRef}
              className="ecell-footer-heading mb-7 text-center text-[clamp(3.2rem,8vw,7rem)] font-black leading-[0.88] tracking-[-0.06em] md:mb-10"
            >
              Build what&apos;s next.
            </h2>

            <div ref={linksRef} className="flex w-full flex-col items-center gap-4 md:gap-5">
              <div className="flex w-full flex-wrap justify-center gap-3 md:gap-4">
                <MagneticButton
                  as="a"
                  href="https://chat.whatsapp.com/J0MfKUwIZ6J8WfemIBbdlJ"
                  target="_blank"
                  rel="noreferrer"
                  className="ecell-footer-glass ecell-footer-primary ecell-footer-primary-accent group flex items-center gap-4"
                >
                  <span className="ecell-footer-button-label">Join the community</span>
                  <span className="ecell-footer-button-icon"><ArrowIcon external /></span>
                </MagneticButton>
                <MagneticButton
                  as="a"
                  href="mailto:club_ecell@rvu.edu.in"
                  className="ecell-footer-glass ecell-footer-primary ecell-footer-primary-dark group flex items-center gap-4"
                >
                  <span className="ecell-footer-button-label">Start a conversation</span>
                  <span className="ecell-footer-button-icon"><ArrowIcon external /></span>
                </MagneticButton>
              </div>

              <nav aria-label="Footer navigation" className="flex w-full flex-wrap justify-center gap-2 md:gap-3">
                {FOOTER_LINKS.map((link) => (
                  <MagneticButton
                    as="a"
                    key={link.target}
                    href={`#${link.target}`}
                    onClick={handleSectionClick(link.target)}
                    className="ecell-footer-glass ecell-footer-link group flex items-center gap-2.5"
                  >
                    {link.label}
                    <ArrowIcon />
                  </MagneticButton>
                ))}
                <MagneticButton
                  as="a"
                  href="https://www.instagram.com/ecell_rvu/"
                  target="_blank"
                  rel="noreferrer"
                  className="ecell-footer-glass ecell-footer-link group flex items-center gap-2.5"
                >
                  Instagram <ArrowIcon external />
                </MagneticButton>
                <MagneticButton
                  as="a"
                  href="https://www.linkedin.com/search/results/all/?keywords=ECell%2C%20RV%20University"
                  target="_blank"
                  rel="noreferrer"
                  className="ecell-footer-glass ecell-footer-link group flex items-center gap-2.5"
                >
                  LinkedIn <ArrowIcon external />
                </MagneticButton>
              </nav>
            </div>
          </div>

          <div className="relative z-20 flex w-full flex-col items-center justify-between gap-3 px-5 pb-5 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-white/45 sm:flex-row md:px-10 md:pb-7 md:text-[0.68rem]">
            <span>© 2026 ECell RV University</span>
            <span className="flex items-center gap-1.5">
              Crafted with <span className="ecell-footer-heart inline-block text-sm text-[#ff4d6d]">♥</span> by ECell Tech Team
            </span>
            <MagneticButton
              as="button"
              onClick={() => scrollToY(0, { duration: 1.2 })}
              aria-label="Back to top"
              className="ecell-footer-glass ecell-footer-top-button group flex items-center justify-center rounded-full"
            >
              <svg aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="m5 10 7-7 7 7M12 3v18" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
              </svg>
            </MagneticButton>
          </div>
        </footer>
      </div>
    </>
  );
}
