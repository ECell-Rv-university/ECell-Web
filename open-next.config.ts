import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // This site does not require runtime incremental caching. Add an R2 cache
  // binding here if ISR or runtime revalidation is introduced later.
});
