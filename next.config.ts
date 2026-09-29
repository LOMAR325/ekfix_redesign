import type { NextConfig } from "next";
import { redirectRules } from "./lib/redirects";

const nextConfig: NextConfig = {
  images: { formats: ["image/webp"] },
  typedRoutes: true,
  // Old *.html (docs/adr/0013), /for-business and the old ekfix.us URLs → live pages, all 308.
  async redirects() {
    return redirectRules();
  },
};

export default nextConfig;
