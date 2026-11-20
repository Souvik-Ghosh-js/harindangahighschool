/** @type {import('next').NextConfig} */

const csp = [
  "default-src 'self'",
  // React dev tooling needs eval(); production never does.
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "production" ? "" : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-src 'self' https://www.google.com https://maps.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ");

const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,

  images: {
    // WebP encodes much faster than AVIF on the first request for each size.
    formats: ["image/webp"],
    localPatterns: [{ pathname: "/media/**" }],
    qualities: [70, 82],
    deviceSizes: [480, 640, 828, 1080, 1280, 1600, 1920, 2400],
    minimumCacheTTL: 31536000,
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
        ],
      },
      {
        source: "/(admin|api)/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, max-age=0" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },

  /* Old website addresses keep working and pass their Google ranking on. */
  async redirects() {
    const r = (source, destination) => ({ source, destination, permanent: true });
    return [
      r("/index.aspx", "/"),
      r("/index.html", "/"),
      r("/about.html", "/about"),
      r("/hm_desk.html", "/leadership"),
      r("/hm-desk", "/leadership"),
      r("/notice.aspx", "/notices"),
      r("/adm_body.html", "/administration"),
      r("/office.html", "/administration"),
      r("/faculty", "/teachers"),
      r("/awards", "/about"),
      r("/facilities", "/about"),
    ];
  },
};

export default nextConfig;
