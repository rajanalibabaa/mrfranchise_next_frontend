


   import ClientPage from "./ClientPage";

   export const dynamic = "force-static";
   export const revalidate = 86400; // 1 day
const API =
  "https://mrfranchisebackend.mrfranchise.in/api/v1/filter/getAllBrandsAndFilter";



/* ===============================
   🔧 SLUG HELPERS
   =============================== */
function slugifyCategory(cat) {
  return cat
    ?.toLowerCase()
    .replace(/&/g, "and")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-") // remove duplicate -
    .trim() + "-franchise-opportunities";
}

function deslugifyCategory(slug) {
  return slug
    ?.replace("-franchise-opportunities", "")
    .replace(/-/g, " ")
    .replace(/\band\b/g, "&")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}


async function getAllBrands() {
  let page = 1;
  let allBrands = [];

  while (true) {
    const res = await fetch(`${API}?page=${page}`, {
     next: { revalidate: 86400 }
    });

    const json = await res.json();

    const brands = json?.data?.brands || [];
    const pagination = json?.data?.pagination;

    allBrands.push(...brands);

    // console.log(`✅ Page ${page}: ${brands.length}`);

    if (!pagination?.hasNext) break;

    page++;
  }

  // console.log("🔥 TOTAL BRANDS:", allBrands.length);

  return allBrands;
}

/* ===============================
   🔥 FETCH CATEGORY DATA
   =============================== */
async function getCategoryBrands(category) {
  let page = 1;
  let all = [];

  while (true) {
    const res = await fetch(
      `${API}?maincat=${encodeURIComponent(category)}&page=${page}`,
      { next: { revalidate: 86400 } }
    );

    const json = await res.json();

    const brands = json?.data?.brands || [];
    const pagination = json?.data?.pagination;

    all.push(...brands);


    if (!pagination?.hasNext) break;

    page++;
  }

  // console.log(`🔥 TOTAL ${category}:`, all.length);

  return all;
}

/* ===============================
   🔥 GENERATE STATIC PAGES
   =============================== */
export async function generateStaticParams() {
  const brands = await getAllBrands();

  const set = new Set();

  brands.forEach((b) => {
    const cat = b?.brandCategories?.main;
    if (cat) set.add(cat);
  });

  const categories = Array.from(set);

  return categories.map((cat) => ({
    slug: slugifyCategory(cat),
  }));
}

/* ===============================
   🔥 SEO METADATA
   =============================== */
export async function generateMetadata({ params }) {
 const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const categoryName = deslugifyCategory(slug);
  
 const url = `https://mrfranchise.in/${slug}`;
  return {
    title: `${categoryName || "Top"} - Franchise Opportunities in India 2026`,
    description: `Explore ${categoryName || "Top"} franchise opportunities with investment, ROI, and profit details.`,
    alternates: {
      canonical: url, // ✅ VERY IMPORTANT
    },
     openGraph: {
      title: `${categoryName || "Top  "} Franchise Opportunities`,
      description: `Find best ${categoryName || "Top  "} franchises in India.`,
      url: url,
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
  const slug = resolvedParams.slug;

  // 🔥 Convert slug → real category name
  const categoryName = deslugifyCategory(slug);

  // console.log("🔥 CURRENT CATEGORY:", categoryName );

  const brands = await getCategoryBrands(categoryName);

  return (
    <ClientPage
      slug={slug}
      brands={brands}
      maincat={categoryName}
    />
  );
} 