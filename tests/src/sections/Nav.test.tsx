import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PAGE_TRANSITION_EVENT } from "@/src/components/PageTransition/PageTransition";
import Nav from "@/src/sections/Nav/Nav";
import SubNav from "@/src/sections/Nav/SubNav";

// The site runs on the App Router, whose Link calls `onNavigate` on a plain
// left click before navigating. The default `next/link` export outside an app
// bundle is the Pages Router one, which never does without a router mounted,
// and the App Router one can't load under jsdom, so stand in for it.
vi.mock("next/link", async () => {
  const React = await import("react");
  type StubLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    onNavigate?: (event: { preventDefault: () => void }) => void;
  };
  return {
    default: ({ onNavigate, onClick, ...props }: StubLinkProps) =>
      React.createElement("a", {
        ...props,
        onClick: (event: React.MouseEvent<HTMLAnchorElement>) => {
          onClick?.(event);
          event.preventDefault();
          onNavigate?.({ preventDefault: () => {} });
        },
      }),
  };
});

describe("SubNav (events)", () => {
  it("renders a plain Home link to '/' with no logo button, hint, or modal", () => {
    const { container } = render(<SubNav />);

    const homeLink = screen.getByRole("link", { name: /home/i });
    expect(homeLink).toHaveAttribute("href", "/");
    expect(container.querySelector(".nav__logo-button")).toBeNull();
    expect(container.querySelector(".nav__logo-hint")).toBeNull();
    expect(screen.queryByText(/click to explore/i)).toBeNull();

    fireEvent.click(homeLink);
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

describe("Nav (home)", () => {
  it("shows the logo hint only once the logo settles in the nav, and opens the logo modal", () => {
    render(<Nav />);

    // Hidden (and unreachable) while the logo is still in the hero.
    expect(screen.queryByRole("button", { name: "Click to explore our logo story" })).toBeNull();
    // The empty logo slot isn't clickable before the logo lands in it either.
    expect(screen.queryByRole("button", { name: "View our logo symbolism" })).toBeNull();

    act(() => {
      window.dispatchEvent(new CustomEvent("ecell:logo-in-nav", { detail: { inNav: true } }));
    });
    expect(screen.getByRole("button", { name: "Click to explore our logo story" })).toHaveClass("is-visible");

    fireEvent.click(screen.getByRole("button", { name: "View our logo symbolism" }));
    expect(within(screen.getByRole("dialog")).getByText("OUR LOGO")).toBeInTheDocument();
  });

  it("does not render the removed Join Us link", () => {
    render(<Nav />);
    expect(screen.queryByRole("link", { name: "Join Us" })).toBeNull();
  });
});

describe("Opportunities link", () => {
  it("goes to /opportunities through the page transition curtain", () => {
    render(<Nav />);
    const onTransition = vi.fn();
    window.addEventListener(PAGE_TRANSITION_EVENT, onTransition);

    const link = screen.getByRole("link", { name: "Opportunities" });
    expect(link).toHaveAttribute("href", "/opportunities");
    fireEvent.click(link);

    window.removeEventListener(PAGE_TRANSITION_EVENT, onTransition);
    expect(onTransition).toHaveBeenCalledTimes(1);
    expect((onTransition.mock.calls[0][0] as CustomEvent).detail).toEqual({ path: "/opportunities" });
  });
});
