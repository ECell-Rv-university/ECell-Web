import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ECell RV University",
    short_name: "ECell RVU",
    description:
      "Official Entrepreneurship Cell at RV University, Bengaluru. Empowering student founders, innovators, and future leaders.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      {
        src: "/favicon-48x48.webp",
        sizes: "48x48",
        type: "image/webp",
      },
      {
        src: "/favicon-96x96.webp",
        sizes: "96x96",
        type: "image/webp",
      },
      {
        src: "/logo-192.webp",
        sizes: "192x192",
        type: "image/webp",
        purpose: "maskable",
      },
      {
        src: "/logo-512.webp",
        sizes: "512x512",
        type: "image/webp",
        purpose: "any",
      },
    ],
  };
}
