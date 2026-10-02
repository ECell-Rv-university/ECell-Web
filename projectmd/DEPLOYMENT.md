# Deployment Guide

## Delivery model

The application is hosted on Vercel and deployed through GitHub Actions. Pull requests to `main` receive preview deployments; pushes to `main` trigger production deployment. `vercel.json` declares the Next.js framework and `.next` output directory.

## Continuous integration

`.github/workflows/ci.yml` runs on pushes and pull requests targeting `main`:

1. Check out the repository.
2. Set up Node.js 24.
3. Install with `npm ci`.
4. Run `npm run typecheck`.
5. Run `npm run lint`.
6. Run the Vitest suite.
7. Run `npm run build`.

A change should not be considered release-ready until these checks pass.

## Pull-request previews

`.github/workflows/pr-cd.yml` runs when a pull request to `main` is opened, synchronized, or reopened. It creates a GitHub deployment, installs dependencies, performs a normal Next build, pulls Vercel preview settings, runs a Vercel build, deploys the prebuilt output, updates deployment status, and comments the preview URL on the pull request.

Use the preview to review responsive layout, interactions, external links, metadata, event facts, and animation behavior before merge.

## Production

`.github/workflows/vercel-cd.yml` runs on pushes to `main`. It follows the Vercel pull/build/deploy flow with the Production environment and `--prod`, then reports deployment status to GitHub.

Do not push directly to `main`. Merge a reviewed pull request after CI and preview validation.

## Required GitHub secrets

Configure these in repository Actions secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Never commit their values. `.vercel/project.json` is a local project link and `.vercel/` is ignored; it is not the source for public documentation.

## Release checklist

- Typecheck, lint, tests, and production build pass.
- The Vercel preview was reviewed on mobile and desktop.
- Public content, dates, contact details, and outbound links were verified.
- Metadata and social preview content match the page.
- No secret or local `.vercel` data is in the diff.
- Redirects and sitemap entries were updated if routes changed.
- No unexpected browser console or hydration errors occur.
- Analytics and Speed Insights remain mounted in the root layout.
- The production deployment status is successful after merge.

## Rollback and recovery

Use Vercel's deployment history to promote or restore a known-good deployment, then revert the faulty repository change through the normal Git workflow. Avoid rewriting shared Git history. After recovery, reproduce the issue from the failed commit and add the missing validation where practical.

Exact Vercel retention, promotion, and access policies are configured outside this repository and must be confirmed in the Vercel project settings.

## Current operational notes

- Deployment workflows install the latest Vercel CLI globally rather than pinning a version. This can change build behavior independently of repository commits.
- Workflows perform `npm run build` and later `vercel build`, so deployment includes two build phases.
- Branch protection, required-check policy, and Vercel native Git integration cannot be determined from repository files.
- Application source currently has no runtime environment-variable dependency.
- The manifest does not imply offline availability; there is no service worker or cache strategy.