const redirects = require("./redirects.json")

/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export",
  reactStrictMode: true,
  trailingSlash: true,
  staticPageGenerationTimeout: 120,

  images: {
    unoptimized: true,
    qualities: [60, 75],
  },
  experimental: {
    workerThreads: false,
    cpus: 2,
  },
  async redirects() {
    return redirects;
  },
 
};

module.exports = nextConfig;


