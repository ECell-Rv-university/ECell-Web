# DESIGN.md — ECell RVU Celestial Observatory & Genesis

## Concept Card

```
Idea:        Student startups form like solar systems: raw sparks ignite, draw talent into orbit, and coalesce into ventures with real gravitational mass.
Metaphor:    Deep-space astrophysics observatory & star-charting expedition — astrometric telemetry, Keplerian orbital mechanics, ionized stellar matter, pulsar beacons, and relativistic event horizons.
Signature:   Single-Clock Celestial Telemetry & Hyperdrive Velocity Field — one unified `gsap.ticker` driver couples cursor parallax, scroll-velocity starfield elongation, idle orbital drift, interactive light-travel dimming from the Helios sun, and gravitational devouring by the Sagittarius black hole across 9 cosmic sectors.
Emotion:     Awe, precision, boundless ambition — the quiet vastness of obsidian space punctuated by sharp astrometric instruments and human creation.
Motion verb: "Drift in orbit, lock on trajectory, warp through deep space."
Screenshot:  Sirius AB (Class A1V + white dwarf Sirius B) radiating sapphire diffraction spikes above the hero stage, paired with astrometric coordinates (`RA 06h 45m 09s · DEC -16° 42' 58"`) and Keplerian orbital tracks.
```

---

## Stack Decision

- **Stack:** Next.js 16 (App Router, TypeScript) + CSS custom properties + GSAP (`ScrollTrigger`, `SplitText`, `ScrollToPlugin`) + Lenis smooth scroll + Three.js (lazy-loaded on Hero WebGL reveal & Community LaserFlow).
- **Reason:** Existing multi-route production application (`/` home showcase, `/events`, `/opportunities`, `/recruit`) requiring SSR metadata, Server Actions, and route transitions without breaking existing sections.

---

## Sector Cartography & Astrometric Catalog

| Sector | Section | Celestial Body | RA | DEC | MAG / Mass | Narrative Mapping |
|---|---|---|---|---|---|---|
| **01** | Hero | Sirius AB (Class A1V + DA2 Binary) | `06h 45m 09s` | `-16° 42' 58"` | `-1.46 MAG` | Primordial ignition: brightest beacon in the night sky sparking startup ambition. |
| **02** | About | Orbitalis Chrono (Ringed) | `02h 42m 18s` | `+14° 12' 09"` | `+0.46 MAG` | Accretion disk & orbital order: structuring curiosity into venture foundations. |
| **03** | Events | — (Backdrop stars behind full-screen photo) | `05h 18m 44s` | `+22° 31' 50"` | `-2.94 MAG` | Full-screen photographic showcase: planets & constellations omitted so nothing overlaps photography. |
| **04** | Speakers | Pulsar Beacon (Nexus) | `08h 35m 20s` | `-45° 10' 35"` | `-4.12 MAG` | Guiding lighthouse: founders and operators beaming experience across the void. |
| **05** | Sponsors | Helios Sol, Kryos Capital & Sagittarius A* | `11h 09m 51s` | `+06° 44' 12"` | `+5.38 MAG` | Capital infrastructure anchored in outer corners by Helios (`sun`), Kryos (`ice`), and Sagittarius A* (`blackhole`). |
| **06** | Why Join | Terra Firma (Terran) | `14h 29m 42s` | `-62° 40' 46"` | `-1.45 MAG` | Grounding & atmosphere: real products taking root on fertile campus ground. |
| **07** | Story | — (Backdrop stars behind full-screen photo) | `17h 55m 10s` | `-19° 08' 22"` | `-12.74 MAG` | Full-screen photographic narrative: planets & constellations omitted so typography and photo stay unobstructed. |
| **08** | Team | Pleiades Syndicate (Cluster) | `03h 47m 24s` | `+24° 07' 00"` | `+1.60 MAG` | Open star cluster: builders coalescing into one leadership constellation. |
| **09** | Community | M87* Powehi (Supermassive BH + Jet) | `12h 30m 49s` | `+12° 23' 28"` | `6.5B M☉` | Event horizon & relativistic polar jet: community gravity pulling student builders together. |

---

## Art Direction System

### Palette (Named Roles)
- `ground`: `#1a1a1a` (`--bg`) stepping into `#07070a` deep-space telemetry panels
- `ink`: `#f4f4f2` (`--fg`, 6500K starlight white; AA contrast > 13:1 on ground)
- `muted`: `#bababa` (`--fg-dim`, secondary copy; AA contrast > 7:1 on ground)
- `line`: `rgba(255, 255, 255, 0.14)` (`--line`, Keplerian orbital tracks and card rules)
- `accent`: `#ffd700` / `#fff1d6` (Helios solar gold) with secondary spectral accents `#67e8f9` (cryo cyan) and `#7d8cff` (Jovian azure) scoped strictly to celestial telemetry & planet rim lighting
- `curtain`: `#111111` (`--bg-2`, loader & 5-column page transition curtain)

