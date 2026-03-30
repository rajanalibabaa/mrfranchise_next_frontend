/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export",
  reactStrictMode: true,
  trailingSlash: true,

  images: {
    unoptimized: true,
  },
  experimental: {
    workerThreads: false,
    cpus: 2,
    turbo:false
  },
};

module.exports = nextConfig;
