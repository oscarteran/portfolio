import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    // Each locale has its own root layout ("/" and "/en"), so unmatched URLs are served by
    // app/global-not-found.tsx, which renders its own <html>.
    globalNotFound: true,
  },
};

export default nextConfig;
