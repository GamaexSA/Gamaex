/** @type {import('next').NextConfig} */
const config = {
  transpilePackages: ["@gamaex/types"],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        source: "/(.*)\\.(js|css|woff2|png|jpg|svg|ico)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        // apex gamaex.cl → www (308 permanente). Evita el duplicado www/no-www ahora
        // que el apex está asignado al proyecto y sirve con cert válido.
        source: "/:path*",
        has: [{ type: "host", value: "gamaex.cl" }],
        destination: "https://www.gamaex.cl/:path*",
        permanent: true,
      },
    ];
  },
};

export default config;
