# Testing and Validation

## Stack

The test suite uses Vitest 4, React Testing Library, `@testing-library/user-event`, jest-dom matchers, and JSDOM. Configuration lives in `vitest.config.mts`; shared setup and browser/Next mocks live in `tests/setup.ts`.

Vitest includes files matching `tests/**/*.test.{ts,tsx}`. The `@` alias resolves from the repository root in both application and test configuration.

## Commands

```bash
npm run test          # one complete Vitest run
npm run test:watch    # interactive local watch mode
npm run typecheck     # TypeScript validation
npm run lint          # ESLint validation
npm run build         # production integration/build check
```

Run all four non-watch checks before a pull request:

```bash
npm run typecheck && npm run lint && npm run test && npm run build
```

## Existing coverage areas

Tests currently exercise areas including:

- metadata and SEO route output;
- event data lookup, archive behavior, and detail rendering;
- route scroll reset behavior;
- GameLauncher behavior;
- Speakers, Team, and WhatsApp Community interactions;
- shared math and wheel/input utilities.

There is no configured end-to-end browser framework, coverage threshold, or snapshot-testing policy.

## Test placement

- Route and metadata tests: `tests/app/`
- Components, sections, data, and utilities: `tests/src/`
- Global mocks and cleanup: `tests/setup.ts`

Name files `*.test.ts` for non-React code and `*.test.tsx` for rendered components.

## What to test

Prioritize observable behavior over implementation details:

- rendered content and semantic roles;
- navigation outcomes and link targets;
- keyboard, pointer, and form interactions;
- filter/state transitions;
- not-found and unknown-data behavior;
- reduced-motion branches where practical;
- cleanup of global listeners or timers;
- pure transformation/math utilities with boundary values.

Mock browser APIs at the narrowest boundary needed. Reuse shared setup rather than redefining common Next navigation, media query, observer, or DOM behavior in every test.

## Manual UI validation

Automated JSDOM tests cannot verify visual composition, actual layout, smooth scrolling, WebGL rendering, video playback, or ScrollTrigger pinning. For affected changes, manually check:

1. `/`, `/events`, each event detail route, and the gallery as relevant.
2. Phone, tablet, laptop, and wide viewport sizes.
3. Keyboard navigation and visible focus.
4. Touch/swipe interactions when present.
5. `prefers-reduced-motion` behavior.
6. Navigation with hashes and browser back/forward actions.
7. Loader completion, pinned horizontal flow, and return to normal scrolling.
8. Browser console for runtime errors and hydration warnings.
9. Video/WebGL behavior when the tab becomes hidden.

## CI validation

`.github/workflows/ci.yml` runs installation, type checking, linting, tests, and production build on pushes and pull requests targeting `main` using Node 24. Local success does not replace CI, and CI success does not replace manual visual review for animation-heavy changes.