import { fireEvent, render, screen } from "@testing-library/react";
import { act } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Speakers from "@/src/sections/Speakers/Speakers";

const getCarousel = () => screen.getByRole("region", { name: "Previous speakers" });

/** Pretends the carousel is on screen so autoplay is allowed to run. */
function mockCarouselInView() {
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(private callback: IntersectionObserverCallback) {}
      observe() {
        this.callback(
          [{ isIntersecting: true, intersectionRatio: 1 } as IntersectionObserverEntry],
          this as unknown as IntersectionObserver,
        );
      }
      disconnect() {}
    },
  );
}

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("Speakers Section", () => {
  it("renders the section heading and initial featured speaker", () => {
    render(<Speakers />);

    expect(screen.getByRole("heading", { name: "Previous Speakers" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Harpreet Sohan" })).toBeInTheDocument();
    expect(screen.getByText("Creative Designer · Wand")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Harpreet Sohan on LinkedIn" })).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/harpsquatch/",
    );
  });

  it("navigates to next and previous speakers with arrow buttons, wrapping around", () => {
    render(<Speakers />);

    const nextBtn = screen.getByRole("button", { name: "Next speaker" });
    const prevBtn = screen.getByRole("button", { name: "Previous speaker" });

    fireEvent.click(nextBtn);
    expect(screen.getByRole("heading", { name: "Mustafa Shariff" })).toBeInTheDocument();
    expect(screen.getByText("Founder · Bengaluru Health Community")).toBeInTheDocument();

    fireEvent.click(prevBtn);
    expect(screen.getByRole("heading", { name: "Harpreet Sohan" })).toBeInTheDocument();

    fireEvent.click(prevBtn);
    expect(screen.getByRole("heading", { name: "Biplab Guha" })).toBeInTheDocument();
  });


  it("navigates with arrow keys while focus is inside the carousel", () => {
    render(<Speakers />);

    fireEvent.keyDown(getCarousel(), { key: "ArrowRight" });
    expect(screen.getByRole("heading", { name: "Mustafa Shariff" })).toBeInTheDocument();

    fireEvent.keyDown(getCarousel(), { key: "ArrowLeft" });
    expect(screen.getByRole("heading", { name: "Harpreet Sohan" })).toBeInTheDocument();
  });

  it("ignores arrow keys pressed elsewhere on the page", () => {
    render(<Speakers />);

    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(screen.getByRole("heading", { name: "Harpreet Sohan" })).toBeInTheDocument();
  });

  it("navigates using horizontal touch swipes and ignores vertical scrolls", () => {
    const { container } = render(<Speakers />);
    const stage = container.querySelector("[data-carousel-stage]");
    expect(stage).toBeInTheDocument();

    // Swipe left (next)
    fireEvent.touchStart(stage!, { touches: [{ clientX: 200, clientY: 100 }] });
    fireEvent.touchEnd(stage!, { changedTouches: [{ clientX: 100, clientY: 105 }] });
    expect(screen.getByRole("heading", { name: "Mustafa Shariff" })).toBeInTheDocument();

    // Swipe right (prev)
    fireEvent.touchStart(stage!, { touches: [{ clientX: 100, clientY: 100 }] });
    fireEvent.touchEnd(stage!, { changedTouches: [{ clientX: 200, clientY: 105 }] });
    expect(screen.getByRole("heading", { name: "Harpreet Sohan" })).toBeInTheDocument();

    // Mostly vertical gesture is a scroll, not a swipe
    fireEvent.touchStart(stage!, { touches: [{ clientX: 200, clientY: 100 }] });
    fireEvent.touchEnd(stage!, { changedTouches: [{ clientX: 140, clientY: 300 }] });
    expect(screen.getByRole("heading", { name: "Harpreet Sohan" })).toBeInTheDocument();
  });


  it("autoplays while on screen and stops after manual navigation", () => {
    vi.useFakeTimers();
    mockCarouselInView();
    render(<Speakers />);

    act(() => vi.advanceTimersByTime(7000));
    expect(screen.getByRole("heading", { name: "Mustafa Shariff" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Next speaker" }));
    expect(screen.getByRole("heading", { name: "Arshdeep Singh" })).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(21000));
    expect(screen.getByRole("heading", { name: "Arshdeep Singh" })).toBeInTheDocument();
  });

  it("pauses autoplay while hovered", () => {
    vi.useFakeTimers();
    mockCarouselInView();
    render(<Speakers />);

    fireEvent.mouseEnter(getCarousel());
    act(() => vi.advanceTimersByTime(14000));
    expect(screen.getByRole("heading", { name: "Harpreet Sohan" })).toBeInTheDocument();

    fireEvent.mouseLeave(getCarousel());
    act(() => vi.advanceTimersByTime(7000));
    expect(screen.getByRole("heading", { name: "Mustafa Shariff" })).toBeInTheDocument();
  });

  it("keeps the full quote readable for screen readers", () => {
    render(<Speakers />);
    expect(
      screen.getByText(/^Building enduring tech products requires obsessing/, { selector: ".sr-only" }),
    ).toBeInTheDocument();
  });
});
