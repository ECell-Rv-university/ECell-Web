import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: ["monsoon-suspend-uncloak.ngrok-free.dev"],
  images: {
    qualities: [75, 85, 100],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async redirects() {
    return [
      {
        source: "/Argonyx-26",
        destination: "/events/argonyx-26",
        permanent: false,
      },
      {
        source: "/Pitch-e-thon",
        destination: "/events/pitch-e-thon",
        permanent: false,
      },
      {
        source: "/E-Summit",
        destination: "/events/e-summit",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
