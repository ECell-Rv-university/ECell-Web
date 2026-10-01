# ECell-Web Project Documentation

This directory is the technical and product documentation hub for the ECell RV University website. It describes the repository as it currently works; the root [`README.md`](../README.md) remains the public project introduction and [`CONTRIBUTING.md`](../CONTRIBUTING.md) remains the contributor policy.

## Documentation index

| Document | Purpose |
| --- | --- |
| [Project overview](./PROJECT_OVERVIEW.md) | Product goals, users, capabilities, routes, and project boundaries |
| [Design](./DESIGN.md) | Visual language, interaction principles, responsive behavior, and accessibility |
| [Architecture](./ARCHITECTURE.md) | Runtime composition, rendering boundaries, scrolling, animation, and data flow |
| [Folder structure](./FOLDER_STRUCTURE.md) | Repository map and file-placement rules |
| [Development](./DEVELOPMENT.md) | Local setup, scripts, implementation workflow, and coding conventions |
| [Content guide](./CONTENT_GUIDE.md) | Where editable content lives and how to update events, people, and media safely |
| [Testing](./TESTING.md) | Test stack, current coverage areas, and validation commands |
| [Deployment](./DEPLOYMENT.md) | GitHub Actions and Vercel preview/production delivery |

## Quick start

```bash
nvm use
npm ci
npm run dev
```

Open `http://localhost:3000`. Node.js 24 is required by both `.nvmrc` and `package.json`.

Before submitting a change, run:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

## Important repository facts

- The application uses Next.js 16.3 App Router, React 19, and strict TypeScript.
- Content is stored in source files and local media; there is no CMS, application API, or database.
- Motion uses GSAP/ScrollTrigger and Lenis. Three.js powers the WebGL laser effect.
- Section `.css` files are conventional global styles with feature-prefixed selectors, not CSS Modules.
- Event information currently appears in multiple datasets. Read [Content guide](./CONTENT_GUIDE.md) before changing an event.
- The manifest and icons provide install metadata, but the project has no service worker or offline cache.

## Documentation maintenance

Update the related file in this directory when changing architecture, routes, scripts, data ownership, deployment, or contributor workflow. Keep statements based on repository behavior, and mark planned functionality as planned rather than current.