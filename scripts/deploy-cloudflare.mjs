#!/usr/bin/env node
import { spawnSync } from "node:child_process";

// Cloudflare Workers Builds has a known bug (cloudflare/workers-sdk#15682) where
// preview / non-production branch builds fail during wrangler deploy because
// WRANGLER_CI_MATCH_TAG contains a preview tag that mismatches the worker tag.
// Unsetting this environment variable bypasses the tag validation check safely.
delete process.env.WRANGLER_CI_MATCH_TAG;

const isWindows = process.platform === "win32";
const command = isWindows ? "npx.cmd" : "npx";
const args = ["opennextjs-cloudflare", "deploy", ...process.argv.slice(2)];

const result = spawnSync(command, args, {
  stdio: "inherit",
  shell: isWindows,
  env: process.env,
});

process.exit(result.status ?? 0);
