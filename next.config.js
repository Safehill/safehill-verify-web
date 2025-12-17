/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Explicitly acknowledge Turbopack to avoid Next 16 build errors
  turbopack: {},

  // Keep webpack config for browser-side Node fallbacks
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'http',
        hostname: 'localhost.localstack.cloud',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/github',
        destination: 'https://github.com/safehill/',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
