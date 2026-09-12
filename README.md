# ECell RV University Website

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/GSAP-3.15-88CE02?style=for-the-badge&logo=greensock)](https://greensock.com/)
[![Three.js](https://img.shields.io/badge/Three.js-0.185-white?style=for-the-badge&logo=three.js&logoColor=black)](https://threejs.org/)
[![Vitest](https://img.shields.io/badge/Vitest-4.1-FCC72B?style=for-the-badge&logo=vitest&logoColor=black)](https://vitest.dev/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel)](https://ecell-rvu.vercel.app)

**The official digital experience of the Entrepreneurship Cell at RV University, Bengaluru.**  
An Awwwards-inspired, high-performance web platform engineered with Next.js 16 App Router, React 19, GSAP ScrollTrigger choreography, custom WebGL GLSL shaders, and interactive micro-experiences.

[🌐 Live Website](https://ecell-rvu.vercel.app) • [📖 Contributing Guide](./CONTRIBUTING.md) • [🚀 Deployments](#-cicd--deployment-workflows)

</div>

---

## 🎬 Demo

https://github.com/user-attachments/assets/9ab5ec05-6a5e-4ba2-923c-7685b89def26

---

## 📌 Overview

The **ECell RV University Website** serves as the central flagship platform for RV University's student entrepreneurial ecosystem. Built to move past standard university club websites, it delivers an immersive, motion-rich narrative that showcases:

- **Flagship Initiatives & Hackathons** (Argonyx Hackathon, Winter Tech Talks, Talk Startup With Me).
- **Interactive Community Simulator** with live conversational bot Q&A and direct WhatsApp group onboarding.
- **In-Browser Arcade** with four custom retro and reflex games.
- **Interactive Sponsor Constellation** featuring animated network graphs and dynamic node connections.
- **Team & Speaker Spotlights** with 3D carousel stacks, domain filtering, and dedicated director views.
- **Events Archive Route** (`/events`) with search, category filtering, and modal event deep-dives.

---

## ✨ Key Features & Experience Highlights

### 1. 🎞️ Cinematic Video Hero with Scroll Scrubbing
- Dual-source responsive background video (`hero2-optimized.mp4` on desktop, `hero-mobile.mp4` on mobile).
- Power-efficient video playback controlled via `IntersectionObserver` (paused when offscreen or hidden in background tabs, throttled to `0.5x` playback speed for a dreamlike feel).
- GSAP ScrollTrigger pin sequence that scales down the viewport video into a curved container card, unlocking headline typography and dynamic marquees.

### 2. 🌀 Morphing SVG Floating Logo
- Central brand mark constructed from hand-calculated SVG curves and stroke paths.
- Animates dynamically across the Hero scroll journey using dynamic `getTotalLength()` stroke offsets (`strokeDasharray` / `strokeDashoffset`).
- Seamlessly flies and docks directly into the sticky top navigation bar (`ecell:logo-in-nav` custom event).
- Clickable brand mark opens an interactive **Logo Breakdown Modal** illustrating the brand geometry and symbolism.

### 3. ↔️ Pinned Horizontal Flow Section
- Seamless horizontal viewport scroll chaining **Speakers**, **WhatsApp Community**, and **Footer** into a continuous side-scrolling track.
- Navigation links translate vertical page scroll coordinates into the horizontal track's exact ScrollTrigger progress through the custom `horizontal-flow:navigate` event.

### 4. ⚡ Live Three.js WebGL Laser & Fog Shader (`LaserFlow`)
- Custom GLSL vertex and fragment shaders embedded directly in the WhatsApp Community section.
- Procedural volumetric light rays, dynamic fog wisps, mouse-tilt parallax, noise perturbation, and ray decay rendered at native device pixel ratio.

### 5. 💬 Interactive WhatsApp Community Simulator
- Real-time simulated WhatsApp interface with pre-configured Q&A matching rules (`COMMUNITY_QA_RULES`).
- Suggested topic prompt chips ("Say Hello", "What is ECell?", "How to join?", "Upcoming events", "Who can join?").
- Direct one-click invite into the official RV University WhatsApp community group.

### 6. 🕹️ Built-in Arcade Launcher
Floating interactive game launcher with 4 fully playable, state-managed minigames:
1. **Founder Sprint**: Fast-paced reflex minigame catching moving sparks against the clock.
2. **Signal Snake**: Classic grid-based retro snake with smooth controls and score tracking.
3. **Memory Match**: Card-flipping pattern matching game with fewest-move calculations.
4. **2048**: Sliding tile puzzle with swipe/arrow key inputs and dynamic tile merging.

### 7. 🌌 Interactive Sponsor Constellation Network
- Dynamic network topology organizing sponsors (Nokia, Red Bull, The Belgian Waffle Co., TVS, Herody, Akshaya Motors / Mercedes-Benz, etc.) across 4 tiers.
- Real-time SVG line connection rendering that illuminates adjacent nodes upon cursor hover.

### 8. 👥 3D Team Stack & Directory
- Fluid 3D card carousel with depth translation, touch swipe gestures, and keyboard navigation.
- Dedicated spotlight detail modal and an expandable, comprehensive **Team Directory** filterable by departments (Presidential, Advisory, Tech, PR, Partnerships, Logistics).

### 9. 🌊 Smooth Momentum Scrolling (`Lenis`)
- Custom reference-counted Lenis singleton wrapper (`acquireLenis`) ensuring zero memory leaks or competing `requestAnimationFrame` loops across route transitions.

---

## 🛠️ Tools & Technology Stack

| Category | Technology | Purpose |
|---|---|---|
| **Core Framework** | [Next.js 16 (App Router)](https://nextjs.org/) | Server rendering, file-based routing, SEO, static asset optimization |
| **UI Library** | [React 19](https://react.dev/) | Component architecture, React hooks, concurrent features |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Strict static typing, interfaces for data models and animation options |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + PostCSS | Modern CSS utility tokens, `@theme` integration, responsive design |
| **Custom Styling** | Vanilla CSS Modules & Scoped Styles | Isolated section styling, GPU-accelerated motion classes, CSS variables |
| **Animation Engine** | [GSAP 3.15](https://greensock.com/) + ScrollTrigger | Timeline choreography, scroll-pinned scenes, kinetic typography |
| **3D & Shaders** | [Three.js 0.185](https://threejs.org/) | Interactive WebGL canvas, custom GLSL vertex/fragment shaders |
| **Smooth Scrolling** | [Lenis 1.3](https://github.com/darkroomengineering/lenis) | Momentum-based smooth wheel scrolling synchronized with GSAP |
| **Typography** | [Next Font Google](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) | Variable font loading (`Archivo`, `Bebas Neue`, `Fraunces`, `Inter`) |
| **Analytics & Web Vitals** | `@vercel/analytics` & `@vercel/speed-insights` | Real-time traffic analytics and Core Web Vitals telemetry |
| **Testing** | [Vitest 4](https://vitest.dev/) + React Testing Library + JSDOM | Fast unit and component testing suite |
| **Code Quality** | ESLint 9 (`eslint-config-next`) + TypeScript Compiler | Static code analysis, linting, zero TypeScript emit verification |
| **CI/CD** | GitHub Actions | Automated lint, typecheck, test, preview, and production deploy |

---

## 🏗️ Architecture: How We Are Doing Things

### 1. Section Independence Pattern
To allow multi-contributor collaboration without merge conflicts or layout degradation:
- Every section is an isolated directory inside `src/sections/<SectionName>/`.
- Each section encapsulates its own component (`.tsx`), scoped styles (`.css`), and animations (`*Animations.ts`).
- Sections **never** rely on negative margins or layout assumptions from sibling components.
- Any section can be mounted independently or re-ordered inside `app/page.tsx` without breaking layout flow.

```
src/sections/Team/
├── animations/
│   └── TeamAnimations.ts      # Dedicated GSAP logic
├── components/
│   ├── Team.tsx               # 3D carousel and section wrapper
│   └── TeamDirectory.tsx      # Filterable full-roster modal
├── data/
│   └── TeamData.ts            # Typed roster datasets
├── styles/
│   ├── Team.css
│   ├── TeamDirectory.css
│   └── TeamLayout.css
└── index.ts                   # Clean unified barrel export
```

### 2. Smooth Scrolling & Shared Lenis Lifecycle
To prevent multiple competing scroll listeners or requestAnimationFrame loops during client-side navigation:
- `src/utils/lenis.ts` manages an app-wide singleton instance with **reference counting** (`consumerCount`).
- Calling `acquireLenis()` increments the consumer count and activates the RAF loop.
- The returned `release()` method decrements the counter; when zero consumers remain (e.g., when leaving to a page with native scrolling), the Lenis instance and animation loops are destroyed cleanly.

### 3. Centralized GSAP & ScrollTrigger Registration
- Next.js client hydration can cause duplicated plugin registration warnings if `gsap.registerPlugin(ScrollTrigger)` is called inside multiple files.
- `src/utils/gsapSetup.ts` handles single-point registration:
  ```ts
  import gsap from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";

  gsap.registerPlugin(ScrollTrigger);
  export { gsap, ScrollTrigger };
  ```
- All components import `gsap` and `ScrollTrigger` from this single utility.

### 4. Pinned Horizontal Track & Navbar Coordinate Mapping
`HorizontalFlow` embeds vertical-to-horizontal pinning using ScrollTrigger:
```ts
const getScrollAmount = () => track.scrollWidth - window.innerWidth;

gsap.to(track, {
  x: () => -getScrollAmount(),
  ease: "none",
  scrollTrigger: {
    trigger: container,
    start: "top top",
    end: () => `+=${getScrollAmount()}`,
    pin: true,
    scrub: 0.8,
    invalidateOnRefresh: true,
  },
});
```
When a user clicks a link in the Navbar targeting a panel inside the horizontal track (such as `#speakers` or `#footer`), a custom `horizontal-flow:navigate` event calculates the panel index progress (`progress = index / total`) and smoothly scrolls the window to the exact vertical trigger offset.

### 5. WebGL Shader Architecture (`LaserFlow`)
The interactive background in the WhatsApp Community section compiles custom GLSL shaders with Three.js:
- **Vertex Shader**: Simple full-screen quad geometry passing normalized coordinates.
- **Fragment Shader**: Computes multi-octave fractional noise, volumetric light falloff, beam convergence points, and dynamic smoke wisps in real-time.
- Mouse movement smoothly tilts the projection vectors using lerped damping values (`mouseSmoothTime`).

### 6. Kinetic Typography & SVG Path Drawing
- **Kinetic Jiggle**: Words in the Story section are split into individual characters wrapped in `<span className="jiggle-char">`, animated with randomized micro-rotations and translations as the user scrolls.
- **Stroke Drawing**: SVG strokes on the loader and floating logo use the `prepareSVG` helper to set `strokeDasharray` and `strokeDashoffset` to the exact path length, animating the offset to `0` for an organic hand-drawn appearance.

### 7. Performance & Reduced Motion
- Every GSAP animation checks `window.matchMedia("(prefers-reduced-motion: reduce)").matches`. If active, animations immediately resolve to their final visible state with zero motion overhead.
- Videos are throttled and paused when out of the viewport using `IntersectionObserver`.
- Styles use GPU-accelerated properties (`transform`, `opacity`, `filter`) to avoid layout thrashing.

### 8. SEO, OpenGraph & Structured Schema
- Built-in Schema.org `WebSite` and `Organization` JSON-LD graphs in `app/layout.tsx`.
- Auto-generated `manifest.webmanifest`, `robots.txt`, and `sitemap.xml`.
- Rich metadata tags for Twitter Cards and OpenGraph with high-resolution WebP banners.

---

## 📁 Project Structure

```text
ECell-Web/
├── .github/
│   └── workflows/
│       ├── ci.yml              # CI: Typecheck, lint, vitest, and next build
│       ├── pr-cd.yml           # CD: Automated Vercel preview environments for PRs
│       └── vercel-cd.yml       # CD: Automated production deployments on main push
├── app/                        # Next.js 16 App Router
│   ├── events/
│   │   └── page.tsx            # Dedicated /events archive page
│   ├── globals.css             # Tailwind v4 import & global styles
│   ├── layout.tsx              # Root HTML, font declarations, JSON-LD, metadata
│   ├── manifest.ts             # PWA Web App Manifest
│   ├── page.tsx                # Main Landing Page (Hero, Sections, Horizontal Flow)
│   ├── robots.ts               # Robots.txt configuration
│   └── sitemap.ts              # Dynamic sitemap generator
├── public/                     # Static assets (favicons, logos, videos, manifest)
│   ├── assets/videos/          # Optimized MP4 hero videos & poster images
│   ├── favicon.*               # Multi-resolution icons & SVGs
│   └── og-image.webp           # Social preview banner
├── src/                        # Core application source code
│   ├── assets/                 # Component images, photos, and SVG assets
│   ├── components/             # Reusable interactive components
│   │   ├── EventsArchive.tsx   # Filterable events archive grid & modals
│   │   ├── FloatingLogo/       # Scroll-driven morphing SVG brand mark
│   │   ├── GameLauncher/       # In-browser arcade (Snake, 2048, Memory, Sprint)
│   │   ├── HorizontalFlow/     # ScrollTrigger horizontal pinning container
│   │   ├── LaserFlow/          # Three.js custom GLSL shader canvas
│   │   ├── LogoModal/          # Brand geometry breakdown dialog
│   │   └── PageTransition/     # Full-page curtain transition overlay
│   ├── sections/               # Independent modular page sections
│   │   ├── About/              # Purpose & vision statement with kinetic typography
│   │   ├── Events/             # Flagship events showcase cards
│   │   ├── Footer/             # Navigation, social links, watermark emblem
│   │   ├── Hero/               # Video hero, ScrollTrigger shrink, marquee
│   │   ├── Loader/             # Initial SVG path-draw preloader
│   │   ├── Nav/                # Responsive navigation bar & mobile drawer
│   │   ├── Speakers/           # Keynote speakers spotlight & carousel
│   │   ├── Sponsors/           # Constellation sponsor graph with SVG connectors
│   │   ├── Story/              # Narrative reveal section with parallax imagery
│   │   ├── Team/               # 3D team card stack & full member directory
│   │   ├── WhatsAppCommunity/  # Interactive simulated chat & WhatsApp link
│   │   └── WhyJoin/            # Interactive value-proposition feature cards
│   ├── styles/                 # Global styles and motion primitives
│   │   ├── global.css          # Color variables, CSS reset, font bindings
│   │   └── SectionTransitions.css # Awwwards-tier wipes, blooms, masks
│   ├── types/                  # Global TypeScript ambient definitions
│   │   └── assets.d.ts         # Image & video asset module declarations
│   └── utils/                  # Core utility helpers
│       ├── animations.ts       # Shared GSAP tween builders & quickSetters
│       ├── constants.ts        # Color tokens, animation timings, breakpoints
│       ├── gsapSetup.ts        # Centralized GSAP & ScrollTrigger registration
│       ├── lenis.ts            # Shared reference-counted Lenis instance
│       └── math.ts             # Lerp, smoothstep, and numeric helpers
├── tests/                      # Automated test suite
│   ├── app/                    # Route and layout tests
│   ├── setup.ts                # Vitest test setup and DOM polyfills
│   └── src/                    # Component and utility unit tests
├── .nvmrc                      # Node.js runtime version pin (24.x)
├── CONTRIBUTING.md              # Contributor guidelines and rules
├── eslint.config.mjs           # ESLint 9 configuration
├── next.config.ts              # Next.js build and security headers configuration
├── package.json                # Project dependencies, scripts, engines
├── postcss.config.mjs          # PostCSS configuration for Tailwind v4
├── tsconfig.json               # TypeScript compiler configuration
├── vercel.json                 # Vercel deployment specification
└── vitest.config.mts           # Vitest runner configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `24.x` (as specified in `.nvmrc` and `package.json engines`).
- **npm**: `10.x` or higher.

If you use `nvm` or `fnm`, switch to the compatible Node version:
```bash
nvm use
```

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ECell-RVUniversity/ECell-Web.git
   cd ECell-Web
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available NPM Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Next.js development server with Turbopack |
| `npm run build` | Compiles the production-ready Next.js application bundle |
| `npm run start` | Boots the Next.js production server locally |
| `npm run lint` | Runs ESLint 9 across all TypeScript and React files |
| `npm run typecheck` | Validates TypeScript types across the entire codebase (`tsc --noEmit`) |
| `npm run test` | Executes the Vitest automated test suite once |
| `npm run test:watch` | Runs Vitest in interactive watch mode for TDD |

---

## 🧪 Testing & Quality Assurance

The repository uses [Vitest](https://vitest.dev/) along with `@testing-library/react` and `jsdom`.

To run the complete test suite:
```bash
npm run test
```

To run tests continuously during feature development:
```bash
npm run test:watch
```

Automated tests cover:
- **App Routes**: Route mounting and metadata validation (`tests/app/routes.test.ts`).
- **Sections**: Renders, interactions, and keyboard accessibility for `Speakers`, `Team`, and `WhatsAppCommunity`.
- **Arcade Launcher**: Minigame mounting, score progression, and window lifecycle.
- **Math & Utilities**: Pure math algorithms (`lerp`, `clamp`, `smoothstep`).

---

## 🚢 CI/CD & Deployment Workflows

The repository includes a 3-tier GitHub Actions continuous integration and continuous deployment pipeline:

### 1. Continuous Integration (`.github/workflows/ci.yml`)
Triggered on every push and pull request to the `main` branch. Executes:
1. `npm ci` on Node 24.
2. `npm run typecheck` (TypeScript type validation).
3. `npm run lint` (ESLint rule enforcement).
4. `npm run test -- --run` (Vitest test suite).
5. `npm run build` (Next.js production compilation).

### 2. Pull Request Preview Deployments (`.github/workflows/pr-cd.yml`)
- Automatically builds a staging preview environment on Vercel for incoming pull requests.
- Attaches the preview URL directly to the GitHub deployment status for testing.

### 3. Production Deployment (`.github/workflows/vercel-cd.yml`)
- Triggered automatically on merge/push to `main`.
- Pre-builds and ships the optimized production build directly to Vercel production.

#### Setting up Deployment Secrets in GitHub
To configure Vercel deployments, configure these secrets in **Repository Settings → Secrets and variables → Actions**:
- `VERCEL_TOKEN`: Vercel personal access token with project permissions.
- `VERCEL_ORG_ID`: Vercel organization or user ID.
- `VERCEL_PROJECT_ID`: Vercel project ID.

---

## 🤝 Contributing

We welcome contributions from RV University students, club members, and open-source enthusiasts!

Before opening a pull request, please make sure you:
1. Read our complete [CONTRIBUTING.md](./CONTRIBUTING.md) guide.
2. Create a dedicated branch: `feature/<feature-name>` or `fix/<fix-name>`.
3. Keep changes scoped inside your section without modifying shared styles unless coordinated.
4. Verify that the build, linter, and tests pass:
   ```bash
   npm run typecheck && npm run lint && npm run test && npm run build
   ```

---

## 👥 Built and Maintained by

Built and maintained with ❤️ by the **ECell RV University** Tech Team:

- **Akash Bisht** — [@akash0-real](https://github.com/akash0-real)
- **Akshay Sujesh** — [@AkshayS2020git](https://github.com/AkshayS2020git)
- **Shrisha Poojary** — [@shrisha77-boop](https://github.com/shrisha77-boop)
- **Aditya Dixit** — [@aditya-dixit](https://github.com/Hootsworth)

---

<div align="center">
  <sub>© 2025 - 2026 Entrepreneurship Cell, RV University. All rights reserved.</sub>
</div>
