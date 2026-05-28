import ClientPage from "./ClientPage";

export const dynamic = "force-static";
export const revalidate = 86400;

const API =
  "http://localhost:5000/api/v1/filter/getAllBrandsAndFilter";

/* ===============================
   🔧 SLUG HELPERS - MAIN
   =============================== */
function slugifyCategory(cat) {
  return (
    cat
      ?.toLowerCase()
      .replace(/&/g, "and")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .trim() + "-franchise-opportunities"
  );
}

function deslugifyCategory(slug) {
  return slug
    ?.replace("-franchise-opportunities", "")
    .replace(/-/g, " ")
    .replace(/\band\b/g, "&")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/* ===============================
   🔧 SLUG HELPERS - SUB
   =============================== */
function slugifySubCategory(sub) {
  return (
    sub
      ?.toLowerCase()
      .replace(/&/g, "and")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .trim() + "-franchise"
  );
}

function deslugifySubCategory(slug) {
  return slug
    ?.replace(/-franchise$/, "")
    .replace(/-/g, " ")
    .replace(/\band\b/g, "&")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/* ===============================
   🔧 FETCH ALL BRANDS (PAGINATION)
   =============================== */
async function getAllBrands() {
  let page = 1;
  let allBrands = [];

  while (true) {
    const res = await fetch(`${API}?page=${page}`, {
      next: { revalidate: 86400 },
    });

    const json = await res.json();
    const brands = json?.data?.brands || [];
    const pagination = json?.data?.pagination;

    allBrands.push(...brands);

    console.log(`✅ Page ${page}: ${brands.length}`);

    if (!pagination?.hasNext) break;
    page++;
  }

  console.log("🔥 TOTAL BRANDS:", allBrands.length);
  return allBrands;
}

/* ===============================
   🔧 FETCH BRANDS BY MAIN + SUB
   =============================== */
async function getCategoryBrands(category, subcategory) {
  let page = 1;
  let all = [];

  while (true) {
    // ─── if subcategory exists → filter by both ───
    const url = subcategory
      ? `${API}?maincat=${encodeURIComponent(
          category
        )}&subcat=${encodeURIComponent(subcategory)}&page=${page}`
      : `${API}?maincat=${encodeURIComponent(category)}&page=${page}`;

    const res = await fetch(url, { next: { revalidate: 86400 } });

    const json = await res.json();
    const brands = json?.data?.brands || [];
    const pagination = json?.data?.pagination;

    all.push(...brands);

    if (!pagination?.hasNext) break;
    page++;
  }

  console.log(`🔥 TOTAL ${category} / ${subcategory ?? "ALL"}:`, all.length);
  return all;
}

/* ===============================
   🔥 GENERATE STATIC PARAMS
   MAIN + SUB BOTH IN THIS FILE
   =============================== */
export async function generateStaticParams() {
  const brands = await getAllBrands();

  // ─── STEP 1: MAIN CATEGORY PARAMS ───
  const mainSet = new Set();

  brands.forEach((b) => {
    const main = b?.brandCategories?.main;
    if (main) mainSet.add(main);
  });

  const mainParams = Array.from(mainSet).map((cat) => ({
    slug: slugifyCategory(cat),
  }));

  console.log("🔥 MAIN PARAMS COUNT:", mainParams.length);

  // ─── STEP 2: SUB CATEGORY PARAMS ───
  // Use "main||sub" key to avoid duplicates
  const subSet = new Set();

  brands.forEach((b) => {
    const main = b?.brandCategories?.main;
    const subs = b?.brandCategories?.sub;

    if (!main) return;

    // sub can be array or single string — handle both
    const subList = Array.isArray(subs) ? subs : subs ? [subs] : [];

    subList.forEach((sub) => {
      if (sub) subSet.add(`${main}||${sub}`);
    });
  });

  const subParams = Array.from(subSet).map((key) => {
    const [main, sub] = key.split("||");
    return {
      slug: slugifyCategory(main),       // same main slug
      subslug: slugifySubCategory(sub),  // extra sub slug
    };
  });

  console.log("🔥 SUB PARAMS COUNT:", subParams.length);

  // ─── STEP 3: MERGE BOTH ───
  const allParams = [...mainParams, ...subParams];

  console.log("🔥 TOTAL STATIC PARAMS:", allParams.length);

  return allParams;
}

/* ===============================
   🔥 SEO METADATA
   =============================== */
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { slug, subslug } = resolvedParams;

  const mainName = deslugifyCategory(slug);
  const subName = subslug ? deslugifySubCategory(subslug) : null;

  const url = subslug
    ? `https://mrfranchise.in/${slug}/${subslug}`
    : `https://mrfranchise.in/${slug}`;

  const title = subName
    ? `${subName} Franchise Opportunities in India 2026 | ${mainName}`
    : `${mainName} Franchise Opportunities in India 2026`;

  const description = subName
    ? `Explore top ${subName} franchise opportunities under ${mainName} with investment, ROI, and profit details.`
    : `Discover best ${mainName} franchise opportunities with investment, ROI, and profit details.`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Mr Franchise",
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

/* ===============================
   🔥 MAIN PAGE
   =============================== */
export default async function Page({ params }) {
  const resolvedParams = await params;
  const { slug, subslug } = resolvedParams;

  // 🔥 Convert slug → real names
  const mainName = deslugifyCategory(slug);
  const subName = subslug ? deslugifySubCategory(subslug) : null;

  console.log("🔥 MAIN:", mainName, "| SUB:", subName ?? "NONE");

  // 🔥 Fetch brands — pass sub only if exists
  const brands = await getCategoryBrands(mainName, subName);

  return (
    <ClientPage
      slug={slug}
      subslug={subslug ?? null}
      brands={brands}
      maincat={mainName}
      subcat={subName}
    />
  );
}