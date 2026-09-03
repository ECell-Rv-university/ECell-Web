"use client";

import React, { useEffect, useState, useCallback } from "react";
import "./LogoModal.css";

interface LogoModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function LogoModal({
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
}: LogoModalProps): React.ReactElement | null {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalOpen;

  const handleClose = useCallback(() => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      setIsAnimatingOut(false);
      if (isControlled && controlledOnClose) {
        controlledOnClose();
      } else {
        setInternalOpen(false);
      }
    }, 280);
  }, [isControlled, controlledOnClose]);

  useEffect(() => {
    const handleOpenEvent = () => {
      setIsAnimatingOut(false);
      if (isControlled && controlledOnClose) {
        // Parent will manage
      } else {
        setInternalOpen(true);
      }
    };

    window.addEventListener("ecell:open-logo-modal", handleOpenEvent);
    return () => {
      window.removeEventListener("ecell:open-logo-modal", handleOpenEvent);
    };
  }, [isControlled, controlledOnClose]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, handleClose]);

  if (!isOpen && !isAnimatingOut) return null;

  return (
    <div
      className={`logo-modal-overlay ${isAnimatingOut ? "closing" : "open"}`}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="logo-modal-title"
    >
      {/* Ambient background glow */}
      <div className="logo-modal-ambient" />

      {/* Top Center Title */}
      <div
        className="logo-modal-header"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="logo-modal-title" className="logo-modal-title">
          OUR LOGO
        </h2>
      </div>

      {/* Close button */}
      <button
        type="button"
        className="logo-modal-close"
        onClick={handleClose}
        aria-label="Close logo showcase"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
        <span className="logo-modal-close-text">ESC</span>
      </button>

      {/* Central Showcase Stage */}
      <div
        className="logo-modal-stage"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Annotation: Minimal, Yet Memorable */}
        <div className="logo-annotation annotation-left">
          <div className="annotation-text">
            <span>Minimal,</span>
            <strong>Yet Memorable</strong>
          </div>
          <svg
            className="annotation-arrow arrow-left"
            viewBox="0 0 140 90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <marker
                id="arrowhead-left"
                markerWidth="9"
                markerHeight="9"
                refX="7"
                refY="4.5"
                orient="auto"
              >
                <path
                  d="M1 1.5L7 4.5L1 7.5"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </marker>
            </defs>
            <path
              d="M10 80 C30 20, 75 10, 125 50"
              stroke="#ffffff"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
              markerEnd="url(#arrowhead-left)"
            />
          </svg>
        </div>

        {/* Center Balanced RVU Wave Logo */}
        <div className="logo-modal-centerpiece">
          <div className="logo-symbol-glow" />
          <svg
            className="logo-symbol-svg"
            viewBox="210 185 400 435"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g transform="translate(0,808) scale(0.1,-0.1)">
              <path
                className="logo-symbol-path"
                d="M4280 5974 c-41 -19 -110 -60 -154 -91 -97 -67 -473 -364 -606 -478 -200 -172 -391 -303 -500 -345 l-35 -13 -242 -5 -243 -4 0 -304 0 -305 358 3 357 3 63 26 c135 58 309 185 642 469 347 298 503 412 633 468 l62 27 548 3 547 3 0 289 0 290 -678 0 -678 0 -74 -36z"
                fill="#ffffff"
              />
              <path
                className="logo-symbol-path"
                d="M4740 4821 c-142 -46 -296 -152 -684 -470 -133 -109 -311 -251 -396 -315 l-155 -117 -80 -40 c-44 -21 -104 -44 -134 -49 l-54 -10 -368 0 -369 0 0 -295 0 -295 518 0 517 0 46 14 c147 45 254 121 810 578 227 186 408 317 512 372 l79 41 364 3 364 3 0 299 0 300 -457 -1 -458 0 -55 -18z"
                fill="#ffffff"
              />
              <path
                className="logo-symbol-path"
                d="M5064 3631 c-133 -48 -270 -148 -762 -554 -249 -205 -437 -346 -526 -394 l-71 -38 -600 -5 -600 -5 -3 -297 -2 -298 692 0 693 0 47 15 c142 43 311 156 627 420 452 377 559 458 703 530 l90 45 179 0 179 0 0 300 0 300 -297 0 -298 -1 -51 -18z"
                fill="#ffffff"
              />
            </g>
          </svg>
        </div>

        {/* Right Annotation: The Flow of Innovation */}
        <div className="logo-annotation annotation-right">
          <svg
            className="annotation-arrow arrow-right"
            viewBox="0 0 140 90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <marker
                id="arrowhead-right"
                markerWidth="9"
                markerHeight="9"
                refX="7"
                refY="4.5"
                orient="auto"
              >
                <path
                  d="M1 1.5L7 4.5L1 7.5"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </marker>
            </defs>
            <path
              d="M125 15 C80 15, 40 38, 15 72"
              stroke="#ffffff"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
              markerEnd="url(#arrowhead-right)"
            />
          </svg>
          <div className="annotation-text">
            <span>The Flow of</span>
            <strong>Innovation</strong>
          </div>
        </div>

        {/* Bottom Annotation: Unity in Momentum */}
        <div className="logo-annotation annotation-bottom">
          <svg
            className="annotation-arrow arrow-bottom"
            viewBox="0 0 80 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <marker
                id="arrowhead-bottom"
                markerWidth="9"
                markerHeight="9"
                refX="7"
                refY="4.5"
                orient="auto"
              >
                <path
                  d="M1 1.5L7 4.5L1 7.5"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </marker>
            </defs>
            <path
              d="M40 90 C32 62, 48 35, 40 10"
              stroke="#ffffff"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
              markerEnd="url(#arrowhead-bottom)"
            />
          </svg>
          <div className="annotation-text">
            <span>Unity in</span>
            <strong>Momentum</strong>
          </div>
        </div>
      </div>

      {/* Subtle bottom dismissal tip */}
      <div className="logo-modal-footer-tip">
        <span>Click anywhere to dismiss</span>
      </div>
    </div>
  );
}
