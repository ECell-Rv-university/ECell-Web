import { describe, expect, it, vi } from "vitest";
import { getAllEventSlugs, getEventBySlug } from "@/src/data/eventsData";

describe("Events dynamic routes data", () => {
  it("returns all expected event slugs", () => {
    const slugs = getAllEventSlugs();
    expect(slugs).toContain("argonyx-26");
    expect(slugs).toContain("pitch-e-thon");
    expect(slugs).toContain("e-summit");
  });

  it("retrieves Argonyx 2.0 with all required properties", () => {
    const event = getEventBySlug("argonyx-26");
    expect(event).toBeDefined();
    expect(event?.title).toContain("ARGONYX");
    expect(event?.venue).toBe("RV University, Bengaluru");
    expect(event?.registrationUrl).toContain("unstop.com");
    expect(event?.ledger.length).toBeGreaterThan(0);
    expect(event?.organizers.length).toBeGreaterThan(0);
    expect(event?.contacts.length).toBeGreaterThan(0);
  });

  it("supports case-insensitive and alias resolution for Argonyx", () => {
    expect(getEventBySlug("ARGONYX-26")?.slug).toBe("argonyx-26");
    expect(getEventBySlug("argonyx")?.slug).toBe("argonyx-26");
  });

  it("retrieves Pitch-e-thon data", () => {
    const event = getEventBySlug("pitch-e-thon");
    expect(event).toBeDefined();
    expect(event?.title).toContain("Pitch-e-thon");
    expect(event?.venue).toBe("RV University, Bengaluru");
  });

  it("retrieves E-Summit data", () => {
    const event = getEventBySlug("e-summit");
    expect(event).toBeDefined();
    expect(event?.title).toContain("E-Summit");
    expect(event?.venue).toBe("RV University, Bengaluru");
  });

  it("returns undefined for unknown event slugs", () => {
    expect(getEventBySlug("non-existent-event")).toBeUndefined();
  });

  it("renders EventDetailClient successfully with complete event data", async () => {
    const { render, screen } = await import("@testing-library/react");
    const EventDetailClient = (await import("@/app/events/[slug]/EventDetailClient")).default;
    const event = getEventBySlug("argonyx-26");
    expect(event).toBeDefined();

    render(<EventDetailClient event={event!} />);
    expect(screen.getByText("Build something")).toBeInTheDocument();
    expect(screen.getByText("that ships.")).toBeInTheDocument();
    expect(screen.getByText("What is Argonyx")).toBeInTheDocument();
    expect(screen.getByText("Register on Unstop ↗")).toBeInTheDocument();
  });

  it("renders EventsArchive with clickable event links", async () => {
    const { render, screen } = await import("@testing-library/react");
    const EventsArchive = (await import("@/src/components/EventsArchive")).default;

    render(<EventsArchive />);
    expect(screen.getByText(/EVENTS & WORKSHOPS/)).toBeInTheDocument();
    const links = screen.getAllByRole("link");
    const hrefs = links.map((l) => l.getAttribute("href"));
    expect(hrefs).toContain("/events/argonyx-26");
    expect(hrefs).toContain("/events/pitch-e-thon");
    expect(hrefs).toContain("/events/e-summit");
  });

  it("renders RouteScrollManager and resets scroll on mount", async () => {
    const { render } = await import("@testing-library/react");
    const RouteScrollManager = (await import("@/src/components/RouteScrollManager")).default;
    const scrollToSpy = vi.spyOn(window, "scrollTo");

    render(<RouteScrollManager />);
    expect(scrollToSpy).toHaveBeenCalledWith(0, 0);
  });
});

