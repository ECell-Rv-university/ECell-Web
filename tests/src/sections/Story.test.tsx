import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import Story from "@/src/sections/Story/Story";

// Mock next/image
vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={props.src as string} alt={props.alt || ""} className={props.className} />;
  },
}));

// Mock acquireLenis
vi.mock("@/src/utils/lenis", () => ({
  acquireLenis: () => ({
    instance: {
      on: vi.fn(),
      off: vi.fn(),
    },
    release: vi.fn(),
  }),
}));

// Mock GSAP
vi.mock("@/src/utils/gsapSetup", () => ({
  gsap: {
    timeline: () => ({
      to: vi.fn().mockReturnThis(),
      fromTo: vi.fn().mockReturnThis(),
      kill: vi.fn(),
      scrollTrigger: null,
    }),
    set: vi.fn(),
    registerPlugin: vi.fn(),
    matchMedia: () => ({
      add: vi.fn((_conditions, callback) => {
        callback({ conditions: { isDesktop: true, isMobile: false } });
      }),
      revert: vi.fn(),
    }),
    ticker: {
      add: vi.fn(),
      remove: vi.fn(),
    },
    utils: {
      clamp: vi.fn((min, max, val) => Math.min(Math.max(val, min), max)),
    },
  },
  ScrollTrigger: {
    getAll: () => [],
    getById: () => null,
    update: vi.fn(),
    refresh: vi.fn(),
  },
}));

describe("Story Section", () => {
  it("renders story section with backdrop, image panel and reveal text", () => {
    const { container } = render(<Story />);

    const section = container.querySelector("#storyReveal");
    expect(section).toBeInTheDocument();

    const backdrop = container.querySelector(".story-backdrop");
    expect(backdrop).toBeInTheDocument();

    const imagePanel = container.querySelector("#imagePanel");
    expect(imagePanel).toBeInTheDocument();

    const textWrapper = container.querySelector(".story-reveal-text");
    expect(textWrapper).toBeInTheDocument();
  });

  it("renders custom headline and eyebrow properly", () => {
    const { container } = render(
      <Story eyebrow="INNOVATE" headlineMain="FUTURE" headlineAccent="STARTS HERE" />
    );

    const eyebrowEl = container.querySelector(".eyebrow");
    expect(eyebrowEl).toHaveTextContent("INNOVATE");

    const h2El = container.querySelector(".story-reveal-text-inner h2");
    expect(h2El).toHaveTextContent("FUTURE");
    expect(h2El).toHaveTextContent("STARTS HERE");
  });
});
