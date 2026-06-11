/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export",
  reactStrictMode: true,
  trailingSlash: true,
  staticPageGenerationTimeout: 1200,

  images: {
    unoptimized: true,
    qualities: [60, 75],
  },
  experimental: {
    workerThreads: false,
    cpus: 2,
  },
};

module.exports = nextConfig;
