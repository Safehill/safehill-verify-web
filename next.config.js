/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    turbo: false,
  },
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
    domains: [
      'lh3.googleusercontent.com',
      'picsum.photos',
      'localhost.localstack.cloud',
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
