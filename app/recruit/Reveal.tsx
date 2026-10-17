"use client";

import React, { useLayoutEffect, useRef } from "react";

interface RevealProps extends React.HTMLAttributes<HTMLUListElement> {
  children: React.ReactNode;
}

/**
 * A list whose items rise in, staggered, the first time it scrolls into view.
 * Items are only hidden once this has run and the list is still below the
 * fold, so without JavaScript, with reduced motion, or when the page loads
 * already scrolled past it, the list simply shows.
 */
export default function Reveal({ children, ...props }: RevealProps): React.ReactElement {
  const listRef = useRef<HTMLUListElement>(null);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (
      !list ||
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      list.getBoundingClientRect().top < window.innerHeight
    ) {
      return;
    }

    list.dataset.reveal = "armed";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        list.dataset.reveal = "shown";
      },
      { threshold: 0.15 }
    );

    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  return (
    <ul ref={listRef} {...props}>
      {children}
    </ul>
  );
}
