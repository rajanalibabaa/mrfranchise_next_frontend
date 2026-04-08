/** @type {import('next-sitemap').IConfig} */

module.exports = {
  siteUrl: "https://mrfranchise.in", // 🔴 CHANGE THIS
  generateRobotsTxt: true,

  changefreq: "daily",
  priority: 0.7,

  sitemapSize: 5000,

  // Exclude unwanted pages
  exclude: [
    "/brandDashboard/*",
    "/investordashboard/*",
    "/registerhandleuser",
  ],
};