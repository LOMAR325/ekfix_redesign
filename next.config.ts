import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { formats: ["image/webp"] },
  typedRoutes: true,
  // Safety net for old *.html URLs (see docs/adr/0013). All 308 (permanent).
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/about.html", destination: "/about", permanent: true },
      { source: "/brands.html", destination: "/brands", permanent: true },
      {
        source: "/for-business.html",
        destination: "/for-business",
        permanent: true,
      },
      {
        source: "/appliance-repair/:slug.html",
        destination: "/appliance-repair/:slug",
        permanent: true,
      },
      // Must precede /towns/:slug.html so "index" is not treated as a slug.
      { source: "/towns/index.html", destination: "/towns", permanent: true },
      {
        source: "/towns/:slug.html",
        destination: "/towns/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
