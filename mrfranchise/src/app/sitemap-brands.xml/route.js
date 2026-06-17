// app/sitemap-brands.xml/route.js

const SITE_URL = "https://mrfranchise.in";
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://mrfranchisebackend.mrfranchise.in";

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


  if (!name) {
    console.log(
      "[SITEMAP] Missing brand name:",
      JSON.stringify(brand)
    );
  }


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
    console.log(`[SITEMAP] Fetching page ${page} → ${url}`);

    const res = await fetch(url, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      console.log(`[SITEMAP] Page ${page} failed → HTTP ${res.status}`);
      return { brands: [], totalPages: 0, total: 0 };
    }

    const json = await res.json();

    // ── Full debug on page 1 ──
    if (page === 1) {
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("[SITEMAP] TOP LEVEL KEYS:", Object.keys(json));
      console.log("[SITEMAP] json.data type:", typeof json?.data);
      console.log("[SITEMAP] json.data isArray:", Array.isArray(json?.data));

      if (!Array.isArray(json?.data) && json?.data) {
        console.log("[SITEMAP] json.data keys:", Object.keys(json.data));
      }

      console.log("[SITEMAP] json.total:", json?.total);
      console.log("[SITEMAP] json.totalPages:", json?.totalPages);
      console.log("[SITEMAP] json.count:", json?.count);
      console.log("[SITEMAP] json.pages:", json?.pages);

      // Print first raw brand item
      const sampleBrands = Array.isArray(json?.data)
        ? json.data
        : json?.data?.brands ||
          json?.data?.data ||
          json?.data?.results ||
          json?.data?.list ||
          json?.brands ||
          json?.results ||
          [];

      console.log("[SITEMAP] FIRST BRAND OBJECT:");
      console.log(JSON.stringify(sampleBrands?.[0], null, 2));
      console.log("[SITEMAP] SECOND BRAND OBJECT:");
      console.log(JSON.stringify(sampleBrands?.[1], null, 2));
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    }

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

    console.log(
      `[SITEMAP] Page ${page} → brands found: ${brands.length} | total: ${total} | totalPages: ${totalPages}`
    );

    return { brands, totalPages, total };
  } catch (error) {
    console.log(`[SITEMAP] Page ${page} error:`, error.message);
    return { brands: [], totalPages: 0, total: 0 };
  }
}

// ─────────────────────────────────────────────
// Fetch ALL brands with pagination
// ─────────────────────────────────────────────
async function fetchAllBrands() {
  const allBrands = [];
  const LIMIT = 100;

  console.log("[SITEMAP] ═══ Starting full brand fetch ═══");

  // Page 1
  const firstPage = await fetchBrandPage(1, LIMIT);

  if (firstPage.brands.length === 0) {
    console.log("[SITEMAP] ❌ Page 1 returned 0 brands - check API");
    return [];
  }

  allBrands.push(...firstPage.brands);
  const totalPages = firstPage.totalPages;

  console.log(`[SITEMAP] Page 1 ✓ | brands: ${firstPage.brands.length} | totalPages: ${totalPages}`);

  if (totalPages && totalPages > 1) {
    // ── Fetch in batches of 5 ──
    const BATCH_SIZE = 5;

    for (let batchStart = 2; batchStart <= totalPages; batchStart += BATCH_SIZE) {
      const batchEnd = Math.min(batchStart + BATCH_SIZE - 1, totalPages);
      const pageNums = Array.from(
        { length: batchEnd - batchStart + 1 },
        (_, i) => batchStart + i
      );

      console.log(`[SITEMAP] Batch → pages [${pageNums.join(", ")}]`);

      const results = await Promise.all(
        pageNums.map((p) => fetchBrandPage(p, LIMIT))
      );

      for (const r of results) {
        allBrands.push(...r.brands);
      }

      console.log(`[SITEMAP] After batch → total so far: ${allBrands.length}`);
    }
  } else {
    // ── Fallback loop ──
    console.log("[SITEMAP] No totalPages → fallback loop");

    let page = 2;
    while (page <= 500) {
      const result = await fetchBrandPage(page, LIMIT);

      if (result.brands.length === 0) {
        console.log(`[SITEMAP] Empty page ${page} → stop`);
        break;
      }

      allBrands.push(...result.brands);

      if (result.brands.length < LIMIT) {
        console.log(`[SITEMAP] Last page at ${page}`);
        break;
      }

      page++;
    }
  }

  console.log(`[SITEMAP] ═══ Total brands fetched: ${allBrands.length} ═══`);
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
  console.log("[SITEMAP] ═══════════════════════════════════");
  console.log("[SITEMAP] Brands Sitemap Generation Started");
  console.log("[SITEMAP] ═══════════════════════════════════");

  const brands = await fetchAllBrands();

  // ── Debug first 3 brand objects ──
  console.log("[SITEMAP] ── Sample brand objects ──");
  brands.slice(0, 3).forEach((b, i) => {
    console.log(`[SITEMAP] Brand[${i}]:`, JSON.stringify(b, null, 2));
  });

  const seen = new Set();
  const entries = [];
  const now = new Date().toISOString();
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
      loc: `${SITE_URL}/franchise-opportunity/${slug}`,
      lastmod: now,
      changefreq: "weekly",
      priority: "0.8",
    });
  }

  console.log("[SITEMAP] ── Results ──");
  console.log(`[SITEMAP] Total brands:      ${brands.length}`);
  console.log(`[SITEMAP] URLs generated:    ${entries.length}`);
  console.log(`[SITEMAP] Skipped no name:   ${skippedNoName}`);
  console.log(`[SITEMAP] Skipped duplicate: ${skippedDuplicate}`);

  // ── Sample URLs generated ──
  console.log("[SITEMAP] First 5 URLs:");
  entries.slice(0, 5).forEach((e) => console.log(" →", e.loc));

  if (entries.length === 0) {
    console.log("[SITEMAP] ❌ CRITICAL: 0 URLs - brand object keys are unknown");
    console.log("[SITEMAP] ❌ Check brand[0] log above to find the name field");

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