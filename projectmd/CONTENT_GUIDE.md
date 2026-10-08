# Content Guide

## Content model

The website does not use a CMS or database. Text, links, dates, people, and media are committed with the source code and become public through a deployment. Every content edit should therefore receive the same review and validation as a code change.

## Content locations

| Content | Current source |
| --- | --- |
| Event detail records | `src/data/events/<event>.ts` |
| Event lookup, aliases, and route slugs | `src/data/eventsData.ts` |
| Events archive cards/rows | `src/components/EventsArchive.tsx` |
| Homepage event showcase | `src/sections/Events/Events.tsx` |
| Argonyx gallery catalog | `app/events/argonyx-26/gallery/_data/galleryData.ts` |
| Team members | `src/sections/Team/data/TeamData.ts` |
| Speaker content | `src/sections/Speakers/components/Speakers.tsx` |
| Sponsor content | `src/sections/Sponsors/Sponsors.tsx` |
| WhatsApp simulated responses | `src/sections/WhatsAppCommunity/WhatsAppCommunity.tsx` |
| Root SEO and structured data | `app/layout.tsx` |
| Route SEO | Relevant route `page.tsx` and event records |
| Public icons/social preview | `public/` |

## Updating an event

Event information is currently duplicated. A complete event edit may require all of these locations:

1. `src/data/events/<event>.ts` for the canonical detail record and `src/data/eventsData.ts` for lookup and static slug registration.
2. `src/components/EventsArchive.tsx` for archive summaries, filters, calendar, and status.
3. `src/sections/Events/Events.tsx` for the homepage card.
4. Gallery data and media if the event has a gallery.
5. `app/sitemap.ts` if the route should appear in the public sitemap.
6. Redirects in `next.config.ts` if a legacy public URL must be preserved.

Check title, slug, date, timezone, venue, status, CTA label, destination URL, organizers, contacts, prize wording, image, metadata title/description, and structured data together.

For completed events, remove or relabel registration actions rather than leaving an active-looking registration CTA. For future events with unknown dates, consistently use a TBA state and avoid machine-readable dates that imply certainty.

## Adding an event detail route

Add a typed record in its own module under `src/data/events/` and register it in `EVENTS_DATA` in `src/data/eventsData.ts`. `getAllEventSlugs()` automatically exposes its key to `generateStaticParams()`, and `/events/[slug]` uses the record for metadata and rendering. The key and `slug` field should match the canonical lowercase kebab-case path.

Also add the corresponding archive/homepage representation as needed. Unknown slugs return not found.

## Images and gallery media

Use meaningful filenames and preserve correct orientation. Put imported event images under a feature folder in `src/assets/`; put stable public resources under `public/`. Provide accurate alt text or captions. Do not add duplicate full-resolution files when an optimized copy is sufficient.

The Argonyx gallery statically imports a large catalog. When updating it:

- preserve unique IDs;
- use valid categories expected by the filters;
- maintain chronological ordering used by the timeline;
- verify previous/next navigation at both ends;
- test special team-photo rendering;
- check bundle/build impact of new media.

## People and organizations

Confirm spelling, role/title, ordering, consent, and image attribution before publishing a person. For sponsors or partners, confirm the approved display name, logo, tier, and destination link. Avoid embedding private contact information unless it is explicitly intended for the public site.

## Links

External links should use HTTPS, have a clear destination, and be checked before release. Use meaningful CTA text instead of generic “click here.” When a link opens a third-party registration/community service, make that destination clear.

## SEO content

Keep page titles concise and unique. Write descriptions for humans, not keyword lists. Ensure Open Graph/Twitter content agrees with visible event facts. Root metadata applies a title template, so review the final rendered title when child metadata already includes the site name.

`app/sitemap.ts` currently lists only the homepage. New public routes are not included automatically unless sitemap generation is expanded.

## Editorial checklist

- Facts match across homepage, archive, detail page, metadata, and structured data.
- Status and CTAs match whether the event is upcoming or completed.
- Dates, venue, prize, organizers, and links were independently verified.
- Public contact information is approved for publication.
- Images have appropriate quality, dimensions, and alternative text.
- Copy is readable on narrow layouts and does not break headings/buttons.
- The sitemap and redirects were considered.
- No credentials, private IDs, or internal notes were introduced.

## Known inconsistency to resolve

Current Argonyx wording, date/duration, and completion status are not uniform across all event datasets. Reconcile these sources with an approved event record before treating any one public summary as authoritative.