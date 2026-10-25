<div align="center">

<a href="https://ecell-rvu.vercel.app">
  <img src="./public/og-image.webp" alt="The Entrepreneurship Cell, RV University" width="560" />
</a>

<h3>Where campus ideas become companies.</h3>

<p>
  The official website of the <b>Entrepreneurship Cell at RV University, Bengaluru</b>:<br />
  a scroll-driven, shader-lit home for the startup community on campus.
</p>

<p>
  <a href="https://ecell-rvu.vercel.app"><b>Visit the site</b></a>
  &nbsp;·&nbsp;
  <a href="#-run-it-locally"><b>Run it locally</b></a>
  &nbsp;·&nbsp;
  <a href="./CONTRIBUTING.md"><b>Contribute</b></a>
  &nbsp;·&nbsp;
  <a href="#-shipping"><b>Deployments</b></a>
</p>

<p>
  <img src="https://img.shields.io/badge/Next.js-16.3-000000?style=flat-square&logo=next.js&logoColor=white" alt="Next.js 16.3" />
  <img src="https://img.shields.io/badge/React-19.2-149ECA?style=flat-square&logo=react&logoColor=white" alt="React 19.2" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/GSAP-3.14-0AE448?style=flat-square&logo=greensock&logoColor=black" alt="GSAP 3.14" />
  <img src="https://img.shields.io/badge/Three.js-0.185-000000?style=flat-square&logo=three.js&logoColor=white" alt="Three.js 0.185" />
  <img src="https://img.shields.io/badge/Vitest-4.1-6E9F18?style=flat-square&logo=vitest&logoColor=white" alt="Vitest 4.1" />
</p>

</div>

<br />

## 🎬 Demo

https://github.com/user-attachments/assets/9ab5ec05-6a5e-4ba2-923c-7685b89def26

<br />

## ✦ What this is

Most club websites are a list of links. We wanted ours to feel like walking into the room: you move your cursor and ink pours across the title, the logo draws itself and flies into the nav, the story scrolls sideways, and there's an arcade tucked in the corner for when you should be studying.

Underneath the motion it's a working site for students:

<table>
  <tr>
    <td width="50%" valign="top">
      <h4>🗓️ Events</h4>
      Flagship events like the Argonyx Hackathon, Winter Tech Talks and Talk Startup With Me, plus a full <code>/events</code> archive with filters, a calendar strip and a page for every event.
    </td>
    <td width="50%" valign="top">
      <h4>🙋 Recruitment</h4>
      <code>/recruit</code> takes applications for PR, sponsorship, social media, design, photography, video, documentation and tech, and saves them straight to the team's sheet.
    </td>
  </tr>
  <tr>
    <td valign="top">
      <h4>🌍 Opportunities</h4>
      <code>/opportunities</code> points students to open hackathons, framed by an interactive globe.
    </td>
    <td valign="top">
      <h4>💬 Community</h4>
      A simulated WhatsApp chat answers the usual questions, then hands you a one-tap invite to the real group.
    </td>
  </tr>
  <tr>
    <td valign="top">
      <h4>👥 People</h4>
      The team in a 3D card stack with a filterable directory, and past speakers in a circular carousel.
    </td>
    <td valign="top">
      <h4>🤝 Sponsors</h4>
      Every partner, from Nokia and Red Bull to the local bakery, mapped as a constellation that lights up as you hover.
    </td>
  </tr>
</table>

<br />

## ✨ The details we're proud of

**🫧 Liquid ink hero.** Moving your pointer pours ink over a giant "ECELL RVU", revealing glass balloon letters floating in a particle nebula. On touch screens a blob wanders on its own until your finger takes over. The scene pauses when it's off screen or the tab is hidden, goes idle once the ink fades, and caps its resolution on big and small screens.

**🌀 A logo that draws itself.** The brand mark is built from hand-tuned SVG paths, traced stroke by stroke as you scroll, then flies into the navigation bar and docks there. Click it to open a breakdown of the logo's geometry and meaning.

**↔️ Sideways storytelling.** Speakers, the community chat and the footer sit on one pinned horizontal track. Nav links still land on the right panel because each one converts its target into the track's exact scroll position.

**⚡ Laser light, written by hand.** The community section glows with a custom GLSL shader: volumetric beams, drifting fog and noise, tilting gently toward your mouse.

**🕹️ An arcade in the corner.** Four small games, each fully playable:

| | Game | The idea |
|:-:|---|---|
| ✦ | **Founder Sprint** | Catch every spark before the clock runs out |
| 🐍 | **Signal Snake** | Classic snake, smooth controls, high score |
| 🃏 | **Memory Match** | Flip cards, find pairs, use as few moves as you can |
| 🔢 | **2048** | Slide and merge tiles with arrows or swipes |

**🌊 Scrolling that feels like butter.** Lenis momentum scrolling, shared through one reference-counted instance so pages never fight over animation loops.

