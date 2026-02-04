import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.accounts.dev https://clerk.accounts.dev https://*.clerk.dev https://challenges.cloudflare.com",
              "connect-src 'self' https://*.clerk.accounts.dev https://clerk.accounts.dev https://*.clerk.dev https://*.neon.tech wss://*.neon.tech http://localhost:8000 http://127.0.0.1:8000 https://challenges.cloudflare.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://*.clerk.dev https://*.clerk.accounts.dev https://img.clerk.com https://images.clerk.dev https://*.googleusercontent.com https://*.gravatar.com https://res.cloudinary.com https://*.openstreetmap.org https://*.tile.openstreetmap.org https://*.basemaps.cartocdn.com https://*.carto.com https://images.unsplash.com",
              "font-src 'self' data:",
              "frame-src 'self' https://*.clerk.accounts.dev https://clerk.accounts.dev https://*.clerk.dev https://challenges.cloudflare.com",
              "worker-src 'self' blob:",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
