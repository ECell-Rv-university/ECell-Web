# Architecture

## High-level model

ECell-Web is a Next.js App Router frontend. Route files in `app/` compose client experiences from reusable components and independent homepage sections in `src/`. Content and media are bundled from the repository; external services are reached only through links.

```text
Browser
  │
  ▼
Next.js App Router (`app/`)
  ├── root layout, metadata, fonts, analytics, global runtime helpers
  ├── homepage composition
  ├── events archive
  ├── static event-detail routes
  └── Argonyx gallery
        │
        ▼
Feature layer (`src/sections`, `src/components`)
        │
        ├── content/data (`src/data`, feature-local data)
        ├── animation/scroll utilities (`src/utils`)
        ├── styles (`app/globals.css`, `src/styles`, feature CSS)
        └── media (`src/assets`, `public`)
```

## Application shell

`app/layout.tsx` defines global metadata and JSON-LD, loads four fonts, mounts Vercel Analytics and Speed Insights, and installs application-wide navigation behavior:

- `SmoothScroll` manages the shared Lenis lifecycle.
- `RouteScrollManager` resets scroll after pathname changes while preserving hash navigation.
- `PageTransition` listens for the events transition and animates navigation.
- an inline restoration script prevents unwanted native browser restoration conflicts.

`app/globals.css` imports Tailwind CSS, the global token/reset file, and shared section-transition styles.

## Rendering boundaries

The homepage is a client component because it coordinates loader state and browser scroll behavior. Dynamic event pages are server route components: they resolve async route parameters, generate metadata, return not-found responses, and pass serializable event content to `EventDetailClient` for interaction.

Add `"use client"` only where browser APIs, effects, event handlers, or client state are required. Keep metadata, route lookup, and static parameter generation on the server.

## Route architecture

| Route | Entry | Main implementation |
| --- | --- | --- |
| `/` | `app/page.tsx` | `src/sections/*` and shared interactive components |
| `/events` | `app/events/page.tsx` | `src/components/EventsArchive.tsx` |
| `/events/[slug]` | `app/events/[slug]/page.tsx` | `EventDetailClient.tsx` and `src/data/eventsData.ts` |
| `/events/argonyx-26/gallery` | gallery `page.tsx` | `GalleryClient`, `_components`, `_hooks`, and `_data` |
| legacy event paths | redirect page/config | canonical `/events/...` destinations |

`generateStaticParams()` builds canonical event-detail paths from `getAllEventSlugs()`. `getEventBySlug()` also normalizes case and selected Argonyx aliases.

## Component boundaries

`src/sections/` contains homepage domains. A section should encapsulate its markup, styles, local animation, local data, and nested components. `src/components/` contains experiences reused across routes or that operate outside one homepage section, such as smooth scrolling, transitions, the logo overlay, event archive, horizontal flow, and games.

Avoid placing general utilities in a section. Move genuinely shared animation, constants, math, scrolling, and input normalization to `src/utils/`.

## Scroll and animation system

### Lenis

`src/utils/lenis.ts` owns the shared smooth-scroll instance and synchronizes it with the GSAP ticker and ScrollTrigger. It is reference counted so clients acquire and release the same lifecycle instead of creating independent request-animation-frame loops. It also handles nested scroll regions, reduced motion, wheel normalization, refreshes, locks, and programmatic navigation.

Use its exported helpers for scroll-to, reset, refresh, acquire, or lock behavior. Do not instantiate another global Lenis instance.

### GSAP

`src/utils/gsapSetup.ts` is the registration boundary for GSAP and ScrollTrigger. Components import the configured exports from there. Each component owns and cleans up the timelines or triggers it creates.

### Horizontal flow

`HorizontalFlow` translates a vertical ScrollTrigger range into a pinned horizontal track for Speakers, WhatsApp Community, and Footer. Navigation to panels uses a custom `horizontal-flow:navigate` event to map a target panel to the trigger's vertical coordinate.

### Page transition

The Events section dispatches `ecell:events-transition`. The globally mounted `PageTransition` prefetches `/events`, displays the transition, navigates, and includes a fail-safe so a failed sequence cannot permanently block the page.

## Data architecture

There is no centralized content service. The principal sources are:

- event detail records: `src/data/eventsData.ts`;
- event archive records: local data in `src/components/EventsArchive.tsx`;
- homepage event cards: local data in `src/sections/Events/Events.tsx`;
- gallery records: gallery `_data/galleryData.ts`;
- team data: `src/sections/Team/data/TeamData.ts`;
- speakers, sponsors, and community responses: currently colocated with their feature implementations.

Event datasets are not normalized and may disagree. Treat detail records as canonical for detail-route rendering, but reconcile all three event surfaces during editorial updates.

## Styling architecture

The project combines Tailwind's global entry with extensive vanilla CSS. Feature CSS imports produce global selectors; isolation is by naming convention rather than CSS Module compilation. Prefix new selectors with the section/component name and avoid generic selectors that can leak.

Global tokens, reset rules, font bindings, scrollbar behavior, and Lenis compatibility live in `src/styles/global.css`. Shared transition primitives live in `src/styles/SectionTransitions.css`.

## SEO and install metadata

Root and route metadata use Next.js metadata APIs. The layout supplies Organization and WebSite structured data; event surfaces add event metadata/JSON-LD. `manifest.ts`, `robots.ts`, and `sitemap.ts` generate public metadata resources. The project has icons and a manifest but no offline runtime.

## Architectural constraints

- No backend, authentication, CMS, or database exists in this repository.
- Application content changes require a code deployment.
- Large static gallery imports affect bundle/build workload.
- Global CSS requires disciplined selector naming.
- Scroll-pinned features are sensitive to layout and media dimension changes.
- Browser-dependent features need cleanup and reduced-motion fallbacks.