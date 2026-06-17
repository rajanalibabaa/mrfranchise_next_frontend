// // app/sitemap-categories.xml/route.js

// const SITE_URL = "https://mrfranchise.in";
// const API_BASE =
//   process.env.NEXT_PUBLIC_API_URL ||
//   "https://mrfranchisebackend.mrfranchise.in";

// function slugify(text = "") {
//   return text
//     .toString()
//     .trim()
//     .toLowerCase()
//     .replace(/[^a-z0-9\s-]/g, "")
//     .replace(/\s+/g, "-")
//     .replace(/-+/g, "-");
// }

// // ─────────────────────────────────────────────
// // Fetch single page
// // ─────────────────────────────────────────────
// async function fetchBrandPage(page, limit = 100) {
//   try {
//     const url = `${API_BASE}/api/v1/overAllPlatformOnlyMainCategory?page=${page}&limit=${limit}`;

//     const res = await fetch(url, {
//       cache: "no-store",
//       headers: { "Content-Type": "application/json" },
//     });

//     if (!res.ok) return { brands: [], totalPages: 0 };

//     const json = await res.json();

//     let brands = [];
//     if (Array.isArray(json?.data)) brands = json.data;
//     else if (Array.isArray(json?.data?.brands)) brands = json.data.brands;
//     else if (Array.isArray(json?.data?.data)) brands = json.data.data;
//     else if (Array.isArray(json?.data?.results)) brands = json.data.results;
//     else if (Array.isArray(json?.brands)) brands = json.brands;
//     else if (Array.isArray(json?.results)) brands = json.results;

//     const total =
//       json?.total || json?.totalCount || json?.totalDocs ||
//       json?.count || json?.data?.total || json?.data?.totalCount || 0;

//     const totalPages =
//       json?.totalPages || json?.total_pages || json?.pages ||
//       json?.data?.totalPages || json?.data?.total_pages ||
//       json?.pagination?.totalPages ||
//       (total > 0 ? Math.ceil(total / limit) : 0);

//     return { brands, totalPages };
//   } catch (error) {
//     return { brands: [], totalPages: 0 };
//   }
// }

// // ─────────────────────────────────────────────
// // Fetch ALL brands
// // ─────────────────────────────────────────────
// async function fetchAllBrands() {
//   const allBrands = [];
//   const LIMIT = 100;

//   const firstPage = await fetchBrandPage(1, LIMIT);
//   if (firstPage.brands.length === 0) return [];

//   allBrands.push(...firstPage.brands);
//   const totalPages = firstPage.totalPages;

//   if (totalPages && totalPages > 1) {
//     const BATCH = 5;
//     for (let start = 2; start <= totalPages; start += BATCH) {
//       const end = Math.min(start + BATCH - 1, totalPages);
//       const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);
//       const results = await Promise.all(pages.map((p) => fetchBrandPage(p, LIMIT)));
//       for (const r of results) allBrands.push(...r.brands);
//     }
//   } else {
//     let page = 2;
//     while (page <= 500) {
//       const result = await fetchBrandPage(page, LIMIT);
//       if (result.brands.length === 0) break;
//       allBrands.push(...result.brands);
//       if (result.brands.length < LIMIT) break;
//       page++;
//     }
//   }

//   return allBrands;
// }

// // ─────────────────────────────────────────────
// // Build XML
// // ─────────────────────────────────────────────
// function buildXML(entries) {
//   const urls = entries
//     .map(
//       ({ loc, lastmod, changefreq, priority }) =>
//         `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
//     )
//     .join("\n");

//   return `<?xml version="1.0" encoding="UTF-8"?>
// <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
// ${urls}
// </urlset>`;
// }

// // ─────────────────────────────────────────────
// // GET → /sitemap-categories.xml
// // Extract unique main categories from all brands
// //
// // URL format:
// // /food-and-beverages-franchise-opportunities
// // /automobile-franchise-opportunities
// // /education-franchise-opportunities
// // ─────────────────────────────────────────────
// export async function GET() {
//   console.log("[CATEGORIES SITEMAP] ═══ Generating ═══");

//   const brands = await fetchAllBrands();

//   const seen = new Set();
//   const entries = [];
//   const now = new Date().toISOString();

//   for (const brand of brands) {
//     // ── get main category from brandCategories.main ──
//     const mainCategory = brand?.brandCategories?.main;

//     if (!mainCategory) continue;

//     const mainSlug = slugify(mainCategory);

//     if (!mainSlug || seen.has(mainSlug)) continue;
//     seen.add(mainSlug);

//     // ── URL format: /food-and-beverages-franchise-opportunities ──
//     entries.push({
//       loc: `${SITE_URL}/${mainSlug}-franchise-opportunities`,
//       lastmod: now,
//       changefreq: "weekly",
//       priority: "0.9",
//     });
//   }

//   // ── Sort alphabetically ──
//   entries.sort((a, b) => a.loc.localeCompare(b.loc));

//   console.log(`[CATEGORIES SITEMAP] ✅ Main categories found: ${entries.length}`);
//   console.log("[CATEGORIES SITEMAP] Sample URLs:");
//   entries.slice(0, 10).forEach((e) => console.log("  →", e.loc));

//   return new Response(buildXML(entries), {
//     status: 200,
//     headers: {
//       "Content-Type": "application/xml; charset=utf-8",
//       "Cache-Control": "public, max-age=3600, s-maxage=86400",
//     },
//   });
// }