**♿ Calm when you need it.** Every animation respects `prefers-reduced-motion` and jumps straight to its final state.

<br />

## 🧰 Built with

| | |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) App Router · [React 19](https://react.dev/) · [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) and plain CSS kept next to each section |
| **Motion** | [GSAP 3.14](https://gsap.com/) + ScrollTrigger · [Lenis](https://github.com/darkroomengineering/lenis) smooth scroll |
| **3D** | [Three.js](https://threejs.org/) with custom GLSL shaders |
| **Type** | Archivo, Bebas Neue, Fraunces and Inter via `next/font` |
| **Quality** | [Vitest](https://vitest.dev/) + Testing Library · ESLint 9 · strict `tsc` |
| **Insights** | Vercel Analytics and Speed Insights |
| **Hosting** | Vercel through GitHub Actions · Cloudflare Workers through [OpenNext](https://opennext.js.org/cloudflare) |

<br />

## 🚀 Run it locally

You'll need **Node 24** (pinned in `.nvmrc`) and **npm 10+**.

```bash
git clone https://github.com/ECell-RVUniversity/ECell-Web.git
cd ECell-Web
nvm use        # or: fnm use
npm install
npm run dev
```

Then open **[localhost:3000](http://localhost:3000)** and move your mouse over the title.

<details>
<summary><b>All npm scripts</b></summary>
<br />

| Command | What it does |
|---|---|
| `npm run dev` | Development server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Serve the production build locally |
| `npm run lint` | ESLint across the project |
| `npm run typecheck` | Type-check everything with `tsc --noEmit` |
| `npm run test` | Run the Vitest suite once |
| `npm run test:watch` | Re-run tests as you edit |
| `npm run preview` | Build with OpenNext and preview in the Cloudflare Workers runtime |
| `npm run deploy` | Build with OpenNext and deploy to Cloudflare Workers |

</details>

<br />

## 🏗️ How it's put together

Routes live in `app/`. Everything else lives in `src/`. Every homepage section is self-contained, so several people can work on the site at once without stepping on each other.

<details>
<summary><b>Sections own themselves</b></summary>
<br />

Each section in `src/sections/<Name>/` carries its own component, styles and animations. No section leans on its neighbours' margins or layout, so any of them can be reordered or removed in `app/page.tsx` without breaking the page.

```text
src/sections/Team/
├── animations/
│   └── TeamAnimations.ts      # GSAP for this section only
├── components/
│   ├── Team.tsx               # 3D card stack
│   └── TeamDirectory.tsx      # Filterable full roster
├── styles/
│   ├── Team.css
│   ├── TeamDirectory.css
│   ├── TeamLayout.css
│   └── TeamResponsive.css
└── index.ts                   # app/page.tsx imports "@/src/sections/Team"
```

Content is kept apart from code. The roster, events, sponsors and links all live in `src/content/`, so updating the site rarely means touching a component.

</details>

<details>
<summary><b>One smooth-scroll instance, shared</b></summary>
<br />

`src/utils/lenis.ts` keeps a single Lenis instance with a consumer count. `acquireLenis()` starts it, and the `release()` it returns stops it. When the last consumer leaves, for example on a page with native scrolling, the instance and its animation loop are torn down cleanly.

</details>

<details>
<summary><b>GSAP registered once</b></summary>
<br />

Registering plugins in many files causes duplicate warnings during hydration, so `src/utils/gsapSetup.ts` does it once and everything imports from there:

```ts
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
export { gsap, ScrollTrigger };
```

</details>

<details>
<summary><b>The horizontal track</b></summary>
<br />

`HorizontalFlow` pins its container and turns vertical scroll into sideways motion:

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

When a nav link targets a panel inside the track, such as `#speakers` or `#footer`, a `horizontal-flow:navigate` event works out that panel's progress (`index / total`) and scrolls the window to the matching vertical offset.

</details>

<details>
<summary><b>Shaders and drawn strokes</b></summary>
<br />

- **LaserFlow** renders a full-screen quad. The fragment shader layers fractal noise, light falloff, converging beams and smoke wisps, and the mouse tilts it with damped easing.
- **Stroke drawing**: the `prepareSVG` helper sets `strokeDasharray` and `strokeDashoffset` to each path's exact length, then animates the offset to `0` so lines appear to be drawn by hand.
- **Kinetic type**: words in the Story section are split into characters that wobble slightly as you scroll.

</details>

<details>
<summary><b>Performance and SEO</b></summary>
<br />

- WebGL scenes pause off screen and in background tabs, using `IntersectionObserver` and `document.hidden`.
- Animations stick to `transform`, `opacity` and `filter` so the browser never has to re-lay out the page.
- `app/layout.tsx` ships Schema.org `WebSite` and `Organization` JSON-LD, plus OpenGraph and Twitter card metadata.
- The manifest, `robots.txt` and `sitemap.xml` are generated from `app/`.

</details>

<details>
<summary><b>Full folder map</b></summary>
<br />

See [`projectmd/FOLDER_STRUCTURE.md`](./projectmd/FOLDER_STRUCTURE.md) for the placement rules.

```text
ECell-Web/
├── .github/workflows/          # CI, Vercel preview and production
├── app/                        # Routes and metadata only
│   ├── events/                 # /events archive and [slug] event pages
│   ├── opportunities/          # /opportunities with the globe
│   ├── recruit/                # /recruit application form
│   ├── layout.tsx              # Fonts, JSON-LD, metadata, analytics
│   ├── page.tsx                # Homepage composition
│   ├── manifest.ts  robots.ts  sitemap.ts
│   └── globals.css
├── public/                     # Favicons, logos, og-image, _headers
├── scripts/                    # Cloudflare deploy wrapper
├── src/
│   ├── assets/                 # Imported images (events, home, sponsors, team…)
│   ├── components/             # Shared components, one folder each
│   │   ├── HalftoneWordmarkFooter/  CircularTestimonials/  EventsArchive/
│   │   ├── FloatingLogo/  GameLauncher/  HorizontalFlow/  InfiniteSpiral/
│   │   ├── LaserFlow/  LogoModal/  PageTransition/  RouteScrollManager/
│   │   └── SiteCredit/  SmoothScroll/  Timeline/
│   ├── content/                # Everything editable: team, events, sponsors, links
│   ├── sections/               # Homepage sections
│   │   ├── About/  Events/  Hero/  Loader/  Nav/  Speakers/
│   │   └── Sponsors/  Story/  Team/  WhatsAppCommunity/  WhyJoin/
│   ├── styles/                 # Global tokens and section transitions
│   ├── types/                  # Asset module declarations
│   └── utils/                  # gsapSetup, lenis, scrollLock, math, cn, constants
├── tests/                      # Vitest suite, mirroring app/ and src/
├── projectmd/                  # Project docs
└── next.config.ts  open-next.config.ts  wrangler.jsonc  vercel.json  vitest.config.mts
```

</details>

<br />

## 🧪 Tests

Vitest with Testing Library and jsdom covers routes and metadata, the events archive and event pages, the main sections (Nav, Speakers, Team, WhatsApp Community) including keyboard access, the arcade games, and the math helpers.

```bash
npm run test          # once
npm run test:watch    # while you work
```

<br />

## 🚢 Shipping

| Workflow | When it runs | What it does |
|---|---|---|
| **CI** · `ci.yml` | Pushes and pull requests to `main` | `npm ci` → typecheck → lint → test → build, on Node 24 |
| **Preview** · `pr-cd.yml` | Pull requests to `main` | Deploys a Vercel preview and comments the link on the PR |
| **Production** · `vercel-cd.yml` | Pushes to `main` | Typechecks, tests and deploys to Vercel production |
| **Cloudflare** | By hand | `npm run deploy`, see [`projectmd/DEPLOYMENT.md`](./projectmd/DEPLOYMENT.md) |

<details>
<summary><b>Repository secrets for Vercel</b></summary>
<br />

Add these under **Settings → Secrets and variables → Actions**:

- `VERCEL_TOKEN`: a Vercel access token with project permissions
- `VERCEL_ORG_ID`: your Vercel organisation or user ID
- `VERCEL_PROJECT_ID`: the Vercel project ID

</details>

<br />

## 🤝 Contributing

Students, club members and anyone who likes building things are welcome here.

1. Read the [contributing guide](./CONTRIBUTING.md).
2. Branch off as `feature/<name>` or `fix/<name>`.
3. Keep your change inside your section. Talk to the team before touching shared styles.
4. Make sure everything passes before you open a PR:

```bash
npm run typecheck && npm run lint && npm run test && npm run build
```

<br />

## 💛 The people behind it

Designed, built and looked after by the **ECell RV University tech team**:

<table>
  <tr>
    <td align="center" width="25%">
      <a href="https://github.com/akash0-real"><img src="https://github.com/akash0-real.png" width="72" alt="Akash Bisht" /><br /><b>Akash Bisht</b></a>
    </td>
    <td align="center" width="25%">
      <a href="https://github.com/AkshayS2020git"><img src="https://github.com/AkshayS2020git.png" width="72" alt="Akshay Sujesh" /><br /><b>Akshay Sujesh</b></a>
    </td>
    <td align="center" width="25%">
      <a href="https://github.com/dev-shrisha"><img src="https://github.com/dev-shrisha.png" width="72" alt="Shrisha" /><br /><b>Shrisha</b></a>
    </td>
    <td align="center" width="25%">
      <a href="https://github.com/Hootsworth"><img src="https://github.com/Hootsworth.png" width="72" alt="Aditya Dixit" /><br /><b>Aditya Dixit</b></a>
    </td>
  </tr>
</table>

<br />

<div align="center">
  <sub>Made with care in Bengaluru · © 2025–2026 Entrepreneurship Cell, RV University</sub>
</div>
