import BrandClient from "./BrandClient";

const SITE_URL = "https://mrfranchise.in";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://mrfranchisebackend.mrfranchise.in";

function slugify(text = "") {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timer);
    return res;
  } catch {
    clearTimeout(timer);
    return null;
  }
}

async function fetchAllBrands() {
  const allBrands = [];
  let page = 1;

  // ✅ Fetch page 1 first to understand structure
  const firstRes = await fetchWithTimeout(
    `${API_BASE}/api/v1/overAllPlatformOnlyMainCategory?page=1&limit=50`,
    { cache: "no-store" }
  );

  if (!firstRes || !firstRes.ok) {
    console.log("❌ First page fetch failed");
    return [];
  }

  const firstJson = await firstRes.json();

  // ✅ Log exact structure to understand pagination
  console.log("📊 API Response Keys:", Object.keys(firstJson));
  console.log("📊 Data type:", typeof firstJson?.data);
  console.log(
    "📊 Pagination info:",
    JSON.stringify(
      firstJson?.pagination ||
        firstJson?.data?.pagination ||
        firstJson?.meta ||
        firstJson?.data?.meta ||
        "NOT FOUND",
      null,
      2
    )
  );

  // ✅ Extract brands from first page
  const firstData = firstJson?.data ?? {};
  const firstBrands = Array.isArray(firstData)
    ? firstData
    : firstData?.brands ||
      firstData?.data ||
      firstData?.results ||
      firstData?.items ||
      [];

  console.log(`📄 Page 1 → ${firstBrands.length} brands`);

  if (firstBrands.length === 0) {
    console.log("❌ No brands found in response");
    console.log("Full response:", JSON.stringify(firstJson, null, 2));
    return [];
  }

  allBrands.push(...firstBrands);

  // ✅ Determine total pages from first response
  const pagination =
    firstJson?.pagination ||
    firstJson?.data?.pagination ||
    firstJson?.meta ||
    firstJson?.data?.meta ||
    {};

  console.log("📊 Pagination object:", pagination);

  // ✅ Get total pages using all possible keys
  const totalPages =
    pagination?.totalPages ||
    pagination?.total_pages ||
    pagination?.pageCount ||
    pagination?.lastPage ||
    null;

  const totalItems =
    pagination?.total ||
    pagination?.totalItems ||
    pagination?.totalCount ||
    pagination?.count ||
    null;

  console.log(`📊 Total pages: ${totalPages}`);
  console.log(`📊 Total items: ${totalItems}`);

  // ✅ Calculate max pages from totalItems if totalPages missing
  let maxPages = totalPages;
  if (!maxPages && totalItems) {
    maxPages = Math.ceil(totalItems / 50);
  }

  // ✅ If still no pagination info - use brands length to decide
  if (!maxPages) {
    console.log(
      "⚠️ No pagination info found - will stop when empty page returned"
    );
  }

  // ✅ Fetch remaining pages
  page = 2;

  while (true) {
    // Stop if we know total pages
    if (maxPages && page > maxPages) {
      console.log(`✅ Reached last page (${maxPages}). Stopping.`);
      break;
    }

    // Safety limit - never fetch more than 200 pages
    if (page > 200) {
      console.log("🛑 Safety limit reached (200 pages). Stopping.");
      break;
    }

    const res = await fetchWithTimeout(
      `${API_BASE}/api/v1/overAllPlatformOnlyMainCategory?page=${page}&limit=50`,
      { cache: "no-store" }
    );

    if (!res || !res.ok) {
      console.log(`⚠️ Page ${page} failed. Stopping.`);
      break;
    }

    const json = await res.json();
    const data = json?.data ?? {};
    const brands = Array.isArray(data)
      ? data
      : data?.brands ||
        data?.data ||
        data?.results ||
        data?.items ||
        [];

    // ✅ Stop if empty page returned
    if (!brands || brands.length === 0) {
      console.log(`📭 Page ${page} is empty. Stopping.`);
      break;
    }

    allBrands.push(...brands);
    console.log(
      `📄 Page ${page}/${maxPages || "?"} → ${brands.length} brands | Total: ${allBrands.length}`
    );

    // ✅ Stop if returned less than limit (last page)
    if (brands.length < 50) {
      console.log(`✅ Last page detected (${brands.length} < 50). Stopping.`);
      break;
    }

    page++;
    await new Promise((r) => setTimeout(r, 100));
  }

  return allBrands;
}

