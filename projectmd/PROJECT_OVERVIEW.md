# Project Overview

## Product

ECell-Web is the public website of the Entrepreneurship Cell at RV University, Bengaluru. It presents the organization through an immersive, motion-led landing page and gives visitors access to events, speakers, the team, sponsors, community links, and event archives.

The live site configured by application metadata is `https://ecell-rvu.vercel.app`.

## Primary audiences

- RV University students discovering ECell and its community
- Prospective event participants and startup teams
- Founders, speakers, mentors, sponsors, and partners
- ECell members maintaining organizational and event content

## Product goals

1. Communicate ECell's identity and entrepreneurial mission.
2. Make events discoverable and provide clear registration or archive paths.
3. Highlight community members, speakers, partners, and past outcomes.
4. Create a memorable experience without sacrificing reduced-motion support or responsive behavior.
5. Serve crawlable metadata, social previews, structured data, robots rules, and a sitemap.

## Current experiences

### Landing page (`/`)

The homepage is assembled in `app/page.tsx` in this order:

1. Loader
2. Navigation, floating logo, and arcade launcher overlays
3. Hero
4. About
5. Why Join
6. Story
7. Team
8. Events
9. Sponsors
10. A pinned horizontal flow containing Speakers, WhatsApp Community, and Footer

Notable interactions include the responsive video hero, floating SVG logo, smooth section navigation, horizontal scroll sequence, sponsor network, team and speaker experiences, simulated WhatsApp conversation, and four browser games.

### Event archive (`/events`)

`src/components/EventsArchive.tsx` renders the event listing with a featured event, calendar strip, event-type filters, upcoming cards, previous-event rows, entrance animation, and Event JSON-LD. Cards navigate to event detail routes.

The current implementation does **not** provide free-text search or modal event details.

### Event details (`/events/[slug]`)

Canonical statically generated slugs are:

- `/events/argonyx-26`
- `/events/pitch-e-thon`
- `/events/e-summit`

Unknown slugs return the Next.js not-found response. Argonyx aliases are accepted by data lookup, while only canonical slugs are generated. Upcoming events show registration/contact content; completed Argonyx content includes winners and a gallery preview.

### Argonyx gallery (`/events/argonyx-26/gallery`)

The gallery supports category filters, a chronological timeline, special team-photo layouts, a finale sequence, and a keyboard/touch-capable lightbox with wrapping navigation.

### Metadata routes and redirects

- `/manifest.webmanifest` from `app/manifest.ts`
- `/robots.txt` from `app/robots.ts`
- `/sitemap.xml` from `app/sitemap.ts`
- Legacy event paths redirect to lowercase `/events/...` routes through `next.config.ts`; `/Argonyx-26` also has an App Router redirect page.

## Technology summary

| Area | Technology |
| --- | --- |
| Framework | Next.js 16.3 App Router |
| UI | React 19.2 |
| Language | TypeScript 5, strict mode |
| Styling | Tailwind CSS 4 entry point plus feature-local vanilla CSS |
| Animation | GSAP 3.15, ScrollTrigger, Lenis 1.3 |
| WebGL | Three.js 0.185 with custom shaders |
| Testing | Vitest 4, React Testing Library, JSDOM |
| Quality | ESLint 9 and TypeScript compiler |
| Hosting | Vercel through GitHub Actions |
| Telemetry | Vercel Analytics and Speed Insights |

## System boundaries

The repository is a frontend application with checked-in content and media. No API route, database, CMS, authentication system, service worker, or runtime application environment variable is currently used. External registration and community actions leave the site for services such as Unstop or WhatsApp.

## Known follow-up areas

- Event facts are duplicated across detail, archive, and homepage datasets and can drift.
- The sitemap currently contains only the homepage.
- Some root README descriptions no longer match the implementation.
- Install metadata exists, but offline/PWA behavior is not implemented.
- Rendered metadata titles should be checked when title templates or event titles change.