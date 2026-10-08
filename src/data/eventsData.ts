import { argonyx26Event } from "./events/argonyx26";
import { pitchEThonEvent } from "./events/pitchEThon";
import { eSummitEvent } from "./events/eSummit";
import { hacktoberfest26Event } from "./events/hacktoberfest26";
import type { EventDetailData } from "./events/types";

export * from "./events/types";

export const EVENTS_DATA: Record<string, EventDetailData> = {
  "argonyx-26": argonyx26Event,
  "pitch-e-thon": pitchEThonEvent,
  "e-summit": eSummitEvent,
  "hacktoberfest-26": hacktoberfest26Event,
};

export function getEventBySlug(slug: string): EventDetailData | undefined {
  const normalized = slug.toLowerCase();
  if (normalized === "argonyx-26" || normalized === "argonyx" || normalized === "argonyx26") {
    return EVENTS_DATA["argonyx-26"];
  }
  if (
    normalized === "hacktoberfest-26" ||
    normalized === "hacktoberfest" ||
    normalized === "hacktoberfest26" ||
    normalized === "hackobterfest-26" ||
    normalized === "hackobterfest26" ||
    normalized === "hackobterfest"
  ) {
    return EVENTS_DATA["hacktoberfest-26"];
  }
  return EVENTS_DATA[normalized];
}

export function getAllEventSlugs(): string[] {
  return Object.keys(EVENTS_DATA);
}
