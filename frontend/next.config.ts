import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      loaders: {},
    },
  },
  eslint: {
    dirs: ['src'],
  },
  async rewrites() {
    return [
      {
  source: '/api/:path*',
  destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;