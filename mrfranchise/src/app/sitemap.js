// app/sitemap.js

const SITE_URL = "https://mrfranchise.in";

export default function sitemap() {
  const now = new Date().toISOString();

  return [
    // ─── Priority 1.0 ───────────────────────────
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },

    // ─── Priority 0.9 ───────────────────────────
    {
      url: `${SITE_URL}/all-franchise-brands`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/expandyourbrand`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/investfranchise`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    

    // ─── Priority 0.8 ───────────────────────────
    {
      url: `${SITE_URL}/advertisewithus`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/invester_register`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },

    // ─── Priority 0.7 ───────────────────────────
    {
      url: `${SITE_URL}/aboutpage`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contactus`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/faq`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/help`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/termsandconditions`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}