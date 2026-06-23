import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'slotcatalog.com' },
      { protocol: 'https', hostname: 'www.jiligames.com' },
      { protocol: 'https', hostname: 'mir-s3-cdn-cf.behance.net' },
      { protocol: 'https', hostname: 'allslotsonline.casino' },
      { protocol: 'https', hostname: 'wbgame.tadagaming.com' },
      { protocol: 'https', hostname: 'play-lh.googleusercontent.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'www.evolution.com' },
      { protocol: 'https', hostname: 'encrypted-tbn0.gstatic.com' },
      { protocol: 'https', hostname: '7cricinr.com' },
      { protocol: 'https', hostname: '3oaks.com' }
    ],
  },
};

export default nextConfig;