async function fetchBrandDetail(brandSlug) {
  try {
    const res = await fetchWithTimeout(
      `${API_BASE}/api/v1/brandlisting/getBrandListingSlug/${brandSlug}`,
      { cache: "no-store" },
      8000
    );
    if (!res || !res.ok) return null;
    const json = await res.json();
    return Array.isArray(json?.data) ? json.data[0] : json.data;
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  try {
    console.log("\n🚀 Starting generateStaticParams...\n");

    // ── Step 1: Get all brands ─────────────────────────────────────────
    const allBrands = await fetchAllBrands();
    console.log(`\n✅ Total brands collected: ${allBrands.length}\n`);

    if (allBrands.length === 0) {
      console.log("❌ No brands found. Returning empty array.");
      return [];
    }

    const allSlugs = [];
    const seen = new Set();

    const addSlug = (slug) => {
      if (!slug || seen.has(slug)) return;
      seen.add(slug);
      allSlugs.push({ slug });
    };

    // ── Step 2: Fetch ALL brand details in PARALLEL (batches of 15) ─────
    console.log("📡 Fetching brand details in parallel batches...");
    const BATCH_SIZE = 15;
    const brandDetailsMap = new Map();

    for (let i = 0; i < allBrands.length; i += BATCH_SIZE) {
      const batch = allBrands.slice(i, i + BATCH_SIZE);
      const promises = batch.map(async (brand) => {
        const brandSlug =
          brand?.slug ||
          slugify(
            brand?.brandDetails?.brandName ||
              brand?.brandDetails?.companyName ||
              ""
          );
        if (!brandSlug) return null;
        const detail = await fetchBrandDetail(brandSlug);
        return { brandSlug, detail };
      });

      const results = await Promise.allSettled(promises);
      results.forEach((result) => {
        if (result.status === "fulfilled" && result.value) {
          brandDetailsMap.set(result.value.brandSlug, result.value.detail);
        }
      });

      const progress = Math.min(i + BATCH_SIZE, allBrands.length);
      console.log(`📊 Fetched ${progress}/${allBrands.length} details`);
    }

    // ── Step 3: Process brands (now with cached details) ───────────────
    console.log("🔄 Processing brands and generating slugs...");
    let processedCount = 0;

    for (let i = 0; i < allBrands.length; i++) {
      const brand = allBrands[i];

      const brandSlug =
        brand?.slug ||
        slugify(
          brand?.brandDetails?.brandName ||
            brand?.brandDetails?.companyName ||
            ""
        );

      if (!brandSlug) {
        continue;
      }

      // Always add normal brand URL
      addSlug(brandSlug);

      // Get cached detail (no new network request)
      const brandDetail = brandDetailsMap.get(brandSlug);

      if (!brandDetail) {
        continue;
      }

      const brandName =
        brandDetail?.brandDetails?.brandName ||
        brandDetail?.brandDetails?.companyName ||
        brandSlug;

      const locations =
        brandDetail?.brandexpansionlocationdatas?.expansionLocations?.domestic
          ?.locations || [];

      let locationCount = 0;

      locations.forEach((location) => {
        const state = location?.state;
        if (!state) return;

        (location?.districts || []).forEach((districtObj) => {
          const district = districtObj?.district;
          if (!district) return;

          const locationSlug =
            `start-your-${slugify(brandName)}` +
            `-franchise-business-opportunity-in-` +
            `${slugify(district)}-${slugify(state)}` +
            `_${slugify(brandName)}`;

          addSlug(locationSlug);
          locationCount++;
        });
      });

      processedCount++;
      if (processedCount % 100 === 0) {
        console.log(
          `✅ Processed ${processedCount}/${allBrands.length} | Total slugs: ${allSlugs.length}`
        );
      }
    }

    console.log(`\n🎯 DONE! Final total slugs: ${allSlugs.length}\n`);
    return allSlugs;
  } catch (error) {
    console.error("❌ generateStaticParams crashed:", error);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const fullPath = decodeURIComponent(slug);

  let brandNameForApi = fullPath;
  if (fullPath.includes("_")) {
    brandNameForApi = fullPath.split("_").pop();
  }

  const res = await fetchWithTimeout(
    `${API_BASE}/api/v1/brandlisting/getBrandListingSlug/${brandNameForApi}`,
    { next: { revalidate: 3600 } }
  );

  const json = res ? await res.json() : null;
  const brand = Array.isArray(json?.data) ? json.data[0] : json?.data;

  if (!brand) {
    return {
      title: "Brand Not Found | Mr Franchise",
      description: "This franchise brand does not exist.",
      robots: { index: false, follow: false },
    };
  }

  let locationText = "";
  if (fullPath.includes("_")) {
    const slugPart = fullPath.split("_")[0];
    const inIndex = slugPart.indexOf("-in-");
    if (inIndex !== -1) {
      locationText = slugPart
        .substring(inIndex + 4)
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
    }
  }

  const name =
    brand?.brandDetails?.brandName ||
    brand?.brandDetails?.companyName ||
    slug;

  const logo = brand?.uploads?.logo || "/default.jpg";

  const title = locationText
    ? `Start your ${name} Franchise in ${locationText} | Mr Franchise`
    : `Start your ${name} franchise in India | Mr Franchise`;

  const description = locationText
    ? `Start your ${name} franchise in ${locationText}. Get complete details like investment cost, profit margin, ROI, franchise fee & requirements. Apply now!`
    : `Start your ${name} franchise in India. Get complete details like investment cost, profit margin, ROI, franchise fee & requirements. Apply now!`;

  const url = `${SITE_URL}/franchise-brands/${slug}`;

  return {
    title,
    description,
    keywords: [
      `${name} franchise`,
      `${name} franchise cost`,
      `${name} franchise in India`,
      locationText ? `${name} franchise in ${locationText}` : "",
      "best franchise in India",
      "low investment franchise",
    ]
      .filter(Boolean)
      .join(", "),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Mr Franchise",
      images: [
        { url: logo, width: 1200, height: 630, alt: `${name} Franchise` },
      ],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [logo],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function Page({ params }) {
  const resolvedParams = await params;
  return <BrandClient slug={resolvedParams.slug} />;
}