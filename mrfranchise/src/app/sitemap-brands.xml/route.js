// app/sitemap-brands.xml/route.js

const SITE_URL = "https://mrfranchise.in";
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://mrfranchisebackend.mrfranchise.in";


  export const revalidate = 86400;

  
// ─────────────────────────────────────────────
// slugify
// ─────────────────────────────────────────────
function slugify(text = "") {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// ─────────────────────────────────────────────
// Extract brand name from ANY possible structure
// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
// Extract brand name
// ─────────────────────────────────────────────
function extractBrandName(brand) {
  if (!brand) return null;


  const name =
    brand?.brandname ||        // YOUR API FIELD
    brand?.brandName ||
    brand?.name ||
    brand?.companyName ||
    brand?.title ||
    brand?.slug ||
    null;





  return name.toString().trim();
}

// ─────────────────────────────────────────────
// Build slug from brand
// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
// Build slug
// ─────────────────────────────────────────────
function buildBrandSlug(brand) {

  const name = extractBrandName(brand);

  if (!name) return null;


  const slugName =
    brand?.slug
      ? slugify(brand.slug)
      : slugify(name);


  if (!slugName) return null;


  return {
    name,

    slug:
    `${slugName}`
  };

}

// ─────────────────────────────────────────────
// Fetch single page
// ─────────────────────────────────────────────
async function fetchBrandPage(page, limit = 100) {
  try {
    const url = `${API_BASE}/api/v1/overAllPlatformOnlyMainCategory?page=${page}&limit=${limit}`;

   const res = await fetch(url, {

  next:{
    revalidate:86400
  },

  headers:{
    "Content-Type":"application/json"
  }

});

    if (!res.ok) {
      return { brands: [], totalPages: 0, total: 0 };
    }

    const json = await res.json();

   

    // ── Extract brands ──
    let brands = [];

    if (Array.isArray(json?.data)) {
      brands = json.data;
    } else if (Array.isArray(json?.data?.brands)) {
      brands = json.data.brands;
    } else if (Array.isArray(json?.data?.data)) {
      brands = json.data.data;
    } else if (Array.isArray(json?.data?.results)) {
      brands = json.data.results;
    } else if (Array.isArray(json?.data?.list)) {
      brands = json.data.list;
    } else if (Array.isArray(json?.data?.items)) {
      brands = json.data.items;
    } else if (Array.isArray(json?.brands)) {
      brands = json.brands;
    } else if (Array.isArray(json?.results)) {
      brands = json.results;
    } else if (Array.isArray(json?.items)) {
      brands = json.items;
    } else if (Array.isArray(json?.list)) {
      brands = json.list;
    }

    // ── Extract pagination ──
    const total =
      json?.total ||
      json?.totalCount ||
      json?.totalDocs ||
      json?.count ||
      json?.data?.total ||
      json?.data?.totalCount ||
      json?.data?.totalDocs ||
      json?.pagination?.total ||
      json?.meta?.total ||
      0;

    const totalPages =
      json?.totalPages ||
      json?.total_pages ||
      json?.pages ||
      json?.pageCount ||
      json?.data?.totalPages ||
      json?.data?.total_pages ||
      json?.data?.pages ||
      json?.pagination?.totalPages ||
      json?.pagination?.pages ||
      json?.meta?.totalPages ||
      json?.meta?.pages ||
      (total > 0 ? Math.ceil(total / limit) : 0);

   

    return { brands, totalPages, total };
  } catch (error) {
    return { brands: [], totalPages: 0, total: 0 };
  }
}

// ─────────────────────────────────────────────
// Fetch ALL brands with pagination
// ─────────────────────────────────────────────
async function fetchAllBrands() {
  const allBrands = [];
  const LIMIT = 100;


  // Page 1
  const firstPage = await fetchBrandPage(1, LIMIT);

  if (firstPage.brands.length === 0) {
    return [];
  }

  allBrands.push(...firstPage.brands);
  const totalPages = firstPage.totalPages;


  if (totalPages && totalPages > 1) {
    // ── Fetch in batches of 5 ──
    const BATCH_SIZE = 5;

    for (let batchStart = 2; batchStart <= totalPages; batchStart += BATCH_SIZE) {
      const batchEnd = Math.min(batchStart + BATCH_SIZE - 1, totalPages);
      const pageNums = Array.from(
        { length: batchEnd - batchStart + 1 },
        (_, i) => batchStart + i
      );


      const results = await Promise.all(
        pageNums.map((p) => fetchBrandPage(p, LIMIT))
      );

      for (const r of results) {
        allBrands.push(...r.brands);
      }

    }
  } else {
    // ── Fallback loop ──

    let page = 2;
    while (page <= 500) {
      const result = await fetchBrandPage(page, LIMIT);

      if (result.brands.length === 0) {
        break;
      }

      allBrands.push(...result.brands);

      if (result.brands.length < LIMIT) {
        break;
      }

      page++;
    }
  }

  return allBrands;
}

// ─────────────────────────────────────────────
// Build XML
// ─────────────────────────────────────────────
function buildXML(entries) {
  const urls = entries
    .map(
      ({ loc, lastmod, changefreq, priority }) =>
        `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls}
</urlset>`;
}

// ─────────────────────────────────────────────
// GET handler
// ─────────────────────────────────────────────
export async function GET() {


  const brands = await fetchAllBrands();

 

  const seen = new Set();
  const entries = [];
const now = new Date()
.toISOString()
.split("T")[0];
  let skippedNoName = 0;
  let skippedDuplicate = 0;

  for (const brand of brands) {
    const result = buildBrandSlug(brand);

    if (!result) {
      skippedNoName++;
      continue;
    }

    const { name, slug } = result;

    if (seen.has(slug)) {
      skippedDuplicate++;
      continue;
    }

    seen.add(slug);

    entries.push({
      loc: `${SITE_URL}/franchise-business-opportunity/${slug}`,
      lastmod: now,
      changefreq: "weekly",
      priority: "0.8",
    });
  }

 
  // ── Sample URLs generated ──
  entries.slice(0, 5).forEach((e) => console.log(" →", e.loc));

  if (entries.length === 0) {

    // Return empty but valid XML
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`,
      {
        status: 200,
        headers: { "Content-Type": "application/xml; charset=utf-8" },
      }
    );
  }

  const xml = buildXML(entries);

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
    },
  });
}