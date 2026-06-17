// app/robots.js

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/brandDashboard/",
          "/investordashboard/",
          "/brand_listing_creation_form",
          "/registerhandleuser",
          "/payment",
          "/payment-success",
          "/manifest.json",
        ],
      },
    ],
    sitemap: [
      "https://mrfranchise.in/sitemap.xml",
      "https://mrfranchise.in/sitemap-brands.xml",
    //   "https://mrfranchise.in/sitemap-industry.xml",
    //   "https://mrfranchise.in/sitemap-categories.xml"
    ],
  };
}