### Typography & Scale
- **Display:** `Archivo` (`--font-archivo`, weight `900`, tracking `-0.035em`, line-height `0.94`) paired with `Anton` / `Bebas Neue` in wide showcase moments (`Story`, `Events`) and `Fraunces` italic contrast where editorial warmth is earned.
- **Body & Telemetry:** `Inter` (`--font-inter`), body `15px–18px` at `1.5` leading; astrometric telemetry HUD uses `tabular-nums` monospace precision (`9px–12px`).

### Grid, Rhythm & Shape
- **Container:** `.wrap` (`max-width: 1180px`, `32px` desktop gutter, `22px` safe-area mobile gutter).
- **Section Rhythm:** Alternates sticky WebGL showcase (`Hero`), typographic statement (`About`), pinned 3D camera tunnel (`Events`), 3-column portrait grid (`Speakers`), radial constellation matrix (`Sponsors`), draggable card stack (`WhyJoin`), horizontal skew marquee (`Story`), horizontal track (`Team` → `Community`), and halftone canvas (`Footer`).
- **Shape:** `4px` sharp instrument corners for telemetry HUD cards; `12px–20px` soft architectural framing for showcase media cards; circular `50%` geometry for celestial orbs and reticles.

---

## Single-Clock Driver & 60 FPS Performance Architecture

1. **One Unified Clock (`src/components/Cosmic/cosmicDriver.ts`):**
   - Replaces 9 separate `requestAnimationFrame` loops and 9 `pointermove` listeners (which previously ran `getBoundingClientRect()` on every mouse move) with one `gsap.ticker` callback and one passive `pointermove` listener.
   - Tracks `isVisible` per section via one shared `IntersectionObserver` (`rootMargin: "150px 0px"`), toggling `.is-offscreen` to pause off-screen CSS keyframes and pausing ticker work when no cosmic sections are visible.
   - Computes scroll-velocity hyperdrive warp (`scale3d(1, 1 + warp, 1)`) and subtle idle orbital drift (`±2.5px`) exclusively through GPU `transform: translate3d(...)` / `scale3d(...)` on two grouped `.cosmic-star-stratum` layers (`--far` and `--near`) instead of per-star compositing layers.
2. **Zero Large-Radius Live Blurs:**
   - Nebulae (`.bg-nebula`) and mobile atmospheric glows (`.cosmic-mobile-glow__core`, `__corona`) achieve atmospheric falloff through multi-stop soft radial gradients (`rgba(..., 0)`) instead of expensive GPU `filter: blur(85px)` / `blur(60px)` passes.
   - `About` text reveal tweens animate pure GPU `yPercent` and `autoAlpha` without animated `filter: blur(...)`.
3. **Interactive Telemetry & Physics:**
   - **Orbital Reticle Lock & Astrometric HUD:** Hovering or focusing (`Tab`, `Enter`/`Space`) a celestial body rotates its SVG orbital caliper reticle into lock and reveals an astrometric telemetry readout (`RA`, `DEC`, `MAG`, `DIST`) positioned inside the viewport edge (`--left` or `--right`).
   - **Helios Light-Travel Toggle:** Clicking the Sun toggles `.is-sun-off` across the solar ensemble, setting `--light-delay` proportional to Euclidean pixel distance from the sun so outer planets dim sequentially at the speed of light.
   - **Sagittarius Singularity:** Clicking the Black Hole toggles `.is-devouring`, accelerating the accretion disk, pausing twinkling animations, and pulling stars, constellations, and neighboring planets into the event horizon before releasing them in an outward shockwave.
4. **Reduced Motion & Mobile Composition:**
   - `prefers-reduced-motion: reduce` disables ticker drift, parallax, warp, meteors, and CSS loops while keeping static stars and celestial artwork crisp and visible.
   - Under `768px`, multi-planet clusters and heavy desktop SVG tracks yield to a tailored minimal star stratum, soft radial mobile aura, and non-interactive primary celestial silhouette so mobile stays locked at 60 FPS.

---

## Genericness Test

- *Would a generic model land here?* A generic cosmic theme typically drops a centered purple-blue gradient blob, `blur(90px)` CSS circles, uncoordinated `requestAnimationFrame` starfields, and decorative `01 / 02 / 03` badges.
- *What we changed to pass:*
  1. Anchored every section to a real astrometric catalog entry (`RA`, `DEC`, `MAG`, `DIST`) with tabular numerals and interactive orbital reticles.
  2. Built real astrophysics interactions (speed-of-light `--light-delay` dimming from the sun, gravitational devouring by the black hole, scroll-velocity starfield warp) driven by one `gsap.ticker` clock.
  3. Replaced generic CSS blur blobs with precision vector astrolabe/caliper SVGs, 4-point diffraction star glints, and zero-blur multi-stop gradients.
