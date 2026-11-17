import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import Sponsors from "@/src/sections/Sponsors/Sponsors";

const { scrollTriggerKillMock, scrollTriggerCreateMock } = vi.hoisted(() => {
  const kill = vi.fn();
  return {
    scrollTriggerKillMock: kill,
    scrollTriggerCreateMock: vi.fn(() => ({ kill })),
  };
});

vi.mock("next/image", () => ({
  default: ({ alt }: { alt: string }) => <span role="img" aria-label={alt} />,
}));

vi.mock("@/src/utils/gsapSetup", () => {
  const timelineMock = () => ({
    fromTo: vi.fn().mockReturnThis(),
    to: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    kill: vi.fn(),
  });

  return {
    gsap: {
      context: (fn: () => void) => {
        fn();
        return { revert: vi.fn() };
      },
      timeline: vi.fn(timelineMock),
      fromTo: vi.fn(),
      to: vi.fn(),
      set: vi.fn(),
      utils: {
        toArray: <T,>(target: string | T[]): T[] =>
          typeof target === "string"
            ? (Array.from(document.querySelectorAll(target)) as unknown as T[])
            : Array.from(target),
      },
      ticker: {
        add: vi.fn(),
        remove: vi.fn(),
        deltaRatio: vi.fn(() => 1),
      },
    },
    ScrollTrigger: {
      create: scrollTriggerCreateMock,
      getAll: () => [],
      getById: () => null,
    },
  };
});

class ObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

function stubMatchMedia(mobile = false) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: mobile && query.includes("max-width: 768px"),
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  );
}

describe("Sponsors section & StarField orrery", () => {
  beforeEach(() => {
    vi.stubGlobal("IntersectionObserver", ObserverStub);
    vi.stubGlobal("ResizeObserver", ObserverStub);
    stubMatchMedia(false);
    scrollTriggerCreateMock.mockClear();
    scrollTriggerKillMock.mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the solar system orrery with three orbital tracks, planets, and rocket", () => {
    const { container } = render(<Sponsors />);

    expect(container.querySelector(".sponsors-orrery")).toBeInTheDocument();
    expect(container.querySelectorAll(".orrery-track")).toHaveLength(3);
    expect(container.querySelectorAll(".solar-planet-node")).toHaveLength(3);
    expect(container.querySelector(".solar-planet-node--earth")).toBeInTheDocument();
    expect(container.querySelector(".orrery-rocket")).toBeInTheDocument();
    expect(container.querySelector(".orrery-crash-burst")).toBeInTheDocument();
  });

  it("resonates the orrery when a sponsor card is hovered and clears on leave", () => {
    const { container } = render(<Sponsors />);
    const orrery = container.querySelector(".sponsors-orrery")!;
    const card = container.querySelector(".sponsor-card-inner")!;

    expect(orrery).not.toHaveClass("is-resonating");

    fireEvent.mouseEnter(card);
    expect(orrery).toHaveClass("is-resonating");

    fireEvent.mouseLeave(card);
    expect(orrery).not.toHaveClass("is-resonating");
  });

  it("renders the sponsorship CTA button as the docking target", () => {
    const { container } = render(<Sponsors />);
    const cta = container.querySelector<HTMLAnchorElement>(".sponsors-cta");

    expect(cta).toBeInTheDocument();
    expect(cta).toHaveAttribute("href", expect.stringContaining("mailto:"));
    expect(cta).toHaveTextContent("Want to sponsor us?");
  });

  it("hides the orrery on mobile viewports", () => {
    stubMatchMedia(true);
    const { container } = render(<Sponsors />);

    expect(container.querySelector(".sponsors-orrery")).not.toBeInTheDocument();
  });

  it("registers and cleans up the ScrollTrigger pin without DOM unmount errors", () => {
    const { unmount } = render(<Sponsors />);

    expect(scrollTriggerCreateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        pin: true,
        start: "top top",
      })
    );

    unmount();
    expect(scrollTriggerKillMock).toHaveBeenCalled();
  });
});
