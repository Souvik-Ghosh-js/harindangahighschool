/** @type {import('next').NextConfig} */
const nextConfig = {
  // Hostinger Node hosting runs `next start` behind its own proxy.
  // Standalone output keeps the deployed bundle small and self-contained.
  output: "standalone",

  // Uploaded images are served straight from /public/assets/img.
  // No remote loaders are needed, so keep optimisation simple and local.
  images: {
    formats: ["image/webp"],
  },

  poweredByHeader: false,
  reactStrictMode: true,

  async headers() {
    return [
      {
        // Admin pages and API must never be cached by a proxy or browser.
        source: "/(admin|api)/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, max-age=0" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
