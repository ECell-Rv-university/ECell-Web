# Folder Structure

## Repository map

```text
ECell-Web/
├── .github/
│   └── workflows/
│       ├── ci.yml                  # Typecheck, lint, tests, and production build
│       ├── pr-cd.yml               # Pull-request preview deployments
│       └── vercel-cd.yml           # Production deployment on main
├── app/                            # Next.js App Router and route metadata
│   ├── Argonyx-26/page.tsx         # Legacy redirect route
│   ├── events/
│   │   ├── [slug]/
│   │   │   ├── EventDetail.css
│   │   │   ├── EventDetailClient.tsx
│   │   │   └── page.tsx
│   │   ├── argonyx-26/gallery/
│   │   │   ├── _components/        # Gallery-specific UI
│   │   │   ├── _data/              # Gallery image catalog
│   │   │   ├── _hooks/             # Gallery behavior and animation
│   │   │   ├── GalleryClient.tsx
│   │   │   └── page.tsx
│   │   └── page.tsx                # Events archive route
│   ├── globals.css                 # Tailwind and global style imports
│   ├── layout.tsx                  # Root shell, metadata, fonts, telemetry
│   ├── manifest.ts                 # Web app manifest
│   ├── page.tsx                    # Homepage section composition
│   ├── robots.ts                   # robots.txt generator
│   └── sitemap.ts                  # sitemap.xml generator
├── public/                         # Files served from stable public URLs
│   ├── favicon*                    # Browser icons
│   ├── logo-* / logo.webp          # Install/brand images
│   └── og-image.webp               # Social sharing image
├── src/
│   ├── assets/                     # Bundled, imported feature media
│   ├── components/                 # Cross-route and reusable experiences
│   │   ├── GameLauncher/           # Launcher and four minigames
│   │   ├── HorizontalFlow/         # Pinned vertical-to-horizontal flow
│   │   ├── InfiniteSpiral/         # Gallery preview effect
│   │   ├── LaserFlow/              # Three.js shader experience
│   │   ├── PageTransition/         # Route transition overlay
│   │   └── ...                     # Logo, scroll, archive, and other helpers
│   ├── data/
│   │   ├── eventsData.ts           # Event lookup and compatibility exports
│   │   └── events/                 # Per-event records and shared types
│   │       ├── types.ts
│   │       ├── argonyx26.ts
│   │       ├── pitchEThon.ts
│   │       ├── eSummit.ts
│   │       └── hacktoberfest26.ts
│   ├── sections/                   # Independent homepage feature domains
│   │   ├── About/
│   │   ├── Events/
│   │   ├── Footer/
│   │   ├── Hero/                   # Hero.tsx + HeroAnimations.ts (scroll shrink)
│   │   │   ├── components/         # HeroReveal (WebGL), HeroIntro, HeroScrollHint
│   │   │   ├── webgl/              # Shaders, title layout, glass letters, nebula
│   │   │   └── styles/             # Hero section CSS
│   │   ├── Loader/
│   │   ├── Nav/
│   │   ├── Speakers/
│   │   ├── Sponsors/
│   │   ├── Story/
│   │   ├── Team/
│   │   ├── WhatsAppCommunity/
│   │   └── WhyJoin/
│   ├── styles/                     # Global tokens and shared transitions
│   ├── types/                      # Ambient asset declarations
│   └── utils/                      # Shared animation, scroll, input, and math code
├── tests/
│   ├── app/                        # Route and metadata tests
│   ├── src/                        # Component and utility tests
│   └── setup.ts                    # JSDOM setup and browser/Next mocks
├── projectmd/                      # Project documentation (this directory)
├── .nvmrc                          # Node 24 selection
├── CONTRIBUTING.md                 # Team contribution policy
├── README.md                       # Public repository overview
├── eslint.config.mjs               # ESLint flat configuration
├── next.config.ts                  # Next image and redirect configuration
├── package.json                    # Scripts, dependencies, Node engine
├── postcss.config.mjs              # Tailwind PostCSS plugin
├── tsconfig.json                   # Strict TypeScript configuration
├── vercel.json                     # Vercel framework/output settings
└── vitest.config.mts               # Vitest, JSDOM, aliases, and test inclusion
```

Generated/local directories such as `.next/`, `dist/`, `node_modules/`, and `.vercel/` are not application source and should not be edited as feature code.

## Placement rules

### New route

Create a route directory under `app/`. Keep its server `page.tsx` responsible for route data, metadata, and not-found behavior. Place interactive browser UI in a nearby client component when it is route-specific, or in `src/components/` when reusable.

### New homepage section

Use a PascalCase directory under `src/sections/`:

```text
src/sections/NewSection/
├── NewSection.tsx
├── NewSection.css
├── components/        # Optional section-only UI
├── data/              # Optional section-only content
├── hooks/             # Optional behavior
└── animations/        # Optional complex timelines
```

The exact nesting may follow nearby sections. The important boundary is that section-only code remains inside the section and shared code does not.

### New reusable component

Place cross-route or cross-section UI in `src/components/<ComponentName>/`. Keep its CSS and internal helpers with it. A single-file component is acceptable when no supporting files are needed.

### New data

Use `src/data/` for data consumed by multiple application areas. Keep truly feature-specific datasets in that feature's `data/` or `_data/` directory. Prefer typed exported records over untyped object literals.

### New styles

Use shared CSS only for tokens, reset behavior, or genuinely reusable primitives. Feature styles should be colocated and selectors should be prefixed because the project does not use CSS Modules for these files.

### New assets

- Use `src/assets/<feature>/` when importing media from TypeScript/TSX so Next/build tooling owns it.
- Use `public/` when a file needs a stable URL, such as favicons, verification files, social images, or `<video>` sources.
- Do not duplicate the same large media file across both locations.

### New tests

Mirror the implementation area under `tests/app/` or `tests/src/` and use the `.test.ts` or `.test.tsx` suffix configured by Vitest.

## Import conventions

The TypeScript alias `@/*` resolves from the repository root. Existing imports therefore use forms such as:

```ts
import Nav from "@/src/sections/Nav/Nav";
import { getEventBySlug } from "@/src/data/eventsData";
```

Prefer clear feature boundaries over deep imports into another feature's private implementation.