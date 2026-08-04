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
    return [
      {
        source: "/franchise-business-opportunity/:slug",
        destination: "/brands/:slug",
        permanent: true, // 301 redirect
      },
      {
        source: "/franchise-brands/:slug",
        destination: "/brands/:slug",
        permanent: true, // 301 redirect
      },
      {
        source:
          "/:main((?!.*\\.).*)-franchise-opportunities/:sub((?!.*\\.).*)-franchise-opportunities",
        destination: "/:main/:sub",
        permanent: true,
      },
      {
        source: "/:slug((?!.*\\.).*)-franchise-opportunities",
        destination: "/:slug",
        permanent: true,
      },
    ];
  }
 
};

module.exports = nextConfig;


