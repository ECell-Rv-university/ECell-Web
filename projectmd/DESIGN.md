# Design Guide

## Design intent

ECell-Web uses a bold editorial style to present entrepreneurship as active, ambitious, and experimental. Large typography, cinematic media, high-contrast surfaces, spatial transitions, and responsive motion create the identity. Interaction should support the content rather than hide navigation or block core actions.

## Principles

### 1. Editorial hierarchy

Use strong display type for section statements, compact labels for context, and readable body copy. Maintain a clear order: eyebrow or label, headline, supporting copy, then action.

### 2. Motion with purpose

Motion should reveal hierarchy, explain transitions, or provide useful feedback. Prefer `transform` and `opacity` for animation. Avoid introducing an animation loop when a GSAP timeline or CSS transition can provide the same result.

### 3. Independent sections

Homepage sections must own their internal spacing and remain safe to reorder in `app/page.tsx`. Do not depend on sibling negative margins, hidden overlap, or another section's DOM structure.

### 4. Progressive enhancement

Content and primary actions must remain understandable when animation is reduced. Pointer-only effects need touch and keyboard alternatives where interaction is essential.

### 5. Consistent brand system

Use the shared tokens and reset in `src/styles/global.css` before adding local values. Feature styles belong near the component and should use a feature-specific class prefix because imported `.css` files are global.

## Typography

The root layout loads Archivo, Bebas Neue, Fraunces, and Inter through Next Font. Reuse the font custom properties and existing role assignments instead of loading fonts inside components. Preserve responsive type scaling and test long headings at narrow widths.

## Color and surfaces

`src/styles/global.css` is the source for global design tokens. New work should:

- reuse existing CSS custom properties;
- meet readable foreground/background contrast;
- retain visible focus indicators;
- avoid encoding state through color alone;
- check gradients, masks, and blend modes on mobile and low-power devices.

## Layout

- Design mobile behavior at the same time as desktop behavior.
- Keep page sections independently placeable and responsive.
- Use feature-owned containers and spacing rather than cross-section selectors.
- Account for pinned ScrollTrigger regions when changing heights.
- Recalculate animation measurements on resize and after layout-changing media loads.
- Use the horizontal flow only for experiences that remain navigable through vertical scrolling and anchors.

## Motion architecture

GSAP and ScrollTrigger must be imported through `src/utils/gsapSetup.ts`, which centralizes plugin registration. Use the shared Lenis utilities for programmatic scrolling instead of direct competing smooth-scroll implementations.

Every substantial motion experience should:

1. Respect `prefers-reduced-motion: reduce`.
2. Clean up timelines, observers, listeners, and animation frames on unmount.
3. Avoid animating layout properties when transforms will work.
4. Refresh ScrollTrigger after meaningful layout changes.
5. Preserve native-feeling keyboard and anchor navigation.

The Hero already pauses video while offscreen or when the document is hidden. Apply the same visibility-aware principle to new continuous media or rendering work.

## Responsive behavior

At minimum, review phone, tablet, laptop, and wide desktop layouts. Test touch gestures independently from mouse interactions. Verify that:

- headings do not clip;
- controls remain large enough to activate;
- dialogs and lightboxes fit the visual viewport;
- pinned sections do not trap scrolling;
- horizontal content has an understandable mobile treatment;
- media uses appropriate dimensions and loading behavior.

## Accessibility

- Use semantic HTML and a logical heading hierarchy.
- Give meaningful images descriptive alternative text; use empty alt text for decorative images.
- Ensure all actions are keyboard reachable.
- Keep focus visible and move focus deliberately when opening/closing modal interfaces.
- Provide accessible names for icon-only controls.
- Support Escape for dismissible overlays and arrow keys where carousel/lightbox patterns use them.
- Do not autoplay audio.
- Verify reduced-motion behavior rather than merely hiding transitions.

## Assets

Imported component media belongs in `src/assets/`, grouped by feature. Files that must be served from stable root URLs belong in `public/`. Use Next Image for raster content where practical, include dimensions, and prefer optimized formats such as WebP. Hero video assets live under `public/assets/videos/` because they are referenced directly by responsive `<source>` elements.

## Design review checklist

- Does the content hierarchy work without motion?
- Is the feature usable with keyboard and touch?
- Is reduced motion handled?
- Are local selectors safely prefixed?
- Does it work at narrow and wide viewport sizes?
- Are continuous animations paused when hidden where appropriate?
- Does the change preserve surrounding section layout and scroll measurements?
- Are text, image, focus, and state semantics accessible?