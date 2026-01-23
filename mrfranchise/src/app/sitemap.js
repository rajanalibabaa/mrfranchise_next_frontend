// app/sitemap.js
const BASE_URL = "https://fb.mrfranchise.in";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default async function sitemap() {
  // Static pages
  const staticPages = [
    { path: "", priority: 1.0, changeFrequency: "daily" },
    { path: "/AllCategoryPage/allbrandlisting", priority: 0.9, changeFrequency: "daily" },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
    { path: "/registerhandleuser", priority: 0.6, changeFrequency: "monthly" },
    { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/terms-conditions", priority: 0.3, changeFrequency: "yearly" },
  ].map(({ path, priority, changeFrequency }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date().toISOString(),
    changeFrequency,
    priority,
  }));

  // Category pages
  const categories = [
    "Food & Beverage",
    "Retail",
    "Education",
    "Health & Fitness",
    "Beauty & Wellness",
    "Automotive",
    "Real Estate",
    "Technology",
  ];

  const categoryPages = categories.map((cat) => ({
    url: `${BASE_URL}/AllCategoryPage/allbrandlisting?maincat=${encodeURIComponent(cat)}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Dynamic brand pages
  let brandPages = [];
  try {
    const res = await fetch(`${API_BASE}/api/v1/brandlisting/all-brands-sitemap`, {
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const data = await res.json();
      brandPages =
        data.brands?.map((brand) => {
          const slug = brand.brandName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

          return {
            url: `${BASE_URL}/brand/${slug}`,
            lastModified: brand.updatedAt || new Date().toISOString(),
            changeFrequency: "weekly",
            priority: 0.7,
            // Additional sitemap extensions (optional)
            images: brand.brandLogo
              ? [
                  {
                    url: brand.brandLogo,
                    title: `${brand.brandName} Logo`,
                    caption: `${brand.brandName} Franchise Opportunity`,
                  },
                ]
              : [],
          };
        }) || [];
    }
  } catch (error) {
    console.error("Sitemap brand fetch error:", error);
  }

  return [...staticPages, ...categoryPages, ...brandPages];
}