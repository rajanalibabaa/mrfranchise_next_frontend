/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    domains: ['mrfranchise.in'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mrfranchise.in',
        pathname: '/**',
      },
    ],
  },

  webpack: (config) => {
    config.module.rules.push({
      test: /\.(avif|jpeg|jpg|png|webp|gif|svg)$/i,
      type: 'asset/resource',
    });
    return config;
  },
};

export default nextConfig;
