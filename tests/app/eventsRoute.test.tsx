import { describe, expect, it, vi } from "vitest";
import { getAllEventSlugs, getEventBySlug } from "@/src/data/eventsData";

describe("Events dynamic routes data", () => {
  it("returns all expected event slugs", () => {
    const slugs = getAllEventSlugs();
    expect(slugs).toContain("argonyx-26");
    expect(slugs).toContain("pitch-e-thon");
    expect(slugs).toContain("e-summit");
    expect(slugs).toContain("hacktoberfest-26");
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

  it("retrieves Hacktoberfest '26 data with rounds and sponsors", () => {
    const event = getEventBySlug("hacktoberfest-26");
    expect(event).toBeDefined();
    expect(event?.title).toContain("Hacktoberfest '26");
    expect(event?.date).toBe("31 October 2026");
    expect(event?.venue).toBe("RV University, Bengaluru");
    expect(event?.organizers).toContain("AWS SBG, RV University");
    expect(event?.organizers).toContain("The Entrepreneurship Cell, RV University");
    expect(event?.registrationUrl).toBe("https://share.google/4J3aOAZrHKNAcyaAF");
    expect(event?.rounds?.length).toBe(2);
    expect(event?.sponsorsPoweredBy?.length).toBeGreaterThan(0);
    expect(event?.sponsorsPresenting?.name).toBe("DigitalOcean");
    expect(event?.sponsorsList?.length).toBeGreaterThan(15);
    expect(event?.contacts.length).toBe(2);
    expect(event?.contacts[0].name).toBe("Nishit");
    expect(event?.contacts[0].phone).toBe("+91 878 057 7400");
    expect(event?.contacts[1].name).toBe("Pranav");
    expect(event?.contacts[1].phone).toBe("+977 982-3000481");
  });

  it("supports alias resolution for Hacktoberfest", () => {
    expect(getEventBySlug("HACKTOBERFEST-26")?.slug).toBe("hacktoberfest-26");
    expect(getEventBySlug("hacktoberfest")?.slug).toBe("hacktoberfest-26");
    expect(getEventBySlug("hacktoberfest26")?.slug).toBe("hacktoberfest-26");
    expect(getEventBySlug("hackobterfest-26")?.slug).toBe("hacktoberfest-26");
    expect(getEventBySlug("hackobterfest26")?.slug).toBe("hacktoberfest-26");
  });

  it("returns undefined for unknown event slugs", () => {
    expect(getEventBySlug("non-existent-event")).toBeUndefined();
  });

  it("renders EventDetailClient for completed Argonyx 26 with closed status, winners, and view images", async () => {
    const { render, screen } = await import("@testing-library/react");
    const EventDetailClient = (await import("@/app/events/[slug]/EventDetailClient")).default;
    const event = getEventBySlug("argonyx-26");
    expect(event).toBeDefined();

    render(<EventDetailClient event={event!} />);
    expect(screen.getByText("Build something")).toBeInTheDocument();
    expect(screen.getByText("that ships.")).toBeInTheDocument();
    expect(screen.getByText("What is Argonyx")).toBeInTheDocument();
    // Registration button should be removed and replaced with Closed / Completed
    expect(screen.getByText(/closed \/ completed/i)).toBeInTheDocument();
    expect(screen.queryByText("Register on Unstop ↗")).not.toBeInTheDocument();
    expect(screen.queryByText("Register now")).not.toBeInTheDocument();
    // Winners and View Images sections
    expect(screen.getAllByText("1ST PLACE").length).toBeGreaterThan(0);
    expect(screen.getAllByText("View Images").length).toBeGreaterThan(0);
  });

  it("renders EventDetailClient for Hacktoberfest 26 with rounds and sponsors", async () => {
    const { render, screen, within } = await import("@testing-library/react");
    const EventDetailClient = (await import("@/app/events/[slug]/EventDetailClient")).default;
    const event = getEventBySlug("hacktoberfest-26");
    expect(event).toBeDefined();

    render(<EventDetailClient event={event!} />);
    expect(screen.getByText("Learn & build with")).toBeInTheDocument();
    expect(screen.getAllByText(/open-source AI/i).length).toBeGreaterThan(0);

    const progression = screen.getByRole("region", { name: /Event Progression & Format/i });
    const stages = within(progression).getByRole("list", { name: "Event stages" });
    const stageItems = within(stages).getAllByRole("listitem");
    expect(stages.tagName).toBe("OL");
    expect(stageItems).toHaveLength(2);
    expect(within(stageItems[0]).getByText("ROUND 01")).toBeInTheDocument();
    expect(within(stageItems[0]).getByText("Virtual Screening")).toBeInTheDocument();
    expect(within(stageItems[0]).getByText("Online Submission")).toBeInTheDocument();
    expect(within(stageItems[0]).getByText("Online PPT Submission")).toBeInTheDocument();
    expect(within(stageItems[1]).getByText("ROUND 02")).toBeInTheDocument();
    expect(within(stageItems[1]).getByText("Offline Presentation & Judging")).toBeInTheDocument();
    expect(within(progression).getByRole("region", { name: "Expected Outcomes of the Event" })).toBeInTheDocument();
    expect(within(progression).getByRole("complementary", { name: "EVENT GUIDELINES" })).toBeInTheDocument();

    expect(screen.getAllByText("DigitalOcean").length).toBeGreaterThan(0);
    expect(screen.getByAltText("GitHub logo")).toBeInTheDocument();
    expect(screen.getByText("Register for Hack Day ↗")).toBeInTheDocument();
    expect(screen.getByText("Nishit")).toBeInTheDocument();
    expect(screen.getByText("Pranav")).toBeInTheDocument();
    expect(screen.getByText("+91 878 057 7400")).toBeInTheDocument();
    expect(screen.getByText("+977 982-3000481")).toBeInTheDocument();
  });

  it("renders EventDetailClient for upcoming event with registration CTA", async () => {
    const { render, screen } = await import("@testing-library/react");
    const EventDetailClient = (await import("@/app/events/[slug]/EventDetailClient")).default;
    const event = getEventBySlug("pitch-e-thon");
    expect(event).toBeDefined();

    render(<EventDetailClient event={event!} />);
    expect(screen.getByText("Register now")).toBeInTheDocument();
    expect(screen.getByText("Join WhatsApp for Updates ↗")).toBeInTheDocument();
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
    expect(hrefs).toContain("/events/hacktoberfest-26");
  });

  it("renders RouteScrollManager and resets scroll on mount", async () => {
    const { render } = await import("@testing-library/react");
    const RouteScrollManager = (await import("@/src/components/RouteScrollManager")).default;
    const scrollToSpy = vi.spyOn(window, "scrollTo");

    render(<RouteScrollManager />);
    expect(scrollToSpy).toHaveBeenCalledWith(0, 0);
  });
});

