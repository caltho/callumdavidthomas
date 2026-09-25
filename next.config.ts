import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // The site and the admin area have separate root layouts, so unmatched
    // URLs need a 404 page of their own (app/global-not-found.tsx).
    globalNotFound: true,
  },
  async redirects() {
    // The homepage now covers the about page.
    return [{ source: "/about", destination: "/", permanent: false }];
  },
};

export default nextConfig;
